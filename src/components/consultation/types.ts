
// Add missing types to resolve errors
export interface FormData {
  level?: string;
  subject?: string;
  budget?: string | number;
  destination?: string;
  duration?: string;
  language?: string;
  specialRequirements?: {
    religiousFacilities: boolean;
    halalFood: boolean;
    scholarshipRequired: boolean;
  };
  startDate?: string;
}
