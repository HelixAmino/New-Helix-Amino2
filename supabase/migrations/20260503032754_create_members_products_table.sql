/*
  # Create members_products table

  Protects the members-only catalog from public scraping by moving the data
  from the bundled client JS into Supabase with RLS so only authenticated
  users can read it.

  1. New Tables
    - `members_products`
      - `id` (text, primary key) - matches the previous static product id
      - `data` (jsonb) - the full product payload
      - `group_id` (text) - id of the group this product variant belongs to
      - `group_name` (text) - display name of the group
      - `group_order` (int) - ordering for groups
      - `variant_order` (int) - ordering for variants within a group
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `members_products`
    - Only authenticated users may SELECT
*/

CREATE TABLE IF NOT EXISTS members_products (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  group_id text NOT NULL DEFAULT '',
  group_name text NOT NULL DEFAULT '',
  group_order int NOT NULL DEFAULT 0,
  variant_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE members_products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'members_products'
      AND policyname = 'Authenticated users can view members products'
  ) THEN
    CREATE POLICY "Authenticated users can view members products"
      ON members_products FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS members_products_group_order_idx
  ON members_products (group_order, variant_order);
