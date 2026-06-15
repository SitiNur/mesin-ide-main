import type { Activity } from '../../types/activity'

type StatsCardsProps = {
  activities: Activity[]
}

export default function StatsCards({ activities }: StatsCardsProps) {
  const total = activities.length
  const withoutTools = activities.filter((a) => !a.needs_tools).length
  const withTools = activities.filter((a) => a.needs_tools).length

  const cards = [
    { label: 'Total Aktivitas', value: total, accent: 'text-orange-600' },
    { label: 'Tanpa Alat', value: withoutTools, accent: 'text-emerald-600' },
    { label: 'Perlu Alat', value: withTools, accent: 'text-amber-600' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className={`text-3xl font-black mt-1 ${card.accent}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
