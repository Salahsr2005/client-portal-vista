
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface MessageAccessState {
  canAccessMessages: boolean;
  isLoading: boolean;
  reason: string;
  status: 'paid' | 'approved' | 'notPaid' | 'noApplication' | 'unknown';
  requiresPayment: boolean;
}

export const useMessageAccess = () => {
  const { user } = useAuth();
  const [accessState, setAccessState] = useState<MessageAccessState>({
    canAccessMessages: false,
    isLoading: true,
    reason: 'Checking access...',
    status: 'unknown',
    requiresPayment: false
  });

  useEffect(() => {
    if (!user) {
      setAccessState({
        canAccessMessages: false,
        isLoading: false,
        reason: 'Please sign in to access messages',
        status: 'unknown',
        requiresPayment: false
      });
      return;
    }
    
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    try {
      // Check if user has any approved applications
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('application_id, status, payment_status')
        .eq('client_id', user?.id);
        
      if (appError) throw appError;
      
      // No applications found
      if (!applications || applications.length === 0) {
        setAccessState({
          canAccessMessages: false,
          isLoading: false,
          reason: 'You need to apply to a program before you can access messages',
          status: 'noApplication',
          requiresPayment: false
        });
        return;
      }
      
      // Check for approved application
      const approvedApp = applications.find(app => app.status === 'Approved');
      
      if (approvedApp) {
        setAccessState({
          canAccessMessages: true,
          isLoading: false,
          reason: 'Your application has been approved',
          status: 'approved',
          requiresPayment: false
        });
        return;
      }
      
      // Check for application with completed payment
      const paidApp = applications.find(app => app.payment_status === 'Completed');
      
      if (paidApp) {
        setAccessState({
          canAccessMessages: true,
          isLoading: false,
          reason: 'Your payment has been completed',
          status: 'paid',
          requiresPayment: false
        });
        return;
      }
      
      // Default - user has applications but no completed payment
      setAccessState({
        canAccessMessages: false,
        isLoading: false,
        reason: 'Complete payment to access messages',
        status: 'notPaid',
        requiresPayment: true
      });
      
    } catch (error) {
      console.error('Error checking message access:', error);
      setAccessState({
        canAccessMessages: false,
        isLoading: false,
        reason: 'Error checking access',
        status: 'unknown',
        requiresPayment: false
      });
    }
  };

  return accessState;
};

export default useMessageAccess;
