
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { consultationTypes, ConsultationType } from './ConsultationTypes';
import consultationQuestions, { ConsultationSection, Question } from './ConsultationQuestions';
import { usePrograms } from '@/hooks/usePrograms';

const ConsultationFlow: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'type' | 'questions' | 'results'>('type');
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  
  const { data: allPrograms, isLoading: programsLoading } = usePrograms();
  
  // Get the sections for the selected consultation type
  const sections = selectedType ? 
    (consultationQuestions[selectedType.id as keyof typeof consultationQuestions] || []) : [];
  
  // Current section being displayed
  const currentSection = sections[currentSectionIndex];
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (step === 'type') return 0;
    if (step === 'results') return 100;
    return ((currentSectionIndex + 1) / sections.length) * 100;
  };
  
  // Handle selection of consultation type
  const handleTypeSelect = (type: ConsultationType) => {
    setSelectedType(type);
    setStep('questions');
    // Reset answers when changing type
    setAnswers({});
    setCurrentSectionIndex(0);
  };
  
  // Handle answer changes for different question types
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Check if can proceed to next section
  const canProceedToNext = () => {
    // If no current section, can't proceed
    if (!currentSection) return false;
    
    // Check if all required questions are answered
    for (const question of currentSection.questions) {
      if (question.required && 
         (answers[question.id] === undefined || 
          answers[question.id] === null || 
          (Array.isArray(answers[question.id]) && answers[question.id].length === 0))) {
        return false;
      }
    }
    return true;
  };
  
  // Handle next section navigation
  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      // Submit answers and show results
      handleSubmit();
    }
  };
  
  // Handle previous section navigation
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    } else {
      // Go back to consultation type selection
      setStep('type');
    }
  };
  
  // Generate results based on answers
  const generateResults = () => {
    // This would normally call an API with the answers to get personalized results
    // For now, we'll simulate by filtering the available programs
    
    if (!allPrograms || allPrograms.length === 0) {
      return [];
    }
    
    // Basic filtering logic based on common fields
    const studyLevel = answers['study-level'];
    const studyField = answers['study-field'];
    const budget = answers['budget'];
    const language = answers['language-preference'];
    
    let filtered = [...allPrograms];
    
    // Filter by study level if selected
    if (studyLevel) {
      const levelMap: Record<string, string> = {
        'bachelor': 'Bachelor',
        'master': 'Master',
        'phd': 'PhD',
        'certificate': 'Certificate'
      };
      
      if (levelMap[studyLevel]) {
        filtered = filtered.filter(p => 
          p.type?.toLowerCase().includes(levelMap[studyLevel]?.toLowerCase() || '')
        );
      }
    }
    
    // Filter by field if selected
    if (studyField && studyField !== 'any') {
      filtered = filtered.filter(p => {
        if (!p.field_keywords) return false;
        const field = studyField.toLowerCase();
        return p.field_keywords.some((k: string) => k.toLowerCase().includes(field));
      });
    }
    
    // Sort by match score (would normally be calculated by backend)
    filtered.forEach(p => {
      // Simple scoring algorithm
      let score = 0;
      
      // Preferred language match
      if (language && p.program_language && 
          p.program_language.toLowerCase() === language.toLowerCase()) {
        score += 30;
      } else if (language === 'any' || language === 'english') {
        score += 15;
      }
      
      // Budget match
      if (budget) {
        const budgetRanges: Record<string, [number, number]> = {
          'under_5000': [0, 5000],
          '5000_10000': [5000, 10000],
          '10000_15000': [10000, 15000],
          '15000_20000': [15000, 20000],
          '20000_30000': [20000, 30000],
          'above_30000': [30000, 1000000]
        };
        
        const [min, max] = budgetRanges[budget] || [0, 1000000];
        const totalCost = (p.tuition_min || 0) + ((p.living_cost_min || 0) * 12);
        
        if (totalCost <= max && totalCost >= min) {
          score += 25;
        } else if (totalCost <= max * 1.2) {
          score += 15;
        }
      }
      
      // Add match score
      p.matchScore = score;
    });
    
    return filtered
      .filter(p => (p.matchScore || 0) > 10) // Filter out low matches
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)) // Sort by score
      .slice(0, 5); // Top 5 results
  };
  
  // Handle submission of all answers
  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = generateResults();
      setResults(results);
      setStep('results');
      setLoading(false);
      
      toast({
        title: "Consultation complete!",
        description: `We've found ${results.length} programs that match your preferences.`,
      });
    }, 1500);
  };
  
  // Render appropriate question input based on type
  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case 'single':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={value => handleAnswerChange(question.id, value)}
            className="space-y-2 mt-2"
          >
            {question.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'multi':
        return (
          <div className="space-y-2 mt-2">
            {question.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  checked={(answers[question.id] || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = answers[question.id] || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleAnswerChange(question.id, newValues);
                  }}
                />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
        
      case 'boolean':
        return (
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id={question.id}
              checked={answers[question.id] || false}
              onCheckedChange={checked => handleAnswerChange(question.id, checked)}
            />
            <Label htmlFor={question.id}>Yes</Label>
          </div>
        );
        
      case 'text':
        return (
          <Textarea
            id={question.id}
            value={answers[question.id] || ''}
            onChange={e => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="mt-2"
          />
        );
        
      case 'range':
        return (
          <div className="mt-4">
            <Slider
              defaultValue={[answers[question.id] || question.min || 0]}
              min={question.min || 0}
              max={question.max || 100}
              step={question.step || 1}
              onValueChange={value => handleAnswerChange(question.id, value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{question.min || 0}</span>
              <span>{question.max || 100}</span>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render consultation type selection
  const renderTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Select Consultation Type</h1>
        <p className="text-muted-foreground mt-2">
          Choose the type of consultation that best fits your needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {consultationTypes.map((type) => (
          <Card 
            key={type.id} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedType?.id === type.id ? 'border-primary' : ''
            }`}
            onClick={() => handleTypeSelect(type)}
          >
            <CardHeader className="pb-2">
              <div className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${type.color}`}>
                {type.icon}
              </div>
              <CardTitle className="mt-2 text-lg">{type.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{type.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  // Render questions for current section
  const renderQuestions = () => {
    if (!currentSection) return null;
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{currentSection.title}</h2>
          <p className="text-muted-foreground mt-1">{currentSection.description}</p>
        </div>
        
        <div className="space-y-8 mt-6">
          {currentSection.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label 
                htmlFor={question.id} 
                className="text-base font-medium flex items-center"
              >
                {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderQuestionInput(question)}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between pt-4 mt-8">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={!canProceedToNext()}
          >
            {currentSectionIndex < sections.length - 1 ? 'Continue' : 'Get Results'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render results
  const renderResults = () => {
    if (loading) {
      return (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium mt-4">Finding your perfect matches...</p>
          <p className="text-muted-foreground">This will just take a moment</p>
        </div>
      );
    }
    
    if (!results || results.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold">No matches found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn't find any programs that match your specific preferences.
          </p>
          <Button className="mt-6" onClick={() => setStep('questions')}>
            Adjust Your Preferences
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-block bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-2.5 rounded-full mb-4">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Your Personalized Recommendations</h2>
          <p className="text-muted-foreground mt-2">
            Based on your preferences, here are the top matches for you
          </p>
        </div>
        
        <div className="space-y-4">
          {results.map((program, index) => (
            <Card key={program.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 bg-muted flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{(program.matchScore || 0)}%</div>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                  </div>
                </div>
                
                <CardContent className="w-full md:w-3/4 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {program.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {program.university}, {program.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <Badge variant="outline">{program.type}</Badge>
                        <Badge variant="outline">{program.duration}</Badge>
                        <Badge variant="outline">{program.tuition}</Badge>
                      </div>
                    </div>
                    
                    <Button size="sm" asChild>
                      <a href={`/programs/${program.id}`} target="_blank">View Details</a>
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm">
                      <div className="font-medium mb-1">Why this is a good match:</div>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {program.program_language && answers['language-preference'] && (
                          <li>
                            {program.program_language === answers['language-preference'] 
                              ? `This program is taught in your preferred language (${program.program_language})`
                              : `The university offers courses in your preferred language`}
                          </li>
                        )}
                        {answers['study-level'] && (
                          <li>Matches your desired study level</li>
                        )}
                        {answers['budget'] && (
                          <li>{program.tuition} is within your budget range</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Want to explore more options or refine your search?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => setStep('questions')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Adjust Preferences
            </Button>
            <Button asChild>
              <a href="/programs">
                Browse All Programs
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container max-w-4xl mx-auto">
      <Card className="w-full">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-full ${
              selectedType?.color || 'bg-primary/10 text-primary'
            }`}>
              {selectedType?.icon || <Sparkles className="h-4 w-4" />}
            </div>
            <CardTitle className="text-lg">
              {selectedType ? `${selectedType.title} Consultation` : 'Program Consultation'}
            </CardTitle>
          </div>
          
          {step !== 'type' && (
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>{step === 'results' ? 'Complete!' : `Section ${currentSectionIndex + 1} of ${sections.length}`}</span>
                <span>{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-1.5" />
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-6">
          {step === 'type' && renderTypeSelection()}
          {step === 'questions' && renderQuestions()}
          {step === 'results' && renderResults()}
        </CardContent>
      </Card>
      
      <div className="mt-8 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="Euro Visa Advisor" />
            <AvatarFallback>EV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm">Need help? <span className="text-primary font-medium">Talk to an advisor</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationFlow;
