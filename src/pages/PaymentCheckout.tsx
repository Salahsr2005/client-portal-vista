
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Check, Upload, FileUp } from "lucide-react";
import { uploadPaymentReceipt } from "@/utils/databaseHelpers";

// Euro icon component
const Euro = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "w-4 h-4"}
  >
    <path d="M4 10h12" />
    <path d="M4 14h9" />
    <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
  </svg>
);

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 350,
    reference: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
    method: 'bank_transfer',
    completed: false,
  });
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the payment page",
        variant: "destructive",
      });
      navigate('/login', { state: { from: location } });
      return;
    }
  }, [user, navigate, location, toast]);
  
  const handleMethodChange = (value: string) => {
    setPaymentData(prev => ({ ...prev, method: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, GIF, or PDF file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setPaymentFile(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to make a payment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create payment record
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .insert({
          client_id: user.id,
          amount: paymentData.amount,
          method: paymentData.method,
          reference: paymentData.reference,
          date: new Date().toISOString(),
          status: 'Pending',
          description: 'Account activation payment',
          notes: notes || null
        })
        .select()
        .single();
      
      if (paymentError) throw paymentError;
      
      // If file is provided, upload it
      if (paymentFile) {
        const uploadResult = await uploadPaymentReceipt(paymentFile, user.id);
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload payment receipt');
        }
        
        // Create receipt record
        const { error: receiptError } = await supabase
          .from('payment_receipts')
          .insert({
            client_id: user.id,
            payment_id: paymentRecord.payment_id,
            receipt_path: uploadResult.filePath,
            notes: notes || null,
          });
        
        if (receiptError) throw receiptError;
      }
      
      // Show success notification
      toast({
        title: "Payment registered",
        description: "Your payment has been registered successfully.",
      });
      
      // Update state and redirect
      setPaymentData(prev => ({ ...prev, completed: true }));
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (paymentData.completed) {
    return (
      <div className="container max-w-md py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Payment Complete!</CardTitle>
            <CardDescription>
              Your payment has been registered and is awaiting confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>You will be redirected to your profile in a moment...</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/profile">Go to Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Complete your payment to access premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="font-medium">Account Activation</h3>
                  <p className="text-sm text-muted-foreground">
                    One-time activation fee
                  </p>
                </div>
                <div className="flex items-center">
                  <Euro className="mr-1 h-4 w-4" />
                  <span className="font-bold">{paymentData.amount}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Payment Method</h3>
                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="bank_transfer" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="bank_transfer"
                        onClick={() => handleMethodChange('bank_transfer')}
                      >
                        Bank Transfer
                      </TabsTrigger>
                      <TabsTrigger
                        value="payment_receipt"
                        onClick={() => handleMethodChange('payment_receipt')}
                      >
                        Upload Receipt
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="bank_transfer" className="space-y-4">
                      <Alert className="my-4">
                        <AlertTitle>Bank Transfer Information</AlertTitle>
                        <AlertDescription>
                          <p className="mb-2">
                            Please transfer the amount to the following bank account:
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm mb-4">
                            <p><strong>Bank:</strong> International Bank of Morocco</p>
                            <p><strong>Account Name:</strong> Euro Visa Services</p>
                            <p><strong>IBAN:</strong> MA82 1234 5678 9012 3456 7890</p>
                            <p><strong>Reference:</strong> {paymentData.reference}</p>
                          </div>
                          <p className="text-sm">
                            After completing the transfer, please upload your receipt.
                          </p>
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-receipt">Upload Payment Receipt</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id="payment-receipt" 
                              type="file" 
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              accept=".jpg,.jpeg,.png,.pdf"
                            />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                              <Upload className="mr-2 h-4 w-4" /> Browse
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Upload your payment receipt to verify your transfer (JPG, PNG, or PDF)
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="payment-notes">Payment Notes (Optional)</Label>
                          <Input
                            id="payment-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about your payment"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="payment_receipt" className="space-y-4">
                      <Alert className="my-4">
                        <AlertTitle>Upload Payment Receipt</AlertTitle>
                        <AlertDescription>
                          <p className="mb-2">
                            If you have already made the payment, please upload your receipt here.
                          </p>
                          <p className="text-sm">
                            Your payment receipt will be verified by our team and your account will be
                            activated once the payment is confirmed.
                          </p>
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="receipt-upload">Upload Receipt</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id="receipt-upload" 
                              type="file" 
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              accept=".jpg,.jpeg,.png,.pdf"
                            />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                              <FileUp className="mr-2 h-4 w-4" /> Browse
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Supported formats: JPG, PNG, PDF (Max 10MB)
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="receipt-reference">Payment Reference</Label>
                          <Input
                            id="receipt-reference"
                            value={paymentData.reference}
                            readOnly
                          />
                          <p className="text-xs text-muted-foreground">
                            Use this reference in your bank transfer
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="receipt-notes">Additional Notes (Optional)</Label>
                          <Input
                            id="receipt-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about your payment"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <div className="mt-6">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !paymentFile}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          'Submit Payment'
                        )}
                      </Button>
                    </div>
                  </Tabs>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Account Activation</span>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-1" />
                  <span className="font-medium">€350</span>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>€350</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex-col items-start">
              <h4 className="font-medium mb-2">What's included:</h4>
              <ul className="text-sm space-y-2">
                <li className="flex">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Full access to program applications</span>
                </li>
                <li className="flex">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Document upload and management</span>
                </li>
                <li className="flex">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Personalized program recommendations</span>
                </li>
                <li className="flex">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Support from our consultants</span>
                </li>
              </ul>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
