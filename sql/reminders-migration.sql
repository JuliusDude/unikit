-- Migration for Multi-Stage Reminders

-- 1. Add JSONB column to tasks to track which reminders have been sent
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS reminders_sent JSONB DEFAULT '{}'::jsonb;

-- 2. Update the trigger for group events to only generate 7-day and 1-day reminders
CREATE OR REPLACE FUNCTION create_event_reminders()
RETURNS TRIGGER AS $$
DECLARE
  chat_id BIGINT;
  offset_days INTEGER;
BEGIN
  -- Get the telegram_chat_id for this group
  SELECT telegram_chat_id INTO chat_id
  FROM public.telegram_groups
  WHERE id = NEW.group_id;

  IF chat_id IS NOT NULL THEN
    -- Changed from [7, 3, 1] to [7, 1] for Option B
    FOREACH offset_days IN ARRAY ARRAY[7, 1]
    LOOP
      -- Only create reminder if the event is far enough in the future
      IF (NEW.event_date - CURRENT_DATE) >= offset_days THEN
        INSERT INTO public.reminders (event_id, group_id, telegram_chat_id, title, event_date, category, priority, days_left)
        VALUES (NEW.id, NEW.group_id, chat_id, NEW.title, NEW.event_date, NEW.category, NEW.priority, offset_days);
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
