import type { EventCategory, EventCategoryTheme } from './types'

export const categoryTheme: Record<EventCategory, EventCategoryTheme> = {
  none: {
    name: 'بدون دسته‌بندی',
    color: 'bg-muted-400 dark:bg-muted-600',
    outline: 'outline-muted-500/30',
  },
  customer: {
    name: 'مشتریان',
    color: 'bg-lime-500',
    outline: 'outline-lime-500/30',
  },
  internal: {
    name: 'داخلی',
    color: 'bg-sky-500',
    outline: 'outline-sky-500/30',
  },
  team: {
    name: 'تیم',
    color: 'bg-purple-500',
    outline: 'outline-purple-500/30',
  },
  personal: {
    name: 'شخصی',
    color: 'bg-rose-500',
    outline: 'outline-rose-500/30',
  },
}
