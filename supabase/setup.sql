-- PlayBox Kids: schema, RLS, dan contoh data
-- Jalankan di Supabase Dashboard → SQL Editor

-- Tabel activities (lewati jika sudah ada)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  needs_tools BOOLEAN NOT NULL DEFAULT false,
  min_age INTEGER NOT NULL DEFAULT 3,
  duration_mins INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row Level Security: izinkan baca publik via anon key
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON activities;
CREATE POLICY "Allow public read"
  ON activities FOR SELECT
  TO anon
  USING (true);

-- Contoh data (hapus baris ini jika data sudah ada)
INSERT INTO activities (title, needs_tools, min_age, duration_mins) VALUES
  ('Simon Says versi keluarga', false, 3, 10),
  ('Membuat bentuk dari bantal sofa', false, 2, 15),
  ('Mewarnai dengan kapas dan cat air', true, 4, 20),
  ('Balapan mobil mainan di lantai', true, 3, 15),
  ('Tebak benda di dalam kantong', false, 4, 10),
  ('Membuat origami kapal sederhana', true, 5, 25),
  ('Dance freeze dengan lagu favorit', false, 3, 10),
  ('Membuat rumah dari kardus bekas', true, 5, 30),
  ('Storytelling bergantian satu kalimat', false, 4, 15),
  ('Eksperimen baking soda + cuka', true, 6, 20)
ON CONFLICT DO NOTHING;
