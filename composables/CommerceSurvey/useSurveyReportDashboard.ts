import type { SurveyCategoryGroup } from './useSurveyApi'

/**
 * سازنده‌های داده‌ی داشبورد گزارش نظرسنجی راهبردی (توابع خالص و قابل تست):
 *
 *  - نمودار ۱ «روند رضایت کلی عملکرد»: امتیاز سؤال‌های type === 'rating'
 *    در هر گزارش، برحسب submitted_at (هر question_id یک سری جداگانه).
 *  - نمودار ۲ «روند رضایت»: یک مقدار به‌ازای هر گزارش =
 *    Σ (number × strategy_node_weight) روی answerهای strategy_range_rating
 *    معتبر (فرمول دقیق؛ بدون میانگین/نرمال‌سازی؛ صفر معتبر است).
 *  - نمودار ۳ «نمره‌ی سؤال‌ها به تفکیک دسته»: پاسخ‌های عددی «یک گزارش
 *    انتخابی»؛ دسته‌بندی صرفاً از متادیتای تأییدشده‌ی Access (question_id، و
 *    در نبود آن strategy_node_id) – هرگز بر اساس متن سؤال یا عنوان گره.
 *
 * هیچ مقدار نمونه‌ای هاردکد نشده است؛ همه‌ی اعداد از پاسخ واقعی API می‌آیند.
 */

/** یک پاسخ داخل گزارش (فیلدها طبق سرویس GetStrategySurveyReport) */
export interface ReportAnswer {
  question_id?: string
  question_text?: string
  question_type?: string
  number?: unknown
  strategy_node_id?: unknown
  strategy_node_weight?: unknown
}

/** یک گزارش (پاسخ‌نامه‌ی ثبت‌شده) */
export interface SurveyReport {
  response_id?: string
  submitted_at?: string
  /** مشتری/ارائه‌دهنده‌ی پاسخ (فیلدهای اختیاری سرویس) */
  provider_id?: unknown
  provider_name?: unknown
  answers?: ReportAnswer[]
}

/** دسته‌ی سؤال‌هایی که متادیتای تأییدشده ندارند */
export const UNMAPPED_CATEGORY = 'سایر / دسته‌بندی‌نشده'

/** متادیتای تأییدشده‌ی هر سؤال از داده‌ی Access */
export interface QuestionMeta {
  category: string
  rangeMin: number | null
  rangeMax: number | null
}

/** آیا مقدار، عدد مطلوب (finite) است؟ – مقدارهای خراب هرگز صفر فرض نمی‌شوند */
export function isValidNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

/**
 * استخراج فهرست گزارش‌ها از پاسخ خام سرویس (دفاعی):
 * { reports: [...] } یا { data: [...] } یا خود آرایه.
 */
export function extractReports(response: unknown): SurveyReport[] {
  if (Array.isArray(response)) return response as SurveyReport[]
  if (response && typeof response === 'object') {
    const obj = response as Record<string, unknown>
    if (Array.isArray(obj.reports)) return obj.reports as SurveyReport[]
    if (Array.isArray(obj.data)) return obj.data as SurveyReport[]
  }
  return []
}

/** تاریخ میلادی/ISO → رشته‌ی فارسی (تاریخ + ساعت) برای برچسب محور */
export function formatFaDateTime(value: string | number | Date): string {
  try {
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return String(value)
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d)
  } catch {
    return String(value)
  }
}

/**
 * مرتب‌سازی زمانی گزارش‌ها (صعودی بر اساس submitted_at).
 * کلید پایدار هر گزارش response_id می‌ماند؛ تاریخ نامعتبر در انتها قرار می‌گیرد.
 */
export function sortReportsChronologically(reports: SurveyReport[]): SurveyReport[] {
  const time = (r: SurveyReport): number => {
    const t = new Date(r.submitted_at ?? '').getTime()
    return Number.isNaN(t) ? Number.MAX_SAFE_INTEGER : t
  }
  return reports.slice().sort((a, b) => time(a) - time(b))
}

/**
 * ساخت متادیتای سؤال‌ها از داده‌ی تأییدشده‌ی Access (نه حدس متنی):
 *  - نگاشت اصلی: question._id → دسته (عنوان گره استراتژیک یا دسته‌ی عمومی)
 *  - نگاشت پشتیبان: strategy_node_id → دسته (برای answerهایی که question_id
 *    در متادیتا نیست ولی strategy_node_id دارد)
 *  - بازه‌ی مقیاس (range_min/range_max) هر سؤال نیز حمل می‌شود.
 */
