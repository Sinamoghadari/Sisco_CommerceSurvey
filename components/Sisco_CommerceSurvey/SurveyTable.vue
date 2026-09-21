<script setup lang="ts">
import { typeLabel, type CustomerGroup, type CustomerType, type SurveyLinkTable } from '~/composables/CommerceSurvey/useSurveyDefinition'

/**
 * جدول‌های مدیریت لینک نظرسنجی – یک جدول برای «شمش» و یک جدول برای «گندله».
 * ستون «عملیات» هر جدول، اکشن «لینک شمش» یا «لینک گندله» را برای شروع
 * مستقیم پرسشنامه‌ی همان محصول ارائه می‌کند (بدون فراخوانی هیچ API).
 *
 * استایل جدول‌ها مطابق الگوی صفحات RD (pages/RD/Management) است.
 */
defineProps<{
  tables: SurveyLinkTable[]
}>()

const emit = defineEmits<{
  (e: 'open', payload: { group: CustomerGroup; type: CustomerType }): void
}>()

function rowCounter(tableIndex: number, rowIndex: number) {
  return tableIndex * 100 + rowIndex + 1
}
</script>

<template>
  <div class="space-y-6">
    <BaseCard
      v-for="(table, ti) in tables"
      :key="table.id"
      class="overflow-hidden"
    >
      <!-- سربرگ جدول -->
      <div class="px-6 py-5 border-b border-muted-200 dark:border-muted-800 flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 flex items-center justify-center flex-shrink-0 border border-primary-100 dark:border-primary-800">
          <img :src="table.icon" :alt="table.productLabel" class="w-7 h-7 table-product-icon" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-bold text-dark-600 dark:text-white flex items-center gap-2">
            جدول نظرسنجی محصول: {{ table.productLabel }}
          </h3>
          <p class="text-xs text-muted-500 dark:text-muted-400 mt-0.5 leading-5">
            {{ table.description }}
          </p>
        </div>
        <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
          <Icon icon="lucide:circle-check" class="w-3.5 h-3.5" />
          لینک فعال
        </span>
      </div>

      <!-- جدول -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 w-16 text-center">ردیف</th>
              <th scope="col" class="px-6 py-3">عنوان نظرسنجی</th>
              <th scope="col" class="px-6 py-3">نوع مشتری</th>
              <th scope="col" class="px-6 py-3">توضیحات</th>
              <th scope="col" class="px-6 py-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, ri) in table.rows"
              :key="row.id"
              class="border-b dark:border-gray-700 bg-white dark:bg-slate-900 hover:bg-muted-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <td class="px-6 py-4 text-center text-xs text-muted-400" dir="ltr">{{ rowCounter(ti, ri) }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ row.title }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                  <Icon :icon="row.type === 'export' ? 'lucide:globe' : 'lucide:map-pin'" class="w-3.5 h-3.5" />
                  {{ typeLabel(row.type) }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs text-muted-500 dark:text-muted-400 leading-6">{{ row.description }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 transition-all hover:-translate-y-px active:translate-y-0"
                    :aria-label="`${table.actionLabel} – ${typeLabel(row.type)}`"
                    @click="emit('open', { group: table.id, type: row.type })"
                  >
                    <Icon :icon="table.actionIcon" class="w-3.5 h-3.5" />
                    {{ table.actionLabel }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="table.rows.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">موردی برای نمایش یافت نشد.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
/* رنگ‌آمیزی آیکون‌های SVG خطی محصول با رنگ برند */
.table-product-icon {
  stroke: currentColor;
  filter: invert(36%) sepia(80%) saturate(1600%) hue-rotate(200deg) brightness(95%) contrast(95%);
}
.dark .table-product-icon {
  filter: invert(70%) sepia(40%) saturate(900%) hue-rotate(190deg) brightness(105%);
}
</style>
