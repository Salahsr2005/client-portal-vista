
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";

// Mock application data
const applications = [
  {
    id: "app-001",
    programName: "Algerian-French Exchange Program",
    university: "University of Paris",
    submissionDate: "2023-05-15",
    status: "approved",
    nextStep: "Complete visa application by June 10"
  },
  {
    id: "app-002",
    programName: "Summer Research in Renewable Energy",
    university: "University of Oran",
    submissionDate: "2023-06-20",
    status: "rejected",
    reason: "Insufficient research background"
  },
  {
    id: "app-003",
    programName: "English Language Immersion",
    university: "Constantine University",
    submissionDate: "2023-06-25",
    status: "pending",
    expectedResponse: "July 15"
  },
  {
    id: "app-004",
    programName: "Technology Entrepreneurship Workshop",
    university: "USTHB",
    submissionDate: "2023-07-01",
    status: "in_review",
    expectedResponse: "July 20"
  }
];

const ApplicationCard = ({ application }: { application: any }) => {
  let statusBadge;
  
  switch (application.status) {
    case "approved":
      statusBadge = <Badge className="bg-green-500">Approved</Badge>;
      break;
    case "rejected":
      statusBadge = <Badge variant="destructive">Rejected</Badge>;
      break;
    case "pending":
      statusBadge = <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      break;
    case "in_review":
      statusBadge = <Badge variant="secondary">In Review</Badge>;
      break;
    default:
      statusBadge = <Badge variant="outline">Unknown</Badge>;
  }
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{application.programName}</CardTitle>
            <CardDescription>{application.university}</CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Submitted: {application.submissionDate}</span>
          </div>
          
          {application.status === "approved" && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-300">Next steps:</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{application.nextStep}</p>
                </div>
              </div>
            </div>
          )}
          
          {application.status === "rejected" && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">Reason:</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{application.reason}</p>
                </div>
              </div>
            </div>
          )}
          
          {(application.status === "pending" || application.status === "in_review") && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-700 dark:text-yellow-300">Expected response by:</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">{application.expectedResponse}</p>
                </div>
              </div>
            </div>
          )}
          
          <Button variant="outline" className="mt-4 w-full" size="sm">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Applications</h1>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredApplications.length > 0 ? (
              filteredApplications.map(application => (
                <ApplicationCard key={application.id} application={application} />
              ))
            ) : (
              <div className="py-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No applications found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any applications with this status.
                </p>
                <Button className="mt-6" variant="outline">
                  Browse Programs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApplicationsPage;