export function buildQuestionMeta(groups: SurveyCategoryGroup[] | null): {
  byQuestionId: Map<string, QuestionMeta>
  byStrategyNodeId: Map<string, { category: string }>
} {
  const byQuestionId = new Map<string, QuestionMeta>()
  const byStrategyNodeId = new Map<string, { category: string }>()

  for (const g of groups ?? []) {
    const isGeneral = g.category?.is_general === true
    const nodeId = g.category?.strategy_node_id
    const title = isGeneral
      ? (g.category?.strategy_node_title || 'نظرات و جمع‌بندی')
      : (g.category?.strategy_node_title || UNMAPPED_CATEGORY)

    if (!isGeneral && typeof nodeId === 'string' && nodeId) {
      if (!byStrategyNodeId.has(nodeId)) byStrategyNodeId.set(nodeId, { category: title })
    }

    for (const q of g.questions ?? []) {
      if (!q._id || byQuestionId.has(q._id)) continue
      byQuestionId.set(q._id, {
        category: title,
        rangeMin: isValidNumber(q.range_min) ? q.range_min : null,
        rangeMax: isValidNumber(q.range_max) ? q.range_max : null
      })
    }
  }

  return { byQuestionId, byStrategyNodeId }
}

/** دسته‌ی یک answer صرفاً با کلیدهای پایدار (question_id و بعد strategy_node_id) */
export function resolveAnswerCategory(
  answer: ReportAnswer,
  meta: ReturnType<typeof buildQuestionMeta>
): QuestionMeta | { category: string; rangeMin: null; rangeMax: null } {
  const byId = answer.question_id ? meta.byQuestionId.get(answer.question_id) : undefined
  if (byId) return byId
  const nodeId = typeof answer.strategy_node_id === 'string' ? answer.strategy_node_id : null
  if (nodeId) {
    const byNode = meta.byStrategyNodeId.get(nodeId)
    if (byNode) return { category: byNode.category, rangeMin: null, rangeMax: null }
  }
  return { category: UNMAPPED_CATEGORY, rangeMin: null, rangeMax: null }
}

/** فهرست دسته‌ها به‌ترتیب ثابت (بر اساس متادیتای Access؛ بدون دستبافی) */
export function buildCategoryList(
  meta: ReturnType<typeof buildQuestionMeta>,
  reports: SurveyReport[]
): string[] {
  const ordered: string[] = []
  for (const m of meta.byQuestionId.values()) {
    if (!ordered.includes(m.category)) ordered.push(m.category)
  }
  // دسته‌های فقط از طریق strategy_node_id قابل نگاشت هم اضافه می‌شوند
  for (const n of meta.byStrategyNodeId.values()) {
    if (!ordered.includes(n.category)) ordered.push(n.category)
  }
  // اگر answer بدون نگاشت در داده‌ی واقعی وجود دارد، دسته‌ی صریح «سایر» ارائه می‌شود
  const hasUnmapped = reports.some(r =>
    (r.answers ?? []).some(a => resolveAnswerCategory(a, meta).category === UNMAPPED_CATEGORY)
  )
  if (hasUnmapped) ordered.push(UNMAPPED_CATEGORY)
  return ordered
}

export interface TrendSeries {
  name: string
  /** y می‌تواند null باشد (برش روزانه‌ای که این سری داده‌ای ندارد – شکاف صادقانه) */
  data: Array<{ x: string; y: number | null }>
}

export interface RatingTrendResult {
  series: TrendSeries[]
  /** بازه‌ی مقیاس فقط وقتی برگردانده می‌شود که همه‌ی سؤال‌ها بازه‌ی یکسانی داشته باشند */
  range: { min: number; max: number } | null
  pointCount: number
}

/**
 * نمودار ۱ – روند رضایت کلی (question_type === 'rating'):
 * هر question_id یک سری مستقل (بدون ترکیب امتیاز سؤال‌های متفاوت)؛
 * پاسخ‌های بدون عدد معتبر حذف می‌شوند (هرگز صفر فرض نمی‌شوند).
 */
