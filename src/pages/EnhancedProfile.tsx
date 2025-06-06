
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
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Pencil, 
  Save, 
  X,
  Shield,
  Star,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import PaymentStatus from '@/components/profile/PaymentStatus';

export default function EnhancedProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('client_users')
          .select(`
            *,
            client_profiles(*)
          `)
          .eq('client_id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserData(data);
        
        if (data.client_profiles && data.client_profiles.length > 0) {
          setEditedData({
            ...data.client_profiles[0]
          });
        } else {
          setEditedData({});
        }
        
        // Calculate profile completion
        calculateProfileCompletion(data);
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

  const calculateProfileCompletion = (data: any) => {
    const fields = [
      data?.first_name,
      data?.last_name,
      data?.email,
      data?.phone,
      data?.date_of_birth,
      data?.nationality,
      data?.client_profiles?.[0]?.current_address,
      data?.client_profiles?.[0]?.passport_number,
      data?.client_profiles?.[0]?.education_background,
      data?.client_profiles?.[0]?.emergency_contact_name,
      data?.client_profiles?.[0]?.emergency_contact_phone
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const completion = Math.round((filledFields / fields.length) * 100);
    setProfileCompletion(completion);
  };
  
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
      
      const hasProfile = userData.client_profiles && userData.client_profiles.length > 0;
      
      if (hasProfile) {
        const { error } = await supabase
          .from('client_profiles')
          .update(editedData)
          .eq('client_id', user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('client_profiles')
          .insert({
            client_id: user.id,
            ...editedData
          });
        
        if (error) throw error;
      }
      
      const { data, error } = await supabase
        .from('client_users')
        .select(`
          *,
          client_profiles(*)
        `)
        .eq('client_id', user.id)
        .single();
      
      if (error) throw error;
      
      setUserData(data);
      setIsEditing(false);
      calculateProfileCompletion(data);
      
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and preferences</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Profile Completion</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={profileCompletion} className="w-24" />
              <span className="text-sm font-bold text-violet-600">{profileCompletion}%</span>
            </div>
          </div>
          <Badge variant={profileCompletion >= 80 ? "default" : "secondary"} className="bg-gradient-to-r from-violet-600 to-purple-600">
            {profileCompletion >= 80 ? "Complete" : "Incomplete"}
          </Badge>
        </div>
      </motion.div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
          <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <User className="mr-2 h-4 w-4" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Shield className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-8"
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/30">
              <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Personal Information</CardTitle>
                    <CardDescription className="text-violet-100">
                      Your personal details and contact information
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="secondary" onClick={() => setIsEditing(true)} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={handleCancel} disabled={isSaving} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving} className="bg-white hover:bg-gray-100 text-violet-600">
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
                </div>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-violet-200 shadow-lg">
                        <AvatarImage src={userData?.photo_url} alt={userData?.first_name} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-violet-600 to-purple-600 text-white">
                          {userData?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full shadow-lg">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{userData?.first_name} {userData?.last_name}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <Badge className="mt-2 bg-gradient-to-r from-violet-600 to-purple-600">
                        {userData?.client_tier || 'Basic'} Member
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-violet-600" />
                          First Name
                        </Label>
                        <Input 
                          id="first-name" 
                          value={isEditing ? editedData.first_name || '' : userData?.first_name || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("first_name", e.target.value)}
                          className="border-violet-200 focus:border-violet-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-violet-600" />
                          Last Name
                        </Label>
                        <Input 
                          id="last-name" 
                          value={isEditing ? editedData.last_name || '' : userData?.last_name || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("last_name", e.target.value)}
                          className="border-violet-200 focus:border-violet-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-violet-600" />
                          Email
                        </Label>
                        <Input id="email" value={user?.email || ''} disabled className="bg-gray-50" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-violet-600" />
                          Phone Number
                        </Label>
                        <Input 
                          id="phone" 
                          value={isEditing ? editedData.phone || '' : userData?.phone || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className="border-violet-200 focus:border-violet-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date-of-birth" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-violet-600" />
                          Date of Birth
                        </Label>
                        <Input 
                          id="date-of-birth" 
                          type="date" 
                          value={isEditing ? editedData.date_of_birth || '' : userData?.date_of_birth || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("date_of_birth", e.target.value)}
                          className="border-violet-200 focus:border-violet-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nationality" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-violet-600" />
                          Nationality
                        </Label>
                        <Input 
                          id="nationality" 
                          value={isEditing ? editedData.nationality || '' : userData?.nationality || ''} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("nationality", e.target.value)}
                          className="border-violet-200 focus:border-violet-400"
                        />
                      </div>
                    </div>
                    
                    <Separator className="bg-gradient-to-r from-violet-200 to-purple-200" />
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-address" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-violet-600" />
                          Current Address
                        </Label>
                        <Textarea 
                          id="current-address" 
                          value={isEditing ? editedData.current_address || '' : (userData?.client_profiles?.[0]?.current_address || "")} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("current_address", e.target.value)}
                          className="border-violet-200 focus:border-violet-400 min-h-[80px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="education-background" className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-violet-600" />
                          Education Background
                        </Label>
                        <Textarea 
                          id="education-background" 
                          value={isEditing ? editedData.education_background || '' : (userData?.client_profiles?.[0]?.education_background || "")} 
                          disabled={!isEditing} 
                          onChange={(e) => handleChange("education_background", e.target.value)}
                          className="border-violet-200 focus:border-violet-400 min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="documents">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Uploads
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Manage your documents and file uploads
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No documents uploaded yet</h3>
                  <p className="text-muted-foreground mb-6">Upload your documents to complete your profile</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="payments">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PaymentStatus />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
