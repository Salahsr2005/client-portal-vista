
import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from '../types';

interface StepTwoProps {
  formData: FormData;
  handleSubjectToggle: (subject: string) => void;
  subjectAreas: string[];
  containerVariants: any;
  itemVariants: any;
}

export const StepTwo: React.FC<StepTwoProps> = ({ 
  formData, 
  handleSubjectToggle, 
  subjectAreas,
  containerVariants,
  itemVariants 
}) => {
  return (
    <motion.div 
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">What subjects are you interested in studying?</h2>
      <p className="text-muted-foreground">Select all that apply</p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {subjectAreas.map((subject, index) => (
          <motion.div 
            key={subject} 
            className="flex items-center space-x-2"
            variants={itemVariants}
            transition={{ delay: index * 0.05 }}
          >
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
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
