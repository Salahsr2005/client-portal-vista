
// This is a utility service for program matching functionality

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
    explanations.push("Perfect match! This program aligns excellently with your preferences.");
  } else if (matchScore > 80) {
    explanations.push("Strong match with your preferences.");
  } else if (matchScore > 70) {
    explanations.push("Good match with your preferences.");
  } else if (matchScore > 60) {
    explanations.push("This program matches many of your preferences.");
  } else if (matchScore > 50) {
    explanations.push("This program partially matches your preferences.");
  } else {
    explanations.push("Limited match, but may still be worth considering.");
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

// New advanced matching algorithm that provides more accurate recommendations
export const calculateMatchScore = (program: any, preferences: any) => {
  if (!program || !preferences) return 0;
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  // Study Level match (high importance)
  const weightLevel = 20;
  maxPossibleScore += weightLevel;
  if (program.study_level === preferences.level) {
    totalScore += weightLevel;
  }
  
  // Field/Subject match (high importance)
  const weightField = 20;
  maxPossibleScore += weightField;
  
  // Check if any of the user's subjects match the program's field keywords
  let fieldMatch = false;
  if (preferences.subjects && preferences.subjects.length > 0) {
    // Convert to lowercase for case-insensitive comparison
    const userSubjects = preferences.subjects.map((s: string) => s.toLowerCase());
    
    if (program.field_keywords && program.field_keywords.length > 0) {
      const programKeywords = program.field_keywords.map((k: string) => k.toLowerCase());
      
      // Check for any overlap between user subjects and program keywords
      fieldMatch = userSubjects.some((subject: string) => 
        programKeywords.some(keyword => keyword.includes(subject) || subject.includes(keyword))
      );
    }
    
    // Also check the main field
    if (!fieldMatch && program.field) {
      const programField = program.field.toLowerCase();
      fieldMatch = userSubjects.some((subject: string) => 
        programField.includes(subject) || subject.includes(programField)
      );
    }
  }
  
  if (fieldMatch) {
    totalScore += weightField;
  }
  
  // Budget match (medium-high importance)
  const weightBudget = 15;
  maxPossibleScore += weightBudget;
  const userBudget = typeof preferences.budget === 'string' ? parseInt(preferences.budget, 10) : preferences.budget;
  
  if (userBudget) {
    const programTotalCost = (program.tuition_min || 0) + ((program.living_cost_min || 0) * 12);
    
    if (userBudget >= programTotalCost) {
      // Full budget match
      totalScore += weightBudget;
    } else if (userBudget >= programTotalCost * 0.8) {
      // 80% budget match
      totalScore += Math.floor(weightBudget * 0.8);
    } else if (userBudget >= programTotalCost * 0.6) {
      // 60% budget match
      totalScore += Math.floor(weightBudget * 0.5);
    }
  }
  
  // Language match (medium importance)
  const weightLanguage = 15;
  maxPossibleScore += weightLanguage;
  if (preferences.language && (
    program.program_language?.toLowerCase() === preferences.language.toLowerCase() ||
    program.secondary_language?.toLowerCase() === preferences.language.toLowerCase()
  )) {
    totalScore += weightLanguage;
  } else if (preferences.language === 'English' && program.program_language === 'English') {
    totalScore += weightLanguage;
  }
  
  // Location/Destination match (medium importance)
  const weightLocation = 10;
  maxPossibleScore += weightLocation;
  if (preferences.destination && (
    program.country?.toLowerCase() === preferences.destination.toLowerCase() ||
    program.city?.toLowerCase() === preferences.destination.toLowerCase()
  )) {
    totalScore += weightLocation;
  }
  
  // Special requirements match (medium importance)
  const weightSpecialReqs = 10;
  maxPossibleScore += weightSpecialReqs;
  
  let specialReqsScore = 0;
  let specialReqCount = 0;
  
  // Check religious facilities
  if (preferences.religiousFacilities || preferences.specialRequirements?.religiousFacilities) {
    specialReqCount++;
    if (program.religious_facilities) {
      specialReqsScore++;
    }
  }
  
  // Check halal food
  if (preferences.halalFood || preferences.specialRequirements?.halalFood) {
    specialReqCount++;
    if (program.halal_food_availability) {
      specialReqsScore++;
    }
  }
  
  // Check scholarship
  if (preferences.scholarshipRequired || preferences.specialRequirements?.scholarshipRequired) {
    specialReqCount++;
    if (program.scholarship_available) {
      specialReqsScore++;
    }
  }
  
  // Calculate percentage of special requirements met
  if (specialReqCount > 0) {
    totalScore += Math.floor((specialReqsScore / specialReqCount) * weightSpecialReqs);
  } else {
    totalScore += weightSpecialReqs; // If no special requirements, give full score
  }
  
  // Duration match (lower importance)
  const weightDuration = 10;
  maxPossibleScore += weightDuration;
  
  // Convert duration preference to months for comparison
  let preferredMonths = 0;
  if (preferences.duration === 'semester') {
    preferredMonths = 6;
  } else if (preferences.duration === 'year') {
    preferredMonths = 12;
  } else if (preferences.duration === 'two_years') {
    preferredMonths = 24;
  } else if (preferences.duration === 'full') {
    preferredMonths = 36;
  }
  
  if (preferredMonths > 0 && program.duration_months) {
    const durationDiff = Math.abs(program.duration_months - preferredMonths);
    
    if (durationDiff <= 3) {
      totalScore += weightDuration;
    } else if (durationDiff <= 6) {
      totalScore += Math.floor(weightDuration * 0.75);
    } else if (durationDiff <= 12) {
      totalScore += Math.floor(weightDuration * 0.5);
    } else {
      totalScore += Math.floor(weightDuration * 0.25);
    }
  }
  
  // Calculate final percentage score
  return Math.round((totalScore / maxPossibleScore) * 100);
};

// Function to get country flag image URL
export const getCountryFlagUrl = (countryName: string) => {
  // Map country names to ISO country codes for flags
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
    // Add more countries as needed
  };
  
  const countryCode = countryCodeMap[countryName.toLowerCase()] || '';
  
  if (countryCode) {
    return `https://flagcdn.com/w80/${countryCode}.png`;
  }
  
  // Return a placeholder if country code not found
  return `/placeholder.svg?text=${encodeURIComponent(countryName.substring(0, 2).toUpperCase())}`;
};
