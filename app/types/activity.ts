export type Activity = {
  id: number
  title: string
  short_desc: string
  benefit_tags: string
  category: string
  duration: string
  best_time: string
  location: string
  ideal_age: string
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
  status: string
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
  needsTools: 'all' | 'true' | 'false'
}

export const emptyAdminFilters: AdminActivityFilters = {
  title: '',
  category: '',
  needsTools: 'all',
}

export type ActivityResult =
  | { status: 'found'; activity: Activity }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string }
