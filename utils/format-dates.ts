const DateFormats = {
  Short: { year: 'numeric', month: 'short', day: 'numeric' }, // 'MMM do, yyyy'
  Long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }, // 'cccc, LLLL do, yyyy h:mm aa'
}

export type DateFormatsNames = keyof typeof DateFormats

// Helper function to add ordinal suffix to a day
function getOrdinalSuffix(day: number) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const value = day % 100
  return day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
}

export function formatDate(date?: any, pattern: DateFormatsNames = 'Short', locale: string = 'en-US') {
  if (!date) return ''

  const validDate = typeof date === 'string' ? new Date(date) : date
  if (isNaN(validDate.getTime())) return '' // Invalid date check

  const formatter = new Intl.DateTimeFormat(locale, DateFormats[pattern])
  const formattedDate = formatter.format(validDate)

  // Handle the 'do' (ordinal day) manually since Intl.DateTimeFormat doesn't support it
  const day = validDate.getDate()
  return formattedDate.replace(day.toString(), getOrdinalSuffix(day))
}
