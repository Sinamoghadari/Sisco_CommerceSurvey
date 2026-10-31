<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import fa from 'apexcharts/dist/locales/fa.json'
import { useStrategySurveyReport } from '~/composables/CommerceSurvey/useStrategySurveyReport'
import type { SurveyCategoryGroup } from '~/composables/CommerceSurvey/useSurveyApi'
import {
  buildCategoryList,
  buildQuestionMeta,
  buildRatingTrend,
  buildRespondentScores,
  buildWeightedTrend,
  extractReports,
  formatFaDateTime,
  sortReportsChronologically,
  UNMAPPED_CATEGORY
} from '~/composables/CommerceSurvey/useSurveyReportDashboard'

/**
 * داشبورد «گزارش‌دهی» بر اساس پاسخ واقعی POST /GetStrategySurveyReport:
 *  ۱. روند رضایت کلی عملکرد (area) – امتیاز سؤال‌های rating در طول زمان
 *  ۲. روند رضایت (area) – امتیاز وزنی Σ(number × strategy_node_weight) هر گزارش
 *  ۳. نمره‌ی سؤال‌ها به تفکیک دسته (bar) – پاسخ‌دهنده‌ی انتخابی + فیلتر دسته‌ها
 * نمودارها با AddonApexcharts (کتابخانه‌ی موجود پروژه – ApexCharts) رسم می‌شوند
 * و هیچ کتابخانه یا مقدار هاردکد‌شده‌ی جدیدی استفاده نشده است.
 */

const props = defineProps<{
  /** متادیتای تأییدشده‌ی پرسشنامه از Access API (نگاشت question_id → دسته) */
  groups: SurveyCategoryGroup[] | null
}>()

const { isReportLoading, reportError, reportData, fetchStrategySurveyReport } = useStrategySurveyReport()

/** دریافت گزارش هنگام ورود به نما (سمت کلاینت) */
onMounted(() => {
  if (reportData.value === null && !isReportLoading.value) {
    void fetchStrategySurveyReport()
  }
})

/* ----------------------------- داده‌ی پایه ----------------------------- */

const reports = computed(() => extractReports(reportData.value))
const sortedReports = computed(() => sortReportsChronologically(reports.value))
const meta = computed(() => buildQuestionMeta(props.groups))

/** گزینه‌های پاسخ‌دهنده (قدیمی → جدید؛ کلید پایدار: response_id) */
const respondentOptions = computed(() =>
  sortedReports.value.map(r => ({
    id: String(r.response_id ?? ''),
    label: `${formatFaDateTime(r.submitted_at ?? '')}${r.response_id ? ` — ${String(r.response_id).slice(-6)}` : ''}`
  }))
)

/** پاسخ‌دهنده‌ی انتخابی – پیش‌فرض: جدیدترین گزارش */
const selectedResponseId = ref<string>('')
watch(
  respondentOptions,
  opts => {
    if (!opts.length) {
      selectedResponseId.value = ''
      return
    }
    if (!opts.some(o => o.id === selectedResponseId.value)) {
      selectedResponseId.value = opts[opts.length - 1]!.id
    }
  },
  { immediate: true }
)

const selectedReport = computed(
  () => sortedReports.value.find(r => String(r.response_id ?? '') === selectedResponseId.value) ?? null
)

/* --------------------------- فیلتر دسته‌ها --------------------------- */

const categoryList = computed(() => buildCategoryList(meta.value, reports.value))
/** null = همه‌ی دسته‌ها */
const selectedCategories = ref<string[] | null>(null)

function toggleCategory(category: string) {
  const current = selectedCategories.value ?? []
  const next = current.includes(category)
    ? current.filter(c => c !== category)
    : [...current, category]
  selectedCategories.value = next.length ? next : null
}
function selectAllCategories() {
  selectedCategories.value = null
}

/* ------------------------------ نمودارها ------------------------------ */

