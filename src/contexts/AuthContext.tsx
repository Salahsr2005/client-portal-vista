
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
      console.log("Fetching profile for user ID:", userId);
      
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

        if (clientError) {
          console.error("Error fetching client_users data:", clientError);
        }

        if (clientData) {
          console.log("Client user data found:", clientData);
          profile.firstName = clientData.first_name || profile.firstName;
          profile.lastName = clientData.last_name || profile.lastName;
          profile.phone = clientData.phone;
          profile.dateOfBirth = clientData.date_of_birth || profile.dateOfBirth;
        } else {
          console.log("No client_users data found for this user");
        }

        // Get extended profile data if available
        const { data: profileData, error: profileError } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching client_profiles data:", profileError);
        }

        if (profileData) {
          console.log("Client profile data found:", profileData);
          profile.nationality = profileData.nationality;
          profile.passportNumber = profileData.passport_number;
          profile.address = profileData.current_address;
        } else {
          console.log("No client_profiles data found for this user");
        }

        console.log("Final user profile:", profile);
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
        console.log("Getting session...");
        const { data } = await supabase.auth.getSession();
        console.log("Session data:", data);
        
        setSession(data.session);
        
        if (data.session?.user) {
          console.log("User found in session:", data.session.user);
          setUser(data.session.user);
          await fetchUserProfile(data.session.user.id);
        } else {
          console.log("No user found in session");
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        console.log("Finished getting session, setting loading to false");
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        console.log("New session:", newSession);
        
        setSession(newSession);
        
        if (newSession?.user) {
          console.log("User from auth state change:", newSession.user);
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
              console.log("Logged user login activity");
            } catch (error) {
              console.error("Failed to log user activity:", error);
            }
          }
        } else {
          console.log("No user from auth state change");
          setUser(null);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log("Unsubscribing from auth state change");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data?.user) {
        console.log("Sign in successful:", data.user);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        await fetchUserProfile(data.user.id);
        navigate("/dashboard");
      } else if (error) {
        console.error("Sign in error:", error);
      }
      
      return { error };
    } catch (error: any) {
      console.error("Sign in exception:", error);
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
      console.log("Signing up with email:", email);
      console.log("User data:", userData);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (!error) {
        console.log("Sign up successful:", data);
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account",
        });
        navigate("/login");
      } else {
        console.error("Sign up error:", error);
      }

      return { error };
    } catch (error: any) {
      console.error("Sign up exception:", error);
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
      console.log("Signing out...");
      
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
          console.log("Logged user logout activity");
        } catch (logError) {
          console.error("Failed to log logout activity:", logError);
        }
      }
      
      // Now sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      console.log("Signed out successfully");
      
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
      console.error("Sign out exception:", error);
      toast({
        title: "Logout failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Signing in with Google...");
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
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
