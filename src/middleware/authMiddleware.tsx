
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Protected route wrapper component
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to access this page",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, loading, navigate, toast]);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  // Render children only if user is authenticated
  return user ? <>{children}</> : null;
};

// Public route wrapper component (redirects if already authenticated)
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  // Render children only if user is not authenticated
  return !user || loading ? <>{children}</> : null;
};

// Token verification middleware
export const useTokenVerification = () => {
  const { session, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check token expiration
    if (session) {
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      
      // If token is about to expire in less than 5 minutes
      if (expiresAt && expiresAt - now < 300) {
        toast({
          title: "Session expiring",
          description: "Your session is about to expire. Please refresh your login.",
          variant: "warning",
        });
      }
      
      // If token is expired, sign out
      if (expiresAt && expiresAt <= now) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        signOut();
      }
    }
  }, [session, signOut, toast]);

  return { session };
};
