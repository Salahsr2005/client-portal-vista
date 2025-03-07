import React, { useState } from "react";
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
  FileX 
} from "lucide-react";

// Mock data for applications
const applications = [
  {
    id: "APP-001",
    programName: "University of Technology Exchange",
    date: "2023-06-15",
    status: "approved",
    documents: 5,
    deadline: "2023-05-30"
  },
  {
    id: "APP-002",
    programName: "Global Business Initiative",
    date: "2023-07-20",
    status: "pending",
    documents: 3,
    deadline: "2023-08-15"
  },
  {
    id: "APP-003",
    programName: "International Arts Residency",
    date: "2023-08-01",
    status: "rejected",
    documents: 4,
    deadline: "2023-07-30"
  },
  {
    id: "APP-004",
    programName: "Tech Startup Accelerator",
    date: "2023-08-10",
    status: "pending",
    documents: 2,
    deadline: "2023-09-01"
  },
  {
    id: "APP-005",
    programName: "Medical Research Program",
    date: "2023-09-05",
    status: "approved",
    documents: 6,
    deadline: "2023-08-20"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <FileCheck className="h-4 w-4 mr-1" />;
    case "pending":
      return <FileClock className="h-4 w-4 mr-1" />;
    case "rejected":
      return <FileX className="h-4 w-4 mr-1" />;
    default:
      return <FileText className="h-4 w-4 mr-1" />;
  }
};

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter applications based on search term and filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.programName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && app.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
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
                      <TableHead className="w-[120px]">Deadline</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-[200px] text-center">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>{app.programName}</TableCell>
                          <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(app.status)}`} variant="outline">
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(app.deadline).toLocaleDateString()}</TableCell>
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
                      <TableHead className="w-[120px]">Deadline</TableHead>
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
                          <TableCell>{app.programName}</TableCell>
                          <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(app.status)}`} variant="outline">
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(app.deadline).toLocaleDateString()}</TableCell>
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
                      <TableHead className="w-[120px]">Deadline</TableHead>
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
                          <TableCell>{app.programName}</TableCell>
                          <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(app.status)}`} variant="outline">
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(app.deadline).toLocaleDateString()}</TableCell>
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
                      <TableHead className="w-[120px]">Deadline</TableHead>
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
                          <TableCell>{app.programName}</TableCell>
                          <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(app.status)}`} variant="outline">
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(app.deadline).toLocaleDateString()}</TableCell>
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
            Showing {filteredApplications.length} of {applications.length} applications
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
