-- Fix: Add telegram_chat_id to students table if not present
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- Ensure tasks table has reminders_sent JSONB
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS reminders_sent JSONB DEFAULT '{}'::jsonb;
