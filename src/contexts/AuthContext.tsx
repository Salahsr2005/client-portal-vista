
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { verifyToken, securelyStoreSession } from "@/utils/tokenUtils";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any, data?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => {},
  signInWithGoogle: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true);
        
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          securelyStoreSession(initialSession);
          console.log("User authenticated:", initialSession.user.email);
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);
            securelyStoreSession(newSession);
            if (newSession?.user) {
              console.log("Auth state changed, user:", newSession.user.email);
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err: any) {
        console.error("Auth initialization error:", err);
        setError(err);
        toast({
          title: "Authentication Error",
          description: err.message || "Failed to initialize authentication",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
    
    // Set up periodic token verification
    const tokenCheckInterval = setInterval(async () => {
      const isValid = await verifyToken();
      if (!isValid) {
        // Token is invalid or couldn't be refreshed
        setSession(null);
        setUser(null);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(tokenCheckInterval);
  }, []);

  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
        securelyStoreSession(data.session);
        toast({
          title: "Sign in successful",
          description: "Welcome back!",
        });
      }

      return { error: null };
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err);
      toast({
        title: "Sign in failed",
        description: err.message || "Failed to sign in",
        variant: "destructive",
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign up user
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign up successful",
        description: "Please check your email for confirmation.",
      });
      
      return { data, error: null };
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err);
      toast({
        title: "Sign up failed",
        description: err.message || "Failed to sign up",
        variant: "destructive",
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err);
      toast({
        title: "Google sign in failed",
        description: err.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      securelyStoreSession(null);
      
      toast({
        title: "Sign out successful",
        description: "You have been signed out.",
      });
    } catch (err: any) {
      console.error("Sign out error:", err);
      setError(err);
      toast({
        title: "Sign out failed",
        description: err.message || "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions.",
      });
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err);
      toast({
        title: "Password reset failed",
        description: err.message || "Failed to send password reset email",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
