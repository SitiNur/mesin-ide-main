'use client'

import type { ActivityPayload } from '../../lib/admin-activities'
import {
  ACTIVITY_STATUS_OPTIONS,
  ALL_BEST_TIME_SLUGS,
  BEST_TIME_OPTIONS,
  DURATION_OPTIONS,
  LOCATION_OPTIONS,
  type ActivityStatus,
  type BestTimeSlug,
  type LocationSlug,
  toggleArrayItem,
} from '../../lib/activity-options'

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
const textareaClass = `${inputClass} resize-y`
const labelClass = 'block text-sm font-semibold text-slate-700 mb-1'

type ActivityFormFieldsProps = {
  form: ActivityPayload
  onChange: (form: ActivityPayload) => void
}

function MultiSelectCheckboxes<T extends string>({
  label,
  options,
  selected,
  onChange,
  allOption,
}: {
  label: string
  options: readonly { value: T; label: string }[]
  selected: T[]
  onChange: (values: T[]) => void
  allOption?: { label: string; allValues: T[] }
}) {
  const allSelected =
    allOption !== undefined &&
    allOption.allValues.length > 0 &&
    allOption.allValues.every((v) => selected.includes(v))

  return (
    <fieldset>
      <legend className={labelClass}>{label}</legend>
      <div className="mt-2 space-y-2 rounded-lg border border-slate-200 p-3 bg-slate-50">
        {allOption && (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() =>
                onChange(allSelected ? [] : [...allOption.allValues])
              }
              className="rounded border-slate-300 text-orange-500 focus:ring-orange-400"
            />
            {allOption.label}
          </label>
        )}
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onChange(toggleArrayItem(selected, opt.value))}
              className="rounded border-slate-300 text-orange-500 focus:ring-orange-400"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function ActivityFormFields({ form, onChange }: ActivityFormFieldsProps) {
  const set = <K extends keyof ActivityPayload>(key: K, value: ActivityPayload[K]) => {
    onChange({ ...form, [key]: value })
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Dasar</h3>
        <div>
          <label htmlFor="field-title" className={labelClass}>Nama Aktivitas</label>
          <input id="field-title" type="text" required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="field-category" className={labelClass}>Kategori</label>
          <input id="field-category" type="text" required value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="field-short-desc" className={labelClass}>Deskripsi Singkat</label>
          <textarea id="field-short-desc" rows={2} required value={form.short_desc} onChange={(e) => set('short_desc', e.target.value)} className={textareaClass} />
        </div>
        <div>
          <label htmlFor="field-status" className={labelClass}>Status</label>
          <select
            id="field-status"
            value={form.status}
            onChange={(e) => set('status', e.target.value as ActivityStatus)}
            className={`${inputClass} bg-white`}
          >
            {ACTIVITY_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Waktu & Tempat</h3>
        <div>
          <label htmlFor="field-duration" className={labelClass}>Durasi</label>
          <select
            id="field-duration"
            required
            value={form.duration}
            onChange={(e) => set('duration', e.target.value)}
            className={`${inputClass} bg-white`}
          >
            <option value="">Pilih durasi...</option>
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <MultiSelectCheckboxes
          label="Waktu Terbaik"
          options={BEST_TIME_OPTIONS}
          selected={form.best_time as BestTimeSlug[]}
          onChange={(values) => set('best_time', values)}
          allOption={{ label: 'Semua waktu', allValues: ALL_BEST_TIME_SLUGS }}
        />

        <MultiSelectCheckboxes
          label="Lokasi"
          options={LOCATION_OPTIONS}
          selected={form.location as LocationSlug[]}
          onChange={(values) => set('location', values)}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Usia</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-min-age" className={labelClass}>Usia Min.</label>
            <input id="field-min-age" type="number" min={1} required value={form.min_age} onChange={(e) => set('min_age', Number.parseInt(e.target.value, 10) || 1)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="field-max-age" className={labelClass}>Usia Maks.</label>
            <input id="field-max-age" type="number" min={1} required value={form.max_age} onChange={(e) => set('max_age', Number.parseInt(e.target.value, 10) || 1)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Konten</h3>
        {([
          ['overview', 'Ringkasan', 4],
          ['steps', 'Langkah-langkah', 6],
          ['parent_brief', 'Panduan Orang Tua', 5],
          ['starting_ideas', 'Ide Pembuka', 4],
        ] as const).map(([key, label, rows]) => (
          <div key={key}>
            <label htmlFor={`field-${key}`} className={labelClass}>{label}</label>
            <textarea id={`field-${key}`} rows={rows} value={form[key]} onChange={(e) => set(key, e.target.value)} className={textareaClass} />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ekstra</h3>
        {([
          ['benefit_tags', 'Manfaat', 2],
          ['fun_fact', 'Fakta Menarik', 3],
          ['variations', 'Variasi', 3],
        ] as const).map(([key, label, rows]) => (
          <div key={key}>
            <label htmlFor={`field-${key}`} className={labelClass}>{label}</label>
            <textarea id={`field-${key}`} rows={rows} value={form[key]} onChange={(e) => set(key, e.target.value)} className={textareaClass} />
          </div>
        ))}
      </section>
    </div>
  )
}
