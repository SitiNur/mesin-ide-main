-- PlayBox Kids: RLS admin untuk CRUD activities
-- Jalankan di Supabase Dashboard → SQL Editor SETELAH setup.sql
--
-- LANGKAH MANUAL:
-- 1. Ganti 'admin@example.com' di bawah dengan email admin Anda
-- 2. Buat user admin: Authentication → Users → Add user (email + password)
-- 3. Jalankan script ini

-- Helper: cek apakah user login adalah admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'email' = 'admin@example.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin: baca aktivitas
DROP POLICY IF EXISTS "Admin read" ON activities;
CREATE POLICY "Admin read"
  ON activities FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: tambah aktivitas
DROP POLICY IF EXISTS "Admin insert" ON activities;
CREATE POLICY "Admin insert"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: ubah aktivitas
DROP POLICY IF EXISTS "Admin update" ON activities;
CREATE POLICY "Admin update"
  ON activities FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: hapus aktivitas
DROP POLICY IF EXISTS "Admin delete" ON activities;
CREATE POLICY "Admin delete"
  ON activities FOR DELETE
  TO authenticated
  USING (is_admin());
