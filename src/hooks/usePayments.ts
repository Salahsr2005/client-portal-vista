
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Payment {
  id: string;
  amount: string;
  status: string;
  date: string;
  method: string;
  type: string;
  description: string;
  transactionId: string;
  applicationId: string | null;
  programName?: string;
  universityName?: string;
  serviceId?: string;
  serviceName?: string;
  receiptUploadPath?: string;
}

export const usePayments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["payments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return [];
      }

      // First, fetch payment data
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
      
      // Fetch service applications for service fee payments 
      const servicePayments = paymentsData.filter(p => p.reference === 'service');
      let serviceData = {};
      
      if (servicePayments.length > 0) {
        const { data: serviceApplicationsData, error: serviceError } = await supabase
          .from("service_applications")
          .select(`
            id, 
            service_id,
            payment_id,
            services (name)
          `)
          .in('payment_id', servicePayments.map(p => p.payment_id));
        
        if (!serviceError && serviceApplicationsData) {
          // Create a map of payment_id to service data
          serviceData = serviceApplicationsData.reduce((acc, item) => {
            acc[item.payment_id] = {
              serviceId: item.service_id,
              serviceName: item.services?.name
            };
            return acc;
          }, {});
        }
      }
      
      return paymentsData.map(payment => {
        let referenceType = "Unknown";
        let programName = payment.applications?.programs?.name || "Program Fee";
        let universityName = payment.applications?.programs?.university || "";
        let serviceInfo = serviceData[payment.payment_id] || {};
        
        switch (payment.reference) {
          case "application":
            referenceType = "Application Fee";
            break;
          case "service":
            referenceType = "Service Fee";
            programName = serviceInfo.serviceName || "Service Fee";
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
          serviceId: serviceInfo.serviceId,
          serviceName: serviceInfo.serviceName,
          receiptUploadPath: payment.receipt_upload_path
        } as Payment;
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

      try {
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
        
        // Also fetch pending service applications
        const { data: serviceData, error: serviceError } = await supabase
          .from("service_applications")
          .select(`
            id, 
            user_id, 
            service_id, 
            payment_status,
            created_at,
            services(name, price)
          `)
          .eq("user_id", user.id)
          .eq("payment_status", "Pending");

        if (serviceError) {
          console.error("Error fetching pending service applications:", serviceError);
        }
          
        // Combine both program and service applications using standardized properties
        const programApplications = (data || []).map(app => ({
          id: app.application_id,
          type: 'program',
          name: app.programs?.name || "Unknown Program",
          provider: app.programs?.university || "Unknown University",
          fee: app.programs?.application_fee || 125,
          status: app.status,
          date: app.created_at ? new Date(app.created_at).toLocaleDateString() : "",
        }));
        
        const serviceApplications = (serviceData || []).map(app => ({
          id: app.id,
          type: 'service',
          name: app.services?.name || "Unknown Service",
          provider: "Euro Visa Services",
          fee: app.services?.price || 75,
          status: app.payment_status,
          date: app.created_at ? new Date(app.created_at).toLocaleDateString() : "",
          service_id: app.service_id
        }));
        
        return [...programApplications, ...serviceApplications];
      } catch (error) {
        console.error("Error in pending applications query:", error);
        return [];
      }
    },
  });
};

// Upload receipt mutation
export const useUploadReceipt = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      receiptFile,
      notes
    }: {
      paymentId: string;
      receiptFile: File;
      notes?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${paymentId}_${Date.now()}.${fileExt}`;
      const filePath = `payment-receipts/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(filePath, receiptFile);

      if (uploadError) {
        throw new Error(`Failed to upload receipt: ${uploadError.message}`);
      }

      // Update payment record with receipt path
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          receipt_upload_path: filePath,
          status: 'Under Review'
        })
        .eq('payment_id', paymentId)
        .eq('client_id', user.id);

      if (updateError) {
        throw new Error(`Failed to update payment: ${updateError.message}`);
      }

      // Create receipt record
      const { error: receiptError } = await supabase
        .from('payment_receipts')
        .insert({
          payment_id: paymentId,
          client_id: user.id,
          receipt_path: filePath,
          notes: notes
        });

      if (receiptError) {
        throw new Error(`Failed to create receipt record: ${receiptError.message}`);
      }

      return filePath;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Receipt Uploaded",
        description: "Your payment receipt has been uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
