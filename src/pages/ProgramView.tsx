
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  Home,
  Info,
  MapPin,
  Star,
  Trophy,
  Users,
  Calendar,
  Clock3,
  Globe,
  BarChart4,
  Bookmark,
} from "lucide-react";
import { Separator } from '@/components/ui/separator';

// Fixed and comprehensive Program interface
interface Program {
  id: string;
  name: string;
  university: string;
  description: string;
  study_level: string;
  field: string;
  city: string;
  country: string;
  duration_months: number;
  program_language: string;
  secondary_language?: string;
  application_deadline?: string;
  admission_requirements: string;
  academic_requirements?: string;
  language_requirement: string;
  language_test?: string;
  language_test_score?: string;
  language_test_exemptions?: string;
  gpa_requirement?: number;
  tuition_min: number;
  tuition_max: number;
  application_fee?: number;
  living_cost_min: number;
  living_cost_max: number;
  housing_cost_min?: number;
  housing_cost_max?: number;
  visa_fee?: number;
  available_places?: number;
  total_places?: number;
  success_rate?: number;
  employment_rate?: number;
  scholarship_available?: boolean;
  scholarship_amount?: number;
  scholarship_details?: string;
  scholarship_deadline?: string;
  scholarship_requirements?: string;
  application_process?: string;
  advantages?: string;
  housing_availability?: string;
  halal_food_availability?: boolean;
  religious_facilities?: boolean;
  north_african_community_size?: string;
  exchange_opportunities?: boolean;
  internship_opportunities?: boolean;
  image_url?: string;
  website_url?: string;
  video_url?: string;
  virtual_tour_url?: string;
  ranking?: number;
  field_keywords?: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const ProgramView = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        if (!programId) return;

        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("id", programId)
          .single();

