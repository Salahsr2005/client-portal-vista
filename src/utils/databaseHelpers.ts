
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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
