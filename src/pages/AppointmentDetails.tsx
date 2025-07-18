import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointments } from '@/hooks/useAppointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Video, 
  Phone,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock8
} from 'lucide-react';

export default function AppointmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: appointments = [] } = useAppointments();
  
  const appointment = appointments.find(app => app.id === id);
  
  if (!appointment) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Appointment Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The appointment you're looking for doesn't exist or may have been removed.
            </p>
            <Button onClick={() => navigate('/appointments')}>
              Back to Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      case "reserved":
        return CheckCircle;
      default:
        return Clock8;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "reserved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "video call":
      case "online":
        return Video;
      case "phone":
        return Phone;
      default:
        return MapPin;
    }
  };

  const StatusIcon = getStatusIcon(appointment.status);
  const ModeIcon = getModeIcon(appointment.mode || "");

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/appointments')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </Button>
        <h1 className="text-3xl font-bold">Appointment Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{appointment.service}</CardTitle>
            <Badge variant="outline" className={getStatusColor(appointment.status)}>
              <StatusIcon className="h-3.5 w-3.5 mr-1" />
              {appointment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">{appointment.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Advisor</p>
                  <p className="text-muted-foreground">
                    {appointment.advisor || "Assigned Advisor"}
                  </p>
                </div>
              </div>
              
              {appointment.mode && (
                <div className="flex items-center">
                  <ModeIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Mode</p>
                    <p className="text-muted-foreground">{appointment.mode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {appointment.location && appointment.mode !== "Video Call" && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{appointment.location}</p>
              </div>
            </div>
          )}

          {appointment.notes && (
            <div>
              <p className="font-medium mb-2">Notes</p>
              <p className="text-muted-foreground bg-muted p-3 rounded-md">
                {appointment.notes}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
              <Button variant="outline" className="text-red-500 hover:text-red-700">
                Cancel Appointment
              </Button>
            )}
            
            {appointment.mode === "Video Call" && appointment.status === "Reserved" && (
              <Button>
                Join Video Call
              </Button>
            )}
            
            {appointment.status === "Reserved" && (
              <Button variant="outline">
                Reschedule
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}