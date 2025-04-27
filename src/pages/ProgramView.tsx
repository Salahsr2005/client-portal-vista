
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Share2, Calendar, GraduationCap, MapPin, 
  Globe, DollarSign, Clock, Award, FileText, Bookmark, 
  CheckCircle, Languages, Building, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { usePrograms } from "@/hooks/usePrograms";
import { useNavigate as useRouter } from "react-router-dom";

export default function ProgramView() {
  const { programId } = useParams<{ programId: string }>();
  const { data: programs = [], isLoading, error } = usePrograms();
  const [program, setProgram] = useState<any>(null);
  const navigate = useNavigate();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (programs.length > 0 && programId) {
      const foundProgram = programs.find(p => p.id === programId);
      if (foundProgram) {
        setProgram(foundProgram);
      }
    }
  }, [programs, programId]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied",
        description: "Program link has been copied to clipboard",
      });
    });
  };

  const handleApply = () => {
    navigate(`/applications/new?programId=${programId}`);
  };

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container max-w-5xl py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/programs')} variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Programs
          </Button>
        </div>
      </div>
    );
  }

  // Default image if none is provided
  const imageUrl = program.image_url || '/placeholder.svg';
  
  return (
    <div className="container max-w-5xl py-8 animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/programs')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Programs
      </Button>
      
      {/* Hero section with program image */}
      <div 
        className="relative rounded-xl overflow-hidden bg-cover bg-center h-64 mb-8"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/20 text-white hover:bg-primary/30">
              {program.study_level || program.type}
            </Badge>
            <Badge variant="secondary" className="bg-primary/20 text-white hover:bg-primary/30">
              {program.field || "Various Fields"}
            </Badge>
            {program.scholarship_available && (
              <Badge variant="secondary" className="bg-amber-500/20 text-white hover:bg-amber-500/30">
                <Award className="mr-1 h-3 w-3" />
                Scholarship
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-1">{program.name}</h1>
          <p className="text-lg opacity-90 flex items-center">
            <Building className="mr-2 h-4 w-4" />
            {program.university}
          </p>
        </div>
      </div>
      
      {/* Quick info and actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Key information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Program Overview
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {program.description}
              </p>
              
              {program.advantages && (
                <>
                  <h3 className="font-medium mb-2">Key Benefits</h3>
                  <ul className="space-y-1 mb-4">
                    {program.advantages.split('\n').filter(Boolean).map((advantage: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                        <span>{advantage.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Duration</span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-primary" />
                    {program.duration_months ? `${program.duration_months} months` : program.duration}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Language</span>
                  <span className="font-medium flex items-center">
                    <Languages className="h-4 w-4 mr-1 text-primary" />
                    {program.program_language || "English"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Tuition</span>
                  <span className="font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-primary" />
                    {program.tuition}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Application Fee</span>
                  <span className="font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-primary" />
                    {program.applicationFee}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Location</span>
                  <span className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    {program.city || ""}, {program.country || program.location}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Application Deadline</span>
                  <span className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    {program.deadline ? new Date(program.deadline).toLocaleDateString() : "Contact for details"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs for detailed information */}
          <Tabs defaultValue="requirements" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="admissions">Admissions</TabsTrigger>
              <TabsTrigger value="details">Program Details</TabsTrigger>
            </TabsList>
            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-3">Academic Requirements</h3>
                  <div className="space-y-2">
                    {program.academic_requirements ? (
                      <div className="space-y-2">
                        {program.academic_requirements.split('\n').map((req: string, i: number) => (
                          req.trim() ? (
                            <p key={i} className="flex items-start">
                              <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
                              <span>{req.trim()}</span>
                            </p>
                          ) : null
                        ))}
                      </div>
                    ) : (
                      <div>
                        {program.requirements ? (
                          <div className="space-y-2">
                            {program.requirements.split('\n').map((req: string, i: number) => (
                              req.trim() ? (
                                <p key={i} className="flex items-start">
                                  <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
                                  <span>{req.trim()}</span>
                                </p>
                              ) : null
                            ))}
                          </div>
                        ) : (
                          <p>Please contact the university for specific requirements.</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {(program.language_test || program.language_test_score) && (
                    <>
                      <h3 className="text-lg font-medium mt-6 mb-3">Language Requirements</h3>
                      <div className="space-y-2">
                        <p className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
                          <span>{program.language_test || "English proficiency test"}: {program.language_test_score || "Required score varies"}</span>
                        </p>
                        {program.language_test_exemptions && (
                          <p className="flex items-start">
                            <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
                            <span>Exemptions: {program.language_test_exemptions}</span>
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="admissions" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-3">Application Process</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {program.application_process || "The application process typically involves submitting your academic credentials, language test scores, and other supporting documents. For detailed information, please contact our advisors."}
                    </p>
                    
                    <h4 className="font-medium mt-2">Required Documents</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        Academic transcripts
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        Language proficiency test results
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        Letter of motivation/Personal statement
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        CV/Resume
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        Letters of recommendation
                      </li>
                    </ul>
                  </div>
                  
                  {program.scholarship_available && (
                    <>
                      <h3 className="text-lg font-medium mt-6 mb-3">Scholarship Information</h3>
                      <div className="space-y-2">
                        <p className="text-muted-foreground">
                          {program.scholarship_details || "This program offers scholarship opportunities for qualified applicants. Contact our advisors for more information on eligibility and application process."}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Program Information</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <GraduationCap className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                          <div>
                            <span className="font-medium block">Study Level</span>
                            <span className="text-sm text-muted-foreground">{program.study_level || program.type}</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Clock className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                          <div>
                            <span className="font-medium block">Duration</span>
                            <span className="text-sm text-muted-foreground">{program.duration_months ? `${program.duration_months} months` : program.duration}</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Calendar className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                          <div>
                            <span className="font-medium block">Start Date</span>
                            <span className="text-sm text-muted-foreground">Fall and Spring semesters</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Globe className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                          <div>
                            <span className="font-medium block">Available for International Students</span>
                            <span className="text-sm text-muted-foreground">Yes</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">University Information</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Building className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                          <div>
                            <span className="font-medium block">Institution</span>
                            <span className="text-sm text-muted-foreground">{program.university}</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                          <div>
                            <span className="font-medium block">Location</span>
                            <span className="text-sm text-muted-foreground">{program.city || ""}, {program.country || program.location}</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Award className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                          <div>
                            <span className="font-medium block">University Ranking</span>
                            <span className="text-sm text-muted-foreground">Top {program.ranking || "Ranked"} Institution</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Languages className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                          <div>
                            <span className="font-medium block">Language of Instruction</span>
                            <span className="text-sm text-muted-foreground">{program.program_language || "English"}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar with action buttons and additional info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Application Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Application Deadline</p>
                  <p className="text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {program.deadline ? new Date(program.deadline).toLocaleDateString() : "Contact for details"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Application Fee</p>
                  <p className="text-muted-foreground flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                    {program.applicationFee}
                  </p>
                </div>
                
                <Separator />
                
                <Button className="w-full" onClick={handleApply}>
                  Apply Now
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Program
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/consultation')}>
                  <Award className="mr-2 h-4 w-4" />
                  Get Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Need Assistance?</h3>
              <p className="text-muted-foreground mb-4">
                Our education consultants are here to help you with your application process.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => navigate('/appointments')}>
                  Schedule Appointment
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/chat')}>
                  Chat with Advisor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
