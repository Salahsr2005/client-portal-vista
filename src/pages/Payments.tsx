
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePayments, usePendingApplications, useUploadReceipt } from "@/hooks/usePayments";
import { CreditCard, BanknoteIcon, ArrowRight, Upload, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Payments = () => {
  const { data: payments = [], isLoading } = usePayments();
  const { data: pendingApplications = [], isLoading: isLoadingPending } = usePendingApplications();
  const uploadReceiptMutation = useUploadReceipt();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

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
    if (!receiptFile || !selectedPayment) return;

    uploadReceiptMutation.mutate({
      paymentId: selectedPayment.id,
      receiptFile,
      notes
    }, {
      onSuccess: () => {
        setIsUploadDialogOpen(false);
        setReceiptFile(null);
        setNotes('');
        setSelectedPayment(null);
      }
    });
  };

  const openUploadDialog = (payment: any) => {
    setSelectedPayment(payment);
    setIsUploadDialogOpen(true);
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <div className="flex-1">
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'Partial' ? 'bg-blue-100 text-blue-800' :
                          payment.status === 'Failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                        {payment.receiptUploadPath && (
                          <FileText className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">{payment.amount}</p>
                      <p className="text-xs text-muted-foreground">{payment.method}</p>
                      {payment.status === 'Pending' && !payment.receiptUploadPath && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => openUploadDialog(payment)}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Receipt
                        </Button>
                      )}
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
                    onClick={() => openUploadDialog({ id: item.id, description: item.name, amount: `$${item.fee}`, status: 'Pending' })}
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.provider}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">${item.fee}</p>
                      <Upload className="h-4 w-4 text-primary" />
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

      {/* Upload Receipt Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Payment Receipt</DialogTitle>
            <DialogDescription>
              Upload your payment receipt for verification
            </DialogDescription>
          </DialogHeader>

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

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadReceipt}
                disabled={!receiptFile || uploadReceiptMutation.isPending}
              >
                {uploadReceiptMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
