
import { formatCurrency } from "@/utils/currencyConverter";

// Function to calculate the match score between a program and user preferences
export const calculateProgramMatch = (program: any, preferences: any) => {
  // Initialize score and details
  let score = 0;
  let details = '';
  
  // Budget match (30 points max)
  let budgetScore = 0;
  if (preferences.budget) {
    const userBudget = parseInt(preferences.budget, 10);
    const programCost = (program.tuition_min || 0) + ((program.living_cost_min || 800) * 12);
    
    if (userBudget >= programCost) {
      budgetScore = 30; // Full budget coverage
    } else if (userBudget >= programCost * 0.8) {
      budgetScore = 25; // 80%+ coverage
    } else if (userBudget >= programCost * 0.6) {
      budgetScore = 20; // 60%+ coverage
    } else if (userBudget >= programCost * 0.4) {
      budgetScore = 10; // 40%+ coverage
    } else {
      budgetScore = 5; // Less than 40% coverage
    }
    
    details += `Budget match: ${budgetScore}/30 - `;
    if (budgetScore >= 25) {
      details += `Your budget of ${formatCurrency(userBudget)} covers the program cost of ${formatCurrency(programCost)}.\n`;
    } else if (budgetScore >= 15) {
      details += `Your budget covers most but not all costs.\n`;
    } else {
      details += `This program may be over your budget.\n`;
    }
    
    score += budgetScore;
  }
  
  // Study level match (20 points)
  let levelScore = 0;
  if (preferences.studyLevel && program.study_level) {
    if (preferences.studyLevel.toLowerCase() === program.study_level.toLowerCase()) {
      levelScore = 20;
      details += `Study level: 20/20 - Perfect match for ${program.study_level} level.\n`;
    } else {
      levelScore = 0;
      details += `Study level: 0/20 - You preferred ${preferences.studyLevel}, but this is a ${program.study_level} program.\n`;
    }
    score += levelScore;
  }
  
  // Location match (15 points)
  let locationScore = 0;
  if (preferences.location && program.country) {
    if (preferences.location.toLowerCase() === program.country.toLowerCase()) {
      locationScore = 15;
      details += `Location: 15/15 - Perfect match for ${program.country}.\n`;
    } else if (preferences.location === 'any') {
      locationScore = 10;
      details += `Location: 10/15 - You were open to any location.\n`;
    } else {
      locationScore = 0;
      details += `Location: 0/15 - You preferred ${preferences.location}, but this program is in ${program.country}.\n`;
    }
    score += locationScore;
  }
  
  // Duration match (10 points)
  let durationScore = 0;
  if (preferences.duration && program.duration_months) {
    let preferredMonths = 0;
    
    if (preferences.duration === 'semester') {
      preferredMonths = 6;
    } else if (preferences.duration === 'year') {
      preferredMonths = 12;
    } else if (preferences.duration === 'two_years') {
      preferredMonths = 24;
    } else {
      preferredMonths = 36; // Default for "full_program"
    }
    
    const diff = Math.abs(program.duration_months - preferredMonths);
    
    if (diff <= 3) {
      durationScore = 10;
      details += `Duration: 10/10 - Very close to your preferred duration.\n`;
    } else if (diff <= 6) {
      durationScore = 7;
      details += `Duration: 7/10 - Reasonably close to your preferred duration.\n`;
    } else if (diff <= 12) {
      durationScore = 5;
      details += `Duration: 5/10 - Somewhat longer/shorter than preferred.\n`;
    } else {
      durationScore = 2;
      details += `Duration: 2/10 - Significantly different from your preferred duration.\n`;
    }
    
    score += durationScore;
  }
  
  // Language match (15 points)
  let languageScore = 0;
  if (preferences.language && (program.program_language || program.secondary_language)) {
    if (program.program_language && preferences.language.toLowerCase() === program.program_language.toLowerCase()) {
      languageScore = 15;
      details += `Language: 15/15 - The program is taught in ${program.program_language}, which matches your preference.\n`;
    } else if (program.secondary_language && preferences.language.toLowerCase() === program.secondary_language.toLowerCase()) {
      languageScore = 10;
      details += `Language: 10/15 - The program offers courses in ${program.secondary_language}, which matches your preference.\n`;
    } else if (preferences.language === 'english' && program.program_language === 'English') {
      languageScore = 15;
      details += `Language: 15/15 - The program is taught in English, which matches your preference.\n`;
    } else if (preferences.language === 'any') {
      languageScore = 8;
      details += `Language: 8/15 - You were open to any language.\n`;
    } else {
      languageScore = 0;
      details += `Language: 0/15 - The program is not offered in your preferred language (${preferences.language}).\n`;
    }
    
    score += languageScore;
  }
  
  // Special requirements (10 points)
  let specialScore = 0;
  
  // Scholarship requirement
  if (preferences.scholarshipRequired && program.scholarship_available) {
    specialScore += 4;
    details += `Scholarship: 4/4 - Scholarships are available.\n`;
  } else if (preferences.scholarshipRequired && !program.scholarship_available) {
    details += `Scholarship: 0/4 - No scholarships are available despite your preference.\n`;
  } else if (!preferences.scholarshipRequired) {
    specialScore += 2;
    details += `Scholarship: 2/4 - Not a priority for you.\n`;
  }
  
  // Religious facilities
  if (preferences.religiousFacilities && program.religious_facilities) {
    specialScore += 3;
    details += `Religious facilities: 3/3 - Religious facilities are available.\n`;
  } else if (preferences.religiousFacilities && !program.religious_facilities) {
    details += `Religious facilities: 0/3 - No religious facilities are available despite your preference.\n`;
  } else if (!preferences.religiousFacilities) {
    specialScore += 1;
    details += `Religious facilities: 1/3 - Not a priority for you.\n`;
  }
  
  // Halal food
  if (preferences.halalFood && program.halal_food_availability) {
    specialScore += 3;
    details += `Halal food: 3/3 - Halal food is available.\n`;
  } else if (preferences.halalFood && !program.halal_food_availability) {
    details += `Halal food: 0/3 - No halal food options are available despite your preference.\n`;
  } else if (!preferences.halalFood) {
    specialScore += 1;
    details += `Halal food: 1/3 - Not a priority for you.\n`;
  }
  
  score += specialScore;
  
  // Calculate final score as a percentage
  const totalPossiblePoints = 100; // Adjust if you change the point allocation
  const finalScore = Math.min(Math.round((score / totalPossiblePoints) * 100), 100);
  
  return {
    score: finalScore,
    details: details,
    rawScore: score,
    maxScore: totalPossiblePoints
  };
};
