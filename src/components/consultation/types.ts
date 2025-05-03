
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
  location?: string;
  country?: string;
  tuition?: number;
  duration?: string;
  studyLevel?: string;
  language?: string;
  hasScholarship?: boolean;
  hasReligiousFacilities?: boolean;
  hasHalalFood?: boolean;
  status?: string;
  matchScore?: number;
  matchDetails?: any;
}
