
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks the payment status for a user
 */
export const checkUserPaymentStatus = async (userId: string) => {
  try {
    // Check if user has any completed payments
    const { data: completedPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('payment_id')
      .eq('client_id', userId)
      .eq('status', 'Completed')
      .limit(1);
    
    if (paymentsError) throw paymentsError;
    
    const isPaid = completedPayments && completedPayments.length > 0;
    
    // Check for pending receipt uploads
    const { data: pendingReceipts, error: receiptsError } = await supabase
      .from('payment_receipts')
      .select('id')
      .eq('client_id', userId)
      .eq('status', 'Pending')
      .limit(1);
      
    if (receiptsError) throw receiptsError;
    
    const hasPendingReceipt = pendingReceipts && pendingReceipts.length > 0;
    
    // Check for pending applications
    const { data: pendingApplications, error: applicationsError } = await supabase
      .from('applications')
      .select('application_id')
      .eq('client_id', userId)
      .eq('payment_status', 'Pending')
      .limit(1);
      
    if (applicationsError) throw applicationsError;
    
    const hasPendingApplication = pendingApplications && pendingApplications.length > 0;
    
    return {
      isPaid,
      hasPendingReceipt,
      hasPendingApplication
    };
  } catch (error) {
    console.error('Error checking user payment status:', error);
    return {
      isPaid: false,
      hasPendingReceipt: false,
      hasPendingApplication: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Checks if a user can access premium content
 */
export const canAccessPremiumContent = async (userId: string) => {
  try {
    const status = await checkUserPaymentStatus(userId);
    return status.isPaid;
  } catch (error) {
    console.error('Error checking premium content access:', error);
    return false;
  }
};
