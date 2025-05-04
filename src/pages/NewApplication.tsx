
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

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="w-full absolute top-1/2 -translate-y-1/2 h-1 bg-muted"></div>
          <div className={`flex flex-col items-center relative z-10`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <School className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium mt-2">Select Program</span>
          </div>
          <div className={`flex flex-col items-center relative z-10`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <ClipboardList className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium mt-2">Application Details</span>
          </div>
        </div>
      </div>

      {/* Step 1: Program Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select a Program</CardTitle>
              <CardDescription>
                Choose the program you want to apply for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Input
                  placeholder="Search programs by name or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {isProgramsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPrograms.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredPrograms.map((program) => (
                    <div 
                      key={program.id}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all hover:border-primary",
                        selectedProgram === program.id ? "border-primary bg-primary/5" : ""
                      )}
                      onClick={() => handleProgramSelect(program.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium">{program.name}</h3>
                          <p className="text-sm text-muted-foreground">{program.university}</p>
                        </div>
                        {selectedProgram === program.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
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
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-3 text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <School className="h-3 w-3 mr-1" />
                          <span>{program.deadline?.split('T')[0] || 'Contact for details'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => navigate("/programs")}>
                Browse All Programs
              </Button>
              <Button onClick={handleNextStep} disabled={!selectedProgram}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Step 2: Application Details */}
      {step === 2 && selectedProgramDetails && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>
                  Provide additional information for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="applicationForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Application Priority</h3>
                    <RadioGroup 
                      defaultValue="Medium" 
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange('priority', value)}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="High" id="priority-high" className="peer sr-only" />
                        <Label
                          htmlFor="priority-high"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <AlertCircle className="h-6 w-6 mb-2 text-orange-500" />
                          High Priority
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="Medium" id="priority-medium" className="peer sr-only" />
                        <Label
                          htmlFor="priority-medium"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <MessageSquare className="h-6 w-6 mb-2 text-blue-500" />
                          Medium Priority
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="Low" id="priority-low" className="peer sr-only" />
                        <Label
                          htmlFor="priority-low"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
                      placeholder="Add any additional information or questions about your application"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  form="applicationForm" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{selectedProgramDetails.name}</h3>
                    <p className="text-muted-foreground">{selectedProgramDetails.university}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="text-sm font-medium">{selectedProgramDetails.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="text-sm font-medium">{selectedProgramDetails.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="text-sm font-medium">{selectedProgramDetails.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tuition:</span>
                      <span className="text-sm font-medium">{selectedProgramDetails.tuition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Application Deadline:</span>
                      <span className="text-sm font-medium">{selectedProgramDetails.deadline?.split('T')[0] || 'Contact for details'}</span>
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
