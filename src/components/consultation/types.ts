
// Define FormData interface for consultation flow
export interface FormData {
  level: string;
  subject: string;
  subjects: string[];
  budget: string | number;
  destination: string;
  location: string;
  duration: string;
  language: string;
  scholarshipRequired: boolean;
  religiousFacilities: boolean;
  halalFood: boolean;
  specialRequirements: {
    religiousFacilities: boolean;
    halalFood: boolean;
    scholarshipRequired: boolean;
  };
  startDate: string;
  studyLevel?: string; // Added to fix type errors
}

// Define StepOneProps interface
export interface StepOneProps {
  formData: FormData;
  updateForm: (key: keyof FormData, value: any) => void;
  onNext: () => void;
}

// Define StepTwoProps interface
export interface StepTwoProps {
  formData: FormData;
  updateForm: (key: keyof FormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// Define StepThreeProps interface
export interface StepThreeProps {
  formData: FormData;
  updateForm: (key: keyof FormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

// Define ResultsProps interface
export interface ResultsProps {
  formData: FormData;
}
