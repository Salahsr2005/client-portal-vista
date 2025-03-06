
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Inbox, Send, Plus, MessageSquare, Paperclip, Reply, Forward, Trash2, Eye } from 'lucide-react';

// Mock data for messages
const mockInboxMessages = [
  {
    id: 1,
    subject: "Your Application Status",
    sender: "admin@studyabroad.dz",
    date: "2023-10-15",
    read: true,
    content: "Dear Student, We're pleased to inform you that your application has been received and is currently under review. You should expect to hear back from us within the next 7-10 business days. Best regards, The Admissions Team"
  },
  {
    id: 2,
    subject: "Important Document Request",
    sender: "documents@studyabroad.dz",
    date: "2023-10-12",
    read: false,
    content: "Dear Applicant, We need you to submit your latest academic transcript to complete your application. Please upload this document through your dashboard as soon as possible. Thank you, Documentation Department"
  },
  {
    id: 3,
    subject: "Upcoming Visa Workshop",
    sender: "events@studyabroad.dz",
    date: "2023-10-10",
    read: true,
    content: "Hello, We're hosting a virtual workshop on visa application processes for students planning to study in France. The workshop will be held on October 20th at 3:00 PM. Registration is required. Best regards, Events Team"
  },
  {
    id: 4,
    subject: "Scholarship Opportunity",
    sender: "scholarships@studyabroad.dz",
    date: "2023-10-05",
    read: false,
    content: "Dear Student, Based on your academic profile, you may be eligible for the Excellence in Sciences scholarship. This scholarship covers up to 50% of tuition fees. Please reply if you're interested in applying. Regards, Scholarship Office"
  },
  {
    id: 5,
    subject: "Payment Confirmation",
    sender: "finance@studyabroad.dz",
    date: "2023-10-01",
    read: true,
    content: "Dear Client, This is to confirm that we have received your payment of 15,000 DZD for the application processing fee. A receipt has been attached to this message. Thank you, Finance Department"
  }
];

const mockSentMessages = [
  {
    id: 101,
    subject: "Re: Important Document Request",
    recipient: "documents@studyabroad.dz",
    date: "2023-10-13",
    content: "Hello, I have uploaded my academic transcript to my dashboard as requested. Please let me know if you need anything else. Thank you."
  },
  {
    id: 102,
    subject: "Question about Language Requirements",
    recipient: "info@studyabroad.dz",
    date: "2023-10-08",
    content: "Hello, I'm interested in applying for the Engineering program in Germany, but I'm unsure about the language requirements. Do I need to provide a German language certificate, or is English sufficient? Thank you for your help."
  },
  {
    id: 103,
    subject: "Request for Appointment",
    recipient: "advisors@studyabroad.dz",
    date: "2023-10-05",
    content: "Dear Advisor, I would like to schedule an appointment to discuss my study options in Canada. I'm available on weekdays after 4 PM. Looking forward to your response."
  }
];

const MessagesPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    message: ''
  });

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the logic to send the message
    console.log('Sending message:', newMessage);
    // Reset form and close dialog
    setNewMessage({ recipient: '', subject: '', message: '' });
    setShowComposeDialog(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Left sidebar with tabs */}
        <div className="w-full md:w-1/4 lg:w-1/5 space-y-4">
          <Tabs defaultValue="inbox" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inbox" className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                {t('messages.inbox')}
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {t('messages.sent')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {t('messages.compose')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('messages.compose')}</DialogTitle>
                <DialogDescription>
                  {t('messages.createNewMessage')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleComposeSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recipient" className="text-right">
                      {t('messages.recipient')}
                    </Label>
                    <Input
                      id="recipient"
                      value={newMessage.recipient}
                      onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">
                      {t('messages.subject')}
                    </Label>
                    <Input
                      id="subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="message" className="text-right pt-2">
                      {t('messages.message')}
                    </Label>
                    <Textarea
                      id="message"
                      value={newMessage.message}
                      onChange={(e) => setNewMessage({...newMessage, message: e.target.value})}
                      className="col-span-3"
                      rows={8}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{t('messages.sendMessage')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <TabsContent value="inbox" className={activeTab === 'inbox' ? 'block' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>{t('messages.inbox')}</CardTitle>
                <CardDescription>
                  {t('messages.inboxDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                        {t('common.back')}
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Forward className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <h3 className="text-lg font-medium">{selectedMessage.subject}</h3>
                        <span className="text-sm text-muted-foreground">{selectedMessage.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 pb-2">
                        <div className="font-medium">{t('messages.from')}: {selectedMessage.sender}</div>
                      </div>
                      <div className="pt-2 whitespace-pre-line">
                        {selectedMessage.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">{t('messages.subject')}</TableHead>
                        <TableHead>{t('messages.sender')}</TableHead>
                        <TableHead>{t('messages.date')}</TableHead>
                        <TableHead className="text-right">{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockInboxMessages.map((message) => (
                        <TableRow key={message.id} className={message.read ? '' : 'font-medium bg-muted/50'}>
                          <TableCell className="font-medium">
                            {!message.read && <span className="mr-2 h-2 w-2 rounded-full bg-blue-500 inline-block"></span>}
                            {message.subject}
                          </TableCell>
                          <TableCell>{message.sender}</TableCell>
                          <TableCell>{message.date}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(message)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sent" className={activeTab === 'sent' ? 'block' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>{t('messages.sent')}</CardTitle>
                <CardDescription>
                  {t('messages.sentDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                        {t('common.back')}
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon">
                          <Forward className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <h3 className="text-lg font-medium">{selectedMessage.subject}</h3>
                        <span className="text-sm text-muted-foreground">{selectedMessage.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 pb-2">
                        <div className="font-medium">{t('messages.to')}: {selectedMessage.recipient}</div>
                      </div>
                      <div className="pt-2 whitespace-pre-line">
                        {selectedMessage.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">{t('messages.subject')}</TableHead>
                        <TableHead>{t('messages.recipient')}</TableHead>
                        <TableHead>{t('messages.date')}</TableHead>
                        <TableHead className="text-right">{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSentMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="font-medium">{message.subject}</TableCell>
                          <TableCell>{message.recipient}</TableCell>
                          <TableCell>{message.date}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(message)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
