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
  data: Array<{ x: string; y: number }>
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
    const weighted = (report.answers ?? [])
      .filter(
        a =>
          a.question_type === 'strategy_range_rating' &&
          isValidNumber(a.number) &&
          isValidNumber(a.strategy_node_weight)
      )
      .reduce((sum, a) => sum + (a.number as number) * (a.strategy_node_weight as number), 0)

    const hasValid = (report.answers ?? []).some(
      a =>
        a.question_type === 'strategy_range_rating' &&
        isValidNumber(a.number) &&
        isValidNumber(a.strategy_node_weight)
    )
    if (!hasValid) {
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

export interface RespondentScoresResult {
  /** برچسب محور X (متن واقعی سؤال؛ تکراری‌ها جدا نگه داشته می‌شوند) */
  labels: string[]
  /** برچسب کوتاه‌شده‌ی نمایشی برای محور */
  displayLabels: string[]
  values: number[]
  tooltips: Array<{ text: string; value: number; range: string | null; category: string }>
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
      category: m.category
    })
  }

  return { labels, displayLabels, values, tooltips }
}
