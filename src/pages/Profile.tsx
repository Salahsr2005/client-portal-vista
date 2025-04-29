
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
} from "lucide-react";
import { DocumentUpload } from "@/components/profile/DocumentUpload";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("client_users")
          .select("*, client_profiles(*)")
          .eq("client_id", user.id)
          .single();
        
        if (error) throw error;
        
        setProfile(data);
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          country: data.country || "",
          dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);

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
      
      // Refresh the profile data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from("client_users")
        .select("*, client_profiles(*)")
        .eq("client_id", user.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      setProfile(updatedProfile);
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

  if (loading) {
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{profile.first_name || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{profile.last_name || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{profile.phone || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{profile.city || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{profile.country || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">
                  {profile.date_of_birth 
                    ? new Date(profile.date_of_birth).toLocaleDateString() 
                    : "Not provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="font-medium">{profile.nationality || "Not provided"}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-3">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Membership Status</p>
                  <div className="flex items-center">
                    <Badge variant={profile.client_tier === "Paid" ? "default" : "secondary"}>
                      {profile.client_tier || "Basic"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Profile Completion</p>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                      {profile.profile_status || "Incomplete"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contact Preference</p>
                  <p className="font-medium">{profile.contact_preference || "Email"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {editMode && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button
            variant="outline"
            onClick={() => {
              setEditMode(false);
              // Reset form data to original values
              setFormData({
                firstName: profile.first_name || "",
                lastName: profile.last_name || "",
                email: profile.email || "",
                phone: profile.phone || "",
                city: profile.city || "",
                country: profile.country || "",
                dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split("T")[0] : "",
              });
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
  );

  const renderEducationTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Education & Qualifications</CardTitle>
        <CardDescription>Your academic background and qualifications</CardDescription>
      </CardHeader>
      <CardContent>
        {profile.client_profiles?.[0]?.education_background ? (
          <div dangerouslySetInnerHTML={{ __html: profile.client_profiles[0].education_background }} />
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={profile.photo_url || undefined} alt={profile.first_name} />
            <AvatarFallback className="text-2xl bg-primary text-white">
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold mb-1">{profile.first_name} {profile.last_name}</h1>
            <div className="flex items-center text-muted-foreground text-sm">
              <Mail className="h-4 w-4 mr-1" />
              {profile.email}
            </div>
          </div>
        </div>
        <div>
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100">
            Verified
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
