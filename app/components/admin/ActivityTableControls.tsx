import type { PageSize } from '../../lib/paginate'

type ActivityTableControlsProps = {
  pageSize: PageSize
  currentPage: number
  totalPages: number
  totalItems: number
  startIndex: number
  pageItemCount: number
  onPageSizeChange: (size: PageSize) => void
  onPageChange: (page: number) => void
}

export default function ActivityTableControls({
  pageSize,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  pageItemCount,
  onPageSizeChange,
  onPageChange,
}: ActivityTableControlsProps) {
  const rangeStart = totalItems === 0 ? 0 : startIndex + 1
  const rangeEnd = totalItems === 0 ? 0 : startIndex + pageItemCount

  const infoText =
    pageSize === 'all'
      ? `Menampilkan semua (${totalItems})`
      : `Menampilkan ${rangeStart}–${rangeEnd} dari ${totalItems}`

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="page-size" className="text-sm font-semibold text-slate-600 whitespace-nowrap">
          Tampilkan
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value as PageSize)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value="all">Semua</option>
        </select>
        <span className="text-sm text-slate-500">{infoText}</span>
      </div>

      {pageSize !== 'all' && totalItems > 0 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="border border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-slate-600 whitespace-nowrap px-2">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="border border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  )
}
