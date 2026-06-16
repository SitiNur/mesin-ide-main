import type { Activity } from '../types/activity'
import type { ActivityStatus } from './activity-options'
import { createClient } from './supabase/client'
import { normalizeActivities, normalizeActivity } from './activity-mapper'

export type ActivityPayload = Omit<Activity, 'id' | 'created_at'>

export const emptyActivityPayload: ActivityPayload = {
  title: '',
  short_desc: '',
  benefit_tags: '',
  category: '',
  duration: '',
  best_time: [],
  location: [],
  needs_tools: false,
  tools_list: '',
  prep_level: '',
  overview: '',
  steps: '',
  parent_brief: '',
  starting_ideas: '',
  fun_fact: '',
  variations: '',
  suitable_mood: '',
  status: 'need_review',
  min_age: 2,
  max_age: 8,
}

type CrudResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string }

export async function listActivities(): Promise<CrudResult<Activity[]>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })

  if (error) {
    return { ok: false, message: 'Gagal memuat daftar aktivitas.' }
  }

  return { ok: true, data: normalizeActivities((data ?? []) as Record<string, unknown>[]) }
}

export async function getActivityById(id: number): Promise<CrudResult<Activity>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { ok: false, message: 'Gagal memuat detail aktivitas.' }
  }

  return { ok: true, data: normalizeActivity(data as Record<string, unknown>) }
}

export async function createActivity(
  payload: ActivityPayload
): Promise<CrudResult<Activity>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activities')
    .insert(payload)
    .select()
    .single()

  if (error) {
    return { ok: false, message: 'Gagal menambah aktivitas.' }
  }

  return { ok: true, data: normalizeActivity(data as Record<string, unknown>) }
}

export async function updateActivity(
  id: number,
  payload: ActivityPayload
): Promise<CrudResult<Activity>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activities')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { ok: false, message: 'Gagal memperbarui aktivitas.' }
  }

  return { ok: true, data: normalizeActivity(data as Record<string, unknown>) }
}

export async function updateActivityStatus(
  id: number,
  status: ActivityStatus
): Promise<CrudResult<Activity>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activities')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { ok: false, message: 'Gagal memperbarui status aktivitas.' }
  }

  return { ok: true, data: normalizeActivity(data as Record<string, unknown>) }
}

export async function deleteActivity(id: number): Promise<CrudResult<null>> {
  const supabase = createClient()
  const { error } = await supabase.from('activities').delete().eq('id', id)

  if (error) {
    return { ok: false, message: 'Gagal menghapus aktivitas.' }
  }

  return { ok: true, data: null }
}
