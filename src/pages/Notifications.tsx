
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  CheckCircle,
  Calendar,
  FileText,
  AlertCircle,
  MessageSquare,
  Info,
  X,
  Settings,
  CheckCheck,
  MoreHorizontal,
  Filter
} from 'lucide-react';

// Sample data
const notifications = [
  {
    id: 1,
    title: "Application Status Update",
    message: "Your application for the Algerian-French Exchange Program has moved to the interview stage.",
    timestamp: "2 hours ago",
    type: "application",
    read: false,
    action: "View Application"
  },
  {
    id: 2,
    title: "Appointment Reminder",
    message: "You have an Academic Advising session tomorrow at 10:00 AM. Location: Student Services Center, Room 102.",
    timestamp: "5 hours ago",
    type: "appointment",
    read: false,
    action: "View Appointment"
  },
  {
    id: 3,
    title: "Document Verification Complete",
    message: "Your academic transcripts have been verified successfully. You can proceed with your application.",
    timestamp: "Yesterday",
    type: "document",
    read: true,
    action: "View Documents"
  },
  {
    id: 4,
    title: "New Message",
    message: "You have received a new message from Dr. Mohammed Cherif regarding your program enrollment.",
    timestamp: "2 days ago",
    type: "message",
    read: true,
    action: "Read Message"
  },
  {
    id: 5,
    title: "Payment Due",
    message: "Reminder: Your program fee payment is due in 5 days. Please complete the payment to secure your spot.",
    timestamp: "3 days ago",
    type: "payment",
    read: false,
    priority: "high",
    action: "Make Payment"
  },
  {
    id: 6,
    title: "Scholarship Opportunity",
    message: "New scholarship opportunity available for international exchange students. Application deadline: November 30, 2023.",
    timestamp: "4 days ago",
    type: "announcement",
    read: true,
    action: "View Details"
  },
  {
    id: 7,
    title: "Deadline Extension",
    message: "The application deadline for the Summer Research in Renewable Energy program has been extended to December 15, 2023.",
    timestamp: "5 days ago",
    type: "announcement",
    read: true,
    action: "View Program"
  },
  {
    id: 8,
    title: "System Maintenance",
    message: "The student portal will be undergoing maintenance on Sunday, November 19, from 2:00 AM to 5:00 AM.",
    timestamp: "1 week ago",
    type: "system",
    read: true,
    action: null
  }
];

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationList, setNotificationList] = useState(notifications);
  
  const filteredNotifications = notificationList.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });
  
  const unreadCount = notificationList.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotificationList(notificationList.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: number) => {
    setNotificationList(notificationList.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const deleteNotification = (id: number) => {
    setNotificationList(notificationList.filter(n => n.id !== id));
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "appointment":
        return <Calendar className="h-6 w-6 text-purple-500" />;
      case "document":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "message":
        return <MessageSquare className="h-6 w-6 text-indigo-500" />;
      case "payment":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "announcement":
        return <Info className="h-6 w-6 text-yellow-500" />;
      case "system":
        return <Settings className="h-6 w-6 text-gray-500" />;
      default:
        return <Bell className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="ml-3 bg-primary">
              {unreadCount} New
            </Badge>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none">
            <Filter className="mr-2 h-4 w-4" />
            Preferences
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="application">Applications</TabsTrigger>
          <TabsTrigger value="appointment">Appointments</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <p className="text-muted-foreground mb-6">
            All notifications related to your account, applications, and services.
          </p>
        </TabsContent>
        <TabsContent value="unread" className="mt-0">
          <p className="text-muted-foreground mb-6">
            Notifications you haven't read yet.
          </p>
        </TabsContent>
        <TabsContent value="application" className="mt-0">
          <p className="text-muted-foreground mb-6">
            Updates and alerts about your program applications.
          </p>
        </TabsContent>
        <TabsContent value="appointment" className="mt-0">
          <p className="text-muted-foreground mb-6">
            Reminders about upcoming and scheduled appointments.
          </p>
        </TabsContent>
        <TabsContent value="message" className="mt-0">
          <p className="text-muted-foreground mb-6">
            New messages from advisors, administrators, and support staff.
          </p>
        </TabsContent>
        <TabsContent value="announcement" className="mt-0">
          <p className="text-muted-foreground mb-6">
            General announcements about programs, events, and opportunities.
          </p>
        </TabsContent>
      </Tabs>
      
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            You don't have any {activeTab !== "all" && activeTab} notifications at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-colors ${notification.read ? '' : 'border-primary/50 bg-primary/5'}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{notification.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center ml-4">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {notification.type}
                        </Badge>
                        {notification.priority === "high" && (
                          <Badge className="bg-red-500">High Priority</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                      </div>
                      {notification.action && (
                        <Button variant="link" size="sm" className="p-0">
                          {notification.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 bg-muted/50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
        <p className="text-muted-foreground mb-4">
          Customize how and when you receive notifications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Notifications</CardTitle>
              <CardDescription>
                Choose which notifications are sent to your email.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Configure Email Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>
                Set your notification priorities and frequency.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Manage Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
