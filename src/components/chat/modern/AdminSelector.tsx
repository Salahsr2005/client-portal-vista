
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { useAvailableAdmins } from '@/hooks/useAvailableAdmins';

interface AdminSelectorProps {
  onSelectAdmin: (adminId: string) => void;
  onClose: () => void;
}

export const AdminSelector: React.FC<AdminSelectorProps> = ({ onSelectAdmin, onClose }) => {
  const { admins, isLoading } = useAvailableAdmins();

  const handleSelectAdmin = async (adminId: string) => {
    await onSelectAdmin(adminId);
    onClose();
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Connect with Support
          </CardTitle>
          <p className="text-muted-foreground">Loading available advisors...</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 rounded-xl border border-border/50">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border/50">
      <CardHeader className="text-center pb-6 bg-gradient-to-r from-background to-muted/10 rounded-t-lg">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Connect with Support
        </CardTitle>
        <p className="text-muted-foreground">
          Choose an advisor to start a personalized conversation
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        {admins.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">No advisors available</h3>
            <p className="text-muted-foreground mb-6">
              All our advisors are currently busy. Please try again later.
            </p>
            <Button onClick={onClose} variant="outline">
              Go Back
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {admins.map((admin, index) => (
              <motion.div
                key={admin.admin_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center space-x-4 p-4 rounded-xl border border-border/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200 hover:shadow-md bg-gradient-to-r from-background to-muted/5 hover:from-violet-50/50 hover:to-purple-50/50 dark:hover:from-violet-950/10 dark:hover:to-purple-950/10">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-background shadow-sm">
                      <AvatarImage src={admin.photo_url} alt={admin.full_name} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-400 to-purple-500 text-white font-medium text-lg">
                        {admin.first_name[0]}{admin.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {admin.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background shadow-sm animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                        {admin.full_name}
                      </h3>
                      <Badge 
                        variant={admin.isOnline ? "default" : "secondary"} 
                        className={admin.isOnline ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {admin.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      Support Specialist • Ready to help with your study abroad journey
                    </p>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {admin.last_active 
                          ? `Last seen ${new Date(admin.last_active).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}`
                          : 'Available now'
                        }
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectAdmin(admin.admin_id)}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md group-hover:shadow-lg transition-all duration-200"
                  >
                    <span className="mr-2">Start Chat</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
