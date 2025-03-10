
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define the user profile interface
interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  nationality?: string | null;
  passportNumber?: string | null;
  address?: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile data from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      // First, check the auth.users metadata
      if (user?.user_metadata) {
        const metadata = user.user_metadata;
        const profile: UserProfile = {
          firstName: metadata.first_name || null,
          lastName: metadata.last_name || null,
          email: user.email,
          dateOfBirth: metadata.date_of_birth || null,
          phone: null,
        };

        // Then try to get additional profile data from client_users table
        const { data: clientData, error: clientError } = await supabase
          .from('client_users')
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();

        if (clientData && !clientError) {
          profile.firstName = clientData.first_name || profile.firstName;
          profile.lastName = clientData.last_name || profile.lastName;
          profile.phone = clientData.phone;
          profile.dateOfBirth = clientData.date_of_birth || profile.dateOfBirth;
        }

        // Get extended profile data if available
        const { data: profileData, error: profileError } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();

        if (profileData && !profileError) {
          profile.nationality = profileData.nationality;
          profile.passportNumber = profileData.passport_number;
          profile.address = profileData.current_address;
        }

        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Function to refresh user profile data
  const refreshUserProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          setUser(data.session.user);
          await fetchUserProfile(data.session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          setUser(newSession.user);
          await fetchUserProfile(newSession.user.id);
          
          // Track user login activity
          if (event === 'SIGNED_IN') {
            try {
              await supabase.from('user_activity_log').insert({
                user_id: newSession.user.id,
                user_type: 'Client',
                activity_type: 'Login',
                activity_description: 'User logged in',
                ip_address: 'client-side'
              });
            } catch (error) {
              console.error("Failed to log user activity:", error);
            }
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data?.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        await fetchUserProfile(data.user.id);
        navigate("/dashboard");
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (!error) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account",
        });
        navigate("/login");
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Log the logout activity before signing out
      if (user?.id) {
        try {
          await supabase.from('user_activity_log').insert({
            user_id: user.id,
            user_type: 'Client',
            activity_type: 'Logout',
            activity_description: 'User logged out',
            ip_address: 'client-side'
          });
        } catch (logError) {
          console.error("Failed to log logout activity:", logError);
        }
      }
      
      // Now sign out
      await supabase.auth.signOut();
      
      // Clear local user state
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Navigate to login page
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        userProfile,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
