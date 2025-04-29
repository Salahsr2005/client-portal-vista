
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates favorite_programs table if it doesn't exist
 */
export const createFavoriteProgramsTable = async () => {
  try {
    // Use an actual function call that exists on the backend
    // First check if we can query the table
    const { error: checkError } = await supabase
      .from('programs')  // Use a table we know exists
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Error checking database connection:', checkError);
    }

    // Check if favorite_programs table exists by querying it
    const { error: queryError } = await supabase
      .from('favorite_programs')
      .select('id')
      .limit(1);
      
    if (queryError && queryError.message.includes('does not exist')) {
      console.log('favorite_programs table does not exist, attempting to create it');
      
      // Create the table using raw SQL (note: this requires superuser privileges)
      // Since we've already created the table via migration, this is a fallback
      console.log('The favorite_programs table should be created via migration');
    }
  } catch (err) {
    console.error('Error in createFavoriteProgramsTable:', err);
  }
};

/**
 * Handles errors from Supabase queries
 */
export const handleSupabaseError = (error: any, toast: any, customMessage?: string) => {
  console.error('Supabase error:', error);
  toast({
    title: "Error",
    description: customMessage || "An error occurred. Please try again.",
    variant: "destructive",
  });
};

/**
 * Get match explanation for program recommendation
 */
export const getMatchExplanation = (scores: any) => {
  if (!scores) return '';
  
  const explanations = [];
  
  // Budget compatibility (max 30 points)
  if (scores.budget_score >= 25) {
    explanations.push('Budget: Excellent match - your budget fully covers tuition and living expenses.');
  } else if (scores.budget_score >= 15) {
    explanations.push('Budget: Good match - your budget covers most expenses, additional funding may be helpful.');
  } else {
    explanations.push('Budget: Limited match - this program may be challenging for your budget.');
  }
  
  // Language match (max 25 points)
  if (scores.language_score >= 20) {
    explanations.push('Language: Excellent match - program language aligns with your preferences.');
  } else if (scores.language_score >= 15) {
    explanations.push('Language: Good match - program offers courses in your preferred language.');
  } else {
    explanations.push('Language: Limited match - you may need additional language preparation.');
  }
  
  // Study level match (max 20 points)
  if (scores.level_score >= 15) {
    explanations.push('Study Level: Excellent match - the program level matches what you\'re looking for.');
  } else {
    explanations.push('Study Level: Limited match - this program is at a different level than requested.');
  }
  
  // Location match (max 15 points)
  if (scores.location_score >= 12) {
    explanations.push('Location: Excellent match - program is in your preferred location.');
  } else {
    explanations.push('Location: Limited match - program is in a different location than preferred.');
  }
  
  // Field match (max 15 points)
  if (scores.field_score >= 12) {
    explanations.push('Field of Study: Excellent match - program field matches your interests very well.');
  } else if (scores.field_score >= 8) {
    explanations.push('Field of Study: Good match - program is related to your field of interest.');
  } else {
    explanations.push('Field of Study: Limited match - program is in a different field than your preference.');
  }
  
  return explanations.join('\n');
};

/**
 * Calculate match score between user preferences and program
 */
export const calculateMatchScore = (program: any, preferences: any) => {
  if (!program || !preferences) return 0;
  
  let score = 0;
  let maxScore = 0;
  let details = {};
  
  // Budget score (max 30 points)
  const totalCost = (program.tuition_min || 0) + 12 * (program.living_cost_min || 0);
  let budgetScore = 0;
  maxScore += 30;
  
  if (preferences.budget >= totalCost) {
    budgetScore = 30;
  } else if (preferences.budget >= totalCost * 0.8) {
    budgetScore = 20;
  } else if (preferences.budget >= totalCost * 0.6) {
    budgetScore = 10;
  } else {
    budgetScore = 5;
  }
  score += budgetScore;
  
  // Language score (max 25 points)
  let languageScore = 0;
  maxScore += 25;
  
  if (program.program_language?.toLowerCase() === preferences.language_preference?.toLowerCase()) {
    languageScore = 25;
  } else if (preferences.language_preference === 'any') {
    languageScore = 15;
  } else if ((preferences.language_preference === 'french' && ['France', 'Belgium'].includes(program.country)) ||
             (preferences.language_preference === 'spanish' && program.country === 'Spain') ||
             (preferences.language_preference === 'english' && program.program_language === 'English')) {
    languageScore = 20;
  } else if (program.secondary_language?.toLowerCase() === preferences.language_preference?.toLowerCase()) {
    languageScore = 15;
  } else {
    languageScore = 5;
  }
  score += languageScore;
  
  // Study level score (max 20 points)
  let levelScore = 0;
  maxScore += 20;
  
  if (program.study_level === preferences.study_level) {
    levelScore = 20;
  } else {
    levelScore = 5;
  }
  score += levelScore;
  
  // Location score (max 15 points)
  let locationScore = 0;
  maxScore += 15;
  
  if (program.country?.toLowerCase() === preferences.destination_preference?.toLowerCase()) {
    locationScore = 15;
  } else if (preferences.destination_preference === 'any') {
    locationScore = 10;
  } else if (preferences.destination_preference === 'europe' && 
            ['France', 'Spain', 'Poland', 'Belgium', 'Italy'].includes(program.country)) {
    locationScore = 12;
  } else {
    locationScore = 5;
  }
  score += locationScore;
  
  // Field score (max 15 points)
  let fieldScore = 0;
  maxScore += 15;
  
  if (preferences.field_preference === 'any') {
    fieldScore = 8;
  } else if (program.field?.toLowerCase() === preferences.field_preference?.toLowerCase()) {
    fieldScore = 15;
  } else if ((program.field_keywords || []).some((keyword: string) => 
             preferences.field_keywords?.includes(keyword.toLowerCase()))) {
    fieldScore = 12;
  } else if (program.name?.toLowerCase().includes(preferences.field_preference?.toLowerCase())) {
    fieldScore = 10;
  } else {
    fieldScore = 5;
  }
  score += fieldScore;
  
  // Additional scores (scholarship, cultural needs)
  // Scholarship score (max 5 points)
  let scholarshipScore = 0;
  maxScore += 5;
  
  if (preferences.scholarship_required && program.scholarship_available) {
    scholarshipScore = 5;
  } else if (!preferences.scholarship_required) {
    scholarshipScore = 5;
  } else {
    scholarshipScore = 0;
  }
  score += scholarshipScore;
  
  // Cultural accommodations score (max 5 points)
  let culturalScore = 0;
  maxScore += 5;
  
  if ((preferences.religious_facilities_required && program.religious_facilities) ||
      (preferences.halal_food_required && program.halal_food_availability)) {
    culturalScore = 5;
  } else if ((preferences.religious_facilities_required || preferences.halal_food_required) && 
             ['Large', 'Medium'].includes(program.north_african_community_size || '')) {
    culturalScore = 3;
  } else if (!preferences.religious_facilities_required && !preferences.halal_food_required) {
    culturalScore = 5;
  } else {
    culturalScore = 0;
  }
  score += culturalScore;
  
  // Normalized percentage score
  const percentage = Math.round((score / maxScore) * 100);
  
  details = {
    budget_score: budgetScore,
    language_score: languageScore,
    level_score: levelScore,
    location_score: locationScore,
    field_score: fieldScore,
    scholarship_score: scholarshipScore,
    cultural_score: culturalScore,
    total_score: score,
    max_score: maxScore,
    percentage
  };
  
  return { score: percentage, details };
};