export function buildRatingTrend(
  reports: SurveyReport[],
  meta: ReturnType<typeof buildQuestionMeta>
): RatingTrendResult {
  const sorted = sortReportsChronologically(reports)
  const byQuestion = new Map<string, TrendSeries>()
  const ranges = new Set<string>()

  for (const report of sorted) {
    const x = report.submitted_at ? formatFaDateTime(report.submitted_at) : '—'
    for (const answer of report.answers ?? []) {
      if (answer.question_type !== 'rating') continue
      if (!isValidNumber(answer.number)) continue
      const qid = String(answer.question_id ?? 'بدون شناسه')
      if (!byQuestion.has(qid)) {
        const m = answer.question_id ? meta.byQuestionId.get(answer.question_id) : undefined
        byQuestion.set(qid, {
          name: answer.question_text?.trim() || `سؤال ${qid}`,
          data: []
        })
        if (m && m.rangeMin !== null && m.rangeMax !== null) {
          ranges.add(`${m.rangeMin}..${m.rangeMax}`)
        }
      }
      byQuestion.get(qid)!.data.push({ x, y: answer.number })
    }
  }

  let range: { min: number; max: number } | null = null
  if (ranges.size === 1) {
    const [min, max] = ranges.values().next().value!.split('..').map(Number)
    range = { min, max }
  }

  const series = [...byQuestion.values()]
  return {
    series,
    range,
    pointCount: series.reduce((acc, s) => acc + s.data.length, 0)
  }
}

export interface WeightedTrendResult {
  series: TrendSeries[]
  pointCount: number
  /** گزارش‌های بدون هیچ پاسخ وزنی معتبر (نقطه‌ای برای آن‌ها محاسبه نمی‌شود) */
  skippedReports: number
}

/**
 * نمودار ۲ – روند رضایت وزنی؛ فرمول دقیق مشخصات:
 *   weightedSatisfaction = answers
 *     .filter(a => a.question_type === 'strategy_range_rating' &&
 *                  isValidNumber(a.number) && isValidNumber(a.strategy_node_weight))
 *     .reduce((sum, a) => sum + a.number * a.strategy_node_weight, 0)
 * یک مقدار به‌ازای هر گزارش؛ صفر معتبر است و حذف نمی‌شود.
 */
export function buildWeightedTrend(reports: SurveyReport[]): WeightedTrendResult {
  const sorted = sortReportsChronologically(reports)
  const data: Array<{ x: string; y: number }> = []
  let skipped = 0

  for (const report of sorted) {
    const weighted = reportWeightedScore(report)
    if (weighted === null) {
      skipped++
      continue
    }
    data.push({ x: report.submitted_at ? formatFaDateTime(report.submitted_at) : '—', y: weighted })
  }

  return {
    series: data.length ? [{ name: 'امتیاز وزنی', data }] : [],
    pointCount: data.length,
    skippedReports: skipped
  }
}

/* ============ حالت تجمیعی چندانتخابی: میانگین حسابی روزانه ============ */

/** یک برش زمانی روزانه: میانگین حسابی مقادیر گزارش‌های همان روز */
export interface DailyAveragePoint {
  /** تاریخ میلادی YYYY-MM-DD برش (گزارش‌های بی‌تاریخ: «—») */
  date: string
  /** برچسب نمایشی شمسی برش (formatJalaliDate) */
  label: string
  /** میانگین حسابی مقادیر آن روز */
  value: number
  /** تعداد مقادیر واردشده در میانگین */
  count: number
}

/**
 * گروه‌بندی گزارش‌های مرتب‌شده بر حسب روز (بخش تاریخ submitted_at) و
 * محاسبه‌ی «میانگین حسابی» خروجی metric در هر برش.
 * گزارش‌های با metric نامعتبر (null) از میانگین حذف می‌شوند – هرگز صفر
 * فرض نمی‌شوند؛ ترتیب برش‌ها صعودی زمانی است.
 */
export function averageReportsByDate(
  reports: SurveyReport[],
  metric: (report: SurveyReport) => number | null
): DailyAveragePoint[] {
  const buckets = new Map<string, number[]>()
  for (const report of sortReportsChronologically(reports)) {
    const value = metric(report)
    if (value === null || !isValidNumber(value)) continue
    const key = reportDatePart(report) ?? '—'
    const list = buckets.get(key) ?? []
    list.push(value)
    buckets.set(key, list)
  }
  return [...buckets.entries()].map(([date, values]) => ({
    date,
    label: date === '—' ? '—' : formatJalaliDate(date),
    value: values.reduce((sum, v) => sum + v, 0) / values.length,
    count: values.length
  }))
}

