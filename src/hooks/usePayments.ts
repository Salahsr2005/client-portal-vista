
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
        .select(`
          *,
          applications(
            application_id,
            program_id,
            programs(name, university)
          )
        `)
        .eq("client_id", user.id)
        .order("date", { ascending: false });
      
      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw new Error(paymentsError.message);
      }
      
      return paymentsData.map(payment => {
        let referenceType = "Unknown";
        let programName = payment.applications?.programs?.name || "Program Fee";
        let universityName = payment.applications?.programs?.university || "";
        
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
          description: payment.description || `${referenceType} - ${programName}`,
          transactionId: payment.transaction_id || "N/A",
          applicationId: payment.applications?.application_id || null,
          programName,
          universityName,
        };
      });
    },
  });
};

export const usePendingApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["pending-payments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          programs(name, university, application_fee)
        `)
        .eq("client_id", user.id)
        .eq("payment_status", "Pending")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching pending applications:", error);
        throw new Error(error.message);
      }
      
      return data.map(app => ({
        id: app.application_id,
        programName: app.programs?.name || "Unknown Program",
        university: app.programs?.university || "Unknown University",
        applicationFee: app.programs?.application_fee || 125,
        status: app.status,
        date: app.created_at ? new Date(app.created_at).toLocaleDateString() : "",
      }));
    },
  });
};
