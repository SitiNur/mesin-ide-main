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

4. Pastikan tabel `activities` dan RLS sudah benar. Jika belum, jalankan [`supabase/setup.sql`](supabase/setup.sql) di Supabase SQL Editor.

5. Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Build Production

```bash
npm run build
npm run start
```

## Deploy ke Vercel

1. Push project ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) → Import repository
3. Tambahkan environment variables yang sama seperti `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

Setiap push ke branch utama akan otomatis redeploy.

## Struktur Project

```
app/
├── page.tsx              # UI utama
├── layout.tsx            # Metadata & layout
├── lib/
│   ├── supabase.ts       # Koneksi Supabase
│   └── activities.ts     # Query ide bermain
└── types/
    └── activity.ts       # TypeScript types
supabase/
└── setup.sql             # Schema, RLS, dan contoh data
```
