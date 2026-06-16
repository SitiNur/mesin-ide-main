'use client'

import { useEffect, useState } from 'react'
import type { ActivityPayload } from '../../lib/admin-activities'
import { emptyActivityPayload } from '../../lib/admin-activities'
import ActivityFormFields from './ActivityFormFields'

type ActivityFormProps = {
  open: boolean
  onClose: () => void
  onSubmit: (payload: ActivityPayload) => Promise<{ ok: boolean; message?: string }>
}

export default function ActivityForm({ open, onClose, onSubmit }: ActivityFormProps) {
  const [form, setForm] = useState<ActivityPayload>(emptyActivityPayload)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(emptyActivityPayload)
    setError(null)
  }, [open])

  if (!open) return null

  const handleSubmit = async () => {
    setError(null)

    if (!form.title.trim()) {
      setError('Nama aktivitas wajib diisi.')
      return
    }

    if (!form.short_desc.trim()) {
      setError('Deskripsi singkat wajib diisi.')
      return
    }

    if (!form.category.trim()) {
      setError('Kategori wajib diisi.')
      return
    }

    if (!form.duration) {
      setError('Durasi wajib dipilih.')
      return
    }

    setLoading(true)
    const result = await onSubmit({
      ...form,
      title: form.title.trim(),
      short_desc: form.short_desc.trim(),
      category: form.category.trim(),
    })
    setLoading(false)

    if (!result.ok) {
      setError(result.message ?? 'Terjadi kesalahan.')
      return
    }

    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 z-50 w-full max-w-xl lg:max-w-2xl bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-drawer-title"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4 shrink-0">
          <div>
            <h2 id="create-drawer-title" className="text-lg font-bold text-slate-800">
              Tambah Aktivitas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aktivitas baru akan berstatus Perlu Review
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none px-1"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ActivityFormFields form={form} onChange={setForm} />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4">
              {error}
            </p>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-200 px-6 py-4 bg-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-60 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Tambah Aktivitas'}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
