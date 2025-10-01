export function formatDate(dateString: string) {
  const d = new Date(dateString)

  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  }).format(d)

  return formatted
}
