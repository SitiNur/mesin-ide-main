-- Hapus kolom description yang tidak dibutuhkan
-- Jalankan di Supabase SQL Editor

ALTER TABLE activities DROP COLUMN IF EXISTS description;