const { success: successColor, warning: warningColor, primary: primaryColor } = useTailwindColors()

/** نمودار ۱ – روند رضایت کلی عملکرد (rating در طول زمان) */
const ratingTrend = computed(() => buildRatingTrend(reports.value, meta.value))
const ratingTrendConfig = computed(() => ({
  type: 'area',
  height: 260,
  series: ratingTrend.value.series.map(s => ({ name: s.name, data: s.data.map(p => p.y) })),
  options: {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      fontSize: 13,
      fontWeight: 600,
      zoom: { enabled: false },
      toolbar: { show: false },
      defaultLocale: 'fa',
      locales: [fa]
    },
    colors: [successColor.value],
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 600 },
      formatter: (v: number) => `${v}`
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 5, hover: { size: 7 } },
    grid: { row: { colors: ['transparent', 'transparent'], opacity: 0.5 } },
    xaxis: {
      categories: ratingTrend.value.series[0]?.data.map(p => p.x) ?? [],
      labels: { rotate: -35, maxHeight: 70, style: { fontSize: '13px', fontWeight: 600 } }
    },
    yaxis: {
      opposite: true,
      min: ratingTrend.value.range?.min ?? undefined,
      max: ratingTrend.value.range?.max ?? undefined,
      forceNiceScale: true,
      labels: {
        style: { fontSize: '13px', fontWeight: 600 },
        formatter: (val: number) => Number(val).toLocaleString('fa-IR', { maximumFractionDigits: 0 })
      }
    },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '13px', fontWeight: 600 },
    tooltip: {
      y: {
        formatter: (val: number) =>
          ratingTrend.value.range
            ? `امتیاز: ${val} (مقیاس ${ratingTrend.value.range.min} تا ${ratingTrend.value.range.max})`
            : `امتیاز: ${val}`
      }
    }
  }
}))

/** نمودار ۲ – روند رضایت وزنی (یک مقدار به‌ازای هر گزارش) */
const weightedTrend = computed(() => buildWeightedTrend(reports.value))
const weightedTrendConfig = computed(() => ({
  type: 'area',
  height: 260,
  series: [
    {
      name: 'امتیاز وزنی',
      data: weightedTrend.value.series[0]?.data.map(p => p.y) ?? []
    }
  ],
  options: {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      fontSize: 13,
      fontWeight: 600,
      zoom: { enabled: false },
      toolbar: { show: false },
      defaultLocale: 'fa',
      locales: [fa]
    },
    colors: [warningColor.value],
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 600 },
      // حداکثر دو رقم اعشار بدون صفرهای انتهایی (مثلاً 8.29 به‌جای 8.290000)
      formatter: (v: number) => Number(v.toFixed(2))
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 5, hover: { size: 7 } },
    grid: { row: { colors: ['transparent', 'transparent'], opacity: 0.5 } },
    xaxis: {
      categories: weightedTrend.value.series[0]?.data.map(p => p.x) ?? [],
      labels: { rotate: -35, maxHeight: 70, style: { fontSize: '13px', fontWeight: 600 } }
    },
    yaxis: {
      opposite: true,
      forceNiceScale: true,
      labels: {
        style: { fontSize: '13px', fontWeight: 600 },
        // اعداد صحیح تمیز بدون اعشار زائد (مثلاً 10 به‌جای 10.000000)
        formatter: (val: number) => Number(val).toLocaleString('fa-IR', { maximumFractionDigits: 0 })
      }
    },
    tooltip: {
      y: { formatter: (val: number) => `امتیاز وزنی محاسبه‌شده: ${Number(val.toFixed(2))}` }
    }
  }
}))

