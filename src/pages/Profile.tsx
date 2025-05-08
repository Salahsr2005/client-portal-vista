
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Shield,
  Edit,
  Camera,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { DocumentUpload } from "@/components/profile/DocumentUpload";
import { PaymentStatus } from "@/components/profile/PaymentStatus";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile, isLoading } = useUserProfile();
  const { data: paymentStatus } = useUserPaymentStatus();
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (profile && !isLoading) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        city: profile.city || "",
        country: profile.country || "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
      });
    }
  }, [profile, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from("client_users")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          date_of_birth: formData.dateOfBirth || null,
        })
        .eq("client_id", user.id);
      
      if (error) throw error;
      
      setEditMode(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p>Profile not found. Please log in again.</p>
              <Button onClick={() => window.location.href = "/login"} className="mt-4">
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderPersonalInfoTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your personal details and contact information</CardDescription>
          </div>
          {!editMode && (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{profile.phone || "Not provided"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">
                    {profile.city && profile.country 
                      ? `${profile.city}, ${profile.country}`
                      : profile.city || profile.country || "Not provided"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</p>
                  <p className="font-medium">
                    {profile.dateOfBirth 
                      ? new Date(profile.dateOfBirth).toLocaleDateString() 
                      : "Not provided"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Account Status</p>
                  <div className="flex items-center">
                    <Badge 
                      variant={paymentStatus?.isPaid ? "default" : "secondary"}
                      className="mr-2"
                    >
                      {paymentStatus?.isPaid ? "Paid" : "Basic"}
                    </Badge>
                    {paymentStatus?.isPaid && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Profile Completion</p>
                  <div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                      {profile.profileStatus || "Incomplete"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {editMode && (
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setEditMode(false);
                // Reset form data to original values
                if (profile) {
                  setFormData({
                    firstName: profile.firstName || "",
                    lastName: profile.lastName || "",
                    email: profile.email || "",
                    phone: profile.phone || "",
                    city: profile.city || "",
                    country: profile.country || "",
                    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
                  });
                }
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={updating}>
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <PaymentStatus />
    </div>
  );

  const renderEducationTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Education & Qualifications</CardTitle>
        <CardDescription>Your academic background and qualifications</CardDescription>
      </CardHeader>
      <CardContent>
        {profile.educationBackground ? (
          <div dangerouslySetInnerHTML={{ __html: profile.educationBackground }} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3" />
            <p className="mb-2">No education information provided yet</p>
            <Button variant="outline" size="sm">
              Add Education Information
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container max-w-4xl py-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <div className="flex items-center gap-5 mb-4 sm:mb-0">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile.photoUrl || undefined} alt={profile.firstName} />
              <AvatarFallback className="text-3xl bg-primary text-white">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 shadow-md cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">{profile.firstName} {profile.lastName}</h1>
            <div className="flex items-center text-muted-foreground text-sm">
              <Mail className="h-4 w-4 mr-1" />
              {profile.email}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={paymentStatus?.isPaid ? "default" : "outline"} 
                className="mr-1"
              >
                {paymentStatus?.isPaid ? "Premium" : "Basic"}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100">
                Verified
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-muted-foreground mb-2">
            Member since {new Date(profile.createdAt).toLocaleDateString()}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/settings">
              <Shield className="h-4 w-4 mr-1" />
              Security Settings
            </a>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-1.5" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="education">
            <FileText className="h-4 w-4 mr-1.5" />
            Education
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-1.5" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        {/* Personal Info Tab */}
        <TabsContent value="personal">
          {renderPersonalInfoTab()}
        </TabsContent>
        
        {/* Education Tab */}
        <TabsContent value="education">
          {renderEducationTab()}
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <DocumentUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
