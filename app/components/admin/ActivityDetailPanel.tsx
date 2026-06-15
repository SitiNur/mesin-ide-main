'use client'

import { useEffect, useState } from 'react'
import type { Activity } from '../../types/activity'
import type { ActivityPayload } from '../../lib/admin-activities'
import { emptyActivityPayload } from '../../lib/admin-activities'
import ActivityFormFields from './ActivityFormFields'

type ActivityDetailPanelProps = {
  open: boolean
  activity: Activity | null
  loading: boolean
  onClose: () => void
  onSubmit: (payload: ActivityPayload) => Promise<{ ok: boolean; message?: string }>
  onDelete: (activity: Activity) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function activityToPayload(activity: Activity): ActivityPayload {
  const { id: _id, created_at: _created, ...payload } = activity
  return payload
}

export default function ActivityDetailPanel({
  open,
  activity,
  loading,
  onClose,
  onSubmit,
  onDelete,
}: ActivityDetailPanelProps) {
  const [form, setForm] = useState<ActivityPayload>(emptyActivityPayload)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!activity) return
    setForm(activityToPayload(activity))
    setError(null)
  }, [activity])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

    setSaving(true)
    const result = await onSubmit({
      ...form,
      title: form.title.trim(),
      short_desc: form.short_desc.trim(),
      category: form.category.trim(),
    })
    setSaving(false)

    if (!result.ok) {
      setError(result.message ?? 'Terjadi kesalahan.')
      return
    }

    onClose()
  }

  const handleDelete = () => {
    if (activity) onDelete(activity)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-800">Detail Aktivitas</h2>
          <p className="text-xs text-slate-500 mt-0.5">Semua kolom dari database — edit lalu simpan</p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-slate-500">Memuat detail...</div>
        ) : activity ? (
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">ID</p>
                <p className="text-sm font-mono text-slate-800">{activity.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Dibuat</p>
                <p className="text-sm text-slate-800">{formatDate(activity.created_at)}</p>
              </div>
            </section>

            <ActivityFormFields form={form} onChange={setForm} />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleDelete}
                className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Hapus
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={onClose}
                className="border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  )
}
