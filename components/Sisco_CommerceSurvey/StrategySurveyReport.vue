<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDark } from '@vueuse/core'
import fa from 'apexcharts/dist/locales/fa.json'
import { useStrategySurveyReport } from '~/composables/CommerceSurvey/useStrategySurveyReport'
import type { SurveyCategoryGroup } from '~/composables/CommerceSurvey/useSurveyApi'
import {
  buildCategoryList,
  buildQuestionMeta,
  buildRatingTrend,
  buildReportSummary,
  buildRespondentScores,
  buildSatisfactionDistribution,
  buildWeightedTrend,
  dateOptions,
  extractReports,
  filterReports,
  formatFaDateTime,
  formatJalaliDate,
  formatPercentValue,
  providerOptions,
  satisfactionPercent,
  sortReportsChronologically,
  UNMAPPED_CATEGORY
} from '~/composables/CommerceSurvey/useSurveyReportDashboard'

/**
 * داشبورد «گزارش‌دهی» بر اساس پاسخ واقعی POST /GetStrategySurveyReport:
 *  - فیلتر «نام مشتری» + فیلتر «تاریخ شمسی» (ترکیبی) روی نمودارهای روند
 *    و تفکیک دسته اعمال می‌شود.
 *  - کارت ۱: دو نمودار روند کنار هم در یک کارت واحد
 *  - کارت ۲: نمره‌ی سؤال‌ها به تفکیک دسته
 *  - کارت ۳: «توزیع رضایت مشتریان» – نمودار دایره‌ای روی همه‌ی داده‌ها،
 *    مستقل از فیلترها
 * «روند رضایت» با همان تبدیل مشترک satisfactionPercent به درصد نمایش داده
 * می‌شود (۸٫۱۸ → ۰٫۸۱٪) و نمودار دایره‌ای نیز از همین تبدیل استفاده می‌کند.
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

/* ------------------------ فیلتر مشتری و تاریخ ------------------------ */

/** «نام مشتری» – رشته‌ی خالی = همه */
const providerFilter = ref('')
/** «تاریخ شمسی» – مقدار فیلتر میلادی (YYYY-MM-DD)؛ رشته‌ی خالی = همه */
const dateFilter = ref('')

const providerFilterOptions = computed(() => providerOptions(reports.value))
const dateFilterOptions = computed(() => dateOptions(reports.value))

/** گزارش‌های فیلترشده (ترکیب دو فیلتر) – مبنای نمودارهای روند و تفکیک */
const filteredReports = computed(() =>
  filterReports(reports.value, { provider: providerFilter.value, date: dateFilter.value })
)

const sortedReports = computed(() => sortReportsChronologically(filteredReports.value))
const meta = computed(() => buildQuestionMeta(props.groups))

/** نمودار تفکیک دسته همیشه جدیدترین گزارشِ مجموعه‌ی فیلترشده را نشان می‌دهد */
const selectedReport = computed(() => sortedReports.value[sortedReports.value.length - 1] ?? null)

/* --------------------------- فیلتر دسته‌ها --------------------------- */

const categoryList = computed(() => buildCategoryList(meta.value, filteredReports.value))
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

/** رنگ خطوط محور: حداکثر وضوح (slate-700 در روشن، slate-300 در تیره) */
const axisColor = computed(() => (isDark.value ? '#cbd5e1' : '#334155'))
/** رنگ برچسب تیک‌ها: حداکثر کنتراست (slate-900 در روشن، slate-50 در تیره) */
const tickColor = computed(() => (isDark.value ? '#f8fafc' : '#0f172a'))
/** رنگ خطوط شبکه: slate-400 در روشن، slate-600 در تیره (کاملاً قابل مشاهده) */
const gridColor = computed(() => (isDark.value ? '#475569' : '#94a3b8'))

const faIntFormatter = (val: number) => Number(val).toLocaleString('fa-IR', { maximumFractionDigits: 0 })
/** تیک‌های محور درصدی (با علامت ٪، حداکثر دو رقم اعشار) */
const faPercentFormatter = (val: number) => formatPercentValue(val)

