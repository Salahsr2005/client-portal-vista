import { FormData } from '@/components/consultation/types';
import { Program } from '@/hooks/usePrograms';

export interface ProgramMatch {
  program: Program;
  matchScore: number;
  matchDetails: {
    budgetScore: number;
    languageScore: number;
    levelScore: number;
    locationScore: number;
    durationScore: number;
    fieldScore: number;
    scholarshipScore: number;
    culturalScore: number;
  };
}

/**
 * Calculate a match score between user preferences and a program
 */
export const calculateProgramMatch = (program: Program, preferences: FormData): ProgramMatch => {
  // Start with basic scoring
  const matchDetails = {
    budgetScore: 0,
    languageScore: 0,
    levelScore: 0,
    locationScore: 0,
    durationScore: 0,
    fieldScore: 0,
    scholarshipScore: 0,
    culturalScore: 0
  };

  // Budget score (max 30 points)
  const userBudget = typeof preferences.budget === 'string' 
    ? parseInt(preferences.budget, 10) 
    : preferences.budget;
  
  if (userBudget >= (program.tuition_min + program.living_cost_min)) {
    matchDetails.budgetScore = 30;
  } else if (userBudget >= (program.tuition_min + program.living_cost_min) * 0.8) {
    matchDetails.budgetScore = 20;
  } else if (userBudget >= (program.tuition_min + program.living_cost_min) * 0.6) {
    matchDetails.budgetScore = 10;
  } else {
    matchDetails.budgetScore = 5;
  }

  // Language score (max 25 points)
  if (program.program_language.toLowerCase() === preferences.language.toLowerCase()) {
    matchDetails.languageScore = 25;
  } else if (preferences.language === 'any') {
    matchDetails.languageScore = 15;
  } else if ((preferences.language === 'english' && program.program_language === 'English')) {
    matchDetails.languageScore = 20;
  } else if (program.secondary_language?.toLowerCase() === preferences.language.toLowerCase()) {
    matchDetails.languageScore = 15;
  } else {
    matchDetails.languageScore = 5;
  }

  // Study level score (max 20 points)
  if (program.study_level.toLowerCase() === preferences.level.toLowerCase()) {
    matchDetails.levelScore = 20;
  } else {
    matchDetails.levelScore = 5;
  }

  // Country/location score (max 15 points)
  const userLocation = preferences.destination || preferences.location;
  if (program.country.toLowerCase() === userLocation.toLowerCase()) {
    matchDetails.locationScore = 15;
  } else if (userLocation === 'any') {
    matchDetails.locationScore = 10;
  } else {
    matchDetails.locationScore = 5;
  }

  // Duration score (max 5 points)
  // Convert user duration preference to months
  let preferredDurationMonths = 0;
  if (preferences.duration === 'semester') {
    preferredDurationMonths = 6;
  } else if (preferences.duration === 'year') {
    preferredDurationMonths = 12;
  } else if (preferences.duration === 'two_years') {
    preferredDurationMonths = 24;
  } else {
    preferredDurationMonths = 36; // Default to "full program"
  }

  if (Math.abs(program.duration_months - preferredDurationMonths) <= 6) {
    matchDetails.durationScore = 5;
  } else if (Math.abs(program.duration_months - preferredDurationMonths) <= 12) {
    matchDetails.durationScore = 3;
  } else {
    matchDetails.durationScore = 1;
  }

  // Field match score (max 15 points)
  if (preferences.subject === 'any') {
    matchDetails.fieldScore = 8;
  } else if (program.field.toLowerCase() === preferences.subject.toLowerCase()) {
    matchDetails.fieldScore = 15;
  } else if (program.field_keywords?.some(keyword => 
    preferences.subject.toLowerCase().includes(keyword.toLowerCase()))
  ) {
    matchDetails.fieldScore = 12;
  } else if (program.name.toLowerCase().includes(preferences.subject.toLowerCase())) {
    matchDetails.fieldScore = 10;
  } else {
    matchDetails.fieldScore = 5;
  }

  // Scholarship score (max 5 points)
  if (preferences.scholarshipRequired && program.scholarship_available) {
    matchDetails.scholarshipScore = 5;
  } else if (!preferences.scholarshipRequired) {
    matchDetails.scholarshipScore = 5;
  } else {
    matchDetails.scholarshipScore = 0;
  }

  // Cultural accommodations score (max 5 points)
  const needsCulturalAccommodations = preferences.religiousFacilities || preferences.halalFood;
  if ((preferences.religiousFacilities && program.religious_facilities) ||
      (preferences.halalFood && program.halal_food_availability)) {
    matchDetails.culturalScore = 5;
  } else if (!needsCulturalAccommodations) {
    matchDetails.culturalScore = 5;
  } else {
    matchDetails.culturalScore = 0;
  }

  // Calculate total score
  const matchScore = Object.values(matchDetails).reduce((sum, score) => sum + score, 0);

  return {
    program,
    matchScore,
    matchDetails
  };
};

/**
 * Get explanation for a program match
 */
export const getMatchExplanation = (match: ProgramMatch): string => {
  const { program, matchScore, matchDetails } = match;
  const maxScore = 120; // Sum of all max scores
  
  let explanation = `Match score: ${matchScore}/${maxScore}\n\n`;
  
  // Budget compatibility
  explanation += `• Budget compatibility: ${matchDetails.budgetScore}/30 points\n`;
  if (matchDetails.budgetScore >= 25) {
    explanation += '  Your budget fully covers tuition and living expenses.\n';
  } else if (matchDetails.budgetScore >= 15) {
    explanation += '  Your budget covers most expenses, but you might need additional funding.\n';
  } else {
    explanation += '  This program may be challenging for your budget.\n';
  }
  
  // Language match
  explanation += `• Language match: ${matchDetails.languageScore}/25 points\n`;
  if (matchDetails.languageScore >= 20) {
    explanation += '  The program language matches your preference perfectly.\n';
  } else if (matchDetails.languageScore >= 15) {
    explanation += '  The program offers courses in your preferred language.\n';
  } else {
    explanation += '  You may need to improve your language skills for this program.\n';
  }
  
  // Study level
  explanation += `• Study level match: ${matchDetails.levelScore}/20 points\n`;
  if (matchDetails.levelScore >= 15) {
    explanation += '  The program level matches your preference.\n';
  } else {
    explanation += '  This program is at a different level than your preference.\n';
  }
  
  // Location
  explanation += `• Location match: ${matchDetails.locationScore}/15 points\n`;
  if (matchDetails.locationScore >= 12) {
    explanation += '  The program is in your preferred location.\n';
  } else {
    explanation += '  This program is in a different location than your preference.\n';
  }
  
  // Field match
  explanation += `• Field of study match: ${matchDetails.fieldScore}/15 points\n`;
  if (matchDetails.fieldScore >= 12) {
    explanation += '  The program field matches your interests very well.\n';
  } else if (matchDetails.fieldScore >= 8) {
    explanation += '  The program is related to your field of interest.\n';
  } else {
    explanation += '  This program is in a different field than your preference.\n';
  }
  
  // Other factors
  explanation += `• Other factors: ${
    matchDetails.durationScore + matchDetails.scholarshipScore + matchDetails.culturalScore
  }/15 points\n`;
  
  return explanation;
};
