
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
  const { data: profile, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    country: profile?.country || '',
    nationality: profile?.nationality || '',
    dateOfBirth: profile?.dateOfBirth || '',
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
    // Add update logic here when needed
  };

  const handleDocumentSuccess = () => {
    // Handle document upload success
  };

  const handleDocumentCancel = () => {
    // Handle document upload cancel
  };

  const handlePaymentSuccess = () => {
    // Handle payment upload success
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800", isMobile ? "p-2" : "p-4")}>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header Section */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className={cn("flex flex-col sm:flex-row items-center gap-6", isMobile ? "p-4" : "p-6")}>
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-xl">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-6 h-6 p-0 bg-white dark:bg-gray-800 shadow-lg"
                variant="outline"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className={cn("font-bold text-gray-900 dark:text-white", isMobile ? "text-xl" : "text-2xl")}>
                {profile?.firstName || 'Your'} {profile?.lastName || 'Profile'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-2 text-sm">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge 
                  variant={profile?.profileStatus === 'Complete' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {profile?.profileStatus || 'Incomplete'}
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
                size="sm"
              >
                <Settings className="mr-1 h-3 w-3" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <ResponsiveTabs defaultValue="personal" onValueChange={setActiveTab}>
          <ResponsiveTabsList>
            <ResponsiveTabsTrigger value="personal">
              <User className="mr-1 h-4 w-4" />
              Personal
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="documents">
              <FileText className="mr-1 h-4 w-4" />
              Documents
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="payments">
              <CreditCard className="mr-1 h-4 w-4" />
              Payments
            </ResponsiveTabsTrigger>
          </ResponsiveTabsList>

          {/* Personal Information Tab */}
          <ResponsiveTabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Basic Information Card */}
              <Card className="shadow-sm border-0 bg-white dark:bg-gray-900">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div>
                    <Label htmlFor="firstName" className="text-sm">First Name</Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-sm">Birth Date</Label>
                    <Input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality" className="text-sm">Nationality</Label>
                    <Input
                      type="text"
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card className="shadow-sm border-0 bg-white dark:bg-gray-900">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-green-500" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div>
                    <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-sm">City</Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-sm">Country</Label>
                    <Input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResponsiveTabsContent>

          {/* Documents Tab */}
          <ResponsiveTabsContent value="documents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-sm border-0">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Upload Documents</CardTitle>
                  <CardDescription className="text-sm">
                    Upload your required documents for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <DocumentUpload 
                    onSuccess={handleDocumentSuccess}
                    onCancel={handleDocumentCancel}
                  />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-0">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Your Documents</CardTitle>
                  <CardDescription className="text-sm">
                    View and manage your uploaded documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <DocumentsList />
                </CardContent>
              </Card>
            </div>
          </ResponsiveTabsContent>

          {/* Payments Tab */}
          <ResponsiveTabsContent value="payments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-sm border-0">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Payment Status</CardTitle>
                  <CardDescription className="text-sm">
                    View your payment history and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <PaymentStatus />
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-0">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Upload Receipt</CardTitle>
                  <CardDescription className="text-sm">
                    Upload payment receipts for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <PaymentUploader 
                    paymentId="default-payment-id"
                    onSuccess={handlePaymentSuccess}
                  />
                </CardContent>
              </Card>
            </div>
          </ResponsiveTabsContent>
        </ResponsiveTabs>
      </div>
    </div>
  );
}
