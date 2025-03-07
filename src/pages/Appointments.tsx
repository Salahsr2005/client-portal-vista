
import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Video, 
  Phone as PhoneIcon, 
  MessageSquare, 
  Plus, 
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  MapPin,
  Filter
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Appointment data
const appointments = [
  {
    id: 1,
    title: "Visa Interview Preparation",
    date: "2023-08-10",
    time: "10:00 AM",
    duration: "45 minutes",
    consultant: "Dr. Emily Johnson",
    type: "video",
    status: "upcoming",
    notes: "Prepare common visa interview questions and documentation discussion."
  },
  {
    id: 2,
    title: "Program Consultation",
    date: "2023-08-15",
    time: "2:30 PM",
    duration: "60 minutes",
    consultant: "Michael Roberts",
    type: "in-person",
    status: "upcoming",
    location: "Main Office - 123 Education St, New York"
  },
  {
    id: 3,
    title: "Application Review Session",
    date: "2023-07-28",
    time: "11:15 AM",
    duration: "30 minutes",
    consultant: "Sarah Williams",
    type: "call",
    status: "completed",
    notes: "Review of Stanford application materials."
  },
  {
    id: 4,
    title: "Document Preparation Guidance",
    date: "2023-07-20",
    time: "3:00 PM",
    duration: "45 minutes",
    consultant: "Dr. James Thompson",
    type: "video",
    status: "completed",
    notes: "Discussion about recommendation letters and transcripts."
  },
  {
    id: 5,
    title: "Financial Aid Consultation",
    date: "2023-08-25",
    time: "1:00 PM",
    duration: "45 minutes",
    consultant: "Lisa Chen",
    type: "video",
    status: "upcoming",
    notes: "Overview of scholarship opportunities and application process."
  },
  {
    id: 6,
    title: "Admission Interview Practice",
    date: "2023-09-05",
    time: "11:30 AM",
    duration: "60 minutes",
    consultant: "Prof. Robert Anderson",
    type: "in-person",
    status: "upcoming",
    location: "West Campus Office - 45 University Ave, New York"
  }
];

// Time slots for new appointments
const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

// Available consultants
const consultants = [
  { id: 1, name: "Dr. Emily Johnson", specialization: "Visa Counseling", availability: "Mon, Wed, Fri" },
  { id: 2, name: "Michael Roberts", specialization: "Program Selection", availability: "Tue, Thu" },
  { id: 3, name: "Sarah Williams", specialization: "Application Review", availability: "Mon-Fri" },
  { id: 4, name: "Dr. James Thompson", specialization: "Document Preparation", availability: "Wed, Thu, Fri" },
  { id: 5, name: "Lisa Chen", specialization: "Financial Aid", availability: "Mon, Tue, Wed" }
];

