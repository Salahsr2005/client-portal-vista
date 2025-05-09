
import { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationSystem();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);

  // Effect for bell animation when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setIsRinging(true);
      const timer = setTimeout(() => {
        setIsRinging(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Handle notification navigation based on type
  const handleNotificationClick = (notification: any) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'payment':
        navigate('/payments');
        break;
      case 'application':
        // Navigate to specific application if we have the ID
        if (notification.metadata?.application_id) {
          navigate(`/applications/${notification.metadata.application_id}`);
        } else {
          navigate('/applications');
        }
        break;
      case 'program':
        // Navigate to specific program if we have the ID
        if (notification.metadata?.program_id) {
          navigate(`/programs/${notification.metadata.program_id}`);
        } else {
          navigate('/programs');
        }
        break;
      case 'message':
        navigate('/messages');
        break;
      // Add more case handlers as needed
      default:
        // For other types, just navigate to notifications page
        navigate('/notifications');
        break;
    }
    
    // Close the dropdown
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <AnimatePresence>
            {isRinging ? (
              <motion.div
                key="ringing"
                initial={{ rotate: -5 }}
                animate={{ rotate: [0, 10, -10, 10, -10, 5, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <BellRing className="h-5 w-5 text-violet-600" />
              </motion.div>
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </AnimatePresence>
          
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-700"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1 text-violet-600 hover:text-violet-700 hover:bg-violet-50" 
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto opacity-20 mb-2" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${!notification.is_read ? 'bg-violet-50 dark:bg-violet-900/20' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <span className={`font-medium ${!notification.is_read ? 'text-violet-900 dark:text-violet-300' : ''}`}>
                        {notification.title}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notification.content}</p>
                    {!notification.is_read && (
                      <Badge className="self-start mt-1 bg-gradient-to-r from-violet-600 to-purple-700" variant="secondary">
                        New
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center text-violet-600 cursor-pointer h-10"
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
