import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, Mail, Phone, Calendar, Globe, FileText, Building, 
  Languages, GraduationCap, Briefcase, ShieldCheck, Save, Upload,
  CheckCircle, AlertCircle, Clock, Camera
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function Profile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const { user } = useAuth();
  
  const { data: userProfile, isLoading: profileLoading, refetch } = useUserProfile();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    currentAddress: "",
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "Family",
    phone: "",
    email: "",
  });

  const [backgroundInfo, setBackgroundInfo] = useState({
    education: "",
    workExperience: "",
    languages: "",
  });
  
  useEffect(() => {
    if (userProfile) {
      setPersonalInfo({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        nationality: userProfile.nationality || "",
        passportNumber: userProfile.passportNumber || "", 
        passportExpiry: userProfile.passportExpiryDate || "",
        currentAddress: userProfile.currentAddress || "",
      });
      
      setBackgroundInfo({
        education: userProfile.educationBackground || "",
        workExperience: userProfile.workExperience || "",
        languages: userProfile.languageProficiency || "",
      });
      
      setEmergencyContact({
        name: userProfile.emergencyContactName || "",
        relationship: "Family",
        phone: userProfile.emergencyContactPhone || "",
        email: "",
      });
      
      let completedFields = 0;
      let totalFields = 0;
      
      Object.values(personalInfo).forEach(value => {
        totalFields++;
        if (value && value.trim() !== '') completedFields++;
      });
      
      Object.values(backgroundInfo).forEach(value => {
        totalFields++;
        if (value && value.trim() !== '') completedFields++;
      });
      
      Object.values(emergencyContact).forEach(value => {
        totalFields++;
        if (value && value.trim() !== '') completedFields++;
      });
      
      const completionPercentage = Math.round((completedFields / totalFields) * 100);
      setProfileCompletion(completionPercentage);
    }
  }, [userProfile]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmergencyContact({ ...emergencyContact, [name]: value });
  };

  const handleBackgroundInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBackgroundInfo({ ...backgroundInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error: userError } = await supabase
        .from('client_users')
        .update({
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          phone: personalInfo.phone,
          date_of_birth: personalInfo.dateOfBirth,
          nationality: personalInfo.nationality,
        })
        .eq('client_id', user?.id);
        
      if (userError) throw userError;
      
      const { data: existingProfile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', user?.id)
        .maybeSingle();
        
      if (existingProfile) {
        const { error: profileError } = await supabase
          .from('client_profiles')
          .update({
            current_address: personalInfo.currentAddress,
            passport_number: personalInfo.passportNumber,
            passport_expiry_date: personalInfo.passportExpiry,
            emergency_contact_name: emergencyContact.name,
            emergency_contact_phone: emergencyContact.phone,
            education_background: backgroundInfo.education,
            work_experience: backgroundInfo.workExperience,
            language_proficiency: backgroundInfo.languages,
          })
          .eq('client_id', user?.id);
          
        if (profileError) throw profileError;
      } else {
        const { error: profileError } = await supabase
          .from('client_profiles')
          .insert({
            client_id: user?.id,
            current_address: personalInfo.currentAddress,
            passport_number: personalInfo.passportNumber,
            passport_expiry_date: personalInfo.passportExpiry,
            emergency_contact_name: emergencyContact.name,
            emergency_contact_phone: emergencyContact.phone,
            education_background: backgroundInfo.education,
            work_experience: backgroundInfo.workExperience,
            language_proficiency: backgroundInfo.languages,
          });
          
        if (profileError) throw profileError;
      }
      
      await supabase
        .from('client_users')
        .update({
          profile_status: profileCompletion >= 80 ? 'Complete' : 'Incomplete'
        })
        .eq('client_id', user?.id);
      
      await refetch();
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setUploading(true);
    
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('client_users')
        .update({ photo_url: data.publicUrl })
        .eq('client_id', user?.id);

      if (updateError) throw updateError;

      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 animate-fade-in"
    >
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and settings</p>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-600">
          {saving ? "Saving..." : "Save Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-primary/10 to-violet-500/10">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 md:p-8 md:w-1/3 flex flex-col items-center md:border-r border-border">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-background shadow-xl mb-4">
                    <AvatarImage src={userProfile?.photo_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-3xl">
                      {personalInfo.firstName?.charAt(0)}{personalInfo.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-4 right-1 group-hover:scale-110 transition-transform">
                    <label htmlFor="avatar-upload" className="cursor-pointer bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
                      <Camera className="h-5 w-5" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mt-2">
                  {personalInfo.firstName || userProfile?.firstName} {personalInfo.lastName || userProfile?.lastName}
                </h2>
                <p className="text-muted-foreground mb-4">{personalInfo.email || userProfile?.email}</p>
                
                <div className="w-full mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <Badge variant={profileCompletion < 50 ? "destructive" : profileCompletion < 80 ? "outline" : "default"}>
                      {profileCompletion}%
                    </Badge>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>
                
                <div className="w-full flex gap-2 mt-6">
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {userProfile?.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString() : "Never logged in"}
                  </Badge>
                  <Badge 
                    variant={userProfile?.profileStatus === "Complete" ? "default" : "secondary"} 
                    className="flex items-center"
                  >
                    {userProfile?.profileStatus === "Complete" ? (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    ) : (
                      <AlertCircle className="mr-1 h-3 w-3" />
                    )}
                    {userProfile?.profileStatus || "Incomplete"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6 md:p-8 md:w-2/3">
                <h3 className="text-lg font-semibold mb-4">Quick Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{personalInfo.email || userProfile?.email || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{personalInfo.phone || userProfile?.phone || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nationality</p>
                      <p className="font-medium">{personalInfo.nationality || userProfile?.nationality || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{personalInfo.dateOfBirth || userProfile?.dateOfBirth || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{emergencyContact.name || userProfile?.emergencyContactName || "Not provided"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{emergencyContact.phone || userProfile?.emergencyContactPhone || "No phone number"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="personal" className="flex-1 sm:flex-none">
              Personal
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex-1 sm:flex-none">
              Documents
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 sm:flex-none">
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>
                  Your basic personal details used for applications and communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="nationality" className="text-sm font-medium">
                      Nationality
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="nationality"
                        name="nationality"
                        value={personalInfo.nationality}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="passportNumber" className="text-sm font-medium">
                      Passport Number
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="passportNumber"
                        name="passportNumber"
                        value={personalInfo.passportNumber}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="passportExpiry" className="text-sm font-medium">
                      Passport Expiry Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="passportExpiry"
                        name="passportExpiry"
                        type="date"
                        value={personalInfo.passportExpiry}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="currentAddress" className="text-sm font-medium">
                    Current Address
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Textarea
                      id="currentAddress"
                      name="currentAddress"
                      value={personalInfo.currentAddress}
                      onChange={handlePersonalInfoChange}
                      className="pl-10 pt-2 min-h-24"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Emergency Contact</CardTitle>
                <CardDescription>
                  Person to contact in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="emergencyName" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="emergencyName"
                      name="name"
                      value={emergencyContact.name}
                      onChange={handleEmergencyContactChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="relationship" className="text-sm font-medium">
                      Relationship
                    </label>
                    <Input
                      id="relationship"
                      name="relationship"
                      value={emergencyContact.relationship}
                      onChange={handleEmergencyContactChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="emergencyPhone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input
                      id="emergencyPhone"
                      name="phone"
                      value={emergencyContact.phone}
                      onChange={handleEmergencyContactChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="emergencyEmail" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="emergencyEmail"
                      name="email"
                      type="email"
                      value={emergencyContact.email}
                      onChange={handleEmergencyContactChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Background Information</CardTitle>
                <CardDescription>
                  Your educational and professional background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="education" className="text-sm font-medium flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Education
                  </label>
                  <Textarea
                    id="education"
                    name="education"
                    value={backgroundInfo.education}
                    onChange={handleBackgroundInfoChange}
                    className="min-h-24"
                    placeholder="Provide details about your educational background..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="workExperience" className="text-sm font-medium flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Work Experience
                  </label>
                  <Textarea
                    id="workExperience"
                    name="workExperience"
                    value={backgroundInfo.workExperience}
                    onChange={handleBackgroundInfoChange}
                    className="min-h-24"
                    placeholder="Provide details about your work experience..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="languages" className="text-sm font-medium flex items-center">
                    <Languages className="h-5 w-5 mr-2" />
                    Language Proficiency
                  </label>
                  <Textarea
                    id="languages"
                    name="languages"
                    value={backgroundInfo.languages}
                    onChange={handleBackgroundInfoChange}
                    className="min-h-24"
                    placeholder="List languages you know and your proficiency level..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Documents</CardTitle>
                <CardDescription>
                  Upload and manage your important documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">Passport</h3>
                        <p className="text-sm text-muted-foreground">Uploaded on 01/05/2023</p>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Replace
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">Resume/CV</h3>
                        <p className="text-sm text-muted-foreground">Uploaded on 15/06/2023</p>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Replace
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">Degree Certificate</h3>
                        <p className="text-sm text-muted-foreground">Uploaded on 10/07/2023</p>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Replace
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Upload New Document</p>
                    <p className="text-sm text-muted-foreground text-center">
                      Drag & drop or click to upload
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "This feature will be available soon.",
                        });
                      }}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Select File"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                    Change Password
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    
                    <Button>Update Password</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                    Two-Factor Authentication
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                    Active Sessions
                  </h3>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Last active: Just now
                        </p>
                      </div>
                      <Badge variant="success" className="bg-green-500 hover:bg-green-600 text-white">
                        Active
                      </Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="text-destructive">
                    Log Out All Other Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
