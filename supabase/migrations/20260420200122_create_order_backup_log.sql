/*
  # Order backup email log

  1. New Tables
    - `order_backup_log`
      - `id` (uuid, primary key)
      - `order_id` (uuid, nullable — references public.orders)
      - `order_number` (text)
      - `status` (text: 'sent' | 'failed' | 'skipped')
      - `provider` (text, default 'emailjs')
      - `error` (text, nullable — error message when status = 'failed')
      - `payload` (jsonb — snapshot of the data used to render the email)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `order_backup_log`
    - SELECT: only the order owner (orders.user_id = auth.uid()) may read their log rows
    - INSERT: authenticated users may insert rows for orders they own
    - No UPDATE or DELETE policies (log is append-only)

  3. Notes
    - This log gives us a durable record even when EmailJS fails, so we can
      retry or hand-send the email later.
*/

CREATE TABLE IF NOT EXISTS public.order_backup_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  order_number text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'sent',
  provider text NOT NULL DEFAULT 'emailjs',
  error text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_backup_log_order_id
  ON public.order_backup_log (order_id);

ALTER TABLE public.order_backup_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'order_backup_log'
      AND policyname = 'Users can read own backup log'
  ) THEN
    CREATE POLICY "Users can read own backup log"
      ON public.order_backup_log
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.orders o
          WHERE o.id = order_backup_log.order_id
            AND o.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'order_backup_log'
      AND policyname = 'Users can insert own backup log'
  ) THEN
    CREATE POLICY "Users can insert own backup log"
      ON public.order_backup_log
      FOR INSERT
      TO authenticated
      WITH CHECK (
        order_id IS NULL OR EXISTS (
          SELECT 1 FROM public.orders o
          WHERE o.id = order_backup_log.order_id
            AND o.user_id = auth.uid()
        )
      );
  END IF;
END $$;
