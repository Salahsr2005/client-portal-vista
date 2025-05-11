
export interface Program {
  id: string;
  name: string;
  university: string;
  city?: string;
  country?: string;
  location?: string;
  description?: string;
  study_level?: string;
  field?: string;
  tuition_min: number;
  tuition_max: number;
  living_cost_min?: number;
  living_cost_max?: number;
  housing_cost_min?: number;
  housing_cost_max?: number;
  duration_months?: number;
  field_keywords?: string[];
  program_language?: string;
  secondary_language?: string;
  scholarship_available?: boolean;
  religious_facilities?: boolean;
  halal_food_availability?: boolean;
  application_deadline?: string;
  image_url?: string;
  status?: string;
  application_fee?: number;
  visa_fee?: number;
  scholarship_details?: string;
  
  // Computed properties
  hasScholarship?: boolean;
  hasHalalFood?: boolean;
  hasReligiousFacilities?: boolean;
  deadlinePassed?: boolean;
}
