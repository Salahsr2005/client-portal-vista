
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, CreditCard, Euro } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PaymentCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Get payment data passed from previous page
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
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

  const handleSubmitPayment = () => {
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setStep(2); // Move to success step
      setLoading(false);
    }, 2000);
  };

  const handleFinish = () => {
    toast({
      title: "Payment successful",
      description: "Your payment has been processed successfully.",
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
                </div>
              )}
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col md:flex-row gap-4 items-center justify-between py-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/payments")}
              disabled={loading}
            >
              Back to Payments
            </Button>
            <div className="flex flex-col items-end">
              <p className="text-sm mb-2">
                Total: <span className="font-bold">€{paymentData.amount}</span>
              </p>
              <Button 
                onClick={handleSubmitPayment}
                disabled={loading || (paymentMethod === "credit-card" && (!cardNumber || !cardName || !expiryDate || !cvv))}
                className="min-w-[150px]"
              >
                {loading ? (
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
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your payment of <span className="font-medium">€{paymentData.amount}</span> has been processed successfully.
            </p>
            <div className="border rounded-lg p-4 bg-muted/30 mb-8 max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-medium">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
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
