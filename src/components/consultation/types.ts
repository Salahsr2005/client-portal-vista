// Update or add the appropriate types for your project
// This is a placeholder based on how the Program type is likely defined

export interface Program {
  id: string;
  name: string;
  university: string;
  description?: string;
  location: string;
  country?: string;
  city?: string;
  duration: string;
  duration_months?: number;
  type: string;
  study_level?: string;
  tuition: number;
  tuition_min?: number;
  tuition_max?: number;
  deadline?: string;
  application_deadline?: string;
  field?: string;
  field_keywords?: string[];
  image_url?: string;
  website_url?: string;
  program_language?: string;
  secondary_language?: string;
  hasScholarship?: boolean;
  scholarship_available?: boolean;
  hasReligiousFacilities?: boolean;
  religious_facilities?: boolean;
  hasHalalFood?: boolean;
  halal_food_availability?: boolean;
  matchScore?: number;
  matchDetails?: string;
  featured?: boolean;
  deadlinePassed?: boolean;
}

export interface ApplicationStatus {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export interface ConsultationResults {
  programs?: Program[];
  personalizedAdvice?: string;
  matchScore?: number;
  applicationStatus?: ApplicationStatus;
}