/** نمودار ۳ – نمره‌ی سؤال‌ها برای پاسخ‌دهنده‌ی انتخابی (با فیلتر دسته) */
const respondentScores = computed(() =>
  buildRespondentScores(selectedReport.value, meta.value, selectedCategories.value)
)
const respondentChartConfig = computed(() => ({
  type: 'bar',
  height: 380,
  series: [{ name: 'نمره', data: respondentScores.value.values }],
  options: {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      fontSize: 13,
      fontWeight: 600,
      toolbar: { show: false },
      defaultLocale: 'fa',
      locales: [fa]
    },
    colors: [primaryColor.value],
    legend: { show: false },
    plotOptions: {
      bar: { horizontal: false, endingShape: 'rounded', columnWidth: '55%' }
    },
    dataLabels: { enabled: true, style: { fontSize: '13px', fontWeight: 600 } },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    grid: { padding: { bottom: 10 } },
    xaxis: {
      categories: respondentScores.value.displayLabels,
      labels: {
        rotate: -45,
        maxHeight: 170,
        trim: false,
        hideOverlappingLabels: false,
        style: { fontSize: '13px', fontWeight: 600 }
      },
      tooltip: { enabled: false }
    },
    yaxis: {
      opposite: true,
      forceNiceScale: true,
      labels: {
        style: { fontSize: '13px', fontWeight: 600 },
        formatter: (val: number) => Number(val).toLocaleString('fa-IR', { maximumFractionDigits: 0 })
      }
    },
    tooltip: {
      custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
        const t = respondentScores.value.tooltips[dataPointIndex]
        if (!t) return ''
        const range = t.range ? ` — مقیاس ${t.range}` : ''
        return `<div class="apexcharts-tooltip-title">${t.text}</div>` +
          `<div class="apexcharts-tooltip-series-group" style="display:block">` +
          `<span class="apexcharts-tooltip-text">نمره: ${t.value}${range}</span></div>` +
          `<div class="apexcharts-tooltip-series-group" style="display:block">` +
          `<span class="apexcharts-tooltip-text">دسته: ${t.category}</span></div>`
      }
    }
  }
}))

/* ------------------------------ بازخورد UI ---------------------------- */

const summaryLine = computed(() => {
  const n = sortedReports.value.length
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const faNum = (v: number | string) => String(v).replace(/\d/g, d => faDigits[+d])
  if (!n) return ''
  const first = sortedReports.value[0]?.submitted_at
  const last = sortedReports.value[n - 1]?.submitted_at
  const span =
    first && last && first !== last
      ? ` — از ${formatFaDateTime(first)} تا ${formatFaDateTime(last)}`
      : ` — ${formatFaDateTime(last ?? '')}`
  return `${faNum(n)} پاسخ ثبت‌شده${span}`
})

/** خلاصه‌ی وضعیت داده برای پیام‌های خالی */
const hasAnyPoint = computed(
  () => ratingTrend.value.pointCount > 0 || weightedTrend.value.pointCount > 0
)

/** تلاش مجدد فقط از بنر خطا (دریافت اولیه خودکار است) */
function retry() {
  void fetchStrategySurveyReport()
}
</script>

