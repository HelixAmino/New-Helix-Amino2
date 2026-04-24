/*
  # Create woo_product_map table

  1. New Tables
    - `woo_product_map`
      - `sku` (text, primary key) — frontend product slug / WooCommerce SKU
      - `woo_id` (int, not null) — numeric WooCommerce product ID
      - `updated_at` (timestamptz, default now())

  2. Purpose
    - Maps frontend product slugs to WooCommerce product IDs so the cart can
      translate CoCart response items back to frontend Product objects.

  3. Security
    - RLS enabled.
    - Public read allowed (this mapping is non-sensitive catalog data).
    - Writes restricted: only service role (edge functions) can insert/update.
*/

CREATE TABLE IF NOT EXISTS woo_product_map (
  sku text PRIMARY KEY,
  woo_id integer NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE woo_product_map ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'woo_product_map' AND policyname = 'Anyone can read product map'
  ) THEN
    CREATE POLICY "Anyone can read product map"
      ON woo_product_map FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
