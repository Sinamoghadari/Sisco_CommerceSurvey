import { addDays, addHours, addMinutes, roundToNearestMinutes } from 'date-fns'
import type { CalendarCustomAttribute, CalendarEvent } from '../types'

interface UseCalendarEventsProps {
  fromDate: MaybeRefOrGetter<Date>
  toDate: MaybeRefOrGetter<Date>
}

function randomDate(start: Date, end: Date) {
  return roundToNearestMinutes(
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    ),
    { nearestTo: 15 },
  )
}

export function useCalendarEvents(props: UseCalendarEventsProps) {
  const calendarEvents = ref<CalendarCustomAttribute<CalendarEvent>[]>([])
  const pendingEvents = ref<Omit<CalendarEvent, 'startDate' | 'endDate'>[]>([])
  async function refresh() {
    // This is a fake data, in real life you would fetch it from an API
    pendingEvents.value = [
      {
        id: '1',
        duration: 15,
        title: 'برنامه‌ریزی اسپرینت',
        category: 'team',
        features: {
          conversation: true,
          record: true,
          drive: true,
        },
        participants: [],
      },
      {
        id: '2',
        duration: 45,
        title: 'جلسه هفتگی',
        category: 'internal',
        features: {
          record: true,
          conversation: true,
        },
        participants: [
          {
            photo: '/img/avatars/16.svg',
            name: 'هرمان مایر',
          },
          {
            photo: '/img/avatars/10.svg',
            name: 'کندرا ویلسون',
          },
        ],
      },
      {
        id: '3',
        duration: 90,
        title: 'بازخورد مشتری',
        category: 'customer',
        features: {
          record: true,
          external: true,
        },
        participants: [
          {
            photo: '/img/avatars/5.svg',
            name: 'کلاریسا میلر',
          },
          {
            photo: '/img/avatars/8.svg',
            name: 'ادی بریکس',
          },
          {
            photo: '/img/avatars/3.svg',
            name: 'کلارک اسمیت',
          },
        ],
      },
      {
        id: '4',
        duration: 30,
        title: 'برنامه‌نویسی جفتی',
        category: 'team',
        features: {
          conversation: true,
          drive: true,
        },
        participants: [],
      },
      {
        id: '5',
        duration: 60,
        title: 'بررسی کد',
        category: 'personal',
        features: {
          conversation: true,
        },
        participants: [],
      },
    ]

    for (let i = 0; i < 7; i++) {
      const date = addDays(toValue(props.fromDate), i)
      const events: CalendarCustomAttribute<CalendarEvent>[] = []
      const count = Math.floor(Math.random() * 3)
      for (let j = 0; j < count; j++) {
        const event
          = pendingEvents.value[
            Math.floor(Math.random() * pendingEvents.value.length)
          ]
        const startDate = randomDate(addHours(date, 8), addHours(date, 18))
        const endDate = addMinutes(startDate, event.duration)
        events.push({
          key: `${i}-${j}`,
          customData: {
            ...event,
            id: `${i}-${j}`,
            startDate,
            endDate: addMinutes(startDate, event.duration),
          },
          dates: [startDate, endDate],
        })
      }
      calendarEvents.value.push(...events)
    }
  }

  // refresh on fromDate and toDate change and on mounted
  watch([() => toValue(props.fromDate), () => toValue(props.toDate)], refresh, {
    immediate: true,
  })

  return {
    calendarEvents,
    pendingEvents,
    refresh,
  }
}
