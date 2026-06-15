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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-800">Tambah Aktivitas</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <ActivityFormFields form={form} onChange={setForm} />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-700 font-semibold py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-2 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
