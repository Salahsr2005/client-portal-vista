
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useServices } from "@/hooks/useServices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, parse, isBefore, isAfter, set } from "date-fns";
import { CalendarIcon, Clock, Loader2, Calendar as CalendarIcon2, MapPin, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the form schema with Zod
const bookingSchema = z.object({
  serviceId: z.string({
    required_error: "Please select a service",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  mode: z.enum(["In-Person", "Online", "Phone"], {
    required_error: "Please select appointment mode",
  }),
  reason: z.string().min(5, "Please provide a brief reason for your appointment"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface Advisor {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
}

interface TimeSlot {
  id: string;
  time: string;
  endTime: string;
  advisorId: string;
  advisorName: string;
  available: boolean;
}

export function BookAppointmentForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: services, isLoading: servicesLoading } = useServices();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loadingAdvisors, setLoadingAdvisors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<BookingFormValues | null>(null);
  
  // Set up react-hook-form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: "",
      mode: "In-Person",
      reason: "",
      specialRequests: "",
    },
  });
  
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/appointments" } });
      return;
    }
    
    // Fetch advisors when component mounts
    fetchAdvisors();
  }, [user, navigate]);
  
  // Fetch list of advisors
  const fetchAdvisors = async () => {
    setLoadingAdvisors(true);
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select(`
          admin_id,
          first_name,
          last_name,
          photo_url,
          role_id
        `)
        .eq("status", "Active");
        
      if (error) throw error;
      
      if (data) {
        const mappedAdvisors = data.map(advisor => ({
          id: advisor.admin_id,
          name: `${advisor.first_name} ${advisor.last_name}`,
          role: "Advisor",  // Default role
          photoUrl: advisor.photo_url || "/placeholder.svg"
        }));
        
        setAdvisors(mappedAdvisors);
      }
    } catch (error) {
      console.error("Error fetching advisors:", error);
      toast({
        title: "Error",
        description: "Failed to load advisors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAdvisors(false);
    }
  };
  
  // Watch for date changes to fetch available time slots
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "date" && value.date) {
        setSelectedDate(value.date);
        fetchAvailableSlots(value.date, value.serviceId);
      }
      
      if (name === "serviceId" && value.serviceId && value.date) {
        fetchAvailableSlots(value.date, value.serviceId);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);
  
  // Fetch available time slots for the selected date
  const fetchAvailableSlots = async (date: Date, serviceId: string) => {
    if (!date || !serviceId) return;
    
    setLoadingSlots(true);
    setTimeSlots([]);
    
    try {
      // Format the date to match the database format
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // Query appointment slots
      const { data, error } = await supabase
        .from("appointment_slots")
        .select(`
          slot_id,
          date_time,
          end_time,
          admin_id,
          current_bookings,
          max_bookings,
          status,
          admin_users (
            first_name,
            last_name
          )
        `)
        .eq("service_id", serviceId)
        .gte("date_time", `${formattedDate}T00:00:00`)
        .lte("date_time", `${formattedDate}T23:59:59`)
        .order("date_time", { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const availableSlots = data.map(slot => {
          const startTime = new Date(slot.date_time);
          const endTime = new Date(slot.end_time);
          
          return {
            id: slot.slot_id,
            time: format(startTime, "h:mm a"),
            endTime: format(endTime, "h:mm a"),
            advisorId: slot.admin_id,
            advisorName: slot.admin_users 
              ? `${slot.admin_users.first_name} ${slot.admin_users.last_name}` 
              : "Advisor",
            available: slot.status === "Available" && slot.current_bookings < slot.max_bookings
          };
        });
        
        setTimeSlots(availableSlots);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast({
        title: "Error",
        description: "Failed to load available time slots. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingSlots(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    setAppointmentDetails(data);
    setConfirmDialogOpen(true);
  };
  
  // Process the booking after confirmation
  const processBooking = async () => {
    if (!user || !appointmentDetails) return;
    
    setIsSubmitting(true);
    
    try {
      // Find the selected time slot to get the slot_id
      const selectedSlot = timeSlots.find(slot => slot.id === appointmentDetails.timeSlot);
      
      if (!selectedSlot) {
        throw new Error("Selected time slot not found");
      }
      
      // Create appointment record
      const { data, error } = await supabase
        .from("appointments")
        .insert([
          {
            client_id: user.id,
            slot_id: selectedSlot.id,
            status: "Reserved",
            reason: appointmentDetails.reason,
            special_requests: appointmentDetails.specialRequests || null
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Show success message
      setBookingSuccess(true);
      setConfirmDialogOpen(false);
      
      // Reset form
      form.reset();
      
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      });
      
      // Redirect to appointments page after a delay
      setTimeout(() => {
        navigate("/appointments");
      }, 3000);
      
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "There was a problem booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getServiceById = (id: string) => {
    return services?.find(service => service.id === id);
  };
  
  // Filter out past dates
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  };
  
  // Determine if we should show the booking form or success message
  if (bookingSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="mb-2">Appointment Scheduled!</CardTitle>
          <p className="text-muted-foreground mb-6">
            Your appointment has been successfully booked. You will receive a confirmation
            email shortly with all the details.
          </p>
          <Button onClick={() => navigate("/appointments")} className="mx-auto">
            View My Appointments
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule an Appointment</CardTitle>
        <CardDescription>
          Book a consultation with one of our advisors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    disabled={servicesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && getServiceById(field.value)?.description && (
                    <FormDescription>
                      {getServiceById(field.value)?.description}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={disabledDates}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    {loadingSlots ? (
                      <div className="w-full h-10 flex items-center justify-center border rounded-md">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <>
                        {timeSlots.length > 0 ? (
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-2"
                            >
                              {timeSlots.map((slot) => (
                                <div key={slot.id} className="flex items-center">
                                  <RadioGroupItem
                                    value={slot.id}
                                    id={slot.id}
                                    disabled={!slot.available}
                                  />
                                  <Label
                                    htmlFor={slot.id}
                                    className={cn(
                                      "flex flex-1 cursor-pointer items-center rounded-md border p-2 ml-2",
                                      !slot.available && "opacity-50 cursor-not-allowed"
                                    )}
                                  >
                                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                      {slot.time} - {slot.endTime}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {slot.advisorName}
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        ) : selectedDate ? (
                          <div className="w-full p-4 text-center border rounded-md">
                            <p className="text-muted-foreground">
                              No available slots for this date
                            </p>
                          </div>
                        ) : (
                          <div className="w-full p-4 text-center border rounded-md">
                            <p className="text-muted-foreground">
                              Select a date to see available times
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="In-Person" id="in-person" />
                        <Label htmlFor="in-person">In-Person</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Online" id="online" />
                        <Label htmlFor="online">Online</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Phone" id="phone" />
                        <Label htmlFor="phone">Phone</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Appointment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe why you're scheduling this appointment..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or accommodations needed..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Schedule Appointment
            </Button>
          </form>
        </Form>
      </CardContent>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Please review your appointment details before confirming.
            </DialogDescription>
          </DialogHeader>
          
          {appointmentDetails && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon2 className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {format(appointmentDetails.date, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {timeSlots.find(slot => slot.id === appointmentDetails.timeSlot)?.time || ""}
                    {" - "}
                    {timeSlots.find(slot => slot.id === appointmentDetails.timeSlot)?.endTime || ""}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {timeSlots.find(slot => slot.id === appointmentDetails.timeSlot)?.advisorName || "Advisor"}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{appointmentDetails.mode}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Service</h4>
                <p>
                  {getServiceById(appointmentDetails.serviceId)?.name || "Consultation"}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Reason</h4>
                <p>{appointmentDetails.reason}</p>
              </div>
              
              {appointmentDetails.specialRequests && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Special Requests</h4>
                  <p>{appointmentDetails.specialRequests}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={processBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
