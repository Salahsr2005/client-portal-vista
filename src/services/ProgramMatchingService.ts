
import { formatCurrency } from "@/utils/databaseHelpers";

// Function to calculate the match score between a program and user preferences
export const calculateMatchScore = (program: any, preferences: any) => {
  let score = 0;
  
  // Match on field of study (highest weight)
  if (preferences.field && program.field === preferences.field) {
    score += 30;
  } else if (preferences.field && program.field_keywords && 
             program.field_keywords.some((k: string) => 
               preferences.field.toLowerCase().includes(k.toLowerCase()))) {
    score += 20;
  }
  
  // Match on study level
  if (preferences.level && program.study_level === preferences.level) {
    score += 25;
  }
  
  // Match on budget constraints
  const programCost = (program.tuition_min + program.living_cost_min) || 0;
  if (preferences.budget && programCost <= preferences.budget) {
    score += 20;
  } else if (preferences.budget && programCost <= preferences.budget * 1.2) {
    // Within 20% of budget
    score += 10;
  }
  
  // Match on language
  if (preferences.language && 
     (program.program_language === preferences.language || 
      program.secondary_language === preferences.language)) {
    score += 15;
  }
  
  // Match on country/destination
  if (preferences.destination && program.country === preferences.destination) {
    score += 10;
  }
  
  // Extra points for special requirements matches
  if (preferences.religious_facilities && program.religious_facilities) {
    score += 5;
  }
  
  if (preferences.halal_food && program.halal_food_availability) {
    score += 5;
  }
  
  if (preferences.scholarship && program.scholarship_available) {
    score += 10;
  }

  return Math.min(score, 100); // Cap at 100%
};

// Add missing exports
export const getMatchExplanation = (program: any, preferences: any) => {
  const reasons = [];
  
  if (preferences.field && program.field === preferences.field) {
    reasons.push(`Exact match for your preferred field of study: ${program.field}`);
  }
  
  if (preferences.level && program.study_level === preferences.level) {
    reasons.push(`Perfect match for your preferred study level: ${program.study_level}`);
  }
  
  const programCost = (program.tuition_min + program.living_cost_min) || 0;
  if (preferences.budget && programCost <= preferences.budget) {
    reasons.push(`Within your budget of ${formatCurrency(preferences.budget)}`);
  }
  
  if (preferences.language && program.program_language === preferences.language) {
    reasons.push(`Program taught in your preferred language: ${program.program_language}`);
  }
  
  if (preferences.destination && program.country === preferences.destination) {
    reasons.push(`Located in your preferred destination: ${program.country}`);
  }
  
  if (preferences.religious_facilities && program.religious_facilities) {
    reasons.push('Religious facilities available as requested');
  }
  
  if (preferences.halal_food && program.halal_food_availability) {
    reasons.push('Halal food options available as requested');
  }
  
  if (preferences.scholarship && program.scholarship_available) {
    reasons.push('Scholarship opportunities available');
  }
  
  return reasons;
};

export const getBudgetBreakdown = (program: any) => {
  return {
    tuition: {
      min: program.tuition_min || 0,
      max: program.tuition_max || program.tuition_min || 0,
    },
    living: {
      min: program.living_cost_min || 0,
      max: program.living_cost_max || program.living_cost_min || 0,
    },
    housing: {
      min: program.housing_cost_min || 0,
      max: program.housing_cost_max || program.housing_cost_min || 0,
    },
    applicationFee: program.application_fee || 0,
    visaFee: program.visa_fee || 0,
    total: {
      min: (program.tuition_min || 0) + 
           (program.living_cost_min || 0) + 
           (program.housing_cost_min || 0) + 
           (program.application_fee || 0) + 
           (program.visa_fee || 0),
      max: (program.tuition_max || program.tuition_min || 0) + 
           (program.living_cost_max || program.living_cost_min || 0) + 
           (program.housing_cost_max || program.housing_cost_min || 0) + 
           (program.application_fee || 0) + 
           (program.visa_fee || 0),
    }
  };
};
