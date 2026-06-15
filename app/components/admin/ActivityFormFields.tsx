'use client'

import type { ActivityPayload } from '../../lib/admin-activities'

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
const textareaClass = `${inputClass} resize-y`
const labelClass = 'block text-sm font-semibold text-slate-700 mb-1'

type ActivityFormFieldsProps = {
  form: ActivityPayload
  onChange: (form: ActivityPayload) => void
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
          <input id="field-status" type="text" value={form.status} onChange={(e) => set('status', e.target.value)} className={inputClass} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Waktu & Tempat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-duration" className={labelClass}>Durasi</label>
            <input id="field-duration" type="text" value={form.duration} onChange={(e) => set('duration', e.target.value)} className={inputClass} placeholder="15–20 menit" />
          </div>
          <div>
            <label htmlFor="field-best-time" className={labelClass}>Waktu Terbaik</label>
            <input id="field-best-time" type="text" value={form.best_time} onChange={(e) => set('best_time', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="field-location" className={labelClass}>Lokasi</label>
            <input id="field-location" type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="field-prep-level" className={labelClass}>Tingkat Persiapan</label>
            <input id="field-prep-level" type="text" value={form.prep_level} onChange={(e) => set('prep_level', e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Usia</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="field-min-age" className={labelClass}>Usia Min.</label>
            <input id="field-min-age" type="number" min={1} required value={form.min_age} onChange={(e) => set('min_age', Number.parseInt(e.target.value, 10) || 1)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="field-max-age" className={labelClass}>Usia Maks.</label>
            <input id="field-max-age" type="number" min={1} required value={form.max_age} onChange={(e) => set('max_age', Number.parseInt(e.target.value, 10) || 1)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="field-ideal-age" className={labelClass}>Usia Ideal</label>
            <input id="field-ideal-age" type="text" value={form.ideal_age} onChange={(e) => set('ideal_age', e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Alat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-needs-tools" className={labelClass}>Perlu Alat</label>
            <select id="field-needs-tools" value={form.needs_tools ? 'true' : 'false'} onChange={(e) => set('needs_tools', e.target.value === 'true')} className={`${inputClass} bg-white`}>
              <option value="false">Tanpa alat</option>
              <option value="true">Perlu alat/bahan</option>
            </select>
          </div>
          <div>
            <label htmlFor="field-tools-list" className={labelClass}>Daftar Alat</label>
            <textarea id="field-tools-list" rows={2} value={form.tools_list} onChange={(e) => set('tools_list', e.target.value)} className={textareaClass} />
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
          ['suitable_mood', 'Mood Cocok', 2],
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
