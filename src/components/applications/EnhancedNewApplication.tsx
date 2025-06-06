
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  GraduationCap,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Globe,
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Program Selection', icon: GraduationCap },
  { id: 3, title: 'Documents', icon: FileText },
  { id: 4, title: 'Review & Submit', icon: Check },
];

export default function EnhancedNewApplication() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      address: '',
    },
    programInfo: {
      programId: '',
      motivation: '',
      academicBackground: '',
      careerGoals: '',
    },
    documents: {
      passport: null,
      transcript: null,
      cv: null,
      motivationLetter: null,
    }
  });

  // Fetch programs
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('status', 'Active')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user data to pre-fill form
  const { data: userData } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('client_users')
        .select('*, client_profiles(*)')
        .eq('client_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            dateOfBirth: data.date_of_birth || '',
            nationality: data.nationality || '',
            passportNumber: data.client_profiles?.[0]?.passport_number || '',
            address: data.client_profiles?.[0]?.current_address || '',
          }
        }));
      }
    }
  });

  const selectedProgram = programs.find(p => p.id === formData.programInfo.programId);
  
  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        const { firstName, lastName, email, phone, dateOfBirth, nationality } = formData.personalInfo;
        return firstName && lastName && email && phone && dateOfBirth && nationality;
      case 2:
        return formData.programInfo.programId && formData.programInfo.motivation;
      case 3:
        return true; // Documents are optional for now
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill in all required fields before continuing.',
        variant: 'destructive',
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user || !validateStep(currentStep)) return;

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from('applications')
        .insert({
          client_id: user.id,
          program_id: formData.programInfo.programId,
          status: 'Draft',
          notes: JSON.stringify({
            personalInfo: formData.personalInfo,
            programInfo: formData.programInfo,
            documents: formData.documents
          })
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Application Created!',
        description: 'Your application has been saved as a draft. You can complete it later.',
      });

      navigate(`/applications/${data.application_id}`);
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        title: 'Error',
        description: 'Failed to create application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-muted-foreground">Please provide your personal details for the application.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className="border-violet-200 focus:border-violet-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  placeholder="Enter your last name"
                  className="border-violet-200 focus:border-violet-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  placeholder="Enter your email"
                  className="border-violet-200 focus:border-violet-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="border-violet-200 focus:border-violet-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  className="border-violet-200 focus:border-violet-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.personalInfo.nationality}
                  onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                  placeholder="Enter your nationality"
                  className="border-violet-200 focus:border-violet-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Current Address</Label>
              <Textarea
                id="address"
                value={formData.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                placeholder="Enter your current address"
                className="border-violet-200 focus:border-violet-400"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Program Selection</h3>
              <p className="text-muted-foreground">Choose the program you want to apply for and provide additional information.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program">Select Program *</Label>
                <Select 
                  value={formData.programInfo.programId} 
                  onValueChange={(value) => handleInputChange('programInfo', 'programId', value)}
                >
                  <SelectTrigger className="border-violet-200 focus:border-violet-400">
                    <SelectValue placeholder="Choose a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{program.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {program.university}, {program.country}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProgram && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200"
                >
                  <h4 className="font-semibold text-violet-900 mb-2">{selectedProgram.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-violet-600" />
                      <span>{selectedProgram.university}, {selectedProgram.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-violet-600" />
                      <span>{selectedProgram.duration_months} months</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-violet-600" />
                      <span>{selectedProgram.program_language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-violet-600" />
                      <span>{selectedProgram.study_level}</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="motivation">Motivation Letter *</Label>
                <Textarea
                  id="motivation"
                  value={formData.programInfo.motivation}
                  onChange={(e) => handleInputChange('programInfo', 'motivation', e.target.value)}
                  placeholder="Explain why you want to study this program..."
                  className="border-violet-200 focus:border-violet-400 min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academicBackground">Academic Background</Label>
                <Textarea
                  id="academicBackground"
                  value={formData.programInfo.academicBackground}
                  onChange={(e) => handleInputChange('programInfo', 'academicBackground', e.target.value)}
                  placeholder="Describe your educational background..."
                  className="border-violet-200 focus:border-violet-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="careerGoals">Career Goals</Label>
                <Textarea
                  id="careerGoals"
                  value={formData.programInfo.careerGoals}
                  onChange={(e) => handleInputChange('programInfo', 'careerGoals', e.target.value)}
                  placeholder="What are your career goals after this program?"
                  className="border-violet-200 focus:border-violet-400"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Documents Upload</h3>
              <p className="text-muted-foreground">Upload required documents for your application.</p>
            </div>
            
            <div className="text-center py-12 border-2 border-dashed border-violet-200 rounded-lg">
              <FileText className="h-16 w-16 text-violet-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Document Upload Coming Soon</h4>
              <p className="text-muted-foreground mb-4">
                Document upload functionality will be available in the next update.
              </p>
              <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                Optional for now
              </Badge>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">Review & Submit</h3>
              <p className="text-muted-foreground">Please review your application before submitting.</p>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Name:</strong> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                  <p><strong>Email:</strong> {formData.personalInfo.email}</p>
                  <p><strong>Phone:</strong> {formData.personalInfo.phone}</p>
                  <p><strong>Nationality:</strong> {formData.personalInfo.nationality}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Program Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedProgram && (
                    <>
                      <p><strong>Program:</strong> {selectedProgram.name}</p>
                      <p><strong>University:</strong> {selectedProgram.university}</p>
                      <p><strong>Country:</strong> {selectedProgram.country}</p>
                      <p><strong>Duration:</strong> {selectedProgram.duration_months} months</p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Important Note</h4>
                    <p className="text-sm text-amber-700">
                      Your application will be saved as a draft. You can complete and submit it later from your applications page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/applications')}
          className="hover:bg-violet-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            New Application
          </h1>
          <p className="text-muted-foreground">Create a new program application</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-violet-600' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="hover:bg-violet-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {currentStep === steps.length ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Application...
              </>
            ) : (
              <>
                Submit Application
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!validateStep(currentStep)}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
