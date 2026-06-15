import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

export async function createClient() {
  const cookieStore = await cookies()
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // setAll dipanggil dari Server Component; abaikan jika read-only
        }
      },
    },
  })
}
