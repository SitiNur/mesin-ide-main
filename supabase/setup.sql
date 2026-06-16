-- PlayBox Kids: schema dasar (untuk project baru)
-- Catatan: database production mungkin sudah memiliki schema lengkap
-- dengan kolom tambahan (short_desc, duration, max_age, dll.)
-- Jalankan di Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  benefit_tags TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  best_time TEXT[] NOT NULL DEFAULT '{}',
  location TEXT[] NOT NULL DEFAULT '{}',
  needs_tools BOOLEAN NOT NULL DEFAULT false,
  tools_list TEXT NOT NULL DEFAULT '',
  prep_level TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  steps TEXT NOT NULL DEFAULT '',
  parent_brief TEXT NOT NULL DEFAULT '',
  starting_ideas TEXT NOT NULL DEFAULT '',
  fun_fact TEXT NOT NULL DEFAULT '',
  variations TEXT NOT NULL DEFAULT '',
  suitable_mood TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'need_review',
  min_age INTEGER NOT NULL DEFAULT 2,
  max_age INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT activities_duration_check CHECK (
    duration IN ('', 'under_15', '15_30', '30_60', 'over_60')
  ),
  CONSTRAINT activities_status_check CHECK (
    status IN ('need_review', 'published', 'hidden')
  )
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON activities;
CREATE POLICY "Allow public read"
  ON activities FOR SELECT
  TO anon
  USING (status = 'published');
