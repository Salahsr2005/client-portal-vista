
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageCircle, ChevronRight, ArrowRight,
  CreditCard, Clock, Check, FileCheck, FileText, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMessageAccess } from '@/hooks/useMessageAccess';
import { ModernChatInterface } from '@/components/chat/modern/ModernChatInterface';
import { ChatProvider } from '@/components/chat/modern/ChatProvider';

export default function Messages() {
  const { user } = useAuth();
  const messageAccess = useMessageAccess();
  const navigate = useNavigate();

  // If the user is not logged in
  if (!user) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-8 text-center mb-8">
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-slate-200 dark:bg-slate-800 mb-4">
              <MessageCircle className="h-10 w-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to View Messages</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              Please log in to access your messages and communicate with our team
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button 
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-700"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // If the user doesn't have access to messages
  if (!messageAccess.isLoading && !messageAccess.canAccessMessages) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-8 text-center mb-8">
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-slate-200 dark:bg-slate-800 mb-4">
              <AlertTriangle className="h-10 w-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Access Restricted</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              {messageAccess.reason}
            </p>
            
            {messageAccess.status === 'noApplication' ? (
              <div className="space-y-6 w-full max-w-md">
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 border border-violet-200 dark:border-violet-800">
                  <h3 className="font-medium flex items-center text-violet-900 dark:text-violet-300 mb-2">
                    <FileText className="h-5 w-5 mr-2 text-violet-600" />
                    Application Required
                  </h3>
                  <p className="text-sm text-violet-700 dark:text-violet-400 mb-4">
                    You need to submit an application to a program before you can access our messaging system.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-700"
                    onClick={() => navigate('/applications/new')}
                  >
                    Submit An Application
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : messageAccess.requiresPayment ? (
              <div className="space-y-6 w-full max-w-md">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <h3 className="font-medium flex items-center text-amber-900 dark:text-amber-300 mb-2">
                    <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                    Payment Required
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
                    Once your payment is completed, you'll have full access to our messaging system and support team.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
                    onClick={() => navigate('/payments')}
                  >
                    Complete Payment
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className="bg-gradient-to-r from-violet-600 to-purple-700"
                onClick={() => navigate('/programs')}
              >
                Browse Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (messageAccess.isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <div className="grid grid-cols-3 gap-6 h-[600px]">
          <div>
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 border rounded-md">
            <Skeleton className="h-14 w-full" />
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4 ml-auto" />
                  <Skeleton className="h-20 w-2/3 ml-auto rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has access to messages - show the modern chat interface
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with our support team</p>
      </div>
      
      <ChatProvider>
        <ModernChatInterface />
      </ChatProvider>
    </div>
  );
}

