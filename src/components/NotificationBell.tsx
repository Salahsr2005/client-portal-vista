
import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Bell, Check, MessageSquare, FileText, Calendar, 
  CreditCard, Package, Trash2, Settings, BellOff 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';

const NotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    deleteAllNotifications,
    isLoading 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'application':
        return <FileText className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'program':
        return <Package className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const handleNotificationClick = (notification: any) => {
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
        navigate('/notifications');
    }
    
    setIsOpen(false);
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
  };
  
  const formatNotificationTime = (timestamp: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} min ago`;
    }
    
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    if (diffInHours < 48) {
      return 'Yesterday';
    }
    
    return format(date, 'MMM d');
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0 mr-4" align="end">
          <div className="p-4 border-b flex items-center justify-between">
            <h4 className="font-medium text-sm">Notifications</h4>
            
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => markAllAsRead()}>
                  <Check className="h-3 w-3 mr-1" />
                  <span>Mark all read</span>
                </Button>
              )}
              
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setShowClearConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b">
              <TabsList className="w-full grid grid-cols-2 rounded-none bg-transparent">
                <TabsTrigger value="all" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2">All</TabsTrigger>
                <TabsTrigger value="unread" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  <div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-muted cursor-pointer transition-colors ${!notification.is_read ? 'bg-muted/40' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.is_read ? 'bg-muted' : 'bg-primary/10'
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className={`text-sm ${!notification.is_read ? 'font-medium' : ''}`}>
                                {notification.title}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={(e) => handleDeleteNotification(e, notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {notification.content}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground">
                                {formatNotificationTime(notification.created_at)}
                              </p>
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] px-1 py-0 h-4 ${
                                  !notification.is_read ? 'bg-primary/10 text-primary' : ''
                                }`}
                              >
                                {notification.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">No notifications</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 text-xs"
                      size="sm"
                      onClick={() => navigate('/notifications')}
                    >
                      View all notifications
                    </Button>
                  </div>
                )}
              </ScrollArea>
              
              {notifications.length > 0 && (
                <>
                  <Separator />
                  
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-center text-sm"
                      onClick={() => {
                        navigate('/notifications');
                        setIsOpen(false);
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              <ScrollArea className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.filter(n => !n.is_read).length > 0 ? (
                  <div>
                    {notifications
                      .filter(n => !n.is_read)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className="p-3 hover:bg-muted cursor-pointer bg-muted/40"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium">
                                  {notification.title}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={(e) => handleDeleteNotification(e, notification.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {notification.content}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {formatNotificationTime(notification.created_at)}
                                </p>
                                <Badge 
                                  variant="outline" 
                                  className="text-[10px] px-1 py-0 h-4 bg-primary/10 text-primary"
                                >
                                  {notification.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Check className="h-12 w-12 text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">No unread notifications</p>
                  </div>
                )}
              </ScrollArea>
              
              {notifications.filter(n => !n.is_read).length > 0 && (
                <>
                  <Separator />
                  
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-center text-sm"
                      onClick={() => {
                        navigate('/notifications');
                        setIsOpen(false);
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
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
                setShowClearConfirm(false);
              }}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotificationBell;
