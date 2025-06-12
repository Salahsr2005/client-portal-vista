
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, X, FileCheck, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { uploadPaymentReceipt } from '@/utils/databaseHelpers';

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
      // Upload the file to storage
      const uploadResult = await uploadPaymentReceipt(file, user.id);
      
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      // Create receipt record in the database - ensure user.id is properly set
      const { error } = await supabase
        .from('payment_receipts')
        .insert({
          receipt_path: uploadResult.filePath!,
          payment_id: paymentId,
          client_id: user.id, // This must match the authenticated user
          notes: notes,
        });
      
      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }
      
      toast({
        title: "Receipt uploaded",
        description: "Your payment receipt has been uploaded successfully",
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
