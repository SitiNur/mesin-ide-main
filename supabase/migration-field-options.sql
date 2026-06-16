-- Migrasi: duration slug, best_time & location ke TEXT[]
-- Jalankan di Supabase SQL Editor
-- Catatan: jika langkah 1 sudah berhasil sebelumnya, bisa mulai dari langkah 2.

-- Helper: parse teks best_time lama ke TEXT[]
CREATE OR REPLACE FUNCTION migrate_best_time_to_array(val TEXT)
RETURNS TEXT[] AS $$
DECLARE
  tokens TEXT[];
  token TEXT;
  result TEXT[] := '{}';
  slug TEXT;
BEGIN
  IF val IS NULL OR trim(val) = '' THEN
    RETURN '{}';
  END IF;

  tokens := string_to_array(
    lower(replace(replace(trim(val), ' | ', '|'), ' ', '')),
    '|'
  );

  FOREACH token IN ARRAY tokens
  LOOP
    slug := NULL;
    IF token LIKE '%pagi%' THEN
      slug := 'pagi';
    ELSIF token LIKE '%siang%' THEN
      slug := 'siang';
    ELSIF token LIKE '%sore%' THEN
      slug := 'sore';
    ELSIF token LIKE '%malam%' OR token LIKE '%tidur%' OR token LIKE '%sebelum%' THEN
      slug := 'sebelum_tidur';
    END IF;

    IF slug IS NOT NULL AND NOT (slug = ANY(result)) THEN
      result := array_append(result, slug);
    END IF;
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper: parse teks location lama ke TEXT[]
CREATE OR REPLACE FUNCTION migrate_location_to_array(val TEXT)
RETURNS TEXT[] AS $$
DECLARE
  lower_val TEXT;
BEGIN
  IF val IS NULL OR trim(val) = '' THEN
    RETURN '{}';
  END IF;

  lower_val := lower(trim(val));

  IF lower_val LIKE '%indoor%' AND lower_val LIKE '%outdoor%' THEN
    RETURN ARRAY['indoor', 'outdoor'];
  ELSIF lower_val LIKE '%indoor%' OR lower_val LIKE '%dalam%' THEN
    RETURN ARRAY['indoor'];
  ELSIF lower_val LIKE '%outdoor%' OR lower_val LIKE '%luar%' THEN
    RETURN ARRAY['outdoor'];
  END IF;

  RETURN '{}';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 1. Durasi: map teks lama ke slug
UPDATE activities SET duration = CASE
  WHEN duration IS NULL OR trim(duration) = '' THEN ''
  WHEN lower(duration) IN ('under_15', '15_30', '30_60', 'over_60') THEN lower(duration)
  WHEN lower(duration) LIKE '%kurang%' OR lower(duration) LIKE '%< 15%' THEN 'under_15'
  WHEN lower(duration) LIKE '%1 jam%' OR lower(duration) LIKE '%60%' OR lower(duration) LIKE '%jam+%' THEN 'over_60'
  WHEN lower(duration) LIKE '%30%' AND (lower(duration) LIKE '%60%' OR lower(duration) LIKE '%45%') THEN '30_60'
  WHEN lower(duration) LIKE '%15%' OR lower(duration) LIKE '%20%' OR lower(duration) LIKE '%25%' THEN '15_30'
  WHEN lower(duration) LIKE '%30%' THEN '30_60'
  ELSE '15_30'
END;

ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_duration_check;
ALTER TABLE activities ADD CONSTRAINT activities_duration_check
  CHECK (duration IN ('', 'under_15', '15_30', '30_60', 'over_60'));

-- 2. best_time → TEXT[] (lewat fungsi, bukan subquery di USING)
ALTER TABLE activities
  ALTER COLUMN best_time TYPE TEXT[]
  USING migrate_best_time_to_array(best_time::text);

ALTER TABLE activities ALTER COLUMN best_time SET DEFAULT '{}';
ALTER TABLE activities ALTER COLUMN best_time SET NOT NULL;

-- 3. location → TEXT[]
ALTER TABLE activities
  ALTER COLUMN location TYPE TEXT[]
  USING migrate_location_to_array(location::text);

ALTER TABLE activities ALTER COLUMN location SET DEFAULT '{}';
ALTER TABLE activities ALTER COLUMN location SET NOT NULL;

-- Opsional: hapus fungsi helper setelah migrasi
DROP FUNCTION IF EXISTS migrate_best_time_to_array(TEXT);
DROP FUNCTION IF EXISTS migrate_location_to_array(TEXT);
