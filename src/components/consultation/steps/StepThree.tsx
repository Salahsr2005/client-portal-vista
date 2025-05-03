
import React from 'react';
import { motion } from 'framer-motion';
import { Euro, Info } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormData } from '../types';

interface StepThreeProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  languageOptions: { value: string; label: string }[];
  budgetOptions: { value: string; label: string }[];
  formatBudget: (budget: string) => string;
}

export const StepThree: React.FC<StepThreeProps> = ({ 
  formData, 
  setFormData,
  languageOptions,
  budgetOptions,
  formatBudget
}) => {
  return (
    <motion.div 
      key="step3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold">Additional Preferences</h2>
      <p className="text-muted-foreground">Help us narrow down programs that match your needs</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Label htmlFor="location">Preferred Location</Label>
          <Select 
            value={formData.location} 
            onValueChange={(value) => setFormData({...formData, location: value})}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Location</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
              <SelectItem value="Italy">Italy</SelectItem>
              <SelectItem value="Netherlands">Netherlands</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Label htmlFor="language">Preferred Language</Label>
          <Select 
            value={formData.language} 
            onValueChange={(value) => setFormData({...formData, language: value})}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Label htmlFor="duration">Program Duration</Label>
          <Select 
            value={formData.duration} 
            onValueChange={(value) => setFormData({...formData, duration: value})}
          >
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preparatory">Preparatory Program (6-12 months)</SelectItem>
              <SelectItem value="full_degree">Full Degree Program (2+ years)</SelectItem>
              <SelectItem value="12">Up to 1 year</SelectItem>
              <SelectItem value="24">1-2 years</SelectItem>
              <SelectItem value="36">2-3 years</SelectItem>
              <SelectItem value="48">3+ years</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Label htmlFor="budget">Budget (Annual in EUR)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData({...formData, budget: value})}
                  >
                    <SelectTrigger id="budget" className="flex-1">
                      <SelectValue placeholder="Select budget range">
                        {formData.budget ? (
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 mr-1" />
                            {formatBudget(formData.budget)}
                          </div>
                        ) : (
                          "Select budget range"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p>This budget should include tuition and estimated living expenses for one academic year.</p>
                {formData.budget && (
                  <p className="mt-2">
                    Equivalent in DZD: {(parseInt(formData.budget) * 250).toLocaleString()} DZD
                    <br /><span className="text-xs text-muted-foreground">1 EUR = 250 DZD</span>
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Label htmlFor="startDate">Preferred Start Date</Label>
          <Select 
            value={formData.startDate} 
            onValueChange={(value) => setFormData({...formData, startDate: value})}
          >
            <SelectTrigger id="startDate">
              <SelectValue placeholder="Select start date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fall 2025">Fall 2025</SelectItem>
              <SelectItem value="Spring 2026">Spring 2026</SelectItem>
              <SelectItem value="Fall 2026">Fall 2026</SelectItem>
              <SelectItem value="Spring 2027">Spring 2027</SelectItem>
              <SelectItem value="Flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Label>Additional Requirements</Label>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="scholarshipRequired" 
              checked={formData.scholarshipRequired}
              onCheckedChange={(checked) => setFormData({...formData, scholarshipRequired: !!checked})}
            />
            <label htmlFor="scholarshipRequired">
              Scholarship available
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="religiousFacilities" 
              checked={formData.religiousFacilities}
              onCheckedChange={(checked) => setFormData({...formData, religiousFacilities: !!checked})}
            />
            <label htmlFor="religiousFacilities">
              Religious facilities available
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="halalFood" 
              checked={formData.halalFood}
              onCheckedChange={(checked) => setFormData({...formData, halalFood: !!checked})}
            />
            <label htmlFor="halalFood">
              Halal food options
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="languageTestRequired" 
              checked={formData.languageTestRequired}
              onCheckedChange={(checked) => setFormData({...formData, languageTestRequired: !!checked})}
            />
            <label htmlFor="languageTestRequired">
              Language test required
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Check this if you prefer programs that require language tests like IELTS, TOEFL, etc.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
        <Textarea 
          id="specialRequirements" 
          placeholder="Any additional information that might help us find the right program for you"
          value={formData.specialRequirements}
          onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
          className="min-h-[100px]"
        />
      </motion.div>
    </motion.div>
  );
};
