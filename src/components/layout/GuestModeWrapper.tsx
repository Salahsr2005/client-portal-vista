import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGuestMode } from '@/contexts/GuestModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowLeft, User, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface GuestModeWrapperProps {
  children: React.ReactNode;
  showGuestBanner?: boolean;
}

export function GuestModeWrapper({ children, showGuestBanner = true }: GuestModeWrapperProps) {
  const { isGuestMode } = useGuestMode();
  const location = useLocation();
  const navigate = useNavigate();

  const isGuestRoute = location.pathname.startsWith('/guest/');

  if (!isGuestMode && !isGuestRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Guest Mode Banner */}
      {showGuestBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-primary/10 border-b border-primary/20 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-primary/20 text-primary">
                  Guest Mode
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Browsing in read-only mode
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/guest')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Guest Home
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Sign Up Free
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative">
        {children}
        
        {/* Guest Mode Restrictions Overlay */}
        <GuestModeRestrictionsOverlay />
      </div>
    </div>
  );
}

function GuestModeRestrictionsOverlay() {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <Card className="w-80 border-amber-200 bg-amber-50/95 dark:bg-amber-950/95 dark:border-amber-800 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                Limited Guest Access
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Sign up to apply to programs, book appointments, and access full features.
              </p>
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  onClick={() => navigate('/register')}
                  className="h-7 px-3 text-xs"
                >
                  Sign Up
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                  className="h-7 px-3 text-xs"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Hook to check if user can perform restricted actions
export function useGuestRestrictions() {
  const { isGuestMode } = useGuestMode();
  const location = useLocation();
  const navigate = useNavigate();

  const isGuestRoute = location.pathname.startsWith('/guest/');
  const isRestricted = isGuestMode || isGuestRoute;

  const handleRestrictedAction = (action: 'apply' | 'payment' | 'profile' | 'appointment') => {
    if (isRestricted) {
      // Show upgrade prompt
      navigate('/register', { 
        state: { 
          returnTo: location.pathname,
          action: action 
        } 
      });
      return false;
    }
    return true;
  };

  return {
    isRestricted,
    handleRestrictedAction,
    canApply: !isRestricted,
    canMakePayments: !isRestricted,
    canAccessProfile: !isRestricted,
    canBookAppointments: !isRestricted
  };
}