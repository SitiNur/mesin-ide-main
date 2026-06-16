import type { Activity } from '../types/activity'
import {
  normalizeBestTime,
  normalizeDuration,
  normalizeLocation,
  normalizeStatus,
} from './activity-options'

export function normalizeActivity(row: Record<string, unknown>): Activity {
  return {
    ...(row as unknown as Activity),
    duration: normalizeDuration(row.duration),
    best_time: normalizeBestTime(row.best_time),
    location: normalizeLocation(row.location),
    status: normalizeStatus(row.status),
  }
}

export function normalizeActivities(rows: Record<string, unknown>[]): Activity[] {
  return rows.map(normalizeActivity)
}
