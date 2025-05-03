
import { ProgramWithMatchScore } from "@/hooks/usePrograms";

// Define the MatchedProgram type with required matchScore
export interface MatchedProgram {
  id: string;
  name: string;
  matchScore: number;
  [key: string]: any;
}

// Enhanced function to calculate match score between a program and user preferences
export function calculateMatchScore(program: any, preferences: any): number {
  let score = 0;
  const maxScore = 100;
  
  // Calculate weighted scores by category
  const budgetScore = calculateBudgetScore(program, preferences) * 0.2; // 20% weight
  const fieldScore = calculateFieldScore(program, preferences) * 0.25;   // 25% weight
  const levelScore = calculateLevelScore(program, preferences) * 0.15;   // 15% weight
  const locationScore = calculateLocationScore(program, preferences) * 0.15; // 15% weight
  const languageScore = calculateLanguageScore(program, preferences) * 0.15; // 15% weight
  const culturalScore = calculateCulturalScore(program, preferences) * 0.05; // 5% weight
  const scholarshipScore = calculateScholarshipScore(program, preferences) * 0.05; // 5% weight
  
  // Sum all weighted scores
  score = budgetScore + fieldScore + levelScore + locationScore + 
          languageScore + culturalScore + scholarshipScore;
  
  // Normalize score to a maximum of 100
  return Math.min(Math.round(score * 100), maxScore);
}

// Calculate budget compatibility score (0 to 1)
function calculateBudgetScore(program: any, preferences: any): number {
  if (!preferences.budget || !program.tuition_min) return 0.5;
  
  const budget = parseInt(preferences.budget);
  const totalCost = program.tuition_min + ((program.living_cost_min || 400) * 12);
  
  if (budget >= totalCost * 1.2) return 1.0;  // More than enough
  if (budget >= totalCost) return 0.9;        // Enough
  if (budget >= totalCost * 0.8) return 0.7;  // Slightly tight
  if (budget >= totalCost * 0.6) return 0.5;  // Very tight
  if (budget >= totalCost * 0.4) return 0.3;  // Probably insufficient
  return 0.1;                                // Definitely insufficient
}

// Calculate field match score (0 to 1)
function calculateFieldScore(program: any, preferences: any): number {
  if (!preferences.subjects || preferences.subjects.length === 0) return 0.5;
  
  const programKeywords = program.field_keywords || [];
  const programField = program.field?.toLowerCase() || '';
  const programName = program.name?.toLowerCase() || '';
  
  let matchCount = 0;
  const totalSubjects = preferences.subjects.length;
  
  preferences.subjects.forEach((subject: string) => {
    const subjectLower = subject.toLowerCase();
    
    // Direct field match
    if (programField.includes(subjectLower)) {
      matchCount += 1;
      return;
    }
    
    // Check in keywords
    if (programKeywords.some((keyword: string) => 
      keyword.toLowerCase().includes(subjectLower))) {
      matchCount += 1;
      return;
    }
    
    // Check in program name
    if (programName.includes(subjectLower)) {
      matchCount += 0.7;
      return;
    }
  });
  
  return Math.min(matchCount / totalSubjects, 1);
}

// Calculate study level match score (0 to 1)
function calculateLevelScore(program: any, preferences: any): number {
  if (!preferences.studyLevel || !program.study_level) return 0.5;
  return program.study_level === preferences.studyLevel ? 1.0 : 0.2;
}

// Calculate location match score (0 to 1)
function calculateLocationScore(program: any, preferences: any): number {
  if (!preferences.location || !program.country) return 0.5;
  
  if (preferences.location === 'any') return 0.8;
  
  const europeanCountries = [
    'france', 'spain', 'italy', 'germany', 'poland', 
    'netherlands', 'belgium', 'portugal', 'greece'
  ];
  
  const programCountry = program.country.toLowerCase();
  const preferredLocation = preferences.location.toLowerCase();
  
  // Exact country match
  if (programCountry === preferredLocation) return 1.0;
  
  // Region match (e.g., Europe)
  if (preferredLocation === 'europe' && europeanCountries.includes(programCountry)) {
    return 0.8;
  }
  
  return 0.2;
}

// Calculate language match score (0 to 1)
function calculateLanguageScore(program: any, preferences: any): number {
  if (!preferences.language || !program.program_language) return 0.5;
  
  if (preferences.language === 'any') return 1.0;
  
  const programLanguage = program.program_language.toLowerCase();
  const preferredLanguage = preferences.language.toLowerCase();
  const secondaryLanguage = program.secondary_language?.toLowerCase();
  
  // Primary language match
  if (programLanguage === preferredLanguage) return 1.0;
  
  // Secondary language match
  if (secondaryLanguage === preferredLanguage) return 0.8;
  
  // English is widely accepted
  if (preferredLanguage === 'english' && programLanguage === 'english') return 1.0;
  
  return 0.2;
}

