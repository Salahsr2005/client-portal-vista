import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

import { 
  CalendarDays, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical, 
  Video, 
  UserRound, 
  MessageSquare,
  ArrowUpDown,
  CalendarCheck,
  CalendarPlus,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  advisor?: string;
  notes?: string;
  mode?: string;
}

interface AvailableSlot {
  id: string;
  date: Date;
  time: string;
  service: string;
  advisor: string;
  mode: string;
}

export default function Appointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: userAppointments, isLoading, error, refetch } = useAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [availableServices, setAvailableServices] = useState<{id: string, name: string, duration: number}[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  
  const form = useForm({
    defaultValues: {
      specialRequests: "",
    },
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('service_id, name, duration')
          .eq('status', 'Active')
          .order('name');
          
        if (error) throw error;
        
        setAvailableServices(data || []);
        if (data && data.length > 0) {
          setSelectedService(data[0].service_id);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        toast({
          title: 'Failed to load services',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    fetchServices();
  }, [toast]);
  
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !selectedService) return;
      
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const { data: slotsData, error: slotsError } = await supabase
          .from('appointment_slots')
          .select(`
            slot_id, 
            date_time, 
            max_bookings, 
            current_bookings, 
            mode,
            admin_users(first_name, last_name),
            services(name, duration)
          `)
          .eq('service_id', selectedService)
          .gte('date_time', startOfDay.toISOString())
          .lte('date_time', endOfDay.toISOString())
          .eq('status', 'Available')
          .lt('current_bookings', 'max_bookings');
          
        if (slotsError) throw slotsError;
        
        const slots = (slotsData || []).map(slot => ({
          id: slot.slot_id,
          date: new Date(slot.date_time),
          time: format(new Date(slot.date_time), 'h:mm a'),
          service: slot.services?.name || 'Consultation',
          advisor: slot.admin_users 
            ? `${slot.admin_users.first_name} ${slot.admin_users.last_name}`
            : 'Available Advisor',
          mode: slot.mode || 'In-person'
        }));
        
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching slots:', error);
        toast({
          title: 'Failed to load available times',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    fetchAvailableSlots();
  }, [selectedDate, selectedService, toast]);

  const handleScheduleNew = () => {
    setSelectedDate(new Date());
    setSelectedSlot(null);
    setIsScheduling(true);
    setOpenDialog(true);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };
  
  const handleSelectSlot = (slotId: string) => {
    setSelectedSlot(slotId);
  };
  
  const handleBookAppointment = async (formData: { specialRequests: string }) => {
    if (!selectedSlot || !user) return;
    
    setIsBooking(true);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          client_id: user.id,
          slot_id: selectedSlot,
          special_requests: formData.specialRequests,
          status: 'Reserved',
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: 'Appointment Booked',
        description: 'Your appointment has been successfully scheduled.',
        variant: 'default',
      });
      
      setOpenDialog(false);
      setIsScheduling(false);
      refetch();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was an error booking your appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };
  
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('appointment_id', appointmentId);
        
      if (error) throw error;
      
      toast({
        title: 'Appointment Cancelled',
        description: 'Your appointment has been cancelled successfully.',
      });
      
      refetch();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: 'Cancellation Failed',
        description: 'There was an error cancelling your appointment. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const filteredAppointments = React.useMemo(() => {
    if (!userAppointments) return [];
    
    return userAppointments.filter(apt => {
      const matchesSearch = apt.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === "all") return matchesSearch;
      return matchesSearch && apt.status.toLowerCase() === filter;
    });
  }, [userAppointments, searchTerm, filter]);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
      case "reserved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };
  
  const getModeIcon = (mode = 'in-person') => {
    switch (mode.toLowerCase()) {
      case "video":
        return <Video className="h-4 w-4 mr-1" />;
      case "in-person":
        return <UserRound className="h-4 w-4 mr-1" />;
      default:
        return <MessageSquare className="h-4 w-4 mr-1" />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              You need to be signed in to view and manage your appointments.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <Button onClick={handleScheduleNew}>
          <CalendarPlus className="mr-2 h-4 w-4" />
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
                <TabsTrigger value="scheduled" onClick={() => setFilter("scheduled")}>Upcoming</TabsTrigger>
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
                      <TableHead>Service</TableHead>
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p>Loading appointments...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center">
                            <XCircle className="h-8 w-8 text-destructive mb-2" />
                            <p>Error loading appointments. Please try again later.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarDays className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">No appointments found</p>
                            <p className="text-muted-foreground mt-1 mb-4">Schedule your first appointment to get started</p>
                            <Button onClick={handleScheduleNew}>
                              <CalendarPlus className="mr-2 h-4 w-4" />
                              Schedule Appointment
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">{apt.service}</TableCell>
                          <TableCell>{apt.date}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.advisor || "Available Advisor"}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(apt.status)}`} variant="outline">
                              <span className="capitalize">{apt.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getModeIcon(apt.mode)}
                              <span className="capitalize">{apt.mode || 'In-person'}</span>
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
                                {(apt.status === "scheduled" || apt.status === "reserved") && (
                                  <>
                                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => handleCancelAppointment(apt.id)}
                                    >
                                      Cancel Appointment
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
            
            <TabsContent value="scheduled" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
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
                    {filteredAppointments.filter(apt => apt.status === "scheduled").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarDays className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">No upcoming appointments found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.filter(apt => apt.status === "scheduled").map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">{apt.service}</TableCell>
                          <TableCell>{apt.date}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.advisor || "Available Advisor"}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(apt.status)}`} variant="outline">
                              <span className="capitalize">{apt.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getModeIcon(apt.mode)}
                              <span className="capitalize">{apt.mode || 'In-person'}</span>
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
                      <TableHead>Service</TableHead>
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
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarDays className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">No completed appointments found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.filter(apt => apt.status === "completed").map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">{apt.service}</TableCell>
                          <TableCell>{apt.date}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.advisor || "Available Advisor"}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(apt.status)}`} variant="outline">
                              <span className="capitalize">{apt.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getModeIcon(apt.mode)}
                              <span className="capitalize">{apt.mode || 'In-person'}</span>
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
                      <TableHead>Service</TableHead>
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
                        <TableCell colSpan={7} className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarDays className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">No cancelled appointments found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.filter(apt => apt.status === "cancelled").map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">{apt.service}</TableCell>
                          <TableCell>{apt.date}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                          <TableCell>{apt.advisor || "Available Advisor"}</TableCell>
                          <TableCell>
                            <Badge className={`flex w-fit items-center ${getStatusColor(apt.status)}`} variant="outline">
                              <span className="capitalize">{apt.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getModeIcon(apt.mode)}
                              <span className="capitalize">{apt.mode || 'In-person'}</span>
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
            Showing {filteredAppointments.length} appointment(s)
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
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Select a service, date, and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <FormLabel>Select Service</FormLabel>
              <Select 
                value={selectedService || ''}
                onValueChange={(value) => setSelectedService(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FormLabel>Select Date</FormLabel>
                <div className="border rounded-md mt-1">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const twoMonthsLater = new Date();
                      twoMonthsLater.setMonth(today.getMonth() + 2);
                      return date < today || date > twoMonthsLater;
                    }}
                    className="rounded-md border"
                  />
                </div>
              </div>
              
              <div>
                <FormLabel>Available Time Slots</FormLabel>
                <div className="border rounded-md h-[240px] overflow-y-auto p-2 mt-1">
                  {availableSlots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">No available slots</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try selecting a different date or service
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          size="sm"
                          variant={selectedSlot === slot.id ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => handleSelectSlot(slot.id)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {selectedSlot && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleBookAppointment)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any special requests or notes for this appointment"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenDialog(false)}
                      disabled={isBooking}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!selectedSlot || isBooking}
                    >
                      {isBooking ? (
                        <>Booking...</>
                      ) : (
                        <>
                          Book Appointment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
