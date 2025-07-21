-- Fix get_user_chats function to use correct existing column name
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
    c.last_message_at as last_message_time,  -- Use existing column last_message_at
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
  ORDER BY c.last_message_at DESC NULLS LAST;  -- Use existing column last_message_at
END;
$$;