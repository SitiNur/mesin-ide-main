import { createClient } from '@supabase/supabase-js'

// Harus akses langsung (bukan process.env[name]) agar Next.js
// bisa inline nilai NEXT_PUBLIC_* ke bundle browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Kredensial Supabase belum diset. Salin .env.example ke .env.local dan isi NEXT_PUBLIC_SUPABASE_URL serta NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
