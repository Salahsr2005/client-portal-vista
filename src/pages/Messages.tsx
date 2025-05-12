
import { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageCircle, Send, Lock, ChevronRight, ArrowRight,
  CreditCard, Clock, Check, FileCheck, FileText, AlertTriangle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useMessageAccess } from '@/hooks/useMessageAccess';

export default function Messages() {
  const { user } = useAuth();
  const { data: messages = [], isLoading } = useMessages();
  const messageAccess = useMessageAccess();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Filter messages based on tab
  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !msg.isRead;
    // Filter by message type
    return msg.senderType.toLowerCase() === activeTab.toLowerCase();
  });

  // Group messages by sender name (for conversation view)
  const conversations: Record<string, any> = {};
  
  filteredMessages.forEach(msg => {
    const senderId = msg.senderId;
    const displayName = msg.senderType === 'Admin' 
      ? 'Admin Support'
      : msg.senderType === 'System' 
        ? 'System'
        : 'Unknown';
        
    if (!conversations[senderId]) {
      conversations[senderId] = {
        id: senderId,
        subject: msg.subject,
        content: msg.content,
        sentAt: msg.sentAt,
        isRead: msg.isRead,
        senderType: msg.senderType,
        unread: msg.isRead ? 0 : 1
      };
    } else {
      if (!msg.isRead) {
        conversations[senderId].unread += 1;
      }
      // Update with most recent message
      if (new Date(msg.sentAt) > new Date(conversations[senderId].sentAt)) {
        conversations[senderId].subject = msg.subject;
        conversations[senderId].content = msg.content;
        conversations[senderId].sentAt = msg.sentAt;
        conversations[senderId].isRead = msg.isRead;
      }
    }
  });

  const conversationList = Object.values(conversations).sort((a, b) => 
    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

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
              <Lock className="h-10 w-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Access Restricted</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              {messageAccess.reason}
            </p>
            
            {messageAccess.status === 'noApplication' ? (
              // No application submitted
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center flex flex-col items-center">
                    <FileText className="h-6 w-6 text-slate-500 mb-2" />
                    <h4 className="font-medium">Apply</h4>
                    <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                      Required
                    </Badge>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center flex flex-col items-center">
                    <Clock className="h-6 w-6 text-slate-500 mb-2" />
                    <h4 className="font-medium">Review</h4>
                    <Badge variant="outline" className="mt-2">
                      Waiting
                    </Badge>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center flex flex-col items-center">
                    <MessageCircle className="h-6 w-6 text-slate-500 mb-2" />
                    <h4 className="font-medium">Message</h4>
                    <Badge variant="outline" className="mt-2">
                      Locked
                    </Badge>
                  </div>
                </div>
              </div>
            ) : messageAccess.requiresPayment ? (
              // Payment required
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center flex flex-col items-center">
                    <CreditCard className="h-6 w-6 text-slate-500 mb-2" />
                    <h4 className="font-medium">Payment</h4>
                    <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                      Pending
                    </Badge>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center flex flex-col items-center">
                    <Clock className="h-6 w-6 text-slate-500 mb-2" />
                    <h4 className="font-medium">Processing</h4>
                    <Badge variant="outline" className="mt-2">
                      Waiting
                    </Badge>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center flex flex-col items-center">
                    <FileCheck className="h-6 w-6 text-slate-500 mb-2" />
                    <h4 className="font-medium">Access</h4>
                    <Badge variant="outline" className="mt-2">
                      Locked
                    </Badge>
                  </div>
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
        
        <div className="text-slate-500 dark:text-slate-400 text-center mt-8">
          <h3 className="text-lg font-medium mb-2">Need Support?</h3>
          <p>Contact our team via email at support@yourdomain.com</p>
        </div>
      </div>
    );
  }

  if (isLoading || messageAccess.isLoading) {
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
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-16 w-2/3 rounded-md" />
                </div>
              ))}
            </div>
            <div className="p-4 border-t mt-auto">
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <Card className="text-center py-12 border-none shadow-lg">
          <CardContent>
            <div className="flex flex-col items-center">
              <MessageCircle className="h-16 w-16 text-slate-300 mb-4" />
              <h2 className="text-2xl font-medium mb-2">No messages yet</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                You don't have any messages in your inbox. When you receive messages from our team, they will appear here.
              </p>
              <Button 
                className="bg-gradient-to-r from-violet-600 to-purple-700"
                onClick={() => navigate('/applications')}
              >
                View My Applications
                <ChevronRight className="ml-2 h-4 w-4" /> 
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
          <div className="md:col-span-1 border rounded-md shadow-sm">
            <div className="p-2">
              <TabsList className="w-full bg-slate-100 dark:bg-slate-800/40 p-1">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                  {messages.filter(m => !m.isRead).length > 0 && (
                    <Badge className="ml-2 bg-violet-500">
                      {messages.filter(m => !m.isRead).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex-1">Support</TabsTrigger>
              </TabsList>
            </div>
            <ScrollArea className="h-[calc(70vh-100px)]">
              <div className="p-2 space-y-1">
                {conversationList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages in this category
                  </div>
                ) : (
                  conversationList.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition ${
                        conversation.unread > 0 ? 'bg-violet-50 dark:bg-violet-900/20 font-medium' : ''
                      }`}
                      onClick={() => navigate(`/messages/${conversation.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className={
                            conversation.senderType === 'Admin' ? 'bg-blue-100 text-blue-700' : 
                            conversation.senderType === 'System' ? 'bg-purple-100 text-purple-700' : 
                            'bg-slate-100 text-slate-700'
                          }>
                            {conversation.senderType === 'Admin' ? 'A' : 
                             conversation.senderType === 'System' ? 'S' : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="truncate font-medium">
                              {conversation.senderType === 'Admin' ? 'Admin Support' : 
                               conversation.senderType === 'System' ? 'System' : 'Unknown'}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {conversation.sentAt.split(',')[0]}
                            </span>
                          </div>
                          <p className="text-sm truncate text-muted-foreground">
                            {conversation.content}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-violet-600 dark:text-violet-400">
                              {conversation.subject}
                            </span>
                            {conversation.unread > 0 && (
                              <Badge variant="secondary" className="text-xs bg-violet-500 text-white">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <TabsContent value="all" className="m-0 col-span-2">
            <Card className="h-[70vh] flex flex-col border-none shadow-lg">
              <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-t-md">
                <h3 className="font-medium">Select a conversation</h3>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <MessageCircle className="h-16 w-16 text-slate-300" />
                  <h3 className="text-xl font-medium">Select a message</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Select a conversation from the list to view the messages
                  </p>
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex items-center">
                  <Textarea 
                    disabled
                    placeholder="Select a conversation to send messages..."
                    className="resize-none rounded-r-none" 
                  />
                  <Button disabled className="h-full rounded-l-none bg-gradient-to-r from-violet-600 to-purple-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="m-0 col-span-2">
            <Card className="h-[70vh] flex flex-col border-none shadow-lg">
              <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-t-md">
                <h3 className="font-medium">Unread Messages</h3>
              </div>
              <ScrollArea className="flex-1 p-6">
                {conversationList.filter(c => c.unread > 0).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Check className="h-16 w-16 text-green-300" />
                    <h3 className="text-xl font-medium">All caught up!</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      You have no unread messages
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {conversationList.filter(c => c.unread > 0).map((conversation) => (
                      <div 
                        key={conversation.id}
                        className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30 transition"
                        onClick={() => navigate(`/messages/${conversation.id}`)}
                      >
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback className={
                              conversation.senderType === 'Admin' ? 'bg-blue-100 text-blue-700' : 
                              conversation.senderType === 'System' ? 'bg-purple-100 text-purple-700' : 
                              'bg-slate-100 text-slate-700'
                            }>
                              {conversation.senderType === 'Admin' ? 'A' : 
                              conversation.senderType === 'System' ? 'S' : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">
                                {conversation.senderType === 'Admin' ? 'Admin Support' : 
                                conversation.senderType === 'System' ? 'System' : 'Unknown'}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {conversation.sentAt}
                              </span>
                            </div>
                            <p className="text-sm text-violet-600 dark:text-violet-400 mt-1">
                              {conversation.subject}
                            </p>
                            <p className="mt-2">{conversation.content}</p>
                            <div className="flex justify-end mt-2">
                              <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                                Read Message <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="m-0 col-span-2">
            <Card className="h-[70vh] flex flex-col border-none shadow-lg">
              <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-t-md">
                <h3 className="font-medium">Support Messages</h3>
              </div>
              <ScrollArea className="flex-1 p-6">
                {conversationList.filter(c => c.senderType === 'Admin').length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <MessageCircle className="h-16 w-16 text-slate-300" />
                    <h3 className="text-xl font-medium">No support messages</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      You don't have any messages from our support team yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {conversationList.filter(c => c.senderType === 'Admin').map((conversation) => (
                      <div 
                        key={conversation.id}
                        className={`${conversation.unread > 0 ? 'bg-violet-50 dark:bg-violet-900/20' : 'bg-slate-50 dark:bg-slate-900/20'} rounded-lg p-4 cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30 transition`}
                        onClick={() => navigate(`/messages/${conversation.id}`)}
                      >
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-700">A</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">Admin Support</h4>
                              <span className="text-xs text-muted-foreground">
                                {conversation.sentAt}
                              </span>
                            </div>
                            <p className="text-sm text-violet-600 dark:text-violet-400 mt-1">
                              {conversation.subject}
                            </p>
                            <p className="mt-2">{conversation.content}</p>
                            <div className="flex justify-end mt-2">
                              <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                                Read Message <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
