import type { Activity, ActivityFilters, ActivityResult } from '../types/activity'
import { createClient } from './supabase/client'
import { normalizeActivity } from './activity-mapper'

export async function fetchRandomActivity(
  filters: ActivityFilters
): Promise<ActivityResult> {
  const supabase = createClient()
  let query = supabase.from('activities').select('*').eq('status', 'published')

  if (filters.needsTools !== null) {
    query = query.eq('needs_tools', filters.needsTools)
  }

  if (filters.maxChildAge !== null) {
    query = query
      .lte('min_age', filters.maxChildAge)
      .gte('max_age', filters.maxChildAge)
  }

  const { data, error } = await query

  if (error) {
    return {
      status: 'error',
      message: 'Gagal mengambil ide. Coba lagi sebentar lagi.',
    }
  }

  if (!data || data.length === 0) {
    return {
      status: 'empty',
      message: 'Yah, belum ada ide yang pas. Coba ganti filter!',
    }
  }

  const randomIndex = Math.floor(Math.random() * data.length)
  return {
    status: 'found',
    activity: normalizeActivity(data[randomIndex] as Record<string, unknown>),
  }
}
