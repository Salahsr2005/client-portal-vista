
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

// Helper to format currency
export const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to upload payment receipt
export const uploadPaymentReceipt = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('payment_receipts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    return {
      success: true,
      filePath: filePath,
      fileUrl: data?.path
    };
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Helper to upload document
export const uploadDocument = async (file: File, userId: string, documentName: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${documentName.replace(/\s+/g, '_')}_${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('user_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    return {
      success: true,
      filePath: filePath,
      fileUrl: data?.path
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Helper to get a receipt URL
export const getReceiptUrl = async (receiptPath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('payment_receipts')
      .createSignedUrl(receiptPath, 60 * 5); // 5 minutes expiry
    
    if (error) throw error;
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting receipt URL:', error);
    return null;
  }
};

// Helper to get a document URL
export const getDocumentUrl = async (documentPath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('user_documents')
      .createSignedUrl(documentPath, 60 * 5); // 5 minutes expiry
    
    if (error) throw error;
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
};

// Added missing function for handling Supabase errors
export const handleSupabaseError = (error: any, toastFn: any = toast) => {
  console.error('Supabase error:', error);
  toastFn({
    title: "Error",
    description: error.message || "An unexpected error occurred",
    variant: "destructive",
  });
};

// Added missing function for initializing storage buckets
export const initializeStorageBuckets = async () => {
  try {
    // Check if buckets exist, create if they don't
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) throw error;
    
    const bucketNames = buckets.map(bucket => bucket.name);
    
    if (!bucketNames.includes('user_documents')) {
      await supabase.storage.createBucket('user_documents', {
        public: false,
      });
    }
    
    if (!bucketNames.includes('payment_receipts')) {
      await supabase.storage.createBucket('payment_receipts', {
        public: false,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
