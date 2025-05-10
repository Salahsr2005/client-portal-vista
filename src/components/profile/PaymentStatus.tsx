import React from "react";
import { useUserPaymentStatus, useUploadedReceipts } from "@/hooks/useUserPaymentStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Clock, CreditCard, FileCheck, Upload } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getReceiptUrl } from "@/utils/databaseHelpers";
import { usePendingApplications } from "@/hooks/usePayments";

export function PaymentStatus() {
  const { data: paymentStatus, isLoading } = useUserPaymentStatus();
  const { data: receipts = [] } = useUploadedReceipts();
  const { data: pendingApplications = [] } = usePendingApplications();
  const { toast } = useToast();
  
  const viewReceipt = async (receiptPath: string) => {
    try {
      const url = await getReceiptUrl(receiptPath);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({
          title: "Error",
          description: "Could not retrieve receipt URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while retrieving the receipt",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Loading your payment information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if there are pending receipts or applications
  const hasPendingStatus = paymentStatus?.hasPendingReceipt || paymentStatus?.hasPendingApplication;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" /> Payment Status
        </CardTitle>
        <CardDescription>
          Your current account status and payment history
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Current Status */}
        <div>
          <h3 className="text-lg font-medium mb-3">Current Status</h3>
          <div className="flex items-center gap-3">
            <div className="bg-muted p-3 rounded-full">
              {paymentStatus?.isPaid ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : hasPendingStatus ? (
                <Clock className="h-6 w-6 text-amber-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center">
                <h4 className="font-semibold">
                  {paymentStatus?.isPaid 
                    ? "Paid Member" 
                    : hasPendingStatus
                    ? "Payment Pending Verification"
                    : "Payment Required"}
                </h4>
                <Badge 
                  variant={paymentStatus?.isPaid ? "default" : paymentStatus?.hasPendingReceipt ? "outline" : "destructive"} 
                  className="ml-2"
                >
                  {paymentStatus?.isPaid 
                    ? "Active" 
                    : hasPendingStatus
                    ? "Pending" 
                    : "Required"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {paymentStatus?.isPaid 
                  ? "You have full access to all features and services"
                  : paymentStatus?.hasPendingReceipt
                  ? "Your payment receipt is being verified"
                  : "You need to make a payment to access all features"}
              </p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Payment Requirements */}
        {!paymentStatus?.isPaid && (
          <div className="space-y-4">
            {!paymentStatus?.hasPendingReceipt && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Required</AlertTitle>
                <AlertDescription>
                  You need to make a payment to access document uploads and messaging features.
                </AlertDescription>
              </Alert>
            )}
            
            {paymentStatus?.hasPendingReceipt && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Payment Verification In Progress</AlertTitle>
                <AlertDescription>
                  Your payment receipt is being verified. You'll have full access once approved.
                </AlertDescription>
              </Alert>
            )}
            
            {pendingApplications.length > 0 && !paymentStatus?.hasPendingReceipt && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Pending Payments</h3>
                <div className="space-y-2">
                  {pendingApplications.map((app) => (
                    <div key={app.id} className="bg-muted p-3 rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-sm text-muted-foreground">Fee: €{app.fee}</p>
                      </div>
                      <Button 
                        size="sm"
                        asChild
                      >
                        <a href={`/payments/checkout?id=${app.id}&type=${app.type}`}>
                          Pay Now
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Receipt History */}
        {receipts.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Payment Receipts</h3>
            <div className="space-y-3">
              {receipts.map((receipt) => (
                <div 
                  key={receipt.id} 
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{receipt.paymentDescription}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {formatDistanceToNow(new Date(receipt.uploadedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={receipt.status === 'Approved' ? "default" : "outline"}
                    >
                      {receipt.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewReceipt(receipt.receiptPath)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
