
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  User, Mail, Phone, Calendar, Globe, FileText, Building, 
  Languages, GraduationCap, Briefcase, ShieldCheck, Save, Upload
} from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Personal Information Form
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-01-01",
    nationality: "United States",
    passportNumber: "A1234567",
    passportExpiry: "2030-01-01",
    currentAddress: "123 Main St, Anytown, USA",
  });

  // Emergency Contact Form
  const [emergencyContact, setEmergencyContact] = useState({
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543",
    email: "jane.doe@example.com",
  });

  // Background Form
  const [backgroundInfo, setBackgroundInfo] = useState({
    education: "Bachelor's in Computer Science, XYZ University",
    workExperience: "5 years as Software Engineer at Tech Corp",
    languages: "English (Native), Spanish (Intermediate), French (Basic)",
  });

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = async () => {
    setUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
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
          {/* Personal Information */}
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
          
          {/* Emergency Contact */}
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
          
          {/* Background Information */}
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
                {/* Passport */}
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
                
                {/* Resume/CV */}
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
                
                {/* Degree Certificate */}
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
                
                {/* Upload New Document */}
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
                    onClick={handleDocumentUpload}
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
              {/* Password Change */}
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
              
              {/* Two-Factor Authentication */}
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
              
              {/* Session Management */}
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
                    <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
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
    </div>
  );
}
