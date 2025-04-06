
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePayments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["payments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("client_id", user.id)
        .order("date", { ascending: false });
      
      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw new Error(paymentsError.message);
      }
      
      return paymentsData.map(payment => {
        let referenceType = "Unknown";
        switch (payment.reference) {
          case "application":
            referenceType = "Application Fee";
            break;
          case "service":
            referenceType = "Service Fee";
            break;
          case "program":
            referenceType = "Program Fee";
            break;
          default:
            referenceType = payment.reference || "Transaction";
        }
        
        return {
          id: payment.payment_id,
          amount: `$${payment.amount.toFixed(2)}`,
          status: payment.status || "Pending",
          date: payment.date ? new Date(payment.date).toLocaleDateString() : "Not Processed",
          method: payment.method || "Credit Card",
          type: referenceType,
          transactionId: payment.transaction_id || "N/A",
        };
      });
    },
  });
};
