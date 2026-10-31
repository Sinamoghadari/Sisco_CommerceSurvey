<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDark } from '@vueuse/core'
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
 *  - کارت ۱: دو نمودار روند کنار هم در یک کارت واحد (grid lg:grid-cols-2)
 *  - کارت ۲: نمره‌ی سؤال‌ها به تفکیک دسته در کارت مستقل زیر کارت روند
 * نمودارها با AddonApexcharts (کتابخانه‌ی موجود پروژه – ApexCharts) رسم
 * می‌شوند؛ محورها/خطوط شبکه با کنتراست بالا و سازگار با حالت تیره.
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

/* ------------------- ظاهر محورها (روشن/تیره، کنتراست بالا) ------------------- */

const isDark = useDark()
const { success: successColor, warning: warningColor, primary: primaryColor } = useTailwindColors()

/** رنگ محورها: خاکستری اسلیت خوانا در هر دو حالت */
const AXIS_COLOR = '#64748b'
/** رنگ برچسب تیک‌ها: پرکنتراست بر اساس حالت روشن/تیره */
const tickColor = computed(() => (isDark.value ? '#cbd5e1' : '#334155'))
/** رنگ خطوط شبکه: slate-300 در روشن، slate-700 در تیره */
const gridColor = computed(() => (isDark.value ? '#334155' : '#cbd5e1'))

const faIntFormatter = (val: number) => Number(val).toLocaleString('fa-IR', { maximumFractionDigits: 0 })

