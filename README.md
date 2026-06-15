# PlayBox Kids

Aplikasi Next.js untuk menemukan ide bermain anak secara acak berdasarkan filter usia dan kebutuhan alat. Data disimpan di Supabase.

## Prasyarat

- Node.js 20+
- Akun [Supabase](https://supabase.com) dengan project aktif
- (Opsional) Akun [Vercel](https://vercel.com) untuk deploy

## Setup Lokal

1. Clone repository dan install dependensi:

```bash
npm install
```

2. Salin environment variables:

```bash
cp .env.example .env.local
```

3. Isi `.env.local` dari Supabase Dashboard → **Project Settings** → **API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Pastikan tabel `activities` dan RLS sudah benar.

5. Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Dashboard Admin

Dashboard admin tersedia di [http://localhost:3000/admin](http://localhost:3000/admin).

### Setup Akun Admin

1. **Buat user admin** di Supabase Dashboard → **Authentication** → **Users** → **Add user**.

2. **Jalankan RLS admin** — edit email admin di [`supabase/admin-setup.sql`](supabase/admin-setup.sql), lalu jalankan script tersebut di Supabase SQL Editor. Script ini mencakup policy **Admin read** agar admin yang login bisa membaca data.

3. Buka `/admin/login`, masuk dengan email dan password admin.

### Migrasi Database

Jika kolom `description` masih ada dari migrasi lama, jalankan [`supabase/migration-drop-description.sql`](supabase/migration-drop-description.sql).

### Fitur Admin

- Tabel 9 kolom: Nama, Kategori, Deskripsi Singkat, Alat, Usia Min/Maks, Lokasi, Waktu Terbaik, Status
- Filter sederhana: nama, kategori, alat
- Klik nama aktivitas → panel detail semua kolom database (fetch ulang dari DB)
- Form tambah aktivitas dengan semua field

### Kolom Activities (schema production)

| Kolom | Keterangan |
|-------|------------|
| `title` | Nama aktivitas |
| `short_desc` | Deskripsi singkat |
| `category` | Kategori |
| `duration` | Durasi (teks, misal "15–20 menit") |
| `best_time` | Waktu terbaik |
| `location` | Indoor / Outdoor |
| `ideal_age` | Rentang usia ideal (teks) |
| `needs_tools` | Perlu alat/bahan |
| `tools_list` | Daftar alat |
| `prep_level` | Tingkat persiapan |
| `overview` | Ringkasan |
| `steps` | Langkah-langkah |
| `parent_brief` | Panduan orang tua |
| `starting_ideas` | Ide pembuka |
| `fun_fact` | Fakta menarik |
| `variations` | Variasi |
| `suitable_mood` | Mood cocok |
| `status` | Status (misal "Need Review") |
| `min_age` / `max_age` | Usia minimal/maksimal (angka) |
| `benefit_tags` | Tag manfaat |
| `created_at` | Timestamp dibuat |

## Build Production

```bash
npm run build
npm run start
```

## Deploy ke Vercel

1. Push project ke GitHub
2. Import repository di Vercel
3. Tambahkan environment variables yang sama seperti `.env.local`
4. Deploy

## Struktur Project

```
app/
├── page.tsx                    # UI utama
├── admin/                      # Dashboard admin
├── components/admin/
│   ├── ActivityTable.tsx
│   ├── ActivityFilters.tsx
│   ├── ActivityForm.tsx
│   ├── ActivityFormFields.tsx
│   ├── ActivityDetailPanel.tsx
│   └── StatsCards.tsx
├── lib/
│   ├── activities.ts           # Query publik
│   ├── admin-activities.ts     # CRUD admin
│   ├── activity-categories.ts
│   └── filter-activities.ts
└── types/activity.ts
supabase/
├── setup.sql
├── admin-setup.sql
└── migration-drop-description.sql
```
