export const mergePositionSuggestions = (
  current: readonly string[],
  incoming: readonly string[],
): string[] => {
  const merged = new Set([...current, ...incoming].filter(Boolean))
  return [...merged].sort((a, b) => a.localeCompare(b, 'pl'))
}
