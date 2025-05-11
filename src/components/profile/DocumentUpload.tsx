
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Plus, Upload, X } from "lucide-react";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import { uploadDocument } from "@/utils/databaseHelpers";

interface DocumentUploadProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { data: paymentStatus } = useUserPaymentStatus();
  const [uploading, setUploading] = useState(false);
  const [document, setDocument] = useState({
    name: "",
    type: "Passport",
    file: null as File | null,
  });
  
  // Create a ref for the file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!user) {
      toast.error("You must be logged in to upload documents");
      return;
    }

    if (!paymentStatus?.isPaid) {
      toast.error("You need to upgrade your account to upload documents");
      return;
    }

    if (!document.name || !document.type || !document.file) {
      toast.error("Please fill in all fields and select a file");
      return;
    }

    try {
      setUploading(true);

      // Upload file to storage
      const uploadResult = await uploadDocument(document.file, user.id, document.name);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Create record in the database
      const { error: dbError } = await supabase
        .from("client_documents")
        .insert({
          client_id: user.id,
          document_name: document.name,
          document_type: document.type,
          file_path: uploadResult.filePath,
          status: "Pending",
          upload_date: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocument((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };

  // Function to determine if user can upload documents
  const canUploadDocuments = () => {
    return paymentStatus?.isPaid || false;
  };

  if (!canUploadDocuments()) {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <p className="text-amber-800 dark:text-amber-200 font-medium">
          Payment required to upload documents
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          You need to make a payment before you can upload documents.
          Please go to the Payments section to continue.
        </p>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button asChild>
            <a href="/payments">Make Payment</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="doc-name">Document Name</Label>
        <Input
          id="doc-name"
          value={document.name}
          onChange={(e) => setDocument((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Passport Copy"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="doc-type">Document Type</Label>
        <Select
          value={document.type}
          onValueChange={(value) => setDocument((prev) => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Passport">Passport</SelectItem>
            <SelectItem value="ID Card">ID Card</SelectItem>
            <SelectItem value="Birth Certificate">Birth Certificate</SelectItem>
            <SelectItem value="Diploma">Diploma</SelectItem>
            <SelectItem value="Transcript">Academic Transcript</SelectItem>
            <SelectItem value="Language Certificate">Language Certificate</SelectItem>
            <SelectItem value="CV">CV/Resume</SelectItem>
            <SelectItem value="Motivation Letter">Motivation Letter</SelectItem>
            <SelectItem value="Payment Receipt">Payment Receipt</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="doc-file">File (PDF, JPG, PNG)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="doc-file"
            type="file"
            ref={fileInputRef}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className={document.file ? "hidden" : ""}
          />
          
          {document.file && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded border w-full">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm truncate flex-1">{document.file.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setDocument(prev => ({ ...prev, file: null }))}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {!document.file && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-4 w-4 mr-1" /> Choose File
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Maximum file size: 10MB
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={uploading || !document.file}>
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-1" /> Upload Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;