// Calculate cultural accommodations score (0 to 1)
function calculateCulturalScore(program: any, preferences: any): number {
  let score = 0.5; // Default score
  
  if (preferences.religiousFacilities && program.religious_facilities) {
    score += 0.25;
  }
  
  if (preferences.halalFood && program.halal_food_availability) {
    score += 0.25;
  }
  
  // If user doesn't require these features
  if (!preferences.religiousFacilities && !preferences.halalFood) {
    return 0.5;
  }
  
  // Consider community size if explicit facilities not available
  if ((preferences.religiousFacilities || preferences.halalFood) && 
      program.north_african_community_size === 'Large') {
    score = Math.max(score, 0.7);
  }
  
  return Math.min(score, 1.0);
}

// Calculate scholarship score (0 to 1)
function calculateScholarshipScore(program: any, preferences: any): number {
  if (!preferences.scholarshipRequired) return 0.5;
  
  if (program.scholarship_available) {
    // High amount scholarship
    if (program.scholarship_amount && program.scholarship_amount >= program.tuition_min * 0.7) {
      return 1.0;
    }
    // Moderate scholarship
    if (program.scholarship_amount && program.scholarship_amount >= program.tuition_min * 0.3) {
      return 0.8;
    }
    // Some scholarship
    return 0.6;
  }
  
  return 0.1;
}

