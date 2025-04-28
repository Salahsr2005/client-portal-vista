
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AccordionTrigger, AccordionContent, AccordionItem, Accordion } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Globe, 
  School, 
  Calendar, 
  Clock, 
  Users, 
  CircleDollarSign, 
  CircleCheck, 
  CircleX, 
  MapPin, 
  GraduationCap,
  Languages, 
  Building, 
  HomeIcon, 
  BookOpen, 
  Award, 
  Briefcase, 
  Leaf,
  Star,
  ListFilter,
  FileText,
  AlertTriangle,
  Share2
} from 'lucide-react';

export default function ProgramView() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarPrograms, setSimilarPrograms] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchProgramDetails = async () => {
      setLoading(true);
      try {
        // Fetch program details
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('id', programId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setError('Program not found');
          return;
        }
        
        setProgram(data);
        
        // Fetch similar programs based on field and study level
        const { data: similarData, error: similarError } = await supabase
          .from('programs')
          .select('id, name, university, country, study_level, field, tuition_min, image_url')
          .eq('field', data.field)
          .eq('study_level', data.study_level)
          .neq('id', data.id)
          .limit(4);
          
        if (similarError) {
          console.error("Error fetching similar programs:", similarError);
        } else {
          setSimilarPrograms(similarData || []);
        }
        
      } catch (err) {
        console.error("Error fetching program:", err);
        setError('Failed to load program details');
      } finally {
        setLoading(false);
      }
    };
    
    if (programId) {
      fetchProgramDetails();
    }
  }, [programId]);
  
  const applyNow = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in or register to apply for programs.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate(`/applications/new?program=${programId}`);
  };
  
  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !program) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Program not found. Please try again later."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/programs')}>
          Back to Programs
        </Button>
      </div>
    );
  }
  
  const programDocuments = [
    { name: "Transcript", required: true },
    { name: "CV/Resume", required: true },
    { name: "Motivation Letter", required: true },
    { name: "Passport Copy", required: true },
    { name: "Language Certificate", required: program.language_test_score ? true : false },
    { name: "Recommendation Letters", required: false },
  ];
  
  const getLanguageRequirementText = () => {
    if (!program.language_requirement) return "Not specified";
    
    const requirementMap = {
      'None': "No specific requirement",
      'Basic': "Basic proficiency",
      'Intermediate': "Intermediate proficiency",
      'Advanced': "Advanced proficiency",
      'Native': "Native or near-native proficiency",
      'Certificate': `${program.language_test || 'Language'} certificate required`
    };
    
    return requirementMap[program.language_requirement] || program.language_requirement;
  };
  
  const formatDuration = (months) => {
    if (!months) return "Not specified";
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Program Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3 flex-shrink-0">
          <div className="rounded-lg overflow-hidden border shadow-sm">
            <div 
              className="w-full h-48 bg-cover bg-center"
              style={{ 
                backgroundImage: program.image_url 
                  ? `url(${program.image_url})` 
                  : `url(/placeholder.svg?height=300&width=400&text=${encodeURIComponent(program.name)})`
              }}
            ></div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="flex flex-col md:flex-row justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold">{program.name}</h1>
              <div className="flex items-center text-muted-foreground mt-1 mb-3">
                <Building className="h-4 w-4 mr-2" />
                <span className="font-medium">{program.university}</span>
              </div>
            </div>
            <div className="flex mt-2 md:mt-0">
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-2" size="sm">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </DialogTrigger>
              <Button variant="outline" size="sm" className="mr-2">
                <Star className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{program.city}, {program.country}</span>
            </div>
            
            <div className="flex items-center">
              <School className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{program.study_level || 'Degree'}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{program.application_deadline || 'Open'}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{formatDuration(program.duration_months)}</span>
            </div>
            
            <div className="flex items-center">
              <Languages className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{program.program_language}</span>
            </div>
            
            <div className="flex items-center">
              <CircleDollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <span>
                {program.tuition_min ? `$${program.tuition_min.toLocaleString()}/year` : 'Contact for fees'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {program.available_places > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                <Users className="h-3 w-3 mr-1" /> {program.available_places} Places Available
              </Badge>
            )}
            
            {program.scholarship_available && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                <Award className="h-3 w-3 mr-1" /> Scholarship Available
              </Badge>
            )}
            
            {program.internship_opportunities && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                <Briefcase className="h-3 w-3 mr-1" /> Internship Opportunities
              </Badge>
            )}
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button onClick={applyNow} className="flex-1 md:flex-none">Apply Now</Button>
            <Button variant="outline" onClick={() => navigate("/consultation")}>Get Advice</Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="costs">Costs & Funding</TabsTrigger>
          <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-4">{program.description}</p>
                
                {program.advantages && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Program Highlights:</h3>
                    <p>{program.advantages}</p>
                  </div>
                )}
              </div>
              
              {program.website_url && (
                <div className="pt-2">
                  <Button variant="outline" asChild>
                    <a href={program.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Official Website
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Field of Study:</span>
                    <span className="font-medium">{program.field}</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Program Language:</span>
                    <span className="font-medium">{program.program_language}</span>
                  </div>
                  
                  {program.secondary_language && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Secondary Language:</span>
                      <span className="font-medium">{program.secondary_language}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{formatDuration(program.duration_months)}</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">University Ranking:</span>
                    <span className="font-medium">#{program.ranking || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2">
                    <span className="text-muted-foreground">Employment Rate:</span>
                    <span className="font-medium">{program.employment_rate ? `${program.employment_rate}%` : 'Not specified'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cultural Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Religious Facilities:</span>
                    <span>
                      {program.religious_facilities ? 
                        <CircleCheck className="h-5 w-5 text-green-500" /> : 
                        <CircleX className="h-5 w-5 text-gray-300" />}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Halal Food Available:</span>
                    <span>
                      {program.halal_food_availability ? 
                        <CircleCheck className="h-5 w-5 text-green-500" /> : 
                        <CircleX className="h-5 w-5 text-gray-300" />}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">North African Community:</span>
                    <span className="font-medium capitalize">{program.north_african_community_size || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Exchange Opportunities:</span>
                    <span>
                      {program.exchange_opportunities ? 
                        <CircleCheck className="h-5 w-5 text-green-500" /> : 
                        <CircleX className="h-5 w-5 text-gray-300" />}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-muted-foreground">Internship Opportunities:</span>
                    <span>
                      {program.internship_opportunities ? 
                        <CircleCheck className="h-5 w-5 text-green-500" /> : 
                        <CircleX className="h-5 w-5 text-gray-300" />}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Requirements</CardTitle>
              <CardDescription>
                Key requirements to be eligible for this program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                    Minimum GPA
                  </h3>
                  <p>{program.gpa_requirement ? `${program.gpa_requirement}/4.0` : 'No minimum GPA specified'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Languages className="h-4 w-4 mr-2 text-muted-foreground" />
                    Language Proficiency
                  </h3>
                  <p>{getLanguageRequirementText()}</p>
                  
                  {program.language_test_score && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">{program.language_test}:</span>{" "}
                      <span className="text-sm">{program.language_test_score}</span>
                      
                      {program.language_test_exemptions && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Exemptions: {program.language_test_exemptions}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3">Admission Requirements</h3>
                <div className="space-y-1">
                  {program.admission_requirements.split('\n').map((requirement, idx) => (
                    requirement.trim() && (
                      <div key={idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                        </div>
                        <p>{requirement}</p>
                      </div>
                    )
                  ))}
                </div>
                
                {program.academic_requirements && (
                  <>
                    <h3 className="font-semibold mt-4 mb-3">Additional Academic Requirements</h3>
                    <p>{program.academic_requirements}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Documents needed for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.required ? 'Required' : 'Optional'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3">Application Process</h3>
                <p>{program.application_process || 'Contact the university for detailed application instructions.'}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={applyNow}>Start Your Application</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Costs & Funding Tab */}
        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Costs</CardTitle>
              <CardDescription>
                Estimated costs for this program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <School className="h-4 w-4 mr-2 text-muted-foreground" />
                      Tuition Fees
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Annual Tuition:</span>
                        <span className="font-semibold">
                          ${program.tuition_min.toLocaleString()} - ${program.tuition_max.toLocaleString()}
                        </span>
                      </div>
                      
                      {program.application_fee > 0 && (
                        <div className="flex justify-between items-center">
                          <span>Application Fee:</span>
                          <span className="font-semibold">${program.application_fee.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {program.visa_fee > 0 && (
                        <div className="flex justify-between items-center">
                          <span>Visa Fee:</span>
                          <span className="font-semibold">${program.visa_fee.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Program Tuition:</span>
                        <span className="font-bold">
                          ${(program.tuition_min * (program.duration_months / 12)).toLocaleString()} - ${(program.tuition_max * (program.duration_months / 12)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <HomeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      Living Expenses
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Monthly Living Costs:</span>
                        <span className="font-semibold">
                          ${program.living_cost_min.toLocaleString()} - ${program.living_cost_max.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Monthly Housing:</span>
                        <span className="font-semibold">
                          ${program.housing_cost_min?.toLocaleString() || 'N/A'} - ${program.housing_cost_max?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Annual Living Costs:</span>
                        <span className="font-bold">
                          ${(program.living_cost_min * 12).toLocaleString()} - ${(program.living_cost_max * 12).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Card className="bg-muted/50 shadow-none">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm flex items-center">
                      <CircleDollarSign className="h-4 w-4 mr-2" />
                      Estimated Total Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="flex justify-between items-center">
                      <span>Estimated total for {formatDuration(program.duration_months)}:</span>
                      <span className="font-bold">
                        $
                        {(
                          (program.tuition_min * (program.duration_months / 12)) + 
                          (program.living_cost_min * program.duration_months)
                        ).toLocaleString()}
                        {' - '}
                        $
                        {(
                          (program.tuition_max * (program.duration_months / 12)) + 
                          (program.living_cost_max * program.duration_months)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          {program.scholarship_available && (
            <Card>
              <CardHeader>
                <CardTitle>Scholarships & Funding</CardTitle>
                <CardDescription>
                  Financial aid options available for this program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900">
                  <Award className="h-4 w-4" />
                  <AlertTitle>Scholarship Available</AlertTitle>
                  <AlertDescription>
                    This program offers scholarship opportunities for eligible students.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <h3 className="font-semibold mb-2">Scholarship Details</h3>
                  <p>{program.scholarship_details || "Contact the university for detailed scholarship information."}</p>
                  
                  {program.scholarship_amount > 0 && (
                    <div className="mt-2">
                      <span className="font-medium">Amount:</span> Up to ${program.scholarship_amount.toLocaleString()}
                    </div>
                  )}
                  
                  {program.scholarship_deadline && (
                    <div className="mt-1">
                      <span className="font-medium">Application Deadline:</span> {program.scholarship_deadline}
                    </div>
                  )}
                </div>
                
                {program.scholarship_requirements && (
                  <div>
                    <h3 className="font-semibold mb-2">Eligibility Requirements</h3>
                    <p>{program.scholarship_requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Accommodation Tab */}
        <TabsContent value="accommodation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Housing Information</CardTitle>
              <CardDescription>
                Accommodation options and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Housing Availability</h3>
                  <p>{program.housing_availability || "Information about housing options is not specified. Please contact the university for details."}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Estimated Housing Costs</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monthly Range:</span>
                        <span className="font-medium">
                          {program.housing_cost_min && program.housing_cost_max ? 
                            `$${program.housing_cost_min.toLocaleString()} - $${program.housing_cost_max.toLocaleString()}` : 
                            'Not specified'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Annual Estimate:</span>
                        <span className="font-medium">
                          {program.housing_cost_min && program.housing_cost_max ? 
                            `$${(program.housing_cost_min * 12).toLocaleString()} - $${(program.housing_cost_max * 12).toLocaleString()}` : 
                            'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Cultural Considerations</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Religious Facilities:</span>
                        <span>{program.religious_facilities ? 'Available' : 'Not specified'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Halal Food Options:</span>
                        <span>{program.halal_food_availability ? 'Available' : 'Not specified'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>North African Community:</span>
                        <span className="capitalize">{program.north_african_community_size || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>City Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">About {program.city}</h3>
                  <p className="text-muted-foreground">
                    {program.city} is located in {program.country} and is home to {program.university}.
                    {program.north_african_community_size ? ` The city has a ${program.north_african_community_size.toLowerCase()} North African community.` : ''}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Living Costs Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Food (monthly):</span>
                      <span>${(program.living_cost_min * 0.3).toFixed(0)} - ${(program.living_cost_max * 0.3).toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Transportation (monthly):</span>
                      <span>${(program.living_cost_min * 0.1).toFixed(0)} - ${(program.living_cost_max * 0.1).toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Utilities & Internet (monthly):</span>
                      <span>${(program.living_cost_min * 0.15).toFixed(0)} - ${(program.living_cost_max * 0.15).toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Other Expenses (monthly):</span>
                      <span>${(program.living_cost_min * 0.15).toFixed(0)} - ${(program.living_cost_max * 0.15).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Similar Programs */}
      {similarPrograms.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Similar Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarPrograms.map((program) => (
              <Card key={program.id} className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate(`/programs/${program.id}`)}>
                <div className="h-40 w-full bg-muted">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: program.image_url 
                        ? `url(${program.image_url})` 
                        : `url(/placeholder.svg?height=160&width=300&text=${encodeURIComponent(program.name)})`
                    }}
                  ></div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-2">{program.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Building className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{program.university}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {program.study_level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {program.country}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center mt-8">
        <Button variant="outline" onClick={() => navigate('/programs')}>
          <ListFilter className="h-4 w-4 mr-2" />
          Browse All Programs
        </Button>
      </div>
      
      {/* Share Dialog */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share This Program</DialogTitle>
            <DialogDescription>
              Share this program with friends or on social media
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 py-4">
            <Button variant="outline" className="h-16 flex-col">
              <Share2 className="h-5 w-5 mb-1" />
              <span>Copy Link</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <span className="text-xl mb-1">f</span>
              <span>Facebook</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <span className="text-xl mb-1">𝕏</span>
              <span>Twitter</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <span className="text-xl mb-1">in</span>
              <span>LinkedIn</span>
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" size="sm">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
