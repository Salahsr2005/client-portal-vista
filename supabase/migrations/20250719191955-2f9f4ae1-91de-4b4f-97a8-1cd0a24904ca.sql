-- Fix chat_participants table - add missing column
ALTER TABLE chat_participants ADD COLUMN IF NOT EXISTS participant_type text NOT NULL DEFAULT 'Client';

-- Update existing chat functions to work properly
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

-- Update get_chat_messages function
CREATE OR REPLACE FUNCTION public.get_chat_messages(p_chat_id uuid, p_limit integer DEFAULT 50)
RETURNS TABLE(
  message_id uuid,
  message_text text,
  sender_id uuid,
  sender_type text,
  sent_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.message_id,
    cm.message_text,
    cm.sender_id,
    CASE 
      WHEN EXISTS(SELECT 1 FROM admin_users WHERE admin_id = cm.sender_id) THEN 'Admin'
      ELSE 'Client'
    END as sender_type,
    cm.sent_at
  FROM chat_messages cm
  WHERE cm.chat_id = p_chat_id
  ORDER BY cm.sent_at ASC
  LIMIT p_limit;
END;
$$;

-- Update mark_messages_as_read function
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(p_chat_id uuid, p_participant_id uuid, p_participant_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE chat_participants
  SET 
    last_read_at = NOW(),
    unread_count = 0
  WHERE chat_id = p_chat_id 
    AND participant_id = p_participant_id
    AND participant_type = p_participant_type;
END;
$$;