/**
 * روند رضایت (وزنی) در حالت تجمیعی چندانتخابی:
 * میانگین حسابی «امتیاز وزنی» گزارش‌های هم‌روز ← یک نقطه به‌ازای هر برش
 * روزانه (برچسب شمسی). درصد نهایی بعداً با همان تبدیل مشترک
 * satisfactionPercent روی میانگین اعمال می‌شود.
 */
export function buildWeightedTrendAveraged(reports: SurveyReport[]): WeightedTrendResult {
  let evaluated = 0
  const metric = (report: SurveyReport): number | null => {
    const score = reportWeightedScore(report)
    if (score !== null) evaluated++
    return score
  }
  const points = averageReportsByDate(reports, metric)
  const data = points.map(p => ({ x: p.label, y: p.value }))
  const total = sortReportsChronologically(reports).length
  return {
    series: data.length ? [{ name: 'امتیاز وزنی', data }] : [],
    pointCount: data.length,
    skippedReports: total - evaluated
  }
}

/**
 * نمودار «روند رضایت کلی عملکرد» در حالت تجمیعی چندانتخابی:
 * برش‌های روزانه از پاسخ‌های rating ساخته می‌شود و مقدار هر سری در هر
 * برش = میانگین حسابی امتیازهای همان سؤال در آن روز. سری‌های فاقد داده
 * در یک برش null می‌گیرند (شکاف واقعی، نه صفر).
 */
export function buildRatingTrendAveraged(
  reports: SurveyReport[],
  meta: ReturnType<typeof buildQuestionMeta>
): RatingTrendResult {
  const sorted = sortReportsChronologically(reports)
  const sliceKeys: string[] = []
  const sliceIndex = new Map<string, number>()
  interface QuestionBucket {
    name: string
    buckets: Map<number, number[]>
    ranges: Set<string>
  }
  const byQuestion = new Map<string, QuestionBucket>()

  for (const report of sorted) {
    const day = reportDatePart(report)
    for (const answer of report.answers ?? []) {
      if (answer.question_type !== 'rating') continue
      if (!isValidNumber(answer.number)) continue
      const key = day ?? '—'
      if (!sliceIndex.has(key)) {
        sliceIndex.set(key, sliceKeys.length)
        sliceKeys.push(key)
      }
      const qid = String(answer.question_id ?? 'بدون شناسه')
      if (!byQuestion.has(qid)) {
        const m = answer.question_id ? meta.byQuestionId.get(answer.question_id) : undefined
        const ranges = new Set<string>()
        if (m && m.rangeMin !== null && m.rangeMax !== null) {
          ranges.add(`${m.rangeMin}..${m.rangeMax}`)
        }
        byQuestion.set(qid, {
          name: answer.question_text?.trim() || `سؤال ${qid}`,
          buckets: new Map(),
          ranges
        })
      }
      const q = byQuestion.get(qid)!
      const idx = sliceIndex.get(key)!
      const list = q.buckets.get(idx) ?? []
      list.push(answer.number)
      q.buckets.set(idx, list)
    }
  }

  const series: TrendSeries[] = [...byQuestion.values()].map(q => ({
    name: q.name,
    data: sliceKeys.map((key, idx) => {
      const list = q.buckets.get(idx)
      return {
        x: key === '—' ? '—' : formatJalaliDate(key),
        y: list ? list.reduce((sum, v) => sum + v, 0) / list.length : null
      }
    })
  }))

  const allRanges = new Set<string>()
  for (const q of byQuestion.values()) {
    for (const r of q.ranges) allRanges.add(r)
  }
  let range: { min: number; max: number } | null = null
  if (allRanges.size === 1) {
    const [min, max] = allRanges.values().next().value!.split('..').map(Number)
    range = { min, max }
  }

  return {
    series,
    range,
    pointCount: series.reduce(
      (acc, s) => acc + s.data.filter(p => p.y !== null).length,
      0
    )
  }
}

export interface RespondentScoresResult {
  /** برچسب محور X (متن واقعی سؤال؛ تکراری‌ها جدا نگه داشته می‌شوند) */
  labels: string[]
  /** برچسب کوتاه‌شده‌ی نمایشی برای محور */
  displayLabels: string[]
  values: number[]
  tooltips: Array<{
    text: string
    value: number
    range: string | null
    category: string
    /** وزن گره (strategy_node_weight) برای نمایش در تولتیپ؛ نامعتبر → null */
    weight: number | null
  }>
}

