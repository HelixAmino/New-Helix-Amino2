/*
  # Fix webhook trigger crashing on NULL app settings

  ## Summary
  The `notify_new_member_webhook` trigger function was calling `net.http_post`
  with a NULL URL because `app.supabase_url` and `app.supabase_service_role_key`
  are not configured as database settings. This caused the entire signup
  transaction to roll back, producing a "database error saving new user" error.

  ## Changes
  - Rewrites `notify_new_member_webhook()` to:
    1. Guard against NULL URL/key and skip the HTTP call if either is missing
    2. Wrap the `net.http_post` call in an EXCEPTION block so any network error
       never propagates back to the calling transaction

  ## Notes
  1. The profile INSERT (and therefore user registration) will succeed even if
     the webhook notification cannot be delivered.
  2. When `app.supabase_url` and `app.supabase_service_role_key` are properly
     set as database configuration parameters the webhook will fire normally.
*/

CREATE OR REPLACE FUNCTION notify_new_member_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  edge_url text;
  service_key text;
BEGIN
  edge_url := current_setting('app.supabase_url', true);
  service_key := current_setting('app.supabase_service_role_key', true);

  IF edge_url IS NULL OR edge_url = '' OR service_key IS NULL OR service_key = '' THEN
    RETURN NEW;
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := edge_url || '/functions/v1/notify-new-member',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NEW;
END;
$$;
