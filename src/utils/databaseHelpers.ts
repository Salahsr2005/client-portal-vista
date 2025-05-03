import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Function to create favorite programs table if it doesn't exist
export const createFavoriteProgramsTable = async () => {
  try {
    // Instead of calling an RPC function, we'll create the table directly using SQL
    const { error } = await supabase
      .from('favorite_programs')
      .select('id')
      .limit(1);

    if (error) console.error('Error checking favorite programs table:', error);
  } catch (error) {
    console.error('Error initializing favorite programs:', error);
  }
};

// Function to handle Supabase errors
export const handleSupabaseError = (error: any, toastFunction?: any) => {
  console.error('Supabase error:', error);
  if (toastFunction) {
    toastFunction({
      title: "Error",
      description: error.message || "An error occurred with the database operation",
      variant: "destructive",
    });
  }
  return error;
};

// Function to get a signed URL for a user document
export const getDocumentUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('user_documents')
      .createSignedUrl(filePath, 3600); // URL valid for 1 hour
    
    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting document URL:", error);
    return null;
  }
};

// Function to upload a document to user's storage
export const uploadUserDocument = async (
  userId: string, 
  file: File, 
  documentType: string, 
  documentName: string
): Promise<{ success: boolean, data?: any, error?: any }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload to storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('user_documents')
      .upload(filePath, file);
    
    if (fileError) {
      return { success: false, error: fileError };
    }
    
    // Create db entry
    const documentData = {
      client_id: userId,
      document_type: documentType,
      document_name: documentName,
      file_path: filePath,
      status: 'Pending'
    };
    
    const { data, error } = await supabase
      .from('client_documents')
      .insert([documentData])
      .select();
    
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

// Function to delete a document
export const deleteUserDocument = async (documentId: string, filePath: string): Promise<boolean> => {
  try {
    // Delete from database
    const { error: dbError } = await supabase
      .from('client_documents')
      .delete()
      .eq('document_id', documentId);
    
    if (dbError) {
      throw dbError;
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('user_documents')
      .remove([filePath]);
    
    if (storageError) {
      console.warn("Could not delete file from storage:", storageError);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
};

// Function to upload payment receipt
export const uploadPaymentReceipt = async (
  userId: string,
  paymentId: string,
  file: File
): Promise<{ success: boolean, data?: any, error?: any }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `receipt-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload to storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('payment_receipts')
      .upload(filePath, file);
    
    if (fileError) {
      return { success: false, error: fileError };
    }
    
    // Create receipt record
    const receiptData = {
      payment_id: paymentId,
      client_id: userId,
      receipt_path: filePath,
      status: 'Pending'
    };
    
    const { data, error } = await supabase
      .from('payment_receipts')
      .insert([receiptData])
      .select();
    
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

// Function to get receipt URL
export const getReceiptUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('payment_receipts')
      .createSignedUrl(filePath, 3600); // URL valid for 1 hour
    
    if (error) {
      console.error("Error creating signed receipt URL:", error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting receipt URL:", error);
    return null;
  }
};

// Function to convert EUR to DZD or vice versa
export const convertCurrency = (amount: number, from: 'EUR' | 'DZD'): number => {
  const eurToDzdRate = 250;
  
  if (from === 'EUR') {
    return Math.round(amount * eurToDzdRate);
  } else {
    return Math.round((amount / eurToDzdRate) * 100) / 100;
  }
};

// Function to format currency
export const formatCurrency = (amount: number | string, currency: 'EUR' | 'DZD'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (currency === 'EUR') {
    return `€${numAmount.toLocaleString('en-EU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  } else {
    return `${numAmount.toLocaleString('en-DZ')} DZD`;
  }
};
