
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  School, 
  MapPin, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  Calendar, 
  Globe, 
  FileCheck, 
  BookText, 
  Building, 
  Languages, 
  Star, 
  Share2, 
  ChevronRight,
  CheckCircle,
  X,
  AlertTriangle,
  Home,
  ExternalLink,
  Download,
  Mail
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function ProgramView() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [similarPrograms, setSimilarPrograms] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        if (!programId) return;
        
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("id", programId)
          .single();
          
        if (error) throw error;
        
        setProgram(data);
        
        // Fetch similar programs based on field and study level
        if (data) {
          const { data: similarData, error: similarError } = await supabase
            .from("programs")
            .select("id, name, university, country, study_level, image_url")
            .eq("study_level", data.study_level)
            .eq("field", data.field)
            .neq("id", programId)
            .limit(3);
            
          if (!similarError && similarData) {
            setSimilarPrograms(similarData.map(p => ({
              ...p,
              location: p.country,
              type: p.study_level
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching program:", error);
        toast({
          title: "Error",
          description: "Failed to load program details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgram();
  }, [programId, toast]);

  // Share program
  const shareProgram = () => {
    const url = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied!",
          description: "Program link has been copied to clipboard",
        });
      }).catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      });
    } else {
      toast({
        title: "Copy not supported",
        description: "Your browser doesn't support clipboard copying",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
        <div className="text-center py-16">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Program Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/programs')}>
            Browse All Programs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-2">
        <Link to="/" className="hover:underline flex items-center">
          <Home className="h-3 w-3 mr-1" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/programs" className="hover:underline">
          Programs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[200px]">{program.name}</span>
      </div>
      
      {/* Program Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/programs')} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Programs</span>
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareProgram}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            {program.website_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={program.website_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Website
                </a>
              </Button>
            )}
          </div>
        </div>
      
        <h1 className="text-3xl font-bold">{program.name}</h1>
      </div>
      
      {/* Program Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Program Image */}
          <div className="rounded-lg overflow-hidden h-72 relative bg-gradient-to-r from-primary/10 to-violet-600/10">
            {program.image_url ? (
              <img 
                src={program.image_url} 
                alt={program.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <School className="h-24 w-24" />
              </div>
            )}
            {program.featured && (
              <div className="absolute top-4 right-4">
                <Badge variant="default" className="bg-gradient-to-r from-primary to-violet-600">
                  <Star className="h-3 w-3 mr-1 fill-primary-foreground" />
                  Featured Program
                </Badge>
              </div>
            )}
          </div>
          
          {/* University Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src="/placeholder.svg?text=U" />
                    <AvatarFallback>{program.university?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="font-semibold">{program.university}</h3>
                  <p className="text-sm text-muted-foreground">{program.city}, {program.country}</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  {program.ranking && (
                    <Badge variant="outline" className="mb-1">
                      Ranking: #{program.ranking}
                    </Badge>
                  )}
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= Math.round(program.rating || 4.5) ? "fill-primary text-primary" : "text-muted"}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="admission">Admission</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
              <TabsTrigger value="housing">Housing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Program Overview</CardTitle>
                  <CardDescription>
                    Key information about the {program.name} program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Study Level</h4>
                          <p>{program.study_level || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Duration</h4>
                          <p>{program.duration_months ? `${program.duration_months} months` : "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Languages className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Language</h4>
                          <p>{program.program_language || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <BookText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Field</h4>
                          <p>{program.field || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Program Description</h3>
                      <div className="text-muted-foreground space-y-3">
                        <p>{program.description || "No description available."}</p>
                      </div>
                    </div>
                    
                    {program.advantages && (
                      <>
                        <Separator className="my-6" />
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Key Advantages</h3>
                          <div className="space-y-2">
                            {program.advantages.split('\n').filter(line => line.trim()).map((advantage, index) => (
                              <div key={index} className="flex">
                                <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                                <p>{advantage}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {program.field_keywords && program.field_keywords.length > 0 && (
                      <>
                        <Separator className="my-6" />
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Related Subjects</h3>
                          <div className="flex flex-wrap gap-2">
                            {program.field_keywords.map((keyword, index) => (
                              <Badge key={index} variant="secondary">{keyword}</Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="admission">
              <Card>
                <CardHeader>
                  <CardTitle>Admission Requirements</CardTitle>
                  <CardDescription>
                    Everything you need to know about applying to this program
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p>{program.admission_requirements || "Contact the university for detailed admission requirements."}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Application Process</h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p>{program.application_process || "Standard application process applies. Contact for details."}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Important Dates</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Application Deadline:</span>
                          <Badge variant={program.application_deadline ? "outline" : "secondary"}>
                            {program.application_deadline || "Contact for details"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Language Requirements</h3>
                    <div className="space-y-4">
                      {program.language_test && (
                        <div className="rounded-md border p-4">
                          <h4 className="font-medium">Required Test: {program.language_test}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Minimum Score: {program.language_test_score || "Contact for details"}
                          </p>
                          {program.language_test_exemptions && (
                            <div className="mt-3">
                              <h5 className="text-sm font-medium">Exemptions:</h5>
                              <p className="text-sm text-muted-foreground">{program.language_test_exemptions}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!program.language_test && (
                        <p className="text-muted-foreground">
                          Contact the university for language proficiency requirements.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Required Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {["Application Form", "Academic Transcripts", "CV/Resume", "Motivation Letter", "Recommendation Letters", "ID/Passport Copy"].map((doc, index) => (
                        <div key={index} className="flex items-center">
                          <FileCheck className="h-5 w-5 mr-2 text-primary" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="finances">
              <Card>
                <CardHeader>
                  <CardTitle>Tuition & Finances</CardTitle>
                  <CardDescription>
                    Financial information about this program
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tuition Fees</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                      <Card className="bg-muted/40">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h4 className="text-muted-foreground text-sm mb-1">Tuition Range (Annual)</h4>
                            <div className="flex items-center justify-center">
                              <DollarSign className="h-5 w-5 mr-1" />
                              <span className="text-2xl font-bold">
                                {program.tuition_min && program.tuition_max 
                                  ? `$${program.tuition_min.toLocaleString()} - $${program.tuition_max.toLocaleString()}`
                                  : program.tuition_min
                                    ? `$${program.tuition_min.toLocaleString()}`
                                    : "Contact for details"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/40">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h4 className="text-muted-foreground text-sm mb-1">Application Fee</h4>
                            <div className="flex items-center justify-center">
                              <DollarSign className="h-5 w-5 mr-1" />
                              <span className="text-2xl font-bold">
                                {program.application_fee
                                  ? `$${program.application_fee.toLocaleString()}`
                                  : "Contact for details"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Living Costs</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Monthly Estimate</h4>
                          <div className="flex items-center mt-1">
                            <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>${program.living_cost_min?.toLocaleString()} - ${program.living_cost_max?.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium">Housing (Monthly)</h4>
                          <div className="flex items-center mt-1">
                            <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>
                              {program.housing_cost_min && program.housing_cost_max
                                ? `$${program.housing_cost_min.toLocaleString()} - $${program.housing_cost_max.toLocaleString()}`
                                : "Varies"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Scholarships</h3>
                    {program.scholarship_available ? (
                      <div className="space-y-4">
                        <div className="bg-primary/10 rounded-md p-4">
                          <h4 className="font-medium flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            Scholarships Available
                          </h4>
                          
                          {program.scholarship_amount && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Amount:</span> Up to ${program.scholarship_amount.toLocaleString()}
                            </p>
                          )}
                          
                          {program.scholarship_deadline && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Deadline:</span> {program.scholarship_deadline}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Requirements:</h4>
                          <p className="text-muted-foreground text-sm">
                            {program.scholarship_requirements || "Standard scholarship requirements apply. Contact for details."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <X className="h-5 w-5 mr-2 text-destructive" />
                        <p className="text-muted-foreground">No program-specific scholarships available at this time.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="housing">
              <Card>
                <CardHeader>
                  <CardTitle>Housing & Facilities</CardTitle>
                  <CardDescription>
                    Accommodation and campus facilities information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Housing Options</h3>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        {program.housing_availability || "Contact the university for housing options."}
                      </p>
                      
                      {program.housing_cost_min && program.housing_cost_max && (
                        <div className="mt-4 bg-muted/40 rounded-md p-4">
                          <h4 className="font-medium">Estimated Housing Costs (Monthly)</h4>
                          <div className="flex items-center justify-between mt-2">
                            <span>On-campus</span>
                            <span className="font-medium">${program.housing_cost_min.toLocaleString()} - ${(program.housing_cost_min * 1.2).toFixed(0)}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span>Off-campus</span>
                            <span className="font-medium">${(program.housing_cost_min * 1.1).toFixed(0)} - ${program.housing_cost_max.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Special Facilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className={`flex items-center rounded-md border p-3 ${program.religious_facilities ? "border-primary/50 bg-primary/5" : "bg-muted/40"}`}>
                        {program.religious_facilities ? (
                          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <X className="h-5 w-5 mr-2 text-muted-foreground" />
                        )}
                        <span>Religious Facilities</span>
                      </div>
                      
                      <div className={`flex items-center rounded-md border p-3 ${program.halal_food_availability ? "border-primary/50 bg-primary/5" : "bg-muted/40"}`}>
                        {program.halal_food_availability ? (
                          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <X className="h-5 w-5 mr-2 text-muted-foreground" />
                        )}
                        <span>Halal Food Options</span>
                      </div>
                      
                      <div className={`flex items-center rounded-md border p-3 ${program.internship_opportunities ? "border-primary/50 bg-primary/5" : "bg-muted/40"}`}>
                        {program.internship_opportunities ? (
                          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <X className="h-5 w-5 mr-2 text-muted-foreground" />
                        )}
                        <span>Internship Opportunities</span>
                      </div>
                      
                      <div className={`flex items-center rounded-md border p-3 ${program.exchange_opportunities ? "border-primary/50 bg-primary/5" : "bg-muted/40"}`}>
                        {program.exchange_opportunities ? (
                          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <X className="h-5 w-5 mr-2 text-muted-foreground" />
                        )}
                        <span>Exchange Programs</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">International Community</h3>
                    {program.north_african_community_size && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>North African Community Size:</span>
                          <Badge variant={program.north_african_community_size === "Large" ? "default" : "outline"}>
                            {program.north_african_community_size}
                          </Badge>
                        </div>
                        
                        <div className="mt-3">
                          <label className="text-sm text-muted-foreground mb-1 block">Community Presence</label>
                          <Progress 
                            value={program.north_african_community_size === "Large" ? 80 : 
                                   program.north_african_community_size === "Medium" ? 50 :
                                   program.north_african_community_size === "Small" ? 20 : 5} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    )}
                    
                    {!program.north_african_community_size && (
                      <p className="text-muted-foreground">
                        Information about the international student community is not available.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/20">
            <CardHeader>
              <CardTitle>Apply Now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Application Fee:</span>
                <span className="font-medium">{program.application_fee ? `$${program.application_fee}` : "Contact for details"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Deadline:</span>
                <span className="font-medium">{program.application_deadline || "Contact for details"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Available Places:</span>
                <Badge variant="outline">
                  {program.available_places || "Limited"}
                </Badge>
              </div>
              
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700"
                onClick={() => navigate(`/applications/new?program=${program.id}`)}
              >
                Apply for This Program
              </Button>
            </CardContent>
          </Card>
          
          {/* Key Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Study Level</p>
                  <p className="font-medium">{program.study_level || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Field</p>
                  <p className="font-medium">{program.field || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{program.duration_months ? `${program.duration_months} months` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Language</p>
                  <p className="font-medium">{program.program_language || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{program.city}, {program.country}</p>
                </div>
                {program.scholarship_available && (
                  <div>
                    <p className="text-muted-foreground">Scholarships</p>
                    <p className="font-medium text-primary">Available</p>
                  </div>
                )}
              </div>
              
              <Separator className="my-2" />
              
              <div>
                <a 
                  href={program.website_url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm flex items-center ${program.website_url ? "text-primary hover:underline" : "text-muted-foreground cursor-not-allowed"}`}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {program.website_url ? "Visit Program Website" : "Website Not Available"}
                </a>
                
                {program.virtual_tour_url && (
                  <a 
                    href={program.virtual_tour_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm flex items-center text-primary hover:underline mt-2"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Take Virtual Tour
                  </a>
                )}
                
                <button 
                  className="text-sm flex items-center text-primary hover:underline mt-2 w-full text-left"
                  onClick={() => {
                    navigate("/chat");
                    toast({
                      title: "Chat Support",
                      description: "You can ask questions about this program to our advisors.",
                    });
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Ask Questions About This Program
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Similar Programs */}
          {similarPrograms.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Similar Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarPrograms.map((similarProgram) => (
                  <div key={similarProgram.id} className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      {similarProgram.image_url ? (
                        <img src={similarProgram.image_url} alt={similarProgram.name} className="object-cover w-full h-full" />
                      ) : (
                        <School className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Link to={`/programs/${similarProgram.id}`} className="font-medium hover:text-primary">
                        {similarProgram.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{similarProgram.university}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {similarProgram.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Download Brochure */}
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Program Brochure</h3>
                <p className="text-sm text-muted-foreground">
                  Download detailed information
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
