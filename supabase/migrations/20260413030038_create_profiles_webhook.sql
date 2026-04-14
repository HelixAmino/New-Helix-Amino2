/*
  # Create webhook trigger for new member notifications

  ## Summary
  Creates a Supabase database webhook that fires the `notify-new-member`
  Edge Function whenever a new row is inserted into the `profiles` table.
  This sends an admin email alert via Mailgun for every new registration.

  ## Changes
  - Enables the `pg_net` extension (required for HTTP webhooks)
  - Creates a trigger function `notify_new_member_webhook` that POSTs the
    new profile record to the Edge Function URL
  - Attaches the trigger to `profiles` AFTER INSERT

  ## Notes
  1. The Edge Function URL uses the project ref from SUPABASE_URL.
  2. The service role key is used as the Authorization header so the
     Edge Function can trust the request origin.
*/

CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION notify_new_member_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  edge_url text;
  service_key text;
BEGIN
  edge_url := current_setting('app.supabase_url', true) || '/functions/v1/notify-new-member';
  service_key := current_setting('app.supabase_service_role_key', true);

  PERFORM net.http_post(
    url := edge_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION notify_new_member_webhook();
