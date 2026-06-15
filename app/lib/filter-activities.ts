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

    if (filters.needsTools === 'true' && !activity.needs_tools) return false
    if (filters.needsTools === 'false' && activity.needs_tools) return false

    return true
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || ''
  return `${text.slice(0, maxLength)}...`
}
