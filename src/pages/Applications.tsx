
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, Clock, Check, X, AlertTriangle, 
  Calendar, ArrowRight, Download, ExternalLink 
} from 'lucide-react';

const applications = [
  {
    id: "APP-2023-001",
    program: "Algerian-French Exchange Program",
    status: "In Review",
    submitted: "July 25, 2023",
    deadline: "July 30, 2023",
    progress: 75,
    statusColor: "bg-amber-500",
    documents: [
      { name: "Passport Copy", status: "approved" },
      { name: "Academic Transcript", status: "approved" },
      { name: "French Language Certificate", status: "pending" },
      { name: "Recommendation Letter", status: "approved" },
    ]
  },
  {
    id: "APP-2023-008",
    program: "Summer Research in Renewable Energy",
    status: "Rejected",
    submitted: "May 10, 2023",
    deadline: "May 15, 2023",
    progress: 100,
    statusColor: "bg-red-500",
    documents: [
      { name: "Academic Transcript", status: "approved" },
      { name: "Research Proposal", status: "rejected" },
      { name: "Recommendation Letter", status: "approved" },
    ]
  },
  {
    id: "APP-2023-012",
    program: "English Language Immersion",
    status: "Approved",
    submitted: "September 10, 2023",
    deadline: "September 15, 2023",
    progress: 100,
    statusColor: "bg-green-500",
    documents: [
      { name: "Language Assessment Test", status: "approved" },
      { name: "Valid ID", status: "approved" },
    ]
  },
  {
    id: "APP-2023-015",
    program: "Technology Entrepreneurship Workshop",
    status: "Draft",
    submitted: "-",
    deadline: "July 15, 2023",
    progress: 30,
    statusColor: "bg-blue-500",
    documents: [
      { name: "Business Idea Pitch", status: "draft" },
      { name: "CV", status: "draft" },
      { name: "Motivation Letter", status: "not_started" },
    ]
  },
];

const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = React.useState("all");
  
  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "active" && ["In Review", "Draft"].includes(app.status)) return true;
    if (activeTab === "approved" && app.status === "Approved") return true;
    if (activeTab === "rejected" && app.status === "Rejected") return true;
    return false;
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Review": return <Clock className="h-4 w-4" />;
      case "Approved": return <Check className="h-4 w-4" />;
      case "Rejected": return <X className="h-4 w-4" />;
      case "Draft": return <FileText className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <Check className="h-4 w-4 text-green-500" />;
      case "rejected": return <X className="h-4 w-4 text-red-500" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
      case "draft": return <FileText className="h-4 w-4 text-blue-500" />;
      case "not_started": return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          New Application
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Showing all your applications across all programs and statuses.
          </p>
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Applications that are currently being processed or are in draft status.
          </p>
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Your successful applications that have been approved.
          </p>
        </TabsContent>
        <TabsContent value="rejected" className="mt-4">
          <p className="text-muted-foreground mb-6">
            Applications that were not approved. You may be able to reapply for some programs.
          </p>
        </TabsContent>
      </Tabs>
      
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-6">You don't have any applications in this category.</p>
          <Button>Create New Application</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{application.program}</CardTitle>
                    <CardDescription>Application ID: {application.id}</CardDescription>
                  </div>
                  <Badge className={`${application.statusColor}`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(application.status)}
                      {application.status}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">{application.submitted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-medium">{application.deadline}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Application Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress value={application.progress} className="h-2" />
                      <span className="text-sm font-medium">{application.progress}%</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {application.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          {getDocumentStatusIcon(doc.status)}
                          <span>{doc.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          {doc.status === "draft" || doc.status === "not_started" ? 
                            "Upload" : "View"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-12 bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Application Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Step-by-step instructions on how to complete your applications successfully.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Guide
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Download templates for motivation letters, CVs, and other required documents.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Templates
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Answers to common questions about the application process.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" />
                View FAQ
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
