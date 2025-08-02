// Enhanced Program Matching Service - Field-Focused Matching

// Function to get budget breakdown with more detailed calculations
export const getBudgetBreakdown = (program: any) => {
  const tuitionMin = program.tuition_min || 0;
  const tuitionMax = program.tuition_max || 0;
  const livingCostMin = program.living_cost_min || 0;
  const livingCostMax = program.living_cost_max || 0;
  const housingCostMin = program.housing_cost_min || 0;
  const housingCostMax = program.housing_cost_max || 0;
  
  // Calculate total living costs (monthly * 12)
  const annualLivingMin = livingCostMin * 12;
  const annualLivingMax = livingCostMax * 12;
  const annualLivingAvg = ((livingCostMin + livingCostMax) / 2) * 12;
  
  // Calculate housing costs (monthly * 12)
  const annualHousingMin = housingCostMin * 12;
  const annualHousingMax = housingCostMax * 12;
  const annualHousingAvg = ((housingCostMin + housingCostMax) / 2) * 12;
  
  // Add one-time fees
  const oneTimeFees = (program.application_fee || 0) + (program.visa_fee || 0);
  
  return {
    tuition: {
      min: tuitionMin,
      max: tuitionMax,
      avg: (tuitionMin + tuitionMax) / 2
    },
    livingCosts: {
      min: annualLivingMin,
      max: annualLivingMax,
      avg: annualLivingAvg
    },
    housing: {
      min: annualHousingMin,
      max: annualHousingMax,
      avg: (housingCostMin + housingCostMax) / 2 * 12
    },
    applicationFee: program.application_fee || 0,
    visaFee: program.visa_fee || 0,
    oneTimeFees: oneTimeFees,
    total: {
      min: tuitionMin + annualLivingMin + annualHousingMin + oneTimeFees,
      max: tuitionMax + annualLivingMax + annualHousingMax + oneTimeFees,
      avg: (tuitionMin + tuitionMax) / 2 + annualLivingAvg + ((housingCostMin + housingCostMax) / 2) * 12 + oneTimeFees
    }
  };
};

