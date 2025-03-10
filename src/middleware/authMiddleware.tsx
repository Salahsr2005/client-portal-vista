
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { verifyToken } from '@/utils/tokenUtils';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

interface PublicRouteProps {
  children: React.ReactNode;
  redirectAuthenticatedTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      if (user) {
        const valid = await verifyToken();
        setIsTokenValid(valid);
        
        if (!valid) {
          toast({
            title: "Session expired",
            description: "Your session has expired. Please sign in again.",
            variant: "default",
          });
        }
      } else {
        setIsTokenValid(false);
      }
    };
    
    checkToken();
  }, [user]);

  if (loading || isTokenValid === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying your session...</p>
      </div>
    );
  }

  if (!user || !isTokenValid) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectAuthenticatedTo = '/' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const state = location.state as { from?: Location };
  const from = state?.from?.pathname || redirectAuthenticatedTo;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
