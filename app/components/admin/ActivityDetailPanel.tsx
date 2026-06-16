'use client'

import { useEffect, useState } from 'react'
import type { Activity } from '../../types/activity'
import type { ActivityPayload } from '../../lib/admin-activities'
import { emptyActivityPayload } from '../../lib/admin-activities'
import ActivityFormFields from './ActivityFormFields'
import { getStatusBadgeClass, getStatusLabel } from '../../lib/activity-options'

export type SaveAction = 'close' | 'next'

type ActivityDetailPanelProps = {
  open: boolean
  activity: Activity | null
  loading: boolean
  hasNext: boolean
  onClose: () => void
  onSave: (payload: ActivityPayload, action: SaveAction) => Promise<{ ok: boolean; message?: string }>
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
  hasNext,
  onClose,
  onSave,
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

  const isUnpublished = activity?.status !== 'published'

  const validateAndBuildPayload = (): ActivityPayload | null => {
    if (!form.title.trim()) {
      setError('Nama aktivitas wajib diisi.')
      return null
    }
    if (!form.short_desc.trim()) {
      setError('Deskripsi singkat wajib diisi.')
      return null
    }
    if (!form.category.trim()) {
      setError('Kategori wajib diisi.')
      return null
    }
    if (!form.duration) {
      setError('Durasi wajib dipilih.')
      return null
    }
    return {
      ...form,
      title: form.title.trim(),
      short_desc: form.short_desc.trim(),
      category: form.category.trim(),
    }
  }

  const handleSave = async (action: SaveAction) => {
    setError(null)
    const payload = validateAndBuildPayload()
    if (!payload) return

    setSaving(true)
    const result = await onSave(payload, action)
    setSaving(false)

    if (!result.ok) {
      setError(result.message ?? 'Terjadi kesalahan.')
    }
  }

  const handleSaveAndNext = () => {
    handleSave(hasNext ? 'next' : 'close')
  }

  const handleDelete = () => {
    if (activity) onDelete(activity)
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
        aria-labelledby="edit-drawer-title"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4 shrink-0">
          <div>
            <h2 id="edit-drawer-title" className="text-lg font-bold text-slate-800">
              Edit Aktivitas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activity ? activity.title : 'Memuat...'}
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

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Memuat detail...
          </div>
        ) : activity ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <section className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">ID</p>
                  <p className="text-sm font-mono text-slate-800">{activity.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Dibuat</p>
                  <p className="text-sm text-slate-800">{formatDate(activity.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(activity.status)}`}>
                    {getStatusLabel(activity.status)}
                  </span>
                </div>
              </section>

              <ActivityFormFields form={form} onChange={setForm} />

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4">
                  {error}
                </p>
              )}
            </div>

            <div className="shrink-0 border-t border-slate-200 px-6 py-4 bg-white">
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-60 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Hapus
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-60 transition-colors"
                >
                  Tutup
                </button>
                {isUnpublished ? (
                  <button
                    type="button"
                    onClick={handleSaveAndNext}
                    disabled={saving}
                    className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {saving ? 'Menyimpan...' : hasNext ? 'Simpan & Berikutnya' : 'Simpan & Tutup'}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSave('close')}
                      disabled={saving}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan & Tutup'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave('next')}
                      disabled={saving || !hasNext}
                      title={hasNext ? undefined : 'Record terakhir di halaman ini'}
                      className="bg-slate-800 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan & Berikutnya'}
                    </button>
                  </>
                )}
              </div>
              {isUnpublished && !hasNext && (
                <p className="text-xs text-slate-400 mt-2 text-right">
                  Record terakhir di halaman ini
                </p>
              )}
              {!isUnpublished && !hasNext && (
                <p className="text-xs text-slate-400 mt-2 text-right">
                  Record terakhir di halaman ini
                </p>
              )}
            </div>
          </>
        ) : null}
      </aside>
    </>
  )
}
