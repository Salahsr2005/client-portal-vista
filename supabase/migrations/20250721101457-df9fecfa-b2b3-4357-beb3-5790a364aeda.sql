-- Fix infinite recursion in chat_participants RLS policies
-- First, drop any existing problematic policies
DROP POLICY IF EXISTS "Users can view their own chat participants" ON chat_participants;
DROP POLICY IF EXISTS "Users can join chats" ON chat_participants;
DROP POLICY IF EXISTS "Admins can view all chat participants" ON chat_participants;
DROP POLICY IF EXISTS "participant_insert_policy" ON chat_participants;
DROP POLICY IF EXISTS "participant_select_policy" ON chat_participants;
DROP POLICY IF EXISTS "participant_update_policy" ON chat_participants;

-- Drop existing chat policies
DROP POLICY IF EXISTS "Allow all operations on chats" ON chats;
DROP POLICY IF EXISTS "Users can view their chats" ON chats;

-- Drop existing message policies
DROP POLICY IF EXISTS "message_insert_policy" ON chat_messages;
DROP POLICY IF EXISTS "message_select_policy" ON chat_messages;
DROP POLICY IF EXISTS "message_update_policy" ON chat_messages;

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

-- Enable realtime for chat tables (only if not already enabled)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'chats' AND c.relreplident = 'f'
  ) THEN
    ALTER TABLE chats REPLICA IDENTITY FULL;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'chat_participants' AND c.relreplident = 'f'
  ) THEN
    ALTER TABLE chat_participants REPLICA IDENTITY FULL;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'chat_messages' AND c.relreplident = 'f'
  ) THEN
    ALTER TABLE chat_messages REPLICA IDENTITY FULL;
  END IF;
END $$;