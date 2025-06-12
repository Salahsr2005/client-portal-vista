
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";

// Function to format currency with euro symbol
export const formatCurrency = (amount: number): string => {
  return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Function to compress image before upload
const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Function to get the URL for a payment receipt
export const getReceiptUrl = async (receiptPath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('payment_receipts')
      .createSignedUrl(receiptPath, 60);
    
    if (error) throw error;
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error getting receipt URL:', error);
    return null;
  }
};

// Function to upload a payment receipt with compression
export const uploadPaymentReceipt = async (
  file: File,
  userId: string
): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  try {
    // Compress file if it's an image and larger than 2MB
    let fileToUpload = file;
    if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
      fileToUpload = await compressImage(file);
    }
    
    // Generate unique file name with timestamp
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}-${file.name}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('payment_receipts')
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    return {
      success: true,
      filePath: data?.path || fileName
    };
  } catch (error: any) {
    console.error('Error uploading receipt:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload receipt'
    };
  }
};

// Function to upload an application document with compression
export const uploadApplicationDocument = async (
  file: File,
  userId: string,
  documentName: string
): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  try {
    // Compress file if it's an image and larger than 2MB
    let fileToUpload = file;
    if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
      fileToUpload = await compressImage(file);
    }
    
    // Generate unique file name with timestamp
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}-${file.name}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('user_documents')
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    return {
      success: true,
      filePath: data?.path || fileName
    };
  } catch (error: any) {
    console.error('Error uploading application document:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload document'
    };
  }
};

// Function to get the URL for an application document
export const getApplicationDocumentUrl = async (documentPath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('user_documents')
      .createSignedUrl(documentPath, 60);
    
    if (error) throw error;
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error getting application document URL:', error);
    return null;
  }
};

// Legacy function for backward compatibility
export const uploadDocument = async (
  file: File,
  userId: string,
  documentName: string
): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  return uploadApplicationDocument(file, userId, documentName);
};

// Legacy function for backward compatibility
export const getDocumentUrl = async (documentPath: string): Promise<string | null> => {
  return getApplicationDocumentUrl(documentPath);
};

// Function to handle Supabase errors
export const handleSupabaseError = (error: any, toast: any): void => {
  console.error('Supabase error:', error);
  
  if (error.code === '23505') {
    toast({
      title: "Duplicate entry",
      description: "This item already exists in the database.",
      variant: "destructive",
    });
    return;
  }
  
  if (error.code === '23503') {
    toast({
      title: "Reference error",
      description: "This item is referenced by other data and cannot be modified.",
      variant: "destructive",
    });
    return;
  }
  
  toast({
    title: "Database error",
    description: error.message || "An unexpected error occurred.",
    variant: "destructive",
  });
};

// Helper function to ensure storage buckets exist
export const initializeStorageBuckets = async (): Promise<void> => {
  try {
    const { data: paymentReceiptData, error: paymentReceiptError } = await supabase.storage
      .from('payment_receipts')
      .list('', { limit: 1 });
      
    if (paymentReceiptError && paymentReceiptError.message.includes('does not exist')) {
      console.warn('Payment receipts bucket needs to be created by an admin');
    }
    
    const { data: userDocumentsData, error: userDocumentsError } = await supabase.storage
      .from('user_documents')
      .list('', { limit: 1 });
      
    if (userDocumentsError && userDocumentsError.message.includes('does not exist')) {
      console.warn('User documents bucket needs to be created by an admin');
    }
  } catch (error) {
    console.error('Error checking storage buckets:', error);
  }
};