/** کوتاه‌سازی برچسب بلند فارسی برای محور X */
function truncateLabel(text: string, max = 16): string {
  const t = text.trim()
  return t.length > max ? `${t.slice(0, max)}…` : t
}

/** بازه‌ی مقیاس خوانا (مثلاً «۰ تا ۵») یا null */
export function formatRange(rangeMin: number | null, rangeMax: number | null): string | null {
  if (rangeMin === null && rangeMax === null) return null
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const faNum = (n: number) =>
    Number.isInteger(n) ? String(n).replace(/\d/g, d => faDigits[+d]) : String(n)
  const min = rangeMin ?? 0
  const max = rangeMax ?? min
  return `${faNum(min)} تا ${faNum(max)}`
}

/**
 * نمودار ۳ – نمره‌ی سؤال‌ها برای «یک گزارش انتخابی»:
 *  - فقط پاسخ‌های عددی معتبر (number متناهی)؛ مقدار خراب هرگز صفر نمی‌شود
 *  - هویت هر نقطه question_id است؛ متن تکراری ادغام نمی‌شود
 *  - فیلتر دسته: null/خالی = همه؛ در غیر این صورت فقط دسته‌های انتخابی
 */
export function buildRespondentScores(
  report: SurveyReport | null,
  meta: ReturnType<typeof buildQuestionMeta>,
  selectedCategories: string[] | null
): RespondentScoresResult {
  const labels: string[] = []
  const displayLabels: string[] = []
  const values: number[] = []
  const tooltips: RespondentScoresResult['tooltips'] = []

  if (!report) return { labels, displayLabels, values, tooltips }

  for (const answer of report.answers ?? []) {
    if (!isValidNumber(answer.number)) continue
    const m = resolveAnswerCategory(answer, meta)
    if (selectedCategories && selectedCategories.length > 0) {
      if (!selectedCategories.includes(m.category)) continue
    }
    const text = answer.question_text?.trim() || `سؤال ${String(answer.question_id ?? '—')}`
    labels.push(text)
    displayLabels.push(truncateLabel(text))
    values.push(answer.number)
    tooltips.push({
      text,
      value: answer.number,
      range: formatRange(m.rangeMin, m.rangeMax),
      category: m.category,
      weight: isValidNumber(answer.strategy_node_weight)
        ? (answer.strategy_node_weight as number)
        : null
    })
  }

  return { labels, displayLabels, values, tooltips }
}

/**
 * HTML سفارشی تولتیپ نمودار «نمره‌ی سؤال‌ها به تفکیک دسته»:
 * نمره + وزن گره (strategy_node_weight) + دسته؛ وزن نامعتبر ← «—»
 */
export function categoryTooltipHtml(
  t: RespondentScoresResult['tooltips'][number] | undefined
): string {
  if (!t) return ''
  const range = t.range ? ` — مقیاس ${t.range}` : ''
  const weight = t.weight !== null ? t.weight : '—'
  return `<div class="apexcharts-tooltip-title">${t.text}</div>` +
    `<div class="apexcharts-tooltip-series-group" style="display:block">` +
    `<span class="apexcharts-tooltip-text">نمره: ${t.value}${range}</span></div>` +
    `<div class="apexcharts-tooltip-series-group" style="display:block">` +
    `<span class="apexcharts-tooltip-text">وزن گره: ${weight}</span></div>` +
    `<div class="apexcharts-tooltip-series-group" style="display:block">` +
    `<span class="apexcharts-tooltip-text">دسته: ${t.category}</span></div>`
}

/* ============ حالت تجمیعی: میانگین نمره‌ی هر دسته across responses ============ */

/** آمار میانگین یک دسته در حالت تجمیعی */
export interface CategoryAverageStat {
  /** عنوان دسته */
  category: string
  /** میانگین حسابی نمره‌های معتبر دسته */
  mean: number
  /** میانگین وزن گره پاسخ‌های شمرده‌شده؛ بدون وزن معتبر → null */
  weight: number | null
  /** تعداد پاسخ‌های عددی واردشده در میانگین */
  answerCount: number
  /** تعداد پاسخ‌دهنده‌های متمایز */
  respondentCount: number
}

export interface CategoryAveragesResult {
  /** عنوان دسته‌ها (ترتیب متادیتا، سپس دسته‌های جدید) */
  labels: string[]
  /** میانگین نمره‌ی هر دسته */
  values: number[]
  tooltips: CategoryAverageStat[]
  pointCount: number
}

