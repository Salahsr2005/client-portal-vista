import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const generatePaymentInstructions = () => {
    const instructions = `
PAYMENT INSTRUCTIONS

Payment ID: ${paymentId}
Amount: To be confirmed
Bank Account Details:
- Account Name: [Bank Account Name]
- Account Number: [Account Number]
- Bank Name: [Bank Name]
- SWIFT Code: [SWIFT Code]

Instructions:
1. Make the payment to the above account
2. Keep the receipt/proof of payment
3. Upload the receipt using the upload button below
4. Your payment will be verified within 24-48 hours

For any questions, contact our support team.
    `;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-instructions-${paymentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Payment instructions downloaded');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG) or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadedFile(file);

    try {
      // Upload to payment-receipts bucket
      const fileName = `${user.id}/${paymentId}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(fileName);

      // Insert receipt record
      const { error: insertError } = await supabase
        .from('payment_receipts')
        .insert({
          client_id: user.id,
          payment_id: paymentId,
          receipt_path: publicUrl,
          status: 'Pending'
        });

      if (insertError) throw insertError;

      toast.success('Receipt uploaded successfully!');
      
      // Navigate back to payments page after a delay
      setTimeout(() => {
        navigate('/payments');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload receipt. Please try again.');
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
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
            <Button onClick={generatePaymentInstructions} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Instructions
            </Button>
          </div>

          {/* Upload Receipt */}
          <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Step 2: Upload Payment Receipt</h3>
            <p className="text-muted-foreground mb-4">
              After making the payment, upload your receipt or proof of payment here
            </p>
            
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">
                  {uploadedFile.name} uploaded successfully!
                </span>
              </div>
            ) : (
              <div className="mb-4">
                <input
                  type="file"
                  id="receipt-upload"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Receipt'}
                </Button>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Accepted formats: JPG, PNG, PDF (Max 5MB)
            </p>
          </div>

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