/** قطعات مشترک محورها – برچسب‌ها همیشه بولد و پرکنتراست */
function sharedAxes(xCategories: string[], xRotate: number, xMaxHeight: number, yAxisFormatter = faIntFormatter) {
  return {
    xaxis: {
      categories: xCategories,
      axisBorder: { show: true, color: axisColor.value, height: 2 },
      axisTicks: { show: true, color: axisColor.value, height: 6 },
      labels: {
        rotate: xRotate,
        maxHeight: xMaxHeight,
        style: { colors: tickColor.value, fontSize: '13px', fontWeight: 700 }
      }
    },
    yaxis: {
      opposite: true,
      forceNiceScale: true,
      axisBorder: { show: true, color: axisColor.value, width: 2 },
      axisTicks: { show: true, color: axisColor.value, width: 6 },
      labels: {
        style: { colors: tickColor.value, fontSize: '13px', fontWeight: 700 },
        formatter: yAxisFormatter
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

/** ظاهر مشترک برچسب‌های داده (سفید بولد روی پس‌زمینه‌ی تیره‌ی برچسب) */
const boldWhiteDataLabels = {
  enabled: true,
  style: { fontSize: '13px', fontWeight: 700, colors: ['#ffffff'] }
}

/* ------------------------------ نمودارها ------------------------------ */

/** نمودار ۱ – روند رضایت کلی عملکرد (rating در طول زمان) – تابع فیلترها */
const ratingTrend = computed(() => buildRatingTrend(filteredReports.value, meta.value))
const ratingTrendConfig = computed(() => ({
  type: 'area',
  height: 260,
  series: ratingTrend.value.series.map(s => ({ name: s.name, data: s.data.map(p => p.y) })),
  options: {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      fontSize: 13,
      fontWeight: 700,
      zoom: { enabled: false },
      toolbar: { show: false },
      defaultLocale: 'fa',
      locales: [fa]
    },
    colors: [successColor.value],
    dataLabels: {
      ...boldWhiteDataLabels,
      formatter: (v: number) => `${v}`
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 5, hover: { size: 7 } },
    ...sharedAxes(ratingTrend.value.series[0]?.data.map(p => p.x) ?? [], -35, 70),
    yaxis: {
      opposite: true,
      min: ratingTrend.value.range?.min ?? undefined,
      max: ratingTrend.value.range?.max ?? undefined,
      forceNiceScale: true,
      axisBorder: { show: true, color: axisColor.value, width: 2 },
      axisTicks: { show: true, color: axisColor.value, width: 6 },
      labels: {
        style: { colors: tickColor.value, fontSize: '13px', fontWeight: 700 },
        formatter: faIntFormatter
      }
    },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '13px', fontWeight: 700 },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
      // جابه‌جایی رو به بالا تا تولتیپ نقطه‌ی فعال و برچسب‌ها را نپوشاند
      offsetY: -25,
      y: {
        formatter: (val: number) =>
          ratingTrend.value.range
            ? `امتیاز: ${val} (مقیاس ${ratingTrend.value.range.min} تا ${ratingTrend.value.range.max})`
            : `امتیاز: ${val}`
      }
    }
  }
}))

/** نمودار ۲ – روند رضایت وزنی به‌صورت درصد (تبدیل مشترک: ۸٫۱۸ → ۰٫۸۱٪) */
const weightedTrend = computed(() => buildWeightedTrend(filteredReports.value))
const weightedPercentPoints = computed(() =>
  (weightedTrend.value.series[0]?.data ?? []).map(p => ({ x: p.x, y: satisfactionPercent(p.y) }))
)
const weightedTrendConfig = computed(() => ({
  type: 'area',
  height: 260,
  series: [
    {
      name: 'درصد رضایت',
      data: weightedPercentPoints.value.map(p => p.y)
    }
  ],
  options: {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      fontSize: 13,
      fontWeight: 700,
      zoom: { enabled: false },
      toolbar: { show: false },
      defaultLocale: 'fa',
      locales: [fa]
    },
    colors: [warningColor.value],
    dataLabels: {
      ...boldWhiteDataLabels,
      formatter: (v: number) => formatPercentValue(v)
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 5, hover: { size: 7 } },
    ...sharedAxes(
      weightedPercentPoints.value.map(p => p.x),
      -35,
      70,
      faPercentFormatter
    ),
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
      offsetY: -25,
      y: { formatter: (val: number) => `درصد رضایت: ${formatPercentValue(val)}` }
    }
  }
}))

