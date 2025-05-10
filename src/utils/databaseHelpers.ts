export const handleSupabaseError = (error: any, toast: any) => {
  console.error("Supabase error:", error);
  toast({
    title: "Database Error",
    description: error.message || "An unexpected error occurred",
    variant: "destructive",
  });
};

export const formatCurrency = (amount: number, fromCurrency = "EUR", toCurrency = "EUR") => {
  // Simple currency formatter for now
  // In a real app, you'd use exchange rates
  return `€${amount.toLocaleString()}`;
};
