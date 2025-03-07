
import { useState } from "react";
import { 
  FileText, 
  FilePlus, 
  Check, 
  Clock, 
  AlertTriangle, 
  Filter,
  SortAsc,
  Search,
  FileQuestion,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Application data
const applications = [
  {
    id: 1, 
    program: "Master's in Computer Science",
    university: "Stanford University",
    deadline: "2023-09-15",
    status: "In Review",
    documents: [
      { name: "Personal Statement", status: "completed" },
      { name: "Resume/CV", status: "completed" },
      { name: "Transcripts", status: "pending" },
      { name: "Letters of Recommendation", status: "completed" },
      { name: "Test Scores", status: "completed" }
    ],
    completionPercentage: 85,
    priority: "high"
  },
  {
    id: 2, 
    program: "MBA",
    university: "Harvard Business School",
    deadline: "2023-10-01",
    status: "Documents Required",
    documents: [
      { name: "Personal Statement", status: "completed" },
      { name: "Resume/CV", status: "completed" },
      { name: "Transcripts", status: "pending" },
      { name: "Letters of Recommendation", status: "pending" },
      { name: "Test Scores", status: "not started" }
    ],
    completionPercentage: 60,
    priority: "medium"
  },
  {
    id: 3, 
    program: "Ph.D. in Computer Engineering",
    university: "MIT",
    deadline: "2023-12-15",
    status: "Not Started",
    documents: [
      { name: "Research Proposal", status: "not started" },
      { name: "Resume/CV", status: "not started" },
      { name: "Transcripts", status: "not started" },
      { name: "Letters of Recommendation", status: "not started" },
      { name: "Test Scores", status: "not started" }
    ],
    completionPercentage: 0,
    priority: "low"
  },
  {
    id: 4, 
    program: "MS in Data Science",
    university: "UC Berkeley",
    deadline: "2023-11-30",
    status: "Submitted",
    documents: [
      { name: "Personal Statement", status: "completed" },
      { name: "Resume/CV", status: "completed" },
      { name: "Transcripts", status: "completed" },
      { name: "Letters of Recommendation", status: "completed" },
      { name: "Test Scores", status: "completed" }
    ],
    completionPercentage: 100,
    priority: "medium"
  },
];

// Get badge for application status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Submitted":
      return <Badge className="bg-green-600">Submitted</Badge>;
    case "In Review":
      return <Badge className="bg-primary">In Review</Badge>;
    case "Documents Required":
      return <Badge variant="destructive">Documents Required</Badge>;
    case "Not Started":
      return <Badge variant="outline">Not Started</Badge>;
    case "Accepted":
      return <Badge className="bg-green-600">Accepted</Badge>;
    case "Rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSort, setSelectedSort] = useState("deadline");
  
  // Filter applications based on search query and active tab
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.program.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.university.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && app.status.toLowerCase().includes(activeTab.toLowerCase());
  });
  
  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (selectedSort === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (selectedSort === "university") {
      return a.university.localeCompare(b.university);
    } else if (selectedSort === "completion") {
      return b.completionPercentage - a.completionPercentage;
    }
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          New Application
        </Button>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track and manage your active college and university applications
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-[160px]">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                    <SelectItem value="university">University (A-Z)</SelectItem>
                    <SelectItem value="completion">Completion (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search applications..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="review">In Review</TabsTrigger>
                <TabsTrigger value="document">Pending Docs</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                {sortedApplications.length > 0 ? (
                  sortedApplications.map((application) => (
                    <div key={application.id} className="p-4 rounded-lg border transition-colors hover:bg-muted/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-lg">{application.program}</h4>
                          <p className="text-sm text-muted-foreground">{application.university}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {getStatusBadge(application.status)}
                            <div className="text-xs flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>
                                Deadline: {new Date(application.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full md:w-1/3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Completion</span>
                            <span>{application.completionPercentage}%</span>
                          </div>
                          <Progress value={application.completionPercentage} className="h-2" />
                        </div>
                        
                        <Button variant="outline" size="sm" className="md:w-auto">
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {application.documents.map((doc, index) => (
                          <div key={index} className="text-center">
                            <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center ${
                              doc.status === 'completed' 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                                : doc.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' 
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              {doc.status === 'completed' 
                                ? <Check className="h-4 w-4" /> 
                                : doc.status === 'pending' 
                                  ? <Clock className="h-4 w-4" /> 
                                  : <FileQuestion className="h-4 w-4" />}
                            </div>
                            <p className="text-xs mt-1">{doc.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium">No applications found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery 
                        ? "No applications match your search criteria" 
                        : "You haven't started any applications yet"}
                    </p>
                    <Button>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Start a New Application
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>
              Advice for successful applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-1">Complete Your Profile</h4>
              <p className="text-xs text-muted-foreground">
                A complete profile makes application submission faster.
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-1">Track Deadlines</h4>
              <p className="text-xs text-muted-foreground">
                Submit applications at least 2 days before the deadline.
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-1">Review Documents</h4>
              <p className="text-xs text-muted-foreground">
                Proofread all documents before final submission.
              </p>
            </div>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Application Guidelines
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
