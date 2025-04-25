import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  FileText, 
  MoreVertical, 
  Search, 
  Filter, 
  ArrowUpDown, 
  FileCheck, 
  FileClock, 
  FileX,
  Plus,
  Loader2
} from "lucide-react";
import { useApplications } from "@/hooks/useApplications";
import { useToast } from "@/hooks/use-toast";

// Application status badge styling helper function
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "pending":
    case "draft":
    case "in progress":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    case "rejected":
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

// Status icon helper function
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return <FileCheck className="h-4 w-4 mr-1" />;
    case "pending":
    case "draft":
    case "in progress":
      return <FileClock className="h-4 w-4 mr-1" />;
    case "rejected":
    case "cancelled":
      return <FileX className="h-4 w-4 mr-1" />;
    default:
      return <FileText className="h-4 w-4 mr-1" />;
  }
};

export default function Applications() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const { data: applications = [], isLoading, error } = useApplications();
  const { toast } = useToast();
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load applications. Please try again.",
      variant: "destructive",
    });
  }
  
  // Filter applications based on search term and status filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.program.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && app.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <Button 
          onClick={() => navigate("/applications/new")}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Application
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>
            Manage and track your program applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 sm:mb-0">
                <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
                <TabsTrigger value="approved" onClick={() => setFilter("approved")}>Approved</TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setFilter("pending")}>Pending</TabsTrigger>
                <TabsTrigger value="rejected" onClick={() => setFilter("rejected")}>Rejected</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search applications..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuItem>Upcoming Deadline</DropdownMenuItem>
                    <DropdownMenuItem>Past Deadline</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">ID</TableHead>
                      <TableHead>Program Name</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="hidden md:table-cell w-[120px]">Location</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-[200px] text-center">
                          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                          <div className="mt-2 text-sm text-muted-foreground">Loading applications...</div>
                        </TableCell>
                      </TableRow>
                    ) : filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FileText className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                            <h3 className="text-lg font-medium">No applications found</h3>
                            <p className="text-muted-foreground mt-1 mb-4">You haven't submitted any applications yet</p>
                            <Button onClick={() => navigate("/applications/new")}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create New Application
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>{app.program}</TableCell>
                          <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(app.status)}`} variant="outline">
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{app.destination}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Application</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Withdraw
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Similar content for other tabs, but we'll keep it simpler */}
            <TabsContent value="approved" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">ID</TableHead>
                      <TableHead>Program Name</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="hidden md:table-cell w-[120px]">Location</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.filter((app) => app.status === "approved").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-[200px] text-center">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.filter((app) => app.status === "approved").map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>{app.program}</TableCell>
                          <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(app.status)}`} variant="outline">
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{app.destination}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Application</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Withdraw
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">ID</TableHead>
                      <TableHead>Program Name</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="hidden md:table-cell w-[120px]">Location</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.filter((app) => app.status === "pending").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-[200px] text-center">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.filter((app) => app.status === "pending").map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>{app.program}</TableCell>
                          <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(app.status)}`} variant="outline">
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{app.destination}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Application</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Withdraw
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="rejected" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">ID</TableHead>
                      <TableHead>Program Name</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="hidden md:table-cell w-[120px]">Location</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.filter((app) => app.status === "rejected").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-[200px] text-center">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.filter((app) => app.status === "rejected").map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>{app.program}</TableCell>
                          <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(app.status)}`} variant="outline">
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{app.destination}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Application</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Withdraw
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${filteredApplications.length} of ${applications.length} applications`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
