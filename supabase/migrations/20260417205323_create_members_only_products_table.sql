/*
  # Create members_only_products table

  1. New Tables
    - `members_only_products`
      - `sku` (text, primary key) - the product SKU identifier (e.g. HA39.Y239)
      - `product_id` (text) - the application product id used in the frontend catalog
      - `name` (text) - human-readable product name
      - `category` (text) - product category
      - `price` (numeric) - list price in USD
      - `quantity_label` (text) - display label for quantity / dose
      - `description` (text) - marketing / research description
      - `created_at` (timestamptz) - creation timestamp
      - `updated_at` (timestamptz) - last update timestamp

  2. Security
    - Enable RLS on `members_only_products` table
    - Add SELECT policy restricting reads to authenticated users (members only)
    - No insert/update/delete policies for regular users; only service role (migrations) can modify

  3. Data
    - Seed with HA39.Y239 (Cagrilintide 5mg + Semaglutide 5mg)
    - Seed with HA39.Y240 (Cagrilintide 2.5mg + Semaglutide 2.5mg)

  4. Notes
    - Anonymous users cannot read rows from this table due to RLS.
    - This enforces the members-only restriction at the database layer in addition to the UI.
*/

CREATE TABLE IF NOT EXISTS members_only_products (
  sku text PRIMARY KEY,
  product_id text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Metabolic & GLP-1 Related',
  price numeric(10,2) NOT NULL DEFAULT 0,
  quantity_label text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE members_only_products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'members_only_products'
      AND policyname = 'Authenticated members can view members-only products'
  ) THEN
    CREATE POLICY "Authenticated members can view members-only products"
      ON members_only_products
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

INSERT INTO members_only_products (sku, product_id, name, category, price, quantity_label, description)
VALUES
  (
    'HA39.Y239',
    'members-cagsema-5-5mg',
    'Cagrilintide 5mg + Semaglutide 5mg',
    'Metabolic & GLP-1 Related',
    149.00,
    '5mg Cagrilintide + 5mg Semaglutide',
    'Dual-peptide research blend combining an amylin analogue with a GLP-1 receptor agonist for advanced metabolic and appetite regulation studies.'
  ),
  (
    'HA39.Y240',
    'members-cagsema-25-25mg',
    'Cagrilintide 2.5mg + Semaglutide 2.5mg',
    'Metabolic & GLP-1 Related',
    99.00,
    '2.5mg Cagrilintide + 2.5mg Semaglutide',
    'Lower-dose Cagrilintide + Semaglutide research blend for metabolic and appetite regulation studies.'
  )
ON CONFLICT (sku) DO UPDATE
  SET product_id = EXCLUDED.product_id,
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      price = EXCLUDED.price,
      quantity_label = EXCLUDED.quantity_label,
      description = EXCLUDED.description,
      updated_at = now();
