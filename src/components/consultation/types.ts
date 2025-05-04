
export interface FormData {
  studyLevel: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma";
  subjects: string[];
  location: string;
  duration: string;
  budget: string;
  startDate: string;
  language: string;
  specialRequirements: string;
  scholarshipRequired: boolean;
  religiousFacilities: boolean;
  halalFood: boolean;
  languageTestRequired: boolean;
}

export interface Program {
  id: string;
  name: string;
  university?: string;
  field?: string;
  city?: string;
  country?: string;
  location?: string; // Added for compatibility
  tuition_min?: number;
  tuition_max?: number;
  tuition?: number; // Added for compatibility
  duration_months?: number;
  duration?: string; // Added for compatibility
  study_level?: string;
  program_language?: string;
  language?: string;
  hasScholarship?: boolean;
  hasReligiousFacilities?: boolean;
  hasHalalFood?: boolean;
  status?: string;
  matchScore?: number;
  matchDetails?: any;
  type?: string; // Added for compatibility
  featured?: boolean; // Added for compatibility
  deadline?: string; // Added for compatibility
  application_deadline?: string;
}

