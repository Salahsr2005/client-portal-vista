
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";

// Function to format currency with euro symbol
export const formatCurrency = (amount: number): string => {
  return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Function to get the URL for a payment receipt
export const getReceiptUrl = async (receiptPath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('payment_receipts')
      .createSignedUrl(receiptPath, 60); // URL valid for 60 seconds
    
    if (error) throw error;
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error getting receipt URL:', error);
    return null;
  }
};

// Function to upload a payment receipt
export const uploadPaymentReceipt = async (
  file: File,
  userId: string
): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  try {
    // Generate unique file name
    const fileName = `${userId}/${uuidv4()}-${file.name}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('payment_receipts')
      .upload(fileName, file);
    
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

// Function to upload a document
export const uploadDocument = async (
  file: File,
  userId: string,
  documentName: string
): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  try {
    // Generate unique file name
    const fileName = `${userId}/${uuidv4()}-${file.name}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('client_documents')
      .upload(fileName, file);
    
    if (error) throw error;
    
    return {
      success: true,
      filePath: data?.path || fileName
    };
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload document'
    };
  }
};

// Function to get the URL for a document
export const getDocumentUrl = async (documentPath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('client_documents')
      .createSignedUrl(documentPath, 60); // URL valid for 60 seconds
    
    if (error) throw error;
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
};

// Function to handle Supabase errors
export const handleSupabaseError = (error: any, toast: any): void => {
  console.error('Supabase error:', error);
  
  // Check if it's a duplicate key error
  if (error.code === '23505') {
    toast({
      title: "Duplicate entry",
      description: "This item already exists in the database.",
      variant: "destructive",
    });
    return;
  }
  
  // Check if it's a foreign key violation
  if (error.code === '23503') {
    toast({
      title: "Reference error",
      description: "This item is referenced by other data and cannot be modified.",
      variant: "destructive",
    });
    return;
  }
  
  // Default error message
  toast({
    title: "Database error",
    description: error.message || "An unexpected error occurred.",
    variant: "destructive",
  });
};

// Helper function to ensure storage buckets exist
export const initializeStorageBuckets = async (): Promise<void> => {
  try {
    // Check if payment_receipts bucket exists, create if not
    const { data: buckets, error: bucketsError } = await supabase
      .from('storage')
      .select('name')
      .eq('name', 'payment_receipts')
      .maybeSingle();
      
    if (bucketsError) {
      console.warn('Could not check if buckets exist:', bucketsError);
    } else if (!buckets) {
      // Bucket doesn't exist, but we can't create it from the client
      console.log('Storage bucket needs to be created by an admin');
    }
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
  }
};
