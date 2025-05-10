
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Upload, AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentUpload from './DocumentUpload';

const DocumentsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
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
    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded successfully",
    });
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
        <Button className="mt-4 sm:mt-0" onClick={() => setIsUploading(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload New Document
        </Button>
      </CardHeader>
      <CardContent>
        {isUploading ? (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Upload New Document</h3>
            <DocumentUpload onSuccess={() => {
              handleUploadSuccess();
              setIsUploading(false);
            }} onCancel={() => setIsUploading(false)} />
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
                    <Button variant="outline" size="sm">
                      View
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
            {!isUploading && (
              <Button onClick={() => setIsUploading(true)}>
                <Upload className="mr-2 h-4 w-4" /> Upload First Document
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsList;
