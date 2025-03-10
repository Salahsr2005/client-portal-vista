import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Get the current token from session
export const getCurrentToken = (session: Session | null): string | null => {
  return session?.access_token || null;
};

// Add authorization header to requests
export const getAuthHeaders = (session: Session | null) => {
  const token = getCurrentToken(session);
  return token ? {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  } : {
    'Content-Type': 'application/json',
  };
};

// A utility function to verify if token exists and is valid
export const verifyToken = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return false;
    }
    
    // Check if token is about to expire (within 5 minutes)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    
    if (expiresAt && expiresAt - now < 300) {
      // Token is about to expire, try to refresh it
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        console.error("Failed to refresh token:", error);
        return false;
      }
      
      console.log("Token refreshed successfully");
      return true;
    }
    
    // Token is still valid
    return true;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

// A utility function to securely store session data
export const securelyStoreSession = (session: Session | null) => {
  if (!session) {
    sessionStorage.removeItem('sessionExpiry');
    return;
  }
  
  // Only store expiry time, not the actual token
  sessionStorage.setItem('sessionExpiry', session.expires_at?.toString() || '');
};

// Get user ID from current session
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};

// Utility function to get specific table names
export const getTableName = (entity: string): string => {
  const tableMap: Record<string, string> = {
    'destinations': 'destinations',
    'programs': 'programs',
    'services': 'services',
    'client_users': 'client_users',
    'appointments': 'appointments',
    'applications': 'applications',
    'notifications': 'notifications',
    'payments': 'payments',
    'messages': 'messages',
    'client_profiles': 'client_profiles',
    'client_documents': 'client_documents',
    'access_tokens': 'access_tokens',
    'user_activity_log': 'user_activity_log'
  };
  
  return tableMap[entity] || '';
};
