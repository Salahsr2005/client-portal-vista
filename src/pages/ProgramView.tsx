import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  School, MapPin, CalendarDays, CircleDollarSign, GraduationCap, BookOpen, Clock, Globe, 
  Home, Building, Users, FileCheck, Award, Info, Languages, Heart, Check, CheckCircle, 
  Share2, ArrowLeft, Star, TrendingUp, BookmarkPlus, MessageCircle, Download, Eye,
  Wifi, Car, Utensils, Coffee, Dumbbell, Library, ChevronDown, ChevronUp
} from 'lucide-react';

export default function ProgramView() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('requirements');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!programId) return;
      
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('id', programId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setProgram(data);
        }
      } catch (error) {
        console.error('Error fetching program details:', error);
        toast({
          title: "Error",
          description: "Failed to load program details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
    
    if (user) {
      checkFavoriteStatus();
    }
  }, [programId, toast, user]);
  
  const checkFavoriteStatus = async () => {
    if (!user || !programId) return;
    
    try {
      const { data, error } = await supabase
        .from('favorite_programs')
        .select('id')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite status:', error);
      }
      
      setIsFavorite(!!data);
    } catch (err) {
      console.error('Error in checkFavoriteStatus:', err);
    }
  };
  
  const toggleFavorite = async () => {
    if (!user || !programId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorite programs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_programs')
          .delete()
          .eq('user_id', user.id)
          .eq('program_id', programId);
          
        if (error) throw error;
        
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Program removed from your favorites",
        });
      } else {
        const { error } = await supabase
          .from('favorite_programs')
          .insert({
            user_id: user.id,
            program_id: programId
          });
          
        if (error) throw error;
        
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Program added to your favorites",
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const programTitle = program?.name || "Educational Program";
    const text = `Check out this educational program: ${programTitle}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: programTitle,
          text: text,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Program link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Program link copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Sharing failed",
          description: "Unable to share this program",
          variant: "destructive",
        });
      }
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login or register to apply for programs.",
        variant: "default",
      });
      navigate("/login", { state: { from: `/programs/${programId}` } });
      return;
    }
    
    navigate(`/applications/new?program=${programId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading program details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Info className="h-16 w-16 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-bold mb-4">Program Not Found</h2>
              <p className="text-muted-foreground mb-6 max-w-md">The program you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/programs')} className="px-8">
                Browse All Programs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const programImage = program.image_url || '/placeholder.svg';
  const truncatedDescription = program.description?.length > 200 
    ? program.description.substring(0, 200) + "..." 
    : program.description;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/programs')}
            className="hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={programImage} 
              alt={program.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/20" 
                onClick={toggleFavorite}
              >
                <Heart 
                  className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                />
              </Button>
              <Button 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/20" 
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 text-white" />
              </Button>
            </div>
            
            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm font-medium">
                  {program.study_level}
                </Badge>
                <Badge variant="outline" className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {program.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span className="text-sm sm:text-base">{program.university}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm sm:text-base">{program.city}, {program.country}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Program Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold text-sm">{program.duration_months} months</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-4 text-center">
                  <Languages className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Language</p>
                  <p className="font-semibold text-sm">{program.program_language}</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-4 text-center">
                  <CircleDollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Tuition</p>
                  <p className="font-semibold text-sm">${program.tuition_min?.toLocaleString()}</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Places</p>
                  <p className="font-semibold text-sm">{program.available_places || "Open"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Program Description */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  About This Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {showFullDescription ? program.description : truncatedDescription}
                </p>
                {program.description?.length > 200 && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="p-0 h-auto text-blue-600 hover:text-blue-700"
                  >
                    {showFullDescription ? (
                      <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                    ) : (
                      <>Read More <ChevronDown className="h-4 w-4 ml-1" /></>
                    )}
                  </Button>
                )}
                
                {/* Feature Badges */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {program.scholarship_available && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400">
                      <Award className="h-3 w-3 mr-1" />
                      Scholarship Available
                    </Badge>
                  )}
                  {program.internship_opportunities && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Internships
                    </Badge>
                  )}
                  {program.exchange_opportunities && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                      <Globe className="h-3 w-3 mr-1" />
                      Exchange Programs
                    </Badge>
                  )}
                  {program.religious_facilities && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400">
                      <Heart className="h-3 w-3 mr-1" />
                      Religious Facilities
                    </Badge>
                  )}
                  {program.halal_food_availability && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400">
                      <Check className="h-3 w-3 mr-1" />
                      Halal Food
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
                      <TabsTrigger value="requirements" className="text-xs sm:text-sm py-2">Requirements</TabsTrigger>
                      <TabsTrigger value="costs" className="text-xs sm:text-sm py-2">Costs</TabsTrigger>
                      <TabsTrigger value="housing" className="text-xs sm:text-sm py-2">Life & Housing</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      <div className="grid gap-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            Field of Study
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">{program.field}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Program Advantages
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {program.advantages || "This program offers excellent academic opportunities with modern facilities and experienced faculty."}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <FileCheck className="h-5 w-5 text-purple-600" />
                            Application Process
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {program.application_process || "Our team will guide you through each step of the application process to ensure your success."}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="requirements" className="mt-0 space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Academic Requirements
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {program.academic_requirements || "Standard academic requirements apply based on your chosen level of study."}
                          </p>
                        </div>
                        {program.gpa_requirement && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Minimum GPA: {program.gpa_requirement}</span>
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Languages className="h-5 w-5 text-blue-600" />
                          Language Requirements
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <p className="font-medium text-blue-900 dark:text-blue-400">
                              Required Test: {program.language_test || "Contact for details"}
                            </p>
                            {program.language_test_score && (
                              <p className="text-blue-700 dark:text-blue-300 mt-1">
                                Minimum Score: {program.language_test_score}
                              </p>
                            )}
                          </div>
                          {program.language_test_exemptions && (
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                              <h5 className="font-medium mb-2">Exemptions Available</h5>
                              <p className="text-muted-foreground text-sm">{program.language_test_exemptions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="costs" className="mt-0 space-y-6">
                      <div className="grid gap-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Annual Tuition</h4>
                              <p className="text-2xl font-bold">
                                ${program.tuition_min?.toLocaleString()} - ${program.tuition_max?.toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="border-2 border-green-200 dark:border-green-800">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Monthly Living Costs</h4>
                              <p className="text-2xl font-bold">
                                ${program.living_cost_min?.toLocaleString()} - ${program.living_cost_max?.toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Application Fee:</span>
                              <span className="font-medium">${program.application_fee?.toLocaleString() || "TBD"}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Visa Fee:</span>
                              <span className="font-medium">${program.visa_fee?.toLocaleString() || "Varies"}</span>
                            </p>
                          </div>
                        </div>
                        
                        {program.scholarship_available && (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <Award className="h-5 w-5 text-yellow-600" />
                              Scholarship Opportunities
                            </h4>
                            <p className="text-muted-foreground mb-3">
                              {program.scholarship_details || "Merit-based and need-based scholarships available for qualified students."}
                            </p>
                            {program.scholarship_amount && (
                              <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                                Up to ${program.scholarship_amount?.toLocaleString()} available
                              </p>
                            )}
                            {program.scholarship_deadline && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Application Deadline: {program.scholarship_deadline}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="housing" className="mt-0 space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Home className="h-5 w-5 text-blue-600" />
                          Housing Options
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {program.housing_availability || "Various housing options available including dormitories, shared apartments, and private accommodations."}
                          </p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardContent className="p-4">
                              <h5 className="font-semibold mb-2 text-purple-700 dark:text-purple-400">Monthly Housing Cost</h5>
                              <p className="text-xl font-bold">
                                ${program.housing_cost_min?.toLocaleString()} - ${program.housing_cost_max?.toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                          
                          {program.north_african_community_size && (
                            <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                              <CardContent className="p-4">
                                <h5 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-400">Community Size</h5>
                                <p className="text-xl font-bold">{program.north_african_community_size}</p>
                                <p className="text-sm text-muted-foreground">North African students</p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-4">Campus Life & Facilities</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {program.religious_facilities && (
                            <div className="flex flex-col items-center text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                              <Heart className="h-8 w-8 text-amber-600 mb-2" />
                              <span className="text-sm font-medium">Prayer Facilities</span>
                            </div>
                          )}
                          {program.halal_food_availability && (
                            <div className="flex flex-col items-center text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                              <Utensils className="h-8 w-8 text-emerald-600 mb-2" />
                              <span className="text-sm font-medium">Halal Food</span>
                            </div>
                          )}
                          <div className="flex flex-col items-center text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Library className="h-8 w-8 text-blue-600 mb-2" />
