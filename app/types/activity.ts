export type Activity = {
  id: string
  title: string
  needs_tools: boolean
  min_age: number
  duration_mins: number | null
}

export type ActivityFilters = {
  needsTools: boolean | null
  maxChildAge: number | null
}

export type ActivityResult =
  | { status: 'found'; activity: Activity }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string }
