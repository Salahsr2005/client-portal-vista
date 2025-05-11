
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
    total: {
      min: tuitionMin + (livingCostMin * 12),
      max: tuitionMax + (livingCostMax * 12),
      avg: (tuitionMin + tuitionMax) / 2 + ((livingCostMin + livingCostMax) / 2) * 12
    }
  };
};
