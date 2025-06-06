
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ModernChatInterface from "@/components/chat/ModernChatInterface";
import useMessageAccess from "@/hooks/useMessageAccess";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  AlertTriangle,
  Lock,
  CreditCard,
  FileText,
  Clock,
} from "lucide-react";

export default function ChatSupport() {
  const { user } = useAuth();
  const messageAccess = useMessageAccess();

  // If no user is logged in
  if (!user) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            Get quick answers or connect with our advisors
          </p>
        </div>

        <div className="h-[600px] flex items-center justify-center">
          <Card className="w-full max-w-md border-none shadow-lg">
            <CardHeader className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Sign in to Access Chat</CardTitle>
              <CardDescription>
                You need to be logged in to chat with our advisors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-purple-700">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/register">Create an Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If payment or application status is loading
  if (messageAccess.isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            Get quick answers or connect with our advisors
          </p>
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-[600px] w-full max-w-6xl rounded-lg" />
        </div>
      </div>
    );
  }

  // If user doesn't have approved application
  if (messageAccess.status === 'noApplication') {
    return (
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            Get quick answers or connect with our advisors
          </p>
        </div>

        <div className="h-[600px] flex items-center justify-center">
          <Card className="w-full max-w-md border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 mx-auto text-violet-500 mb-2" />
              <CardTitle>Application Required</CardTitle>
              <CardDescription>
                You need to submit an application to access our chat support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                <h3 className="font-medium text-violet-900 dark:text-violet-300 flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Application Status
                </h3>
                <p className="text-sm text-violet-700 dark:text-violet-400">
                  You haven't submitted any applications yet. Please submit an application to gain access to our support chat.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <FileText className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Apply</h4>
                  <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    Required
                  </Badge>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <Clock className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Review</h4>
                  <Badge variant="outline" className="mt-2">Pending</Badge>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Chat</h4>
                  <Badge variant="outline" className="mt-2">Locked</Badge>
                </div>
              </div>
              
              <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-purple-600">
                <Link to="/applications/new">
                  <FileText className="mr-2 h-4 w-4" />
                  Submit an Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If user hasn't paid or payment isn't approved
  if (!messageAccess.canAccessMessages) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground">
            Get quick answers or connect with our advisors
          </p>
        </div>

        <div className="h-[600px] flex items-center justify-center">
          <Card className="w-full max-w-md border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 mx-auto text-amber-500 mb-2" />
              <CardTitle>Chat Access Restricted</CardTitle>
              <CardDescription>
                Complete your payment to unlock chat support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-medium text-amber-900 dark:text-amber-300 flex items-center mb-2">
                  <CreditCard className="h-5 w-5 mr-2 text-amber-500" />
                  Payment Required
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {messageAccess.reason}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <CreditCard className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Payment</h4>
                  <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    Required
                  </Badge>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <Clock className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Processing</h4>
                  <Badge variant="outline" className="mt-2">Pending</Badge>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 text-slate-500 mb-2" />
                  <h4 className="font-medium">Access</h4>
                  <Badge variant="outline" className="mt-2">Locked</Badge>
                </div>
              </div>
              
              {messageAccess.requiresPayment && (
                <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-purple-600">
                  <Link to="/payments">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make a Payment
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/applications">
                  View My Applications
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Regular chat interface for paid users with approved applications
  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Support Chat</h1>
        <p className="text-muted-foreground">
          Connect with our advisors or get instant help from our AI assistant
        </p>
      </div>
      
      <ModernChatInterface />
    </div>
  );
}
