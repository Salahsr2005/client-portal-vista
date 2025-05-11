import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CreditCard, Building, ArrowLeft, ArrowRight, Upload as UploadIcon, FileUp, Check, FileCheck } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { uploadPaymentReceipt } from "@/utils/databaseHelpers";

// Import Euro icon or create custom component for Euro symbol
const Euro = () => {
  return <span>€</span>;
};

const PaymentCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get payment data passed from previous page
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
      
      // Set default payment method if specified
      if (location.state.paymentData.method) {
        setPaymentMethod(location.state.paymentData.method);
      }
    } else {
      // If no payment data, redirect back to payments
      navigate("/payments");
    }
  }, [location, navigate]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted.substring(0, 19)); // Limit to 16 digits + 3 spaces
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!receiptFile || !user) return;
    
    setUploadingReceipt(true);
    
    try {
      // Create a payment record first
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .insert({
          client_id: user.id,
          method: paymentMethod,
          amount: parseFloat(paymentData.amount),
          status: 'Pending',
          date: new Date().toISOString(),
          description: paymentData.description || `Payment for ${paymentData.title}`,
          reference: paymentData.reference || paymentMethod,
        })
        .select();
      
      if (paymentError) {
        throw paymentError;
      }
      
      // Upload receipt with reference to the payment
      const result = await uploadPaymentReceipt(
        user.id,
        paymentRecord[0].payment_id,
        receiptFile
      );
      
      if (!result.success) {
        throw result.error;
      }
      
      toast({
        title: "Receipt uploaded successfully",
        description: "Your payment is pending verification.",
      });
      
      // Move to success step after upload
      setStep(2);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleSubmitPayment = () => {
    if (paymentMethod === "bank-transfer" || paymentMethod === "ccp") {
      if (!receiptFile) {
        toast({
          title: "Receipt required",
          description: "Please upload your payment receipt to continue.",
          variant: "destructive",
        });
        return;
      }
      
      handleFileUpload();
    } else {
      setLoading(true);

      // Simulate payment processing for card payments
      setTimeout(async () => {
        try {
          // Create payment record for card payments
          if (user) {
            await supabase
              .from('payments')
              .insert({
                client_id: user.id,
                method: 'Credit Card',
                amount: parseFloat(paymentData.amount),
                status: 'Completed',
                date: new Date().toISOString(),
                description: paymentData.description || `Payment for ${paymentData.title}`,
                reference: paymentData.reference || 'card',
                transaction_id: `TXN-${Date.now().toString().substring(5)}`
              });
          }
          
          setStep(2); // Move to success step
        } catch (error) {
          console.error("Error recording payment:", error);
        } finally {
          setLoading(false);
        }
      }, 2000);
    }
  };

  const handleFinish = () => {
    toast({
      title: "Payment processed",
      description: paymentMethod === "credit-card" 
        ? "Your payment has been processed successfully." 
        : "Your payment receipt has been submitted and is pending verification.",
    });
    navigate("/payments");
  };

  if (!paymentData) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium">No payment data found</h2>
              <p className="text-muted-foreground mt-2 mb-4">
                Please return to the payments page and select an item to pay.
              </p>
              <Button onClick={() => navigate("/payments")}>Go to Payments</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      {step === 1 ? (
        <Card className="border-border/50 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CreditCard className="h-6 w-6" /> Payment Checkout
            </CardTitle>
            <CardDescription>Complete your payment securely</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg">{paymentData.title}</h3>
                  <p className="text-muted-foreground">{paymentData.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary flex items-center gap-1 justify-end">
                    <Euro className="h-5 w-5" /> {paymentData.amount}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className={`flex items-center space-x-2 border p-4 rounded-md ${
                    paymentMethod === "credit-card" ? "border-primary bg-primary/5" : ""
                  }`}>
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      Credit/Debit Card
                    </Label>
                    <div className="flex gap-2">
                      <div className="h-8 w-12 bg-[#1434CB] rounded-md flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div className="h-8 w-12 bg-[#FF5F00] rounded-md flex items-center justify-center text-white text-xs font-bold">MC</div>
                    </div>
                  </div>

                  <div className={`flex items-center space-x-2 border p-4 rounded-md ${
                    paymentMethod === "bank-transfer" ? "border-primary bg-primary/5" : ""
                  }`}>
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                      Bank Transfer
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-2 border p-4 rounded-md ${
                    paymentMethod === "ccp" ? "border-primary bg-primary/5" : ""
                  }`}>
                    <RadioGroupItem value="ccp" id="ccp" />
                    <Label htmlFor="ccp" className="flex-1 cursor-pointer">
                      Algeria CCP
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "credit-card" && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input
                        id="card-name"
                        placeholder="As appears on your card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value.substring(0, 5))}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.substring(0, 3))}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>This is a demo</AlertTitle>
                    <AlertDescription>
                      No real payment will be processed. You can use any card details for testing.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {paymentMethod === "bank-transfer" && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <AlertTitle>Bank Transfer Details</AlertTitle>
                    <AlertDescription className="space-y-1">
                      <p>Bank: Euro Education Bank</p>
                      <p>IBAN: EU55 0000 0000 0000 0000 0000</p>
                      <p>Reference: {paymentData.reference || "Your ID"}</p>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="receipt">Upload Payment Receipt</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary/70 transition-colors" 
                      onClick={() => fileInputRef.current?.click()}>
                      <Input
                        id="receipt"
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UploadIcon className="h-10 w-10 text-muted-foreground" />
                        {receiptFile ? (
                          <div>
                            <p className="font-medium">{receiptFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(receiptFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium">Click to upload receipt</p>
                            <p className="text-sm text-muted-foreground">
                              or drag and drop your receipt file
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: JPG, PNG, PDF (max 5MB)
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "ccp" && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <AlertTitle>Algeria CCP Details</AlertTitle>
                    <AlertDescription className="space-y-1">
                      <p>CCP Number: 00000000000000000000</p>
                      <p>Key: 42</p>
                      <p>Reference: {paymentData.reference || "Your ID"}</p>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="receipt-ccp">Upload Payment Receipt</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary/70 transition-colors" 
                      onClick={() => fileInputRef.current?.click()}>
                      <Input
                        id="receipt-ccp"
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileUp className="h-10 w-10 text-muted-foreground" />
                        {receiptFile ? (
                          <div>
                            <p className="font-medium">{receiptFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(receiptFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium">Click to upload receipt</p>
                            <p className="text-sm text-muted-foreground">
                              Upload proof of your CCP payment
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: JPG, PNG, PDF (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col md:flex-row gap-4 items-center justify-between py-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/payments")}
              disabled={loading || uploadingReceipt}
            >
              Back to Payments
            </Button>
            <div className="flex flex-col items-end">
              <p className="text-sm mb-2">
                Total: <span className="font-bold">€{paymentData.amount}</span>
              </p>
              <Button 
                onClick={handleSubmitPayment}
                disabled={loading || uploadingReceipt || 
                  (paymentMethod === "credit-card" && (!cardNumber || !cardName || !expiryDate || !cvv)) ||
                  ((paymentMethod === "bank-transfer" || paymentMethod === "ccp") && !receiptFile)
                }
                className="min-w-[150px]"
              >
                {loading || uploadingReceipt ? (
                  <>
                    <div className="spinner mr-2" /> Processing...
                  </>
                ) : (
                  <>Complete Payment</>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-border/50 shadow-md">
          <CardContent className="pt-10 pb-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              {paymentMethod === "credit-card" ? (
                <>Your payment of <span className="font-medium">€{paymentData.amount}</span> has been processed successfully.</>
              ) : (
                <>Your receipt has been uploaded. Your payment of <span className="font-medium">€{paymentData.amount}</span> is pending verification.</>
              )}
            </p>
            <div className="border rounded-lg p-4 bg-muted/30 mb-8 max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Reference:</span>
                <span className="font-medium">{paymentData.reference || Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${paymentMethod === "credit-card" ? "text-green-600" : "text-amber-600"}`}>
                  {paymentMethod === "credit-card" ? "Completed" : "Pending Verification"}
                </span>
              </div>
            </div>
            <Button onClick={handleFinish} className="w-full md:w-auto min-w-[200px]">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentCheckout;
