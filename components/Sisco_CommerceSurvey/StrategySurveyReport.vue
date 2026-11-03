<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useDark } from '@vueuse/core'
import fa from 'apexcharts/dist/locales/fa.json'
import { useStrategySurveyReport } from '~/composables/CommerceSurvey/useStrategySurveyReport'
import type { SurveyCategoryGroup } from '~/composables/CommerceSurvey/useSurveyApi'
import {
  buildCategoryAverages,
  buildCategoryList,
  buildQuestionMeta,
  buildRatingTrend,
  buildRatingTrendMultiCustomer,
  buildReportSummary,
  buildRespondentScores,
  buildSatisfactionDistribution,
  buildWeightedTrend,
  buildWeightedTrendMultiCustomer,
  categoryAverageTooltipHtml,
  categoryTooltipHtml,
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
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})

/* ----------------------------- داده‌ی پایه ----------------------------- */

const reports = computed(() => extractReports(reportData.value))

/* ------------------------ فیلتر مشتری و تاریخ ------------------------ */

/** «نام مشتری» – چندانتخابی؛ آرایه‌ی خالی = همه */
const selectedProviders = ref<string[]>([])
/** «تاریخ شمسی» – چندانتخابی (مقدار فیلتر میلادی YYYY-MM-DD)؛ آرایه‌ی خالی = همه */
const selectedDates = ref<string[]>([])

const providerFilterOptions = computed(() => providerOptions(reports.value))
const dateFilterOptions = computed(() => dateOptions(reports.value))

/** گزارش‌های فیلترشده (ترکیب دو فیلتر چندانتخابی) – مبنای نمودارهای روند و تفکیک */
const filteredReports = computed(() =>
  filterReports(reports.value, { providers: selectedProviders.value, dates: selectedDates.value })
)

/**
 * نمودارهای روند: با انتخاب «بیش از یک» مشتری، هر مشتری خط روند مستقل
 * خود را دارد (بدون ادغام یا میانگین) تا روند个体‌ها کنار هم مقایسه شود؛
 * انتخاب تکی یا «همه» همان رفتار قبلی (نقاط تکی در طول زمان) را دارد.
 */
const isMultiCustomer = computed(() => selectedProviders.value.length > 1)

/**
 * نمودار تفکیک دسته: میانگین حسابی across همه‌ی گزارش‌های منطبق – «همه»
 * (انتخاب خالی) نیز تجمیعی است؛ تنها حالت تک‌مشتری + تک‌تاریخ همان نمای
 * قبلیِ «جدیدترین پاسخ» می‌ماند.
 */
const isCategoryAggregate = computed(
  () => !(selectedProviders.value.length === 1 && selectedDates.value.length === 1)
)

/* ------------------- منوی بازشو چندانتخابی (باز/بسته) ------------------- */

const isProviderMenuOpen = ref(false)
const isDateMenuOpen = ref(false)
const providerMenuRoot = ref<HTMLElement | null>(null)
const dateMenuRoot = ref<HTMLElement | null>(null)

/** بستن منوها با کلیک بیرون از آن‌ها */
function onDocumentClick(e: MouseEvent) {
  const target = e.target as Node | null
  if (isProviderMenuOpen.value && providerMenuRoot.value && !providerMenuRoot.value.contains(target)) {
    isProviderMenuOpen.value = false
  }
  if (isDateMenuOpen.value && dateMenuRoot.value && !dateMenuRoot.value.contains(target)) {
    isDateMenuOpen.value = false
  }
}

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value]
}

function toggleProvider(p: string) {
  selectedProviders.value = toggleInList(selectedProviders.value, p)
}

function toggleDate(d: string) {
  selectedDates.value = toggleInList(selectedDates.value, d)
}

function selectAllProviders() {
  selectedProviders.value = []
}

function selectAllDates() {
  selectedDates.value = []
}

function clearTrendFilters() {
  selectedProviders.value = []
  selectedDates.value = []
  isProviderMenuOpen.value = false
  isDateMenuOpen.value = false
}

