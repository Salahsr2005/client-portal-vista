
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  School, MapPin, CalendarDays, CircleDollarSign, GraduationCap, BookOpen, Clock, Globe, 
  Home, Building, Users, FileCheck, Award, Info, Languages, Heart, Check, CheckCircle
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
    
    // Check if program is in favorites
    if (user) {
      checkFavoriteStatus();
    }
  }, [programId, toast, user]);
  
  // Check if program is in favorites
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
  
  // Toggle favorite status
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
        // Remove from favorites
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
        // Add to favorites
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

  const openDialog = (content: string) => {
    setDialogContent(content);
    setShowDialog(true);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Program Not Found</h2>
            <p className="text-muted-foreground mb-4">The program you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/programs')}>View All Programs</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Program image
  const programImage = program.image_url || '/placeholder.svg';

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-6">
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <img 
            src={programImage} 
            alt={program.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary">{program.study_level}</Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-white/20 hover:bg-white/30" 
                  onClick={toggleFavorite}
                >
                  <Heart 
                    className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                  />
                </Button>
              </div>
              <h1 className="text-3xl font-bold">{program.name}</h1>
              <div className="flex items-center mt-1">
                <Building className="h-4 w-4 mr-1" /> 
                <span>{program.university}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Program Info Column */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-wrap justify-between gap-2 items-start">
                <div>
                  <CardTitle className="text-2xl">{program.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building className="h-4 w-4 mr-1" /> 
                    {program.university}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>{program.city}, {program.country}</span>
                </div>
                <div className="flex items-center">
                  <Languages className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>{program.program_language}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>{program.duration_months} months</span>
                </div>
                <div className="flex items-center">
                  <CircleDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>${program.tuition_min?.toLocaleString()} - ${program.tuition_max?.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Program description */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Program Description</h3>
                <p className="text-muted-foreground">{program.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {program.scholarship_available && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                    <Award className="h-3.5 w-3.5 mr-1" /> Scholarship Available
                  </Badge>
                )}
                {program.internship_opportunities && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400">
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> Internship Opportunities
                  </Badge>
                )}
                {program.exchange_opportunities && (
                  <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                    <Globe className="h-3.5 w-3.5 mr-1" /> Exchange Opportunities
                  </Badge>
                )}
                {program.religious_facilities && (
                  <Badge variant="outline">
                    <Heart className="h-3.5 w-3.5 mr-1" /> Religious Facilities
                  </Badge>
                )}
                {program.halal_food_availability && (
                  <Badge variant="outline">
                    <Check className="h-3.5 w-3.5 mr-1" /> Halal Food Options
                  </Badge>
                )}
              </div>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                  <TabsTrigger value="housing">Housing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Field of Study</h4>
                      <p className="text-sm text-muted-foreground">{program.field}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Program Advantages</h4>
                      <p className="text-sm text-muted-foreground">{program.advantages || "Details not provided."}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Application Process</h4>
                      <p className="text-sm text-muted-foreground">{program.application_process || "Contact an advisor for detailed application process information."}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="requirements" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Academic Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        {program.academic_requirements || "Standard academic requirements apply."}
                      </p>
                      {program.gpa_requirement && (
                        <div className="mt-2 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Minimum GPA: {program.gpa_requirement}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Language Requirements</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {program.language_test && `${program.language_test}: ${program.language_test_score || "Score requirements vary"}`}
                        </p>
                        {program.language_test_exemptions && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Exemptions:</span> {program.language_test_exemptions}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Admission Requirements</h4>
                      <p className="text-sm text-muted-foreground">{program.admission_requirements}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="costs" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Tuition Fees</h4>
                      <p className="text-sm text-muted-foreground">
                        ${program.tuition_min?.toLocaleString()} - ${program.tuition_max?.toLocaleString()} per year
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Living Costs</h4>
                      <p className="text-sm text-muted-foreground">
                        Estimated monthly living expenses: ${program.living_cost_min?.toLocaleString()} - ${program.living_cost_max?.toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Additional Fees</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Application Fee:</span> ${program.application_fee?.toLocaleString() || "N/A"}</p>
                        <p><span className="text-muted-foreground">Visa Fee:</span> ${program.visa_fee?.toLocaleString() || "Varies by nationality"}</p>
                      </div>
                    </div>
                    
                    {program.scholarship_available && (
                      <div>
                        <h4 className="font-medium mb-2">Scholarship Information</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.scholarship_details || "Scholarships available based on academic merit and financial need."}
                        </p>
                        {program.scholarship_amount && (
                          <p className="text-sm font-medium mt-1">
                            Up to ${program.scholarship_amount?.toLocaleString()} available
                          </p>
                        )}
                        {program.scholarship_deadline && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Deadline: {program.scholarship_deadline}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="housing" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Housing Options</h4>
                      <p className="text-sm text-muted-foreground">
                        {program.housing_availability || "Contact the university for housing information."}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Housing Costs</h4>
                      <p className="text-sm text-muted-foreground">
                        Estimated monthly housing costs: ${program.housing_cost_min?.toLocaleString()} - ${program.housing_cost_max?.toLocaleString()}
                      </p>
                    </div>
                    
                    {program.north_african_community_size && (
                      <div>
                        <h4 className="font-medium mb-2">Community</h4>
                        <p className="text-sm text-muted-foreground">
                          North African community size: {program.north_african_community_size}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {program.religious_facilities && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400">
                          Religious Facilities Available
                        </Badge>
                      )}
                      {program.halal_food_availability && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400">
                          Halal Food Options
                        </Badge>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Application Column */}
        <div>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Application</CardTitle>
              <CardDescription>Key information about applying</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Deadline</h3>
                  <div className="flex items-center text-base">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                    <span>{program.application_deadline || "Contact for details"}</span>
                  </div>
                </div>
                
                {program.available_places !== null && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Available Places</h3>
                    <div className="flex items-center text-base">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>{program.available_places} / {program.total_places || "∞"}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Application Fee</h3>
                  <div className="flex items-center text-base">
                    <CircleDollarSign className="h-4 w-4 mr-2 text-primary" />
                    <span>${program.application_fee?.toLocaleString() || "Contact for details"}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Required Documents</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <span className="text-sm">Academic transcripts</span>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <span className="text-sm">Language proficiency test results</span>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <span className="text-sm">Passport copy</span>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <span className="text-sm">Motivation letter</span>
                    </li>
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => openDialog('requirements')}
                  >
                    View All Requirements
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium mb-1">Our Services</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                      <span>Application preparation</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                      <span>Document verification</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                      <span>Visa guidance</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                      <span>Pre-departure orientation</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/services')}
                  >
                    View Our Services
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" onClick={handleApplyClick}>
                Apply Now
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/consultation')}>
                Get Consultation
              </Button>
              <Button 
                variant={isFavorite ? "secondary" : "outline"}
                className="w-full"
                onClick={toggleFavorite}
              >
                <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Dialog for detailed content */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogContent === 'requirements' ? 'Application Requirements' : 'University Details'}
            </DialogTitle>
            <DialogDescription>
              {program.name} at {program.university}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {dialogContent === 'requirements' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Academic Requirements</h3>
                  <p>{program.academic_requirements || "Standard academic requirements apply."}</p>
                  
                  {program.gpa_requirement && (
                    <div className="mt-2">
                      <h4 className="font-medium">Minimum GPA</h4>
                      <p>{program.gpa_requirement}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Language Requirements</h3>
                  <p>Required test: {program.language_test || "Not specified"}</p>
                  {program.language_test_score && <p>Minimum score: {program.language_test_score}</p>}
                  
                  {program.language_test_exemptions && (
                    <div className="mt-2">
                      <h4 className="font-medium">Exemptions</h4>
                      <p>{program.language_test_exemptions}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Required Documents</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <div>
                        <span className="font-medium">Academic transcripts</span>
                        <p className="text-sm text-muted-foreground">Official transcripts from all previously attended institutions</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <div>
                        <span className="font-medium">Language proficiency proof</span>
                        <p className="text-sm text-muted-foreground">IELTS, TOEFL, or equivalent as specified</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <div>
                        <span className="font-medium">Passport copy</span>
                        <p className="text-sm text-muted-foreground">Valid for at least 6 months beyond program end date</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <div>
                        <span className="font-medium">Motivation letter</span>
                        <p className="text-sm text-muted-foreground">Statement explaining your interest in the program</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <div>
                        <span className="font-medium">Recommendation letters</span>
                        <p className="text-sm text-muted-foreground">2-3 letters from academic or professional references</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <div>
                        <span className="font-medium">Curriculum Vitae/Resume</span>
                        <p className="text-sm text-muted-foreground">Detailed academic and professional history</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileCheck className="h-4 w-4 mr-2 text-primary mt-1" />
                      <div>
                        <span className="font-medium">Financial documents</span>
                        <p className="text-sm text-muted-foreground">Proof of ability to fund your studies</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Application Process</h3>
                  <p>{program.application_process || "Detailed application process information will be provided during consultation."}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
