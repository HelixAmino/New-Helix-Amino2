/*
  # Add create_order RPC for safe guest + authenticated checkout

  1. Problem
    - RLS on `orders` allows INSERT for `anon` and `authenticated`, but there is no
      SELECT policy for `anon`. The client uses `.insert().select().maybeSingle()`,
      which requires SELECT permission on the returning row. Guest checkouts therefore
      fail with 401 "unable to start checkout".

  2. Fix
    - Add a SECURITY DEFINER function `public.create_order(...)` that performs the
      insert server-side and returns the full order row. This bypasses the missing
      anon SELECT policy without weakening RLS on direct table access.
    - The function validates that authenticated callers can only create orders for
      themselves (or as guest with user_id = null), and that anon callers may only
      create guest orders (user_id must be null).

  3. Security
    - RLS policies on `orders` remain unchanged and restrictive.
    - The function explicitly checks ownership before inserting.
    - Only the order just created is returned to the caller.
*/

CREATE OR REPLACE FUNCTION public.create_order(
  p_order_number text,
  p_user_id uuid,
  p_cart_key text,
  p_items jsonb,
  p_subtotal numeric,
  p_total numeric,
  p_customer_name text,
  p_customer_email text
)
RETURNS orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_row orders;
BEGIN
  IF v_caller IS NULL THEN
    IF p_user_id IS NOT NULL THEN
      RAISE EXCEPTION 'Anonymous callers may only create guest orders';
    END IF;
  ELSE
    IF p_user_id IS NOT NULL AND p_user_id <> v_caller THEN
      RAISE EXCEPTION 'Authenticated callers may only create their own orders';
    END IF;
  END IF;

  INSERT INTO orders (
    order_number,
    user_id,
    cart_key,
    items,
    subtotal,
    total,
    currency,
    payment_method,
    payment_status,
    customer_name,
    customer_email
  ) VALUES (
    p_order_number,
    p_user_id,
    COALESCE(p_cart_key, ''),
    COALESCE(p_items, '[]'::jsonb),
    COALESCE(p_subtotal, 0),
    COALESCE(p_total, 0),
    'USD',
    'unpaid',
    'pending',
    COALESCE(p_customer_name, ''),
    COALESCE(p_customer_email, '')
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order(text, uuid, text, jsonb, numeric, numeric, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.create_order(text, uuid, text, jsonb, numeric, numeric, text, text) TO anon, authenticated;
