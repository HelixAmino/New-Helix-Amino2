/*
  # Create profiles table

  ## Summary
  Creates a `profiles` table that is automatically populated when a new user
  registers via Supabase Auth. A database trigger fires on every INSERT into
  `auth.users` and creates the matching profile row.

  ## New Tables
  - `profiles`
    - `id` (uuid, primary key) — matches `auth.users.id`
    - `full_name` (text) — display name entered during signup
    - `email` (text) — user's email address
    - `created_at` (timestamptz) — when the profile was created

  ## Security
  - RLS is enabled on `profiles`
  - Authenticated users can read only their own profile row
  - Authenticated users can update only their own profile row
  - INSERT is handled exclusively by the service-role trigger function,
    not by the anon/authenticated client, so no INSERT policy is needed

  ## Notes
  1. The trigger function `handle_new_user()` runs with SECURITY DEFINER
     so it can write to `profiles` regardless of RLS.
  2. `full_name` is pulled from `raw_user_meta_data->>'full_name'` which
     is set during `supabase.auth.signUp({ data: { full_name: '...' } })`.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  email text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
