
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
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
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] min-h-[18px] flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1" 
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
            No notifications yet
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className={`px-4 py-3 cursor-pointer ${!notification.is_read ? 'bg-muted/50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.content}</p>
                    {!notification.is_read && (
                      <Badge className="self-start mt-1" variant="secondary">New</Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center text-primary cursor-pointer"
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
