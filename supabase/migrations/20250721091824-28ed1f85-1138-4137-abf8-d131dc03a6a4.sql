-- Fix replica identity for real-time updates
ALTER TABLE public.chats REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_participants REPLICA IDENTITY FULL;

-- Ensure tables are in realtime publication
DO $$
BEGIN
    -- Add tables to realtime publication if not already added
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END
$$;

-- Fix the get_user_chats function to return correct column names
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

-- Update the send message function to work properly
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
    last_message_at = NOW(),
    updated_at = NOW()
  WHERE chat_id = p_chat_id;
  
  -- Update unread counts for other participants
  UPDATE chat_participants 
  SET unread_count = unread_count + 1
  WHERE chat_id = p_chat_id 
    AND NOT (participant_id = p_sender_id AND participant_type = p_sender_type);
  
  RETURN v_message_id;
END;
$$;

-- Update triggers to handle message updates properly
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the chat's last message info
    UPDATE public.chats 
    SET 
        last_message_at = NEW.sent_at,
        last_message_text = NEW.message_text,
        updated_at = NOW()
    WHERE chat_id = NEW.chat_id;
    
    -- Update unread counts for all participants except the sender
    UPDATE public.chat_participants 
    SET unread_count = unread_count + 1
    WHERE chat_id = NEW.chat_id 
    AND NOT (participant_id = NEW.sender_id AND participant_type = COALESCE(NEW.sender_type, 'Client'));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_chat_on_new_message ON chat_messages;
CREATE TRIGGER update_chat_on_new_message
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_last_message();