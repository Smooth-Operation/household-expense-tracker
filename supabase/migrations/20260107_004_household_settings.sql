-- Add settings column to households table
ALTER TABLE households
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{
  "currency": "EUR",
  "locale": "de-DE",
  "dateFormat": "dd.MM.yyyy",
  "showCents": true
}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN households.settings IS 'JSON object containing household preferences: currency, locale, dateFormat, showCents';
