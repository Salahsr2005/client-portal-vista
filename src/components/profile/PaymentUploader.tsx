
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, X, FileCheck, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface PaymentUploaderProps {
  paymentId: string;
  onSuccess: () => void;
}

const PaymentUploader = ({ paymentId, onSuccess }: PaymentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, GIF or PDF file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !user) return;
    
    setIsLoading(true);
    
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

      // Create receipt record with the file path for storage and public URL for display
      const { error: receiptError } = await supabase
        .from('payment_receipts')
        .insert({
          payment_id: paymentId,
          client_id: user.id,
          receipt_path: publicUrl, // Store public URL for easy access
          notes: notes,
          status: 'Pending'
        });

      if (receiptError) {
        console.error('Receipt insert error:', receiptError);
        throw new Error('Failed to create receipt record: ' + receiptError.message);
      }

      toast({
        title: "Receipt uploaded successfully",
        description: "Your payment receipt has been submitted for review.",
      });

      // Reset form
      setFile(null);
      setNotes('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Call success callback
      onSuccess();
      
    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      
      // Provide more specific error messages
      if (error.message?.includes('row-level security')) {
        toast({
          title: "Permission denied",
          description: "You can only upload receipts for your own account. Please make sure you're logged in correctly.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
            >
              Browse
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Upload JPG, PNG, GIF or PDF (max 10MB). Large images will be automatically compressed.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any details about this payment receipt..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={!file || isLoading}
      >
        {isLoading ? (
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
  );
};

export default PaymentUploader;
