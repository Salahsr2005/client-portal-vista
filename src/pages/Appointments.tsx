
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  User,
  Plus,
  ChevronRight,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock8
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Service {
  id: string;
  name: string;
  duration: number;
}

interface Appointment {
  id: string;
  service: string;
  date: string;
  status: string;
  notes: string;
  time: string;
  advisor?: string;
  location?: string;
  mode?: string;
}

export default function Appointments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingDialog, setBookingDialog] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();

  const upcomingAppointments = appointments.filter(
    (app) => app.status !== "Completed" && app.status !== "Cancelled"
  );
  
  const pastAppointments = appointments.filter(
    (app) => app.status === "Completed" || app.status === "Cancelled"
  );

  useEffect(() => {
    fetchAvailableSlots();
    fetchServices();
  }, [date]);

  const fetchAvailableSlots = async () => {
    if (!date) return;
    
    setLoading(true);
    const formattedDate = format(date, "yyyy-MM-dd");
    
    try {
      const { data: slots, error } = await supabase
        .from("appointment_slots")
        .select(`
          slot_id,
          admin_id,
          date_time,
          end_time,
          duration,
          location,
          mode,
          admin_users(first_name, last_name, photo_url),
          service_id,
          services(name, duration, price),
          status,
          current_bookings,
          max_bookings
        `)
        .eq("status", "Available")
        .gte("date_time", `${formattedDate}T00:00:00`)
        .lte("date_time", `${formattedDate}T23:59:59`)
        .order("date_time", { ascending: true });
      
      if (error) throw error;
      
      // Filter slots that still have capacity
      const availableSlots = slots?.filter(slot => 
        slot.current_bookings < slot.max_bookings
      ) || [];
      
      setAvailableSlots(availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      toast({
        title: "Error fetching available slots",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("service_id, name, duration")
        .eq("status", "Active");
      
      if (error) throw error;
      
      // Map to expected Service shape with id property
      const mappedServices = data.map(service => ({
        id: service.service_id,
        name: service.name,
        duration: service.duration
      }));
      
      setServices(mappedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleBookSlot = (slot: any) => {
    setSelectedSlot(slot);
    setSelectedService(slot.service_id || "");
    setBookingDialog(true);
  };

  const confirmBooking = async () => {
    if (!user || !selectedSlot) return;
    
    try {
      // Insert into appointments table
      const { data, error } = await supabase.from("appointments").insert({
        client_id: user.id,
        slot_id: selectedSlot.slot_id,
        reason: "Consultation", // Adding the required reason field
        special_requests: specialRequests,
        status: "Reserved"
      });
      
      if (error) throw error;
      
      // Update the slot's current bookings
      await supabase
        .from("appointment_slots")
        .update({ current_bookings: selectedSlot.current_bookings + 1 })
        .eq("slot_id", selectedSlot.slot_id);
      
      setBookingConfirmed(true);
      
      // Reset form
      setSpecialRequests("");
      
      toast({
        title: "Appointment booked successfully",
        description: "You can view your appointment in the Upcoming section",
      });
      
      // Refresh data after short delay
      setTimeout(() => {
        setBookingDialog(false);
        setBookingConfirmed(false);
        fetchAvailableSlots();
      }, 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error booking appointment",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialog(true);
  };

  const confirmCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      // Update appointment status
      await supabase
        .from("appointments")
        .update({ status: "Cancelled" })
        .eq("appointment_id", selectedAppointment.id);
      
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully",
      });
      
      setCancelDialog(false);
      
      // Refresh appointments data
      // The useAppointments hook will handle this automatically with React Query
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error cancelling appointment",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Status badge colors and icons
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { variant: "outline" as const, icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" };
      case "cancelled":
        return { variant: "outline" as const, icon: XCircle, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" };
      case "reserved":
        return { variant: "outline" as const, icon: CheckCircle, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" };
      default:
        return { variant: "outline" as const, icon: Clock8, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" };
    }
  };

  if (!user) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Please log in to view and book appointments
          </p>
          <Button onClick={() => navigate("/login")}>
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  // Mock appointmentsData for UI development
  const mockUpcomingAppointments: Appointment[] = [
    {
      id: "1",
      service: "Program Consultation",
      date: "2023-11-01",
      time: "10:00",
      status: "Reserved",
      advisor: "Sarah Johnson",
      location: "Online",
      mode: "Video Call",
      notes: "Initial consultation for study abroad programs"
    },
    {
      id: "2",
      service: "Visa Application Review",
      date: "2023-11-15",
      time: "14:30",
      status: "Reserved",
      advisor: "Mohammed Ali",
      location: "Main Office",
      mode: "In Person",
      notes: "Bring all required documents"
    }
  ];

  const mockPastAppointments: Appointment[] = [
    {
      id: "3",
      service: "Document Verification",
      date: "2023-10-05",
      time: "11:00",
      status: "Completed",
      advisor: "Fatima Zahra",
      location: "Branch Office",
      mode: "In Person",
      notes: "All documents verified successfully"
    },
    {
      id: "4",
      service: "Follow-up Consultation",
      date: "2023-09-20",
      time: "16:00",
      status: "Cancelled",
      advisor: "Youssef Benzahra",
      location: "Online",
      mode: "Video Call",
      notes: "Cancelled due to scheduling conflict"
    }
  ];

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Appointments</h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="book">Book New</TabsTrigger>
        </TabsList>
        
        {/* Upcoming Appointments Tab */}
        <TabsContent value="upcoming">
          {appointmentsLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => {
                const statusProps = getStatusBadge(appointment.status);
                const StatusIcon = statusProps.icon;
                
                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 md:w-3/4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold">{appointment.service}</h3>
                          <Badge variant={statusProps.variant} className={statusProps.color}>
                            <StatusIcon className="h-3.5 w-3.5 mr-1" />
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{appointment.advisor || "Assigned Advisor"}</span>
                          </div>
                          {appointment.mode && (
                            <div className="flex items-center text-sm">
                              {appointment.mode === "Video Call" ? (
                                <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                              ) : (
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              )}
                              <span>{appointment.mode}</span>
                            </div>
                          )}
                        </div>
                        
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{appointment.notes}</p>
                        )}
                      </div>
                      
                      <div className="bg-muted p-6 md:w-1/4 flex flex-col justify-center">
                        <div className="space-y-3">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {}} // Handle view details
                          >
                            View Details
                          </Button>
                          
                          {appointment.status !== "Cancelled" && (
                            <Button 
                              variant="outline" 
                              className="w-full text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                              onClick={() => handleCancelAppointment(appointment)}
                            >
                              Cancel
                            </Button>
                          )}
                          
                          {appointment.mode === "Video Call" && appointment.status === "Reserved" && (
                            <Button 
                              className="w-full"
                              onClick={() => {}} // Handle join call
                            >
                              Join Call
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-xl font-semibold">No Upcoming Appointments</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                You have no upcoming appointments scheduled at this time
              </p>
              <Button onClick={() => document.getElementById("book-tab")?.click()}>
                Book an Appointment
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Past Appointments Tab */}
        <TabsContent value="past">
          {appointmentsLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => {
                const statusProps = getStatusBadge(appointment.status);
                const StatusIcon = statusProps.icon;
                
                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 md:w-3/4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold">{appointment.service}</h3>
                          <Badge variant={statusProps.variant} className={statusProps.color}>
                            <StatusIcon className="h-3.5 w-3.5 mr-1" />
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{appointment.advisor || "Assigned Advisor"}</span>
                          </div>
                          {appointment.mode && (
                            <div className="flex items-center text-sm">
                              {appointment.mode === "Video Call" ? (
                                <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                              ) : (
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              )}
                              <span>{appointment.mode}</span>
                            </div>
                          )}
                        </div>
                        
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{appointment.notes}</p>
                        )}
                      </div>
                      
                      <div className="bg-muted p-6 md:w-1/4 flex flex-col justify-center">
                        <div className="space-y-3">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {}} // Handle view details
                          >
                            View Details
                          </Button>
                          
                          {appointment.status === "Completed" && (
                            <Button 
                              className="w-full"
                              onClick={() => {}} // Handle feedback/rating
                            >
                              Leave Feedback
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-xl font-semibold">No Past Appointments</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                You don't have any past appointments in your history
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Book New Appointment Tab */}
        <TabsContent value="book" id="book-tab">
          <Card>
            <CardHeader>
              <CardTitle>Book a New Appointment</CardTitle>
              <CardDescription>
                Select a date and choose from available time slots
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => 
                      isBefore(date, startOfDay(new Date())) ||
                      isAfter(date, new Date(new Date().setMonth(new Date().getMonth() + 2)))
                    }
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Available Slots</h3>
                    <div className="flex items-center gap-2">
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Services</SelectItem>
                          {services.map(service => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                      
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8 w-[180px]" placeholder="Search..." />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {loading ? (
                      <div className="flex justify-center my-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      availableSlots
                        .filter(slot => !selectedService || slot.service_id === selectedService)
                        .map(slot => {
                          const startTime = new Date(slot.date_time);
                          const endTime = new Date(slot.end_time);
                          const serviceName = slot.services?.name || "Consultation";
                          const duration = slot.duration || 60;
                          
                          return (
                            <Card key={slot.slot_id} className="overflow-hidden">
                              <div className="flex flex-col sm:flex-row">
                                <div className="p-4 sm:w-3/4">
                                  <h4 className="font-medium mb-2">{serviceName}</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="flex items-center text-sm">
                                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>
                                        {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>
                                        {slot.admin_users?.first_name} {slot.admin_users?.last_name}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      {slot.mode === "Virtual" ? (
                                        <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                                      ) : (
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                      )}
                                      <span>{slot.mode || "In-Person"}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <Clock8 className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{duration} minutes</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-muted p-4 sm:w-1/4 flex items-center justify-center">
                                  <Button onClick={() => handleBookSlot(slot)}>
                                    Book Slot
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          );
                        })
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <h4 className="text-lg font-medium">No Available Slots</h4>
                        <p className="text-muted-foreground mt-1">
                          No appointments available on this date. Please try another day.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onOpenChange={setBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Confirm your appointment details below.
            </DialogDescription>
          </DialogHeader>
          
          {bookingConfirmed ? (
            <div className="py-6 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Appointment Confirmed!</h3>
              <p className="text-muted-foreground">
                Your appointment has been successfully booked.
              </p>
            </div>
          ) : (
            <>
              {selectedSlot && (
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Date</h4>
                      <p>{format(new Date(selectedSlot.date_time), "MMMM d, yyyy")}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Time</h4>
                      <p>
                        {format(new Date(selectedSlot.date_time), "h:mm a")} - 
                        {format(new Date(selectedSlot.end_time), "h:mm a")}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Advisor</h4>
                      <p>
                        {selectedSlot.admin_users?.first_name} {selectedSlot.admin_users?.last_name}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Service</h4>
                      <p>{selectedSlot.services?.name || "Consultation"}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Special Requests (Optional)</h4>
                    <Textarea
                      placeholder="Add any specific requests or notes for your appointment..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setBookingDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={confirmBooking}>
                  Book Appointment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment?
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="py-2">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{selectedAppointment.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{format(new Date(selectedAppointment.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{selectedAppointment.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <p className="text-sm text-muted-foreground mt-4">
                Cancelling an appointment less than 24 hours before the scheduled time may be subject to our cancellation policy.
              </p>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setCancelDialog(false)}
            >
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelAppointment}
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
