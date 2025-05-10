
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [educationBackground, setEducationBackground] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      // First check if profile exists in client_profiles
      const { data, error } = await supabase
        .from("client_profiles")
        .select("*")
        .eq("client_id", user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
      }

      if (data) {
        // Support both old and new schema
        setFullName(data.full_name || "");
        setEmail(data.email || user?.email || "");
        setPhone(data.phone || "");
        setCountry(data.country || "");
        setCity(data.city || "");
        setAddress(data.address || data.current_address || "");
        setIsSubscribed(data.is_subscribed || false);
        
        // New schema fields
        setCurrentAddress(data.current_address || "");
        setEducationBackground(data.education_background || "");
        setWorkExperience(data.work_experience || "");
        setAdditionalNotes(data.additional_notes || "");
        setEmergencyContactName(data.emergency_contact_name || "");
        setEmergencyContactPhone(data.emergency_contact_phone || "");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const profileData = {
        client_id: user?.id,
        full_name: fullName,
        email: email,
        phone: phone,
        country: country,
        city: city,
        address: address,
        current_address: currentAddress || address,
        is_subscribed: isSubscribed,
        education_background: educationBackground,
        work_experience: workExperience,
        additional_notes: additionalNotes,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
      };
      
      const { error } = await supabase
        .from("client_profiles")
        .upsert(profileData, { onConflict: 'client_id' });

      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Signed out successfully!",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Profile Information</CardTitle>
          <CardDescription>Update your profile information here.</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="personal" className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="education">Education & Work</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
            </TabsList>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              <TabsContent value="personal" className="p-0">
                <CardContent className="p-6 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={true}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Enter your country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subscribed"
                      checked={isSubscribed}
                      onCheckedChange={(checked) => setIsSubscribed(!!checked)}
                    />
                    <Label htmlFor="subscribed">Subscribe to newsletter</Label>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="education" className="p-0">
                <CardContent className="p-6 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-address">Current Address</Label>
                    <Input
                      id="current-address"
                      placeholder="Enter your current address"
                      value={currentAddress}
                      onChange={(e) => setCurrentAddress(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="education">Education Background</Label>
                    <Textarea
                      id="education"
                      placeholder="Describe your education background"
                      value={educationBackground}
                      onChange={(e) => setEducationBackground(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="work">Work Experience</Label>
                    <Textarea
                      id="work"
                      placeholder="Describe your work experience"
                      value={workExperience}
                      onChange={(e) => setWorkExperience(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="emergency" className="p-0">
                <CardContent className="p-6 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="emergency-name">Emergency Contact Name</Label>
                    <Input
                      id="emergency-name"
                      placeholder="Enter emergency contact name"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency-phone"
                      placeholder="Enter emergency contact phone"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <CardContent className="px-6 pb-6">
                <Button onClick={updateProfile} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </CardContent>
            </>
          )}
        </Tabs>
        
        <CardContent className="grid gap-4 pt-0">
          <Separator />
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing Out...
              </>
            ) : (
              "Sign Out"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
