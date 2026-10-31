<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStrategySurveyReport } from '~/composables/CommerceSurvey/useStrategySurveyReport'

/**
 * نمای «گزارش‌دهی» – بازرسی داده‌های جمع‌آوری‌شده‌ی نظرسنجی راهبردی.
 * گزارش هنگام ورود به نما (فاز بازرسی) به‌صورت خودکار دریافت می‌شود و
 * دکمه‌ی «دریافت مجدد» برای به‌روزرسانی دستی در دسترس است.
 * خروجی خام سرویس در یک JSON Inspector تمیز و قابل کپی نمایش داده می‌شود.
 */

const { isReportLoading, reportError, reportData, fetchStrategySurveyReport } = useStrategySurveyReport()

/** دریافت خودکار گزارش هنگام ورود به نما (سمت کلاینت) */
onMounted(() => {
  if (reportData.value === null && !isReportLoading.value) {
    void fetchStrategySurveyReport()
  }
})

/** متن قالب‌بندی‌شده‌ی JSON برای نمایش و کپی */
const prettyJson = computed(() => (reportData.value === null ? '' : JSON.stringify(reportData.value, null, 2)))

/** آمار خلاصه برای سربرگ کارت (در صورت ساختار قابل شمارش) */
const stats = computed(() => {
  const d = reportData.value as Record<string, unknown> | null
  if (!d || typeof d !== 'object') return null
  const result = typeof d.result === 'string' ? d.result : null
  const count =
    Array.isArray(d.data)
      ? d.data.length
      : d.data && typeof d.data === 'object'
        ? Object.keys(d.data as Record<string, unknown>).length
        : null
  return { result, count }
})

/**
 * هایلایت سبک JSON: ابتدا escape و سپس span برای کلید/رشته/عدد/bool.
 * (escape قبل از افزودن تگ‌ها → بدون ریسک XSS)
 */
const highlightedJson = computed(() => {
  const raw = prettyJson.value
  if (!raw) return ''
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    match => {
      let cls = 'json-number'
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-string'
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (/null/.test(match)) {
        cls = 'json-null'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
})

/** وضعیت کپی برای بازخورد «کپی شد» */
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

async function copyJson() {
  const text = prettyJson.value
  if (!text) return
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // fallback برای contextهای بدون Clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* در صورت رد شدن دسترسی، بی‌صدا رد می‌شود */
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-4xl">
    <BaseCard class="mb-6 overflow-hidden !rounded-xl">
      <!-- سربرگ کارت گزارش -->
      <div class="px-6 sm:px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="w-12 h-12 rounded-lg bg-green-700 text-white flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </span>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">گزارش نظرسنجی راهبردی</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-6">
              بازرسی داده‌های جمع‌آوری‌شده از سرویس توزیع نظرسنجی
              <span v-if="stats?.result" class="inline-flex items-center gap-1 mx-1">
                <span
                  class="inline-block w-1.5 h-1.5 rounded-full"
                  :class="stats.result.toUpperCase() === 'OK' ? 'bg-green-600' : 'bg-red-500'"
                />
                <span class="font-mono text-[11px]" dir="ltr">{{ stats.result }}</span>
              </span>
              <span v-if="stats?.count !== null && stats?.count !== undefined" class="text-slate-400">
                ({{ stats.count }} مورد)
              </span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="reportData !== null"
            type="button"
            class="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isReportLoading"
            @click="copyJson"
          >
            <svg v-if="copied" viewBox="0 0 24 24" class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            {{ copied ? 'کپی شد' : 'کپی JSON' }}
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg bg-green-700 text-white text-xs font-bold transition-colors hover:bg-green-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isReportLoading"
            @click="fetchStrategySurveyReport()"
          >
            <svg
              v-if="isReportLoading"
              class="w-3.5 h-3.5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-dasharray="42 18" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
            {{ reportData === null ? 'دریافت گزارش' : 'دریافت مجدد' }}
          </button>
        </div>
      </div>

      <!-- بدنه: خطا / اسکلت / JSON Inspector -->
      <div class="p-6 sm:p-8">
        <!-- خطا -->
        <div
          v-if="reportError"
          class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-300"
          role="alert"
        >
          <span class="flex items-center gap-2">
            <Icon icon="lucide:cloud-alert" class="w-4 h-4 flex-shrink-0" />
            {{ reportError }}
          </span>
          <button
            type="button"
            class="rounded-md border border-red-300 dark:border-red-700 px-3 py-1.5 text-xs font-bold text-red-700 dark:text-red-200 transition-colors hover:bg-red-100 dark:hover:bg-red-900/40"
            @click="fetchStrategySurveyReport()"
          >
            تلاش مجدد
          </button>
        </div>

        <!-- اسکلت بارگذاری -->
        <div v-if="isReportLoading && reportData === null" class="space-y-3" aria-hidden="true">
          <div class="rounded-lg border border-slate-200 dark:border-slate-800 p-5">
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse w-1/4 mb-3" />
            <div class="h-3 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse w-2/3 mb-2" />
            <div class="h-3 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse w-1/2 mb-2" />
            <div class="h-3 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse w-3/5" />
          </div>
          <div class="rounded-lg border border-slate-200 dark:border-slate-800 p-5">
            <div class="h-3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse w-1/5 mb-3" />
            <div class="h-3 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse w-3/4 mb-2" />
            <div class="h-3 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse w-2/5" />
          </div>
        </div>

        <!-- بازرس JSON -->
        <div v-else-if="reportData !== null" class="relative">
          <div
            class="rounded-lg border border-slate-700 bg-slate-900 dark:border-slate-700 overflow-hidden"
            dir="ltr"
          >
            <div class="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800/70">
              <span class="font-mono text-[11px] text-slate-400">GetStrategySurveyReport → response</span>
              <span class="font-mono text-[10px] text-slate-500">JSON</span>
            </div>
            <pre
              class="json-pre max-h-[32rem] overflow-auto p-4 text-xs sm:text-[13px] leading-6 font-mono text-slate-200"
            ><code v-html="highlightedJson" /></pre>
          </div>
        </div>

        <!-- حالت خالی (بدون داده و بدون خطا) -->
        <div v-else-if="!reportError" class="py-10 text-center">
          <div class="mx-auto w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">گزارشی برای نمایش دریافت نشده است.</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
/* هایلایت JSON – پالت صنعتی/اسلیت روی زمینه‌ی تیره */
.json-pre :deep(.json-key) {
  color: #7dd3fc;
}
.json-pre :deep(.json-string) {
  color: #86efac;
}
.json-pre :deep(.json-number) {
  color: #fcd34d;
}
.json-pre :deep(.json-boolean) {
  color: #c4b5fd;
}
.json-pre :deep(.json-null) {
  color: #94a3b8;
  font-style: italic;
}
</style>
