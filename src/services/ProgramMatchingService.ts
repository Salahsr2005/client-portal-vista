
import { Program, ProgramFilter } from "@/hooks/usePrograms";

export interface MatchScoreDetails {
  budgetMatch: number;
  languageMatch: number;
  levelMatch: number;
  locationMatch: number;
  durationMatch: number;
  fieldMatch: number;
  culturalMatch: number;
  scholarshipMatch?: number;
  testRequirementsMatch?: number;
  totalScore: number;
}

export interface MatchedProgram extends Program {
  matchScore: number;
  matchDetails: MatchScoreDetails;
}

/**
 * Calculates match score between user preferences and program
 * Returns a score from 0-100 and detailed breakdown
 */
export const calculateProgramMatch = (program: Program, filters: ProgramFilter): MatchedProgram => {
  // Initialize score components
  let budgetMatch = 0;
  let languageMatch = 0;
  let levelMatch = 0;
  let locationMatch = 0;
  let durationMatch = 0;
  let fieldMatch = 0;
  let culturalMatch = 0;
  let scholarshipMatch = 0;
  let testRequirementsMatch = 0;
  
  // Total possible points - now adding test requirements
  const MAX_SCORE = 100;
  const BUDGET_MAX = 25;
  const LANGUAGE_MAX = 15;
  const LEVEL_MAX = 20;
  const LOCATION_MAX = 10;
  const DURATION_MAX = 10;
  const FIELD_MAX = 10;
  const CULTURAL_MAX = 5;
  const TEST_REQ_MAX = 5;
  
  // Calculate budget match (max 25 points)
  if (filters.budget) {
    const userBudget = parseInt(filters.budget);
    // Calculate total program cost (tuition + living expenses) - always in EUR
    const programTuition = typeof program.tuition_min === 'number' ? program.tuition_min : 
                         (parseInt(program.tuition?.replace(/[^0-9]/g, '') || '0'));
    const livingCost = program.living_cost_min || 0;
    const programCost = programTuition + (livingCost * 12);
    
    if (userBudget >= programCost) {
      budgetMatch = BUDGET_MAX; // Perfect match
    } else if (userBudget >= programCost * 0.85) {
      budgetMatch = Math.round(BUDGET_MAX * 0.9); // 90% budget match
    } else if (userBudget >= programCost * 0.7) {
      budgetMatch = Math.round(BUDGET_MAX * 0.7); // 70% budget match
    } else if (userBudget >= programCost * 0.5) {
      budgetMatch = Math.round(BUDGET_MAX * 0.5); // 50% budget match
    } else {
      budgetMatch = Math.round(BUDGET_MAX * 0.25); // Low budget match
    }
  } else {
    budgetMatch = Math.round(BUDGET_MAX * 0.5); // Neutral when no budget specified
  }
  
  // Calculate study level match (max 20 points)
  if (filters.studyLevel) {
    if (program.type?.toLowerCase() === filters.studyLevel.toLowerCase() ||
        program.study_level?.toLowerCase() === filters.studyLevel.toLowerCase()) {
      levelMatch = LEVEL_MAX; // Perfect match
    } else {
      // Check if there's any similarity (e.g. Bachelor vs Undergraduate)
      const similarLevels: Record<string, string[]> = {
        "bachelor": ["undergraduate", "licence", "bachelor's"],
        "master": ["graduate", "postgraduate", "master's"],
        "phd": ["doctorate", "doctoral", "research"],
        "certificate": ["diploma", "short course", "professional certificate"]
      };
      
      const userLevel = filters.studyLevel.toLowerCase();
      const programLevel = (program.study_level || program.type || "").toLowerCase();
      
      let hasSimilarity = false;
      for (const [key, values] of Object.entries(similarLevels)) {
        if ((userLevel === key || values.some(v => userLevel.includes(v))) && 
            (programLevel === key || values.some(v => programLevel.includes(v)))) {
          hasSimilarity = true;
          break;
        }
      }
      
      levelMatch = hasSimilarity ? Math.round(LEVEL_MAX * 0.6) : Math.round(LEVEL_MAX * 0.2);
    }
  } else {
    levelMatch = Math.round(LEVEL_MAX * 0.6); // Neutral when no level specified
  }
  
  // Calculate language match (max 15 points)
  const programLanguage = program.program_language || program.language || '';
  if (programLanguage && filters.language) {
    if (programLanguage.toLowerCase() === filters.language.toLowerCase()) {
      languageMatch = LANGUAGE_MAX; // Perfect match
    } else {
      // Check if the program offers courses in the user's preferred language
      const hasPreferredLanguage = program.secondary_language?.toLowerCase() === filters.language.toLowerCase();
      languageMatch = hasPreferredLanguage ? Math.round(LANGUAGE_MAX * 0.7) : Math.round(LANGUAGE_MAX * 0.3);
    }
  } else {
    languageMatch = Math.round(LANGUAGE_MAX * 0.5); // Neutral when no language specified
  }
  
  // Calculate location match (max 10 points)
  if (filters.location) {
    if (program.location?.toLowerCase() === filters.location.toLowerCase() || 
        program.country?.toLowerCase() === filters.location.toLowerCase()) {
      locationMatch = LOCATION_MAX; // Perfect match
    } else if (filters.location === "any") {
      locationMatch = Math.round(LOCATION_MAX * 0.7); // User doesn't care
    } else {
      // Check regions (e.g., if user wants Europe and program is in a European country)
      const europeanCountries = ["france", "spain", "belgium", "germany", "italy", "netherlands", 
                               "portugal", "poland", "greece", "austria", "sweden", "denmark",
                               "finland", "ireland", "luxembourg"];
      
      if (filters.location.toLowerCase() === "europe" && 
          europeanCountries.includes(program.country?.toLowerCase() || '')) {
        locationMatch = Math.round(LOCATION_MAX * 0.8);
      } else {
        locationMatch = Math.round(LOCATION_MAX * 0.3); // Different location
      }
    }
  } else {
    locationMatch = Math.round(LOCATION_MAX * 0.5); // Neutral when no location specified
  }
  
  // Calculate duration match (max 10 points) - now with preparatory/full degree option
  if (filters.duration) {
    // Handle string-based duration preferences
    if (filters.duration === "preparatory") {
      // Preparatory programs are typically shorter (less than 12 months)
      const isPrepProgram = (program.duration_months || 0) <= 12;
      durationMatch = isPrepProgram ? DURATION_MAX : Math.round(DURATION_MAX * 0.2);
    } else if (filters.duration === "full_degree") {
      // Full degree programs are typically longer
      const isFullDegree = (program.duration_months || 0) >= 24;
      durationMatch = isFullDegree ? DURATION_MAX : Math.round(DURATION_MAX * 0.2);
    } else {
      // Legacy numeric duration handling
      const targetDuration = parseInt(filters.duration);
      const programDuration = program.duration_months || parseInt(program.duration?.match(/\d+/)?.[0] || '0');
      
      const durationDifference = Math.abs(programDuration - targetDuration);
      if (durationDifference <= 3) {
        durationMatch = DURATION_MAX; // Within 3 months of target
      } else if (durationDifference <= 6) {
        durationMatch = Math.round(DURATION_MAX * 0.8); // Within 6 months of target
      } else if (durationDifference <= 12) {
        durationMatch = Math.round(DURATION_MAX * 0.5); // Within a year of target
      } else {
        durationMatch = Math.round(DURATION_MAX * 0.3); // More than a year off
      }
    }
  } else {
    durationMatch = Math.round(DURATION_MAX * 0.5); // Neutral when no duration specified
  }
  
  // Calculate field/subject match (max 10 points)
  if (filters.subjects && filters.subjects.length > 0) {
    let hasMatch = false;
    let partialMatch = false;
    
    // Check if program's field_keywords match any of the user's subjects
    if (program.field_keywords && Array.isArray(program.field_keywords)) {
      for (const subject of filters.subjects) {
        for (const keyword of program.field_keywords) {
          if (keyword.toLowerCase().includes(subject.toLowerCase()) || 
              subject.toLowerCase().includes(keyword.toLowerCase())) {
            hasMatch = true;
            break;
          }
        }
        if (hasMatch) break;
      }
    }
    
    // Check program name, field and description as fallback
    if (!hasMatch) {
      for (const subject of filters.subjects) {
        const subjectLower = subject.toLowerCase();
        if ((program.name && program.name.toLowerCase().includes(subjectLower)) || 
            (program.field && program.field.toLowerCase().includes(subjectLower)) ||
            (program.description && program.description.toLowerCase().includes(subjectLower))) {
          partialMatch = true;
          break;
        }
      }
    }
    
    if (hasMatch) {
      fieldMatch = FIELD_MAX; // Perfect match
    } else if (partialMatch) {
      fieldMatch = Math.round(FIELD_MAX * 0.7); // Partial match
    } else {
      fieldMatch = Math.round(FIELD_MAX * 0.2); // No match
    }
  } else {
    fieldMatch = Math.round(FIELD_MAX * 0.5); // Neutral when no subjects specified
  }
  
  // Calculate cultural accommodations match (max 5 points)
  if (filters.religiousFacilities || filters.halalFood) {
    let religiousFacilitiesMatch = filters.religiousFacilities ? (program.religious_facilities ? 2.5 : 0) : 2.5;
    let halalFoodMatch = filters.halalFood ? (program.halal_food_availability ? 2.5 : 0) : 2.5;
    
    // Community support can partially compensate for missing facilities
    if ((filters.religiousFacilities && !program.religious_facilities) || 
        (filters.halalFood && !program.halal_food_availability)) {
      if (program.north_african_community_size === 'Large' || program.north_african_community_size === 'Medium') {
        if (filters.religiousFacilities && !program.religious_facilities) religiousFacilitiesMatch = 1;
        if (filters.halalFood && !program.halal_food_availability) halalFoodMatch = 1;
      }
    }
    
    culturalMatch = religiousFacilitiesMatch + halalFoodMatch;
  } else {
    culturalMatch = CULTURAL_MAX; // Max score if user doesn't require these accommodations
  }
  
  // Calculate language test requirements match (new - max 5 points)
  if (filters.languageTestRequired !== undefined) {
    const hasLanguageTest = !!program.language_test_score || !!program.language_test;
    
    if (filters.languageTestRequired && hasLanguageTest) {
      testRequirementsMatch = TEST_REQ_MAX; // User wants program with test requirements
    } else if (!filters.languageTestRequired && !hasLanguageTest) {
      testRequirementsMatch = TEST_REQ_MAX; // User doesn't want test requirements
    } else if (filters.languageTestRequired && !hasLanguageTest) {
      testRequirementsMatch = 0; // User wants test but program doesn't require it
    } else {
      // User doesn't want test but program requires it - check for exemptions
      testRequirementsMatch = program.language_test_exemptions ? Math.round(TEST_REQ_MAX * 0.6) : Math.round(TEST_REQ_MAX * 0.2);
    }
  } else {
    testRequirementsMatch = Math.round(TEST_REQ_MAX * 0.5); // Neutral
  }
  
  // Calculate scholarship match if required
  if (filters.scholarshipRequired) {
    scholarshipMatch = program.scholarship_available ? 5 : 0;
  } else {
    scholarshipMatch = 5; // Max score if user doesn't require scholarship
  }
  
  // Calculate total score (weighted average)
  const totalRawScore = budgetMatch + languageMatch + levelMatch + locationMatch + 
                       durationMatch + fieldMatch + culturalMatch + scholarshipMatch + 
                       testRequirementsMatch;
  
  // Convert to percentage (0-100)
  const totalMaxScore = BUDGET_MAX + LANGUAGE_MAX + LEVEL_MAX + LOCATION_MAX + 
                       DURATION_MAX + FIELD_MAX + CULTURAL_MAX + 5 + TEST_REQ_MAX; // +5 for scholarship
  const totalScore = Math.round((totalRawScore / totalMaxScore) * 100);
  
  // Create match details
  const matchDetails: MatchScoreDetails = {
    budgetMatch: Math.round((budgetMatch / BUDGET_MAX) * 100),
    languageMatch: Math.round((languageMatch / LANGUAGE_MAX) * 100),
    levelMatch: Math.round((levelMatch / LEVEL_MAX) * 100),
    locationMatch: Math.round((locationMatch / LOCATION_MAX) * 100),
    durationMatch: Math.round((durationMatch / DURATION_MAX) * 100),
    fieldMatch: Math.round((fieldMatch / FIELD_MAX) * 100),
    culturalMatch: Math.round((culturalMatch / CULTURAL_MAX) * 100),
    testRequirementsMatch: Math.round((testRequirementsMatch / TEST_REQ_MAX) * 100),
    scholarshipMatch: filters.scholarshipRequired ? (program.scholarship_available ? 100 : 0) : 100,
    totalScore
  };
  
  // Return program with match score
  return {
    ...program,
    matchScore: totalScore,
    matchDetails
  };
};