const FILTER_FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** خلاصه‌ی انتخاب برای دکمه‌ی فیلتر: همه / نام تکی / «n مورد» */
function filterSummary(list: string[]): string {
  if (list.length === 0) return 'همه'
  if (list.length === 1) return list[0]!
  return `${String(list.length).replace(/\d/g, d => FILTER_FA_DIGITS[+d])} مورد`
}

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

/** پالت چند-سری: یک رنگ متمایز برای خط روند هر مشتری */
const MULTI_SERIES_COLORS = [
  '#15803d',
  '#0e7490',
  '#b45309',
  '#7c3aed',
  '#be185d',
  '#4d7c0f',
  '#1d4ed8',
  '#b91c1c'
]

/* ------------------------------ نمودارها ------------------------------ */

/**
 * نمودار ۱ – روند رضایت کلی عملکرد – تابع فیلترها؛ با چند مشتری انتخابی،
 * هر مشتری سری مستقل خود را دارد (بدون ادغام در یک خط میانگین).
 */
const ratingTrend = computed(() =>
  isMultiCustomer.value
    ? buildRatingTrendMultiCustomer(filteredReports.value, meta.value)
    : buildRatingTrend(filteredReports.value, meta.value)
)
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
    // با چند سری (یک خط برای هر مشتری) پالت متمایز به‌جای رنگ واحد
    colors: ratingTrend.value.series.length > 1 ? MULTI_SERIES_COLORS : [successColor.value],
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

/**
 * نمودار ۲ – روند رضایت (درصد) – با چند مشتری انتخابی، هر مشتری سری
 * مستقل خود را دارد؛ درصد هر نقطه با همان تبدیل مشترک satisfactionPercent
 * (۸٫۱۸ → ۰٫۸۱٪) روی امتیاز وزنی «خودِ آن سری» اعمال می‌شود.
 */
