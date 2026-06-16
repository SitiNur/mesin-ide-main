import type { Activity, AdminActivityFilters } from '../types/activity'

export function filterActivities(
  activities: Activity[],
  filters: AdminActivityFilters
): Activity[] {
  return activities.filter((activity) => {
    if (filters.title.trim()) {
      const query = filters.title.trim().toLowerCase()
      if (!activity.title.toLowerCase().includes(query)) return false
    }

    if (filters.category) {
      if (activity.category !== filters.category) return false
    }

    if (filters.status !== 'all' && activity.status !== filters.status) return false

    if (filters.minAge !== null && activity.min_age !== filters.minAge) return false

    if (filters.maxAge !== null && activity.max_age !== filters.maxAge) return false

    if (filters.location !== 'all' && !activity.location.includes(filters.location)) {
      return false
    }

    if (filters.bestTime !== 'all' && !activity.best_time.includes(filters.bestTime)) {
      return false
    }

    return true
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || ''
  return `${text.slice(0, maxLength)}...`
}