<template>
  <div class="mx-auto w-full max-w-5xl">
    <BaseCard class="mb-6 overflow-hidden !rounded-xl">
      <!-- سربرگ کارت گزارش -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/60 px-6 py-6 sm:px-8 dark:border-slate-800 dark:bg-slate-900/40">
        <div class="flex items-center gap-4">
          <span class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-700 text-white">
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </span>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">گزارش نظرسنجی راهبردی</h2>
            <p class="mt-0.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ summaryLine }}</p>
          </div>
        </div>

      </div>

      <!-- بدنه -->
      <div class="p-6 sm:p-8">
        <!-- خطا (msg_description سرور عیناً) -->
        <div
          v-if="reportError"
          class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          role="alert"
        >
          <span class="flex items-center gap-2">
            <Icon icon="lucide:cloud-alert" class="h-4 w-4 flex-shrink-0" />
            {{ reportError }}
          </span>
          <button
            type="button"
            class="rounded-md border border-red-300 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-900/40"
            @click="retry"
          >
            تلاش مجدد
          </button>
        </div>

        <!-- اسکلت بارگذاری -->
        <div v-if="isReportLoading && reports.length === 0" class="space-y-4" aria-hidden="true">
          <div v-for="n in 3" :key="n" class="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
            <div class="mb-4 h-4 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div class="h-40 animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>

        <!-- خالی -->
        <div v-else-if="!isReportLoading && !reportError && reports.length === 0" class="py-10 text-center">
          <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">هنوز پاسخی برای این نظرسنجی ثبت نشده است.</p>
        </div>

        <!-- داشبورد -->
        <template v-else>
          <!-- دو نمودار روند، کنار هم در نمایشگرهای بزرگ -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- نمودار ۱: روند رضایت کلی عملکرد -->
          <section>
            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">روند رضایت کلی عملکرد</h3>
              <span class="text-[11px] text-slate-400">
                امتیاز سؤال‌های «rating» در هر پاسخ‌نامه، برحسب زمان ثبت
                <template v-if="ratingTrend.range"> — مقیاس {{ ratingTrend.range.min }} تا {{ ratingTrend.range.max }}</template>
              </span>
            </div>
            <div v-if="ratingTrend.pointCount" class="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <AddonApexcharts v-bind="ratingTrendConfig" class="ltr:-ms-4 rtl:-me-4" />
            </div>
            <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
              هیچ پاسخ عددی از نوع rating در گزارش‌ها یافت نشد.
            </p>
          </section>

          <!-- نمودار ۲: روند رضایت (وزنی) -->
          <section>
            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">روند رضایت</h3>
              <span class="text-[11px] text-slate-400">
                Σ امتیاز × وزن گره استراتژیک، به‌ازای هر پاسخ‌نامه
                <template v-if="weightedTrend.skippedReports"> — ({{ weightedTrend.skippedReports }} پاسخ‌نامه بدون پاسخ وزنی معتبر)</template>
              </span>
            </div>
            <div v-if="weightedTrend.pointCount" class="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <AddonApexcharts v-bind="weightedTrendConfig" class="ltr:-ms-4 rtl:-me-4" />
            </div>
            <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
              هیچ پاسخ وزنی معتبر (strategy_range_rating با وزن گره) در گزارش‌ها یافت نشد.
            </p>
          </section>

          </div>

          <!-- نمودار ۳: نمره‌ی سؤال‌ها به تفکیک دسته -->
          <section class="mt-6">
            <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">نمره‌ی سؤال‌ها به تفکیک دسته</h3>

              <!-- انتخاب پاسخ‌دهنده -->
              <label class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                پاسخ‌دهنده:
                <select
                  v-model="selectedResponseId"
                  class="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-green-600/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option v-for="opt in respondentOptions" :key="opt.id" :value="opt.id">
                    {{ opt.label }}
                  </option>
                </select>
              </label>
            </div>

            <!-- کنترل دسته‌ها -->
            <div class="mb-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="rounded-full border px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25"
                :class="(selectedCategories === null)
                  ? 'border-green-700 bg-green-700 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
                @click="selectAllCategories"
              >
                همه
              </button>
              <button
                v-for="cat in categoryList"
                :key="cat"
                type="button"
                class="rounded-full border px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25"
                :class="(selectedCategories ?? []).includes(cat)
                  ? 'border-green-700 bg-green-700 text-white'
                  : cat === UNMAPPED_CATEGORY
                    ? 'border-dashed border-slate-300 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
                @click="toggleCategory(cat)"
              >
                {{ cat }}
              </button>
            </div>

            <div v-if="respondentScores.values.length" class="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <AddonApexcharts v-bind="respondentChartConfig" />
            </div>
            <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
              برای این پاسخ‌دهنده در دسته‌های انتخاب‌شده، پاسخ عددی وجود ندارد.
            </p>
          </section>
        </template>
      </div>
    </BaseCard>
  </div>
</template>