// Get icon for appointment type
const getAppointmentTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "call":
      return <PhoneIcon className="h-4 w-4" />;
    case "in-person":
      return <User className="h-4 w-4" />;
    case "message":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <CalendarIcon className="h-4 w-4" />;
  }
};

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Current month for calendar view
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  
  // Filter appointments based on tab and search
  const filteredAppointments = appointments.filter(appointment => {
    const matchesTab = 
      (activeTab === "upcoming" && appointment.status === "upcoming") ||
      (activeTab === "completed" && appointment.status === "completed") ||
      activeTab === "all";
    
    const matchesSearch = 
      appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.consultant.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Function to go to next/previous month
  const changeMonth = (increment: number) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };
  
  // Get month name
  const getMonthName = (month: number) => {
    return new Date(2000, month, 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 md:mb-0">Appointments</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule New Appointment
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main appointments list */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>My Appointments</CardTitle>
                  <CardDescription>
                    Manage your scheduled consultations and meetings
                  </CardDescription>
                </div>
                <div className="relative mt-4 md:mt-0 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search appointments..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="space-y-4">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <Card key={appointment.id} className={appointment.status === "upcoming" ? "border-l-4 border-l-primary" : ""}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex gap-4 items-start">
                              <div className={`p-3 rounded-full bg-primary/10 text-primary`}>
                                {getAppointmentTypeIcon(appointment.type)}
                              </div>
                              <div>
                                <h3 className="font-medium">{appointment.title}</h3>
                                <p className="text-sm text-muted-foreground">with {appointment.consultant}</p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                  <div className="flex items-center text-xs">
                                    <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span>{formatDate(appointment.date)}</span>
                                  </div>
                                  <div className="flex items-center text-xs">
                                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span>{appointment.time} ({appointment.duration})</span>
                                  </div>
                                  {appointment.location && (
                                    <div className="flex items-center text-xs">
                                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                      <span>{appointment.location}</span>
                                    </div>
                                  )}
                                </div>
                                {appointment.notes && (
                                  <p className="text-xs text-muted-foreground mt-2 italic">
                                    Note: {appointment.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                              <Badge variant={appointment.status === "upcoming" ? "default" : "outline"} className="whitespace-nowrap">
                                {appointment.status === "upcoming" ? "Upcoming" : "Completed"}
                              </Badge>
                              <Badge variant="secondary" className="whitespace-nowrap">
                                {appointment.type === "video" ? "Video Call" : 
                                 appointment.type === "call" ? "Phone Call" : "In-Person"}
                              </Badge>
                            </div>
                          </div>
                          
                          {appointment.status === "upcoming" && (
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button variant="outline" size="sm">
                                Reschedule
                              </Button>
                              <Button variant="destructive" size="sm">
                                Cancel
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-lg font-medium">No appointments found</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-4">
                        {searchQuery 
                          ? "No appointments match your search criteria."
                          : activeTab === "upcoming" 
                            ? "You don't have any upcoming appointments scheduled."
                            : "You don't have any completed appointments."}
                      </p>
                      {activeTab === "upcoming" && (
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Schedule New Appointment
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Calendar and scheduling sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {getMonthName(currentMonth)} {currentYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, index) => (
                  <div key={index} className="text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Placeholder for calendar days - would be dynamically generated in a real app */}
                {Array.from({ length: 35 }, (_, index) => {
                  const day = index - 2; // Offset to simulate a real month view
                  const isToday = day === 10;
                  const hasAppointment = [10, 15, 25].includes(day);
                  
                  return (
                    <div 
                      key={index} 
                      className={`
                        h-8 flex items-center justify-center text-sm rounded-md 
                        ${day < 1 || day > 30 ? 'text-muted-foreground/50' : ''}
                        ${isToday ? 'bg-primary text-primary-foreground' : ''}
                        ${hasAppointment && !isToday ? 'bg-primary/20' : ''}
                        ${day > 0 && day <= 30 && !isToday ? 'hover:bg-muted cursor-pointer' : ''}
                      `}
                    >
                      {day > 0 && day <= 30 ? day : ''}
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary/20 mr-2"></div>
                <span>Has Appointment</span>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Available Consultants</CardTitle>
              <CardDescription>
                Our experts ready to assist you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {consultants.slice(0, 3).map((consultant) => (
                <div key={consultant.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{consultant.name}</h4>
                    <p className="text-xs text-muted-foreground">{consultant.specialization}</p>
                    <p className="text-xs">Available: {consultant.availability}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-sm">
                View All Consultants
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Schedule</CardTitle>
              <CardDescription>
                Book your next appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Appointment Type</label>
                <Select defaultValue="consultation">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">General Consultation</SelectItem>
                    <SelectItem value="application">Application Review</SelectItem>
                    <SelectItem value="document">Document Preparation</SelectItem>
                    <SelectItem value="interview">Interview Practice</SelectItem>
                    <SelectItem value="visa">Visa Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Date</label>
                <Input type="date" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Time</label>
                <Select defaultValue="10:00 AM">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full">
                Check Availability
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
