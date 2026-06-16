export const DURATION_OPTIONS = [
  { value: 'under_15', label: 'Kurang dari 15 menit' },
  { value: '15_30', label: '15–30 menit' },
  { value: '30_60', label: '30–60 menit' },
  { value: 'over_60', label: '60 menit+' },
] as const

export const BEST_TIME_OPTIONS = [
  { value: 'pagi', label: 'Pagi' },
  { value: 'siang', label: 'Siang' },
  { value: 'sore', label: 'Sore' },
  { value: 'sebelum_tidur', label: 'Sebelum Tidur' },
] as const

export const LOCATION_OPTIONS = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
] as const

export const ACTIVITY_STATUS_OPTIONS = [
  { value: 'need_review', label: 'Perlu Review' },
  { value: 'published', label: 'Dipublikasikan' },
  { value: 'hidden', label: 'Disembunyikan' },
] as const

export type DurationSlug = (typeof DURATION_OPTIONS)[number]['value']
export type ActivityStatus = (typeof ACTIVITY_STATUS_OPTIONS)[number]['value']
export type BestTimeSlug = (typeof BEST_TIME_OPTIONS)[number]['value']
export type LocationSlug = (typeof LOCATION_OPTIONS)[number]['value']

const DURATION_LABELS = Object.fromEntries(
  DURATION_OPTIONS.map((o) => [o.value, o.label])
) as Record<DurationSlug, string>

const BEST_TIME_LABELS = Object.fromEntries(
  BEST_TIME_OPTIONS.map((o) => [o.value, o.label])
) as Record<BestTimeSlug, string>

const LOCATION_LABELS = Object.fromEntries(
  LOCATION_OPTIONS.map((o) => [o.value, o.label])
) as Record<LocationSlug, string>

const VALID_DURATIONS = new Set<string>(DURATION_OPTIONS.map((o) => o.value))
const VALID_BEST_TIMES = new Set<string>(BEST_TIME_OPTIONS.map((o) => o.value))
const VALID_LOCATIONS = new Set<string>(LOCATION_OPTIONS.map((o) => o.value))
const VALID_STATUSES = new Set<string>(ACTIVITY_STATUS_OPTIONS.map((o) => o.value))

const STATUS_LABELS = Object.fromEntries(
  ACTIVITY_STATUS_OPTIONS.map((o) => [o.value, o.label])
) as Record<ActivityStatus, string>

export function getDurationLabel(slug: string): string {
  if (!slug) return '—'
  return DURATION_LABELS[slug as DurationSlug] ?? slug
}

export function getBestTimeLabels(slugs: string[]): string {
  if (!slugs.length) return '—'
  return slugs.map((s) => BEST_TIME_LABELS[s as BestTimeSlug] ?? s).join(', ')
}

export function getLocationLabels(slugs: string[]): string {
  if (!slugs.length) return '—'
  return slugs.map((s) => LOCATION_LABELS[s as LocationSlug] ?? s).join(', ')
}

export function getStatusLabel(status: string): string {
  if (!status) return '—'
  return STATUS_LABELS[status as ActivityStatus] ?? status
}

export function getStatusBadgeClass(status: string): string {
  if (status === 'published') return 'bg-emerald-100 text-emerald-800'
  if (status === 'need_review') return 'bg-amber-100 text-amber-800'
  if (status === 'hidden') return 'bg-slate-200 text-slate-600'
  return 'bg-slate-100 text-slate-700'
}

export function normalizeStatus(value: unknown): ActivityStatus {
  if (typeof value !== 'string' || !value.trim()) return 'need_review'
  const v = value.trim().toLowerCase().replace(/\s+/g, '_')
  if (VALID_STATUSES.has(v)) return v as ActivityStatus
  if (v.includes('publish') || v === 'active') return 'published'
  if (v.includes('hide') || v.includes('sembunyi')) return 'hidden'
  if (v.includes('review') || v.includes('draft')) return 'need_review'
  return 'need_review'
}

export function normalizeDuration(value: unknown): DurationSlug | '' {
  if (typeof value !== 'string' || !value.trim()) return ''
  const v = value.trim().toLowerCase()
  if (VALID_DURATIONS.has(v)) return v as DurationSlug

  if (v.includes('kurang') || v.includes('< 15') || v.includes('under')) return 'under_15'
  if (v.includes('1 jam') || v.includes('60') || v.includes('jam+') || v.includes('jam +')) {
    return 'over_60'
  }
  if (v.includes('30') && (v.includes('60') || v.includes('45'))) return '30_60'
  if (v.includes('15') || v.includes('20') || v.includes('25')) return '15_30'
  if (v.includes('30')) return '30_60'

  return ''
}

function tokenToBestTimeSlug(token: string): BestTimeSlug | null {
  const t = token.trim().toLowerCase().replace(/\s+/g, '_')
  if (VALID_BEST_TIMES.has(t)) return t as BestTimeSlug
  if (t.includes('pagi')) return 'pagi'
  if (t.includes('siang')) return 'siang'
  if (t.includes('sore')) return 'sore'
  if (t.includes('malam')) return 'sebelum_tidur'
  if (t.includes('sebelum') && t.includes('tidur')) return 'sebelum_tidur'
  if (t.includes('tidur')) return 'sebelum_tidur'
  return null
}

function tokenToLocationSlug(token: string): LocationSlug | null {
  const t = token.trim().toLowerCase()
  if (VALID_LOCATIONS.has(t)) return t as LocationSlug
  if (t.includes('indoor') || t.includes('dalam')) return 'indoor'
  if (t.includes('outdoor') || t.includes('luar')) return 'outdoor'
  return null
}

export function normalizeBestTime(value: unknown): BestTimeSlug[] {
  if (Array.isArray(value)) {
    const slugs = value
      .flatMap((v) => (typeof v === 'string' ? tokenToBestTimeSlug(v) : null))
      .filter((s): s is BestTimeSlug => s !== null)
    return [...new Set(slugs)]
  }

  if (typeof value !== 'string' || !value.trim()) return []

  return [
    ...new Set(
      value
        .split(/[|,]/)
        .map(tokenToBestTimeSlug)
        .filter((s): s is BestTimeSlug => s !== null)
    ),
  ]
}

export function normalizeLocation(value: unknown): LocationSlug[] {
  if (Array.isArray(value)) {
    const slugs = value
      .flatMap((v) => (typeof v === 'string' ? tokenToLocationSlug(v) : null))
      .filter((s): s is LocationSlug => s !== null)
    return [...new Set(slugs)]
  }

  if (typeof value !== 'string' || !value.trim()) return []

  return [
    ...new Set(
      value
        .split(/[|,]/)
        .map(tokenToLocationSlug)
        .filter((s): s is LocationSlug => s !== null)
    ),
  ]
}

export function toggleArrayItem<T extends string>(items: T[], item: T): T[] {
  return items.includes(item) ? items.filter((i) => i !== item) : [...items, item]
}

export const ALL_BEST_TIME_SLUGS: BestTimeSlug[] = BEST_TIME_OPTIONS.map((o) => o.value)