/**
 * Takes a list of programs and user preferences and returns
 * the programs sorted by match score
 */
export const getMatchingPrograms = (programs: Program[], filters: ProgramFilter): MatchedProgram[] => {
  // Calculate match score for each program
  const matchedPrograms = programs.map(program => calculateProgramMatch(program, filters));
  
  // Sort by match score (highest first)
  return matchedPrograms.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};

/**
 * Returns a text explanation of the match score
 */
export const getMatchExplanation = (program: MatchedProgram): string => {
  if (!program.matchDetails) return '';
  
  const explanations = [];
  
  // Budget compatibility
  if (program.matchDetails.budgetMatch >= 80) {
    explanations.push('💶 Budget: Excellent match - your budget fully covers tuition and living expenses.');
  } else if (program.matchDetails.budgetMatch >= 60) {
    explanations.push('💶 Budget: Good match - your budget covers most expenses, additional funding may be helpful.');
  } else {
    explanations.push('💶 Budget: Limited match - this program may be challenging for your budget.');
  }
  
  // Study level match
  if (program.matchDetails.levelMatch >= 80) {
    explanations.push('🎓 Study Level: Excellent match - the program level exactly matches what you\'re looking for.');
  } else if (program.matchDetails.levelMatch >= 50) {
    explanations.push('🎓 Study Level: Good match - the program level is similar to what you\'re looking for.');
  } else {
    explanations.push('🎓 Study Level: Limited match - this program is at a different level than requested.');
  }
  
  // Language match
  if (program.matchDetails.languageMatch >= 80) {
    explanations.push('🗣️ Language: Excellent match - program language aligns perfectly with your preferences.');
  } else if (program.matchDetails.languageMatch >= 50) {
    explanations.push('🗣️ Language: Good match - program offers courses in your preferred language.');
  } else {
    explanations.push('🗣️ Language: Limited match - you may need additional language preparation.');
  }
  
  // Location match
  if (program.matchDetails.locationMatch >= 80) {
    explanations.push('📍 Location: Excellent match - program is in your preferred location.');
  } else if (program.matchDetails.locationMatch >= 50) {
    explanations.push('📍 Location: Good match - program is in a similar region to your preference.');
  } else {
    explanations.push('📍 Location: Limited match - program is in a different location than preferred.');
  }
  
  // Field match
  if (program.matchDetails.fieldMatch >= 80) {
    explanations.push('📚 Field of Study: Excellent match - program field matches your interests very well.');
  } else if (program.matchDetails.fieldMatch >= 50) {
    explanations.push('📚 Field of Study: Good match - program is related to your field of interest.');
  } else {
    explanations.push('📚 Field of Study: Limited match - program is in a different field than your preference.');
  }

  // Test requirements
  if (program.matchDetails.testRequirementsMatch) {
    if (program.matchDetails.testRequirementsMatch >= 80) {
      explanations.push('📝 Language Test: Perfect match with your preferences for language test requirements.');
    } else if (program.matchDetails.testRequirementsMatch >= 50) {
      explanations.push('📝 Language Test: Acceptable match, but test requirements differ slightly from preferences.');
    } else {
      explanations.push('📝 Language Test: Not matching your preferences for language testing requirements.');
    }
  }
  
  // Additional factors
  if (program.matchDetails.scholarshipMatch === 100) {
    if (program.scholarship_available) {
      explanations.push('🏆 Scholarship: Available - this program offers scholarships you requested.');
    } else {
      explanations.push('🏆 Scholarship: Not required - as per your preferences.');
    }
  } else {
    explanations.push('🏆 Scholarship: Not available - but you indicated this was important to you.');
  }
  
  return explanations.join('\n');
};

/**
 * Returns a visual representation of budget compatibility 
 * for easy comparison in euros
 */
export const getBudgetBreakdown = (program: Program): string => {
  const tuition = typeof program.tuition_min === 'number' ? program.tuition_min : 
                parseInt(program.tuition?.replace(/[^0-9]/g, '') || '0');
  const livingCost = program.living_cost_min || 0;
  const applicationFee = program.application_fee || 0;
  const visaFee = program.visa_fee || 0;
  
  return `
Annual Expenses (in €):
• Tuition: €${tuition.toLocaleString()}
• Living Expenses: €${(livingCost * 12).toLocaleString()} (€${livingCost.toLocaleString()}/month)
• Application Fee: €${applicationFee.toLocaleString()}
• Visa Fee: €${visaFee.toLocaleString()}

Total Annual Cost: €${(tuition + (livingCost * 12) + applicationFee + visaFee).toLocaleString()}
  `;
};
