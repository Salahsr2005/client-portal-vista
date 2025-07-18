
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle, AlertCircle, Clock, Upload, FileText, Eye } from "lucide-react";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import { useUploadReceipt } from "@/hooks/usePayments";
import { formatCurrency, getReceiptUrl } from "@/utils/databaseHelpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Helper for badge styling
const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'Completed':
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    case 'Under Review':
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
  const uploadReceiptMutation = useUploadReceipt();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, GIF or PDF file",
          variant: "destructive",
        });
        return;
      }
      
      setReceiptFile(file);
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile || !data) return;

    uploadReceiptMutation.mutate({
      paymentId: data.id,
      receiptFile,
      notes
    }, {
      onSuccess: () => {
        setReceiptFile(null);
        setNotes('');
        queryClient.invalidateQueries({ queryKey: ['userPaymentStatus'] });
      }
    });
  };

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

        {/* Status-specific content */}
        {data.status === 'Completed' && (
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

        {/* Upload Receipt Section (only show if not completed) */}
        {data.status !== 'Completed' && (
          <div className="mt-8 space-y-4">
            <h3 className="font-medium">Upload Payment Receipt</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receipt-file">Receipt File</Label>
                <Input
                  id="receipt-file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.gif,.pdf"
                />
                <p className="text-xs text-muted-foreground">
                  Upload JPG, PNG, GIF or PDF (max 10MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this payment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                onClick={handleUploadReceipt}
                disabled={!receiptFile || uploadReceiptMutation.isPending}
                className="w-full"
              >
                {uploadReceiptMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Receipt
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
