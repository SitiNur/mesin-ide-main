import type { Activity } from '../../types/activity'
import {
  getBestTimeLabels,
  getLocationLabels,
  getStatusBadgeClass,
  getStatusLabel,
} from '../../lib/activity-options'
import type { ActivitySort, ActivitySortField } from '../../lib/sort-activities'

type ActivityTableProps = {
  activities: Activity[]
  startIndex?: number
  sort: ActivitySort | null
  approvingId?: number | null
  onSort: (field: ActivitySortField) => void
  onEdit: (activity: Activity) => void
  onApprove: (activity: Activity) => void
  onDelete: (activity: Activity) => void
}

const cellClass = 'px-4 py-3 text-slate-600 whitespace-normal align-top'
const headerClass =
  'text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap align-top'

function SortableHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string
  field: ActivitySortField
  sort: ActivitySort | null
  onSort: (field: ActivitySortField) => void
}) {
  const active = sort?.field === field
  const arrow = active ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <th className={headerClass}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-0.5 hover:text-orange-600 transition-colors ${
          active ? 'text-orange-600' : 'text-slate-700'
        }`}
      >
        {label}
        <span className="text-xs font-normal">{arrow}</span>
      </button>
    </th>
  )
}

export default function ActivityTable({
  activities,
  startIndex = 0,
  sort,
  approvingId = null,
  onSort,
  onEdit,
  onApprove,
  onDelete,
}: ActivityTableProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500 font-medium">Tidak ada aktivitas yang cocok.</p>
        <p className="text-sm text-slate-400 mt-1">
          Ubah filter atau tambahkan aktivitas baru.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-center px-3 py-3 font-semibold text-slate-700 whitespace-nowrap w-12 align-top">
                No.
              </th>
              <SortableHeader label="Nama Aktivitas" field="title" sort={sort} onSort={onSort} />
              <SortableHeader label="Kategori" field="category" sort={sort} onSort={onSort} />
              <th className={headerClass}>Deskripsi Singkat</th>
              <SortableHeader label="Usia Min." field="min_age" sort={sort} onSort={onSort} />
              <SortableHeader label="Usia Maks." field="max_age" sort={sort} onSort={onSort} />
              <th className={headerClass}>Lokasi</th>
              <th className={headerClass}>Waktu Terbaik</th>
              <SortableHeader label="Status" field="status" sort={sort} onSort={onSort} />
              <th className="text-right px-4 py-3 font-semibold text-slate-700 whitespace-nowrap align-top w-28">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => {
              const isApproving = approvingId === activity.id
              const canQuickApprove = activity.status === 'need_review'

              return (
                <tr key={activity.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-3 text-center text-slate-500 align-top w-12">
                    {startIndex + index + 1}
                  </td>
                  <td className={`${cellClass} font-medium text-slate-800`}>
                    {activity.title}
                  </td>
                  <td className={cellClass}>{activity.category}</td>
                  <td className={`${cellClass} text-slate-500 min-w-[200px]`}>
                    {activity.short_desc}
                  </td>
                  <td className={cellClass}>{activity.min_age}</td>
                  <td className={cellClass}>{activity.max_age}</td>
                  <td className={cellClass}>{getLocationLabels(activity.location)}</td>
                  <td className={cellClass}>{getBestTimeLabels(activity.best_time)}</td>
                  <td className={`${cellClass} whitespace-nowrap`}>
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(activity.status)}`}
                    >
                      {getStatusLabel(activity.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(activity)}
                        className="text-orange-600 hover:text-orange-700 font-semibold text-xs"
                      >
                        Edit
                      </button>
                      {canQuickApprove && (
                        <button
                          type="button"
                          onClick={() => onApprove(activity)}
                          disabled={isApproving}
                          title="Publikasikan tanpa buka detail"
                          className="text-emerald-600 hover:text-emerald-700 disabled:opacity-60 font-semibold text-xs text-right"
                        >
                          {isApproving ? 'Mempublikasikan...' : 'Publikasikan'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete(activity)}
                        className="text-red-600 hover:text-red-700 font-semibold text-xs"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
