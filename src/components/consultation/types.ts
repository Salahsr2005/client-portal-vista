
export interface Program {
  id: string;
  name: string;
  university: string;
  city: string;
  country: string;
  program_language: string;
  field: string;
  study_level: string;
  duration_months: number;
  tuition_min: number;
  tuition_max: number;
  living_cost_min: number;
  living_cost_max: number;
  image_url?: string;
  description?: string;
  matchScore?: number;
  deadlinePassed?: boolean;
}

export interface FormData {
  studyLevel: string;
  subjects: string[];
  location: string;
  duration: string;
  budget: string;
  language: string;
  startDate: string;
  specialRequirements: string;
  scholarshipRequired: boolean;
  religiousFacilities: boolean;
  halalFood: boolean;
  languageTestRequired: boolean;
}
