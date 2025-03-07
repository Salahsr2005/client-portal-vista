
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, 
  BellOff, 
  MoreVertical, 
  Check, 
  Trash2, 
  FileText,
  Calendar,
  CreditCard,
  MessageSquare,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for notifications
const notifications = [
  {
    id: "NOT-001",
    type: "application",
    title: "Application Status Update",
    description: "Your application to University of Technology Exchange has been approved.",
    date: "2023-10-14T10:30:00",
    read: false,
    icon: FileText
  },
  {
    id: "NOT-002",
    type: "appointment",
    title: "Appointment Reminder",
    description: "You have a counseling session with Dr. Sarah Johnson tomorrow at 10:00 AM.",
    date: "2023-10-14T09:15:00",
    read: false,
    icon: Calendar
  },
  {
    id: "NOT-003",
    type: "payment",
    title: "Payment Confirmation",
    description: "Your payment of $299 for Visa Application Assistance has been processed successfully.",
    date: "2023-10-13T14:45:00",
    read: true,
    icon: CreditCard
  },
  {
    id: "NOT-004",
    type: "message",
    title: "New Message Received",
    description: "You have a new message from your advisor regarding your upcoming visa interview.",
    date: "2023-10-12T11:20:00",
    read: true,
    icon: MessageSquare
  },
  {
    id: "NOT-005",
    type: "system",
    title: "Profile Verification Required",
    description: "Please verify your identity by uploading a government-issued ID to continue with your application.",
    date: "2023-10-10T16:30:00",
    read: true,
    icon: Info
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "application":
      return "text-blue-500";
    case "appointment":
      return "text-purple-500";
    case "payment":
      return "text-green-500";
    case "message":
      return "text-yellow-500";
    case "system":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [notificationList, setNotificationList] = useState(notifications);

  // Filter notifications based on active tab
  const filteredNotifications = notificationList.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const handleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(notId => notId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleMarkAsRead = (ids: string[]) => {
    setNotificationList(notificationList.map(notification => 
      ids.includes(notification.id) 
        ? { ...notification, read: true } 
        : notification
    ));
    setSelectedNotifications([]);
  };

  const handleDeleteNotifications = (ids: string[]) => {
    setNotificationList(notificationList.filter(notification => !ids.includes(notification.id)));
    setSelectedNotifications([]);
  };

  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight mr-3">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="flex items-center">
              <Bell className="h-3 w-3 mr-1" />
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Preferences
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Email Notifications</DropdownMenuItem>
            <DropdownMenuItem>Push Notifications</DropdownMenuItem>
            <DropdownMenuItem>
              <BellOff className="h-4 w-4 mr-2" />
              Mute All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Stay updated with application status, messages, and other important alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 sm:mb-0">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="application">Applications</TabsTrigger>
                <TabsTrigger value="appointment">Appointments</TabsTrigger>
                <TabsTrigger value="message">Messages</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={selectedNotifications.length === 0}
                  onClick={() => handleMarkAsRead(selectedNotifications)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark as Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10"
                  disabled={selectedNotifications.length === 0}
                  onClick={() => handleDeleteNotifications(selectedNotifications)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="select-all" 
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                        checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      />
                      <label htmlFor="select-all" className="text-sm font-medium">
                        Select All
                      </label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {filteredNotifications.length} notifications
                    </span>
                  </div>
                </div>
                
                {filteredNotifications.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    No notifications to display.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => {
                      const NotificationIcon = notification.icon;
                      return (
                        <div 
                          key={notification.id} 
                          className={cn(
                            "flex p-4 hover:bg-muted/50 transition-colors",
                            !notification.read && "bg-muted/30"
                          )}
                        >
                          <div className="mr-4 pt-1">
                            <Checkbox 
                              checked={selectedNotifications.includes(notification.id)}
                              onCheckedChange={() => handleSelectNotification(notification.id)}
                            />
                          </div>
                          <div className="mr-4">
                            <div className={cn("rounded-full p-2 w-10 h-10 flex items-center justify-center", 
                              `bg-${getTypeColor(notification.type).split('-')[1]}-100`,
                              getTypeColor(notification.type)
                            )}>
                              <NotificationIcon className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(notification.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleMarkAsRead([notification.id])}>
                                      Mark as {notification.read ? 'Unread' : 'Read'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteNotifications([notification.id])}>
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                            <div className="mt-2 flex items-center">
                              <Badge variant="outline" className="capitalize text-xs">
                                {notification.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-2">
                                {new Date(notification.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              {/* Same notification list structure as 'all' tab */}
            </TabsContent>
            
            <TabsContent value="application" className="m-0">
              {/* Same notification list structure as 'all' tab */}
            </TabsContent>
            
            <TabsContent value="appointment" className="m-0">
              {/* Same notification list structure as 'all' tab */}
            </TabsContent>
            
            <TabsContent value="message" className="m-0">
              {/* Same notification list structure as 'all' tab */}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredNotifications.length} of {notificationList.length} notifications
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
