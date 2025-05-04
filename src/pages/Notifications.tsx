
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Info,
  Settings,
  CircleCheck,
  CircleAlert,
  BellRing
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications, UserNotification } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    isLoading
  } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sound: true
  });

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.is_read;
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
    ids.forEach(id => markAsRead(id));
    setSelectedNotifications([]);
  };

  const handleDeleteNotifications = (ids: string[]) => {
    ids.forEach(id => deleteNotification(id));
    setSelectedNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application':
        return FileText;
      case 'appointment':
        return Calendar;
      case 'payment':
        return CreditCard;
      case 'message':
        return MessageSquare;
      default:
        return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'text-blue-500';
      case 'appointment':
        return 'text-purple-500';
      case 'payment':
        return 'text-green-500';
      case 'message':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleNotificationClick = (notification: UserNotification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate based on type and metadata
    switch (notification.type) {
      case 'message':
        if (notification.metadata?.chat_id) {
          navigate(`/messages?chat=${notification.metadata.chat_id}`);
        } else {
          navigate('/messages');
        }
        break;
      case 'application':
        if (notification.metadata?.application_id) {
          navigate(`/applications/${notification.metadata.application_id}`);
        } else {
          navigate('/applications');
        }
        break;
      case 'appointment':
        if (notification.metadata?.appointment_id) {
          navigate(`/appointments/${notification.metadata.appointment_id}`);
        } else {
          navigate('/appointments');
        }
        break;
      case 'payment':
        if (notification.metadata?.payment_id) {
          navigate(`/payments?id=${notification.metadata.payment_id}`);
        } else {
          navigate('/payments');
        }
        break;
      case 'program':
        if (notification.metadata?.program_id) {
          navigate(`/programs/${notification.metadata.program_id}`);
        } else {
          navigate('/programs');
        }
        break;
      default:
        // Do nothing, just mark as read
        break;
    }
  };

  const notificationCounts = {
    all: notifications.length,
    unread: unreadCount,
    application: notifications.filter(n => n.type === 'application').length,
    appointment: notifications.filter(n => n.type === 'appointment').length,
    payment: notifications.filter(n => n.type === 'payment').length,
    message: notifications.filter(n => n.type === 'message').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight mr-3">Notifications</h1>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="secondary" className="flex items-center">
                <Bell className="h-3 w-3 mr-1" />
                {unreadCount} unread
              </Badge>
            </motion.div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem 
              onClick={() => setNotificationSettings({...notificationSettings, email: !notificationSettings.email})}
            >
              <div className="flex items-center justify-between w-full">
                <span>Email Notifications</span>
                <Checkbox checked={notificationSettings.email} />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setNotificationSettings({...notificationSettings, push: !notificationSettings.push})}
            >
              <div className="flex items-center justify-between w-full">
                <span>Push Notifications</span>
                <Checkbox checked={notificationSettings.push} />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setNotificationSettings({...notificationSettings, sound: !notificationSettings.sound})}
            >
              <div className="flex items-center justify-between w-full">
                <span>Sound Alerts</span>
                <Checkbox checked={notificationSettings.sound} />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <BellRing className="h-4 w-4 mr-2" />
                <span>Notification Types</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Applications</span>
                      <Checkbox defaultChecked />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Appointments</span>
                      <Checkbox defaultChecked />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Payments</span>
                      <Checkbox defaultChecked />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Messages</span>
                      <Checkbox defaultChecked />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <Separator className="my-2" />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <BellOff className="h-4 w-4 mr-2" />
              Clear All Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>
            Stay updated with application status, messages, and other important alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <TabsList className="mb-4 sm:mb-0">
                <TabsTrigger value="all" className="relative">
                  All
                  {notificationCounts.all > 0 && (
                    <span className="ml-1 text-xs bg-muted rounded-full px-1">{notificationCounts.all}</span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread" className="relative">
                  Unread
                  {notificationCounts.unread > 0 && (
                    <span className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-1">{notificationCounts.unread}</span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="application" className="relative">
                  Applications
                  {notificationCounts.application > 0 && (
                    <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1">{notificationCounts.application}</span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="appointment" className="relative">
                  Appointments
                  {notificationCounts.appointment > 0 && (
                    <span className="ml-1 text-xs bg-purple-100 text-purple-700 rounded-full px-1">{notificationCounts.appointment}</span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="message" className="relative">
                  Messages
                  {notificationCounts.message > 0 && (
                    <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 rounded-full px-1">{notificationCounts.message}</span>
                  )}
                </TabsTrigger>
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
            
            <TabsContent value={activeTab} className="m-0">
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
                
                {isLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                    {activeTab === "unread" ? (
                      <>
                        <CircleCheck className="h-12 w-12 text-muted-foreground/40" />
                        <p>All caught up! No unread notifications.</p>
                      </>
                    ) : activeTab === "all" ? (
                      <>
                        <Bell className="h-12 w-12 text-muted-foreground/40" />
                        <p>No notifications to display.</p>
                      </>
                    ) : (
                      <>
                        <CircleAlert className="h-12 w-12 text-muted-foreground/40" />
                        <p>No {activeTab} notifications found.</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => {
                      const NotificationIcon = getTypeIcon(notification.type);
                      return (
                        <motion.div 
                          key={notification.id} 
                          className={cn(
                            "flex p-4 hover:bg-muted/50 transition-colors",
                            !notification.is_read && "bg-muted/30"
                          )}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="mr-4 pt-1">
                            <Checkbox 
                              checked={selectedNotifications.includes(notification.id)}
                              onCheckedChange={() => handleSelectNotification(notification.id)}
                              onClick={(e) => e.stopPropagation()}
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
                              <h4 className={cn("text-sm font-medium", !notification.is_read && "font-semibold")}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground mr-2">
                                  {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Mark as {notification.is_read ? 'Unread' : 'Read'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.content}
                            </p>
                            <div className="mt-2 flex items-center">
                              <Badge variant="outline" className={cn(
                                "capitalize text-xs",
                                !notification.is_read && "bg-primary/5 border-primary/20"
                              )}>
                                {notification.type}
                              </Badge>
                              {!notification.is_read && (
                                <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
          
          <Select defaultValue="all" disabled={notifications.length === 0}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your notifications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteAllNotifications();
                setShowDeleteConfirm(false);
              }}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
