export function getNextActivityId(
  pageItems: { id: number }[],
  currentId: number
): number | null {
  const currentIndex = pageItems.findIndex((item) => item.id === currentId)
  if (currentIndex === -1) return null
  return pageItems[currentIndex + 1]?.id ?? null
}

export function hasNextActivity(
  pageItems: { id: number }[],
  currentId: number
): boolean {
  return getNextActivityId(pageItems, currentId) !== null
}
