
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Upload, ArrowLeft, CheckCircle, FileCheck, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { generatePaymentCredentialsPDF } from '@/utils/paymentCredentialsPdfGenerator';

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadInstructions = () => {
    if (!user || !paymentId) return;
    
    // Generate PDF with payment credentials
    generatePaymentCredentialsPDF(
      'bank', // Default to bank transfer
      user.email || 'Client',
      paymentId,
      paymentId // Use paymentId as reference
    );
    
    toast.success('Payment instructions downloaded');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Please select a file smaller than 10MB');
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload a JPG, PNG, GIF or PDF file');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !user || !paymentId) return;
    
    setUploading(true);
    
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${paymentId}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Failed to upload receipt: ' + uploadError.message);
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(filePath);

      // Update payment record with receipt path and set status to Under Review
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          receipt_upload_path: filePath,
          status: 'Pending'
        })
        .eq('payment_id', paymentId)
        .eq('client_id', user.id);

      if (updateError) {
        throw new Error('Failed to update payment: ' + updateError.message);
      }

      // Create receipt record with proper user context
      const { error: receiptError } = await supabase
        .from('payment_receipts')
        .insert({
          payment_id: paymentId,
          client_id: user.id,
          receipt_path: filePath, // Store file path instead of public URL
          notes: notes,
          status: 'Pending'
        });

      if (receiptError) {
        console.error('Receipt insert error:', receiptError);
        throw new Error('Failed to create receipt record: ' + receiptError.message);
      }

      toast.success('Receipt uploaded successfully!');
      
      // Navigate back to payments page after a delay
      setTimeout(() => {
        navigate('/payments');
      }, 2000);

    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      
      // Provide more specific error messages
      if (error.message?.includes('row-level security')) {
        toast.error('Permission denied. You can only upload receipts for your own account. Please make sure you\'re logged in correctly.');
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="outline"
        onClick={() => navigate('/payments')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Payments
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Payment Instructions & Receipt Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Download Instructions */}
          <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
            <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Step 1: Download Payment Instructions</h3>
            <p className="text-muted-foreground mb-4">
              Download the payment instructions with bank details and reference number
            </p>
            <Button onClick={handleDownloadInstructions} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Instructions
            </Button>
          </div>

          {/* Upload Receipt */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Step 2: Upload Payment Receipt</h3>
              <p className="text-muted-foreground mb-4">
                After making the payment, upload your receipt or proof of payment here
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="receipt">Receipt File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="receipt"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className={file ? 'hidden' : ''}
                    accept=".jpg,.jpeg,.png,.gif,.pdf"
                    disabled={uploading}
                  />
                  
                  {file && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded border w-full">
                      <FileCheck className="h-5 w-5 text-green-500" />
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFile}
                        className="h-7 w-7 p-0"
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {!file && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      Browse
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload JPG, PNG, GIF or PDF (max 10MB). Large images will be automatically compressed.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any details about this payment receipt..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={uploading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!file || uploading}
            >
              {uploading ? (
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
          </form>

          {/* Important Notes */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Important Notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Make sure to include the payment reference number in your transfer</li>
              <li>• Keep a copy of your receipt for your records</li>
              <li>• Payment verification may take 24-48 hours</li>
              <li>• You will receive a notification once payment is confirmed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCheckout;
