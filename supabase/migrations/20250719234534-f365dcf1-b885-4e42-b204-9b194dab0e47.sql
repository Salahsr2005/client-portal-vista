-- Add the missing is_group_chat column to chats table
ALTER TABLE public.chats ADD COLUMN is_group_chat BOOLEAN NOT NULL DEFAULT FALSE;

-- Update get_user_chats function to work properly
CREATE OR REPLACE FUNCTION public.get_user_chats(p_user_id uuid, p_user_type text)
RETURNS TABLE(
  chat_id uuid,
  title text,
  last_message_text text,
  last_message_time timestamp with time zone,
  unread_count integer,
  participants jsonb
)
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

-- Update create_client_admin_chat function to properly handle the new column
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

-- Add sender_type column to chat_messages if it doesn't exist
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS sender_type TEXT DEFAULT 'Client';

-- Update the send message function to include sender_type
CREATE OR REPLACE FUNCTION public.send_message(p_chat_id uuid, p_sender_id uuid, p_message_text text, p_sender_type text DEFAULT 'Client')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_message_id UUID;
BEGIN
  -- Insert the message
  INSERT INTO chat_messages (chat_id, sender_id, message_text, sender_type)
  VALUES (p_chat_id, p_sender_id, p_message_text, p_sender_type)
  RETURNING message_id INTO v_message_id;
  
  -- Update chat last message info
  UPDATE chats 
  SET 
    last_message_text = p_message_text,
    last_message_at = NOW()
  WHERE chat_id = p_chat_id;
  
  -- Update unread counts for other participants
  UPDATE chat_participants 
  SET unread_count = unread_count + 1
  WHERE chat_id = p_chat_id 
    AND NOT (participant_id = p_sender_id AND participant_type = p_sender_type);
  
  RETURN v_message_id;
END;
$$;