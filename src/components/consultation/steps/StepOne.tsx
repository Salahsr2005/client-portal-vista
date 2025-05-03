
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormData } from '../types';

interface StepOneProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  itemVariants: any;
}

export const StepOne: React.FC<StepOneProps> = ({ formData, setFormData, itemVariants }) => {
  return (
    <motion.div 
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">What level of study are you interested in?</h2>
      <p className="text-muted-foreground">Select the academic level you want to pursue</p>
      
      <RadioGroup 
        value={formData.studyLevel} 
        onValueChange={(value: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma") => setFormData({...formData, studyLevel: value})}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
      >
        <motion.div variants={itemVariants} initial="hidden" animate="show">
          <RadioGroupItem value="Bachelor" id="bachelor" className="peer sr-only" />
          <Label
            htmlFor="bachelor"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 hover:shadow-md"
          >
            <GraduationCap className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <h3 className="font-medium">Bachelor's Degree</h3>
              <p className="text-sm text-muted-foreground">
                Undergraduate programs (3-4 years)
              </p>
            </div>
          </Label>
        </motion.div>
        
        <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
          <RadioGroupItem value="Master" id="master" className="peer sr-only" />
          <Label
            htmlFor="master"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 hover:shadow-md"
          >
            <GraduationCap className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <h3 className="font-medium">Master's Degree</h3>
              <p className="text-sm text-muted-foreground">
                Graduate programs (1-2 years)
              </p>
            </div>
          </Label>
        </motion.div>
        
        <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
          <RadioGroupItem value="PhD" id="phd" className="peer sr-only" />
          <Label
            htmlFor="phd"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 hover:shadow-md"
          >
            <GraduationCap className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <h3 className="font-medium">PhD / Doctorate</h3>
              <p className="text-sm text-muted-foreground">
                Advanced research degrees (3+ years)
              </p>
            </div>
          </Label>
        </motion.div>
        
        <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
          <RadioGroupItem value="Certificate" id="certificate" className="peer sr-only" />
          <Label
            htmlFor="certificate"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200 hover:shadow-md"
          >
            <BookOpen className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <h3 className="font-medium">Certificate / Diploma</h3>
              <p className="text-sm text-muted-foreground">
                Short-term professional qualifications
              </p>
            </div>
          </Label>
        </motion.div>
      </RadioGroup>
    </motion.div>
  );
};