// Enhanced match explanation function with more detailed analysis
export const getMatchExplanation = (program: any, matchScore: number) => {
  if (!program) return [];
  
  const explanations = [];
  
  // Add match explanations based on match score
  if (matchScore > 90) {
    explanations.push("Perfect match! This program aligns excellently with your field of interest.");
  } else if (matchScore > 80) {
    explanations.push("Strong match with your field preferences.");
  } else if (matchScore > 70) {
    explanations.push("Good match with your field of study.");
  } else if (matchScore > 60) {
    explanations.push("This program partially matches your field interests.");
  } else if (matchScore > 50) {
    explanations.push("This program has some overlap with your field preferences.");
  } else {
    explanations.push("Limited field match, but may still offer relevant content.");
  }
  
  // Add detailed explanations
  const budget = getBudgetBreakdown(program);
  
  // Add explanation about budget if available
  if (program.tuition_min && program.living_cost_min) {
    explanations.push(`Estimated total cost: €${budget.total.min.toLocaleString()} - €${budget.total.max.toLocaleString()} per year`);
  }
  
  // Add explanation about scholarship if available
  if (program.scholarship_available) {
    if (program.scholarship_details) {
      explanations.push(`Scholarship available: ${program.scholarship_details}`);
    } else {
      explanations.push("Scholarship opportunities are available for this program.");
    }
  }
  
  // Add explanation about language
  if (program.program_language) {
    explanations.push(`Program language: ${program.program_language}${program.secondary_language ? ' and ' + program.secondary_language : ''}`);
  }
  
  // Add explanation about religious facilities and halal food if relevant
  if (program.religious_facilities) {
    explanations.push("Religious facilities are available.");
  }
  
  if (program.halal_food_availability) {
    explanations.push("Halal food options are available.");
  }
  
  // Add explanation about duration
  if (program.duration_months) {
    const years = Math.floor(program.duration_months / 12);
    const months = program.duration_months % 12;
    let durationText = '';
    
    if (years > 0) {
      durationText += `${years} year${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      durationText += `${years > 0 ? ' and ' : ''}${months} month${months > 1 ? 's' : ''}`;
    }
    
    explanations.push(`Program duration: ${durationText}`);
  }
  
  return explanations;
};

// Field-centric matching algorithm with other factors affecting percentage
export const calculateMatchScore = (program: any, preferences: any) => {
  if (!program || !preferences) return 0;
  
  // Check field match first (this determines if it's a match at all)
  let fieldMatchScore = 0;
  const maxFieldScore = 100;
  
  // Field/Subject match is the primary matching criterion
  if (preferences.subjects && preferences.subjects.length > 0) {
    // Convert to lowercase for case-insensitive comparison
    const userSubjects = preferences.subjects.map((s: string) => s.toLowerCase());
    
    let bestFieldMatch = 0;
    
    // Check against program field keywords
    if (program.field_keywords && program.field_keywords.length > 0) {
      const programKeywords = program.field_keywords.map((k: string) => k.toLowerCase());
      
      // Calculate overlap percentage
      const matchingKeywords = userSubjects.filter(subject => 
        programKeywords.some(keyword => 
          keyword.includes(subject) || 
          subject.includes(keyword) ||
          // Check for semantic similarity (basic)
          areSimilarFields(subject, keyword)
        )
      );
      
      bestFieldMatch = Math.max(bestFieldMatch, (matchingKeywords.length / userSubjects.length) * 100);
    }
    
    // Also check the main field
    if (program.field) {
      const programField = program.field.toLowerCase();
      const matchingSubjects = userSubjects.filter(subject => 
        programField.includes(subject) || 
        subject.includes(programField) ||
        areSimilarFields(subject, programField)
      );
      
      bestFieldMatch = Math.max(bestFieldMatch, (matchingSubjects.length / userSubjects.length) * 100);
    }
    
    fieldMatchScore = Math.min(bestFieldMatch, maxFieldScore);
  } else if (preferences.field && program.field) {
    // Simple field comparison if no specific subjects
    const userField = preferences.field.toLowerCase();
    const programField = program.field.toLowerCase();
    
    if (userField === programField) {
      fieldMatchScore = 100;
    } else if (programField.includes(userField) || userField.includes(programField)) {
      fieldMatchScore = 80;
    } else if (areSimilarFields(userField, programField)) {
      fieldMatchScore = 60;
    }
  }
  
  // If there's no significant field match, return low score
  if (fieldMatchScore < 30) {
    return Math.max(fieldMatchScore, 10); // Minimum 10% for any program
  }
  
  // Now calculate adjustment factors that modify the field score
  let adjustmentFactor = 1.0; // Start with 100% of field score
  
  // Study Level match (can boost or reduce by up to 20%)
  if (program.study_level === preferences.level) {
    adjustmentFactor += 0.1; // +10% bonus
  } else if (preferences.level && program.study_level !== preferences.level) {
    adjustmentFactor -= 0.15; // -15% penalty
  }
  
  // Budget match (can reduce significantly if over budget)
  const userBudget = typeof preferences.budget === 'string' ? parseInt(preferences.budget, 10) : preferences.budget;
  if (userBudget) {
    const programTotalCost = (program.tuition_min || 0) + ((program.living_cost_min || 0) * 12);
    
    if (userBudget >= programTotalCost) {
      adjustmentFactor += 0.05; // +5% bonus for affordable programs
    } else if (userBudget >= programTotalCost * 0.8) {
      // Within 20% of budget - slight penalty
      adjustmentFactor -= 0.05;
    } else if (userBudget >= programTotalCost * 0.6) {
      // Significantly over budget
      adjustmentFactor -= 0.2;
    } else {
      // Way over budget
      adjustmentFactor -= 0.3;
    }
  }
  
  // Language match (can boost or reduce by up to 15%)
  if (preferences.language && (
    program.program_language?.toLowerCase() === preferences.language.toLowerCase() ||
    program.secondary_language?.toLowerCase() === preferences.language.toLowerCase()
  )) {
    adjustmentFactor += 0.1; // +10% bonus
  } else if (preferences.language && preferences.language !== 'English' && program.program_language !== preferences.language) {
    adjustmentFactor -= 0.1; // -10% penalty for language mismatch
  }
  
  // Location preference (can boost by up to 10%)
  if (preferences.destination && (
    program.country?.toLowerCase() === preferences.destination.toLowerCase() ||
    program.city?.toLowerCase() === preferences.destination.toLowerCase()
  )) {
    adjustmentFactor += 0.1; // +10% bonus
  }
  
  // Special requirements (can boost by up to 15%)
  let specialReqsBonus = 0;
  let specialReqCount = 0;
  
  if (preferences.religiousFacilities || preferences.specialRequirements?.religiousFacilities) {
    specialReqCount++;
    if (program.religious_facilities) {
      specialReqsBonus += 0.05;
    }
  }
  
  if (preferences.halalFood || preferences.specialRequirements?.halalFood) {
    specialReqCount++;
    if (program.halal_food_availability) {
      specialReqsBonus += 0.05;
    }
  }
  
  if (preferences.scholarshipRequired || preferences.specialRequirements?.scholarshipRequired) {
    specialReqCount++;
    if (program.scholarship_available) {
      specialReqsBonus += 0.05;
    }
  }
  
  adjustmentFactor += specialReqsBonus;
  
  // Duration preference (can adjust by up to 10%)
  if (preferences.duration && program.duration_months) {
    let preferredMonths = 0;
    if (preferences.duration === 'semester') preferredMonths = 6;
    else if (preferences.duration === 'year') preferredMonths = 12;
    else if (preferences.duration === 'two_years') preferredMonths = 24;
    else if (preferences.duration === 'full') preferredMonths = 36;
    
    if (preferredMonths > 0) {
      const durationDiff = Math.abs(program.duration_months - preferredMonths);
      if (durationDiff <= 3) {
        adjustmentFactor += 0.05; // +5% for exact match
      } else if (durationDiff > 12) {
        adjustmentFactor -= 0.1; // -10% for significant difference
      }
    }
  }
  
  // Apply adjustment factor with bounds
  adjustmentFactor = Math.max(0.3, Math.min(1.3, adjustmentFactor)); // Between 30% and 130%
  
  // Calculate final score
  const finalScore = fieldMatchScore * adjustmentFactor;
  
  return Math.round(Math.max(10, Math.min(100, finalScore))); // Between 10% and 100%
};

// Helper function to check if two fields are semantically similar
function areSimilarFields(field1: string, field2: string): boolean {
  const similarFields = {
    'computer science': ['cs', 'computing', 'informatics', 'software engineering', 'programming'],
    'business': ['management', 'administration', 'commerce', 'entrepreneurship', 'finance'],
    'engineering': ['technology', 'technical', 'applied sciences'],
    'medicine': ['medical', 'health', 'healthcare', 'clinical'],
    'arts': ['fine arts', 'creative', 'design', 'visual'],
    'science': ['sciences', 'research', 'scientific'],
    'economics': ['economic', 'finance', 'financial'],
    'psychology': ['psychological', 'behavioral', 'cognitive'],
    'mathematics': ['math', 'mathematical', 'statistics', 'statistical'],
    'physics': ['physical', 'theoretical physics'],
    'chemistry': ['chemical', 'biochemistry'],
    'biology': ['biological', 'life sciences', 'biomedical']
  };
  
  for (const [main, variants] of Object.entries(similarFields)) {
    if ((field1.includes(main) || variants.some(v => field1.includes(v))) &&
        (field2.includes(main) || variants.some(v => field2.includes(v)))) {
      return true;
    }
  }
  
  return false;
}

// Function to get country flag image URL
export const getCountryFlagUrl = (countryName: string) => {
  const countryCodeMap: {[key: string]: string} = {
    'france': 'fr',
    'germany': 'de',
    'spain': 'es',
    'italy': 'it',
    'united kingdom': 'gb',
    'uk': 'gb',
    'netherlands': 'nl',
    'belgium': 'be',
    'poland': 'pl',
    'portugal': 'pt',
    'sweden': 'se',
    'ireland': 'ie',
    'austria': 'at',
    'denmark': 'dk',
    'finland': 'fi',
    'norway': 'no',
    'switzerland': 'ch',
  };
  
  const countryCode = countryCodeMap[countryName.toLowerCase()] || '';
  
  if (countryCode) {
    return `https://flagcdn.com/w80/${countryCode}.png`;
  }
  
  return `/placeholder.svg?text=${encodeURIComponent(countryName.substring(0, 2).toUpperCase())}`;
};