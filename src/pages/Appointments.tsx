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
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical, 
  Video, 
  UserRound, 
  MessageSquare,
  ArrowUpDown
} from "lucide-react";

const appointments = [
  {
    id: "APT-001",
    type: "Counseling Session",
    date: "2023-10-15",
    time: "10:00 AM",
    duration: "45 min",
    advisor: "Dr. Sarah Johnson",
    status: "upcoming",
    mode: "video"
  },
  {
    id: "APT-002",
    type: "Visa Interview Prep",
    date: "2023-10-18",
    time: "2:30 PM",
    duration: "60 min",
    advisor: "Mark Wilson",
    status: "upcoming",
    mode: "in-person"
  },
  {
    id: "APT-003",
    type: "Financial Aid Consultation",
    date: "2023-10-10",
    time: "11:15 AM",
    duration: "30 min",
    advisor: "Jennifer Lee",
    status: "completed",
    mode: "video"
  },
  {
    id: "APT-004",
    type: "Program Orientation",
    date: "2023-09-25",
    time: "3:00 PM",
    duration: "90 min",
    advisor: "Prof. Michael Brown",
    status: "completed",
    mode: "in-person"
  },
  {
    id: "APT-005",
    type: "Housing Consultation",
    date: "2023-09-15",
    time: "1:45 PM",
    duration: "45 min",
    advisor: "Amanda Garcia",
    status: "cancelled",
    mode: "video"
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case "video":
      return <Video className="h-4 w-4 mr-1" />;
    case "in-person":
      return <UserRound className="h-4 w-4 mr-1" />;
    default:
      return <MessageSquare className="h-4 w-4 mr-1" />;
  }
};

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         apt.advisor.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && apt.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule New
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
          <CardDescription>
            Manage your scheduled appointments and consultations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 sm:mb-0">
                <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
                <TabsTrigger value="upcoming" onClick={() => setFilter("upcoming")}>Upcoming</TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>
                <TabsTrigger value="cancelled" onClick={() => setFilter("cancelled")}>Cancelled</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search appointments..."
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
                    <DropdownMenuItem>Video Appointments</DropdownMenuItem>
                    <DropdownMenuItem>In-Person Appointments</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="w-[150px]">Advisor</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Mode</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-[200px] text-center">
                          No appointments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">{apt.id}</TableCell>
                          <TableCell>{apt.type}</TableCell>
                          <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.advisor}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(apt.status)}`} variant="outline">
                              <span className="capitalize">{apt.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getModeIcon(apt.mode)}
                              <span className="capitalize">{apt.mode}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {apt.status === "upcoming" && (
                                  <>
                                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      Cancel
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {apt.status === "completed" && (
                                  <DropdownMenuItem>Leave Feedback</DropdownMenuItem>
                                )}
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
            
            <TabsContent value="upcoming" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="w-[150px]">Advisor</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Mode</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.filter(apt => apt.status === "upcoming").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-[200px] text-center">
                          No upcoming appointments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.filter(apt => apt.status === "upcoming").map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">{apt.id}</TableCell>
                          <TableCell>{apt.type}</TableCell>
                          <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.advisor}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(apt.status)}`} variant="outline">
                              <span className="capitalize">{apt.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getModeIcon(apt.mode)}
                              <span className="capitalize">{apt.mode}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Cancel
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
            
            <TabsContent value="completed" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="w-[150px]">Advisor</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Mode</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.filter(apt => apt.status === "completed").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-[200px] text-center">
                          No completed appointments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.filter(apt => apt.status === "completed").map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">{apt.id}</TableCell>
                          <TableCell>{apt.type}</TableCell>
                          <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.advisor}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(apt.status)}`} variant="outline">
                              <span className="capitalize">{apt.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getModeIcon(apt.mode)}
                              <span className="capitalize">{apt.mode}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Leave Feedback</DropdownMenuItem>
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
            
            <TabsContent value="cancelled" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center">
                          Date <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="w-[150px]">Advisor</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Mode</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.filter(apt => apt.status === "cancelled").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-[200px] text-center">
                          No cancelled appointments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.filter(apt => apt.status === "cancelled").map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">{apt.id}</TableCell>
                          <TableCell>{apt.type}</TableCell>
                          <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.advisor}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(apt.status)}`} variant="outline">
                              <span className="capitalize">{apt.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getModeIcon(apt.mode)}
                              <span className="capitalize">{apt.mode}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
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
            Showing {filteredAppointments.length} of {appointments.length} appointments
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
