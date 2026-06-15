'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Activity } from '../types/activity'
import { emptyAdminFilters } from '../types/activity'
import {
  createActivity,
  deleteActivity,
  getActivityById,
  listActivities,
  updateActivity,
  type ActivityPayload,
} from '../lib/admin-activities'
import { getFilterCategoryOptions } from '../lib/activity-categories'
import { filterActivities } from '../lib/filter-activities'
import { paginateItems, type PageSize } from '../lib/paginate'
import StatsCards from '../components/admin/StatsCards'
import ActivityFilters from '../components/admin/ActivityFilters'
import ActivityTableControls from '../components/admin/ActivityTableControls'
import ActivityTable from '../components/admin/ActivityTable'
import ActivityForm from '../components/admin/ActivityForm'
import ActivityDetailPanel from '../components/admin/ActivityDetailPanel'

export default function AdminDashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [filters, setFilters] = useState(emptyAdminFilters)
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const loadActivities = useCallback(async () => {
    setLoading(true)
    const result = await listActivities()
    if (result.ok) {
      setActivities(result.data)
    } else {
      showToast(result.message)
    }
    setLoading(false)
  }, [showToast])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  const filteredActivities = useMemo(
    () => filterActivities(activities, filters),
    [activities, filters]
  )

  const paginatedResult = useMemo(
    () => paginateItems(filteredActivities, currentPage, pageSize),
    [filteredActivities, currentPage, pageSize]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, pageSize])

  useEffect(() => {
    if (paginatedResult.currentPage !== currentPage) {
      setCurrentPage(paginatedResult.currentPage)
    }
  }, [paginatedResult.currentPage, currentPage])

  const categoryOptions = useMemo(
    () => getFilterCategoryOptions(activities.map((a) => a.category)),
    [activities]
  )

  const handleOpenCreate = () => {
    setFormOpen(true)
  }

  const handleViewDetail = async (activity: Activity) => {
    setDetailOpen(true)
    setDetailLoading(true)
    setSelectedActivity(null)

    const result = await getActivityById(activity.id)
    setDetailLoading(false)

    if (!result.ok) {
      showToast(result.message)
      setDetailOpen(false)
      return
    }

    setSelectedActivity(result.data)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedActivity(null)
    setDetailLoading(false)
  }

  const handleCreateSubmit = async (payload: ActivityPayload) => {
    const result = await createActivity(payload)
    if (!result.ok) return { ok: false, message: result.message }
    showToast('Aktivitas berhasil ditambahkan.')
    await loadActivities()
    return { ok: true }
  }

  const handleDetailSubmit = async (payload: ActivityPayload) => {
    if (!selectedActivity) return { ok: false, message: 'Aktivitas tidak ditemukan.' }

    const result = await updateActivity(selectedActivity.id, payload)
    if (!result.ok) return { ok: false, message: result.message }
    showToast('Aktivitas berhasil diperbarui.')
    await loadActivities()
    return { ok: true }
  }

  const handleDelete = async (activity: Activity) => {
    const confirmed = window.confirm(
      `Hapus aktivitas "${activity.title}"? Tindakan ini tidak bisa dibatalkan.`
    )
    if (!confirmed) return

    const result = await deleteActivity(activity.id)
    if (!result.ok) {
      showToast(result.message)
      return
    }

    if (selectedActivity?.id === activity.id) {
      handleCloseDetail()
    }

    showToast('Aktivitas berhasil dihapus.')
    await loadActivities()
  }

  return (
    <>
      <StatsCards activities={filteredActivities} />

      <ActivityFilters
        filters={filters}
        categoryOptions={categoryOptions}
        onChange={setFilters}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          Daftar Aktivitas
          {!loading && (
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({filteredActivities.length} dari {activities.length})
            </span>
          )}
        </h2>
        <button
          onClick={handleOpenCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + Tambah Aktivitas
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">Memuat data...</p>
        </div>
      ) : (
        <>
          <ActivityTableControls
            pageSize={pageSize}
            currentPage={paginatedResult.currentPage}
            totalPages={paginatedResult.totalPages}
            totalItems={paginatedResult.totalItems}
            startIndex={paginatedResult.startIndex}
            pageItemCount={paginatedResult.items.length}
            onPageSizeChange={setPageSize}
            onPageChange={setCurrentPage}
          />
          <ActivityTable
            activities={paginatedResult.items}
            startIndex={paginatedResult.startIndex}
            onViewDetail={handleViewDetail}
            onDelete={handleDelete}
          />
        </>
      )}

      <ActivityForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <ActivityDetailPanel
        open={detailOpen}
        activity={selectedActivity}
        loading={detailLoading}
        onClose={handleCloseDetail}
        onSubmit={handleDetailSubmit}
        onDelete={handleDelete}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  )
}
