
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentReceipt {
  id: string;
  client_id: string;
  payment_id: string;
  receipt_path: string;
  notes: string;
  status: string;
  uploaded_at: string;
  verified_at: string;
  verified_by: string;
}

interface PaymentStatus {
  id: string;
  amount: number;
  status: string;
  date: string;
  method: string;
  reference: string;
  notes: string;
  isPaid: boolean;
  hasPendingReceipt: boolean;
  receipts: PaymentReceipt[];
}

export const useUserPaymentStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userPaymentStatus'],
    queryFn: async (): Promise<PaymentStatus | null> => {
      if (!user) return null;
      
      try {
        // Get the latest payment for this user
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (paymentError) {
          // If no payment record found, return null
          if (paymentError.code === 'PGRST116') return null;
          throw paymentError;
        }
        
        if (!paymentData) return null;
        
        // Get receipts for this payment
        const { data: receipts, error: receiptsError } = await supabase
          .from('payment_receipts')
          .select('*')
          .eq('payment_id', paymentData.payment_id);
        
        if (receiptsError) throw receiptsError;
        
        // Calculate payment status flags
        // Use string equality for comparisons instead of type equality
        const isPaid = paymentData.status === 'Completed' || 
                      paymentData.status === 'Approved' || 
                      paymentData.status === 'Verified';
        
        const hasPendingReceipt = receipts?.some(receipt => 
          receipt.status === 'Pending'
        ) || false;
        
        return {
          id: paymentData.payment_id,
          amount: paymentData.amount,
          status: paymentData.status,
          date: paymentData.date,
          method: paymentData.method,
          reference: paymentData.reference,
          notes: paymentData.notes || '',
          isPaid,
          hasPendingReceipt,
          receipts: receipts || []
        };
      } catch (error) {
        console.error('Error fetching payment status:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
