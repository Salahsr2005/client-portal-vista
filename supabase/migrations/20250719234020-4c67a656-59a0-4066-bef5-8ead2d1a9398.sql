-- Add missing is_group_chat column to chats table
ALTER TABLE public.chats ADD COLUMN is_group_chat BOOLEAN DEFAULT FALSE;

-- Fix the create_client_admin_chat function to work with the new column
CREATE OR REPLACE FUNCTION public.create_client_admin_chat(p_client_id uuid, p_admin_id uuid, p_title text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_chat_id UUID;
  v_client_name TEXT;
  v_admin_name TEXT;
  v_client_tier client_tier;
  v_existing_chat_id UUID;
BEGIN
  -- Get client tier
  SELECT client_tier INTO v_client_tier
  FROM client_users
  WHERE client_id = p_client_id;
  
  -- Check if client is allowed to chat (must be 'Paid' tier)
  IF v_client_tier != 'Paid' THEN
    RAISE EXCEPTION 'Only paid clients can access the chat feature';
  END IF;

  -- Check if chat already exists between this client and admin
  SELECT c.chat_id INTO v_existing_chat_id
  FROM chats c
  INNER JOIN chat_participants cp1 ON c.chat_id = cp1.chat_id
  INNER JOIN chat_participants cp2 ON c.chat_id = cp2.chat_id
  WHERE cp1.participant_id = p_client_id 
    AND cp1.participant_type = 'Client'
    AND cp2.participant_id = p_admin_id 
    AND cp2.participant_type = 'Admin'
    AND c.is_active = TRUE
    AND c.is_group_chat = FALSE;

  -- If chat exists, return existing chat_id
  IF v_existing_chat_id IS NOT NULL THEN
    RETURN v_existing_chat_id;
  END IF;

  -- Get client and admin names
  SELECT first_name || ' ' || last_name INTO v_client_name 
  FROM client_users WHERE client_id = p_client_id;
  
  SELECT first_name || ' ' || last_name INTO v_admin_name 
  FROM admin_users WHERE admin_id = p_admin_id;
  
  -- Create chat title if not provided
  IF p_title IS NULL THEN
    p_title := 'Chat with ' || v_admin_name;
  END IF;
  
  -- Create new chat
  INSERT INTO chats (chat_name, is_group_chat, is_active)
  VALUES (p_title, FALSE, TRUE)
  RETURNING chat_id INTO v_chat_id;
  
  -- Add participants
  INSERT INTO chat_participants (chat_id, participant_id, participant_type, display_name)
  VALUES 
    (v_chat_id, p_client_id, 'Client', v_client_name),
    (v_chat_id, p_admin_id, 'Admin', v_admin_name);
  
  RETURN v_chat_id;
END;
$$;

-- Fix RLS policies for payment_receipts table
DROP POLICY IF EXISTS "Users can insert their own receipts" ON payment_receipts;
DROP POLICY IF EXISTS "Users can view their own receipts" ON payment_receipts;

CREATE POLICY "Users can insert their own receipts" 
ON payment_receipts 
FOR INSERT 
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can view their own receipts" 
ON payment_receipts 
FOR SELECT 
USING (client_id = auth.uid());

CREATE POLICY "Users can update their own receipts" 
ON payment_receipts 
FOR UPDATE 
USING (client_id = auth.uid());

-- Create storage policy for payment receipts bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-receipts', 'payment-receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment receipts
CREATE POLICY "Users can upload their own receipts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own receipts" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own receipts" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own receipts" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);