/** نمودار ۳ – نمره‌ی سؤال‌ها برای پاسخ‌دهنده‌ی انتخابی (با فیلتر دسته) */
const respondentScores = computed(() =>
  buildRespondentScores(selectedReport.value, meta.value, selectedCategories.value)
)
const respondentChartConfig = computed(() => ({
  type: 'bar',
  height: 420,
  series: [{ name: 'نمره', data: respondentScores.value.values }],
  options: {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      fontSize: 13,
      fontWeight: 700,
      toolbar: { show: false },
      defaultLocale: 'fa',
      locales: [fa]
    },
    colors: [primaryColor.value],
    legend: { show: false },
    plotOptions: {
      bar: { horizontal: false, endingShape: 'rounded', columnWidth: '55%' }
    },
    dataLabels: boldWhiteDataLabels,
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      // متن کامل سؤال‌ها (بدون بریدگی با …) – خوانایی کامل بر زیبایی‌شناسی فاصله مقدم است
      categories: respondentScores.value.labels,
      axisBorder: { show: true, color: axisColor.value, height: 2 },
      axisTicks: { show: true, color: axisColor.value, height: 6 },
      labels: {
        rotate: -45,
        maxHeight: 220,
        trim: false,
        hideOverlappingLabels: false,
        style: { colors: tickColor.value, fontSize: '11px', fontWeight: 700 }
      },
      tooltip: { enabled: false }
    },
    yaxis: {
      opposite: true,
      forceNiceScale: true,
      axisBorder: { show: true, color: axisColor.value, width: 2 },
      axisTicks: { show: true, color: axisColor.value, width: 6 },
      labels: {
        style: { colors: tickColor.value, fontSize: '13px', fontWeight: 700 },
        formatter: faIntFormatter
      }
    },
    grid: {
      borderColor: gridColor.value,
      strokeDashArray: 0,
      padding: { bottom: 20 },
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

/** نمودار دایره‌ای «توزیع رضایت مشتریان» – روی همه‌ی گزارش‌ها، مستقل از فیلترها */
const distribution = computed(() => buildSatisfactionDistribution(reports.value))
const distributionConfig = computed(() => ({
  type: 'pie',
  height: 320,
  series: distribution.value.values,
  options: {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      fontSize: 13,
      fontWeight: 700,
      toolbar: { show: false },
      defaultLocale: 'fa',
      locales: [fa]
    },
    labels: distribution.value.labels,
    colors: distribution.value.colors,
    legend: {
      position: 'bottom',
      fontSize: '13px',
      fontWeight: 700,
      labels: { colors: [tickColor.value] }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 700, colors: ['#ffffff'] },
      formatter: (v: number) => `${v}`
    },
    stroke: { width: 2 },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
      y: { formatter: (val: number) => `${val} مشتری` }
    }
  }
}))

/* ------------------------------ بازخورد UI ---------------------------- */

/**
 * خلاصه‌ی سراسری و غیرتعاملی: همیشه از کل گزارش‌های فیلترنشده محاسبه
 * می‌شود و با تغییر فیلترها تغییر نمی‌کند.
 * قالب: {تعداد} پاسخ ثبت شده - از {قدیمی‌ترین} تا {جدیدترین}
 */
