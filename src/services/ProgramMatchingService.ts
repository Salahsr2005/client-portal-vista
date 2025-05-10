
import { formatCurrency } from "@/utils/databaseHelpers";

// Function to calculate the match score between a program and user preferences
export const calculateProgramMatch = (program: any, filter: any) => {
  let score = 0;
  const details: {
    budgetMatch?: number;
    languageMatch?: number;
    levelMatch?: number;
    locationMatch?: number;
    durationMatch?: number;
    fieldMatch?: number;
    culturalMatch?: number;
    testRequirementsMatch?: number;
    scholarshipMatch?: number;
  } = {};

  // Study Level Match (20 points max)
  if (program.study_level?.toLowerCase() === filter.studyLevel?.toLowerCase()) {
    score += 20;
    details.levelMatch = 100;
  } else {
    // Partial match for related levels (undergraduate vs bachelor, graduate vs master)
    const undergraduateTerms = ['undergraduate', 'bachelor', 'license', 'bachelor\'s'];
    const graduateTerms = ['graduate', 'master', 'master\'s', 'msc', 'mba'];
    const phdTerms = ['phd', 'doctorate', 'doctoral'];
    
    const programLevel = program.study_level?.toLowerCase() || '';
    const filterLevel = filter.studyLevel?.toLowerCase() || '';
    
    if (
      (undergraduateTerms.some(term => programLevel.includes(term)) && undergraduateTerms.some(term => filterLevel.includes(term))) ||
      (graduateTerms.some(term => programLevel.includes(term)) && graduateTerms.some(term => filterLevel.includes(term))) ||
      (phdTerms.some(term => programLevel.includes(term)) && phdTerms.some(term => filterLevel.includes(term)))
    ) {
      score += 15;
      details.levelMatch = 75;
    } else {
      details.levelMatch = 0;
    }
  }

  // Field of Study Match (20 points max)
  if (filter.subjects && filter.subjects.length > 0) {
    const programField = program.field?.toLowerCase() || '';
    
    // Check for exact match
    if (filter.subjects.some(subject => programField === subject.toLowerCase())) {
      score += 20;
      details.fieldMatch = 100;
    }
    // Check for strong match (subject name contained in program field or vice versa)
    else if (filter.subjects.some(subject => 
      subject.toLowerCase().includes(programField) || 
      programField.includes(subject.toLowerCase())
    )) {
      score += 16;
      details.fieldMatch = 80;
    }
    // Check for partial match using keywords
    else {
      const fieldKeywords = program.field_keywords || [];
      const matchedKeywords = filter.subjects.filter(subject => 
        fieldKeywords.some((keyword: string) => 
          keyword.toLowerCase().includes(subject.toLowerCase()) || 
          subject.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      if (matchedKeywords.length > 0) {
        const keywordMatchScore = Math.min(12, matchedKeywords.length * 4);
        score += keywordMatchScore;
        details.fieldMatch = keywordMatchScore * 5;
      } else {
        details.fieldMatch = 0;
      }
    }
  } else {
    details.fieldMatch = 50; // No field preference
    score += 10;
  }

  // Location Match (15 points max)
  if (filter.location && filter.location !== "any") {
    if (program.location?.toLowerCase() === filter.location?.toLowerCase() || 
        program.country?.toLowerCase() === filter.location?.toLowerCase()) {
      score += 15;
      details.locationMatch = 100;
    } else if (filter.location.toLowerCase() === 'europe' && 
              ['france', 'spain', 'germany', 'italy', 'portugal', 'belgium', 'netherlands', 'switzerland'].includes(program.country?.toLowerCase() || '')) {
      score += 10;
      details.locationMatch = 67;
    } else {
      details.locationMatch = 0;
    }
  } else {
    details.locationMatch = 50; // No location preference
    score += 7.5;
  }

  // Language Match (15 points max)
  if (filter.language && filter.language !== "any") {
    if (program.program_language?.toLowerCase() === filter.language?.toLowerCase()) {
      score += 15;
      details.languageMatch = 100;
    } else if (program.secondary_language?.toLowerCase() === filter.language?.toLowerCase()) {
      score += 10;
      details.languageMatch = 67;
    } else {
      // Check if the country typically uses this language
      const countryLanguageMap: {[country: string]: string[]} = {
        'france': ['french'],
        'spain': ['spanish'],
        'germany': ['german'],
        'italy': ['italian'],
        'portugal': ['portuguese'],
        'uk': ['english'],
        'united kingdom': ['english'],
        'belgium': ['french', 'dutch', 'german'],
        'netherlands': ['dutch', 'english'],
        'switzerland': ['german', 'french', 'italian']
      };
      
      const countryLanguages = countryLanguageMap[program.country?.toLowerCase() || ''] || [];
      if (countryLanguages.includes(filter.language.toLowerCase())) {
        score += 5;
        details.languageMatch = 33;
      } else {
        details.languageMatch = 0;
      }
    }
  } else {
    details.languageMatch = 50; // No language preference
    score += 7.5;
  }

  // Budget Match (15 points max)
  const programTuition = program.tuition_min || program.tuition;
  if (filter.budget) {
    const budgetAmount = parseInt(filter.budget);
    if (programTuition <= budgetAmount * 0.7) {
      // Well under budget - excellent match
      score += 15;
      details.budgetMatch = 100;
    } else if (programTuition <= budgetAmount) {
      // Within budget - good match
      score += 12;
      details.budgetMatch = 80;
    } else if (programTuition <= budgetAmount * 1.2) {
      // Slightly over budget - acceptable match
      score += 8;
      details.budgetMatch = 53;
    } else if (programTuition <= budgetAmount * 1.5) {
      // Significantly over budget - poor match
      score += 4;
      details.budgetMatch = 27;
    } else {
      // Way over budget - not a match
      details.budgetMatch = 0;
    }
  } else {
    details.budgetMatch = 50; // No budget preference
    score += 7.5;
  }

  // Duration Match (5 points max)
  if (filter.duration) {
    const durationMonths = program.duration_months || 0;
    const durationPreference = filter.duration.toLowerCase();
    
    let durationMatch = false;
    if (durationPreference.includes('semester') && durationMonths <= 6) durationMatch = true;
    else if (durationPreference.includes('year') && durationMonths > 6 && durationMonths <= 12) durationMatch = true;
    else if (durationPreference.includes('two') && durationMonths > 12 && durationMonths <= 24) durationMatch = true;
    else if (durationPreference.includes('three') && durationMonths > 24) durationMatch = true;
    
    if (durationMatch) {
      score += 5;
      details.durationMatch = 100;
    } else if (Math.abs(durationMonths - (durationPreference.includes('year') ? 12 : 6)) <= 3) {
      // Close enough to the preferred duration
      score += 3;
      details.durationMatch = 60;
    } else {
      details.durationMatch = 0;
    }
  } else {
    details.durationMatch = 50; // No duration preference
    score += 2.5;
  }
  
  // Scholarship Match (10 points max)
  if (filter.scholarshipRequired) {
    if (program.scholarship_available && program.scholarship_amount > 0) {
      // Program offers substantial scholarships
      score += 10;
      details.scholarshipMatch = 100;
    } else if (program.scholarship_available) {
      // Scholarship available but amount unknown
      score += 7;
      details.scholarshipMatch = 70;
    } else {
      details.scholarshipMatch = 0;
    }
  } else {
    details.scholarshipMatch = 50; // No scholarship preference
    score += 5;
  }

  // Cultural Factors Match (10 points max)
  let culturalScore = 0;
  if (filter.religiousFacilities && program.religious_facilities) culturalScore += 5;
  if (filter.halalFood && program.halal_food_availability) culturalScore += 5;
  
  // Add points for community size if direct accommodations aren't available
  if ((filter.religiousFacilities || filter.halalFood) && 
       (!program.religious_facilities || !program.halal_food_availability)) {
    if (program.north_african_community_size === 'Large') culturalScore += 3;
    else if (program.north_african_community_size === 'Medium') culturalScore += 2;
  }
  
  score += culturalScore;
  details.culturalMatch = culturalScore * 10; // Convert to percentage

  // Language Test Requirements Match (5 points max)
  if (filter.languageTestRequired !== undefined) {
    if (program.language_test_required === filter.languageTestRequired) {
      score += 5;
      details.testRequirementsMatch = 100;
    } else {
      details.testRequirementsMatch = 0;
    }
  } else {
    details.testRequirementsMatch = 50; // No test requirement preference
    score += 2.5;
  }

  // Ensure the score is within the valid range (0-100)
  // The maximum possible score is 100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    details
  };
};

// In getMatchExplanation function, add the scholarshipMatch property to the matchDetails type
export const getMatchExplanation = (program: any) => {
  if (!program || !program.matchScore) {
    return "No match data available";
  }
  
  const matchScore = program.matchScore;
  const matchDetails: {
    budgetMatch?: number;
    languageMatch?: number;
    levelMatch?: number;
    locationMatch?: number;
    durationMatch?: number;
    fieldMatch?: number;
    culturalMatch?: number;
    testRequirementsMatch?: number;
    scholarshipMatch?: number; 
  } = program.matchDetails || {};
  
  let explanation = `## Match Score: ${matchScore}%\n\n`;
  
  if (matchDetails.levelMatch) explanation += `* Study Level: ${matchDetails.levelMatch}% match\n`;
  if (matchDetails.fieldMatch) explanation += `* Field of Study: ${matchDetails.fieldMatch}% match\n`;
  if (matchDetails.locationMatch) explanation += `* Location: ${matchDetails.locationMatch}% match\n`;
  if (matchDetails.languageMatch) explanation += `* Language: ${matchDetails.languageMatch}% match\n`;
  if (matchDetails.budgetMatch) explanation += `* Budget: ${matchDetails.budgetMatch}% match\n`;
  if (matchDetails.durationMatch) explanation += `* Duration: ${matchDetails.durationMatch}% match\n`;
  if (matchDetails.scholarshipMatch) explanation += `* Scholarship: ${matchDetails.scholarshipMatch}% match\n`;
  if (matchDetails.culturalMatch) explanation += `* Cultural Factors: ${matchDetails.culturalMatch}% match\n`;
  if (matchDetails.testRequirementsMatch) explanation += `* Test Requirements: ${matchDetails.testRequirementsMatch}% match\n`;
  
  return explanation;
};

// Helper function to get text description of match quality
export const getMatchDescription = (score: number) => {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Great Match";
  if (score >= 70) return "Good Match";
  if (score >= 60) return "Fair Match";
  if (score >= 50) return "Average Match";
  return "Low Match";
};

// Modify getBudgetBreakdown to make it more modern and clear
export const getBudgetBreakdown = (program: any) => {
  if (!program) {
    return "No program data available";
  }
  
  const formatCost = (min: number, max: number, label: string) => {
    if (min && max) {
      return `* ${label}: ${formatCurrency(min, 'EUR')} - ${formatCurrency(max, 'EUR')}\n   _(${formatCurrency(min * 250, 'DZD')} - ${formatCurrency(max * 250, 'DZD')})_\n`;
    } else if (min) {
      return `* ${label}: ${formatCurrency(min, 'EUR')}\n   _(${formatCurrency(min * 250, 'DZD')})_\n`;
    }
    return '';
  };
  
  let breakdown = `## Cost Breakdown for ${program.name}\n\n`;
  
  // Tuition fees
  if (program.tuition_min || program.tuition_max) {
    breakdown += `### Tuition Fees (Annual)\n`;
    breakdown += formatCost(program.tuition_min, program.tuition_max, 'Tuition');
    breakdown += '\n';
  }
  
  // Living costs
  if (program.living_cost_min || program.living_cost_max) {
    breakdown += `### Living Costs (Monthly)\n`;
    breakdown += formatCost(program.living_cost_min, program.living_cost_max, 'Living expenses');
    
    // Housing costs if available
    if (program.housing_cost_min || program.housing_cost_max) {
      breakdown += formatCost(program.housing_cost_min, program.housing_cost_max, 'Housing');
    }
    breakdown += '\n';
  }
  
  // One-time fees
  breakdown += `### One-time Fees\n`;
  if (program.application_fee) {
    breakdown += `* Application fee: ${formatCurrency(program.application_fee, 'EUR')}\n   _(${formatCurrency(program.application_fee * 250, 'DZD')})_\n`;
  }
  if (program.visa_fee) {
    breakdown += `* Visa fee: ${formatCurrency(program.visa_fee, 'EUR')}\n   _(${formatCurrency(program.visa_fee * 250, 'DZD')})_\n`;
  }
  
  // Scholarships
  if (program.scholarship_available && program.scholarship_amount) {
    breakdown += `\n### Potential Scholarship\n`;
    breakdown += `* ${program.scholarship_details || 'Available scholarship'}: ${formatCurrency(program.scholarship_amount, 'EUR')}\n   _(${formatCurrency(program.scholarship_amount * 250, 'DZD')})_\n`;
  }
  
  return breakdown;
};

// Add a function to format currency
const formatCurrencyInternal = (amount: number, currency: 'EUR' | 'DZD') => {
  if (!amount) return 'N/A';
  
  try {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
    } else {
      return new Intl.NumberFormat('en-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(amount);
    }
  } catch (error) {
    // Fallback if Intl.NumberFormat fails
    return currency === 'EUR' ? `€${amount.toFixed(0)}` : `${amount.toFixed(0)} DZD`;
  }
};

// Modify filterPrograms to match by field of study
export const filterPrograms = (programs: any[], filters: any) => {
  if (!programs || !filters) return programs;
  
  return programs.filter(program => {
    // Filter by field of study (exact match)
    if (filters.subjects && filters.subjects.length > 0) {
      const programField = program.field?.toLowerCase();
      const fieldMatches = filters.subjects.some((subject: string) => 
        subject.toLowerCase().includes(programField) || 
        programField?.includes(subject.toLowerCase())
      );
      
      if (!fieldMatches) return false;
    }
    
    // Filter by study level
    if (filters.studyLevel) {
      if (program.study_level?.toLowerCase() !== filters.studyLevel?.toLowerCase()) {
        return false;
      }
    }
    
    // Filter by location
    if (filters.location && filters.location !== "any") {
      const programLocation = program.location?.toLowerCase();
      const programCountry = program.country?.toLowerCase();
      const filterLocation = filters.location?.toLowerCase();
      
      if (programLocation !== filterLocation && programCountry !== filterLocation) {
        return false;
      }
    }
    
    // Filter by language
    if (filters.language && filters.language !== "any") {
      if (program.language?.toLowerCase() !== filters.language?.toLowerCase()) {
        return false;
      }
    }
    
    // Filter by budget
    if (filters.budget) {
      const budgetAmount = parseInt(filters.budget);
      if (program.tuition_min > budgetAmount) {
        return false;
      }
    }
    
    // Filter by duration
    if (filters.duration) {
      const durationPreference = filters.duration.toLowerCase();
      if (!program.duration?.toLowerCase().includes(durationPreference)) {
        return false;
      }
    }
    
    // Filter by scholarship
    if (filters.scholarshipRequired) {
      if (!program.scholarship_available) {
        return false;
      }
    }
    
    return true;
  });
};
