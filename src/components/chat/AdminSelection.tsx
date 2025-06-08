
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, User } from 'lucide-react';
import { useAvailableAdmins, Admin } from '@/hooks/useAvailableAdmins';

interface AdminSelectionProps {
  onSelectAdmin: (admin: Admin) => void;
}

export default function AdminSelection({ onSelectAdmin }: AdminSelectionProps) {
  const { admins, isLoading } = useAvailableAdmins();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Choose an Advisor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Choose an Advisor</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select an advisor to start a conversation
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {admins.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No advisors available right now</p>
          </div>
        ) : (
          admins.map((admin, index) => (
            <motion.div
              key={admin.admin_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="cursor-pointer"
              onClick={() => onSelectAdmin(admin)}
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={admin.photo_url} alt={admin.full_name} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {admin.first_name[0]}{admin.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {admin.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{admin.full_name}</p>
                    <Badge variant={admin.isOnline ? "default" : "secondary"} className="text-xs">
                      {admin.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      {admin.last_active 
                        ? `Last seen ${new Date(admin.last_active).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}`
                        : 'Never seen'
                      }
                    </span>
                  </div>
                </div>
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
