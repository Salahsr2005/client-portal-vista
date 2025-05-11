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
  CircleDollarSign, PenLine, ArrowLeft, AlertTriangle, Loader2
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApplicationTimeline from "@/components/applications/ApplicationTimeline";

export default function ApplicationView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Update query to use proper format 
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('applications').select('*');
      if (error) throw error;
      return data;
    }
  });
  
  // Update query to use proper format 
  const { data: applicationDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['applicationDetail', id || ''],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          programs(id, name, university, location, image_url)
        `)
        .eq('application_id', id || '')
        .single();
      
      if (error) throw error;
      
      // Transform the response to include program as a property
      return {
        ...data,
        program: data.programs ? {
          id: data.programs.id,
          name: data.programs.name,
          university: data.programs.university,
          location: data.programs.location,
          image: data.programs.image_url,
        } : null
      };
    },
    enabled: !!id
  });
  
  const [formData, setFormData] = useState({
    programId: '',
    personalStatement: '',
    transcriptPath: '',
    additionalDocumentsPath: '',
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if the application exists
  const application = applications && Array.isArray(applications) ? applications.find((app: any) => app.id === id) : null;
  
  // Check if the user has an approved application
  const hasApprovedOrReviewingApplication = applications && Array.isArray(applications) ? 
    applications.some((app: any) => app.status?.toLowerCase() === 'approved' || app.status?.toLowerCase() === 'in review') : false;
  
  useEffect(() => {
    if (application) {
      setFormData({
        programId: application.program || '',
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
  
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view and submit applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we have application detail, show the detailed view
  if (applicationDetail) {
    // Create a safe version of applicationDetail with proper type checking
    const safeAppDetail = applicationDetail as {
      id?: string;
      application_id?: string;
      status?: string;
      createdAt?: string;
      notes?: string;
      program?: {
        id?: string;
        name?: string;
        university?: string;
        location?: string;
        image?: string;
      };
      timeline?: Array<{date: string; status: string; note?: string}>;
      documents?: Array<{name: string; status: string; uploaded_at: string}>;
      submittedAt?: string;
      updatedAt?: string;
      priority?: string;
      paymentStatus?: string;
    };

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/applications')}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Button>
          <h1 className="text-2xl font-bold">Application Details</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Application Information */}
          <div className="col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-purple-500" />
                  Application #{(safeAppDetail.application_id || safeAppDetail.id || "").substring(0, 8)}
                </CardTitle>
                <CardDescription>
                  Submitted on {safeAppDetail.createdAt || new Date().toISOString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Program Information */}
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-md bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${safeAppDetail.program?.image || '/placeholder.svg'})` }}
                    />
                    <div>
                      <h3 className="font-medium">{safeAppDetail.program?.name || "Unknown Program"}</h3>
                      <p className="text-sm text-muted-foreground">{safeAppDetail.program?.university || "Unknown University"}</p>
                      <p className="text-sm text-muted-foreground">{safeAppDetail.program?.location || "Unknown Location"}</p>
                    </div>
                  </div>
                  
                  {/* Application Timeline */}
                  <ApplicationTimeline 
                    events={safeAppDetail.timeline || []}
                    currentStatus={safeAppDetail.status || "Draft"}
                  />
                  
                  {/* Application Notes */}
                  {safeAppDetail.notes && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Notes</h3>
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 text-sm">
                        {safeAppDetail.notes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Documents Section */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Required documents for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {safeAppDetail.documents && safeAppDetail.documents.length > 0 ? (
                    safeAppDetail.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
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
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-10 w-10 opacity-20 mb-3" />
                      <p>No documents uploaded yet</p>
                      <Button variant="outline" className="mt-4">
                        Upload Documents
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
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
                    <span className="font-medium">{safeAppDetail.submittedAt || safeAppDetail.createdAt || "N/A"}</span>
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
                  <h4 className="font-medium mb-2">Payment Status</h4>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
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
                      <Button variant="default" className="w-full mt-3 bg-gradient-to-r from-violet-600 to-purple-700">
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
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // If there's no detail but there's an application in the list
  if (hasApprovedOrReviewingApplication) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Application Submitted</CardTitle>
            <CardDescription>You have already submitted an application and it is under review. You cannot submit another application at this time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/applications')}>View Applications</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Default view for new or editable applications
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{application ? 'Update Application' : 'Submit Application'}</CardTitle>
          <CardDescription>Fill out the form below to submit your application.</CardDescription>
        </CardHeader>
        <CardContent>
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
            <Button type="submit" disabled={isSubmitting}>
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
    </div>
  );
}
