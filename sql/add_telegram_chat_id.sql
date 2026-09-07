-- Migration: Add telegram_chat_id to students table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

CREATE INDEX IF NOT EXISTS idx_students_telegram_chat_id 
ON public.students(telegram_chat_id);
