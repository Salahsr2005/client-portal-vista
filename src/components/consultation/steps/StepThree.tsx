
import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock, Euro, Home, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FormData } from "../types";

// Define interfaces
interface StepThreeProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  languageOptions: { value: string; label: string }[];
  budgetOptions: { value: string; label: string }[];
  formatBudget: (budget: string) => string;
}

export const StepThree = ({
  formData,
  setFormData,
  languageOptions,
  budgetOptions,
  formatBudget
}: StepThreeProps) => {
  const [date, setDate] = useState<Date | undefined>(
    formData.startDate ? new Date(formData.startDate) : undefined
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Handle budget selection
  const handleBudgetChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      budget: value
    }));
  };

  // Handle location selection
  const handleLocationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: value
    }));
  };

  // Handle language selection
  const handleLanguageChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      language: value
    }));
  };

  // Handle duration selection
  const handleDurationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      duration: value
    }));
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        startDate: selectedDate.toISOString()
      }));
    }
  };

  // Handle special requirements
  const handleSpecialRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: e.target.value
    }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-4">Preferences and Requirements</h2>
        <p className="text-muted-foreground mb-6">
          Tell us about your location preferences, budget, and other requirements
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Location Preference */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <Label>Destination Preference</Label>
            </div>
            <Select 
              value={formData.location} 
              onValueChange={handleLocationChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Location</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="spain">Spain</SelectItem>
                <SelectItem value="italy">Italy</SelectItem>
                <SelectItem value="belgium">Belgium</SelectItem>
                <SelectItem value="netherlands">Netherlands</SelectItem>
                <SelectItem value="poland">Poland</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" />
              <Label>Budget Range</Label>
            </div>
            <Select 
              value={formData.budget} 
              onValueChange={handleBudgetChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {budgetOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        {/* Language */}
        <div className="space-y-2">
          <Label>Language of Study</Label>
          <Select 
            value={formData.language} 
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <Label>Duration Preference</Label>
          </div>
          <RadioGroup 
            value={formData.duration} 
            onValueChange={handleDurationChange} 
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="semester" id="semester" />
              <Label htmlFor="semester">Semester</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="year" id="year" />
              <Label htmlFor="year">1 Year</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="two_years" id="two_years" />
              <Label htmlFor="two_years">2 Years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full_program" id="full_program" />
              <Label htmlFor="full_program">Full Program</Label>
            </div>
          </RadioGroup>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <Label>Preferred Start Date</Label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) =>
                date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 2))
              }
            />
          </PopoverContent>
        </Popover>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-lg font-medium">Additional Options</h3>
        <div className="flex items-center space-x-2">
          <Switch 
            id="scholarship" 
            checked={formData.scholarshipRequired}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, scholarshipRequired: checked }))}
          />
          <Label htmlFor="scholarship">I am looking for scholarship opportunities</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="language-test" 
            checked={formData.languageTestRequired}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, languageTestRequired: checked }))}
          />
          <Label htmlFor="language-test">I need language test exemptions</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="religious" 
            checked={formData.religiousFacilities}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, religiousFacilities: checked }))}
          />
          <Label htmlFor="religious">I need access to religious facilities</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="halal" 
            checked={formData.halalFood}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, halalFood: checked }))}
          />
          <Label htmlFor="halal">I require halal food options</Label>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="special-requirements">Special Requirements or Notes</Label>
        <Textarea 
          id="special-requirements"
          placeholder="Tell us about any special requirements or additional information..."
          className="min-h-[100px]"
          value={formData.specialRequirements}
          onChange={handleSpecialRequirementsChange}
        />
      </motion.div>
    </motion.div>
  );
};
