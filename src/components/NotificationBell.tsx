
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
  const [lastCount, setLastCount] = useState(0);

  // Effect for bell animation when new notifications arrive
  useEffect(() => {
    if (unreadCount > lastCount && lastCount > 0) {
      setIsRinging(true);
      const timer = setTimeout(() => {
        setIsRinging(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
    setLastCount(unreadCount);
  }, [unreadCount, lastCount]);

  // Handle notification navigation based on type
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'payment':
        navigate('/payments');
        break;
      case 'application':
        if (notification.metadata?.application_id) {
          navigate(`/applications/${notification.metadata.application_id}`);
        } else {
          navigate('/applications');
        }
        break;
      case 'program':
        if (notification.metadata?.program_id) {
          navigate(`/programs/${notification.metadata.program_id}`);
        } else {
          navigate('/programs');
        }
        break;
      case 'appointment':
        navigate('/appointments');
        break;
      case 'message':
        navigate('/messages');
        break;
      default:
        navigate('/notifications');
        break;
    }
    
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <AnimatePresence mode="wait">
            {isRinging ? (
              <motion.div
                key="ringing"
                initial={{ rotate: -10 }}
                animate={{ 
                  rotate: [0, 15, -15, 15, -15, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ duration: 0.6, repeat: 1 }}
                className="text-violet-600"
              >
                <BellRing className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="normal"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Bell className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-700 text-[10px] font-bold"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 shadow-xl border-0 bg-background/95 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
          <h3 className="font-semibold text-violet-900 dark:text-violet-100">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1 text-violet-600 hover:text-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800" 
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full mx-auto mb-2"
            />
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Bell className="h-12 w-12 mx-auto opacity-20 mb-3" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs mt-1 opacity-70">We'll notify you when something happens</p>
            </motion.div>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[400px] overflow-y-auto">
              <div className="p-2">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownMenuItem 
                      className={`p-4 cursor-pointer transition-all duration-200 rounded-lg mb-2 border ${
                        !notification.is_read 
                          ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 dark:from-violet-900/30 dark:to-purple-900/30 dark:border-violet-700' 
                          : 'hover:bg-muted/50 border-transparent'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-medium text-sm leading-tight ${
                            !notification.is_read ? 'text-violet-900 dark:text-violet-200' : 'text-foreground'
                          }`}>
                            {notification.title}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 text-left">
                          {notification.content}
                        </p>
                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <Badge className="bg-gradient-to-r from-violet-600 to-purple-700 text-[10px] px-2 py-0.5">
                              New
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 capitalize">
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center text-violet-600 hover:text-violet-700 cursor-pointer h-12 font-medium bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20"
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
