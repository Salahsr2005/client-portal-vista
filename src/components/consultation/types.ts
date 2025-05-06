
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
  program_language?: string;
  featured?: boolean;
  
  // Adding other fields from database
  academic_requirements?: string;
  admission_requirements?: string;
  advantages?: string;
  application_fee?: number;
  application_process?: string;
  available_places?: number;
  duration_months?: number;
  employment_rate?: number;
  exchange_opportunities?: boolean;
  field_keywords?: string[];
  gpa_requirement?: number;
  housing_availability?: string;
  housing_cost_max?: number;
  housing_cost_min?: number;
  internship_opportunities?: boolean;
  language_requirement?: string;
  language_test?: string;
  language_test_exemptions?: string;
  language_test_score?: string;
  living_cost_max?: number;
  living_cost_min?: number;
  north_african_community_size?: string;
  ranking?: number;
  scholarship_amount?: number;
  scholarship_deadline?: string;
  scholarship_details?: string;
  scholarship_requirements?: string;
  secondary_language?: string;
  status?: string;
  success_rate?: number;
  total_places?: number;
  video_url?: string;
  virtual_tour_url?: string;
  visa_fee?: number;
}
