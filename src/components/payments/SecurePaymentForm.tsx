
// This component is deprecated - secure payments functionality has been removed
// Use the regular payment flow in the Payments page instead

import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SecurePaymentFormProps {
  amount: number;
  currency: string;
  itemType: 'program' | 'destination' | 'service';
  itemName: string;
  clientName: string;
  clientId: string;
  onPaymentInitiated: (paymentMethod: string, reference: string) => void;
}

export const SecurePaymentForm: React.FC<SecurePaymentFormProps> = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This secure payment form has been deprecated. Please use the regular payment flow through the Payments page.
        </AlertDescription>
      </Alert>
    </div>
  );
};