/**
 * نمودار «نمره‌ی سؤال‌ها به تفکیک دسته» در حالت تجمیعی چندانتخابی:
 * میانگین حسابی نمره‌ی هر دسته across همه‌ی گزارش‌های منطبق با فیلترهای
 * چندانتخابی. ترتیب دسته‌ها از متادیتای سؤال‌ها (سپس نگاشت گره، سپس
 * «سایر») حفظ می‌شود؛ وزن گره به‌صورت میانگین وزن پاسخ‌های شمرده‌شده‌ی
 * همان دسته گزارش می‌شود.
 */
export function buildCategoryAverages(
  reports: SurveyReport[],
  meta: ReturnType<typeof buildQuestionMeta>,
  selectedCategories: string[] | null
): CategoryAveragesResult {
  // ترتیب پایدار دسته‌ها: متادیتای سؤال‌ها ← نگاشت گره‌ها ← سایر
  const order: string[] = []
  const seen = new Set<string>()
  const pushCategory = (c: string) => {
    if (!seen.has(c)) {
      seen.add(c)
      order.push(c)
    }
  }
  for (const m of meta.byQuestionId.values()) pushCategory(m.category)
  for (const n of meta.byStrategyNodeId.values()) pushCategory(n.category)
  pushCategory(UNMAPPED_CATEGORY)

  interface Acc {
    sum: number
    count: number
    weightSum: number
    weightCount: number
    respondents: Set<string>
  }
  const acc = new Map<string, Acc>()
  const ensure = (category: string): Acc => {
    pushCategory(category)
    let a = acc.get(category)
    if (!a) {
      a = { sum: 0, count: 0, weightSum: 0, weightCount: 0, respondents: new Set() }
      acc.set(category, a)
    }
    return a
  }

  reports.forEach((report, reportIndex) => {
    const respondentKey = String(report.response_id ?? `#${reportIndex}`)
    for (const answer of report.answers ?? []) {
      if (!isValidNumber(answer.number)) continue
      const category = resolveAnswerCategory(answer, meta).category
      if (selectedCategories && selectedCategories.length > 0) {
        if (!selectedCategories.includes(category)) continue
      }
      const a = ensure(category)
      a.sum += answer.number
      a.count++
      a.respondents.add(respondentKey)
      if (isValidNumber(answer.strategy_node_weight)) {
        a.weightSum += answer.strategy_node_weight as number
        a.weightCount++
      }
    }
  })

  const labels: string[] = []
  const values: number[] = []
  const tooltips: CategoryAverageStat[] = []
  for (const category of order) {
    const a = acc.get(category)
    if (!a || a.count === 0) continue
    labels.push(category)
    values.push(a.sum / a.count)
    tooltips.push({
      category,
      mean: a.sum / a.count,
      weight: a.weightCount > 0 ? a.weightSum / a.weightCount : null,
      answerCount: a.count,
      respondentCount: a.respondents.size
    })
  }

  return { labels, values, tooltips, pointCount: values.length }
}

/** عدد با حداکثر دو رقم اعشار (فارسی) برای تولتیپ میانگین */
function faCompactNumber(v: number): string {
  return v.toLocaleString('fa-IR', { maximumFractionDigits: 2 })
}

/** عدد صحیح فارسی */
function faIntFa(v: number): string {
  return v.toLocaleString('fa-IR', { maximumFractionDigits: 0 })
}

/**
 * HTML سفارشی تولتیپ نمودار تفکیک دسته در حالت تجمیعی:
 * میانگین نمره + وزن گره + تعداد پاسخ + تعداد پاسخ‌دهنده.
 */
export function categoryAverageTooltipHtml(
  t: CategoryAverageStat | undefined
): string {
  if (!t) return ''
  const weight = t.weight !== null ? faCompactNumber(t.weight) : '—'
  return `<div class="apexcharts-tooltip-title">${t.category}</div>` +
    `<div class="apexcharts-tooltip-series-group" style="display:block">` +
    `<span class="apexcharts-tooltip-text">میانگین نمره: ${faCompactNumber(t.mean)}</span></div>` +
    `<div class="apexcharts-tooltip-series-group" style="display:block">` +
    `<span class="apexcharts-tooltip-text">وزن گره: ${weight}</span></div>` +
    `<div class="apexcharts-tooltip-series-group" style="display:block">` +
    `<span class="apexcharts-tooltip-text">تعداد پاسخ: ${faIntFa(t.answerCount)}</span></div>` +
    `<div class="apexcharts-tooltip-series-group" style="display:block">` +
    `<span class="apexcharts-tooltip-text">تعداد پاسخ‌دهنده: ${faIntFa(t.respondentCount)}</span></div>`
}

