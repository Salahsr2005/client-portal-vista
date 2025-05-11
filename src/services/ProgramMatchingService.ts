
// This is a utility service for program matching functionality

// Function to get budget breakdown
export const getBudgetBreakdown = (program: any) => {
  const tuitionMin = program.tuition_min || 0;
  const tuitionMax = program.tuition_max || 0;
  const livingCostMin = program.living_cost_min || 0;
  const livingCostMax = program.living_cost_max || 0;
  
  return {
    tuition: {
      min: tuitionMin,
      max: tuitionMax,
      avg: (tuitionMin + tuitionMax) / 2
    },
    livingCosts: {
      min: livingCostMin * 12, // annual
      max: livingCostMax * 12,
      avg: ((livingCostMin + livingCostMax) / 2) * 12
    },
    housing: {
      min: (program.housing_cost_min || 0) * 12,
      max: (program.housing_cost_max || 0) * 12,
      avg: ((program.housing_cost_min || 0) + (program.housing_cost_max || 0)) / 2 * 12
    },
    applicationFee: program.application_fee || 0,
    visaFee: program.visa_fee || 0,
    total: {
      min: tuitionMin + (livingCostMin * 12),
      max: tuitionMax + (livingCostMax * 12),
      avg: (tuitionMin + tuitionMax) / 2 + ((livingCostMin + livingCostMax) / 2) * 12
    }
  };
};

// Add missing getMatchExplanation function that's referenced in ProgramList component
export const getMatchExplanation = (program: any, matchScore: number) => {
  if (!program) return [];
  
  const explanations = [];
  
  // Add match explanations based on match score
  if (matchScore > 80) {
    explanations.push("This program strongly matches your preferences.");
  } else if (matchScore > 60) {
    explanations.push("This program is a good match for your preferences.");
  } else {
    explanations.push("This program partially matches your preferences.");
  }
  
  // Add explanation about budget if available
  if (program.tuition_min && program.living_cost_min) {
    explanations.push(`Estimated total cost: €${(program.tuition_min + (program.living_cost_min * 12)).toLocaleString()} - €${(program.tuition_max + (program.living_cost_max * 12)).toLocaleString()}`);
  }
  
  // Add explanation about scholarship if available
  if (program.scholarship_available) {
    explanations.push("Scholarship opportunities are available for this program.");
  }
  
  // Add explanation about language
  if (program.program_language) {
    explanations.push(`Program language: ${program.program_language}`);
  }
  
  return explanations;
};
