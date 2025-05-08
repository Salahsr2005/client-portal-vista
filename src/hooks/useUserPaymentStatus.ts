
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { checkUserPaymentStatus } from "@/utils/databaseHelpers";
import { supabase } from "@/integrations/supabase/client";

export const useUserPaymentStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["userPaymentStatus", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return {
          isPaid: false,
          isPending: false,
          hasPendingReceipt: false
        };
      }
      
      return await checkUserPaymentStatus(user.id);
    },
  });
};

export const useUploadedReceipts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["userReceipts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('payment_receipts')
        .select(`
          *,
          payments(payment_id, amount, method, description)
        `)
        .eq('client_id', user.id)
        .order('uploaded_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching payment receipts:", error);
        throw error;
      }
      
      return (data || []).map(receipt => ({
        id: receipt.id,
        paymentId: receipt.payment_id,
        paymentAmount: receipt.payments?.amount || 0,
        paymentMethod: receipt.payments?.method || 'Unknown',
        paymentDescription: receipt.payments?.description || 'Payment',
        receiptPath: receipt.receipt_path,
        status: receipt.status,
        uploadedAt: receipt.uploaded_at,
        verifiedAt: receipt.verified_at
      }));
    },
  });
};