        if (error) throw error;
        setProgram(data);
      } catch (error) {
        console.error("Error fetching program details:", error);
        toast({
          title: "Error loading program",
          description: "There was a problem loading the program details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [programId, toast]);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for this program.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setApplyModalOpen(false);
    
    try {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          client_id: user.id,
          program_id: programId,
          status: "Draft",
          payment_status: "Pending",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Application Started",
        description: "Your application has been created successfully.",
      });

      navigate(`/applications`);
    } catch (error) {
      console.error("Error creating application:", error);
      toast({
        title: "Error applying",
        description: "There was a problem starting your application.",
        variant: "destructive",
      });
    }
  };

  const toggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked 
        ? "Program removed from your saved programs" 
        : "Program saved to your bookmarks",
    });
  };

  if (loading) {
    return (
      <div className="container max-w-6xl py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container max-w-6xl py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Program Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the program you're looking for.
          </p>
          <Button onClick={() => navigate("/programs")}>
            Browse All Programs
          </Button>
        </div>
      </div>
    );
  }

  const programImageUrl = program.image_url || '/placeholder.svg';
  const formattedTuition = `$${program.tuition_min.toLocaleString()} - $${program.tuition_max.toLocaleString()}`;
  const formattedLivingCost = `$${program.living_cost_min.toLocaleString()} - $${program.living_cost_max.toLocaleString()}`;
  const formattedScholarship = program.scholarship_amount 
    ? `Up to $${program.scholarship_amount.toLocaleString()}`
    : 'Not available';
    
  return (
    <div className="container max-w-6xl py-8">
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/programs')}
      >
        ← Back to Programs
      </Button>
      
      {/* Program Header */}
      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20 z-10"></div>
        <img 
          src={programImageUrl} 
          alt={program.name} 
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary hover:bg-primary">{program.study_level}</Badge>
                <Badge variant="outline" className="text-white border-white">{program.field}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white">{program.name}</h1>
              <div className="flex items-center text-white/90 space-x-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{program.university}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{program.city}, {program.country}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                onClick={toggleBookmark}
              >
                <Bookmark className={`h-5 w-5 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setApplyModalOpen(true)}>
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Program Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Program Details */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Program Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Program Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground whitespace-pre-line">{program.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <Clock3 className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">
                    {program.duration_months} {program.duration_months === 1 ? 'Month' : 'Months'}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <Globe className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-muted-foreground">Language</span>
                  <span className="font-medium">{program.program_language}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-muted-foreground">Tuition Fee</span>
                  <span className="font-medium">{formattedTuition}</span>
                </div>
                {program.available_places !== null && (
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Users className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Available Places</span>
                    <span className="font-medium">{program.available_places}</span>
                  </div>
                )}
                {program.scholarship_amount !== null && program.scholarship_amount > 0 && (
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Trophy className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Scholarship</span>
                    <span className="font-medium">{formattedScholarship}</span>
                  </div>
                )}
                {program.ranking !== null && (
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <BarChart4 className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">University Ranking</span>
                    <span className="font-medium">#{program.ranking}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Detailed Information Tabs */}
          <Tabs defaultValue="admission">
            <TabsList className="w-full">
              <TabsTrigger value="admission">Admission</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
            </TabsList>
            
            {/* Admission Requirements Tab */}
            <TabsContent value="admission" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admission Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{program.admission_requirements}</p>
                    
                    {program.language_requirement && (
                      <>
                        <h3 className="font-medium text-lg mt-6">Language Requirements</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Card className="bg-muted/50">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">Required Level</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p>{program.language_requirement}</p>
                            </CardContent>
                          </Card>
                          
                          {program.language_test && (
                            <Card className="bg-muted/50">
                              <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base">Accepted Tests</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <p>{program.language_test} ({program.language_test_score})</p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                        
                        {program.language_test_exemptions && (
                          <div className="mt-2">
                            <h4 className="font-medium mb-1">Exemptions</h4>
                            <p className="text-sm">{program.language_test_exemptions}</p>
                          </div>
                        )}
                      </>
                    )}
                    
                    {program.application_process && (
                      <>
                        <h3 className="font-medium text-lg mt-6">Application Process</h3>
                        <p className="whitespace-pre-line">{program.application_process}</p>
                      </>
                    )}
                    
                    {program.application_deadline && (
                      <div className="flex items-center p-4 bg-primary/10 rounded-lg border border-primary/20 mt-6">
                        <Calendar className="h-6 w-6 text-primary mr-3" />
                        <div>
                          <h3 className="font-medium">Application Deadline</h3>
                          <p className="text-muted-foreground">{program.application_deadline}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Academic Information Tab */}
            <TabsContent value="academic" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {program.academic_requirements && (
                      <div>
                        <h3 className="font-medium text-lg mb-2">Academic Requirements</h3>
                        <p className="whitespace-pre-line">{program.academic_requirements}</p>
                        
                        {program.gpa_requirement && (
                          <div className="mt-4 p-4 bg-muted rounded-lg inline-block">
                            <div className="flex items-center">
                              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                              <span className="font-medium">Minimum GPA: {program.gpa_requirement}/4.0</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {program.advantages && (
                      <div>
                        <h3 className="font-medium text-lg mb-2">Program Advantages</h3>
                        <p className="whitespace-pre-line">{program.advantages}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      {program.exchange_opportunities && (
                        <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                          <Globe className="h-6 w-6 text-primary mb-2" />
                          <span className="text-center">Exchange Opportunities Available</span>
                        </div>
                      )}
                      {program.internship_opportunities && (
                        <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                          <Building className="h-6 w-6 text-primary mb-2" />
                          <span className="text-center">Internship Opportunities</span>
                        </div>
                      )}
                      {program.employment_rate && (
                        <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                          <CheckCircle2 className="h-6 w-6 text-primary mb-2" />
                          <span className="text-center">
                            {program.employment_rate}% Employment Rate
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Financial Information Tab */}
            <TabsContent value="financial" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Tuition Fee</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formattedTuition}</div>
                          <p className="text-sm text-muted-foreground mt-1">Per year</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Living Costs</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formattedLivingCost}</div>
                          <p className="text-sm text-muted-foreground mt-1">Per year</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {program.application_fee && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Application Fee</p>
                          <p className="font-medium">${program.application_fee}</p>
                        </div>
                      )}
                      
                      {program.visa_fee && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Visa Fee</p>
                          <p className="font-medium">${program.visa_fee}</p>
                        </div>
                      )}
                      
                      {program.housing_cost_min && program.housing_cost_max && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Housing Costs</p>
                          <p className="font-medium">
                            ${program.housing_cost_min.toLocaleString()} - ${program.housing_cost_max.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {program.scholarship_available && (
                      <div className="mt-8">
                        <h3 className="font-medium text-lg mb-4">Scholarship Information</h3>
                        
                        <Card className="border-primary/30 bg-primary/5">
                          <CardHeader>
                            <div className="flex items-center">
                              <Trophy className="h-5 w-5 text-primary mr-2" />
                              <CardTitle className="text-base">
                                Scholarship Available
                              </CardTitle>
                            </div>
                            {program.scholarship_amount && (
                              <CardDescription>
                                Up to ${program.scholarship_amount.toLocaleString()}
                              </CardDescription>
                            )}
                          </CardHeader>
                          
                          <CardContent>
                            <div className="space-y-4">
                              {program.scholarship_details && (
                                <div>
                                  <h4 className="font-medium mb-1">Details</h4>
                                  <p className="text-sm">{program.scholarship_details}</p>
                                </div>
                              )}
                              
                              {program.scholarship_requirements && (
                                <div>
                                  <h4 className="font-medium mb-1">Requirements</h4>
                                  <p className="text-sm">{program.scholarship_requirements}</p>
                                </div>
                              )}
                              
                              {program.scholarship_deadline && (
                                <div>
                                  <h4 className="font-medium mb-1">Application Deadline</h4>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                                    <p className="text-sm">{program.scholarship_deadline}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Facilities Tab */}
            <TabsContent value="facilities" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Facilities & Accommodation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {program.housing_availability && (
                      <div>
                        <h3 className="font-medium text-lg mb-2">Housing Information</h3>
                        <p className="whitespace-pre-line">{program.housing_availability}</p>
                        
                        {program.housing_cost_min && program.housing_cost_max && (
                          <div className="flex items-center mt-4 p-4 bg-muted rounded-lg inline-block">
                            <Home className="h-5 w-5 mr-2 text-primary" />
                            <span>
                              Housing costs range from ${program.housing_cost_min.toLocaleString()} to 
                              ${program.housing_cost_max.toLocaleString()} per year
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                      {program.halal_food_availability && (
                        <div className="p-4 bg-muted rounded-lg flex flex-col items-center text-center">
                          <CheckCircle2 className="h-6 w-6 text-green-500 mb-2" />
                          <span>Halal Food Available</span>
                        </div>
                      )}
                      
                      {program.religious_facilities && (
                        <div className="p-4 bg-muted rounded-lg flex flex-col items-center text-center">
                          <CheckCircle2 className="h-6 w-6 text-green-500 mb-2" />
                          <span>Religious Facilities Available</span>
                        </div>
                      )}
                      
                      {program.north_african_community_size && (
                        <div className="p-4 bg-muted rounded-lg flex flex-col items-center text-center">
                          <Users className="h-6 w-6 text-primary mb-2" />
                          <span>North African Community: {program.north_african_community_size}</span>
                        </div>
                      )}
                    </div>
                    
                    {(program.website_url || program.virtual_tour_url || program.video_url) && (
                      <div className="mt-6">
                        <h3 className="font-medium text-lg mb-3">External Resources</h3>
                        <div className="flex flex-wrap gap-3">
                          {program.website_url && (
                            <a 
                              href={program.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80"
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Official Website
                            </a>
                          )}
                          
                          {program.virtual_tour_url && (
                            <a 
                              href={program.virtual_tour_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80"
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Virtual Tour
                            </a>
                          )}
                          
                          {program.video_url && (
                            <a 
                              href={program.video_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80"
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Video Preview
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Action Panel */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Apply for this Program</CardTitle>
              <CardDescription>
                Complete your application for the {program.name} program
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {program.application_fee && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application Fee:</span>
                    <span className="font-bold">${program.application_fee}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{program.application_deadline || 'Applications accepted year-round'}</span>
                </div>
                <div className="flex items-center">
                  <Clock3 className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">
                    {program.duration_months} {program.duration_months === 1 ? 'month' : 'months'} duration
                  </span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{program.study_level} level</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{program.city}, {program.country}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="font-medium">Required Documents:</div>
              
              <div className="space-y-2 text-sm pl-1">
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Valid passport</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Academic transcripts</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Proof of language proficiency</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>CV/Resume</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Motivation letter</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col space-y-4">
              <Button className="w-full" onClick={() => setApplyModalOpen(true)}>
                Apply Now
              </Button>
              
              <Button variant="outline" className="w-full" onClick={toggleBookmark}>
                <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save Program'}
              </Button>
              
              <Button variant="ghost" className="w-full" onClick={() => window.print()}>
                <FileText className="h-4 w-4 mr-2" />
                Print Information
              </Button>
            </CardFooter>
          </Card>
          
          {/* University Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">About {program.university}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{program.city}, {program.country}</span>
                </div>
                
                {program.ranking && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ranking:</span>
                    <span className="font-medium">#{program.ranking} Worldwide</span>
                  </div>
                )}
                
                {program.website_url && (
                  <div className="mt-3">
                    <a 
                      href={program.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center"
                    >
                      <Globe className="h-3.5 w-3.5 mr-1" />
                      Visit University Website
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Need Help Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-muted-foreground mb-4">
                Our education consultants are ready to assist you with your application.
              </p>
              
              <Button variant="outline" className="w-full mb-2" onClick={() => navigate('/appointments')}>
                Schedule Consultation
              </Button>
              
              <Button variant="ghost" className="w-full" onClick={() => navigate('/messages')}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Apply Modal */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {program.name}</DialogTitle>
            <DialogDescription>
              Start your application for this program at {program.university}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <h3 className="font-medium">What happens next?</h3>
              <p className="text-sm text-muted-foreground">
                After starting your application, you will be able to:
              </p>
              <ul className="space-y-2 text-sm pl-5 list-disc">
                <li>Upload required documents</li>
                <li>Track your application status</li>
                <li>Receive support from our advisors</li>
                <li>Pay any required fees</li>
              </ul>
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Program:</span>
                <span>{program.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">University:</span>
                <span>{program.university}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{program.city}, {program.country}</span>
              </div>
              {program.application_fee && (
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Application Fee:</span>
                  <span>${program.application_fee}</span>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Start Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramView;
