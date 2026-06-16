import type { AdminActivityFilters } from '../../types/activity'
import { emptyAdminFilters } from '../../types/activity'
import {
  ACTIVITY_STATUS_OPTIONS,
  BEST_TIME_OPTIONS,
  LOCATION_OPTIONS,
} from '../../lib/activity-options'

type ActivityFiltersProps = {
  filters: AdminActivityFilters
  categoryOptions: string[]
  onChange: (filters: AdminActivityFilters) => void
}

export default function ActivityFilters({
  filters,
  categoryOptions,
  onChange,
}: ActivityFiltersProps) {
  const update = (partial: Partial<AdminActivityFilters>) => {
    onChange({ ...filters, ...partial })
  }

  const parseAgeInput = (value: string): number | null => {
    if (!value.trim()) return null
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? null : parsed
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700">Filter</h3>
        <button
          type="button"
          onClick={() => onChange(emptyAdminFilters)}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700"
        >
          Reset filter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="filter-title" className="block text-xs font-semibold text-slate-600 mb-1">
            Nama Aktivitas
          </label>
          <input
            id="filter-title"
            type="text"
            value={filters.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Cari nama..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label htmlFor="filter-category" className="block text-xs font-semibold text-slate-600 mb-1">
            Kategori
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Semua</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-status" className="block text-xs font-semibold text-slate-600 mb-1">
            Status
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) =>
              update({ status: e.target.value as AdminActivityFilters['status'] })
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">Semua</option>
            {ACTIVITY_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-min-age" className="block text-xs font-semibold text-slate-600 mb-1">
            Usia Min.
          </label>
          <input
            id="filter-min-age"
            type="number"
            min={1}
            value={filters.minAge ?? ''}
            onChange={(e) => update({ minAge: parseAgeInput(e.target.value) })}
            placeholder="Semua"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label htmlFor="filter-max-age" className="block text-xs font-semibold text-slate-600 mb-1">
            Usia Maks.
          </label>
          <input
            id="filter-max-age"
            type="number"
            min={1}
            value={filters.maxAge ?? ''}
            onChange={(e) => update({ maxAge: parseAgeInput(e.target.value) })}
            placeholder="Semua"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label htmlFor="filter-location" className="block text-xs font-semibold text-slate-600 mb-1">
            Lokasi
          </label>
          <select
            id="filter-location"
            value={filters.location}
            onChange={(e) =>
              update({ location: e.target.value as AdminActivityFilters['location'] })
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">Semua</option>
            {LOCATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-best-time" className="block text-xs font-semibold text-slate-600 mb-1">
            Waktu Terbaik
          </label>
          <select
            id="filter-best-time"
            value={filters.bestTime}
            onChange={(e) =>
              update({ bestTime: e.target.value as AdminActivityFilters['bestTime'] })
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">Semua</option>
            {BEST_TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
