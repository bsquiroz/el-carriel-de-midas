const updatedAtFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatUpdatedAt(iso: string): string {
  const parts = updatedAtFormatter.formatToParts(new Date(iso))
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? ''

  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`
}
