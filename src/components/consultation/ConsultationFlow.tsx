import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { usePrograms } from "@/hooks/usePrograms";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { createFavoriteProgramsTable } from '@/utils/databaseHelpers';
import { ArrowRight, ArrowLeft, Check, X, Heart, Filter, Search, GraduationCap, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

// Define types
interface Program {
  id: string;
  name: string;
  university: string;
  location: string;
  type: string;
  duration: string;
  tuition: string;
  deadline: string;
  subjects: string[];
  description: string;
  requirements: string;
  [key: string]: any;
}

interface FormData {
  studyLevel: string;
  subjects: string[];
  location: string;
  duration: string;
  budget: string;
  startDate: string;
  specialRequirements: string;
}

export const ConsultationFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: allPrograms = [], isLoading } = usePrograms();
  
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [formData, setFormData] = useState<FormData>({
    studyLevel: "",
    subjects: [],
    location: "",
    duration: "",
    budget: "",
    startDate: "",
    specialRequirements: "",
  });
  
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<{[key: string]: boolean}>({
    level: false,
    location: false,
    duration: false,
    budget: false,
  });
  
  // Initialize favorites
  useEffect(() => {
    if (user) {
      fetchFavoritePrograms();
    }
  }, [user]);
  
  const fetchFavoritePrograms = async () => {
    if (!user) return;
    
    try {
      // Ensure the table exists
      await createFavoriteProgramsTable();
      
      // Fetch user's favorite programs
      const { data, error } = await supabase
        .from('favorite_programs')
        .select('program_id')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching favorite programs:', error);
        return;
      }
      
      if (data) {
        const favoriteIds = data.map(item => item.program_id);
        setFavoritePrograms(favoriteIds);
      }
    } catch (err) {
      console.error('Error in fetchFavoritePrograms:', err);
    }
  };
  
  const toggleFavorite = async (programId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorite programs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (favoritePrograms.includes(programId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_programs')
          .delete()
          .eq('user_id', user.id)
          .eq('program_id', programId);
          
        if (error) throw error;
        
        setFavoritePrograms(prev => prev.filter(id => id !== programId));
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
        
        setFavoritePrograms(prev => [...prev, programId]);
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
  
  const handleNext = () => {
    if (step === 1) {
      if (!formData.studyLevel) {
        toast({
          title: "Required field",
          description: "Please select a study level to continue",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
      setProgress(50);
    } else if (step === 2) {
      if (formData.subjects.length === 0) {
        toast({
          title: "Required field",
          description: "Please select at least one subject area",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
      setProgress(75);
    } else if (step === 3) {
      filterPrograms();
      setStep(4);
      setProgress(100);
    }
  };
  
  const handlePrevious = () => {
    if (step === 2) {
      setStep(1);
      setProgress(25);
    } else if (step === 3) {
      setStep(2);
      setProgress(50);
    } else if (step === 4) {
      setStep(3);
      setProgress(75);
    }
  };
  
  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => {
      if (prev.subjects.includes(subject)) {
        return {
          ...prev,
          subjects: prev.subjects.filter(s => s !== subject)
        };
      } else {
        return {
          ...prev,
          subjects: [...prev.subjects, subject]
        };
      }
    });
  };
  
  const filterPrograms = () => {
    // Apply filters based on form data
    let filtered = [...allPrograms];
    
    // Filter by study level
    if (formData.studyLevel) {
      filtered = filtered.filter(program => 
        program.study_level?.toLowerCase() === formData.studyLevel.toLowerCase() ||
        program.type?.toLowerCase().includes(formData.studyLevel.toLowerCase())
      );
    }
    
    // Filter by subjects
    if (formData.subjects.length > 0) {
      filtered = filtered.filter(program => {
        // Check if any of the selected subjects match the program's field keywords
        if (program.field_keywords && Array.isArray(program.field_keywords)) {
          return formData.subjects.some(subject => 
            program.field_keywords.some((keyword: string) => 
              keyword.toLowerCase().includes(subject.toLowerCase())
            )
          );
        }
        // If no field keywords, check program name and description
        return formData.subjects.some(subject => 
          program.name.toLowerCase().includes(subject.toLowerCase()) ||
          (program.description && program.description.toLowerCase().includes(subject.toLowerCase()))
        );
      });
    }
    
    // Filter by location if specified
    if (formData.location) {
      filtered = filtered.filter(program => 
        program.country?.toLowerCase().includes(formData.location.toLowerCase()) ||
        program.location?.toLowerCase().includes(formData.location.toLowerCase())
      );
    }
    
    // Filter by duration if specified
    if (formData.duration) {
      const durationMonths = parseInt(formData.duration);
      filtered = filtered.filter(program => {
        if (!program.duration_months) return true;
        
        if (formData.duration === "12") {
          return program.duration_months <= 12;
        } else if (formData.duration === "24") {
          return program.duration_months > 12 && program.duration_months <= 24;
        } else if (formData.duration === "36") {
          return program.duration_months > 24 && program.duration_months <= 36;
        } else if (formData.duration === "48") {
          return program.duration_months > 36;
        }
        return true;
      });
    }
    
    // Filter by budget if specified
    if (formData.budget) {
      const maxBudget = parseInt(formData.budget);
      filtered = filtered.filter(program => {
        if (!program.tuition_min) return true;
        return program.tuition_min <= maxBudget;
      });
    }
    
    setFilteredPrograms(Array.isArray(filtered) ? filtered : []);
  };
  
  const handleProgramSelect = (programId: string) => {
    setSelectedPrograms(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      } else {
        return [...prev, programId];
      }
    });
  };
  
  const handleSubmit = () => {
    toast({
      title: "Consultation Complete",
      description: `You've selected ${selectedPrograms.length} programs. Our advisors will contact you soon.`,
    });
    
    // Here you would typically send the data to your backend
    console.log("Selected programs:", selectedPrograms);
    console.log("Form data:", formData);
  };
  
  const handleSearchFilter = () => {
    if (!searchQuery) {
      filterPrograms();
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const searchFiltered = filteredPrograms.filter(program => 
      program.name.toLowerCase().includes(query) ||
      program.university?.toLowerCase().includes(query) ||
      program.location?.toLowerCase().includes(query) ||
      program.country?.toLowerCase().includes(query)
    );
    
    setFilteredPrograms(searchFiltered);
  };
  
  useEffect(() => {
    if (searchQuery) {
      handleSearchFilter();
    }
  }, [searchQuery]);
  
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  // Subject areas
  const subjectAreas = [
    "Business & Management",
    "Computer Science & IT",
    "Engineering",
    "Arts & Humanities",
    "Social Sciences",
    "Natural Sciences",
    "Medicine & Health",
    "Law",
    "Education",
    "Architecture & Design"
  ];
  
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {step} of 4</span>
          <span>{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Step 1: Study Level */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What level of study are you interested in?</h2>
          <p className="text-muted-foreground">Select the academic level you want to pursue</p>
          
          <RadioGroup 
            value={formData.studyLevel} 
            onValueChange={(value) => setFormData({...formData, studyLevel: value})}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
          >
            <div>
              <RadioGroupItem value="Bachelor" id="bachelor" className="peer sr-only" />
              <Label
                htmlFor="bachelor"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <GraduationCap className="mb-3 h-6 w-6" />
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">Bachelor's Degree</h3>
                  <p className="text-sm text-muted-foreground">
                    Undergraduate programs (3-4 years)
                  </p>
                </div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="Master" id="master" className="peer sr-only" />
              <Label
                htmlFor="master"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <GraduationCap className="mb-3 h-6 w-6" />
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">Master's Degree</h3>
                  <p className="text-sm text-muted-foreground">
                    Graduate programs (1-2 years)
                  </p>
                </div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="PhD" id="phd" className="peer sr-only" />
              <Label
                htmlFor="phd"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <GraduationCap className="mb-3 h-6 w-6" />
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">PhD / Doctorate</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced research degrees (3+ years)
                  </p>
                </div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="Certificate" id="certificate" className="peer sr-only" />
              <Label
                htmlFor="certificate"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <GraduationCap className="mb-3 h-6 w-6" />
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">Certificate / Diploma</h3>
                  <p className="text-sm text-muted-foreground">
                    Short-term professional qualifications
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      {/* Step 2: Subject Areas */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What subjects are you interested in studying?</h2>
          <p className="text-muted-foreground">Select all that apply</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
            {subjectAreas.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox 
                  id={subject.toLowerCase().replace(/\s+/g, '-')} 
                  checked={formData.subjects.includes(subject)}
                  onCheckedChange={() => handleSubjectToggle(subject)}
                />
                <label
                  htmlFor={subject.toLowerCase().replace(/\s+/g, '-')}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {subject}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Step 3: Additional Preferences */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Additional Preferences</h2>
          <p className="text-muted-foreground">Help us narrow down programs that match your needs</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Preferred Location</Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => setFormData({...formData, location: value})}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="Italy">Italy</SelectItem>
                  <SelectItem value="Netherlands">Netherlands</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Program Duration</Label>
              <Select 
                value={formData.duration} 
                onValueChange={(value) => setFormData({...formData, duration: value})}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Up to 1 year</SelectItem>
                  <SelectItem value="24">1-2 years</SelectItem>
                  <SelectItem value="36">2-3 years</SelectItem>
                  <SelectItem value="48">3+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Annual Tuition in USD)</Label>
              <Select 
                value={formData.budget} 
                onValueChange={(value) => setFormData({...formData, budget: value})}
              >
                <SelectTrigger id="budget">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">Under $10,000</SelectItem>
                  <SelectItem value="20000">Under $20,000</SelectItem>
                  <SelectItem value="30000">Under $30,000</SelectItem>
                  <SelectItem value="50000">Under $50,000</SelectItem>
                  <SelectItem value="100000">Any budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Preferred Start Date</Label>
              <Select 
                value={formData.startDate} 
                onValueChange={(value) => setFormData({...formData, startDate: value})}
              >
                <SelectTrigger id="startDate">
                  <SelectValue placeholder="Select start date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                  <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
            <Textarea 
              id="specialRequirements" 
              placeholder="Any additional information that might help us find the right program for you"
              value={formData.specialRequirements}
              onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}
      
      {/* Step 4: Results */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Recommended Programs</h2>
              <p className="text-muted-foreground">
                Based on your preferences, we found {filteredPrograms.length} matching programs
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search programs..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon" onClick={() => toggleFilter('all')}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Active filters */}
          {Object.values(activeFilters).some(Boolean) && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, active]) => 
                active && (
                  <Badge key={key} variant="secondary" className="px-3 py-1">
                    {key === 'level' ? 'Study Level' : 
                     key === 'location' ? 'Location' : 
                     key === 'duration' ? 'Duration' : 
                     key === 'budget' ? 'Budget' : key}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={() => toggleFilter(key)} 
                    />
                  </Badge>
                )
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => setActiveFilters({level: false, location: false, duration: false, budget: false})}
              >
                Clear all
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <X className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No matching programs found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Try adjusting your preferences or filters to see more results.
                </p>
                <Button onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Adjust Preferences
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Programs</TabsTrigger>
                  <TabsTrigger value="selected">Selected ({selectedPrograms.length})</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites ({favoritePrograms.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 mt-4">
                  {filteredPrograms.map((program) => (
                    <ProgramCard 
                      key={program.id}
                      program={program}
                      isSelected={selectedPrograms.includes(program.id)}
                      isFavorite={favoritePrograms.includes(program.id)}
                      onSelect={() => handleProgramSelect(program.id)}
                      onFavorite={() => toggleFavorite(program.id)}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="selected" className="space-y-4 mt-4">
                  {filteredPrograms
                    .filter(program => selectedPrograms.includes(program.id))
                    .map((program) => (
                      <ProgramCard 
                        key={program.id}
                        program={program}
                        isSelected={true}
                        isFavorite={favoritePrograms.includes(program.id)}
                        onSelect={() => handleProgramSelect(program.id)}
                        onFavorite={() => toggleFavorite(program.id)}
                      />
                    ))}
                  
                  {selectedPrograms.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No programs selected yet. Click the checkbox to select programs.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="favorites" className="space-y-4 mt-4">
                  {filteredPrograms
                    .filter(program => favoritePrograms.includes(program.id))
                    .map((program) => (
                      <ProgramCard 
                        key={program.id}
                        program={program}
                        isSelected={selectedPrograms.includes(program.id)}
                        isFavorite={true}
                        onSelect={() => handleProgramSelect(program.id)}
                        onFavorite={() => toggleFavorite(program.id)}
                      />
                    ))}
                  
                  {favoritePrograms.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No favorite programs yet. Click the heart icon to add favorites.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {filteredPrograms.length > 0 && (
            <div className="flex justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                {selectedPrograms.length} of {filteredPrograms.length} programs selected
              </p>
              <Button 
                onClick={handleSubmit} 
                disabled={selectedPrograms.length === 0}
              >
                Submit Selection
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {step < 4 && (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

interface ProgramCardProps {
  program: Program;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onFavorite: () => void;
}

const ProgramCard = ({ program, isSelected, isFavorite, onSelect, onFavorite }: ProgramCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? 'border-primary' : ''}`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:p-6 flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{program.name}</h3>
                <p className="text-muted-foreground">{program.university}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={isSelected} 
                  onCheckedChange={onSelect}
                  className="h-5 w-5"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={(e) => {
                    e.preventDefault();
                    onFavorite();
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">{program.type}</Badge>
              <Badge variant="secondary">{program.location}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{program.duration}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Deadline: {new Date(program.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{program.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{program.tuition}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <p className="text-sm line-clamp-2">{program.description}</p>
              <Button variant="link" className="p-0 h-auto">View Details</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
