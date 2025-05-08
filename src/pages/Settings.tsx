
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CurrencyCode } from "@/utils/currencyConverter";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  User,
  Settings,
  Lock,
  BellRing,
  LogOut,
  Globe,
  PaintBucket,
  Moon,
  Sun,
  Loader2,
  Camera,
  Trash,
  DollarSign,
  Shield,
  Languages
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTheme } from "@/components/ThemeProvider";
import { Progress } from "@/components/ui/progress";

// Define form schemas for various settings forms
const accountFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  language: z.string(),
  currency: z.string(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  applicationUpdates: z.boolean(),
  paymentReminders: z.boolean(),
  documentNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profileData, isLoading, refetch } = useUserProfile();
  const { theme, setTheme } = useTheme();
  
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("account");
  const [userSettings, setUserSettings] = useState({
    language: "en",
    currency: "EUR" as CurrencyCode,
    theme: "light",
    emailNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    paymentReminders: true,
    documentNotifications: true,
    marketingEmails: false,
  });

  // Initialize forms
  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      language: "en",
      currency: "EUR",
    },
  });

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      applicationUpdates: true,
      paymentReminders: true,
      documentNotifications: true,
      marketingEmails: false,
    },
  });

  // Set form default values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      accountForm.reset({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        language: userSettings.language,
        currency: userSettings.currency,
      });
      
      setProfileImage(profileData.photoUrl || null);
      
      // Fetch user settings
      fetchUserSettings();
    }
  }, [profileData]);
  
  // Fetch user settings from the database
  const fetchUserSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', `user_settings_${user.id}`)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        const settings = JSON.parse(data.value);
        setUserSettings(prev => ({
          ...prev,
          ...settings
        }));
        
        // Update forms with fetched settings
        accountForm.setValue('language', settings.language || 'en');
        accountForm.setValue('currency', settings.currency || 'EUR');
        
        notificationsForm.reset({
          emailNotifications: settings.emailNotifications ?? true,
          smsNotifications: settings.smsNotifications ?? false,
          applicationUpdates: settings.applicationUpdates ?? true,
          paymentReminders: settings.paymentReminders ?? true,
          documentNotifications: settings.documentNotifications ?? true,
          marketingEmails: settings.marketingEmails ?? false,
        });
        
        // Set theme if available
        if (settings.theme) {
          setTheme(settings.theme);
        }
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  };
  
  // Save user settings to database
  const saveUserSettings = async (newSettings: Partial<typeof userSettings>) => {
    if (!user) return;
    
    try {
      const updatedSettings = {
        ...userSettings,
        ...newSettings
      };
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: `user_settings_${user.id}`,
          category: 'user_preferences',
          value: JSON.stringify(updatedSettings),
          updated_by: user.id,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setUserSettings(updatedSettings);
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (data: z.infer<typeof accountFormSchema>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('client_users')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', user.id);
        
      if (error) throw error;
      
      // Save other settings like language and currency
      await saveUserSettings({
        language: data.language,
        currency: data.currency as CurrencyCode
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated.",
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Handle password update
  const handleUpdatePassword = async (data: z.infer<typeof securityFormSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Error updating password",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Handle notification settings update
  const handleUpdateNotifications = async (data: z.infer<typeof notificationsFormSchema>) => {
    await saveUserSettings(data);
  };

  // Handle theme toggle
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    saveUserSettings({ theme: newTheme });
  };

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `profile-photos/${user.id}/${Date.now()}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // Upload the image
      const { error: uploadError } = await supabase.storage
        .from('user-profiles')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('user-profiles')
        .getPublicUrl(filePath);
      
      // Update the user profile with the new image URL
      const { error: updateError } = await supabase
        .from('client_users')
        .update({
          photo_url: publicUrlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', user.id);
        
      if (updateError) throw updateError;
      
      setProfileImage(publicUrlData.publicUrl);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
      
      refetch();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error updating profile picture",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id
      );
      
      if (authError) throw authError;
      
      // Delete user data
      const { error: dataError } = await supabase
        .from('client_users')
        .delete()
        .eq('client_id', user.id);
        
      if (dataError) throw dataError;
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      
      // Sign out and redirect
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error deleting account",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/5">
              <div className="flex flex-col md:sticky md:top-20 space-y-1">
                <TabsList className="grid grid-cols-3 md:flex md:flex-col h-auto md:h-auto">
                  <TabsTrigger
                    value="account"
                    className="justify-start px-4 py-2 md:w-full"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="justify-start px-4 py-2 md:w-full"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="justify-start px-4 py-2 md:w-full"
                  >
                    <BellRing className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="justify-start px-4 py-2 md:w-full"
                  >
                    <PaintBucket className="mr-2 h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
                
                <div className="mt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              {/* Account settings */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Update your personal information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profileImage || '/placeholder.svg'} alt="Profile" />
                          <AvatarFallback>
                            {profileData?.firstName?.charAt(0) || "U"}
                            {profileData?.lastName?.charAt(0) || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2">
                          <label 
                            htmlFor="imageUpload"
                            className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center w-8 h-8 rounded-full"
                          >
                            {uploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Camera className="h-4 w-4" />
                            )}
                            <input
                              type="file"
                              id="imageUpload"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-xl font-medium">
                          {profileData?.firstName} {profileData?.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{profileData?.email}</p>
                        <div>
                          <Badge variant="outline" className="mt-2">{profileData?.profileStatus}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Form {...accountForm}>
                      <form onSubmit={accountForm.handleSubmit(handleUpdateProfile)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={accountForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={accountForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={accountForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email address</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="john@example.com" 
                                  {...field}
                                  readOnly
                                  className="bg-muted"
                                />
                              </FormControl>
                              <FormDescription>
                                Email cannot be changed. Contact support if needed.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={accountForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone number</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel" 
                                  placeholder="+1234567890" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={accountForm.control}
                            name="language"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Language</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="fr">Français</SelectItem>
                                    <SelectItem value="ar">العربية</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={accountForm.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="EUR">Euro (€)</SelectItem>
                                    <SelectItem value="DZD">Algerian Dinar (DZD)</SelectItem>
                                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit" className="mt-4">
                          Save changes
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security settings */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...securityForm}>
                      <form onSubmit={securityForm.handleSubmit(handleUpdatePassword)} className="space-y-4">
                        <FormField
                          control={securityForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={securityForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormDescription>
                                Password must be at least 8 characters with uppercase, lowercase, and numbers.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={securityForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm new password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="mt-4">
                          Update password
                        </Button>
                      </form>
                    </Form>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Two-factor authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Two-factor authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive codes via SMS or authenticator app for login
                          </p>
                        </div>
                        <Switch id="two-factor" aria-label="Two-factor authentication" disabled />
                      </div>
                      
                      <Button variant="outline" disabled>
                        <Shield className="mr-2 h-4 w-4" />
                        Configure two-factor
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Active Sessions</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your active sessions across devices
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Current browser</div>
                            <div className="text-xs text-muted-foreground">
                              {navigator.userAgent.split(' ').slice(-1)[0]} • 
                              {" Active now"}
                            </div>
                          </div>
                          <Badge variant="outline">Current</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Configure how you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...notificationsForm}>
                      <form onSubmit={notificationsForm.handleSubmit(handleUpdateNotifications)} className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium">Communication channels</h3>
                            <p className="text-sm text-muted-foreground">
                              Select how you'd like to receive notifications
                            </p>
                          </div>
                          
                          <div className="grid gap-4">
                            <FormField
                              control={notificationsForm.control}
                              name="emailNotifications"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center space-y-0 rounded-md border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email notifications</FormLabel>
                                    <FormDescription>
                                      Receive email notifications for important updates
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationsForm.control}
                              name="smsNotifications"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center space-y-0 rounded-md border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">SMS notifications</FormLabel>
                                    <FormDescription>
                                      Receive text messages for critical alerts
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium">Notification types</h3>
                            <p className="text-sm text-muted-foreground">
                              Choose what you want to be notified about
                            </p>
                          </div>
                          
                          <div className="grid gap-4">
                            <FormField
                              control={notificationsForm.control}
                              name="applicationUpdates"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center space-y-0 rounded-md border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Application updates</FormLabel>
                                    <FormDescription>
                                      Status changes and progress updates on your applications
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationsForm.control}
                              name="paymentReminders"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center space-y-0 rounded-md border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Payment reminders</FormLabel>
                                    <FormDescription>
                                      Notifications for upcoming and overdue payments
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationsForm.control}
                              name="documentNotifications"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center space-y-0 rounded-md border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Document notifications</FormLabel>
                                    <FormDescription>
                                      Updates about document submissions and approvals
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationsForm.control}
                              name="marketingEmails"
                              render={({ field }) => (
                                <FormItem className="flex justify-between items-center space-y-0 rounded-md border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Marketing emails</FormLabel>
                                    <FormDescription>
                                      Receive news, offers, and updates about our services
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Button type="submit" className="mt-4">
                          Save notification settings
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance settings */}
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how the application looks for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Theme</h3>
                        <p className="text-sm text-muted-foreground">
                          Select your preferred theme
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card 
                          className={`cursor-pointer ${theme === 'light' ? 'border-primary' : 'border-border'}`}
                          onClick={() => handleThemeChange('light')}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <Sun className="h-10 w-10 mb-4 text-amber-500" />
                            <div className="font-medium">Light</div>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer ${theme === 'dark' ? 'border-primary' : 'border-border'}`}
                          onClick={() => handleThemeChange('dark')}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <Moon className="h-10 w-10 mb-4 text-blue-500" />
                            <div className="font-medium">Dark</div>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer ${theme === 'system' ? 'border-primary' : 'border-border'}`}
                          onClick={() => handleThemeChange('system')}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <Settings className="h-10 w-10 mb-4 text-green-500" />
                            <div className="font-medium">System</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium">Display Language</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose your interface language
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card 
                          className={`cursor-pointer ${userSettings.language === 'en' ? 'border-primary' : 'border-border'}`}
                          onClick={() => saveUserSettings({ language: 'en' })}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <Languages className="h-10 w-10 mb-4 text-blue-500" />
                            <div className="font-medium">English</div>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer ${userSettings.language === 'fr' ? 'border-primary' : 'border-border'}`}
                          onClick={() => saveUserSettings({ language: 'fr' })}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <Languages className="h-10 w-10 mb-4 text-blue-500" />
                            <div className="font-medium">Français</div>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer ${userSettings.language === 'ar' ? 'border-primary' : 'border-border'}`}
                          onClick={() => saveUserSettings({ language: 'ar' })}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <Languages className="h-10 w-10 mb-4 text-blue-500" />
                            <div className="font-medium">العربية</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium">Currency Display</h3>
                        <p className="text-sm text-muted-foreground">
                          Select how you want prices displayed
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card 
                          className={`cursor-pointer ${userSettings.currency === 'EUR' ? 'border-primary' : 'border-border'}`}
                          onClick={() => saveUserSettings({ currency: 'EUR' })}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <DollarSign className="h-10 w-10 mb-4 text-green-500" />
                            <div className="font-medium">Euro (€)</div>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer ${userSettings.currency === 'DZD' ? 'border-primary' : 'border-border'}`}
                          onClick={() => saveUserSettings({ currency: 'DZD' })}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <DollarSign className="h-10 w-10 mb-4 text-green-500" />
                            <div className="font-medium">Algerian Dinar (DZD)</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
