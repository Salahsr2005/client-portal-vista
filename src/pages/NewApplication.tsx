import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Loader2,
  School,
  ClipboardList,
  MessageSquare,
  Calendar,
  AlertCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { usePrograms } from "@/hooks/usePrograms";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useApplicationSubmit, ApplicationFormData } from "@/hooks/useApplicationSubmit";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function NewApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    programId: "",
    notes: "",
    priority: "Medium",
  });
  
  const { data: programs = [], isLoading: isProgramsLoading } = usePrograms();
  const { submitApplication, isSubmitting } = useApplicationSubmit();

  // Parse program ID from URL params and set the selected program
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const programId = params.get('program');
    
    if (programId) {
      setSelectedProgram(programId);
      setFormData(prev => ({ ...prev, programId }));
      // Automatically go to step 2 if program is selected from URL
      setStep(2);
    }
  }, [location]);

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
    setFormData(prev => ({ ...prev, programId }));
  };

  const handleInputChange = (key: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (program.university && program.university.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedProgramDetails = programs.find(p => p.id === selectedProgram);

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedProgram) {
        toast({
          title: "Select a program",
          description: "Please select a program to continue",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitApplication(formData);
    
    if (result.success) {
      navigate("/applications");
    }
  };

  // Check if the selected program's deadline has passed
  const isDeadlinePassed = selectedProgramDetails?.deadlinePassed || false;

  return (
    <div className="container max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">New Application</h1>
          <p className="text-muted-foreground">Follow the steps below to submit your application</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/applications")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
      </div>

      {/* Stepper - modernized UI */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="w-full absolute top-1/2 -translate-y-1/2 h-1 bg-muted"></div>
          <div className={`flex flex-col items-center relative z-10`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${step >= 1 ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'bg-muted text-muted-foreground'}`}>
              <School className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium mt-2">Select Program</span>
          </div>
          <div className={`flex flex-col items-center relative z-10`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${step >= 2 ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'bg-muted text-muted-foreground'}`}>
              <ClipboardList className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium mt-2">Application Details</span>
          </div>
        </div>
      </div>

      {/* Step 1: Program Selection - enhanced UI */}
      {step === 1 && (
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-900 dark:to-slate-800/50 rounded-t-xl">
              <CardTitle>Select a Program</CardTitle>
              <CardDescription>
                Choose the program you want to apply for
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative mb-6">
                <Input
                  placeholder="Search programs by name or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {isProgramsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                </div>
              ) : filteredPrograms.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredPrograms.map((program) => {
                    // Check if program deadline has passed
                    const deadlinePassed = program.deadlinePassed || false;
                    
                    return (
                      <div 
                        key={program.id}
                        className={cn(
                          "relative border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
                          selectedProgram === program.id ? "border-violet-400 bg-violet-50/50 dark:bg-violet-900/10" : "",
                          deadlinePassed ? "opacity-70" : ""
                        )}
                        onClick={() => !deadlinePassed && handleProgramSelect(program.id)}
                      >
                        {deadlinePassed && (
                          <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-xl backdrop-blur-[1px] flex items-center justify-center z-10">
                            <Badge variant="destructive" className="absolute top-2 right-2">
                              Deadline Passed
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium">{program.name}</h3>
                            <p className="text-sm text-muted-foreground">{program.university}</p>
                          </div>
                          {selectedProgram === program.id && (
                            <CheckCircle className="h-5 w-5 text-violet-600" />
                          )}
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {program.type || 'Degree'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {program.location || 'International'}
                          </Badge>
                          {program.featured && (
                            <Badge variant="default" className="text-xs bg-gradient-to-r from-amber-500 to-yellow-500">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-3 text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1 text-violet-500" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <School className="h-3 w-3 mr-1 text-violet-500" />
                            <span>{program.deadline?.split('T')[0] || 'Contact for details'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No programs found</h3>
                  <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                    Try adjusting your search query to find more programs.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-slate-50 dark:bg-slate-900">
              <Button variant="ghost" onClick={() => navigate("/programs")}>
                Browse All Programs
              </Button>
              <Button 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                onClick={handleNextStep} 
                disabled={!selectedProgram}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Step 2: Application Details - improved UI */}
      {step === 2 && selectedProgramDetails && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-900 dark:to-slate-800/50 rounded-t-xl">
                <CardTitle>Application Details</CardTitle>
                <CardDescription>
                  Provide additional information for your application
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isDeadlinePassed ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-2" />
                    <h3 className="text-lg font-medium text-red-800">Application Deadline Passed</h3>
                    <p className="mt-2 text-red-700">
                      The deadline for this program has passed. You cannot submit an application at this time.
                    </p>
                    <Button 
                      variant="outline"
                      className="mt-4" 
                      onClick={() => navigate("/programs")}
                    >
                      Browse Other Programs
                    </Button>
                  </div>
                ) : (
                  <form id="applicationForm" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Application Priority</h3>
                      <RadioGroup 
                        defaultValue="Medium" 
                        value={formData.priority}
                        onValueChange={(value) => handleInputChange('priority', value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="High" id="priority-high" className="peer sr-only" />
                          <Label
                            htmlFor="priority-high"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-violet-500 [&:has([data-state=checked])]:border-violet-500 [&:has([data-state=checked])]:bg-violet-50 dark:[&:has([data-state=checked])]:bg-violet-900/20"
                          >
                            <AlertCircle className="h-6 w-6 mb-2 text-orange-500" />
                            High Priority
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="Medium" id="priority-medium" className="peer sr-only" />
                          <Label
                            htmlFor="priority-medium"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-violet-500 [&:has([data-state=checked])]:border-violet-500 [&:has([data-state=checked])]:bg-violet-50 dark:[&:has([data-state=checked])]:bg-violet-900/20"
                          >
                            <MessageSquare className="h-6 w-6 mb-2 text-blue-500" />
                            Medium Priority
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="Low" id="priority-low" className="peer sr-only" />
                          <Label
                            htmlFor="priority-low"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-violet-500 [&:has([data-state=checked])]:border-violet-500 [&:has([data-state=checked])]:bg-violet-50 dark:[&:has([data-state=checked])]:bg-violet-900/20"
                          >
                            <Calendar className="h-6 w-6 mb-2 text-green-500" />
                            Low Priority
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any specific requirements or questions about your application"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="min-h-[120px] resize-y"
                      />
                    </div>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4 bg-slate-50 dark:bg-slate-900">
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {!isDeadlinePassed && (
                  <Button 
                    type="submit" 
                    form="applicationForm" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <FileText className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Program summary card - enhanced UI */}
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-900 dark:to-slate-800/50 rounded-t-xl">
                <CardTitle className="text-lg">Selected Program</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-violet-900 dark:text-violet-300">{selectedProgramDetails.name}</h3>
                    <p className="text-muted-foreground">{selectedProgramDetails.university}</p>
                  </div>
                  
                  {selectedProgramDetails.featured && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500">
                      Featured Program
                    </Badge>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
                        Location:
                      </span>
                      <span className="text-sm font-medium">{selectedProgramDetails.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
                        Type:
                      </span>
                      <span className="text-sm font-medium">{selectedProgramDetails.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
                        Duration:
                      </span>
                      <span className="text-sm font-medium">{selectedProgramDetails.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <CircleDollarSign className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
                        Tuition:
                      </span>
                      <span className={`text-sm font-medium ${isDeadlinePassed ? 'text-red-600' : ''}`}>
                        €{selectedProgramDetails.tuition.toLocaleString()}
                        {isDeadlinePassed && ' (Passed)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
                        Deadline:
                      </span>
                      <span className={`text-sm font-medium ${isDeadlinePassed ? 'text-red-600' : ''}`}>
                        {selectedProgramDetails.deadline?.split('T')[0] || 'Contact for details'}
                        {isDeadlinePassed && ' (Passed)'}
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Required Documents</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Application Form
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        CV/Resume
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Academic Transcripts
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        Motivation Letter
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Missing lucide icon component
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
