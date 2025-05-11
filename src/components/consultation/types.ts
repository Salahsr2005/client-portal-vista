
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
  studyLevel?: string;
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

// Define Program interface to fix import error in ProgramCard
export interface Program {
  id: string;
  name: string;
  university: string;
  country: string;
  city: string;
  study_level: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma";
  field: string;
  field_keywords: string[];
  duration_months: number;
  program_language: string;
  secondary_language: string;
  tuition_min: number;
  tuition_max: number;
  living_cost_min: number;
  living_cost_max: number;
  description: string;
  image_url: string;
  status: string;
  ranking?: number;
  application_deadline?: string;
  scholarship_available?: boolean;
  location?: string;
  duration?: string;
  matchScore?: number;
  isFavorite?: boolean;
  religious_facilities?: boolean;
  halal_food_availability?: boolean;
  deadlinePassed?: boolean;
  hasScholarship?: boolean;
  hasReligiousFacilities?: boolean;
  hasHalalFood?: boolean;
}
