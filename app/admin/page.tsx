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
  updateActivityStatus,
  type ActivityPayload,
} from '../lib/admin-activities'
import { getFilterCategoryOptions } from '../lib/activity-categories'
import { getNextActivityId, hasNextActivity } from '../lib/admin-navigation'
import { filterActivities } from '../lib/filter-activities'
import { paginateItems, type PageSize } from '../lib/paginate'
import {
  sortActivities,
  toggleSort,
  type ActivitySort,
  type ActivitySortField,
} from '../lib/sort-activities'
import StatsCards from '../components/admin/StatsCards'
import ActivityFilters from '../components/admin/ActivityFilters'
import ActivityTableControls from '../components/admin/ActivityTableControls'
import ActivityTable from '../components/admin/ActivityTable'
import ActivityForm from '../components/admin/ActivityForm'
import ActivityDetailPanel, {
  type SaveAction,
} from '../components/admin/ActivityDetailPanel'

export default function AdminDashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [pageItems, setPageItems] = useState<Activity[]>([])
  const [filters, setFilters] = useState(emptyAdminFilters)
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [approvingId, setApprovingId] = useState<number | null>(null)
  const [sort, setSort] = useState<ActivitySort | null>(null)
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
    return result
  }, [showToast])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  const filteredActivities = useMemo(
    () => filterActivities(activities, filters),
    [activities, filters]
  )

  const sortedActivities = useMemo(() => {
    if (!sort) return filteredActivities
    return sortActivities(filteredActivities, sort)
  }, [filteredActivities, sort])

  const paginatedResult = useMemo(
    () => paginateItems(sortedActivities, currentPage, pageSize),
    [sortedActivities, currentPage, pageSize]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, pageSize, sort])

  useEffect(() => {
    if (paginatedResult.currentPage !== currentPage) {
      setCurrentPage(paginatedResult.currentPage)
    }
  }, [paginatedResult.currentPage, currentPage])

  const categoryOptions = useMemo(
    () => getFilterCategoryOptions(activities.map((a) => a.category)),
    [activities]
  )

  const hasNext = selectedActivity
    ? hasNextActivity(pageItems, selectedActivity.id)
    : false

  const openActivityById = async (id: number) => {
    setDetailLoading(true)
    setSelectedActivity(null)

    const result = await getActivityById(id)
    setDetailLoading(false)

    if (!result.ok) {
      showToast(result.message)
      return false
    }

    setSelectedActivity(result.data)
    return true
  }

  const handleOpenCreate = () => {
    setFormOpen(true)
  }

  const handleEdit = async (activity: Activity) => {
    setPageItems(paginatedResult.items)
    setDetailOpen(true)
    await openActivityById(activity.id)
  }

  const handleSort = (field: ActivitySortField) => {
    setSort((current) => toggleSort(current, field))
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedActivity(null)
    setDetailLoading(false)
    setPageItems([])
  }

  const handleCreateSubmit = async (payload: ActivityPayload) => {
    const result = await createActivity(payload)
    if (!result.ok) return { ok: false, message: result.message }
    showToast('Aktivitas berhasil ditambahkan.')
    await loadActivities()
    return { ok: true }
  }

  const handleSaveDetail = async (payload: ActivityPayload, action: SaveAction) => {
    if (!selectedActivity) return { ok: false, message: 'Aktivitas tidak ditemukan.' }

    const isNext = action === 'next'
    const nextId = isNext ? getNextActivityId(pageItems, selectedActivity.id) : null

    const result = await updateActivity(selectedActivity.id, payload)
    if (!result.ok) return { ok: false, message: result.message }

    showToast('Aktivitas berhasil diperbarui.')
    await loadActivities()

    if (action === 'close' || nextId === null) {
      handleCloseDetail()
      return { ok: true }
    }

    await openActivityById(nextId)
    return { ok: true }
  }

  const handleApprove = async (activity: Activity) => {
    setApprovingId(activity.id)
    const result = await updateActivityStatus(activity.id, 'published')
    setApprovingId(null)

    if (!result.ok) {
      showToast(result.message ?? 'Gagal mempublikasikan.')
      return
    }

    showToast('Aktivitas dipublikasikan.')
    await loadActivities()

    if (selectedActivity?.id === activity.id) {
      setSelectedActivity(result.data)
    }
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
      <StatsCards
        activities={activities}
        onFilterStatus={(status) => setFilters({ ...filters, status })}
      />

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
              ({sortedActivities.length} dari {activities.length})
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
            sort={sort}
            approvingId={approvingId}
            onSort={handleSort}
            onEdit={handleEdit}
            onApprove={handleApprove}
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
        hasNext={hasNext}
        onClose={handleCloseDetail}
        onSave={handleSaveDetail}
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
