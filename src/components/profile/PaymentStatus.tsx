
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle, AlertCircle, Clock, Upload, FileText, ExternalLink, Eye } from "lucide-react";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import PaymentUploader from "./PaymentUploader";
import { formatCurrency, getReceiptUrl } from "@/utils/databaseHelpers";

// Helper for badge styling
const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

// Helper for relative time
const formatRelativeTime = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffDays > 0) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffMins > 0) {
    return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
  } else {
    return 'Just now';
  }
};

const PaymentStatus: React.FC = () => {
  const { data, isLoading, isError } = useUserPaymentStatus();
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // View receipt handler
  const handleViewReceipt = async (receiptPath: string) => {
    try {
      const url = await getReceiptUrl(receiptPath);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({
          title: "Error",
          description: "Could not load receipt",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching receipt:", error);
      toast({
        title: "Error",
        description: "Failed to load receipt",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading payment status...</p>
      </div>
    );
  }

  // Show error state
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <p className="font-medium text-lg mb-2">Error loading payment status</p>
        <p className="text-muted-foreground mb-4">We couldn't load your payment information.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['userPaymentStatus'] })}>
          Retry
        </Button>
      </div>
    );
  }

  // Render payment status
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Status</span>
          <Badge className={getStatusBadgeStyle(data.status)}>
            {data.status}
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage your service payment information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Information */}
        <div className="rounded-md bg-muted p-4">
          <h3 className="font-medium mb-2">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between md:block">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(data.amount)}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium">{data.method || 'Bank Transfer'}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-muted-foreground">Reference:</span>
              <span className="font-medium">{data.reference || 'N/A'}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{new Date(data.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Receipts */}
        {data.receipts && data.receipts.length > 0 ? (
          <div className="rounded-md bg-muted p-4">
            <h3 className="font-medium mb-2">Uploaded Receipts</h3>
            <ScrollArea className="h-[200px] rounded-md border">
              <div className="p-4 space-y-4">
                {data.receipts.map((receipt) => (
                  <div 
                    key={receipt.id} 
                    className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-accent"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Receipt {receipt.id.substring(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {receipt.notes || 'No description provided'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {formatRelativeTime(receipt.uploaded_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadgeStyle(receipt.status)}>
                        {receipt.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewReceipt(receipt.receipt_path)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="rounded-md bg-muted p-4 text-center">
            <p className="text-muted-foreground">No receipts uploaded yet.</p>
            <p className="text-sm mt-1">
              Please upload a receipt of your payment to proceed with your application.
            </p>
          </div>
        )}
        
        {/* Payment instructions */}
        {!data.isPaid && (
          <div className="rounded-md border bg-card p-4">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Payment Instructions
            </h3>
            <p className="text-sm mb-4">
              Please make a payment to the following account and upload your receipt:
            </p>
            <div className="bg-muted rounded-md p-3 text-sm mb-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-medium">International Bank of Morocco</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Name:</span>
                  <span className="font-medium">Euro Visa Services</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-medium">872-55392-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IBAN:</span>
                  <span className="font-medium">MA82 1234 5678 9012 3456 7890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-medium">{data.reference || 'Your Name-Application ID'}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              <p className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>
                  Be sure to include your reference number in the payment description.
                </span>
              </p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <a href="https://www.bankofmorocco.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Online Banking
              </a>
            </Button>
          </div>
        )}

        {data.status === 'Approved' && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500 mx-auto mb-2" />
            <h3 className="font-medium text-lg">Payment Verified</h3>
            <p className="text-muted-foreground">
              Your payment has been verified and processed. Thank you!
            </p>
          </div>
        )}

        {data.status === 'Rejected' && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-500 mx-auto mb-2" />
            <h3 className="font-medium text-lg">Payment Rejected</h3>
            <p className="text-muted-foreground mb-2">
              Your payment evidence was not accepted. Please upload a valid receipt.
            </p>
            <p className="text-sm text-muted-foreground">
              Reason: {data.notes || "Insufficient payment evidence"}
            </p>
          </div>
        )}

        {/* Upload Receipt Section (only show if not approved yet) */}
        {data.status !== 'Approved' && (
          <div className="mt-8">
            <h3 className="font-medium mb-2">Upload Payment Receipt</h3>
            <PaymentUploader paymentId={data.id} onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['userPaymentStatus'] });
              toast({
                title: "Receipt uploaded",
                description: "Your payment receipt has been uploaded and is pending verification",
              });
            }}/>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