/* ===================== درصد رضایت (قرارداد مشترک) ===================== */

/**
 * تبدیل مشترک امتیاز رضایت به درصد – طبق مشخصات:
 *   8.18 → 0.81 (تقسیم بر ۱۰ و قطع به دو رقم اعشار؛ بدون بازتفسیر به ۸۱٫۸)
 * این تابع تنها مرجع تبدیل برای نمودار «روند رضایت» و نمودار دایره‌ای است.
 */
export function satisfactionPercent(value: number): number {
  if (!isValidNumber(value)) return 0
  return Math.floor((value / 10) * 100) / 100
}

/** قالب‌بندی درصدِ تبدیل‌شده با علامت ٪ (ارقام فارسی، حداکثر دو رقم اعشار) */
export function formatPercentValue(converted: number): string {
  const v = isValidNumber(converted) ? converted : 0
  return `${v.toLocaleString('fa-IR', { maximumFractionDigits: 2 })}٪`
}

/* ===================== فیلتر مشتری و تاریخ میلادی ===================== */

/** نام مشتری پاسخ‌نامه؛ در نبود نام، شناسه؛ در نبود هر دو، «نامشخص» */
export function reportProviderName(report: SurveyReport): string {
  const name = typeof report.provider_name === 'string' ? report.provider_name.trim() : ''
  if (name) return name
  const id = typeof report.provider_id === 'string' ? report.provider_id.trim() : ''
  return id || 'نامشخص'
}

/** بخش تاریخ (میلادی) از submitted_at به شکل YYYY-MM-DD؛ نامعتبر → null */
export function reportDatePart(report: SurveyReport): string | null {
  const raw = typeof report.submitted_at === 'string' ? report.submitted_at : ''
  if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) return null
  return raw.slice(0, 10)
}

/** فهرست مشتریان متمایز (بدون مقادیر خالی؛ برای فیلتر «نام مشتری») */
export function providerOptions(reports: SurveyReport[]): string[] {
  const out = new Set<string>()
  for (const r of reports) {
    const name = typeof r.provider_name === 'string' ? r.provider_name.trim() : ''
    if (name) out.add(name)
  }
  return [...out].sort((a, b) => a.localeCompare(b, 'fa'))
}

/** فهرست تاریخ‌های میلادی متمایز، صعودی (برای فیلتر «تاریخ میلادی») */
export function dateOptions(reports: SurveyReport[]): string[] {
  const out = new Set<string>()
  for (const r of reports) {
    const d = reportDatePart(r)
    if (d) out.add(d)
  }
  return [...out].sort()
}

export interface ReportFilters {
  /** نام‌های مشتری انتخاب‌شده (چندانتخابی)؛ آرایه‌ی خالی = همه */
  providers: string[]
  /** تاریخ‌های میلادی YYYY-MM-DD انتخاب‌شده (چندانتخابی)؛ آرایه‌ی خالی = همه */
  dates: string[]
}

/**
 * برچسب تاریخ شمسی (جلالی) برای یک تاریخ میلادی YYYY-MM-DD – با
 * Intl/fa-IR (تقویم پیش‌فرض فارسی؛ بدون کتابخانه‌ی جدید).
 * مقدار فیلتر همچنان میلادی می‌ماند تا با submitted_at مطابقت کند.
 */
export function formatJalaliDate(yyyyMmDd: string): string {
  try {
    const d = new Date(`${yyyyMmDd}T00:00:00Z`)
    if (Number.isNaN(d.getTime())) return yyyyMmDd
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC'
    }).format(d)
  } catch {
    return yyyyMmDd
  }
}

export interface ReportSummary {
  count: number
  earliest: string | null
  latest: string | null
}

/**
 * خلاصه‌ی سراسری گزارش‌ها (همیشه از کل داده‌ی فیلترنشده):
 * تعداد کل + قدیمی‌ترین/جدیدترین submitted_at.
 */
