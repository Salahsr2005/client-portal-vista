
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Function to create favorite programs table if it doesn't exist
export const createFavoriteProgramsTable = async () => {
  try {
    const { error } = await supabase.rpc('create_favorite_programs_table');
    if (error) console.error('Error creating favorite programs table:', error);
  } catch (error) {
    console.error('Error calling RPC function:', error);
  }
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
