
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApplicationDetails } from '@/hooks/useApplications';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ChevronLeft, Calendar, GraduationCap, MapPin, Clock, DollarSign, FileText, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ApplicationView() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: application, isLoading, error, refetch } = useApplicationDetails(applicationId || '');
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-medium">Loading Application Details</h3>
      </div>
    );
  }
  
  if (error || !application) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6 pb-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Application Not Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find the application you're looking for. It may have been removed or you don't have access to it.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => navigate('/applications')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-500';
      case 'submitted':
        return 'bg-blue-500';
      case 'under review':
        return 'bg-amber-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusProgress = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 25;
      case 'submitted':
        return 50;
      case 'under review':
        return 75;
      case 'approved':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 25;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <Button 
            variant="ghost"
            onClick={() => navigate('/applications')}
            className="hover:bg-transparent p-0 h-auto mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to applications
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Application Details</h1>
          <div className="flex items-center mt-1">
            <Badge className={`${getStatusColor(application.status)} mr-2`}>
              {application.status}
            </Badge>
            <p className="text-muted-foreground">
              Submitted on {application.submittedAt || application.createdAt}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{application.program.name}</CardTitle>
            <CardDescription>{application.program.university}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span>Program Type:</span>
                  <span className="ml-2 font-medium text-foreground">{application.program.type}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Location:</span>
                  <span className="ml-2 font-medium text-foreground">{application.program.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Duration:</span>
                  <span className="ml-2 font-medium text-foreground">{application.program.duration}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Tuition:</span>
                  <span className="ml-2 font-medium text-foreground">€{application.program.tuition.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Application Status</span>
                  <Badge variant="outline">{application.status}</Badge>
                </div>
                <Progress value={getStatusProgress(application.status)} className="h-2" />
                
                <div className="flex items-center justify-between text-sm mt-4">
                  <span>Payment Status</span>
                  {getPaymentStatusBadge(application.paymentStatus)}
                </div>
                
                <div className="flex items-center justify-between text-sm mt-4">
                  <span>Priority</span>
                  <Badge variant="outline" className={
                    application.priority === "High" ? "bg-red-50 text-red-600 border-red-200" :
                    application.priority === "Medium" ? "bg-blue-50 text-blue-600 border-blue-200" :
                    "bg-green-50 text-green-600 border-green-200"
                  }>
                    {application.priority}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Application Notes</h3>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm">
                      {application.notes || "No notes provided for this application."}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Application Summary</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Application ID</span>
                      <span className="text-sm font-medium">{application.id.substring(0, 8)}...</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created Date</span>
                      <span className="text-sm font-medium">{application.createdAt}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span className="text-sm font-medium">{application.updatedAt}</span>
                    </li>
                    {application.submittedAt && (
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Submission Date</span>
                        <span className="text-sm font-medium">{application.submittedAt}</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <h3 className="text-sm font-medium mb-1">Next Steps</h3>
                  {application.status === 'Draft' && (
                    <p className="text-sm text-muted-foreground">
                      Submit your application to begin the review process.
                    </p>
                  )}
                  {application.status === 'Submitted' && (
                    <p className="text-sm text-muted-foreground">
                      Your application is submitted. Our team will review it shortly.
                    </p>
                  )}
                  {application.status === 'Under Review' && (
                    <p className="text-sm text-muted-foreground">
                      Your application is currently under review. We'll notify you of any updates.
                    </p>
                  )}
                  {application.status === 'Approved' && (
                    <p className="text-sm text-muted-foreground">
                      Congratulations! Your application has been approved. Check your email for next steps.
                    </p>
                  )}
                  {application.status === 'Rejected' && (
                    <p className="text-sm text-muted-foreground">
                      Unfortunately, your application was not accepted. Contact our support team for more information.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="timeline" className="mt-4">
                <div className="relative space-y-0">
                  {application.timeline.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-muted-foreground">No timeline events available.</p>
                    </div>
                  ) : (
                    application.timeline.map((event, index) => (
                      <div key={event.id} className="relative pl-8 pb-8">
                        {/* Timeline line */}
                        {index !== application.timeline.length - 1 && (
                          <div className="absolute left-3 top-3 h-full w-px bg-border"></div>
                        )}
                        
                        {/* Status indicator */}
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          event.status === 'Approved' ? 'bg-green-100' : 
                          event.status === 'Rejected' ? 'bg-red-100' : 
                          'bg-blue-100'
                        }`}>
                          <CheckCircle2 className={`h-4 w-4 ${
                            event.status === 'Approved' ? 'text-green-600' : 
                            event.status === 'Rejected' ? 'text-red-600' : 
                            'text-blue-600'
                          }`} />
                        </div>
                        
                        <div className="mb-1 flex items-baseline justify-between">
                          <h4 className="text-sm font-medium">{event.status}</h4>
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.note || `Application status changed to ${event.status}`}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                {application.documents.length === 0 ? (
                  <div className="py-10 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No documents attached to this application</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/profile')}>
                      Upload Documents
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {application.documents.map((doc: any) => (
                      <div key={doc.document_id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-3" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge className={doc.status === 'Verified' ? 'bg-green-500' : doc.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-5">
            <Button variant="outline" onClick={() => navigate('/applications')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
            {application.status === 'Draft' && (
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600">
                Submit Application
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Program Details</CardTitle>
          </CardHeader>
          <CardContent className="pb-6 space-y-6">
            <div className="aspect-[16/9] w-full bg-cover bg-center rounded-md overflow-hidden" 
                style={{ backgroundImage: `url(${application.program.image})` }} 
            />
            
            <div className="space-y-4">
              <h3 className="font-medium">About the Program</h3>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/programs/${application.program.id}`}>
                  View Program Details
                </Link>
              </Button>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions about your application? Contact our support team.
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/messages">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
