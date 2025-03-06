
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Bell, Calendar, FileText, CreditCard, Clock, Trash2, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock notification data
const notifications = [
  {
    id: "notif-001",
    title: "Application Status Updated",
    message: "Your application for the Algerian-French Exchange Program has been approved.",
    date: "2023-10-15T09:30:00",
    read: false,
    type: "application"
  },
  {
    id: "notif-002",
    title: "Appointment Reminder",
    message: "You have a Visa Consultation appointment tomorrow at 2:30 PM.",
    date: "2023-10-18T14:00:00",
    read: true,
    type: "appointment"
  },
  {
    id: "notif-003",
    title: "Document Request",
    message: "Please submit your academic transcript for your University Application by October 25.",
    date: "2023-10-17T11:45:00",
    read: false,
    type: "document"
  },
  {
    id: "notif-004",
    title: "Payment Received",
    message: "We've received your payment of 2,500 DZD for Document Authentication services.",
    date: "2023-10-16T10:15:00",
    read: true,
    type: "payment"
  },
  {
    id: "notif-005",
    title: "New Message",
    message: "You have received a new message regarding your scholarship application.",
    date: "2023-10-15T16:00:00",
    read: false,
    type: "message"
  },
  {
    id: "notif-006",
    title: "Deadline Approaching",
    message: "The application deadline for the Technology Entrepreneurship Workshop is in 3 days.",
    date: "2023-10-14T09:00:00",
    read: true,
    type: "deadline"
  }
];

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: { notification: any, onMarkAsRead: (id: string) => void, onDelete: (id: string) => void }) => {
  const date = new Date(notification.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
  
  let icon;
  switch (notification.type) {
    case "application":
      icon = <FileText className="h-5 w-5 text-blue-500" />;
      break;
    case "appointment":
      icon = <Calendar className="h-5 w-5 text-green-500" />;
      break;
    case "document":
      icon = <FileText className="h-5 w-5 text-yellow-500" />;
      break;
    case "payment":
      icon = <CreditCard className="h-5 w-5 text-purple-500" />;
      break;
    case "message":
      icon = <Bell className="h-5 w-5 text-red-500" />;
      break;
    case "deadline":
      icon = <Clock className="h-5 w-5 text-orange-500" />;
      break;
    default:
      icon = <Bell className="h-5 w-5 text-muted-foreground" />;
  }
  
  return (
    <Card className={`mb-4 ${!notification.read ? 'border-primary/40 bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="mt-1">{icon}</div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
              </div>
              {!notification.read && (
                <Badge variant="secondary" className="ml-2">New</Badge>
              )}
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">
                {formattedDate} at {formattedTime}
              </span>
              <div className="flex gap-2">
                {!notification.read && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-2" 
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark as read
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-2 text-destructive hover:text-destructive" 
                  onClick={() => onDelete(notification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationsSettingsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Email Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-applications" className="flex-1">Application Updates</Label>
              <Switch id="email-applications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-appointments" className="flex-1">Appointment Reminders</Label>
              <Switch id="email-appointments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-documents" className="flex-1">Document Requests</Label>
              <Switch id="email-documents" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-payments" className="flex-1">Payment Confirmations</Label>
              <Switch id="email-payments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-messages" className="flex-1">New Messages</Label>
              <Switch id="email-messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-deadlines" className="flex-1">Deadline Reminders</Label>
              <Switch id="email-deadlines" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Push Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-applications" className="flex-1">Application Updates</Label>
              <Switch id="push-applications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-appointments" className="flex-1">Appointment Reminders</Label>
              <Switch id="push-appointments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-documents" className="flex-1">Document Requests</Label>
              <Switch id="push-documents" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-payments" className="flex-1">Payment Confirmations</Label>
              <Switch id="push-payments" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-messages" className="flex-1">New Messages</Label>
              <Switch id="push-messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-deadlines" className="flex-1">Deadline Reminders</Label>
              <Switch id="push-deadlines" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button className="w-full">Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationsList, setNotificationsList] = useState(notifications);
  
  const markAsRead = (id: string) => {
    setNotificationsList(
      notificationsList.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotificationsList(
      notificationsList.filter(notification => notification.id !== id)
    );
  };
  
  const markAllAsRead = () => {
    setNotificationsList(
      notificationsList.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const clearAll = () => {
    setNotificationsList([]);
  };
  
  const getFilteredNotifications = () => {
    if (activeTab === "all") return notificationsList;
    if (activeTab === "unread") return notificationsList.filter(n => !n.read);
    return notificationsList.filter(n => n.type === activeTab);
  };
  
  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notificationsList.filter(n => !n.read).length;
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
            <Button variant="outline" onClick={clearAll} disabled={notificationsList.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="application">Applications</TabsTrigger>
            <TabsTrigger value="appointment">Appointments</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TabsContent value={activeTab} className="mt-0">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))
                ) : (
                  <div className="py-12 text-center border rounded-lg">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don't have any {activeTab !== "all" ? activeTab : ""} notifications.
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
            
            <div className="lg:col-span-1">
              <NotificationsSettingsPanel />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsPage;
