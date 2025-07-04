import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SecurePayment {
  id: string;
  payment_reference: string;
  payment_method: 'bank' | 'ccp' | 'card';
  amount: number;
  currency: string;
  item_type: 'program' | 'destination' | 'service';
  item_id?: string;
  item_name: string;
  status: 'pending_payment' | 'payment_uploaded' | 'verified' | 'rejected';
  payment_instructions_generated: boolean;
  receipt_upload_path?: string;
  verification_notes?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export const useSecurePayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's secure payments
  const { data: securePayments = [], isLoading, error } = useQuery({
    queryKey: ['secure-payments', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('secure_payments')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching secure payments:', error);
        throw new Error(error.message);
      }

      return data as SecurePayment[];
    },
  });

  // Create new secure payment
  const createPaymentMutation = useMutation({
    mutationFn: async ({
      paymentMethod,
      amount,
      currency,
      itemType,
      itemId,
      itemName
    }: {
      paymentMethod: 'bank' | 'ccp' | 'card';
      amount: number;
      currency: string;
      itemType: 'program' | 'destination' | 'service';
      itemId?: string;
      itemName: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('create_secure_payment', {
        p_client_id: user.id,
        p_payment_method: paymentMethod,
        p_amount: amount,
        p_currency: currency,
        p_item_type: itemType,
        p_item_id: itemId,
        p_item_name: itemName
      });

      if (error) {
        console.error('Error creating secure payment:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (paymentReference) => {
      queryClient.invalidateQueries({ queryKey: ['secure-payments'] });
      toast({
        title: "Paiement initié",
        description: `Référence de paiement: ${paymentReference}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le paiement sécurisé",
        variant: "destructive",
      });
    },
  });

  // Upload receipt
  const uploadReceiptMutation = useMutation({
    mutationFn: async ({
      paymentId,
      receiptFile,
      notes
    }: {
      paymentId: string;
      receiptFile: File;
      notes?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${paymentId}_${Date.now()}.${fileExt}`;
      const filePath = `payment-receipts/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Payment Receipts')
        .upload(filePath, receiptFile);

      if (uploadError) {
        throw new Error(`Failed to upload receipt: ${uploadError.message}`);
      }

      // Update payment record
      const { error: updateError } = await supabase
        .from('secure_payments')
        .update({
          status: 'payment_uploaded',
          receipt_upload_path: filePath,
          verification_notes: notes
        })
        .eq('id', paymentId)
        .eq('client_id', user.id);

      if (updateError) {
        throw new Error(`Failed to update payment: ${updateError.message}`);
      }

      // Log the action
      await supabase
        .from('payment_verification_log')
        .insert({
          secure_payment_id: paymentId,
          action: 'receipt_uploaded',
          previous_status: 'pending_payment',
          new_status: 'payment_uploaded',
          notes: notes || 'Receipt uploaded by client'
        });

      return filePath;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-payments'] });
      toast({
        title: "Reçu téléversé",
        description: "Votre reçu de paiement est en cours de vérification",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de téléversement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get payment verification history
  const { data: verificationHistory = [] } = useQuery({
    queryKey: ['payment-verification-log', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('payment_verification_log')
        .select(`
          *,
          secure_payments!inner(client_id, payment_reference)
        `)
        .eq('secure_payments.client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching verification history:', error);
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    securePayments,
    verificationHistory,
    isLoading,
    error,
    createPayment: createPaymentMutation.mutate,
    isCreatingPayment: createPaymentMutation.isPending,
    uploadReceipt: uploadReceiptMutation.mutate,
    isUploadingReceipt: uploadReceiptMutation.isPending,
  };
};