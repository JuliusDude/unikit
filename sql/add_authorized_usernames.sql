-- Migration: Add authorization support to Telegram Groups

ALTER TABLE public.telegram_groups 
ADD COLUMN IF NOT EXISTS authorized_usernames TEXT[] DEFAULT '{}';

-- Optional: If you already have existing groups, you might want to manually 
-- add your username to them so you don't get locked out!
-- UPDATE public.telegram_groups SET authorized_usernames = ARRAY['your_telegram_username'];
