
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Bell, 
  Calendar, 
  FileText, 
  Package, 
  CreditCard, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
  Users,
  BookOpen,
  Globe,
  Sparkles,
  Plus
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useApplications } from "@/hooks/useApplications";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

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
    const mockNotifications = [
      { id: 1, message: "Your application to Stanford University has been received", date: "2023-08-01", read: false, type: "success" },
      { id: 2, message: "New document request for your Harvard MBA application", date: "2023-07-28", read: true, type: "warning" },
      { id: 3, message: "Upcoming appointment reminder: Visa Interview Preparation", date: "2023-07-25", read: false, type: "info" },
    ];
    
    setNotifications(mockNotifications);
    setUnreadNotificationsCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (profileLoading || applicationsLoading || appointmentsLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Applications",
      value: applications.filter(app => app.status === "In Review").length,
      icon: FileText,
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Programs Explored",
      value: "24",
      icon: BookOpen,
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Profile Completion",
      value: `${profileCompletion}%`,
      icon: Users,
      trend: profileCompletion > 80 ? "Complete" : "In Progress",
      trendUp: profileCompletion > 80
    },
    {
      title: "Upcoming Appointments",
      value: appointments.filter(apt => new Date(apt.date) > new Date()).length,
      icon: Calendar,
      trend: "This week",
      trendUp: false
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-primary/5 via-primary/2 to-transparent border-primary/10 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">
                    {greeting}, {userProfile?.firstName || "User"}!
                  </h1>
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg">
                  Welcome back to your Euro Visa dashboard. Continue your educational journey.
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/consultation">
                  <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Sparkles className="h-4 w-4" />
                    Start Consultation
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    {stat.trendUp ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.trendUp ? 'text-green-600' : 'text-blue-600'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications Section */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Recent Applications</CardTitle>
                  </div>
                  <Link to="/applications">
                    <Button variant="ghost" size="sm" className="gap-2">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app, index) => (
                      <motion.div 
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Globe className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{app.program}</p>
                            <p className="text-sm text-muted-foreground">{app.destination}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={app.status === "In Review" ? "default" : "secondary"}
                            className={app.status === "In Review" ? "bg-blue-100 text-blue-800" : ""}
                          >
                            {app.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{app.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No applications yet</p>
                    <Link to="/applications/new">
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create First Application
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/applications/new">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-primary/5 hover:border-primary">
                      <FileText className="h-6 w-6" />
                      <span>New Application</span>
                    </Button>
                  </Link>
                  <Link to="/programs">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-blue-500/5 hover:border-blue-500">
                      <Package className="h-6 w-6" />
                      <span>Browse Programs</span>
                    </Button>
                  </Link>
                  <Link to="/appointments">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-green-500/5 hover:border-green-500">
                      <Calendar className="h-6 w-6" />
                      <span>Book Appointment</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-3" />
                </div>
                {profileCompletion < 100 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      Complete your profile to unlock all features and improve your application success rate.
                    </p>
                  </div>
                )}
                <Link to="/profile">
                  <Button className="w-full" variant={profileCompletion === 100 ? "outline" : "default"}>
                    {profileCompletion === 100 ? "View Profile" : "Complete Profile"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle>Notifications</CardTitle>
                    {unreadNotificationsCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadNotificationsCount}
                      </Badge>
                    )}
                  </div>
                  <Link to="/notifications">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notif, index) => (
                      <motion.div 
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex gap-3 p-3 rounded-lg transition-colors ${
                          !notif.read ? "bg-primary/5 border border-primary/10" : "bg-muted/30"
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full mt-2 ${
                          notif.type === "success" ? "bg-green-500" :
                          notif.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm ${!notif.read ? "font-medium" : "text-muted-foreground"}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notif.date).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.slice(0, 2).map((apt, index) => (
                      <motion.div 
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{apt.service}</p>
                          <p className="text-xs text-muted-foreground">
                            {apt.date} at {apt.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">No upcoming appointments</p>
                    <Link to="/appointments">
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Schedule Appointment
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
