import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, CheckCircle2, Sun, Moon } from "lucide-react";
import { useTheme } from '@/components/ThemeProvider';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import SettingsSelector from '@/components/settings/SettingsSelector';
import AccountStatusCard from '@/components/settings/AccountStatusCard';
import type { Theme } from "@/components/ThemeProvider";

const AppearancePage = () => {
  const { setTheme, theme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || 'light');
  const isMobile = useIsMobile();

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme as Theme);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize your interface preferences and theme options
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Theme</h4>
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            <div className="cursor-pointer" onClick={() => handleThemeChange('light')}>
              <div 
                className={`border-2 rounded-md p-3 aspect-video flex items-center justify-center overflow-hidden ${
                  selectedTheme === 'light' ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
                  <Sun className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <CheckCircle2 
                  className={`mr-2 h-4 w-4 ${
                    selectedTheme === 'light' ? 'text-primary opacity-100' : 'text-muted-foreground opacity-0'
                  }`} 
                />
                <span className="text-sm font-medium">Light</span>
              </div>
            </div>
            
            <div className="cursor-pointer" onClick={() => handleThemeChange('dark')}>
              <div 
                className={`border-2 rounded-md p-3 aspect-video flex items-center justify-center overflow-hidden ${
                  selectedTheme === 'dark' ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="w-full h-full bg-zinc-900 rounded-md flex items-center justify-center">
                  <Moon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <CheckCircle2 
                  className={`mr-2 h-4 w-4 ${
                    selectedTheme === 'dark' ? 'text-primary opacity-100' : 'text-muted-foreground opacity-0'
                  }`} 
                />
                <span className="text-sm font-medium">Dark</span>
              </div>
            </div>
            
            <div className="cursor-pointer" onClick={() => handleThemeChange('system')}>
              <div 
                className={`border-2 rounded-md p-3 aspect-video flex items-center justify-center overflow-hidden ${
                  selectedTheme === 'system' ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-r from-white to-zinc-900 rounded-md flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-amber-500" />
                    <Moon className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <CheckCircle2 
                  className={`mr-2 h-4 w-4 ${
                    selectedTheme === 'system' ? 'text-primary opacity-100' : 'text-muted-foreground opacity-0'
                  }`} 
                />
                <span className="text-sm font-medium">System</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Display Options</h4>
          <div className="space-y-3">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="animations" className="text-sm font-medium">Animations</Label>
                  <p className="text-xs text-muted-foreground">Enable interface animations</p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="condensed-view" className="text-sm font-medium">Condensed View</Label>
                  <p className="text-xs text-muted-foreground">Display more content with less spacing</p>
                </div>
                <Switch id="condensed-view" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationPage = () => {
  const isMobile = useIsMobile();
  
  const notificationSettings = [
    {
      category: 'Email Notifications',
      items: [
        { id: 'app-updates', label: 'Application Updates', description: 'Receive updates about your applications', defaultChecked: true },
        { id: 'message-notif', label: 'New Messages', description: 'Receive email notifications for new messages', defaultChecked: true },
        { id: 'payment-notif', label: 'Payment Confirmations', description: 'Receive confirmations for payments', defaultChecked: true },
        { id: 'marketing-emails', label: 'Marketing Emails', description: 'Receive promotional emails and offers', defaultChecked: false }
      ]
    },
    {
      category: 'System Notifications',
      items: [
        { id: 'browser-notif', label: 'Browser Notifications', description: 'Show notifications in your browser', defaultChecked: true },
        { id: 'sound-notif', label: 'Sound Notifications', description: 'Play sounds for important alerts', defaultChecked: false }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications and alerts
        </p>
      </div>
      <Separator />
      
      <div className="space-y-4">
        {notificationSettings.map((section) => (
          <div key={section.category}>
            <h4 className="text-sm font-medium mb-3">{section.category}</h4>
            <div className="space-y-2">
              {section.items.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={item.id} className="text-sm font-medium">{item.label}</Label>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <Switch id={item.id} defaultChecked={item.defaultChecked} className="ml-3" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        <div>
          <h4 className="text-sm font-medium mb-3">Notification Frequency</h4>
          <Select defaultValue="immediate">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediately</SelectItem>
              <SelectItem value="hourly">Hourly Digest</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Digest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

const AccountPage = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useUserProfile();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (profile) {
      setEmail(profile.email || '');
      setUsername(profile.username || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('client_users')
        .update({ username })
        .eq('client_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Account updated",
        description: "Your account information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <Separator />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">To change your email, please contact support</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Account Status</h4>
            <AccountStatusCard profileStatus={profile?.profileStatus} />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const SecurityPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const { toast } = useToast();
  
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChanging(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your password.",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your password and security settings
        </p>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Change Password</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <Button onClick={handlePasswordChange} disabled={isChanging} className="w-full sm:w-auto">
              {isChanging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailPage = () => {
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [emailFormat, setEmailFormat] = useState('html');
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Email Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage how you receive emails and communications
        </p>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Email Settings</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email-frequency">Summary Email Frequency</Label>
              <Select value={emailFrequency} onValueChange={setEmailFrequency}>
                <SelectTrigger id="email-frequency" className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-format">Email Format</Label>
              <Select value={emailFormat} onValueChange={setEmailFormat}>
                <SelectTrigger id="email-format" className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML (Rich Text)</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [activeSection, setActiveSection] = useState('account');
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return <AccountPage />;
      case 'appearance':
        return <AppearancePage />;
      case 'notifications':
        return <NotificationPage />;
      case 'security':
        return <SecurityPage />;
      case 'email':
        return <EmailPage />;
      default:
        return <AccountPage />;
    }
  };

  return (
    <div className={`container mx-auto py-6 ${isMobile ? 'px-2' : 'px-4 md:px-6'}`}>
      <div className="flex flex-col space-y-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>
      
      <div className={`${isMobile ? 'space-y-4' : 'flex space-x-6'}`}>
        {isMobile ? (
          <SettingsSelector activeSection={activeSection} onSectionChange={setActiveSection} />
        ) : (
          <div className="w-64 shrink-0">
            <Card>
              <CardContent className="p-3">
                <SettingsSelector activeSection={activeSection} onSectionChange={setActiveSection} />
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="flex-1">
          <Card>
            <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
