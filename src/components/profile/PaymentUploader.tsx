
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Upload, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { uploadPaymentReceipt } from "@/utils/databaseHelpers";

interface PaymentUploaderProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaymentUploader = ({ onSuccess, onCancel }: PaymentUploaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentId, setPaymentId] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Please select a valid file (JPEG, PNG, or PDF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File is too large (max 5MB)');
        return;
      }
      
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload payment receipt",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await uploadPaymentReceipt(
        user.id,
        paymentId || 'manual-upload', // Use 'manual-upload' if no payment ID is provided
        selectedFile
      );
      
      if (result.success) {
        toast({
          title: "Receipt uploaded successfully",
          description: "We'll review your payment receipt and update your status soon.",
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(result.error || 'Failed to upload receipt');
        toast({
          title: "Upload failed",
          description: result.error || 'There was a problem uploading your receipt',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      setErrorMessage('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Upload Payment Receipt</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="payment-id">Payment Reference (Optional)</Label>
            <Input
              id="payment-id"
              placeholder="Enter payment reference number"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-receipt">Payment Receipt</Label>
            <Input
              ref={fileInputRef}
              id="payment-receipt"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors ${
                selectedFile ? 'border-green-400 bg-green-50' : 'border-slate-300'
              }`}
              onClick={triggerFileInput}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 text-green-700 rounded-full p-2 mb-2">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-primary/10 text-primary rounded-full p-2 mb-2">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="font-medium">Click to upload file</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or PDF (max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about your payment"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Uploading...
              </>
            ) : (
              'Upload Receipt'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

// Import the CheckCircle2 icon that was missing
import { CheckCircle2 } from 'lucide-react';
