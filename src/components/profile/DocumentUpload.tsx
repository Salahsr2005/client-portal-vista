
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from '@tanstack/react-query';
import { useUserPaymentStatus } from '@/hooks/useUserPaymentStatus';

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  status: string;
  upload_date: string;
}

export default function DocumentUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: paymentStatus, isLoading: paymentLoading } = useUserPaymentStatus();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', user?.id);

      if (error) {
        throw error;
      }

      setDocuments(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching documents",
        description: error.message || "An error occurred while fetching documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType || !user) {
      toast({
        title: "Missing information",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      // Upload file to storage
      const { error: storageError, data: storageData } = await supabase.storage
        .from('client-documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        });

      if (storageError) {
        throw storageError;
      }

      // Create a record in the client_documents table
      const { error: dbError } = await supabase
        .from('client_documents')
        .insert({
          client_id: user.id,
          document_name: selectedFile.name,
          document_type: documentType,
          file_path: filePath,
          status: 'Pending',
          upload_date: new Date().toISOString(),
        });

      if (dbError) {
        throw dbError;
      }

      // Success notification
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully and is pending verification",
      });
      
      // Reset form
      setSelectedFile(null);
      setDocumentType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh documents list
      fetchDocuments();
      
      // Invalidate queries that might depend on document status
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setDocumentType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500">Pending</Badge>;
    }
  };
  
  const canUploadDocuments = paymentStatus?.isPaid || paymentStatus?.hasPendingReceipt;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>
          Upload identification and application documents
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!canUploadDocuments && !paymentLoading && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start">
            <AlertCircle className="text-amber-600 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Payment Required</h4>
              <p className="text-sm text-amber-700 mt-1">
                You need to complete your payment before uploading documents. Please visit the Payments page.
              </p>
              <Button 
                variant="link" 
                onClick={() => window.location.href = '/payments'} 
                className="px-0 py-1 h-auto text-amber-800"
              >
                Go to Payments
              </Button>
            </div>
          </div>
        )}
        
        {canUploadDocuments && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="ID Card">ID Card</SelectItem>
                    <SelectItem value="Birth Certificate">Birth Certificate</SelectItem>
                    <SelectItem value="Academic Transcript">Academic Transcript</SelectItem>
                    <SelectItem value="Recommendation Letter">Recommendation Letter</SelectItem>
                    <SelectItem value="Language Certificate">Language Certificate</SelectItem>
                    <SelectItem value="CV/Resume">CV/Resume</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-file">File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    id="document-file"
                    type="file"
                    className="cursor-pointer"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    disabled={isUploading || !canUploadDocuments}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 5MB)
                </p>
              </div>
            </div>
            
            {selectedFile && (
              <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uploading...</span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !documentType || isUploading}
                className="bg-gradient-to-r from-violet-600 to-indigo-600"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-4">Uploaded Documents</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <File className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-primary/10 mr-3">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-sm">{doc.document_name}</p>
                        {doc.status === 'Verified' && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.document_type}</span>
                        <span>•</span>
                        <span>{new Date(doc.upload_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Documents are reviewed within 24-48 hours
        </p>
      </CardFooter>
    </Card>
  );
}
