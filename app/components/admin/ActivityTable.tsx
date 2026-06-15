import type { Activity } from '../../types/activity'
import { truncateText } from '../../lib/filter-activities'

type ActivityTableProps = {
  activities: Activity[]
  startIndex?: number
  onViewDetail: (activity: Activity) => void
  onDelete: (activity: Activity) => void
}

function statusBadgeClass(status: string): string {
  if (status === 'Published' || status === 'Active') {
    return 'bg-emerald-100 text-emerald-800'
  }
  if (status === 'Need Review') {
    return 'bg-amber-100 text-amber-800'
  }
  return 'bg-slate-100 text-slate-700'
}

export default function ActivityTable({
  activities,
  startIndex = 0,
  onViewDetail,
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
              <th className="text-center px-3 py-3 font-semibold text-slate-700 whitespace-nowrap w-12">No.</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Nama Aktivitas</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Kategori</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Deskripsi Singkat</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Alat</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Usia Min.</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Usia Maks.</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Lokasi</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Waktu Terbaik</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-3 text-center text-slate-500 whitespace-nowrap w-12">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-3 max-w-[160px]">
                  <button
                    type="button"
                    onClick={() => onViewDetail(activity)}
                    className="font-medium text-orange-600 hover:text-orange-700 hover:underline text-left truncate block max-w-full"
                    title={activity.title}
                  >
                    {activity.title}
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap max-w-[140px] truncate" title={activity.category}>
                  {activity.category}
                </td>
                <td className="px-4 py-3 text-slate-500 max-w-[180px]">
                  <span title={activity.short_desc}>
                    {truncateText(activity.short_desc, 60)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                      activity.needs_tools
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {activity.needs_tools ? 'Perlu alat' : 'Tanpa alat'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{activity.min_age}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{activity.max_age}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{activity.location}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap max-w-[120px] truncate" title={activity.best_time}>
                  {activity.best_time}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadgeClass(activity.status)}`}>
                    {activity.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onDelete(activity)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
