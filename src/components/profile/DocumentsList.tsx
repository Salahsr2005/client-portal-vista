
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Upload, AlertCircle, CheckCircle, Clock, Loader2, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentUpload from './DocumentUpload';
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import { getDocumentUrl } from "@/utils/databaseHelpers";

const DocumentsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { data: paymentStatus } = useUserPaymentStatus();
  
  // Fetch user's documents
  const { data: documents, isLoading, isError, refetch } = useQuery({
    queryKey: ['userDocuments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', user.id)
        .order('upload_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{status}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">{status}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">{status}</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle successful upload
  const handleUploadSuccess = () => {
    refetch();
    setIsUploading(false);
    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded successfully",
    });
  };

  // Handle document download
  const handleDownload = async (document: any) => {
    try {
      const url = await getDocumentUrl(document.file_path);
      
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({
          title: "Error",
          description: "Could not download document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading your document",
        variant: "destructive",
      });
    }
  };
  
  // Function to determine if user can upload documents
  const canUploadDocuments = () => {
    return paymentStatus?.isPaid || false;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2">Loading documents...</span>
      </div>
    );
  }
  
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Your uploaded documents for applications</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to load documents</h3>
          <p className="text-muted-foreground mb-4">There was an error loading your documents.</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>Upload and manage your documents for applications</CardDescription>
        </div>
        <Button 
          className="mt-4 sm:mt-0" 
          onClick={() => setIsUploading(true)}
          disabled={!canUploadDocuments()}
        >
          <Upload className="mr-2 h-4 w-4" /> Upload New Document
        </Button>
      </CardHeader>
      <CardContent>
        {!canUploadDocuments() && (
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
        )}

        {isUploading ? (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Upload New Document</h3>
            <DocumentUpload 
              onSuccess={handleUploadSuccess} 
              onCancel={() => setIsUploading(false)} 
            />
          </div>
        ) : null}
        
        {documents && documents.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {documents.map((doc: any) => (
                <div 
                  key={doc.document_id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-10 w-10 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">{doc.document_name}</p>
                      <p className="text-sm text-muted-foreground">{doc.document_type}</p>
                      <p className="text-xs text-muted-foreground">Uploaded: {formatDate(doc.upload_date)}</p>
                      {doc.notes && <p className="text-xs italic mt-1">{doc.notes}</p>}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    {getStatusBadge(doc.status)}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="mr-2 h-4 w-4" /> View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No documents yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              Upload your documents to complete your applications and speed up the verification process
            </p>
            {!isUploading && canUploadDocuments() && (
              <Button onClick={() => setIsUploading(true)}>
                <Upload className="mr-2 h-4 w-4" /> Upload First Document
              </Button>
            )}
            {!canUploadDocuments() && (
              <Button asChild>
                <a href="/payments">Make Payment to Upload Documents</a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsList;
