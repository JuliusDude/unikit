-- Flashcards Schema

-- 1. Study Materials (Replaces localStorage Sources and Notes)
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  material_type TEXT NOT NULL CHECK (material_type IN ('source', 'note')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Flashcard Decks
CREATE TABLE public.flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Flashcards
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  citation TEXT,
  status TEXT DEFAULT 'unseen' CHECK (status IN ('unseen', 'review', 'mastered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Service Role bypasses this, but good practice for client-side queries)
CREATE POLICY "Users can manage their own study materials" ON public.study_materials
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Users can manage their own decks" ON public.flashcard_decks
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Users can manage their own cards" ON public.flashcards
  FOR ALL USING (
    deck_id IN (SELECT id FROM public.flashcard_decks WHERE student_id = auth.uid())
  );
