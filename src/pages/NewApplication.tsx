
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  School,
  GraduationCap,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileCheck,
  CircleDot,
  Search,
  Upload,
  X,
  Info
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePrograms } from "@/hooks/usePrograms";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NewApplication() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);

  // Application data
  const [applicationData, setApplicationData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    birthDate: userProfile?.dateOfBirth || "",
    nationality: userProfile?.nationality || "",
    address: userProfile?.currentAddress || "",
    education: userProfile?.educationBackground || "",
    motivation: "",
    startDate: "",
    additionalInfo: "",
    priority: "Medium" as "Low" | "Medium" | "High"
  });

  const goToNextStep = () => {
    // Simple validation for each step
    if (step === 1 && !selectedProgram) {
      toast({
        title: "Please select a program",
        description: "You need to select a program before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (step === 2) {
      const requiredFields = ["firstName", "lastName", "email", "phone", "birthDate", "nationality"];
      const missingFields = requiredFields.filter(field => !applicationData[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing information",
          description: `Please fill in all required fields: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        return;
      }
    }

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const goToPrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({ ...applicationData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setDocuments([...documents, ...files]);
  };

  const removeFile = (index) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const handleSubmitApplication = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit an application",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create the application in the database
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .insert({
          client_id: user.id,
          program_id: selectedProgram.id,
          status: 'Draft',
          priority: applicationData.priority,
          notes: applicationData.additionalInfo,
        })
        .select();

      if (applicationError) throw applicationError;

      const applicationId = applicationData[0].application_id;

      // 2. Upload documents if any
      const documentPromises = documents.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}_${index}.${fileExt}`;
        const filePath = `application_documents/${fileName}`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the file URL
        const { data: fileData } = supabase.storage
          .from('applications')
          .getPublicUrl(filePath);

        // Add document reference to application_documents table
        await supabase
          .from('application_documents')
          .insert({
            application_id: applicationId,
            name: file.name,
            status: 'Pending',
            file_path: fileData.publicUrl,
            uploaded_at: new Date().toISOString(),
          });
      });

      await Promise.all(documentPromises);

      // 3. Add to application timeline
      await supabase
        .from('application_timeline')
        .insert({
          application_id: applicationId,
          status: 'Draft Created',
          date: new Date().toISOString(),
          note: 'Application created',
        });

      setSubmitting(false);
      
      toast({
        title: "Application submitted successfully",
        description: "Your application has been created successfully. You can track its status in your applications list.",
      });
      
      navigate('/applications');
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitting(false);
      
      toast({
        title: "Error submitting application",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter programs based on search query
  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStepContent = () => {
    switch(step) {
      case 1: // Program Selection
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Select a Program</h2>
              <p className="text-muted-foreground">
                Choose the program you want to apply for from our list of available programs.
              </p>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search programs by name, university or country..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {programsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium">No programs found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  No programs match your search criteria. Try adjusting your search terms or browse all available programs.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Show All Programs
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPrograms.map((program) => (
                  <Card 
                    key={program.id}
                    className={`cursor-pointer transition-all hover:border-primary ${selectedProgram?.id === program.id ? 'border-2 border-primary' : ''}`}
                    onClick={() => setSelectedProgram(program)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{program.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <School className="h-3.5 w-3.5 mr-1 inline" />
                            {program.university}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {program.type}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {program.country}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {program.duration}
                            </Badge>
                          </div>
                          <div className="mt-3 text-sm">
                            <span className="font-semibold">Tuition:</span> {program.tuition}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedProgram?.id === program.id ? 'bg-primary' : 'border border-input'}`}>
                            {selectedProgram?.id === program.id && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
        
      case 2: // Personal Information
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <p className="text-muted-foreground">
                Please provide your personal details for the application. Fields marked with * are required.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Your first name"
                    className="pl-9"
                    value={applicationData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Your last name"
                    className="pl-9"
                    value={applicationData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    className="pl-9"
                    value={applicationData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    className="pl-9"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthDate">Date of Birth *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    className="pl-9"
                    value={applicationData.birthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nationality"
                    name="nationality"
                    placeholder="Your nationality"
                    className="pl-9"
                    value={applicationData.nationality}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Current Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Your current address"
                value={applicationData.address}
                onChange={handleInputChange}
                className="min-h-24"
              />
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-2">
              <Label htmlFor="education">Education Background</Label>
              <Textarea
                id="education"
                name="education"
                placeholder="Your education history, qualifications, and achievements"
                value={applicationData.education}
                onChange={handleInputChange}
                className="min-h-24"
              />
            </div>
          </div>
        );
        
      case 3: // Academic Information
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Academic Information</h2>
              <p className="text-muted-foreground">
                Provide additional information about your application.
              </p>
            </div>
            
            <Card className="bg-muted/40 border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Selected Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src="/placeholder.svg?text=P" alt={selectedProgram?.name} />
                    <AvatarFallback>{selectedProgram?.name?.charAt(0) || "P"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedProgram?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProgram?.university}, {selectedProgram?.country}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{selectedProgram?.type || "Unknown"}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{selectedProgram?.duration || "Unknown"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <Label htmlFor="motivation">Motivation Letter</Label>
              <Textarea
                id="motivation"
                name="motivation"
                placeholder="Explain why you're applying for this program and what makes you a good candidate"
                value={applicationData.motivation}
                onChange={handleInputChange}
                className="min-h-32"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Preferred Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={applicationData.startDate}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Application Priority</Label>
              <RadioGroup 
                value={applicationData.priority} 
                onValueChange={(value) => setApplicationData({
                  ...applicationData, 
                  priority: value as "Low" | "Medium" | "High"
                })}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Low" id="priority-low" />
                    <Label htmlFor="priority-low">Low Priority</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="priority-medium" />
                    <Label htmlFor="priority-medium">Medium Priority</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="High" id="priority-high" />
                    <Label htmlFor="priority-high">High Priority</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Any additional information you'd like to provide"
                value={applicationData.additionalInfo}
                onChange={handleInputChange}
                className="min-h-24"
              />
            </div>
          </div>
        );
        
      case 4: // Documents Upload
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Upload Documents</h2>
              <p className="text-muted-foreground">
                Upload all necessary documents for your application. Accepted formats: PDF, JPG, PNG (max 5MB per file).
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center text-sm">
                  <CircleDot className="h-3 w-3 mr-2 text-primary" />
                  <span>Passport or ID (required)</span>
                </div>
                <div className="flex items-center text-sm">
                  <CircleDot className="h-3 w-3 mr-2 text-primary" />
                  <span>Academic transcripts (required)</span>
                </div>
                <div className="flex items-center text-sm">
                  <CircleDot className="h-3 w-3 mr-2 text-primary" />
                  <span>CV/Resume (required)</span>
                </div>
                <div className="flex items-center text-sm">
                  <CircleDot className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>Language proficiency certificates (if applicable)</span>
                </div>
                <div className="flex items-center text-sm">
                  <CircleDot className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>Letters of recommendation (optional)</span>
                </div>
              </div>
              
              <Card className="bg-muted/40">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="bg-background p-4 rounded-full">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium">Upload Documents</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Drag and drop your files here or click to browse
                    </p>
                    <Button variant="outline" className="mt-2" size="sm" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        Browse Files
                      </label>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {documents.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Uploaded Documents ({documents.length})</h3>
                  <div className="space-y-2">
                    {documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex items-center">
                          <FileCheck className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md dark:bg-blue-900/20 dark:text-blue-300">
                <Info className="h-5 w-5 mr-2" />
                <p className="text-sm">
                  Your application can be submitted without all documents, but processing may be delayed. You can add or update documents later.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 5: // Review and Submit
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Review and Submit</h2>
              <p className="text-muted-foreground">
                Please review all information before submitting your application.
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Selected Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-semibold">{selectedProgram?.name}</p>
                  <p className="text-muted-foreground">{selectedProgram?.university}, {selectedProgram?.country}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{selectedProgram?.type}</Badge>
                    <Badge variant="secondary">{selectedProgram?.duration}</Badge>
                    <Badge variant="secondary">{selectedProgram?.tuition}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p>{applicationData.firstName} {applicationData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{applicationData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{applicationData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p>{applicationData.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p>{applicationData.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <p>{applicationData.priority}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <ul className="space-y-1">
                    {documents.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{file.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No documents uploaded</p>
                )}
              </CardContent>
            </Card>
            
            <div className="bg-primary/10 rounded-lg p-4 text-primary space-y-2">
              <h3 className="font-medium flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Next Steps
              </h3>
              <p className="text-sm">
                After submission, our team will review your application and required documents.
                We'll contact you if any additional information or documents are needed.
                You can track the status of your application in the "Applications" section.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Login Required</h1>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to create a new application.
        </p>
        <Button onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">New Application</h1>
        <p className="text-muted-foreground">
          Complete all steps to submit your application for review.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Application Progress</span>
          <span className="text-sm font-medium">{Math.round((step / 5) * 100)}%</span>
        </div>
        <Progress value={(step / 5) * 100} className="h-2" />
        
        <div className="flex justify-between mt-2">
          <div className="flex gap-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${s < step ? "bg-primary text-primary-foreground" : 
                      s === step ? "border-2 border-primary bg-primary/10" : "bg-muted"}`}
                >
                  {s < step ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm">{s}</span>
                  )}
                </div>
                <span className="text-xs mt-1 text-muted-foreground">
                  {s === 1 ? "Program" : 
                   s === 2 ? "Personal" : 
                   s === 3 ? "Academic" :
                   s === 4 ? "Documents" : "Review"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        {step > 1 && (
          <Button 
            variant="outline" 
            onClick={goToPrevStep}
            disabled={submitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </Button>
        )}
        
        {step < 5 ? (
          <Button 
            className="ml-auto bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700"
            onClick={goToNextStep}
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmitApplication}
            className="ml-auto bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
            {!submitting && <CheckCircle className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}