const weightedTrend = computed(() =>
  isMultiCustomer.value
    ? buildWeightedTrendMultiCustomer(filteredReports.value)
    : buildWeightedTrend(filteredReports.value)
)
const weightedPercentSeries = computed(() =>
  weightedTrend.value.series.map(s => ({
    name: s.name,
    data: s.data.map(p => (p.y === null ? null : satisfactionPercent(p.y)))
  }))
)
const weightedTrendConfig = computed(() => ({
  type: 'area',
  height: 260,
  series: weightedPercentSeries.value,
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
    colors: weightedPercentSeries.value.length > 1 ? MULTI_SERIES_COLORS : [warningColor.value],
    dataLabels: {
      ...boldWhiteDataLabels,
      formatter: (v: number) => formatPercentValue(v)
    },
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 5, hover: { size: 7 } },
    ...sharedAxes(
      weightedTrend.value.series[0]?.data.map(p => p.x) ?? [],
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

/** نمودار ۳ – حالت تکی: نمره‌ی سؤال‌های جدیدترین گزارش (تولتیپ: نمره + وزن گره + دسته) */
const respondentScores = computed(() =>
  buildRespondentScores(selectedReport.value, meta.value, selectedCategories.value)
)

/**
 * نمودار ۳ – حالت تجمیعی: میانگین نمره‌ی هر دسته across همه‌ی گزارش‌های
 * منطبق (شامل حالت «همه») – به‌جز تک‌مشتری + تک‌تاریخ که نمای تک‌پاسخ
 * جدیدترین گزارش می‌ماند (تولتیپ: میانگین + وزن گره + شمارنده‌ها).
 */
const categoryAverages = computed(() =>
  isCategoryAggregate.value
    ? buildCategoryAverages(filteredReports.value, meta.value, selectedCategories.value)
    : null
)

/** شکل یکسان‌شده‌ی نمودار تفکیک برای هر دو حالت (تکی/تجمیعی) */
const categoryChart = computed(() => {
  const avg = categoryAverages.value
  if (avg) {
    return {
      averaged: true as const,
      name: 'میانگین نمره',
      labels: avg.labels,
      values: avg.values,
      scoreTooltips: [] as ReturnType<typeof buildRespondentScores>['tooltips'],
      avgTooltips: avg.tooltips
    }
  }
  return {
    averaged: false as const,
    name: 'نمره',
    labels: respondentScores.value.labels,
    values: respondentScores.value.values,
    scoreTooltips: respondentScores.value.tooltips,
    avgTooltips: [] as ReturnType<typeof buildCategoryAverages>['tooltips']
  }
})

const respondentChartConfig = computed(() => ({
  type: 'bar',
  height: 420,
  series: [{ name: categoryChart.value.name, data: categoryChart.value.values }],
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
      // برچسب کامل (متن سؤال در حالت تکی / عنوان دسته در حالت تجمیعی)
      categories: categoryChart.value.labels,
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
      custom: ({ dataPointIndex }: { dataPointIndex: number }) =>
        categoryChart.value.averaged
          ? categoryAverageTooltipHtml(categoryChart.value.avgTooltips[dataPointIndex])
          : categoryTooltipHtml(categoryChart.value.scoreTooltips[dataPointIndex])
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
            <!-- نوار فیلترها (چندانتخابی) -->
            <div class="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
              <!-- فیلتر نام مشتری: چندانتخابی با چک‌باکس -->
              <div class="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                نام مشتری:
                <div ref="providerMenuRoot" class="relative">
                  <button
                    type="button"
                    class="flex h-9 min-w-[130px] items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition-colors hover:border-green-600/50 focus:outline-none focus:ring-4 focus:ring-green-600/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                    :aria-expanded="isProviderMenuOpen"
                    aria-haspopup="listbox"
                    @click="isProviderMenuOpen = !isProviderMenuOpen"
                  >
                    <span class="max-w-[180px] truncate">{{ filterSummary(selectedProviders) }}</span>
                    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 flex-shrink-0 transition-transform" :class="isProviderMenuOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    v-if="isProviderMenuOpen"
                    class="absolute start-0 z-30 mt-1 max-h-64 min-w-[230px] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                    role="listbox"
                    aria-multiselectable="true"
                  >
                    <label class="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      <input type="checkbox" class="accent-green-700" :checked="selectedProviders.length === 0" @change="selectAllProviders" />
                      همه
                    </label>
                    <label
                      v-for="p in providerFilterOptions"
                      :key="p"
                      class="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <input type="checkbox" class="accent-green-700" :checked="selectedProviders.includes(p)" @change="toggleProvider(p)" />
                      {{ p }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- فیلتر تاریخ شمسی: چندانتخابی؛ نمایش جلالی، مقدار میلادی (تطابق با submitted_at) -->
              <div class="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                تاریخ شمسی:
                <div ref="dateMenuRoot" class="relative">
                  <button
                    type="button"
                    class="flex h-9 min-w-[130px] items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition-colors hover:border-green-600/50 focus:outline-none focus:ring-4 focus:ring-green-600/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                    :aria-expanded="isDateMenuOpen"
                    aria-haspopup="listbox"
                    @click="isDateMenuOpen = !isDateMenuOpen"
                  >
                    <span class="max-w-[180px] truncate">{{ filterSummary(selectedDates.map(d => formatJalaliDate(d))) }}</span>
                    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 flex-shrink-0 transition-transform" :class="isDateMenuOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    v-if="isDateMenuOpen"
                    class="absolute start-0 z-30 mt-1 max-h-64 min-w-[160px] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                    role="listbox"
                    aria-multiselectable="true"
                  >
                    <label class="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      <input type="checkbox" class="accent-green-700" :checked="selectedDates.length === 0" @change="selectAllDates" />
                      همه
                    </label>
                    <label
                      v-for="d in dateFilterOptions"
                      :key="d"
                      class="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <input type="checkbox" class="accent-green-700" :checked="selectedDates.includes(d)" @change="toggleDate(d)" />
                      {{ formatJalaliDate(d) }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- پاک‌کردن فیلترها -->
              <button
                v-if="selectedProviders.length > 0 || selectedDates.length > 0"
                type="button"
                class="mr-auto rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                @click="clearTrendFilters"
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

          <div v-if="categoryChart.values.length" class="rounded-md bg-slate-50/60 p-2 dark:bg-slate-900/40">
            <AddonApexcharts v-bind="respondentChartConfig" />
          </div>
          <p v-else class="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
            در دسته‌های انتخاب‌شده برای گزارش‌های فیلترشده، پاسخ عددی یافت نشد.
          </p>
        </div>
      </BaseCard>
    </template>
  </div>
</template>
