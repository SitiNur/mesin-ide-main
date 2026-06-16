-- PlayBox Kids: status enum (need_review | published | hidden)
-- Jalankan di Supabase SQL Editor

-- Reset semua record ke need_review
UPDATE activities SET status = 'need_review';

ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_status_check;

ALTER TABLE activities
  ALTER COLUMN status SET DEFAULT 'need_review';

ALTER TABLE activities
  ADD CONSTRAINT activities_status_check
  CHECK (status IN ('need_review', 'published', 'hidden'));

-- Homepage (anon): hanya aktivitas published
DROP POLICY IF EXISTS "Allow public read" ON activities;
CREATE POLICY "Allow public read"
  ON activities FOR SELECT
  TO anon
  USING (status = 'published');
