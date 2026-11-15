<script setup lang="ts">
import {
  formatJalaliDate,
  type OrganizationRecord,
} from '~/composables/Sisco_WorkExperiences/useWorkExperiences'

defineProps<{
  organizations: OrganizationRecord[]
}>()

defineEmits<{
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <div>
    <!-- حالت خالی -->
    <div
      v-if="organizations.length === 0"
      class="px-4 py-12 text-center text-sm text-muted-400 dark:text-muted-500"
    >
      هنوز سابقه کاری ثبت نشده است. برای افزودن، از دکمه «افزودن سابقه کاری» استفاده کنید.
    </div>

    <!-- فهرست سازمان‌ها با سوابق کاری تودرتو -->
    <div v-else class="space-y-4 p-4 sm:p-5">
      <article
        v-for="organization in organizations"
        :key="organization.id"
        class="overflow-hidden rounded-xl border border-muted-200 dark:border-muted-800"
      >
        <header class="flex flex-col gap-2 border-b border-muted-200 bg-muted-50/60 px-4 py-3 dark:border-muted-800 dark:bg-muted-950/40 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div class="flex min-w-0 items-start gap-3">
            <span class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
            </span>

            <div class="min-w-0">
              <h3 class="truncate text-sm font-bold text-muted-800 dark:text-white sm:text-base">
                {{ organization.name }}
              </h3>
              <p
                v-if="organization.contact"
                class="mt-1 text-xs text-muted-500 dark:text-muted-400"
              >
                اطلاعات تماس سازمان: {{ organization.contact }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:flex-shrink-0">
            <span class="rounded-full bg-muted-100 px-2.5 py-1 text-xs font-bold text-muted-600 dark:bg-muted-800 dark:text-muted-300">
              {{ organization.experiences.length.toLocaleString('fa-IR') }} سابقه کاری
            </span>

            <button
              type="button"
              class="rounded-md px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 dark:hover:bg-red-500/10"
              :aria-label="`حذف سازمان ${organization.name}`"
              @click="$emit('remove', organization.id)"
            >
              حذف سازمان
            </button>
          </div>
        </header>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[760px] border-collapse text-right">
            <caption class="sr-only">
              سوابق کاری سازمان {{ organization.name }}
            </caption>
            <thead class="bg-muted-100/80 dark:bg-muted-950/70">
              <tr>
                <th scope="col" class="px-4 py-2.5 text-center text-xs font-black text-muted-600 dark:text-muted-300">
                  سمت
                </th>
                <th scope="col" class="px-4 py-2.5 text-center text-xs font-black text-muted-600 dark:text-muted-300">
                  از تاریخ
                </th>
                <th scope="col" class="px-4 py-2.5 text-center text-xs font-black text-muted-600 dark:text-muted-300">
                  تا تاریخ
                </th>
                <th scope="col" class="px-4 py-2.5 text-center text-xs font-black text-muted-600 dark:text-muted-300">
                  سابقه بیمه(روز)
                </th>
                <th scope="col" class="px-4 py-2.5 text-center text-xs font-black text-muted-600 dark:text-muted-300">
                  فایل بیمه
                </th>
                <th scope="col" class="px-4 py-2.5 text-center text-xs font-black text-muted-600 dark:text-muted-300">
                  توضیحات
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-muted-200 bg-white dark:divide-muted-800 dark:bg-muted-900">
              <tr
                v-for="experience in organization.experiences"
                :key="experience.id"
                class="hover:bg-muted-50/80 dark:hover:bg-muted-950/40"
              >
                <td class="px-4 py-2.5 text-center text-sm font-medium text-muted-800 dark:text-muted-100">
                  {{ experience.position }}
                </td>
                <td class="whitespace-nowrap px-4 py-2.5 text-center text-sm text-muted-800 dark:text-muted-100">
                  {{ formatJalaliDate(experience.fromDate) }}
                </td>
                <td class="whitespace-nowrap px-4 py-2.5 text-center text-sm text-muted-800 dark:text-muted-100">
                  {{ formatJalaliDate(experience.toDate) }}
                </td>
                <td class="whitespace-nowrap px-4 py-2.5 text-center text-sm text-muted-800 dark:text-muted-100">
                  {{ experience.insuranceDays.toLocaleString('fa-IR') }}
                </td>
                <td class="px-4 py-2.5 text-center text-xs text-muted-600 dark:text-muted-300">
                  <span
                    v-if="experience.insuranceFileName"
                    class="inline-flex max-w-[12rem] items-center gap-1.5"
                    :title="`${experience.insuranceFileName} (فایل انتخاب‌شده، بارگذاری‌نشده)`"
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
                    <span class="truncate">{{ experience.insuranceFileName }}</span>
                  </span>
                  <span v-else class="text-muted-400 dark:text-muted-500">—</span>
                </td>
                <td class="max-w-[15rem] px-4 py-2.5 text-center text-xs leading-5 text-muted-600 dark:text-muted-300">
                  <span v-if="experience.description" class="line-clamp-2" :title="experience.description">
                    {{ experience.description }}
                  </span>
                  <span v-else class="text-muted-400 dark:text-muted-500">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </div>
</template>
