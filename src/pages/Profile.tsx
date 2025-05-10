
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import PaymentStatus from '@/components/profile/PaymentStatus';
import DocumentsList from '@/components/profile/DocumentsList';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch user profile data
  const { data: profileData, isLoading, isError, refetch } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Join client_users and client_profiles
      const { data: userData, error: userError } = await supabase
        .from('client_users')
        .select(`
          client_id, 
          first_name, 
          last_name, 
          email, 
          phone, 
          nationality,
          country,
          city,
          photo_url,
          client_profiles (*)
        `)
        .eq('client_id', user.id)
        .single();
      
      if (userError) throw userError;
      
      return {
        ...userData,
        // Extract data from the nested client_profiles
        ...(userData.client_profiles || {}),
      };
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container max-w-6xl py-8">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const formattedName = () => {
    if (profileData) {
      return `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'User';
    }
    return 'User';
  };

  const avatarFallback = () => {
    if (profileData) {
      return `${profileData.first_name?.[0] || ''}${profileData.last_name?.[0] || ''}`.toUpperCase() || 'U';
    }
    return 'U';
  };

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      
      {/* User summary card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileData?.photo_url || undefined} alt={formattedName()} />
              <AvatarFallback className="text-lg">{avatarFallback()}</AvatarFallback>
            </Avatar>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-semibold">{formattedName()}</h2>
              {profileData && (
                <div className="text-muted-foreground mt-1">
                  {profileData.email && <p>{profileData.email}</p>}
                  {profileData.phone && <p>{profileData.phone}</p>}
                  {profileData.country && <p>{profileData.country}</p>}
                </div>
              )}
              <div className="mt-4">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="payments">Payments & Finances</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Your personal information used for applications and services</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    value={profileData?.first_name || ''}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    value={profileData?.last_name || ''}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={profileData?.email || ''}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={profileData?.phone || ''}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input 
                    id="nationality"
                    value={profileData?.nationality || ''}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport">Passport Number</Label>
                  <Input 
                    id="passport"
                    value={profileData?.passport_number || ''}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
              </div>
                
              <div className="space-y-2">
                <Label htmlFor="address">Current Address</Label>
                <Textarea 
                  id="address"
                  value={profileData?.current_address || ''}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-muted cursor-default' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education">Education Background</Label>
                <Textarea 
                  id="education"
                  value={profileData?.education_background || ''}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-muted cursor-default' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="work">Work Experience</Label>
                <Textarea 
                  id="work"
                  value={profileData?.work_experience || ''}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-muted cursor-default' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language Proficiency</Label>
                <Textarea 
                  id="language"
                  value={profileData?.language_proficiency || ''}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-muted cursor-default' : ''}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Information'}
              </Button>
              {isEditing && (
                <Button>Save Changes</Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Contact person in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Full Name</Label>
                  <Input 
                    id="emergencyName"
                    value={profileData?.emergency_contact_name || ''}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input 
                    id="emergencyPhone"
                    value={profileData?.emergency_contact_phone || ''}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <PaymentStatus />
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <DocumentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
