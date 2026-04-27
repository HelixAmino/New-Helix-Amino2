/*
  # Fix new member notification webhook by hardcoding the Edge Function URL

  ## Summary
  The previous version of `notify_new_member_webhook()` relied on the
  `app.supabase_url` and `app.supabase_service_role_key` database settings,
  but those parameters are not configured in this project. As a result the
  trigger silently skipped the HTTP call and admin alerts were never sent
  when a new member registered.

  ## Changes
  1. Rewrites `notify_new_member_webhook()` to call the
     `notify-new-member` Edge Function directly using the hardcoded
     project URL.
  2. The Edge Function has `verify_jwt = false`, so no Authorization
     header is required.
  3. The HTTP call is wrapped in an EXCEPTION block so any network
     failure cannot roll back the user signup transaction.

  ## Notes
  - This keeps the existing `on_profile_created` trigger attached to the
    `profiles` table.
  - No data is modified; only the trigger function body is replaced.
*/

CREATE OR REPLACE FUNCTION notify_new_member_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  BEGIN
    PERFORM net.http_post(
      url := 'https://eactfxpjobttmxlhtoje.supabase.co/functions/v1/notify-new-member',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NEW;
END;
$$;
