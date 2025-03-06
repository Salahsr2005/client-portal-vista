
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Calendar as CalendarIcon, Clock, MapPin, User, Video, 
  Phone, AlertCircle, CheckCircle, XCircle, Plus,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

// Sample data
const upcomingAppointments = [
  {
    id: 1,
    title: "Academic Advising Session",
    date: "2023-11-15",
    time: "10:00 AM - 11:00 AM",
    advisor: "Dr. Mohammed Cherif",
    location: "Student Services Center, Room 102",
    type: "In Person",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Scholarship Application Review",
    date: "2023-11-18",
    time: "2:30 PM - 3:15 PM",
    advisor: "Ms. Amina Larbi",
    location: "Online Meeting",
    type: "Virtual",
    status: "confirmed"
  },
  {
    id: 3,
    title: "Career Counseling",
    date: "2023-11-22",
    time: "11:00 AM - 12:00 PM",
    advisor: "Mr. Karim Benali",
    location: "Career Center, Main Building",
    type: "In Person",
    status: "pending"
  }
];

const pastAppointments = [
  {
    id: 101,
    title: "Program Selection Guidance",
    date: "2023-10-25",
    time: "3:00 PM - 4:00 PM",
    advisor: "Dr. Fatima Zahra",
    location: "Academic Affairs Office",
    type: "In Person",
    status: "completed"
  },
  {
    id: 102,
    title: "Document Verification",
    date: "2023-10-20",
    time: "9:30 AM - 10:00 AM",
    advisor: "Mr. Ahmed Taleb",
    location: "Administrative Services",
    type: "In Person",
    status: "completed"
  },
  {
    id: 103,
    title: "Financial Aid Consultation",
    date: "2023-10-15",
    time: "1:00 PM - 1:45 PM",
    advisor: "Ms. Nadia Hamdi",
    location: "Online Meeting",
    type: "Virtual",
    status: "cancelled"
  }
];

const availableTimeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
  "4:00 PM", "4:30 PM"
];

const appointmentTypes = [
  { id: 1, name: "Academic Advising", department: "Academic Affairs" },
  { id: 2, name: "Career Counseling", department: "Career Center" },
  { id: 3, name: "Scholarship Consultation", department: "Financial Aid" },
  { id: 4, name: "Document Processing", department: "Administrative Services" },
  { id: 5, name: "Visa Application Support", department: "International Office" },
  { id: 6, name: "Technical Support", department: "IT Services" }
];

const AppointmentsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [meetingType, setMeetingType] = useState("inperson");
  
  // Get appointment status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Get appointment type icon
  const getTypeIcon = (type: string) => {
    return type === "Virtual" ? <Video className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-2">
            Schedule and manage your appointments with advisors and counselors
          </p>
        </div>
        <Button onClick={() => setShowBooking(!showBooking)}>
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>
      
      {showBooking ? (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Book New Appointment</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowBooking(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Select a date, time, and appointment type to schedule your meeting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">1. Select Date</h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  disabled={(date) => 
                    date < new Date() || 
                    date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                  }
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">2. Select Time</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTimeSlot === time ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedTimeSlot(time)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">3. Appointment Details</h3>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name} - {type.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="font-medium block mb-2">Meeting Type</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={meetingType === "inperson" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMeetingType("inperson")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      In Person
                    </Button>
                    <Button 
                      variant={meetingType === "virtual" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMeetingType("virtual")}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Virtual
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="font-medium block mb-2">Additional Notes</label>
                  <Input placeholder="Brief description of your needs..." />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowBooking(false)}>
              Cancel
            </Button>
            <Button
              disabled={!date || !selectedTimeSlot || !appointmentType}
            >
              Confirm Booking
            </Button>
          </CardFooter>
        </Card>
      ) : null}
      
      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">No upcoming appointments</h3>
              <p className="text-muted-foreground mb-6">You don't have any scheduled appointments.</p>
              <Button onClick={() => setShowBooking(true)}>Book New Appointment</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{appointment.title}</CardTitle>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Advisor: {appointment.advisor}</span>
                        </div>
                        <div className="flex items-center">
                          {getTypeIcon(appointment.type)}
                          <span className="ml-2">{appointment.type} Meeting</span>
                        </div>
                        {appointment.status === "pending" && (
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                            <span className="text-sm text-yellow-500">Awaiting confirmation</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      Reschedule
                    </Button>
                    <Button variant="destructive">
                      Cancel Appointment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          {pastAppointments.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">No past appointments</h3>
              <p className="text-muted-foreground">Your appointment history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{appointment.title}</CardTitle>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Advisor: {appointment.advisor}</span>
                        </div>
                        <div className="flex items-center">
                          {getTypeIcon(appointment.type)}
                          <span className="ml-2">{appointment.type} Meeting</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {appointment.status === "completed" ? (
                      <Button className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Leave Feedback
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        Book Similar Appointment
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Immediate Assistance?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Contact our support team for urgent matters that can't wait for an appointment.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>+213 555 123 456</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                <span>support@vista-education.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Drop-in Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Visit without an appointment during these hours for quick consultations.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Thursday:</span>
                <span>9:00 AM - 11:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Friday:</span>
                <span>1:00 PM - 3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Weekend:</span>
                <span>Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please note our appointment scheduling and cancellation policies.
            </p>
            <ul className="space-y-2 text-sm list-disc pl-5">
              <li>Appointments must be booked at least 24 hours in advance</li>
              <li>Cancellations should be made at least 12 hours before</li>
              <li>Late arrivals may result in shortened appointments</li>
              <li>No-shows may affect future booking privileges</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsPage;
