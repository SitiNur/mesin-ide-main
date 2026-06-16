import type { ActivityStatus, BestTimeSlug, LocationSlug } from '../lib/activity-options'

export type Activity = {
  id: number
  title: string
  short_desc: string
  benefit_tags: string
  category: string
  duration: string
  best_time: string[]
  location: string[]
  needs_tools: boolean
  tools_list: string
  prep_level: string
  overview: string
  steps: string
  parent_brief: string
  starting_ideas: string
  fun_fact: string
  variations: string
  suitable_mood: string
  status: ActivityStatus
  created_at: string
  min_age: number
  max_age: number
}

export type ActivityFilters = {
  needsTools: boolean | null
  maxChildAge: number | null
}

export type AdminActivityFilters = {
  title: string
  category: string
  status: ActivityStatus | 'all'
  minAge: number | null
  maxAge: number | null
  location: LocationSlug | 'all'
  bestTime: BestTimeSlug | 'all'
}

export const emptyAdminFilters: AdminActivityFilters = {
  title: '',
  category: '',
  status: 'all',
  minAge: null,
  maxAge: null,
  location: 'all',
  bestTime: 'all',
}

export type ActivityResult =
  | { status: 'found'; activity: Activity }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string }
