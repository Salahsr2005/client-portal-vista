
import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from "@/components/ui/checkbox";
import { FormData, StepTwoProps } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const StepTwo: React.FC<StepTwoProps> = ({ 
  formData, 
  updateForm, 
  onNext,
  onBack
}) => {
  const subjectAreas = [
    "Business Administration",
    "Computer Science",
    "Engineering",
    "Medicine",
    "Law",
    "Arts and Humanities",
    "Social Sciences",
    "Natural Sciences",
    "Mathematics",
    "Education",
    "Architecture",
    "Economics",
    "Finance",
    "Marketing",
    "Psychology",
    "Biology",
    "Chemistry",
    "Physics",
    "Political Science",
    "Sociology"
  ];

  const handleSubjectToggle = (subject: string) => {
    const updatedSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    
    updateForm('subjects', updatedSubjects);
  };

  return (
    <motion.div 
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-6"
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

      <div className="flex justify-between pt-6">
        <button
          type="button"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-50"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};
