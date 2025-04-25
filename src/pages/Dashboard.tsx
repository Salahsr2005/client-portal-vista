
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bell, Calendar, FileText, Package, CreditCard, AlertCircle } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useApplications } from "@/hooks/useApplications";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: applications = [], isLoading: applicationsLoading } = useApplications();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Calculate profile completion percentage
  useEffect(() => {
    if (userProfile) {
      let completedFields = 0;
      const totalFields = 8;
      
      if (userProfile.firstName) completedFields++;
      if (userProfile.lastName) completedFields++;
      if (userProfile.phone) completedFields++;
      if (userProfile.dateOfBirth) completedFields++;
      if (userProfile.currentAddress) completedFields++;
      if (userProfile.nationality) completedFields++;
      if (userProfile.passportNumber) completedFields++;
      if (userProfile.emergencyContactName) completedFields++;
      
      setProfileCompletion(Math.floor((completedFields / totalFields) * 100));
    }
  }, [userProfile]);

  // Set greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Fetch notifications (simulated for now)
  useEffect(() => {
    // This would be replaced with a real API call
    const mockNotifications = [
      { id: 1, message: "Your application to Stanford University has been received", date: "2023-08-01", read: false },
      { id: 2, message: "New document request for your Harvard MBA application", date: "2023-07-28", read: true },
      { id: 3, message: "Upcoming appointment reminder: Visa Interview Preparation", date: "2023-07-25", read: false },
    ];
    
    setNotifications(mockNotifications);
    setUnreadNotificationsCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  if (profileLoading || applicationsLoading || appointmentsLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-light dark:glass-dark rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {greeting}, {userProfile?.firstName || "User"}!
            </h1>
            <p className="text-muted-foreground">
              Welcome back to your Euro Visa dashboard. Here's an overview of your journey.
            </p>
          </div>
          <Link to="/profile">
            <Button className="rounded-full">
              Complete Your Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-medium">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Applications Summary */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Applications</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Track your application progress</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{app.program}</p>
                      <p className="text-sm text-muted-foreground">{app.destination}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          app.status === "In Review" ? "bg-primary" : "bg-amber-400"
                        }`}></span>
                        <span className="text-xs">{app.status}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{app.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No applications yet</p>
              </div>
            )}
            <div className="mt-4">
              <Link to="/applications">
                <Button variant="outline" size="sm" className="w-full">
                  View All Applications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Programs */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Programs</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Explore available programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 space-y-3">
              <p className="text-muted-foreground">Discover programs matching your profile</p>
              <Link to="/programs">
                <Button variant="default" size="sm" className="w-full">
                  Browse Programs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Upcoming meetings and consultations</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{apt.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.date} at {apt.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No upcoming appointments</p>
              </div>
            )}
            <div className="mt-4">
              <Link to="/appointments">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Appointments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Payments */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Payments</CardTitle>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Review your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 space-y-3">
              <p className="text-muted-foreground">View your payment details and history</p>
              <Link to="/payments">
                <Button variant="outline" size="sm" className="w-full">
                  View Payments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Notifications</CardTitle>
              <div className="flex items-center">
                {unreadNotificationsCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center mr-2">
                    {unreadNotificationsCount}
                  </span>
                )}
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex gap-3 items-start pb-4 border-b last:border-0 last:pb-0">
                    {!notif.read && (
                      <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    )}
                    <div className={`flex-1 ${!notif.read ? "font-medium" : ""}`}>
                      <p className={notif.read ? "text-muted-foreground" : ""}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notif.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
            <div className="mt-4">
              <Link to="/notifications">
                <Button variant="outline" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            <Link to="/applications/new">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                New Application
              </Button>
            </Link>
            <Link to="/appointments/new">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </Link>
            <Link to="/consultation">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Start Program Consultation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
