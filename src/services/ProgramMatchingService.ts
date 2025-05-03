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

  // Study Level Match
  if (program.study_level?.toLowerCase() === filter.studyLevel?.toLowerCase()) {
    score += 15;
    details.levelMatch = 100;
  } else {
    details.levelMatch = 0;
  }

  // Field of Study Match
  if (filter.subjects && filter.subjects.length > 0) {
    const programField = program.field?.toLowerCase();
    const fieldMatches = filter.subjects.some((subject: string) =>
      subject.toLowerCase().includes(programField) ||
      programField?.includes(subject.toLowerCase())
    );

    if (fieldMatches) {
      score += 20;
      details.fieldMatch = 100;
    } else {
      details.fieldMatch = 0;
    }
  }

  // Location Match
  if (filter.location && filter.location !== "any") {
    if (program.location?.toLowerCase() === filter.location?.toLowerCase() || program.country?.toLowerCase() === filter.location?.toLowerCase()) {
      score += 15;
      details.locationMatch = 100;
    } else {
      details.locationMatch = 0;
    }
  } else {
    details.locationMatch = 50; // Partial match if no location preference
  }

  // Language Match
  if (filter.language && filter.language !== "any") {
    if (program.language?.toLowerCase() === filter.language?.toLowerCase()) {
      score += 15;
      details.languageMatch = 100;
    } else {
      details.languageMatch = 0;
    }
  } else {
    details.languageMatch = 50; // Partial match if no language preference
  }

  // Budget Match
  const programTuition = program.tuition_min || program.tuition;
  if (filter.budget) {
    const budgetAmount = parseInt(filter.budget);
    if (programTuition <= budgetAmount) {
      score += 15;
      details.budgetMatch = 100;
    } else {
      details.budgetMatch = 0;
    }
  } else {
    details.budgetMatch = 50; // Partial match if no budget preference
  }

  // Duration Match
  if (filter.duration) {
    const durationPreference = filter.duration.toLowerCase();
    if (program.duration?.toLowerCase().includes(durationPreference)) {
      score += 10;
      details.durationMatch = 100;
    } else {
      details.durationMatch = 0;
    }
  } else {
    details.durationMatch = 50; // Partial match if no duration preference
  }
  
  // Scholarship Match
  if (filter.scholarshipRequired) {
    if (program.scholarship_available) {
      score += 10;
      details.scholarshipMatch = 100;
    } else {
      details.scholarshipMatch = 0;
    }
  } else {
    details.scholarshipMatch = 50; // Partial match if no scholarship preference
  }

  // Cultural Factors Match (Religious Facilities, Halal Food)
  let culturalScore = 0;
  if (filter.religiousFacilities && program.religious_facilities) culturalScore += 5;
  if (filter.halalFood && program.halal_food) culturalScore += 5;
  score += culturalScore;
  details.culturalMatch = culturalScore;

  // Language Test Requirements Match
  if (filter.languageTestRequired) {
    if (program.language_test_required) {
      score += 10;
      details.testRequirementsMatch = 100;
    } else {
      details.testRequirementsMatch = 0;
    }
  } else {
    details.testRequirementsMatch = 50; // Partial match if no language test preference
  }

  // Ensure the score is within the valid range (0-100)
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
    scholarshipMatch?: number; // Add this property
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
