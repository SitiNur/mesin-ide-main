import type { AdminActivityFilters } from '../../types/activity'
import { emptyAdminFilters } from '../../types/activity'

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <label htmlFor="filter-tools" className="block text-xs font-semibold text-slate-600 mb-1">
            Alat
          </label>
          <select
            id="filter-tools"
            value={filters.needsTools}
            onChange={(e) =>
              update({ needsTools: e.target.value as AdminActivityFilters['needsTools'] })
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">Semua</option>
            <option value="false">Tanpa alat</option>
            <option value="true">Perlu alat</option>
          </select>
        </div>
      </div>
    </div>
  )
}
