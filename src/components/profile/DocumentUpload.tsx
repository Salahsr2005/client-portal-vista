
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Download, FileText, Plus, Upload, X } from "lucide-react";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Document {
  id: string;
  document_id: string;
  document_name: string;
  document_type: string;
  status: string;
  upload_date: string;
  file_path: string;
  notes: string;
  client_id: string;
}

const DocumentUpload = () => {
  const { user } = useAuth();
  const { data: paymentStatus } = useUserPaymentStatus();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "Passport",
    file: null as File | null,
  });

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", user?.id || "");

      if (error) throw error;
      
      if (data) {
        // Map the raw data to our Document interface
        const docs: Document[] = data.map(doc => ({
          id: doc.document_id, // Using document_id as our id property
          document_id: doc.document_id,
          document_name: doc.document_name,
          document_type: doc.document_type,
          status: doc.status,
          upload_date: doc.upload_date,
          file_path: doc.file_path,
          notes: doc.notes,
          client_id: doc.client_id
        }));
        
        setDocuments(docs);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      toast.error("You must be logged in to upload documents");
      return;
    }

    if (!paymentStatus?.isPaid) {
      toast.error("You need to upgrade your account to upload documents");
      return;
    }

    if (!newDocument.name || !newDocument.type || !newDocument.file) {
      toast.error("Please fill in all fields and select a file");
      return;
    }

    try {
      setUploading(true);

      // 1. Upload file to storage
      const fileExt = newDocument.file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("client-documents")
        .upload(filePath, newDocument.file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: publicUrlData } = await supabase.storage
        .from("client-documents")
        .getPublicUrl(filePath);

      // 3. Create record in the database
      const { error: dbError } = await supabase
        .from("client_documents")
        .insert({
          client_id: user.id,
          document_name: newDocument.name,
          document_type: newDocument.type,
          file_path: filePath,
          status: "Pending",
          upload_date: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      // 4. Reset form and refresh documents
      setNewDocument({
        name: "",
        type: "Passport",
        file: null,
      });
      
      setDialogOpen(false);
      toast.success("Document uploaded successfully");
      fetchDocuments();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewDocument((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("client-documents")
        .download(filePath);

      if (error) throw error;

      // Create a URL for the file and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  // Function to determine if user can upload more documents
  const canUploadDocuments = () => {
    return paymentStatus?.isPaid || paymentStatus?.status === 'Verified';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Upload and manage your documents</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              disabled={!canUploadDocuments()}
              title={!canUploadDocuments() ? "Payment required to upload documents" : ""}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload important documents for your application
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="doc-name">Document Name</Label>
                <Input
                  id="doc-name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Passport Copy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-type">Document Type</Label>
                <Select
                  value={newDocument.type}
                  onValueChange={(value) => setNewDocument((prev) => ({ ...prev, type: value }))}
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
                <Input
                  id="doc-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" /> Upload
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!canUploadDocuments() ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <div className="flex items-center text-amber-800">
              <div className="shrink-0 mr-3">
                <svg 
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <p className="text-sm">
                <strong>Payment required:</strong> You need to make a payment to upload and manage documents. 
                Please go to <a href="/payments" className="underline font-medium">Payments</a> to continue.
              </p>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload important documents for your applications
            </p>
            <Button 
              onClick={() => setDialogOpen(true)}
              disabled={!canUploadDocuments()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First Document
            </Button>
          </div>
        ) : (
          <Table>
            <TableCaption>Your uploaded documents</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.document_name}</TableCell>
                  <TableCell>{doc.document_type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === "Approved"
                          ? "success"
                          : doc.status === "Rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {doc.status === "Approved" && <Check className="h-3 w-3 mr-1" />}
                      {doc.status === "Rejected" && <X className="h-3 w-3 mr-1" />}
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(doc.upload_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc.file_path, doc.document_name)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      <span className="sr-only sm:not-sr-only sm:inline-block">
                        Download
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
