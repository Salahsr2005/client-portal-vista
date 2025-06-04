import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, CheckCircle, Clock, AlertCircle, 
  Building, Globe, GraduationCap, User, CalendarRange,
  CircleDollarSign, PenLine, ArrowLeft, AlertTriangle, Loader2, MessageSquare
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApplicationTimeline from "@/components/applications/ApplicationTimeline";
import { Program } from "@/types/Program";
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useApplicationDetails } from '@/hooks/useApplications';

// Define a type for the detailed application response
interface ProgramDetail {
  id: string;
  name: string;
  university: string;
  location?: string;
  city?: string;
  country?: string;
  image_url?: string;
}

interface ApplicationDetailResponse {
  application_id: string;
  status: string;
  createdAt?: string;
  created_at?: string;
  notes?: string;
  programs?: ProgramDetail;
  program?: ProgramDetail; // Added alternative property name
  timeline?: Array<{date: string; status: string; note?: string}>;
  documents?: Array<{name: string; status: string; uploaded_at: string}>;
  submittedAt?: string;
  updatedAt?: string;
  priority?: string;
  paymentStatus?: string;
}

export default function ApplicationView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Use the custom hook to fetch application details
  const { data: applicationDetail, isLoading: detailLoading, error } = useApplicationDetails(id || '');
  
  // Update query to use proper format 
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('applications').select('*');
      if (error) throw error;
      return data;
    }
  });
  
  // Additional query to fetch program details separately
  const { data: programDetail, isLoading: programLoading } = useQuery({
    queryKey: ['programDetail', id || ''],
    queryFn: async () => {
      if (!id || !applicationDetail) return null;
      
      try {
        // Use the correct property name - either programs or program
        const programId = applicationDetail.programs?.id || applicationDetail.program?.id;
        if (!programId) return null;
        
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('id', programId)
          .single();
        
        if (error) throw error;
        
        return {
          id: data.id,
          name: data.name,
          university: data.university,
          location: `${data.city || ''}, ${data.country || ''}`,
          image: data.image_url || `/images/flags/${data.country?.toLowerCase()}.svg`,
        };
      } catch (error) {
        console.error("Error fetching program:", error);
        return null;
      }
    },
    enabled: !!id && !!applicationDetail
  });
  
  const [formData, setFormData] = useState({
    programId: '',
    personalStatement: '',
    transcriptPath: '',
    additionalDocumentsPath: '',
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    file: null as File | null,
  });
  
  // Check if the application exists
  const application = applications && Array.isArray(applications) ? applications.find((app: any) => app.id === id) : null;
  
  // Check if the user has an approved application
  const hasApprovedOrReviewingApplication = applications && Array.isArray(applications) ? 
    applications.some((app: any) => app.status?.toLowerCase() === 'approved' || app.status?.toLowerCase() === 'in review') : false;
  
  useEffect(() => {
    if (application) {
      setFormData({
        programId: application.program_id || '',
        personalStatement: '',
        transcriptPath: '',
        additionalDocumentsPath: '',
        agreedToTerms: false,
      });
    }
  }, [application]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreedToTerms: checked }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocument(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };
  
  const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDocument(prev => ({
      ...prev,
      name: e.target.value
    }));
  };
  
  const handleUploadDocument = async () => {
    if (!newDocument.name || !newDocument.file) {
      toast({
        title: "Missing information",
        description: "Please provide both document name and file",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload logic would go here
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });
      
      setShowUploadDialog(false);
      setNewDocument({ name: '', file: null });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your application",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to proceed",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (application) {
        // Update existing application
        const { error } = await supabase
          .from('applications')
          .update({
            program_id: formData.programId,
            notes: formData.personalStatement,
            updated_at: new Date().toISOString()
          })
          .eq('application_id', id);
          
        if (error) throw error;
        
        toast({
          title: "Application updated",
          description: "Your application has been updated successfully",
        });
      } else {
        // Create new application
        const { error } = await supabase
          .from('applications')
          .insert({
            program_id: formData.programId,
            notes: formData.personalStatement,
            client_id: user.id,
            status: 'Draft'
          });
          
        if (error) throw error;
        
        toast({
          title: "Application submitted",
          description: "Your application has been submitted successfully",
        });
      }
      
      // Redirect to applications page
      navigate('/applications');
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (applicationsLoading || detailLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading application...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-8 px-4"
      >
        <Card className="max-w-2xl mx-auto border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertCircle className="mr-2" />
              Error Loading Application
            </CardTitle>
            <CardDescription>
              We encountered an issue while trying to load your application details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try again later or contact support if the issue persists.</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/applications')}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Applications
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto py-8 px-4"
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view and submit applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // If we have application detail, show the detailed view
  if (applicationDetail) {
    // Create a safe version of applicationDetail with proper type checking
    const safeAppDetail = applicationDetail as unknown as ApplicationDetailResponse;
    
    // Combine program data from both queries to ensure we have the complete information
    const programData = {
      id: safeAppDetail.programs?.id || safeAppDetail.program?.id || programDetail?.id || '',
      name: safeAppDetail.programs?.name || safeAppDetail.program?.name || programDetail?.name || "Unknown Program",
      university: safeAppDetail.programs?.university || safeAppDetail.program?.university || programDetail?.university || "Unknown University",
      location: 
        safeAppDetail.programs?.location || safeAppDetail.program?.location ||
        (safeAppDetail.programs?.city && safeAppDetail.programs?.country 
          ? `${safeAppDetail.programs.city}, ${safeAppDetail.programs.country}` 
          : (safeAppDetail.program?.city && safeAppDetail.program?.country 
            ? `${safeAppDetail.program.city}, ${safeAppDetail.program.country}`
            : programDetail?.location || "Unknown Location")),
      image: safeAppDetail.programs?.image_url || safeAppDetail.program?.image_url || programDetail?.image || `/images/flags/generic.svg`
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto py-8 px-4"
      >
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/applications')}
            className="mr-4 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Applications
          </Button>
          <h1 className="text-2xl font-bold">Application Details</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Application Information */}
          <div className="col-span-2">
            <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-background">
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-purple-500" />
                  Application #{(safeAppDetail.application_id || "").substring(0, 8)}
                </CardTitle>
                <CardDescription>
                  Submitted on {safeAppDetail.createdAt || safeAppDetail.created_at || new Date().toISOString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="mb-4 w-full justify-start">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    {/* Program Information */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-card/40 rounded-xl border"
                    >
                      <div 
                        className="w-16 h-16 rounded-md bg-cover bg-center shrink-0 shadow-md"
                        style={{ backgroundImage: `url(${programData.image})` }}
                      />
                      <div>
                        <h3 className="font-medium">{programData.name}</h3>
                        <p className="text-sm text-muted-foreground">{programData.university}</p>
                        <p className="text-sm text-muted-foreground">{programData.location}</p>
                      </div>
                    </motion.div>
                    
                    {/* Application Notes */}
                    {safeAppDetail.notes && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6"
                      >
                        <h3 className="font-medium mb-2 flex items-center">
                          <PenLine className="mr-2 h-4 w-4 text-muted-foreground" />
                          Notes
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 text-sm border">
                          {safeAppDetail.notes}
                        </div>
                      </motion.div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="documents">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {safeAppDetail.documents && safeAppDetail.documents.length > 0 ? (
                        safeAppDetail.documents.map((doc, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-purple-500 mr-3" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant={doc.status === 'Verified' ? 'default' : doc.status === 'Rejected' ? 'destructive' : 'outline'}
                              className={doc.status === 'Verified' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                            >
                              {doc.status}
                            </Badge>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="mx-auto h-10 w-10 opacity-20 mb-3" />
                          <p>No documents uploaded yet</p>
                          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="mt-4">
                                Upload Documents
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upload Document</DialogTitle>
                                <DialogDescription>
                                  Add a new document to your application
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="docName">Document Name</Label>
                                  <Input 
                                    id="docName" 
                                    value={newDocument.name} 
                                    onChange={handleDocumentNameChange}
                                    placeholder="e.g., Passport, Transcript" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="docFile">File</Label>
                                  <Input 
                                    id="docFile" 
                                    type="file" 
                                    onChange={handleFileChange}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setShowUploadDialog(false)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleUploadDocument} 
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Uploading...
                                    </>
                                  ) : "Upload"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="timeline">
                    {/* Application Timeline */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-2"
                    >
                      <ApplicationTimeline 
                        events={safeAppDetail.timeline || []}
                        currentStatus={safeAppDetail.status || "Draft"}
                      />
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-1"
          >
            <Card className="sticky top-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/5">
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge 
                      className={
                        safeAppDetail.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                        safeAppDetail.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                        safeAppDetail.status === 'In Review' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }
                    >
                      {safeAppDetail.status || "Draft"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Submitted On</span>
                    <span className="font-medium">{safeAppDetail.submittedAt || safeAppDetail.createdAt || safeAppDetail.created_at || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{safeAppDetail.updatedAt || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Priority</span>
                    <Badge variant="outline" className={
                      safeAppDetail.priority === 'High' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                      safeAppDetail.priority === 'Medium' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                      'border-green-200 text-green-700 bg-green-50'
                    }>
                      {safeAppDetail.priority || "Normal"}
                    </Badge>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CircleDollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    Payment Status
                  </h4>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {safeAppDetail.paymentStatus === 'Completed' ? 'Paid' : 
                         safeAppDetail.paymentStatus === 'Partial' ? 'Partially Paid' : 
                         'Payment Required'}
                      </span>
                      <Badge 
                        variant={
                          safeAppDetail.paymentStatus === 'Completed' ? 'default' : 
                          safeAppDetail.paymentStatus === 'Partial' ? 'outline' : 
                          'destructive'
                        }
                        className={
                          safeAppDetail.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' : ''
                        }
                      >
                        {safeAppDetail.paymentStatus || "Pending"}
                      </Badge>
                    </div>
                    
                    {(!safeAppDetail.paymentStatus || safeAppDetail.paymentStatus !== 'Completed') && (
                      <Button variant="default" className="w-full mt-3 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 transition-colors">
                        Complete Payment
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Need help with your application?
                  </p>
                  <Button variant="outline" className="w-full group">
                    <MessageSquare className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  // If there's no detail but there's an application in the list
  if (hasApprovedOrReviewingApplication) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-8 px-4"
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Application Submitted
            </CardTitle>
            <CardDescription>You have already submitted an application and it is under review. You cannot submit another application at this time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/applications')} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              View Applications
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Default view for new or editable applications
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-8 px-4"
    >
      <Card className="max-w-2xl mx-auto shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-background">
          <CardTitle>{application ? 'Update Application' : 'Submit Application'}</CardTitle>
          <CardDescription>Fill out the form below to submit your application.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="programId">Program ID</Label>
              <Input 
                type="text" 
                id="programId" 
                name="programId" 
                value={formData.programId} 
                onChange={handleChange} 
                placeholder="Enter program ID" 
              />
            </div>
            <div>
              <Label htmlFor="personalStatement">Personal Statement</Label>
              <Textarea 
                id="personalStatement" 
                name="personalStatement" 
                value={formData.personalStatement} 
                onChange={handleChange} 
                placeholder="Write your personal statement" 
              />
            </div>
            <div>
              <Label htmlFor="transcriptPath">Transcript Path</Label>
              <Input 
                type="text" 
                id="transcriptPath" 
                name="transcriptPath" 
                value={formData.transcriptPath} 
                onChange={handleChange} 
                placeholder="Enter transcript path" 
              />
            </div>
            <div>
              <Label htmlFor="additionalDocumentsPath">Additional Documents Path</Label>
              <Input 
                type="text" 
                id="additionalDocumentsPath" 
                name="additionalDocumentsPath" 
                value={formData.additionalDocumentsPath} 
                onChange={handleChange} 
                placeholder="Enter additional documents path" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreedToTerms" 
                  checked={formData.agreedToTerms} 
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="agreedToTerms">I agree to the terms and conditions</Label>
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                application ? 'Update Application' : 'Submit Application'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
