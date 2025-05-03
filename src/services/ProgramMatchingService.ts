
import { ProgramWithMatchScore } from "@/hooks/usePrograms";

// Define the MatchedProgram type with required matchScore
export interface MatchedProgram {
  id: string;
  name: string;
  matchScore: number;
  [key: string]: any;
}

// Function to calculate match score between a program and user preferences
export function calculateMatchScore(program: any, preferences: any): number {
  let score = 0;
  const maxScore = 100;
  
  // Basic implementation - can be expanded
  if (program.study_level === preferences.studyLevel) {
    score += 20;
  }
  
  // Check for matching subject areas
  if (preferences.subjects && preferences.subjects.length > 0) {
    const programSubjects = program.field_keywords || [program.field];
    const matchingSubjects = preferences.subjects.filter((subject: string) => 
      programSubjects.some((ps: string) => 
        ps.toLowerCase().includes(subject.toLowerCase())
      )
    );
    score += Math.min(20, matchingSubjects.length * 5);
  }
  
  // Check location match
  if (preferences.location && program.country) {
    if (program.country.toLowerCase() === preferences.location.toLowerCase()) {
      score += 15;
    } else if (preferences.location === "europe" && 
        ["France", "Germany", "Spain", "Italy", "UK", "Netherlands"].includes(program.country)) {
      score += 10;
    }
  }
  
  // Check budget match
  if (preferences.budget && program.tuition_min) {
    const budget = parseInt(preferences.budget);
    if (budget >= program.tuition_min) {
      score += 15;
    } else if (budget >= program.tuition_min * 0.8) {
      score += 10;
    } else if (budget >= program.tuition_min * 0.6) {
      score += 5;
    }
  }
  
  // Check for scholarship availability
  if (preferences.scholarshipRequired && program.scholarship_available) {
    score += 10;
  }
  
  // Check for cultural accommodations
  if (preferences.religiousFacilities && program.religious_facilities) {
    score += 5;
  }
  
  if (preferences.halalFood && program.halal_food_availability) {
    score += 5;
  }
  
  // Normalize score to 100
  return Math.min(Math.round(score), maxScore);
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
    culturalMatch: getCulturalMatch(program, preferences)
  };
}

// Helper functions for match details
function getBudgetMatch(program: any, preferences: any): number {
  if (!preferences.budget || !program.tuition_min) return 0;
  
  const budget = parseInt(preferences.budget);
  if (budget >= program.tuition_min + (program.living_cost_min || 0) * 12) return 100;
  if (budget >= program.tuition_min) return 80;
  if (budget >= program.tuition_min * 0.8) return 60;
  if (budget >= program.tuition_min * 0.6) return 40;
  return 20;
}

function getLanguageMatch(program: any, preferences: any): number {
  if (!preferences.language || !program.program_language) return 50;
  
  if (preferences.language === 'any') return 100;
  if (program.program_language.toLowerCase() === preferences.language.toLowerCase()) return 100;
  if (program.secondary_language && 
      program.secondary_language.toLowerCase() === preferences.language.toLowerCase()) return 80;
  return 30;
}

function getLevelMatch(program: any, preferences: any): number {
  if (!preferences.studyLevel || !program.study_level) return 50;
  return program.study_level === preferences.studyLevel ? 100 : 30;
}

function getLocationMatch(program: any, preferences: any): number {
  if (!preferences.location || !program.country) return 50;
  
  if (preferences.location === 'any') return 100;
  if (program.country.toLowerCase() === preferences.location.toLowerCase()) return 100;
  if (preferences.location === "europe" && 
      ["France", "Germany", "Spain", "Italy", "UK", "Netherlands"].includes(program.country)) return 80;
  return 30;
}

function getFieldMatch(program: any, preferences: any): number {
  if (!preferences.subjects || preferences.subjects.length === 0 || !program.field) return 50;
  
  const programSubjects = program.field_keywords || [program.field];
  const matchingSubjects = preferences.subjects.filter((subject: string) => 
    programSubjects.some((ps: string) => 
      ps.toLowerCase().includes(subject.toLowerCase())
    )
  );
  
  if (matchingSubjects.length >= preferences.subjects.length) return 100;
  if (matchingSubjects.length > 0) return 70 + (30 * matchingSubjects.length / preferences.subjects.length);
  return 30;
}

function getCulturalMatch(program: any, preferences: any): number {
  let score = 50;
  
  if (preferences.religiousFacilities && program.religious_facilities) {
    score += 25;
  }
  
  if (preferences.halalFood && program.halal_food_availability) {
    score += 25;
  }
  
  return Math.min(score, 100);
}

// Function to generate human-readable explanation of match
export function getMatchExplanation(program: ProgramWithMatchScore): string {
  // Ensure program has a matchScore (fallback to 0 if not)
  const matchScore = program.matchScore || 0;
  const matchDetails = program.matchDetails || {};
  
  let explanation = `Match Score: ${matchScore}%\n\n`;
  explanation += "Why this program matches your preferences:\n\n";
  
  // Add explanations based on match details
  if (matchDetails.budgetMatch) {
    explanation += `• Budget Compatibility: ${Math.round(matchDetails.budgetMatch)}%\n`;
    if (matchDetails.budgetMatch > 80) {
      explanation += "  Your budget comfortably covers this program's costs.\n";
    } else if (matchDetails.budgetMatch > 60) {
      explanation += "  Your budget covers most of this program's costs.\n";
    } else {
      explanation += "  This program may require additional financial resources.\n";
    }
  }
  
  if (matchDetails.levelMatch) {
    explanation += `• Study Level: ${Math.round(matchDetails.levelMatch)}%\n`;
    if (matchDetails.levelMatch > 80) {
      explanation += "  Perfect match for your preferred study level.\n";
    }
  }
  
  if (matchDetails.fieldMatch) {
    explanation += `• Field of Study: ${Math.round(matchDetails.fieldMatch)}%\n`;
    if (matchDetails.fieldMatch > 80) {
      explanation += "  Strongly aligned with your subject interests.\n";
    } else if (matchDetails.fieldMatch > 50) {
      explanation += "  Related to your subject interests.\n";
    }
  }
  
  if (matchDetails.locationMatch) {
    explanation += `• Location: ${Math.round(matchDetails.locationMatch)}%\n`;
    if (matchDetails.locationMatch > 80) {
      explanation += "  Matches your preferred location.\n";
    }
  }
  
  if (matchDetails.culturalMatch && matchDetails.culturalMatch > 50) {
    explanation += `• Cultural Accommodations: ${Math.round(matchDetails.culturalMatch)}%\n`;
    explanation += "  This program offers cultural accommodations you prefer.\n";
  }
  
  return explanation;
}

// Function to generate budget breakdown
export function getBudgetBreakdown(program: ProgramWithMatchScore): string {
  const tuitionMin = program.tuition_min || 0;
  const tuitionMax = program.tuition_max || tuitionMin;
  const livingCostMin = program.living_cost_min || 0;
  const livingCostMax = program.living_cost_max || livingCostMin;
  
  let breakdown = "ESTIMATED COSTS BREAKDOWN\n\n";
  
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
  
  // Scholarship info if available
  if (program.scholarship_available) {
    breakdown += "\n\nScholarship information:";
    if (program.scholarship_amount) {
      breakdown += `\n• Amount: Up to €${program.scholarship_amount.toLocaleString()}`;
    }
    if (program.scholarship_details) {
      breakdown += `\n• Details: ${program.scholarship_details}`;
    }
  }
  
  return breakdown;
}
