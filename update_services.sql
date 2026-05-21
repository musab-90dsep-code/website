ALTER TABLE public.services ADD COLUMN IF NOT EXISTS type text DEFAULT 'trading' NOT NULL;
