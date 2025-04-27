
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  MapPin,
  CalendarDays,
  BookOpen,
  Languages,
  Clock,
  DollarSign,
  Briefcase,
  Award,
  Share2,
  Users,
  Home,
  Building,
  CheckCircle,
  XCircle,
  FileText,
  Pencil,
  Heart,
  ExternalLink,
  AreaChart,
  BarChart4,
  Bank,
  Globe,
  ListChecks
} from "lucide-react";

export default function ProgramView() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: program, isLoading, error } = useQuery({
    queryKey: ["program", programId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", programId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleApply = () => {
    navigate(`/applications/new?programId=${programId}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "The program link has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (isLoading) {
    return <ProgramSkeleton />;
  }

  if (error || !program) {
    return (
      <div className="container max-w-6xl py-12 px-4">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Program Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/programs">Browse Programs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const programImageUrl = program.image_url || "/placeholder.svg?height=400&width=800&text=Program%20Image";

  return (
    <div className="container max-w-6xl py-8">
      {/* Hero section with image */}
      <div className="relative rounded-xl overflow-hidden mb-8 h-[300px] md:h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${programImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
          <Badge className="mb-2">{program.study_level}</Badge>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            {program.name}
          </h1>
          <div className="flex items-center text-white/90 mb-4">
            <Building className="h-4 w-4 mr-1" />
            <span className="mr-4">{program.university}</span>
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {program.city}, {program.country}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <CalendarDays className="mr-1 h-3.5 w-3.5" />
              {program.duration_months} months
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <Languages className="mr-1 h-3.5 w-3.5" />
              {program.program_language}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <DollarSign className="mr-1 h-3.5 w-3.5" />
              From ${program.tuition_min?.toLocaleString()}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <BookOpen className="mr-1 h-3.5 w-3.5" />
              {program.field}
            </Badge>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button onClick={handleApply} className="flex-1 sm:flex-none">
          <Pencil className="mr-2 h-4 w-4" />
          Apply Now
        </Button>
        <Button variant="outline" onClick={handleShare} className="flex-1 sm:flex-none">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="secondary" className="flex-1 sm:flex-none">
          <Heart className="mr-2 h-4 w-4" />
          Save
        </Button>
        {program.website_url && (
          <Button variant="outline" asChild className="flex-1 sm:flex-none">
            <a href={program.website_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Official Website
            </a>
          </Button>
        )}
      </div>

      {/* Content tabs and sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="admission">Admission</TabsTrigger>
              <TabsTrigger value="costs">Costs & Aid</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">About the Program</h2>
                <p className="text-muted-foreground whitespace-pre-line mb-6">{program.description}</p>
                
                {program.advantages && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                      Program Advantages
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {program.advantages}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Globe className="mr-2 h-5 w-5 text-primary" /> Program Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Study Level</span>
                          <span className="font-medium">{program.study_level}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Field</span>
                          <span className="font-medium">{program.field}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{program.duration_months} months</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Language</span>
                          <span className="font-medium">{program.program_language}</span>
                        </li>
                        {program.ranking && (
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Ranking</span>
                            <span className="font-medium">#{program.ranking}</span>
                          </li>
                        )}
                        {program.success_rate && (
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span className="font-medium">{program.success_rate}%</span>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-primary" /> Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center">
                          {program.exchange_opportunities ? 
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                            <XCircle className="h-4 w-4 text-muted-foreground mr-2" />}
                          <span>Exchange Opportunities</span>
                        </li>
                        <li className="flex items-center">
                          {program.internship_opportunities ? 
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                            <XCircle className="h-4 w-4 text-muted-foreground mr-2" />}
                          <span>Internship Opportunities</span>
                        </li>
                        <li className="flex items-center">
                          {program.scholarship_available ? 
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                            <XCircle className="h-4 w-4 text-muted-foreground mr-2" />}
                          <span>Scholarship Available</span>
                        </li>
                        <li className="flex items-center">
                          {program.religious_facilities ? 
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                            <XCircle className="h-4 w-4 text-muted-foreground mr-2" />}
                          <span>Religious Facilities</span>
                        </li>
                        <li className="flex items-center">
                          {program.halal_food_availability ? 
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                            <XCircle className="h-4 w-4 text-muted-foreground mr-2" />}
                          <span>Halal Food Availability</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="admission" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Admission Requirements</h2>
                <p className="text-muted-foreground whitespace-pre-line mb-6">
                  {program.admission_requirements}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {program.academic_requirements && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <GraduationCap className="mr-2 h-5 w-5 text-primary" /> 
                        Academic Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {program.academic_requirements}
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <ListChecks className="mr-2 h-5 w-5 text-primary" /> 
                      Requirements Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 text-sm">
                      {program.language_requirement && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Language Proficiency</span>
                          <span className="font-medium">{program.language_requirement}</span>
                        </li>
                      )}
                      {program.language_test && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Language Test</span>
                          <span className="font-medium">{program.language_test}</span>
                        </li>
                      )}
                      {program.language_test_score && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Required Score</span>
                          <span className="font-medium">{program.language_test_score}</span>
                        </li>
                      )}
                      {program.gpa_requirement && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Minimum GPA</span>
                          <span className="font-medium">{program.gpa_requirement}/4.0</span>
                        </li>
                      )}
                      {program.application_deadline && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Application Deadline</span>
                          <span className="font-medium">{program.application_deadline}</span>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
                
                {program.application_process && (
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-primary" /> 
                        Application Process
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {program.application_process}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="costs" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Costs & Financial Aid</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-primary" /> 
                      Tuition & Fees
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Tuition Range</span>
                        <span className="font-medium">${program.tuition_min?.toLocaleString()} - ${program.tuition_max?.toLocaleString()}</span>
                      </li>
                      {program.application_fee && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Application Fee</span>
                          <span className="font-medium">${program.application_fee?.toLocaleString()}</span>
                        </li>
                      )}
                      {program.visa_fee && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Visa Fee</span>
                          <span className="font-medium">${program.visa_fee?.toLocaleString()}</span>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Home className="mr-2 h-5 w-5 text-primary" /> 
                      Living Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Living Costs</span>
                        <span className="font-medium">${program.living_cost_min?.toLocaleString()} - ${program.living_cost_max?.toLocaleString()}</span>
                      </li>
                      {program.housing_cost_min && program.housing_cost_max && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Housing Costs</span>
                          <span className="font-medium">${program.housing_cost_min?.toLocaleString()} - ${program.housing_cost_max?.toLocaleString()}</span>
                        </li>
                      )}
                      {program.housing_availability && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Housing Availability</span>
                          <span className="font-medium">{program.housing_availability}</span>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
                
                {program.scholarship_details && (
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary" /> 
                        Scholarships & Financial Aid
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {program.scholarship_amount && (
                        <div className="flex items-center mb-3">
                          <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                            Up to ${program.scholarship_amount?.toLocaleString()}
                          </Badge>
                          {program.scholarship_deadline && (
                            <span className="text-xs text-muted-foreground">
                              <Clock className="inline h-3 w-3 mr-0.5" /> 
                              Deadline: {program.scholarship_deadline}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {program.scholarship_details}
                      </p>
                      {program.scholarship_requirements && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Eligibility Requirements:</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {program.scholarship_requirements}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="career" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Career Prospects</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart4 className="mr-2 h-5 w-5 text-primary" /> 
                      Career Outcomes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 text-sm">
                      {program.employment_rate && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Employment Rate</span>
                          <span className="font-medium">{program.employment_rate}%</span>
                        </li>
                      )}
                      <li className="flex items-center mt-1">
                        {program.internship_opportunities ? 
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                          <XCircle className="h-4 w-4 text-muted-foreground mr-2" />}
                        <span>Internship Opportunities</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" /> 
                      Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 text-sm">
                      {program.north_african_community_size && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">North African Community</span>
                          <span className="font-medium">{program.north_african_community_size}</span>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bank className="mr-2 h-5 w-5" />
                  {program.university}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src="/placeholder.svg?height=64&width=64&text=UNI" />
                    <AvatarFallback>UNI</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {program.city}, {program.country}
                    </div>
                    {program.ranking && (
                      <Badge className="mt-1" variant="outline">
                        <AreaChart className="h-3.5 w-3.5 mr-1" />
                        Ranked #{program.ranking}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <a href={program.website_url || "#"} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit University Website
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Apply for this Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application Fee</span>
                    <span className="font-medium">${program.application_fee || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-medium">{program.application_deadline || "Contact for details"}</span>
                  </div>
                  {program.available_places && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Places Available</span>
                      <span className="font-medium">{program.available_places}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full" onClick={handleApply}>
                  Start Your Application
                </Button>
                <div className="text-center text-xs text-muted-foreground mt-3">
                  Our advisors will guide you through the process
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col space-y-3">
                  <Button variant="outline" asChild>
                    <Link to="/consultation">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Get Program Advice
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/chat">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat with an Advisor
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramSkeleton() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="relative rounded-xl overflow-hidden mb-8 h-[300px] md:h-[400px] bg-gray-200 animate-pulse"></div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
        
        <div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-60 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageSquare(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
