-- Fix the send_message function to use correct column names
CREATE OR REPLACE FUNCTION public.send_message(
  p_chat_id uuid, 
  p_sender_id uuid, 
  p_message_text text, 
  p_sender_type text DEFAULT 'Client'::text
)
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
  
  -- Update chat last message info using existing column last_message_at (NOT last_message_time)
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

-- Fix the mark_messages_as_read function to remove any reference to status column
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(
  p_chat_id uuid, 
  p_participant_id uuid, 
  p_participant_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update participant's last read time and reset unread count
  UPDATE chat_participants
  SET 
    last_read_at = NOW(),
    unread_count = 0
  WHERE chat_id = p_chat_id 
    AND participant_id = p_participant_id
    AND participant_type = p_participant_type;
END;
$$;