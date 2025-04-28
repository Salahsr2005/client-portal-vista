
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, Trash2, CheckCircle2, XCircle, File } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const documentTypes = [
  { id: 'passport', name: 'Passport' },
  { id: 'cv', name: 'CV/Resume' },
  { id: 'transcript', name: 'Academic Transcript' },
  { id: 'diploma', name: 'Diploma/Degree Certificate' },
  { id: 'language_certificate', name: 'Language Proficiency Certificate' },
  { id: 'motivation_letter', name: 'Motivation Letter' },
  { id: 'recommendation_letter', name: 'Letter of Recommendation' },
  { id: 'id_card', name: 'ID Card' },
  { id: 'other', name: 'Other Document' }
];

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  uploaded_at: string;
  file_path: string;
}

export function DocumentUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');

  React.useEffect(() => {
    if (user && !fetched) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', user.id)
        .order('upload_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform data to match our Document interface
      const transformedData = (data || []).map(doc => ({
        id: doc.document_id,
        name: doc.document_name,
        type: doc.document_type,
        status: doc.status,
        uploaded_at: doc.upload_date,
        file_path: doc.file_path
      }));
      
      setDocuments(transformedData);
      setFetched(true);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error fetching documents",
        description: "Could not load your documents. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Auto-fill document name if empty
      if (!documentName) {
        setDocumentName(file.name.split('.')[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!user || !selectedFile || !documentType || !documentName) {
      toast({
        title: "Missing information",
        description: "Please select a file, document type, and provide a name.",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      // 1. Upload file to Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('user_documents')
        .upload(filePath, selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (fileError) {
        throw fileError;
      }
      
      // 2. Create entry in client_documents table
      const documentData = {
        client_id: user.id,
        document_type: documentType,
        document_name: documentName,
        file_path: filePath,
        status: 'Pending'
      };
      
      const { data, error } = await supabase
        .from('client_documents')
        .insert([documentData])
        .select();
      
      if (error) {
        throw error;
      }
      
      // 3. Update local state with transformed data that matches our Document interface
      if (data && data.length > 0) {
        const newDoc: Document = {
          id: data[0].document_id,
          name: data[0].document_name,
          type: data[0].document_type,
          status: data[0].status,
          uploaded_at: data[0].upload_date,
          file_path: data[0].file_path
        };
        
        setDocuments(prev => [newDoc, ...prev]);
      }
      
      // Reset form
      setSelectedFile(null);
      setDocumentType('');
      setDocumentName('');
      
      // Show success message
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded and will be reviewed shortly.",
      });
      
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (documentId: string, filePath: string) => {
    if (!user) return;
    
    try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('client_documents')
        .delete()
        .eq('document_id', documentId);
      
      if (dbError) {
        throw dbError;
      }
      
      // 2. Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user_documents')
        .remove([filePath]);
      
      if (storageError) {
        console.warn("Could not delete file from storage:", storageError);
      }
      
      // 3. Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Document deleted",
        description: "Your document has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from('user_documents')
      .createSignedUrl(filePath, 3600); // URL valid for 1 hour
    
    if (error) {
      toast({
        title: "Error",
        description: "Could not generate download link.",
        variant: "destructive",
      });
      return;
    }
    
    // Open in new tab
    window.open(data.signedUrl, '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-2 w-2 bg-amber-500 rounded-full"></div>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return "Approved";
      case 'rejected':
        return "Rejected";
      default:
        return "Pending Review";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Documents</CardTitle>
        <CardDescription>
          Upload and manage your important documents for your applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upload Form */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Upload New Document</h3>
            
            <div className="grid gap-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="document-name">Document Name</Label>
                  <Input
                    id="document-name"
                    placeholder="Enter document name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
            
            {uploading && (
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
            
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || !documentType || !documentName || uploading}
            >
              {uploading ? (
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
          
          {/* Documents List */}
          <div>
            <h3 className="font-medium mb-4">Your Documents</h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <File className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="border rounded-lg divide-y">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-none">
                          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                            <File className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="truncate">
                              {documentTypes.find(t => t.id === doc.type)?.name || doc.type}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(doc.uploaded_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full text-xs">
                        {getStatusIcon(doc.status)}
                        <span>{getStatusText(doc.status)}</span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => getDocumentUrl(doc.file_path)}
                      >
                        View
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(doc.id, doc.file_path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
        </p>
        <Button variant="outline" onClick={fetchDocuments}>
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
