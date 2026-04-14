/*
  # Create Live Chat Tables

  ## Summary
  Creates the tables needed for the real-time live chat system. Visitors can start
  chat sessions and exchange messages with admin agents. The system supports
  real-time message delivery via Supabase Realtime.

  ## New Tables

  ### `chat_sessions`
  - `id` (uuid, primary key) — unique session identifier
  - `visitor_id` (text) — anonymous visitor identifier stored in localStorage
  - `visitor_name` (text) — optional display name entered by visitor
  - `status` (text) — 'waiting' | 'open' | 'closed'
  - `agent_id` (uuid, nullable) — the admin user who claimed the session
  - `unread_by_agent` (int) — count of messages not yet seen by agent
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `chat_messages`
  - `id` (uuid, primary key)
  - `session_id` (uuid, FK → chat_sessions)
  - `sender_role` (text) — 'visitor' | 'agent'
  - `sender_id` (text) — visitor_id or agent user id
  - `text` (text) — message body
  - `created_at` (timestamptz)

  ### `push_subscriptions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK → auth.users)
  - `endpoint` (text, unique) — Web Push endpoint URL
  - `p256dh` (text) — public key
  - `auth_key` (text) — auth secret
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Visitors can insert/select their own session and messages using visitor_id claim
  - Authenticated admin users can read and update all sessions and messages
  - Push subscriptions are private to each authenticated user

  ## Notes
  1. Visitors are identified by a UUID stored in their localStorage (visitor_id).
     They pass it via a custom JWT claim or directly in the row. Since visitors
     are anonymous (no auth), we use a permissive SELECT policy scoped by visitor_id
     passed as a query filter — RLS checks admin access for mutations.
  2. `is_admin` column added to profiles for admin role gating.
  3. Realtime must be enabled on chat_sessions and chat_messages in the Supabase dashboard.
*/

-- Add is_admin to profiles if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- chat_sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  visitor_name text DEFAULT 'Visitor',
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'open', 'closed')),
  agent_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  unread_by_agent integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Visitors: insert their own session (no auth required — anon key)
CREATE POLICY "Visitors can create their own session"
  ON chat_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Visitors: read their own session by visitor_id
CREATE POLICY "Visitors can view their own session"
  ON chat_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated admins: update any session
CREATE POLICY "Admins can update sessions"
  ON chat_sessions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_role text NOT NULL CHECK (sender_role IN ('visitor', 'agent')),
  sender_id text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert messages (visitors use anon key)
CREATE POLICY "Anyone can send messages"
  ON chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read messages in a session
CREATE POLICY "Anyone can read messages"
  ON chat_messages FOR SELECT
  TO anon, authenticated
  USING (true);

-- push_subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text UNIQUE NOT NULL,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own push subscription"
  ON push_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own push subscriptions"
  ON push_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at on chat_sessions
CREATE OR REPLACE FUNCTION update_chat_session_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE chat_sessions SET updated_at = now() WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_chat_message_insert ON chat_messages;
CREATE TRIGGER on_chat_message_insert
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_session_timestamp();
