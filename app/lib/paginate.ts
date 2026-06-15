export type PageSize = 10 | 25 | 50 | 'all'

export type PaginateResult<T> = {
  items: T[]
  totalPages: number
  totalItems: number
  startIndex: number
  currentPage: number
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: PageSize
): PaginateResult<T> {
  if (pageSize === 'all') {
    return {
      items,
      totalPages: 1,
      totalItems: items.length,
      startIndex: 0,
      currentPage: 1,
    }
  }

  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (safePage - 1) * pageSize

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    totalPages,
    totalItems,
    startIndex,
    currentPage: safePage,
  }
}
