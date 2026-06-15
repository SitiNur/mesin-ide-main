import { createBrowserClient } from '@supabase/ssr'

function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Kredensial Supabase belum diset. Salin .env.example ke .env.local dan isi NEXT_PUBLIC_SUPABASE_URL serta NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  return { supabaseUrl, supabaseAnonKey }
}

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