// Function to filter and sort programs based on match score
export function getMatchingPrograms(programs: any[], preferences: any): ProgramWithMatchScore[] {
  const matchedPrograms = programs.map(program => {
    const matchScore = calculateMatchScore(program, preferences);
    const matchDetails = getMatchDetails(program, preferences);
    
    return {
      ...program,
      matchScore,
      matchDetails
    };
  });
  
  // Sort by match score, descending
  return matchedPrograms.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

// Function to get detailed match information
function getMatchDetails(program: any, preferences: any) {
  return {
    budgetMatch: getBudgetMatch(program, preferences),
    languageMatch: getLanguageMatch(program, preferences),
    levelMatch: getLevelMatch(program, preferences),
    locationMatch: getLocationMatch(program, preferences),
    fieldMatch: getFieldMatch(program, preferences),
    culturalMatch: getCulturalMatch(program, preferences),
    scholarshipMatch: getScholarshipMatch(program, preferences),
    testRequirementsMatch: getTestRequirementsMatch(program, preferences)
  };
}

// Helper functions for match details (percentages)
function getBudgetMatch(program: any, preferences: any): number {
  if (!preferences.budget || !program.tuition_min) return 50;
  
  const budget = parseInt(preferences.budget);
  const totalCost = program.tuition_min + ((program.living_cost_min || 400) * 12);
  
  if (budget >= totalCost * 1.2) return 100;
  if (budget >= totalCost) return 90;
  if (budget >= totalCost * 0.8) return 70;
  if (budget >= totalCost * 0.6) return 50;
  if (budget >= totalCost * 0.4) return 30;
  return 10;
}

function getLanguageMatch(program: any, preferences: any): number {
  if (!preferences.language || !program.program_language) return 50;
  
  if (preferences.language === 'any') return 100;
  
  const programLanguage = program.program_language.toLowerCase();
  const preferredLanguage = preferences.language.toLowerCase();
  const secondaryLanguage = program.secondary_language?.toLowerCase();
  
  if (programLanguage === preferredLanguage) return 100;
  if (secondaryLanguage === preferredLanguage) return 80;
  if (preferredLanguage === 'english' && programLanguage === 'english') return 100;
  
  return 20;
}

function getLevelMatch(program: any, preferences: any): number {
  if (!preferences.studyLevel || !program.study_level) return 50;
  return program.study_level === preferences.studyLevel ? 100 : 20;
}

function getLocationMatch(program: any, preferences: any): number {
  if (!preferences.location || !program.country) return 50;
  
  if (preferences.location === 'any') return 80;
  
  const europeanCountries = [
    'france', 'spain', 'italy', 'germany', 'poland', 
    'netherlands', 'belgium', 'portugal', 'greece'
  ];
  
  const programCountry = program.country.toLowerCase();
  const preferredLocation = preferences.location.toLowerCase();
  
  if (programCountry === preferredLocation) return 100;
  
  if (preferredLocation === 'europe' && europeanCountries.includes(programCountry)) {
    return 80;
  }
  
  return 20;
}

function getFieldMatch(program: any, preferences: any): number {
  if (!preferences.subjects || preferences.subjects.length === 0) return 50;
  
  const programKeywords = program.field_keywords || [];
  const programField = program.field?.toLowerCase() || '';
  const programName = program.name?.toLowerCase() || '';
  
  let matchCount = 0;
  const totalSubjects = preferences.subjects.length;
  
  preferences.subjects.forEach((subject: string) => {
    const subjectLower = subject.toLowerCase();
    
    if (programField.includes(subjectLower)) {
      matchCount += 1;
      return;
    }
    
    if (programKeywords.some((keyword: string) => 
      keyword.toLowerCase().includes(subjectLower))) {
      matchCount += 1;
      return;
    }
    
    if (programName.includes(subjectLower)) {
      matchCount += 0.7;
      return;
    }
  });
  
  return Math.min(matchCount / totalSubjects * 100, 100);
}

function getCulturalMatch(program: any, preferences: any): number {
  let score = 50;
  
  if (preferences.religiousFacilities && program.religious_facilities) {
    score += 25;
  }
  
  if (preferences.halalFood && program.halal_food_availability) {
    score += 25;
  }
  
  if (!preferences.religiousFacilities && !preferences.halalFood) {
    return 50;
  }
  
  if ((preferences.religiousFacilities || preferences.halalFood) && 
      program.north_african_community_size === 'Large') {
    score = Math.max(score, 70);
  }
  
  return Math.min(score, 100);
}

function getScholarshipMatch(program: any, preferences: any): number {
  if (!preferences.scholarshipRequired) return 50;
  
  if (!program.scholarship_available) return 10;
  
  if (program.scholarship_amount && program.scholarship_amount >= program.tuition_min * 0.7) {
    return 100;
  }
  
  if (program.scholarship_amount && program.scholarship_amount >= program.tuition_min * 0.3) {
    return 80;
  }
  
  return 60;
}

function getTestRequirementsMatch(program: any, preferences: any): number {
  if (!preferences.languageTestRequired) return 50;
  
  if (preferences.languageTestRequired && program.language_test) {
    return 90;
  }
  
  return 50;
}

// Function to generate human-readable explanation of match
export function getMatchExplanation(program: ProgramWithMatchScore): string {
  // Ensure program has a matchScore (fallback to 0 if not)
  const matchScore = program.matchScore || 0;
  const matchDetails = program.matchDetails || {};
  
  let explanation = `MATCH SCORE: ${matchScore}%\n\n`;
  explanation += "WHY THIS PROGRAM MATCHES YOUR PREFERENCES:\n\n";
  
  // Add explanations based on match details
  if (matchDetails.budgetMatch) {
    explanation += `• Budget Compatibility: ${Math.round(matchDetails.budgetMatch)}%\n`;
    if (matchDetails.budgetMatch > 80) {
      explanation += "  Your budget comfortably covers this program's costs.\n";
    } else if (matchDetails.budgetMatch > 60) {
      explanation += "  Your budget covers most of this program's costs.\n";
    } else if (matchDetails.budgetMatch > 40) {
      explanation += "  This program may be tight for your budget.\n";
    } else {
      explanation += "  This program may require additional financial resources.\n";
    }
  }
  
  if (matchDetails.levelMatch) {
    explanation += `• Study Level: ${Math.round(matchDetails.levelMatch)}%\n`;
    if (matchDetails.levelMatch > 80) {
      explanation += "  Perfect match for your preferred study level.\n";
    } else {
      explanation += "  Different from your preferred study level.\n";
    }
  }
  
  if (matchDetails.fieldMatch) {
    explanation += `• Field of Study: ${Math.round(matchDetails.fieldMatch)}%\n`;
    if (matchDetails.fieldMatch > 80) {
      explanation += "  Strongly aligned with your subject interests.\n";
    } else if (matchDetails.fieldMatch > 50) {
      explanation += "  Related to your subject interests.\n";
    } else {
      explanation += "  Partially related to your interests.\n";
    }
  }
  
  if (matchDetails.locationMatch) {
    explanation += `• Location: ${Math.round(matchDetails.locationMatch)}%\n`;
    if (matchDetails.locationMatch > 80) {
      explanation += "  Matches your preferred location.\n";
    } else if (matchDetails.locationMatch > 50) {
      explanation += "  In a region related to your preference.\n";
    } else {
      explanation += "  Different from your preferred location.\n";
    }
  }
  
  if (matchDetails.languageMatch) {
    explanation += `• Language: ${Math.round(matchDetails.languageMatch)}%\n`;
    if (matchDetails.languageMatch > 80) {
      explanation += "  Offered in your preferred language.\n";
    } else if (matchDetails.languageMatch > 50) {
      explanation += "  Partially offered in your preferred language.\n";
    } else {
      explanation += "  Offered in a different language.\n";
    }
  }
  
  if (matchDetails.culturalMatch && matchDetails.culturalMatch > 50) {
    explanation += `• Cultural Accommodations: ${Math.round(matchDetails.culturalMatch)}%\n`;
    explanation += "  This program offers cultural accommodations you prefer.\n";
  }
  
  if (matchDetails.scholarshipMatch && program.scholarship_available) {
    explanation += `• Scholarship Opportunities: ${Math.round(matchDetails.scholarshipMatch)}%\n`;
    if (program.scholarship_details) {
      explanation += `  ${program.scholarship_details}\n`;
    } else {
      explanation += "  Scholarships are available for this program.\n";
    }
  }
  
  return explanation;
}

// Function to generate budget breakdown
export function getBudgetBreakdown(program: ProgramWithMatchScore): string {
  const tuitionMin = program.tuition_min || 0;
  const tuitionMax = program.tuition_max || tuitionMin;
  const livingCostMin = program.living_cost_min || 0;
  const livingCostMax = program.living_cost_max || livingCostMin;
  
  let breakdown = "ESTIMATED COSTS BREAKDOWN (EUR)\n\n";
  
  // Tuition
  breakdown += `• Tuition: €${tuitionMin.toLocaleString()}`;
  if (tuitionMax > tuitionMin) {
    breakdown += ` - €${tuitionMax.toLocaleString()}`;
  }
  breakdown += " per year\n";
  
  // Living costs
  breakdown += `• Living expenses: €${livingCostMin.toLocaleString()}`;
  if (livingCostMax > livingCostMin) {
    breakdown += ` - €${livingCostMax.toLocaleString()}`;
  }
  breakdown += " per month\n";
  
  // Housing if available
  if (program.housing_cost_min) {
    breakdown += `• Housing: €${program.housing_cost_min.toLocaleString()}`;
    if (program.housing_cost_max && program.housing_cost_max > program.housing_cost_min) {
      breakdown += ` - €${program.housing_cost_max.toLocaleString()}`;
    }
    breakdown += " per month\n";
  }
  
  // Application fee
  if (program.application_fee) {
    breakdown += `• Application fee: €${program.application_fee.toLocaleString()}\n`;
  }
  
  // Visa fee
  if (program.visa_fee) {
    breakdown += `• Visa fee: €${program.visa_fee.toLocaleString()}\n`;
  }
  
  // Total estimated yearly
  const yearlyMin = tuitionMin + (livingCostMin * 12);
  const yearlyMax = tuitionMax + (livingCostMax * 12);
  breakdown += `\nTotal estimated cost per year: €${yearlyMin.toLocaleString()}`;
  if (yearlyMax > yearlyMin) {
    breakdown += ` - €${yearlyMax.toLocaleString()}`;
  }
  
  // DZD equivalent
  const dzdMin = yearlyMin * 250;
  const dzdMax = yearlyMax * 250;
  breakdown += `\nEquivalent in DZD: ${dzdMin.toLocaleString()} DZD`;
  if (dzdMax > dzdMin) {
    breakdown += ` - ${dzdMax.toLocaleString()} DZD`;
  }
  breakdown += " (1 EUR = 250 DZD)\n";
  
  // Scholarship info if available
  if (program.scholarship_available) {
    breakdown += "\n\nScholarship information:";
    if (program.scholarship_amount) {
      breakdown += `\n• Amount: Up to €${program.scholarship_amount.toLocaleString()}`;
      // DZD equivalent
      const scholarshipDzd = program.scholarship_amount * 250;
      breakdown += ` (${scholarshipDzd.toLocaleString()} DZD)`;
    }
    if (program.scholarship_details) {
      breakdown += `\n• Details: ${program.scholarship_details}`;
    }
    if (program.scholarship_deadline) {
      breakdown += `\n• Deadline: ${program.scholarship_deadline}`;
    }
    if (program.scholarship_requirements) {
      breakdown += `\n• Requirements: ${program.scholarship_requirements}`;
    }
  }
  
  return breakdown;
}
