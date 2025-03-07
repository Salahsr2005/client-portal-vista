
import { useState } from "react";
import { Bell, Check, Clock, FileText, Mail, MessageSquare, AlertTriangle, Info, Package, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Notification data
const notifications = [
  {
    id: 1,
    title: "Application Update",
    message: "Your application to Stanford University has been received and is now under review.",
    date: "2023-08-01T14:23:00",
    read: false,
    type: "application",
    priority: "high",
  },
  {
    id: 2,
    title: "Document Request",
    message: "Please upload your transcript for your Harvard MBA application.",
    date: "2023-07-28T09:45:00",
    read: true,
    type: "document",
    priority: "high",
  },
  {
    id: 3,
    title: "Appointment Reminder",
    message: "Your visa interview preparation appointment is scheduled for tomorrow at 10:00 AM.",
    date: "2023-07-25T16:30:00",
    read: false,
    type: "appointment",
    priority: "medium",
  },
  {
    id: 4,
    title: "Payment Confirmation",
    message: "Your payment of $250 for application services has been processed successfully.",
    date: "2023-07-20T11:15:00",
    read: true,
    type: "payment",
    priority: "low",
  },
  {
    id: 5,
    title: "New Message",
    message: "You have a new message from your education consultant regarding your applications.",
    date: "2023-07-18T13:40:00",
    read: false,
    type: "message",
    priority: "medium",
  },
  {
    id: 6,
    title: "Program Recommendation",
    message: "Based on your profile, we recommend checking the Data Science program at MIT.",
    date: "2023-07-15T10:20:00",
    read: true,
    type: "program",
    priority: "low",
  },
  {
    id: 7,
    title: "Application Deadline",
    message: "The application deadline for Columbia University is approaching in 5 days.",
    date: "2023-07-12T09:00:00",
    read: false,
    type: "deadline",
    priority: "high",
  },
  {
    id: 8,
    title: "Service Update",
    message: "Your resume review service has been completed. You can now download the updated resume.",
    date: "2023-07-10T14:50:00",
    read: true,
    type: "service",
    priority: "medium",
  },
];

// Get icon based on notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "application":
      return <FileText className="h-5 w-5" />;
    case "document":
      return <FileText className="h-5 w-5" />;
    case "appointment":
      return <Calendar className="h-5 w-5" />;
    case "payment":
      return <Bell className="h-5 w-5" />;
    case "message":
      return <MessageSquare className="h-5 w-5" />;
    case "program":
      return <Package className="h-5 w-5" />;
    case "deadline":
      return <Clock className="h-5 w-5" />;
    case "service":
      return <Bell className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

// Get priority badge color
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return <Badge variant="default">Medium</Badge>;
    case "low":
      return <Badge variant="outline">Low</Badge>;
    default:
      return null;
  }
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationState, setNotificationState] = useState(notifications);
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotificationState(notificationState.map(notif => ({ ...notif, read: true })));
  };
  
  // Mark single notification as read
  const markAsRead = (id: number) => {
    setNotificationState(notificationState.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = notificationState.filter(notif => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notif.read;
    return notif.type === activeTab;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <Button variant="outline" onClick={markAllAsRead}>
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>
            Stay informed about your applications, appointments, and important deadlines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 md:grid-cols-7 mb-6">
              <TabsTrigger value="all" className="text-xs md:text-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs md:text-sm">
                Unread
              </TabsTrigger>
              <TabsTrigger value="application" className="text-xs md:text-sm">
                Applications
              </TabsTrigger>
              <TabsTrigger value="appointment" className="text-xs md:text-sm">
                Appointments
              </TabsTrigger>
              <TabsTrigger value="message" className="hidden md:flex text-xs md:text-sm">
                Messages
              </TabsTrigger>
              <TabsTrigger value="payment" className="hidden md:flex text-xs md:text-sm">
                Payments
              </TabsTrigger>
              <TabsTrigger value="deadline" className="hidden md:flex text-xs md:text-sm">
                Deadlines
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div key={notification.id} className={`p-4 rounded-lg transition-colors ${
                    notification.read ? 'bg-card' : 'bg-primary/5'
                  }`}>
                    <div className="flex gap-4">
                      <div className={`p-2 rounded-full ${
                        notification.read ? 'bg-muted' : 'bg-primary/10'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-medium ${
                            !notification.read ? 'text-primary' : ''
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex gap-2 items-center">
                            {getPriorityBadge(notification.priority)}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(notification.date).toLocaleString(undefined, { 
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex justify-end pt-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-muted-foreground">
                    You're all caught up! No new notifications to display.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications on your mobile device
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Notification Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  Control how often you receive notifications
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
