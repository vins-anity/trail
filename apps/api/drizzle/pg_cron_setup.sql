-- Migration: Add Supabase pg_cron for closure checks
-- This runs INSIDE the database, even when API container sleeps!

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable http extension for calling API
CREATE EXTENSION IF NOT EXISTS http;

-- Create function to check pending closures
CREATE OR REPLACE FUNCTION check_pending_closures()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- Call the API endpoint to check closures
  SELECT content::json INTO result
  FROM http((
    'POST',
    current_setting('app.api_url') || '/jobs/check-closures',
    ARRAY[
      http_header('Content-Type', 'application/json'),
      http_header('X-Cron-Token', current_setting('app.cron_token'))
    ],
    'application/json',
    '{}'
  ));
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the cron job (runs every 15 minutes)
SELECT cron.schedule(
  'check-closure-eligibility',
  '*/15 * * * *',  -- Every 15 minutes
  $$SELECT check_pending_closures()$$
);

-- Set configuration (will be set via Supabase dashboard)
-- ALTER DATABASE postgres SET app.api_url = 'https://trail-api.onrender.com';
-- ALTER DATABASE postgres SET app.cron_token = 'your-secret-token';
