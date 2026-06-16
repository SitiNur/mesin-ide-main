import type { Activity } from '../types/activity'
import type { ActivityStatus } from './activity-options'

export type ActivitySortField = 'title' | 'category' | 'min_age' | 'max_age' | 'status'
export type SortDirection = 'asc' | 'desc'

export type ActivitySort = {
  field: ActivitySortField
  direction: SortDirection
}

const STATUS_ORDER: Record<ActivityStatus, number> = {
  need_review: 0,
  published: 1,
  hidden: 2,
}

export function sortActivities(
  activities: Activity[],
  sort: ActivitySort
): Activity[] {
  const mult = sort.direction === 'asc' ? 1 : -1

  return [...activities].sort((a, b) => {
    let cmp = 0

    switch (sort.field) {
      case 'title':
      case 'category':
        cmp = a[sort.field].localeCompare(b[sort.field], 'id')
        break
      case 'min_age':
      case 'max_age':
        cmp = a[sort.field] - b[sort.field]
        break
      case 'status':
        cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        break
    }

    return cmp * mult || a.id - b.id
  })
}

export function toggleSort(
  current: ActivitySort | null,
  field: ActivitySortField
): ActivitySort {
  if (current?.field === field) {
    return { field, direction: current.direction === 'asc' ? 'desc' : 'asc' }
  }
  return { field, direction: 'asc' }
}
