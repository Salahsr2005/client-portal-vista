import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ResponsiveTabs, 
  ResponsiveTabsContent, 
  ResponsiveTabsList, 
  ResponsiveTabsTrigger 
} from "@/components/ui/responsive-tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import DocumentsList from '@/components/profile/DocumentsList';
import DocumentUpload from '@/components/profile/DocumentUpload';
import PaymentStatus from '@/components/profile/PaymentStatus';
import PaymentUploader from '@/components/profile/PaymentUploader';
import { 
  User, 
  FileText, 
  CreditCard, 
  Settings, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Globe,
  GraduationCap,
  Shield,
  Camera
} from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function EnhancedProfile() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { profile, updateProfile, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || '',
    nationality: profile?.nationality || '',
    birthDate: profile?.birth_date || '',
    bio: profile?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsEditing(false);
    await updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      nationality: formData.nationality,
      birth_date: formData.birthDate,
      bio: formData.bio,
    });
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800", isMobile ? "p-2" : "p-4")}>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header Section */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className={cn("flex flex-col sm:flex-row items-center gap-6", isMobile ? "p-4" : "p-8")}>
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold shadow-xl">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white dark:bg-gray-800 shadow-lg"
                variant="outline"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className={cn("font-bold text-gray-900 dark:text-white", isMobile ? "text-xl" : "text-3xl")}>
                {profile?.first_name || 'Your'} {profile?.last_name || 'Profile'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <Badge 
                  variant={profile?.profile_status === 'Complete' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {profile?.profile_status || 'Incomplete'}
                </Badge>
                {profile?.nationality && (
                  <Badge variant="outline" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    {profile.nationality}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
              >
                <Settings className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <ResponsiveTabs defaultValue="personal" onValueChange={setActiveTab}>
          <ResponsiveTabsList>
            <ResponsiveTabsTrigger value="personal">
              <User className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              {!isMobile && "Personal"}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="documents">
              <FileText className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              {!isMobile && "Documents"}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="payments">
              <CreditCard className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              {!isMobile && "Payments"}
            </ResponsiveTabsTrigger>
          </ResponsiveTabsList>

          {/* Personal Information Tab */}
          <ResponsiveTabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Basic Information Card */}
              <Card className="shadow-sm border-0 bg-white dark:bg-gray-900">
                <CardHeader className={isMobile ? "p-4" : "p-6"}>
                  <CardTitle className={cn("flex items-center gap-2", isMobile ? "text-lg" : "text-xl")}>
                    <User className="h-5 w-5 text-blue-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className={cn("space-y-4", isMobile ? "p-4 pt-0" : "p-6 pt-0")}>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        type="text"
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card className="shadow-sm border-0 bg-white dark:bg-gray-900">
                <CardHeader className={isMobile ? "p-4" : "p-6"}>
                  <CardTitle className={cn("flex items-center gap-2", isMobile ? "text-lg" : "text-xl")}>
                    <Phone className="h-5 w-5 text-green-500" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className={cn("space-y-4", isMobile ? "p-4 pt-0" : "p-6 pt-0")}>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResponsiveTabsContent>

          {/* Documents Tab */}
          <ResponsiveTabsContent value="documents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-sm border-0">
                <CardHeader className={isMobile ? "p-4" : "p-6"}>
                  <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload your required documents for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "p-2" : "p-6 pt-0"}>
                  <DocumentUpload />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-0">
                <CardHeader className={isMobile ? "p-4" : "p-6"}>
                  <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Your Documents</CardTitle>
                  <CardDescription>
                    View and manage your uploaded documents
                  </CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "p-2" : "p-6 pt-0"}>
                  <DocumentsList />
                </CardContent>
              </Card>
            </div>
          </ResponsiveTabsContent>

          {/* Payments Tab */}
          <ResponsiveTabsContent value="payments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-sm border-0">
                <CardHeader className={isMobile ? "p-4" : "p-6"}>
                  <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Payment Status</CardTitle>
                  <CardDescription>
                    View your payment history and status
                  </CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "p-2" : "p-6 pt-0"}>
                  <PaymentStatus />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-0">
                <CardHeader className={isMobile ? "p-4" : "p-6"}>
                  <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Upload Receipt</CardTitle>
                  <CardDescription>
                    Upload payment receipts for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "p-2" : "p-6 pt-0"}>
                  <PaymentUploader />
                </CardContent>
              </Card>
            </div>
          </ResponsiveTabsContent>
        </ResponsiveTabs>
      </div>
    </div>
  );
}
