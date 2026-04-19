/*
  # Create orders table for in-app checkout

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - internal order id
      - `order_number` (text, unique) - short human readable order number
      - `user_id` (uuid, nullable) - auth.users reference (guest orders allowed)
      - `cart_key` (text) - CoCart session cart key
      - `items` (jsonb) - snapshot of line items at time of order
      - `subtotal` (numeric) - cart subtotal in USD
      - `total` (numeric) - grand total in USD
      - `currency` (text) - default USD
      - `payment_method` (text) - venmo | zelle | unpaid
      - `payment_status` (text) - pending | submitted | confirmed | cancelled
      - `customer_name` (text)
      - `customer_email` (text)
      - `notes` (text) - optional notes (e.g., payment reference)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `orders`
    - Policies:
      - Authenticated users can read their own orders
      - Authenticated users can create orders belonging to themselves or as guest
      - Admins (profiles.is_admin=true) can read all orders
      - Users can update their own order's payment notes/status (to mark submitted)

  3. Notes
    - Guest checkout is supported (user_id nullable). Guests identify their order via unique `order_number` + email (not exposed via RLS read).
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  cart_key text DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  payment_method text NOT NULL DEFAULT 'unpaid',
  payment_status text NOT NULL DEFAULT 'pending',
  customer_name text DEFAULT '',
  customer_email text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins read all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated users create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anonymous guests create guest orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Users update own order notes"
  ON orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins update all orders"
  ON orders FOR UPDATE
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
