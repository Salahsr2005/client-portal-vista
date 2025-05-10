
// Add missing types to resolve errors
export interface FormData {
  level?: string;
  subject?: string;
  subjects?: string[];
  studyLevel?: string;
  budget?: string | number;
  destination?: string;
  location?: string;
  duration?: string;
  language?: string;
  scholarshipRequired?: boolean;
  religiousFacilities?: boolean;
  halalFood?: boolean;
  languageTestRequired?: boolean;
  specialRequirements?: {
    religiousFacilities: boolean;
    halalFood: boolean;
    scholarshipRequired: boolean;
  };
  startDate?: string;
}

// Add Program interface that was missing
export interface Program {
  id: string;
  name: string;
  university: string;
  field: string;
  study_level: string;
  program_language: string;
  secondary_language?: string;
  country: string;
  city?: string;
  duration_months?: number;
  tuition_min: number;
  tuition_max?: number;
  living_cost_min: number;
  living_cost_max?: number;
  housing_cost_min?: number;
  housing_cost_max?: number;
  application_fee?: number;
  visa_fee?: number;
  scholarship_available: boolean;
  religious_facilities: boolean;
  halal_food_availability: boolean;
  application_deadline?: string;
  start_date?: string;
  description?: string;
  requirements?: string;
  image_url?: string;
  status?: string;
  featured?: boolean;
  field_keywords?: string[];
  
  // Compatibility fields
  location?: string;
  duration?: string;
  tuition?: number;
  type?: string;
  deadline?: string;
  hasScholarship?: boolean;
  hasReligiousFacilities?: boolean;
  hasHalalFood?: boolean;
  
  // Match fields
  matchScore?: number;
  matchDetails?: string[];
  deadlinePassed?: boolean;
}
