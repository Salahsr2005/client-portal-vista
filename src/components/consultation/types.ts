
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
