
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
}

export interface Program {
  id: string;
  name: string;
  university: string;
  country: string;
  city: string;
  study_level: "Bachelor" | "Master" | "PhD" | "Certificate" | "Diploma";
  field: string;
  field_keywords?: string[];
  duration_months?: number;
  program_language: string;
  secondary_language?: string;
  tuition_min: number;
  tuition_max: number;
  living_cost_min?: number;
  living_cost_max?: number;
  description: string;
  image_url?: string;
  status: "Active" | "Closed" | "Coming Soon";
  ranking?: number;
  application_deadline?: string;
  scholarship_available?: boolean;
  location?: string;
  duration?: string;
  matchScore?: number;
  deadlinePassed?: boolean;
  isFavorite?: boolean;
  hasScholarship?: boolean;
  hasReligiousFacilities?: boolean;
  hasHalalFood?: boolean;
  religious_facilities?: boolean;
  halal_food_availability?: boolean;
}