export function buildReportSummary(reports: SurveyReport[]): ReportSummary {
  let count = 0
  let earliest: number | null = null
  let latest: number | null = null
  let earliestRaw: string | null = null
  let latestRaw: string | null = null

  for (const r of reports) {
    count++
    const raw = typeof r.submitted_at === 'string' ? r.submitted_at : ''
    if (!raw) continue
    const t = new Date(raw).getTime()
    if (Number.isNaN(t)) continue
    if (earliest === null || t < earliest) {
      earliest = t
      earliestRaw = raw
    }
    if (latest === null || t > latest) {
      latest = t
      latestRaw = raw
    }
  }

  return { count, earliest: earliestRaw, latest: latestRaw }
}

/**
 * اعمال ترکیبی دو فیلتر چندانتخابی (AND بین گروه‌ها، OR درون هر گروه):
 *  - هر گروه خالی = بدون محدودیت (همه)
 *  - در غیر این صورت مقدار باید در فهرست انتخابی همان گروه باشد
 */
export function filterReports(reports: SurveyReport[], filters: ReportFilters): SurveyReport[] {
  return reports.filter(r => {
    if (filters.providers.length > 0 && !filters.providers.includes(reportProviderName(r))) return false
    if (filters.dates.length > 0 && !filters.dates.includes(reportDatePart(r) ?? '')) return false
    return true
  })
}

/* ===================== نمودار دایره‌ای توزیع رضایت ===================== */

/** امتیاز وزنی یک گزارش: Σ(number × strategy_node_weight) روی پاسخ‌های معتبر؛ بدون پاسخ معتبر → null */
export function reportWeightedScore(report: SurveyReport): number | null {
  let sum = 0
  let hasValid = false
  for (const a of report.answers ?? []) {
    if (
      a.question_type === 'strategy_range_rating' &&
      isValidNumber(a.number) &&
      isValidNumber(a.strategy_node_weight)
    ) {
      sum += (a.number as number) * (a.strategy_node_weight as number)
      hasValid = true
    }
  }
  return hasValid ? sum : null
}

/** نوارهای رضایت با برچسب دقیق و رنگ‌های ثابت */
export const SATISFACTION_BANDS = [
  { name: 'ضعیف(<40%)', color: '#dc2626' },
  { name: 'متوسط(40-60%)', color: '#eab308' },
  { name: 'خوب(60-80%)', color: '#4ade80' },
  { name: 'عالی(>80%)', color: '#15803d' }
] as const

/**
 * طبقه‌بندی درصد رضایت به یکی از چهار نوار – مرزبندی بدون هم‌پوشانی:
 *   < 40 → ضعیف | 40 تا کمتر از 60 → متوسط | 60 تا 80 (شامل 80) → خوب |
 *   بالای 80 → عالی
 */
export function classifySatisfactionBand(percent: number): number {
  if (percent < 40) return 0
  if (percent < 60) return 1
  if (percent <= 80) return 2
  return 3
}

export interface SatisfactionDistribution {
  labels: string[]
  values: number[]
  colors: string[]
  /** تعداد کل مشتریان واردشده در توزیع */
  customerCount: number
}

/**
 * توزیع رضایت مشتریان روی «همه‌ی گزارش‌ها» (مستقل از فیلترها):
 *  - امتیاز هر گزارش = reportWeightedScore (همان فرمول روند رضایت)
 *  - امتیاز مشتری = میانگین امتیاز گزارش‌های او (تجمیع صریح؛ هر مشتری
 *    صرف‌نظر از تعداد پاسخ‌نامه‌ها یک‌بار در توزیع می‌آید)
 *  - درصد مشتری با همان satisfactionPercent مشترک تبدیل و به نوارها
 *    طبقه‌بندی می‌شود؛ هر برش = تعداد مشتریان آن نوار.
 */
export function buildSatisfactionDistribution(reports: SurveyReport[]): SatisfactionDistribution {
  // تجمیع صریح به‌ازای هر مشتری
  const scoresByCustomer = new Map<string, number[]>()
  for (const report of reports) {
    const score = reportWeightedScore(report)
    if (score === null) continue
    const key = reportProviderName(report)
    const list = scoresByCustomer.get(key) ?? []
    list.push(score)
    scoresByCustomer.set(key, list)
  }

  const counts = [0, 0, 0, 0]
  for (const scores of scoresByCustomer.values()) {
    const avg = scores.reduce((sum, v) => sum + v, 0) / scores.length
    const percent = satisfactionPercent(avg)
    counts[classifySatisfactionBand(percent)]!++
  }

  return {
    labels: SATISFACTION_BANDS.map(b => b.name),
    values: counts,
    colors: SATISFACTION_BANDS.map(b => b.color),
    customerCount: scoresByCustomer.size
  }
}
