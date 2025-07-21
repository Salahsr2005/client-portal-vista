-- Fix infinite recursion in chat_participants RLS policies
-- First, drop any existing problematic policies
DROP POLICY IF EXISTS "Users can view their own chat participants" ON chat_participants;
DROP POLICY IF EXISTS "Users can join chats" ON chat_participants;
DROP POLICY IF EXISTS "Admins can view all chat participants" ON chat_participants;

-- Create a security definer function to check user type
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS TEXT AS $$
DECLARE
  user_type TEXT;
BEGIN
  -- Check if user is a client
  SELECT 'Client' INTO user_type
  FROM client_users 
  WHERE client_id = auth.uid();
  
  IF user_type IS NOT NULL THEN
    RETURN user_type;
  END IF;
  
  -- Check if user is an admin
  SELECT 'Admin' INTO user_type
  FROM admin_users 
  WHERE admin_id = auth.uid();
  
  IF user_type IS NOT NULL THEN
    RETURN user_type;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create RLS policies for chat_participants
CREATE POLICY "Users can view their own participation" ON chat_participants
  FOR SELECT USING (participant_id = auth.uid());

CREATE POLICY "Users can join chats they're invited to" ON chat_participants
  FOR INSERT WITH CHECK (participant_id = auth.uid());

CREATE POLICY "Users can update their own participation" ON chat_participants
  FOR UPDATE USING (participant_id = auth.uid());

-- Create RLS policies for chats
DROP POLICY IF EXISTS "Users can view their chats" ON chats;
CREATE POLICY "Users can view their chats" ON chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_id = chats.chat_id 
      AND participant_id = auth.uid()
    )
  );

CREATE POLICY "System can create chats" ON chats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Participants can update chat info" ON chats
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_id = chats.chat_id 
      AND participant_id = auth.uid()
    )
  );

-- Create RLS policies for chat_messages
DROP POLICY IF EXISTS "Users can view messages in their chats" ON chat_messages;
CREATE POLICY "Users can view messages in their chats" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_id = chat_messages.chat_id 
      AND participant_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their chats" ON chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_id = chat_messages.chat_id 
      AND participant_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages" ON chat_messages
  FOR UPDATE USING (sender_id = auth.uid());

-- Enable RLS on all chat tables
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for chat tables
ALTER TABLE chats REPLICA IDENTITY FULL;
ALTER TABLE chat_participants REPLICA IDENTITY FULL;
ALTER TABLE chat_messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE chats;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Update the chat creation function to be more robust
CREATE OR REPLACE FUNCTION public.create_client_admin_chat(p_client_id uuid, p_admin_id uuid, p_title text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_chat_id UUID;
  v_client_name TEXT;
  v_admin_name TEXT;
  v_client_tier client_tier;
  v_existing_chat_id UUID;
BEGIN
  -- Check if chat already exists between client and admin
  SELECT c.chat_id INTO v_existing_chat_id
  FROM chats c
  JOIN chat_participants cp1 ON c.chat_id = cp1.chat_id
  JOIN chat_participants cp2 ON c.chat_id = cp2.chat_id
  WHERE cp1.participant_id = p_client_id 
    AND cp1.participant_type = 'Client'
    AND cp2.participant_id = p_admin_id 
    AND cp2.participant_type = 'Admin'
    AND c.is_group_chat = FALSE
    AND c.is_active = TRUE;

  -- Return existing chat if found
  IF v_existing_chat_id IS NOT NULL THEN
    RETURN v_existing_chat_id;
  END IF;

  -- Get client tier
  SELECT client_tier INTO v_client_tier
  FROM client_users
  WHERE client_id = p_client_id;
  
  -- Check if client is allowed to chat (must be 'Paid' tier)
  IF v_client_tier != 'Paid' THEN
    RAISE EXCEPTION 'Only paid clients can access the chat feature';
  END IF;

  -- Get client and admin names
  SELECT COALESCE(first_name || ' ' || last_name, 'Client') INTO v_client_name 
  FROM client_users WHERE client_id = p_client_id;
  
  SELECT COALESCE(first_name || ' ' || last_name, 'Support Team') INTO v_admin_name 
  FROM admin_users WHERE admin_id = p_admin_id;
  
  -- Create chat title if not provided
  IF p_title IS NULL THEN
    p_title := 'Chat with ' || v_client_name;
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
$function$;