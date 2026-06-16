import type { Activity } from '../../types/activity'
import { getStatusLabel } from '../../lib/activity-options'

type StatsCardsProps = {
  activities: Activity[]
  onFilterStatus?: (status: Activity['status'] | 'all') => void
}

export default function StatsCards({ activities, onFilterStatus }: StatsCardsProps) {
  const total = activities.length
  const needReview = activities.filter((a) => a.status === 'need_review').length
  const published = activities.filter((a) => a.status === 'published').length
  const hidden = activities.filter((a) => a.status === 'hidden').length

  const cards = [
    { label: 'Total Aktivitas', value: total, accent: 'text-orange-600', status: 'all' as const },
    { label: 'Perlu Review', value: needReview, accent: 'text-amber-600', status: 'need_review' as const },
    { label: 'Dipublikasikan', value: published, accent: 'text-emerald-600', status: 'published' as const },
    { label: 'Disembunyikan', value: hidden, accent: 'text-slate-600', status: 'hidden' as const },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <button
          key={card.label}
          type="button"
          onClick={() => onFilterStatus?.(card.status)}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-left hover:border-orange-300 hover:shadow transition-colors"
          title={card.status === 'all' ? 'Tampilkan semua' : `Filter: ${getStatusLabel(card.status)}`}
        >
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className={`text-3xl font-black mt-1 ${card.accent}`}>{card.value}</p>
        </button>
      ))}
    </div>
  )
}
