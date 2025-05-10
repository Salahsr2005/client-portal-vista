
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import { PaymentUploader } from "./PaymentUploader";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getReceiptUrl } from "@/utils/databaseHelpers";

export const PaymentStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showUploader, setShowUploader] = useState(false);
  const { paymentStatus, isLoading, mutate } = useUserPaymentStatus();

  const handleRefresh = () => {
    mutate();
    toast({
      title: "Status refreshed",
      description: "Your payment status has been refreshed",
    });
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Checking your payment status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!paymentStatus) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>Unable to retrieve payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was a problem retrieving your payment status. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRefresh}>Refresh Status</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Current status of your payments</CardDescription>
          </div>
          <CreditCard className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentStatus.isPaid ? (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Payment Confirmed</AlertTitle>
            <AlertDescription className="text-green-700">
              Your payment has been confirmed. You have full access to all services.
            </AlertDescription>
          </Alert>
        ) : paymentStatus.isPending ? (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Payment Pending</AlertTitle>
            <AlertDescription className="text-amber-700">
              {paymentStatus.hasPendingReceipt 
                ? "We have received your payment receipt and it's currently under review."
                : paymentStatus.hasPendingApplication 
                  ? "Your application is being processed. Please complete your payment to proceed."
                  : "Your payment is being processed. This may take 1-2 business days."}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Payment Required</AlertTitle>
            <AlertDescription className="text-blue-700">
              Please complete your payment to access all services. You can upload your payment receipt below.
            </AlertDescription>
          </Alert>
        )}
        
        {!paymentStatus.isPaid && !showUploader && (
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={() => setShowUploader(true)} className="w-full">
              Upload Payment Receipt
            </Button>
          </div>
        )}
        
        {showUploader && !paymentStatus.isPaid && (
          <PaymentUploader 
            onSuccess={() => {
              setShowUploader(false);
              mutate();
            }}
            onCancel={() => setShowUploader(false)}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <CardDescription>
          Last updated: {new Date().toLocaleString()}
        </CardDescription>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          Refresh Status
        </Button>
      </CardFooter>
    </Card>
  );
};
