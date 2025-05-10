
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentStatusResult {
  isPaid: boolean;
  isPending: boolean;
  hasPendingReceipt: boolean;
  hasPendingApplication: boolean;
  error?: string;
}

// Add missing export for useUploadedReceipts
export const useUploadedReceipts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['paymentReceipts', user?.id],
    queryFn: async () => {
      if (!user) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('payment_receipts')
          .select('*')
          .eq('client_id', user.id);
          
        if (error) throw error;
        
        return data || [];
      } catch (error: any) {
        console.error('Error fetching payment receipts:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserPaymentStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['paymentStatus', user?.id],
    queryFn: async (): Promise<PaymentStatusResult> => {
      if (!user) {
        return { 
          isPaid: false, 
          isPending: false,
          hasPendingReceipt: false, 
          hasPendingApplication: false,
          error: 'User not authenticated' 
        };
      }

      try {
        // Check for payments with Completed status
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('client_id', user.id)
          .eq('status', 'Completed');
          
        if (paymentsError) throw paymentsError;
        
        // Check for pending receipts
        const { data: pendingReceipts, error: receiptsError } = await supabase
          .from('payment_receipts')
          .select('*')
          .eq('client_id', user.id)
          .eq('status', 'Pending');
          
        if (receiptsError) throw receiptsError;
        
        // Check for applications
        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select('*')
          .eq('client_id', user.id);
          
        if (applicationsError) throw applicationsError;
        
        // Check for pending applications
        const pendingApplications = applications?.filter(app => 
          app.status === 'Submitted' || app.status === 'Under Review'
        ) || [];
        
        return {
          isPaid: payments && payments.length > 0,
          isPending: (pendingReceipts && pendingReceipts.length > 0) || false,
          hasPendingReceipt: pendingReceipts && pendingReceipts.length > 0,
          hasPendingApplication: pendingApplications.length > 0
        };
      } catch (error: any) {
        console.error('Error checking payment status:', error);
        return { 
          isPaid: false,
          isPending: false,
          hasPendingReceipt: false,
          hasPendingApplication: false,
          error: error.message || 'Failed to check payment status'
        };
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
