
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
      // Failed to refresh, token is invalid
      return false;
    }
    
    // Successfully refreshed
    return true;
  }
  
  // Token is still valid
  return true;
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
