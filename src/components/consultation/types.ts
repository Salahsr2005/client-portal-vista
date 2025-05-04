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
  university: string;
  description: string;
  field?: string;
  study_level?: string;
  country?: string;
  city?: string;
  location: string; 
  duration: string;
  tuition: number;
  tuition_min?: number;
  tuition_max?: number;
  type: string;
  deadline: string;
  application_deadline?: string;
  matchScore?: number;
  matchDetails?: any;
  image_url?: string;
  website_url?: string;
  hasScholarship?: boolean;
  hasReligiousFacilities?: boolean;
  hasHalalFood?: boolean;
  scholarship_available?: boolean;
  religious_facilities?: boolean;
  halal_food_availability?: boolean;
}
