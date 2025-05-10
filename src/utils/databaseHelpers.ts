
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

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
      hasPendingApplication,
      // Derived property to make UI logic simpler
      isPending: hasPendingReceipt || hasPendingApplication
    };
  } catch (error) {
    console.error('Error checking user payment status:', error);
    return {
      isPaid: false,
      hasPendingReceipt: false,
      hasPendingApplication: false,
      isPending: false,
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

/**
 * Upload a payment receipt to storage and create a database record
 */
export const uploadPaymentReceipt = async (
  userId: string,
  paymentId: string,
  file: File
) => {
  try {
    // 1. Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `payment-receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('client-uploads')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Create record in the database
    const { data, error: dbError } = await supabase
      .from('payment_receipts')
      .insert({
        client_id: userId,
        payment_id: paymentId,
        receipt_path: filePath,
        status: 'Pending'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return { success: true, data };
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Get a public URL for a receipt
 */
export const getReceiptUrl = async (filePath: string) => {
  try {
    const { data } = await supabase.storage
      .from('client-uploads')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting receipt URL:', error);
    return null;
  }
};

/**
 * Handle Supabase errors in a consistent way
 */
export const handleSupabaseError = (error: PostgrestError | null) => {
  if (!error) return null;
  
  console.error('Supabase error:', error);
  return {
    message: error.message || 'An unexpected error occurred',
    details: error.details,
    hint: error.hint,
    code: error.code
  };
};

// This function is needed by useUserProfile but was missing
export const initializeStorageBuckets = async () => {
  try {
    // Check if buckets exist and create them if they don't
    const buckets = ['client-uploads', 'client-documents', 'program-images'];
    
    for (const bucket of buckets) {
      const { data: existingBucket, error } = await supabase.storage.getBucket(bucket);
      
      if (error && error.message.includes('does not exist')) {
        await supabase.storage.createBucket(bucket, {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize storage buckets:', error);
    return false;
  }
};
