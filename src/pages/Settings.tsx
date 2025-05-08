
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, CheckCircle2, Mail, Bell, Lock, Shield, User, Moon, Sun } from "lucide-react";
import { useTheme } from '@/components/ThemeProvider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import type { Theme } from "@/components/ThemeProvider";

const AppearancePage = () => {
  const { setTheme, theme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || 'light');

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme as Theme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize your interface preferences and theme options
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-4">Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="cursor-pointer" onClick={() => handleThemeChange('light')}>
              <div 
                className={`border-2 rounded-md p-2 aspect-video flex items-center justify-center overflow-hidden ${
                  selectedTheme === 'light' ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
                  <Sun className="h-8 w-8 text-amber-500" />
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
                className={`border-2 rounded-md p-2 aspect-video flex items-center justify-center overflow-hidden ${
                  selectedTheme === 'dark' ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="w-full h-full bg-zinc-900 rounded-md flex items-center justify-center">
                  <Moon className="h-8 w-8 text-blue-400" />
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
                className={`border-2 rounded-md p-2 aspect-video flex items-center justify-center overflow-hidden ${
                  selectedTheme === 'system' ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-r from-white to-zinc-900 rounded-md flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-6 w-6 text-amber-500" />
                    <Moon className="h-6 w-6 text-blue-400" />
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
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Display Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations" className="text-base">Animations</Label>
                <p className="text-sm text-muted-foreground">Enable interface animations</p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="condensed-view" className="text-base">Condensed View</Label>
                <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
              </div>
              <Switch id="condensed-view" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications and alerts
        </p>
      </div>
      <Separator />
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-4">Email Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="app-updates" className="text-base">Application Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your applications</p>
              </div>
              <Switch id="app-updates" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="message-notif" className="text-base">New Messages</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for new messages</p>
              </div>
              <Switch id="message-notif" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payment-notif" className="text-base">Payment Confirmations</Label>
                <p className="text-sm text-muted-foreground">Receive confirmations for payments</p>
              </div>
              <Switch id="payment-notif" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails" className="text-base">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-4">System Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="browser-notif" className="text-base">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
              </div>
              <Switch id="browser-notif" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-notif" className="text-base">Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">Play sounds for important alerts</p>
              </div>
              <Switch id="sound-notif" />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3">Notification Frequency</h4>
          <Select defaultValue="immediate">
            <SelectTrigger className="w-full sm:w-[250px]">
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
    <div className="space-y-6">
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
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Account Status</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Account Type</span>
                </div>
                <Badge>{profile?.profileStatus || 'Incomplete'}</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Account Security</span>
                </div>
                <Badge variant="outline">Standard</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>2FA Authentication</span>
                </div>
                <Badge variant="destructive">Not Enabled</Badge>
              </div>
            </div>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your password and security settings
        </p>
      </div>
      <Separator />
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-4">Change Password</h4>
          <div className="space-y-4">
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
            
            <Button onClick={handlePasswordChange} disabled={isChanging} className="mt-2">
              {isChanging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-4">Two-Factor Authentication</h4>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h5 className="font-medium">Enable 2FA</h5>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button>Setup 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-4">Sessions</h4>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h5 className="font-medium">Current Session</h5>
                      <Badge variant="outline" className="ml-2">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Windows • Chrome • Last active now
                    </p>
                  </div>
                </div>
                <Separator />
                <Button variant="outline" className="w-full">Sign Out All Other Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const EmailPage = () => {
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [emailFormat, setEmailFormat] = useState('html');
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Email Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage how you receive emails and communications
        </p>
      </div>
      <Separator />
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-4">Email Settings</h4>
          <div className="space-y-4">
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
        
        <div>
          <h4 className="text-sm font-medium mb-4">Unsubscribe from</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="app-emails" className="text-base">Application Updates</Label>
                <p className="text-sm text-muted-foreground">Updates about your application status</p>
              </div>
              <Switch id="app-emails" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newsletter" className="text-base">Newsletter</Label>
                <p className="text-sm text-muted-foreground">Our weekly newsletter and updates</p>
              </div>
              <Switch id="newsletter" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="promotions" className="text-base">Promotional Emails</Label>
                <p className="text-sm text-muted-foreground">Discounts and promotional offers</p>
              </div>
              <Switch id="promotions" />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-4">Contact Preferences</h4>
          <div className="space-y-4">
            <Textarea 
              placeholder="Additional instructions for how we should contact you"
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Let us know if you have any specific preferences when we contact you
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Tabs defaultValue="account" className="w-full">
          <div className="sm:flex">
            <div className="sm:w-64 sm:shrink-0">
              <TabsList className="h-auto flex flex-col justify-start items-stretch p-0 bg-muted/40 sm:h-full rounded-none">
                <TabsTrigger
                  value="account"
                  className="justify-start px-6 py-3 data-[state=active]:bg-background border-r-2 border-transparent data-[state=active]:border-primary rounded-none"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Account</span>
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="justify-start px-6 py-3 data-[state=active]:bg-background border-r-2 border-transparent data-[state=active]:border-primary rounded-none"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  <span>Appearance</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="justify-start px-6 py-3 data-[state=active]:bg-background border-r-2 border-transparent data-[state=active]:border-primary rounded-none"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="justify-start px-6 py-3 data-[state=active]:bg-background border-r-2 border-transparent data-[state=active]:border-primary rounded-none"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="justify-start px-6 py-3 data-[state=active]:bg-background border-r-2 border-transparent data-[state=active]:border-primary rounded-none"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Email</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="p-6 w-full">
              <TabsContent value="account" className="mt-0">
                <AccountPage />
              </TabsContent>
              <TabsContent value="appearance" className="mt-0">
                <AppearancePage />
              </TabsContent>
              <TabsContent value="notifications" className="mt-0">
                <NotificationPage />
              </TabsContent>
              <TabsContent value="security" className="mt-0">
                <SecurityPage />
              </TabsContent>
              <TabsContent value="email" className="mt-0">
                <EmailPage />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
