
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { usePrograms } from "@/hooks/usePrograms";
import { FormData } from '../types';

interface StepThreeProps {
  formData: FormData;
  updateForm: (key: keyof FormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const StepThree: React.FC<StepThreeProps> = ({ 
  formData, 
  updateForm, 
  onNext, 
  onBack,
  isSubmitting 
}) => {
  const [date, setDate] = useState<Date | undefined>(
    formData.startDate ? new Date(formData.startDate) : undefined
  );

  const budget = Number(formData.budget) || 0;

  // Fetch sample programs based on form data to show preview
  const { data: programs, isLoading } = usePrograms({
    studyLevel: formData.level,
    subjects: formData.subjects || [formData.subject || ''],
    location: formData.destination,
    budget: formData.budget?.toString(),
    language: formData.language,
    limit: 3, // Just fetch a few for preview
  });

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      updateForm('startDate', date.toISOString());
    }
  };
  
  const handleSwitchChange = (key: 'religiousFacilities' | 'halalFood' | 'scholarshipRequired', checked: boolean) => {
    // Update formData.specialRequirements
    updateForm('specialRequirements', {
      ...formData.specialRequirements,
      [key]: checked,
    });
    
    // Also update the top-level properties for compatibility
    updateForm(key, checked);
  };

  const formatBudget = (amount: string | number) => {
    if (!amount) return "€0";
    const numericAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    return `€${numericAmount.toLocaleString()}`;
  };
  
  const formatCost = (program: any) => {
    const min = program.tuition_min || 0;
    const max = program.tuition_max || min;
    
    if (min === max) {
      return `€${min.toLocaleString()}`;
    }
    
    return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Final Details</h2>
      
      <div className="space-y-8">
        {/* Budget Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Budget Range</h3>
          <p className="text-muted-foreground mb-4">
            Your selected budget is {formatBudget(formData.budget)}
          </p>
        </div>
        
        <Separator />
        
        {/* Special Requirements */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Special Requirements</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="religious-facilities" className="text-base font-medium">Religious Facilities</Label>
                <p className="text-sm text-muted-foreground">Need access to prayer rooms or places of worship</p>
              </div>
              <Switch 
                id="religious-facilities" 
                checked={formData.specialRequirements?.religiousFacilities || formData.religiousFacilities || false} 
                onCheckedChange={(checked) => handleSwitchChange('religiousFacilities', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="halal-food" className="text-base font-medium">Halal Food Options</Label>
                <p className="text-sm text-muted-foreground">Require halal food availability</p>
              </div>
              <Switch 
                id="halal-food" 
                checked={formData.specialRequirements?.halalFood || formData.halalFood || false} 
                onCheckedChange={(checked) => handleSwitchChange('halalFood', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="scholarship" className="text-base font-medium">Scholarship Required</Label>
                <p className="text-sm text-muted-foreground">Need financial assistance with tuition</p>
              </div>
              <Switch 
                id="scholarship" 
                checked={formData.specialRequirements?.scholarshipRequired || formData.scholarshipRequired || false} 
                onCheckedChange={(checked) => handleSwitchChange('scholarshipRequired', checked)}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Preferred Start Date */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Preferred Start Date</h3>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          
          <p className="text-sm text-muted-foreground mt-2">
            Select your preferred program start date (optional)
          </p>
        </div>
        
        <Separator />
        
        {/* Additional Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
          
          <Textarea
            placeholder="Any additional requirements or information you'd like to share..."
            className="min-h-[120px]"
          />
        </div>
        
        {/* Preview Based on Selections */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Based on your preferences</h3>
          
          {isLoading ? (
            <p>Loading preview...</p>
          ) : programs && programs.length > 0 ? (
            <div className="space-y-3">
              {programs.slice(0, 3).map((program) => (
                <div key={program.id} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{program.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {program.university} • {formatCost(program)}
                    </p>
                  </div>
                </div>
              ))}
              <p className="text-sm text-muted-foreground italic">
                {programs.length > 3 ? `+ ${programs.length - 3} more programs match your criteria` : ''}
              </p>
            </div>
          ) : (
            <p>No matching programs found. Consider adjusting your criteria.</p>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            onClick={onBack}
            variant="outline"
          >
            Back
          </Button>
          <Button 
            type="button" 
            onClick={onNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "View Matching Programs"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
