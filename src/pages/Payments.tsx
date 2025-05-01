
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { usePayments } from "@/hooks/usePayments";
import { usePendingApplications } from "@/hooks/usePayments";
import { CreditCard, BanknoteIcon, ArrowRight, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Payments = () => {
  const { data: payments = [], isLoading, error } = usePayments();
  const { data: pendingApplications = [], isLoading: isLoadingPending } = usePendingApplications();
  const [pendingItem, setPendingItem] = useState<any>(null);
  const [pendingType, setPendingType] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card");
  const { toast } = useToast();

  const handlePendingItemClick = (item: any, type: string) => {
    setPendingItem(item);
    setPendingType(type);
  };

  // Function to safely handle potentially missing properties
  const getProgramDetails = (app: any) => {
    return {
      programName: app?.name || app?.programName || "Program Fee", 
      university: app?.provider || app?.university || "", 
      applicationFee: app?.fee || 0
    };
  };

  const handlePayment = () => {
    toast({
      title: "Payment Processing",
      description: `Processing payment of $${getProgramDetails(pendingItem).applicationFee.toFixed(2)} via ${selectedPaymentMethod}`,
    });
    
    // Close the dialog
    setIsDialogOpen(false);
  };

  if (isLoading || isLoadingPending) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payments</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment History Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment History
            </CardTitle>
            <CardDescription>Review your past transactions</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {payments.length > 0 ? (
              <div className="space-y-5">
                {payments.map((payment) => (
                  <div 
                    key={payment.id} 
                    className="flex justify-between items-center p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">{payment.amount}</p>
                      <p className="text-xs text-muted-foreground">{payment.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payment history available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Payments Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-500/5">
            <CardTitle className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5" /> Pending Payments
            </CardTitle>
            <CardDescription>Payments requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {pendingApplications.length > 0 ? (
              <div className="space-y-5">
                {pendingApplications.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() => {
                      handlePendingItemClick(item, 'program');
                      setIsDetailsOpen(true);
                    }}
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.provider}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">${item.fee}</p>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending payments available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Payment Details</SheetTitle>
            <SheetDescription>Review your payment information</SheetDescription>
          </SheetHeader>
          
          {pendingItem && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{getProgramDetails(pendingItem).programName}</h3>
                <p className="text-muted-foreground">{getProgramDetails(pendingItem).university}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Fee Details:</p>
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <span>Application Fee</span>
                  <span>${getProgramDetails(pendingItem).applicationFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${getProgramDetails(pendingItem).applicationFee.toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full mt-6" onClick={() => {
                setIsDialogOpen(true);
              }}>
                Pay Now
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Payment Method Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you would like to pay for your application
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <RadioGroup 
              defaultValue="card" 
              value={selectedPaymentMethod} 
              onValueChange={setSelectedPaymentMethod}
              className="space-y-4"
            >
              <div className={`flex items-start space-x-3 rounded-lg border p-4 ${selectedPaymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="card" id="card" className="mt-1" />
                <div className="flex flex-col">
                  <label htmlFor="card" className="font-medium cursor-pointer flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Credit/Debit Card
                  </label>
                  <span className="text-sm text-muted-foreground">Pay securely with your card</span>
                </div>
              </div>

              <div className={`flex items-start space-x-3 rounded-lg border p-4 ${selectedPaymentMethod === 'bank' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="bank" id="bank" className="mt-1" />
                <div className="flex flex-col">
                  <label htmlFor="bank" className="font-medium cursor-pointer">Bank Transfer (BDL-AGB-CPA)</label>
                  <span className="text-sm text-muted-foreground">Transfer directly from your bank account</span>
                </div>
              </div>

              <div className={`flex items-start space-x-3 rounded-lg border p-4 ${selectedPaymentMethod === 'ccp' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="ccp" id="ccp" className="mt-1" />
                <div className="flex flex-col">
                  <label htmlFor="ccp" className="font-medium cursor-pointer">Algeria CCP</label>
                  <span className="text-sm text-muted-foreground">Pay using Algeria CCP account</span>
                </div>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handlePayment} className="w-full sm:w-auto">
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
