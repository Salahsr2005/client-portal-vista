import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Phone, Calendar, MapPin, FileText, Pencil, Save, X } from 'lucide-react';
import PaymentStatus from '@/components/profile/PaymentStatus';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            client_profiles(*)
          `)
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserData(data);
        
        // Initialize edited data with current values
        if (data.client_profiles && data.client_profiles.length > 0) {
          setEditedData({
            ...data.client_profiles[0]
          });
        } else {
          setEditedData({});
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);
  
  const handleChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Check if profile exists
      const hasProfile = userData.client_profiles && userData.client_profiles.length > 0;
      
      if (hasProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('client_profiles')
          .update(editedData)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('client_profiles')
          .insert({
            user_id: user.id,
            ...editedData
          });
        
        if (error) throw error;
      }
      
      // Refresh user data
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          client_profiles(*)
        `)
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setUserData(data);
      setIsEditing(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    // Reset edited data to current values
    if (userData.client_profiles && userData.client_profiles.length > 0) {
      setEditedData({
        ...userData.client_profiles[0]
      });
    } else {
      setEditedData({});
    }
    
    setIsEditing(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl py-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
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
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData?.avatar_url} alt={userData?.full_name} />
                      <AvatarFallback>
                        {userData?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-medium">{userData?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input 
                          id="full-name" 
                          value={isEditing ? editedData.full_name || '' : userData?.full_name || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("full_name", e.target.value)} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email || ''} disabled />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={isEditing ? editedData.phone || '' : userData?.phone || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("phone", e.target.value)} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="date-of-birth">Date of Birth</Label>
                        <Input 
                          id="date-of-birth" 
                          type="date" 
                          value={isEditing ? editedData.date_of_birth || '' : userData?.date_of_birth || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("date_of_birth", e.target.value)} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input 
                          id="nationality" 
                          value={isEditing ? editedData.nationality || '' : userData?.nationality || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("nationality", e.target.value)} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="passport-number">Passport Number</Label>
                        <Input 
                          id="passport-number" 
                          value={isEditing ? editedData.passport_number || '' : userData?.client_profiles?.[0]?.passport_number || "Not provided"} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("passport_number", e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-2">
                      <Label htmlFor="current-address">Current Address</Label>
                      <Textarea 
                        id="current-address" 
                        value={isEditing ? editedData.current_address || '' : userData?.client_profiles?.[0]?.current_address || "Not provided"} 
                        disabled={!isEditing} 
                        onChange={(e) => handleChange("current_address", e.target.value)} 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="education-background">Education Background</Label>
                      <Textarea 
                        id="education-background" 
                        value={isEditing ? editedData.education_background || '' : userData?.client_profiles?.[0]?.education_background || "Not provided"} 
                        disabled={!isEditing} 
                        onChange={(e) => handleChange("education_background", e.target.value)} 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="work-experience">Work Experience</Label>
                      <Textarea 
                        id="work-experience" 
                        value={isEditing ? editedData.work_experience || '' : userData?.client_profiles?.[0]?.work_experience || "Not provided"} 
                        disabled={!isEditing} 
                        onChange={(e) => handleChange("work_experience", e.target.value)} 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="language-proficiency">Language Proficiency</Label>
                      <Textarea 
                        id="language-proficiency" 
                        value={isEditing ? editedData.language_proficiency || '' : userData?.client_profiles?.[0]?.language_proficiency || "Not provided"} 
                        disabled={!isEditing} 
                        onChange={(e) => handleChange("language_proficiency", e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="emergency-contact-name">Emergency Contact Name</Label>
                      <Input 
                        id="emergency-contact-name" 
                        value={isEditing ? editedData.emergency_contact_name || '' : userData?.client_profiles?.[0]?.emergency_contact_name || "Not provided"} 
                        disabled={!isEditing} 
                        onChange={(e) => handleChange("emergency_contact_name", e.target.value)} 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="emergency-contact-phone">Emergency Contact Phone</Label>
                      <Input 
                        id="emergency-contact-phone" 
                        value={isEditing ? editedData.emergency_contact_phone || '' : userData?.client_profiles?.[0]?.emergency_contact_phone || "Not provided"} 
                        disabled={!isEditing} 
                        onChange={(e) => handleChange("emergency_contact_phone", e.target.value)} 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="emergency-contact-relationship">Relationship</Label>
                      <Input 
                        id="emergency-contact-relationship" 
                        value={isEditing ? editedData.emergency_contact_relationship || '' : userData?.emergency_contact_relationship || ''} 
                        disabled={!isEditing} 
                        onChange={(e) => handleChange("emergency_contact_relationship", e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Manage your documents and uploads</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No documents uploaded yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
}
