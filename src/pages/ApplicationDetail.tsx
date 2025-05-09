
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationDetails } from '@/hooks/useApplications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ApplicationTimeline from '@/components/applications/ApplicationTimeline';
import { useUserPaymentStatus } from '@/hooks/useUserPaymentStatus';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building,
  Calendar,
  CircleDollarSign,
  FileText,
  Clock,
  MapPin,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  FileQuestion,
  Loader2,
} from 'lucide-react';

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('details');
  const { data: applicationDetails, isLoading, error } = useApplicationDetails(id || '');
  const { data: paymentStatus } = useUserPaymentStatus();
  const isPaid = paymentStatus?.isPaid || false;
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'under review':
      case 'in review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'under review':
      case 'in review':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'draft':
        return <FileText className="h-5 w-5 text-slate-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (error || !applicationDetails) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            Failed to load application details. Please try again or contact support.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/applications')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="container max-w-5xl mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/applications')} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Application Details</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Submitted on {applicationDetails.submittedAt || applicationDetails.createdAt}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            className={cn(
              "text-sm px-3 py-1 shadow-sm flex items-center gap-1.5 capitalize",
              getStatusColor(applicationDetails.status)
            )}
          >
            {getStatusIcon(applicationDetails.status)}
            {applicationDetails.status}
          </Badge>
          
          <Badge 
            variant="outline" 
            className={cn(
              "bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1.5",
              applicationDetails.priority === "High" ? "bg-red-50 text-red-700 border-red-200" :
                applicationDetails.priority === "Medium" ? "bg-orange-50 text-orange-700 border-orange-200" :
                  "bg-blue-50 text-blue-700 border-blue-200"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {applicationDetails.priority} Priority
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content area - 2/3 width */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50/50 dark:from-indigo-950/30 dark:to-violet-950/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Program Information</CardTitle>
                  <CardDescription>Details about the program you're applying to</CardDescription>
                </div>
                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">
                      {applicationDetails.program.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <Building className="h-4 w-4 mr-1.5 text-indigo-500" />
                      {applicationDetails.program.university}
                    </div>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
                      {applicationDetails.program.location}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1.5">Program Details</h4>
                    <Separator className="mb-3" />
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                          <GraduationCap className="h-4 w-4 mr-1.5 text-indigo-500" />
                          Degree Level
                        </span>
                        <span className="text-sm font-medium">
                          {applicationDetails.program.type}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                          <Clock className="h-4 w-4 mr-1.5 text-indigo-500" />
                          Duration
                        </span>
                        <span className="text-sm font-medium">
                          {applicationDetails.program.duration}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                          <CircleDollarSign className="h-4 w-4 mr-1.5 text-indigo-500" />
                          Tuition
                        </span>
                        <span className="text-sm font-medium">
                          €{applicationDetails.program.tuition.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1.5">Application Info</h4>
                    <Separator className="mb-3" />
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                          <Calendar className="h-4 w-4 mr-1.5 text-indigo-500" />
                          Created
                        </span>
                        <span className="text-sm font-medium">
                          {applicationDetails.createdAt}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                          <Clock className="h-4 w-4 mr-1.5 text-indigo-500" />
                          Last Updated
                        </span>
                        <span className="text-sm font-medium">
                          {applicationDetails.updatedAt}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                          <CircleDollarSign className="h-4 w-4 mr-1.5 text-indigo-500" />
                          Payment Status
                        </span>
                        <Badge 
                          variant="outline" 
                          className={
                            applicationDetails.paymentStatus === "Completed" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {applicationDetails.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {applicationDetails.notes && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1.5">Notes</h4>
                      <Separator className="mb-3" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                        {applicationDetails.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="bg-slate-100 dark:bg-slate-800/40 p-1 h-auto mb-4">
              <TabsTrigger 
                value="timeline"
                className={`text-sm px-4 py-2 ${activeTab === "timeline" ? "bg-white dark:bg-slate-800 shadow-sm" : ""}`}
              >
                Timeline
              </TabsTrigger>
              <TabsTrigger 
                value="documents"
                className={`text-sm px-4 py-2 ${activeTab === "documents" ? "bg-white dark:bg-slate-800 shadow-sm" : ""}`}
              >
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="support"
                className={`text-sm px-4 py-2 ${activeTab === "support" ? "bg-white dark:bg-slate-800 shadow-sm" : ""}`}
                disabled={!isPaid}
              >
                Support & FAQ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-0">
              <ApplicationTimeline 
                events={applicationDetails.timeline} 
                currentStatus={applicationDetails.status} 
              />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0">
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Required Documents</CardTitle>
                      <CardDescription>Documents needed for your application</CardDescription>
                    </div>
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {applicationDetails.documents && applicationDetails.documents.length > 0 ? (
                    <div className="space-y-4">
                      {applicationDetails.documents.map((doc: any) => (
                        <div key={doc.document_id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium">{doc.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              doc.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                              doc.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-amber-100 text-amber-800 border-amber-200'
                            }
                          >
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full inline-flex mx-auto mb-3">
                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
                      <p className="text-muted-foreground">
                        Documents for your application will appear here once they've been processed.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="support" className="mt-0">
              {isPaid ? (
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Support & FAQ</CardTitle>
                        <CardDescription>Frequently asked questions about the application process</CardDescription>
                      </div>
                      <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/30">
                        <MessageSquare className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">How long does the application process take?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          The application process typically takes 4-6 weeks from submission to final decision. This includes document verification, academic assessment, and final approval.
                        </p>
                      </div>
                      
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">What happens after my application is approved?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Once your application is approved, you'll receive an acceptance letter. Next steps include paying any remaining fees, arranging accommodation, and applying for a student visa if needed.
                        </p>
                      </div>
                      
                      <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Can I update my documents after submission?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Yes, you can submit updated documents through your application portal. Please notify our support team after uploading new documents to ensure they're reviewed promptly.
                        </p>
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-6">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                          <FileQuestion className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300">Premium Support Access</h3>
                          <p className="text-sm text-amber-800/80 dark:text-amber-500">
                            Complete your payment to unlock premium support features
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900/50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          What's included with premium support
                        </h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 ml-6 list-disc">
                          <li>Full FAQ access with detailed guidance</li>
                          <li>Priority email support with 24-hour response time</li>
                          <li>Document review assistance</li>
                          <li>Application status updates</li>
                        </ul>
                      </div>
                      
                      <div className="flex justify-center">
                        <Button 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md"
                          onClick={() => navigate('/payments')}
                        >
                          <CircleDollarSign className="h-4 w-4 mr-2" />
                          Complete Payment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50">
              <CardTitle className="text-base">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {applicationDetails.status === 'Draft' && (
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm">
                      Complete your application and submit it.
                    </AlertDescription>
                  </Alert>
                )}
                
                {applicationDetails.paymentStatus === 'Pending' && (
                  <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <CircleDollarSign className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-sm">
                      Payment needs to be processed.
                      <Button variant="link" className="h-auto p-0 ml-1 text-amber-800 underline" onClick={() => navigate('/payments')}>
                        Pay now
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                
                {applicationDetails.status === 'Submitted' && applicationDetails.paymentStatus === 'Completed' && (
                  <Alert className="bg-indigo-50 border-indigo-200 text-indigo-800">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <AlertDescription className="text-sm">
                      Application is being reviewed by our team.
                    </AlertDescription>
                  </Alert>
                )}
                
                {applicationDetails.status === 'Approved' && (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm">
                      Congratulations! Your application has been approved.
                    </AlertDescription>
                  </Alert>
                )}
                
                {applicationDetails.status === 'Rejected' && (
                  <Alert className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm">
                      Your application has been rejected. Please check feedback.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t flex justify-center">
              <Button 
                variant="outline" 
                className="w-full border-indigo-200 hover:bg-indigo-50 text-indigo-700"
                onClick={() => navigate('/programs')}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Browse More Programs
              </Button>
            </CardFooter>
          </Card>
          
          {applicationDetails.program.image && (
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={applicationDetails.program.image} 
                  alt={applicationDetails.program.name} 
                  className="w-full aspect-video object-cover"
                />
              </CardContent>
            </Card>
          )}
          
          {/* Suggested next application */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
              <CardTitle className="text-base">Need help? Contact us</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="p-2 rounded-full bg-indigo-100 inline-flex mx-auto">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Our advisors are ready to assist you with your application process
                </p>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md">
                  Get Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
