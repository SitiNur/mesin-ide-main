export function getFilterCategoryOptions(existingCategories: string[]): string[] {
  const unique = new Set(existingCategories.filter(Boolean))
  return Array.from(unique).sort((a, b) => a.localeCompare(b, 'id'))
}