const summaryLine = computed(() => {
  const summary = buildReportSummary(reports.value)
  if (!summary.count) return ''
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const faNum = (v: number | string) => String(v).replace(/\d/g, d => faDigits[+d])
  if (!summary.earliest || !summary.latest) {
    return `${faNum(summary.count)} پاسخ ثبت شده`
  }
  return `${faNum(summary.count)} پاسخ ثبت شده - از ${formatFaDateTime(summary.earliest)} تا ${formatFaDateTime(summary.latest)}`
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

    <template v-else>
      <!-- ======== ردیف بالایی: کارت توزیع (راست) + کارت روندها با فیلترها (چپ) ======== -->
      <div class="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <!-- کارت توزیع رضایت مشتریان: بالا-راست، مستقل از فیلترها -->
        <BaseCard class="overflow-hidden !rounded-xl">
          <div class="p-4 sm:p-6">
            <h3 class="mb-3 text-sm font-bold text-slate-900 dark:text-white">توزیع رضایت مشتریان</h3>
            <div v-if="distribution.customerCount" class="rounded-md bg-slate-50/60 p-2 dark:bg-slate-900/40">
              <AddonApexcharts v-bind="distributionConfig" />
            </div>
            <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
              هیچ پاسخ وزنی معتبری برای محاسبه‌ی توزیع رضایت وجود ندارد.
            </p>
          </div>
        </BaseCard>

        <!-- کارت نمودارهای روند (سمت چپ توزیع) + فیلترها (فقط روی نمودارهای فیلترپذیر اثر دارند) -->
        <BaseCard class="overflow-hidden !rounded-xl lg:col-span-2">
          <div class="p-4 sm:p-6">
            <!-- نوار فیلترها -->
            <div class="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
              <!-- فیلتر نام مشتری -->
              <label class="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                نام مشتری:
                <select
                  v-model="providerFilter"
                  class="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-green-600/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="">همه</option>
                  <option v-for="p in providerFilterOptions" :key="p" :value="p">{{ p }}</option>
                </select>
              </label>

              <!-- فیلتر تاریخ شمسی: نمایش جلالی، مقدار فیلتر میلادی (تطابق با submitted_at) -->
              <label class="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                تاریخ شمسی:
                <select
                  v-model="dateFilter"
                  class="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-green-600/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="">همه</option>
                  <option v-for="d in dateFilterOptions" :key="d" :value="d">{{ formatJalaliDate(d) }}</option>
                </select>
              </label>

              <!-- پاک‌کردن فیلترها -->
              <button
                v-if="providerFilter || dateFilter"
                type="button"
                class="mr-auto rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                @click="providerFilter = ''; dateFilter = ''"
              >
                حذف فیلترها
              </button>
            </div>

            <div class="grid grid-cols-1 items-stretch gap-6 2xl:grid-cols-2">
              <!-- نمودار ۱: روند رضایت کلی عملکرد -->
              <section class="flex flex-col rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <header class="mb-3">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">روند رضایت کلی عملکرد</h3>
                </header>
                <div class="mt-auto">
                  <div v-if="ratingTrend.pointCount" class="rounded-md bg-slate-50/60 p-2 dark:bg-slate-900/40">
                    <AddonApexcharts v-bind="ratingTrendConfig" class="ltr:-ms-4 rtl:-me-4" />
                  </div>
                  <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
                    هیچ پاسخ عددی از نوع rating در گزارش‌های فیلترشده یافت نشد.
                  </p>
                </div>
              </section>

              <!-- نمودار ۲: روند رضایت (درصد) -->
              <section class="flex flex-col rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <header class="mb-3">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">روند رضایت</h3>
                </header>
                <div class="mt-auto">
                  <div v-if="weightedTrend.pointCount" class="rounded-md bg-slate-50/60 p-2 dark:bg-slate-900/40">
                    <AddonApexcharts v-bind="weightedTrendConfig" class="ltr:-ms-4 rtl:-me-4" />
                  </div>
                  <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
                    هیچ پاسخ وزنی معتبر (strategy_range_rating با وزن گره) در گزارش‌های فیلترشده یافت نشد.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- ==================== کارت تفکیک دسته (بدون فیلتر پاسخ‌دهنده) ==================== -->
      <BaseCard class="mt-6 overflow-hidden !rounded-xl">
        <div class="p-4 sm:p-6">
          <h3 class="mb-4 text-sm font-bold text-slate-900 dark:text-white">نمره‌ی سؤال‌ها به تفکیک دسته</h3>

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
    </template>
  </div>
</template>