/** قطعات مشترک محورها برای هر سه نمودار (کنتراست یکنواخت) */
function sharedAxes(xCategories: string[], xRotate: number, xMaxHeight: number) {
  return {
    xaxis: {
      categories: xCategories,
      axisBorder: { show: true, color: AXIS_COLOR, height: 1.5 },
      axisTicks: { show: true, color: AXIS_COLOR },
      labels: {
        rotate: xRotate,
        maxHeight: xMaxHeight,
        style: { colors: tickColor.value, fontSize: '13px', fontWeight: 600 }
      }
    },
    yaxis: {
      opposite: true,
      forceNiceScale: true,
      axisBorder: { show: true, color: AXIS_COLOR, width: 1.5 },
      axisTicks: { show: true, color: AXIS_COLOR },
      labels: {
        style: { colors: tickColor.value, fontSize: '13px', fontWeight: 600 },
        formatter: faIntFormatter
      }
    },
    grid: {
      borderColor: gridColor.value,
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    tooltip: { theme: isDark.value ? 'dark' : 'light' }
  }
}

/* ------------------------------ نمودارها ------------------------------ */

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
      style: { fontSize: '13px', fontWeight: 600, colors: [tickColor.value] },
      formatter: (v: number) => `${v}`
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 5, hover: { size: 7 } },
    ...sharedAxes(
      ratingTrend.value.series[0]?.data.map(p => p.x) ?? [],
      -35,
      70
    ),
    yaxis: {
      opposite: true,
      min: ratingTrend.value.range?.min ?? undefined,
      max: ratingTrend.value.range?.max ?? undefined,
      forceNiceScale: true,
      axisBorder: { show: true, color: AXIS_COLOR, width: 1.5 },
      axisTicks: { show: true, color: AXIS_COLOR },
      labels: {
        style: { colors: tickColor.value, fontSize: '13px', fontWeight: 600 },
        formatter: faIntFormatter
      }
    },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '13px', fontWeight: 600 },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
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
      style: { fontSize: '13px', fontWeight: 600, colors: [tickColor.value] },
      // حداکثر دو رقم اعشار بدون صفرهای انتهایی (مثلاً 8.29 به‌جای 8.290000)
      formatter: (v: number) => Number(v.toFixed(2))
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 5, hover: { size: 7 } },
    ...sharedAxes(
      weightedTrend.value.series[0]?.data.map(p => p.x) ?? [],
      -35,
      70
    ),
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
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
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 600, colors: [tickColor.value] }
    },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    ...sharedAxes(
      respondentScores.value.displayLabels,
      -45,
      170
    ),
    xaxis: {
      categories: respondentScores.value.displayLabels,
      axisBorder: { show: true, color: AXIS_COLOR, height: 1.5 },
      axisTicks: { show: true, color: AXIS_COLOR },
      labels: {
        rotate: -45,
        maxHeight: 170,
        trim: false,
        hideOverlappingLabels: false,
        style: { colors: tickColor.value, fontSize: '13px', fontWeight: 600 }
      },
      tooltip: { enabled: false }
    },
    grid: {
      borderColor: gridColor.value,
      strokeDashArray: 0,
      padding: { bottom: 10 },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
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

/** تلاش مجدد فقط از بنر خطا (دریافت اولیه خودکار است) */
function retry() {
  void fetchStrategySurveyReport()
}
</script>

<template>
  <div class="mx-auto w-full max-w-5xl">
    <!-- سربرگ گزارش (بیرون از کارت‌ها) -->
    <div class="mb-5 flex flex-wrap items-center gap-4 px-1">
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
        <p class="mt-0.5 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">{{ summaryLine }}</p>
      </div>
    </div>

    <!-- خطا (msg_description سرور عیناً) -->
    <BaseCard v-if="reportError" class="mb-6 overflow-hidden !rounded-xl">
      <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-8">
        <span class="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
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
    </BaseCard>

    <!-- اسکلت بارگذاری -->
    <BaseCard v-if="isReportLoading && reports.length === 0" class="mb-6 overflow-hidden !rounded-xl">
      <div class="space-y-4 p-6 sm:p-8" aria-hidden="true">
        <div v-for="n in 3" :key="n" class="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
          <div class="mb-4 h-4 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div class="h-40 animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
    </BaseCard>

    <!-- خالی -->
    <BaseCard v-else-if="!isReportLoading && reports.length === 0" class="mb-6 overflow-hidden !rounded-xl">
      <div class="py-10 text-center">
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
    </BaseCard>

    <!-- ==================== کارت ۱: نمودارهای روند ==================== -->
    <BaseCard v-else class="mb-6 overflow-hidden !rounded-xl">
      <div class="p-4 sm:p-6">
        <div class="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <!-- نمودار ۱: روند رضایت کلی عملکرد -->
          <section class="flex flex-col rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <header class="mb-3">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">روند رضایت کلی عملکرد</h3>
              <!-- زیرنویس با ارتفاع حداقلی ثابت برای تراز افقی دو نمودار -->
              <p class="mt-1 min-h-[2.5rem] text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">
                امتیاز سؤال‌های «rating» در هر پاسخ‌نامه، برحسب زمان ثبت
                <template v-if="ratingTrend.range"> — مقیاس {{ ratingTrend.range.min }} تا {{ ratingTrend.range.max }}</template>
              </p>
            </header>
            <div class="mt-auto">
              <div v-if="ratingTrend.pointCount" class="rounded-md bg-slate-50/60 p-2 dark:bg-slate-900/40">
                <AddonApexcharts v-bind="ratingTrendConfig" class="ltr:-ms-4 rtl:-me-4" />
              </div>
              <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
                هیچ پاسخ عددی از نوع rating در گزارش‌ها یافت نشد.
              </p>
            </div>
          </section>

          <!-- نمودار ۲: روند رضایت (وزنی) -->
          <section class="flex flex-col rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <header class="mb-3">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">روند رضایت</h3>
              <p class="mt-1 min-h-[2.5rem] text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">
                Σ امتیاز × وزن گره استراتژیک، به‌ازای هر پاسخ‌نامه
                <template v-if="weightedTrend.skippedReports"> — ({{ weightedTrend.skippedReports }} پاسخ‌نامه بدون پاسخ وزنی معتبر)</template>
              </p>
            </header>
            <div class="mt-auto">
              <div v-if="weightedTrend.pointCount" class="rounded-md bg-slate-50/60 p-2 dark:bg-slate-900/40">
                <AddonApexcharts v-bind="weightedTrendConfig" class="ltr:-ms-4 rtl:-me-4" />
              </div>
              <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
                هیچ پاسخ وزنی معتبر (strategy_range_rating با وزن گره) در گزارش‌ها یافت نشد.
              </p>
            </div>
          </section>
        </div>
      </div>
    </BaseCard>

    <!-- ==================== کارت ۲: تفکیک دسته ==================== -->
    <BaseCard v-if="reports.length" class="overflow-hidden !rounded-xl">
      <div class="p-4 sm:p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">نمره‌ی سؤال‌ها به تفکیک دسته</h3>

          <!-- انتخاب پاسخ‌دهنده -->
          <label class="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
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

        <div v-if="respondentScores.values.length" class="rounded-md bg-slate-50/60 p-2 dark:bg-slate-900/40">
          <AddonApexcharts v-bind="respondentChartConfig" />
        </div>
        <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
          برای این پاسخ‌دهنده در دسته‌های انتخاب‌شده، پاسخ عددی وجود ندارد.
        </p>
      </div>
    </BaseCard>
  </div>
</template>
