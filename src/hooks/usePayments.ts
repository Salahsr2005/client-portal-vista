import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Payment {
  id: string;
  amount: string;
  date: string;
  description: string;
  status: string;
  method: string;
  receiptUploadPath?: string;
}

export interface PendingApplication {
  id: string;
  name: string;
  provider: string;
  fee: number;
}

export const usePayments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['payments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map((payment: any) => ({
        id: payment.payment_id,
        amount: `$${payment.amount}`,
        date: new Date(payment.date).toLocaleDateString(),
        description: payment.description || 'Payment',
        status: payment.status,
        method: payment.method,
        receiptUploadPath: payment.receipt_upload_path
      })) || [];
    },
    enabled: !!user,
  });
};

export const usePendingApplications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['pendingApplications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get applications that need payment
      const { data, error } = await supabase
        .from('applications')
        .select(`
          application_id,
          programs!inner(name, university, tuition_min),
          payment_status
        `)
        .eq('client_id', user.id)
        .eq('payment_status', 'Pending');

      if (error) throw error;

      return data?.map((app: any) => ({
        id: app.application_id,
        name: app.programs.name,
        provider: app.programs.university,
        fee: app.programs.tuition_min || 0
      })) || [];
    },
    enabled: !!user,
  });
};

export const useUploadReceipt = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, receiptFile, notes }: { paymentId: string, receiptFile: File, notes: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${paymentId}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(filePath, receiptFile);

      if (uploadError) {
        throw new Error('Failed to upload receipt: ' + uploadError.message);
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(filePath);

      // Update payment record with receipt path
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          receipt_upload_path: filePath,
          status: 'Partial'
        })
        .eq('payment_id', paymentId)
        .eq('client_id', user.id);

      if (updateError) {
        throw new Error('Failed to update payment: ' + updateError.message);
      }

      // Create receipt record
      const { error: receiptError } = await supabase
        .from('payment_receipts')
        .insert({
          payment_id: paymentId,
          client_id: user.id,
          receipt_path: publicUrl,
          notes: notes
        });

      if (receiptError) {
        throw new Error('Failed to create receipt record: ' + receiptError.message);
      }

      // Check if user now has a completed payment to enable chat
      const { data: completedPayments } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', user.id)
        .eq('status', 'Completed')
        .limit(1);

      if (completedPayments && completedPayments.length > 0) {
        // Update client tier to Paid to enable chat
        await supabase
          .from('client_users')
          .update({ client_tier: 'Paid' })
          .eq('client_id', user.id);
      }

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Receipt uploaded successfully",
        description: "Your payment receipt has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to check if user has chat access
export const useHasChatAccess = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['chatAccess', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('client_users')
        .select('client_tier')
        .eq('client_id', user.id)
        .single();

      if (error) return false;
      
      return data?.client_tier === 'Paid';
    },
    enabled: !!user,
  });
};