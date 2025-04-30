import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePayments, usePendingApplications } from "@/hooks/usePayments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, FileText, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const { data: pendingApplications = [], isLoading: pendingLoading } = usePendingApplications();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePayNow = (application: any) => {
    setSelectedApplication(application);
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = () => {
    // Validate form
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "Missing information",
        description: "Please fill in all payment details",
        variant: "destructive",
      });
      return;
    }

    setProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setShowPaymentModal(false);
      
      // Reset form
      setCardNumber("");
      setCardName("");
      setExpiryDate("");
      setCvv("");
      
      toast({
        title: "Payment successful",
        description: `Your payment of $${selectedApplication?.fee} has been processed`,
        variant: "default",
      });
    }, 2000);
  };

  if (!user) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in to access payments</h2>
            <p className="text-center text-muted-foreground mb-6">
              You need to be signed in to view your payment history and manage pending payments.
            </p>
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      
      <Tabs defaultValue="history">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Payments
            {pendingApplications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingApplications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View all your past payments and transaction details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment history</h3>
                  <p className="text-muted-foreground">
                    You haven't made any payments yet.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <div className="font-medium">{payment.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.programName && (
                              <>
                                {payment.programName}
                                {payment.universityName && (
                                  <span> - {payment.universityName}</span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {payment.status === "Completed" && (
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>Receipt</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>
                Complete your application process by paying the required fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                </div>
              ) : pendingApplications.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending payments</h3>
                  <p className="text-muted-foreground">
                    You don't have any pending payments at the moment.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Fee Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>{app.programName}</TableCell>
                        <TableCell>{app.university}</TableCell>
                        <TableCell>${app.applicationFee}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            Payment Required
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            onClick={() => handlePayNow(app)}
                            size="sm"
                          >
                            Pay Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Please enter your payment details to complete the transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label>Payment for:</Label>
              <p className="text-sm font-medium">{selectedApplication?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedApplication?.provider}</p>
            </div>
            
            <div className="space-y-1">
              <Label>Amount:</Label>
              <p className="text-xl font-semibold">${selectedApplication?.fee}</p>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid gap-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input 
                id="cardName" 
                placeholder="John Smith" 
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                id="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate" 
                  placeholder="MM/YY" 
                  value={expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      let formatted = value;
                      if (value.length > 2) {
                        formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
                      }
                      setExpiryDate(formatted);
                    }
                  }}
                  maxLength={5}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  type="password"
                  placeholder="123" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select defaultValue="creditCard">
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creditCard">Credit Card</SelectItem>
                  <SelectItem value="debitCard">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentModal(false)}
              disabled={processingPayment}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPayment}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${selectedApplication?.fee}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for the separator
const Separator = ({ className }: { className?: string }) => (
  <div className={`h-[1px] w-full bg-border ${className || ''}`}></div>
);

export default PaymentsPage;
