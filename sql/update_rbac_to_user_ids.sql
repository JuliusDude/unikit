-- Migration: Use robust Telegram user IDs instead of usernames for RBAC

-- Drop the old usernames column we just created
ALTER TABLE public.telegram_groups 
DROP COLUMN IF EXISTS authorized_usernames;

-- Add the new immutable user IDs column
ALTER TABLE public.telegram_groups 
ADD COLUMN IF NOT EXISTS authorized_user_ids TEXT[] DEFAULT '{}';
