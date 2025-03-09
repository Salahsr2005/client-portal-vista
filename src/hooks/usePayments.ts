
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
        .order("payment_date", { ascending: false });
      
      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw new Error(paymentsError.message);
      }
      
      return paymentsData.map(payment => {
        let referenceType = "Unknown";
        switch (payment.reference_type) {
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
            referenceType = payment.reference_type || "Transaction";
        }
        
        return {
          id: payment.pay_id,
          amount: `$${payment.amount.toFixed(2)}`,
          status: payment.payment_status || "Pending",
          date: payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "Not Processed",
          method: payment.payment_method || "Credit Card",
          type: referenceType,
          transactionId: payment.transaction_id || "N/A",
        };
      });
    },
  });
};
