
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, User, Check, X, AlertCircle } from "lucide-react";

// Mock appointment data
const appointments = [
  {
    id: "apt-001",
    title: "Visa Consultation",
    date: "2023-10-20T14:30:00",
    duration: 45,
    advisor: "Dr. Amina Benali",
    location: "Office 204, Algiers Main Center",
    status: "upcoming"
  },
  {
    id: "apt-002",
    title: "Document Submission",
    date: "2023-10-25T10:00:00",
    duration: 30,
    advisor: "Karim Hadj",
    location: "Front Desk, Algiers Main Center",
    status: "upcoming"
  },
  {
    id: "apt-003",
    title: "IELTS Preparation Session",
    date: "2023-10-15T13:00:00",
    duration: 90,
    advisor: "Sarah Johnson",
    location: "Room 105, Language Center",
    status: "completed"
  },
  {
    id: "apt-004",
    title: "University Application Review",
    date: "2023-10-10T11:30:00",
    duration: 60,
    advisor: "Mohammed Taha",
    location: "Online (Zoom)",
    status: "cancelled",
    reason: "Advisor unavailable"
  }
];

const AppointmentCard = ({ appointment }: { appointment: any }) => {
  const date = parseISO(appointment.date);
  let dateDisplay;
  
  if (isToday(date)) {
    dateDisplay = "Today";
  } else if (isTomorrow(date)) {
    dateDisplay = "Tomorrow";
  } else {
    dateDisplay = format(date, "MMMM d, yyyy");
  }
  
  const timeDisplay = format(date, "h:mm a");
  const endTime = format(addDays(date, 0).setMinutes(date.getMinutes() + appointment.duration), "h:mm a");
  
  let statusBadge;
  switch (appointment.status) {
    case "upcoming":
      statusBadge = <Badge className="bg-blue-500">Upcoming</Badge>;
      break;
    case "completed":
      statusBadge = <Badge className="bg-green-500">Completed</Badge>;
      break;
    case "cancelled":
      statusBadge = <Badge variant="destructive">Cancelled</Badge>;
      break;
    default:
      statusBadge = <Badge variant="outline">Unknown</Badge>;
  }
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{appointment.title}</CardTitle>
            <CardDescription>{appointment.advisor}</CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-sm">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{dateDisplay}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{timeDisplay} - {endTime} ({appointment.duration} minutes)</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{appointment.location}</span>
          </div>
          
          {appointment.status === "cancelled" && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">Cancellation reason:</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{appointment.reason}</p>
                </div>
              </div>
            </div>
          )}
          
          {appointment.status === "upcoming" && (
            <div className="flex space-x-2 mt-2">
              <Button variant="outline" size="sm" className="flex-1">
                Reschedule
              </Button>
              <Button variant="destructive" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AppointmentsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === "all") return true;
    return apt.status === activeTab;
  });
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule New
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view available slots</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              <div className="mt-4">
                <h3 className="font-medium mb-2">Available Services</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Visa Consultation</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Document Authentication</span>
                  </div>
                  <div className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Language Assessment (Unavailable)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Academic Advising</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No appointments found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don't have any {activeTab} appointments.
                    </p>
                    <Button className="mt-6">
                      Schedule an Appointment
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
