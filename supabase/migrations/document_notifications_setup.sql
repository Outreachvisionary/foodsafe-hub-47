
-- Create a table to store document notification logs
CREATE TABLE IF NOT EXISTS public.document_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  document_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable the required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule a daily check for documents expiring in the next 30 days
SELECT cron.schedule(
  'document-expiry-notifications',
  '0 8 * * *',  -- Run at 8:00 AM every day
  $$
    SELECT net.http_post(
      url:='https://vngmjjvfofoggfqgpizo.supabase.co/functions/v1/document-expiry-notifications',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('supabase.secret.service_role_key') || '"}'::jsonb,
      body:='{}'::jsonb
    ) AS request_id;
  $$
);
