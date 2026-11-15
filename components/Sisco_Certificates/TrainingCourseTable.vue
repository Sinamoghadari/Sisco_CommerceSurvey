<script setup lang="ts">
import {
  formatJalaliDate,
  type TrainingCourseRecord,
} from '~/composables/Sisco_Certificates/useTrainingCourses'

defineProps<{
  records: TrainingCourseRecord[]
}>()

defineEmits<{
  (e: 'remove', id: string): void
}>()

function modeBadgeClass(mode: TrainingCourseRecord['mode']): string {
  return mode === 'آنلاین'
    ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
    : 'bg-muted-100 text-muted-700 dark:bg-muted-800 dark:text-muted-200'
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[1100px] border-collapse text-right">
      <caption class="sr-only">
        لیست دوره‌های آموزشی ثبت‌شده در این صفحه
      </caption>
      <thead class="bg-muted-100/80 dark:bg-muted-950/70">
        <tr>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            عنوان دوره آموزشی
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            نام مرکز آموزشی
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            مدت زمان دوره(ساعت)
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            تاریخ شروع دوره
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            تاریخ پایان دوره
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            روش آموزشی
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            نمره یا نتیجه
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            فایل گواهینامه
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            توضیحات
          </th>
          <th scope="col" class="px-4 py-3 text-center text-xs font-black text-muted-600 dark:text-muted-300">
            عملیات
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-muted-200 bg-white dark:divide-muted-800 dark:bg-muted-900">
        <tr v-if="records.length === 0">
          <td colspan="10" class="px-4 py-12 text-center text-sm text-muted-400 dark:text-muted-500">
            هنوز دوره آموزشی ثبت نشده است. برای افزودن، از دکمه «افزودن دوره آموزشی» استفاده کنید.
          </td>
        </tr>

        <tr
          v-for="record in records"
          :key="record.id"
          class="hover:bg-muted-50/80 dark:hover:bg-muted-950/40"
        >
          <td class="px-4 py-3 text-center text-sm font-medium text-muted-800 dark:text-muted-100">
            {{ record.title }}
          </td>
          <td class="px-4 py-3 text-center text-sm text-muted-800 dark:text-muted-100">
            {{ record.center }}
          </td>
          <td class="whitespace-nowrap px-4 py-3 text-center text-sm text-muted-800 dark:text-muted-100">
            {{ record.durationHours.toLocaleString('fa-IR') }}
          </td>
          <td class="whitespace-nowrap px-4 py-3 text-center text-sm text-muted-800 dark:text-muted-100">
            {{ formatJalaliDate(record.startDate) }}
          </td>
          <td class="whitespace-nowrap px-4 py-3 text-center text-sm text-muted-800 dark:text-muted-100">
            {{ formatJalaliDate(record.endDate) }}
          </td>
          <td class="whitespace-nowrap px-4 py-3 text-center">
            <span
              class="inline-flex rounded-full px-3 py-1 text-xs font-bold"
              :class="modeBadgeClass(record.mode)"
            >
              {{ record.mode }}
            </span>
          </td>
          <td class="whitespace-nowrap px-4 py-3 text-center text-sm text-muted-800 dark:text-muted-100">
            <span v-if="record.score">{{ record.score }}</span>
            <span v-else class="text-muted-400 dark:text-muted-500">—</span>
          </td>
          <td class="px-4 py-3 text-center text-xs text-muted-600 dark:text-muted-300">
            <span
              v-if="record.certificateName"
              class="inline-flex max-w-[13rem] items-center gap-1.5"
              :title="`${record.certificateName} (فایل انتخاب‌شده، بارگذاری‌نشده)`"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-3.5 w-3.5 flex-shrink-0"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              <span class="truncate">{{ record.certificateName }}</span>
            </span>
            <span v-else class="text-muted-400 dark:text-muted-500">—</span>
          </td>
          <td class="max-w-[16rem] px-4 py-3 text-center text-xs leading-5 text-muted-600 dark:text-muted-300">
            <span v-if="record.description" class="line-clamp-2" :title="record.description">
              {{ record.description }}
            </span>
            <span v-else class="text-muted-400 dark:text-muted-500">—</span>
          </td>
          <td class="whitespace-nowrap px-4 py-3 text-center">
            <button
              type="button"
              class="rounded-md px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 dark:hover:bg-red-500/10"
              :aria-label="`حذف دوره ${record.title}`"
              @click="$emit('remove', record.id)"
            >
              حذف
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
