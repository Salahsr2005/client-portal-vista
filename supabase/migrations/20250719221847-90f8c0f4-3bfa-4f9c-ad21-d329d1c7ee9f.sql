
-- Fix the chats table structure
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS is_group_chat BOOLEAN DEFAULT FALSE;

-- Update the chat_participants table to ensure proper structure
ALTER TABLE public.chat_participants DROP CONSTRAINT IF EXISTS chat_participants_pkey;
ALTER TABLE public.chat_participants ADD PRIMARY KEY (chat_id, participant_id, participant_type);

-- Add missing columns to chat_messages if needed
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_type TEXT DEFAULT 'Client';

-- Update the get_user_chats function to work with the new structure
CREATE OR REPLACE FUNCTION public.get_user_chats(p_user_id uuid, p_user_type text)
RETURNS TABLE(chat_id uuid, title text, last_message_text text, last_message_time timestamp with time zone, unread_count integer, participants jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.chat_id,
    COALESCE(c.chat_name, 'Support Chat') as title,
    c.last_message_text,
    c.last_message_at as last_message_time,
    COALESCE(cp_user.unread_count, 0) as unread_count,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'participant_id', cp_all.participant_id,
          'participant_type', cp_all.participant_type,
          'display_name', cp_all.display_name
        )
      )
      FROM chat_participants cp_all
      WHERE cp_all.chat_id = c.chat_id
    ) as participants
  FROM chats c
  INNER JOIN chat_participants cp_user 
    ON c.chat_id = cp_user.chat_id 
    AND cp_user.participant_id = p_user_id
    AND cp_user.participant_type = p_user_type
  WHERE c.is_active = true
  ORDER BY c.last_message_at DESC NULLS LAST;
END;
$$;

-- Update the create_client_admin_chat function
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

-- Enable realtime for chat tables
ALTER TABLE public.chats REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_participants REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;
