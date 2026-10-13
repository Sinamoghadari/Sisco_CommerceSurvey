import { computed, reactive, ref, watch } from 'vue'
import type { SurveyCategoryGroup, SurveyQuestion } from './useSurveyApi'
import type { SurveySelection } from './useSurveyDefinition'

export type AnswerValue = number | string | null
export type FollowUpAnswer = number | string

/** خروجی نهایی نظرسنجی (فقط در حافظه‌ی کلاینت نگهداری می‌شود) */
export interface SurveyCompletionPayload {
  selection: SurveySelection
  categories: Array<{
    id: string
    title: string
    questions: Array<{ _id: string; text: string; selected: AnswerValue }>
  }>
  followUps: Record<string, FollowUpAnswer>
  completedAt: number
}

/**
 * ارزیابی شرط نمایش سؤال تکمیلی بر اساس امتیاز انتخاب‌شده.
 * عملگرهای استاندارد عددی را پشتیبانی می‌کند:
 *   less_than (<) ، less_than_or_equal (<=) ، greater_than (>) ،
 *   greater_than_or_equal (>=) ، equal (==)
 * تابع خالص است و هم در کامپوزیبل و هم در کامپوننت سؤال استفاده می‌شود.
 */
export function isFollowUpConditionMet(
  q: Pick<SurveyQuestion, 'selected' | 'conditional_follow_up'>
): boolean {
  const fu = q.conditional_follow_up
  if (!fu || !fu.enabled) return false
  const v = q.selected
  if (typeof v !== 'number' || !Number.isFinite(v)) return false
  switch (fu.operator) {
    case 'less_than':
      return v < fu.threshold
    case 'less_than_or_equal':
      return v <= fu.threshold
    case 'greater_than':
      return v > fu.threshold
    case 'greater_than_or_equal':
      return v >= fu.threshold
    case 'equal':
      return v === fu.threshold
    default:
      return false
  }
}

/**
 * موتور وضعیت ویزارد پرسشنامه‌ی داینامیک.
 * ورودی، گروه‌های دسته‌بندی دریافت‌شده از API است؛ پاسخ‌ها روی فیلد
 * `selected` هر سؤال و پاسخ سؤال‌های تکمیلی در نگه‌دارنده‌ی جداگانه
 * (کلید: _id سؤال) ذخیره می‌شود.
 * کاملاً سمت کلاینت و بدون هیچ فراخوانی ثبت (endpoint ثبت در این فاز تعریف نشده است).
 */
export function useSurveyWizard(groups: () => SurveyCategoryGroup[]) {
  const currentIndex = ref(0)
  const direction = ref<'forward' | 'backward'>('forward')
  const touchedGroups = reactive<Record<string, boolean>>({})
  /** پاسخ سؤال‌های تکمیلی: کلید = _id سؤال اصلی */
  const followUps = reactive<Record<string, FollowUpAnswer>>({})

  /** گروه‌های نمایشی: حذف سؤال‌های غیرفعال/حذف‌شده + مرتب‌سازی صعودی بر اساس order */
  const displayGroups = computed<SurveyCategoryGroup[]>(() =>
    (groups() ?? []).map(g => ({
      category: g.category,
      questions: (g.questions ?? [])
        .filter(q => q.status !== false && q.delete !== true)
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }))
  )

  const stepList = computed(() => displayGroups.value)
  const currentGroup = computed(() => stepList.value[currentIndex.value])
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === stepList.value.length - 1)
  const progress = computed(() =>
    stepList.value.length ? Math.round(((currentIndex.value + 1) / stepList.value.length) * 100) : 0
  )

  /** استپ‌های استپر بالا – کاملاً از داده‌ی API ساخته می‌شوند */
  const stepperSteps = computed(() =>
    stepList.value.map((g, i) => ({
      id: g.category?.strategy_node_id || `group-${i}`,
      title: g.category?.strategy_node_title || `بخش ${i + 1}`
    }))
  )

  const totalDisplayQuestions = computed(() =>
    stepList.value.reduce((acc, g) => acc + g.questions.length, 0)
  )

  // با جایگزینی داده (refetch) وضعیت ویزارد از صفر ساخته می‌شود
  watch(
    () => stepList.value.map(g => g.category?.strategy_node_id ?? '').join('|'),
    () => reset()
  )

  /* ------------------------------- پاسخ‌ها ------------------------------- */

  function isQuestionAnswered(q: SurveyQuestion): boolean {
    const v = q.selected
    if (v === null || v === undefined) return false
    if (typeof v === 'number') return Number.isFinite(v)
    if (typeof v === 'string') return v.trim().length > 0
    return false
  }

  function isQuestionInvalid(q: SurveyQuestion): boolean {
    return Boolean(q.required) && !isQuestionAnswered(q)
  }

  const isFollowUpVisible = (q: SurveyQuestion) => isFollowUpConditionMet(q)

  function isFollowUpAnswered(q: SurveyQuestion): boolean {
    const v = followUps[q._id]
    if (v === null || v === undefined) return false
    if (typeof v === 'number') return Number.isFinite(v)
    return String(v).trim().length > 0
  }

  /** سؤال تکمیلی فقط وقتی الزامی است که نمایان باشد */
  function isFollowUpInvalid(q: SurveyQuestion): boolean {
    const fu = q.conditional_follow_up
    return Boolean(fu?.enabled && fu.required) && isFollowUpVisible(q) && !isFollowUpAnswered(q)
  }

  /** تمام کلیدهای بی‌پاسخِ یک سؤال (سؤال اصلی + سؤال تکمیلیِ نمایان) */
  function questionInvalidKeys(q: SurveyQuestion): string[] {
    const keys: string[] = []
    if (isQuestionInvalid(q)) keys.push(q._id)
    if (isFollowUpInvalid(q)) keys.push(`${q._id}__follow_up`)
    return keys
  }

  function groupErrors(g: SurveyCategoryGroup): string[] {
    return (g.questions ?? []).flatMap(questionInvalidKeys)
  }

  const currentErrors = computed(() => (currentGroup.value ? groupErrors(currentGroup.value) : []))
  const showErrors = computed(() => {
    const id = currentGroup.value?.category?.strategy_node_id
    return id ? Boolean(touchedGroups[id]) : false
  })

  function stepStatus(index: number): 'done' | 'active' | 'pending' | 'error' {
    const group = stepList.value[index]
    if (index === currentIndex.value) return 'active'
    if (index < currentIndex.value) return groupErrors(group).length ? 'error' : 'done'
    return 'pending'
  }

  function setAnswer(q: SurveyQuestion, value: AnswerValue) {
    q.selected = value
    // اگر با تغییر امتیاز، سؤال تکمیلی دیگر نمایان نیست، پاسخ قدیمی آن پاک می‌شود
    if (q._id in followUps && !isFollowUpVisible(q)) {
      delete followUps[q._id]
    }
  }

  function setFollowUp(q: SurveyQuestion, value: FollowUpAnswer) {
    followUps[q._id] = value
  }

  /* ------------------------------- شمارنده‌ها ----------------------------- */

  const answeredCount = computed(() =>
    stepList.value.reduce(
      (acc, g) =>
        acc +
        g.questions.reduce(
          (qAcc, q) =>
            qAcc +
            (isQuestionAnswered(q) ? 1 : 0) +
            (isFollowUpVisible(q) && isFollowUpAnswered(q) ? 1 : 0),
          0
        ),
      0
    )
  )

  const totalAnswerable = computed(() =>
    stepList.value.reduce(
      (acc, g) =>
        acc +
        g.questions.reduce(
          (qAcc, q) => qAcc + 1 + (isFollowUpVisible(q) ? 1 : 0),
          0
        ),
      0
    )
  )

  /* ------------------------------- ناوبری -------------------------------- */

  function next(): boolean {
    touchCurrent()
    if (currentErrors.value.length) return false
    if (!isLast.value) {
      direction.value = 'forward'
      currentIndex.value++
      scrollTop()
    }
    return true
  }

  function prev() {
    if (isFirst.value) return
    direction.value = 'backward'
    currentIndex.value--
    scrollTop()
  }

  function touchCurrent() {
    const id = currentGroup.value?.category?.strategy_node_id
    if (id) touchedGroups[id] = true
  }

  function goTo(index: number) {
    // فقط پیمایش به بخش‌های قبلی یا تکمیل‌شده مجاز است
    if (index < 0 || index >= stepList.value.length) return
    if (index > currentIndex.value) {
      for (let i = currentIndex.value; i < index; i++) {
        const id = stepList.value[i].category?.strategy_node_id
        if (id) touchedGroups[id] = true
        if (groupErrors(stepList.value[i]).length) {
          currentIndex.value = i
          scrollTop()
          return
        }
      }
    }
    direction.value = index > currentIndex.value ? 'forward' : 'backward'
    currentIndex.value = index
    scrollTop()
  }

  function validateAll(): boolean {
    let firstInvalid = -1
    stepList.value.forEach((g, i) => {
      const id = g.category?.strategy_node_id
      if (id) touchedGroups[id] = true
      if (firstInvalid === -1 && groupErrors(g).length) firstInvalid = i
    })
    if (firstInvalid !== -1) {
      direction.value = firstInvalid > currentIndex.value ? 'forward' : 'backward'
      currentIndex.value = firstInvalid
      scrollTop()
      return false
    }
    return true
  }

  function reset() {
    for (const g of stepList.value) {
      for (const q of g.questions) q.selected = null
    }
    Object.keys(followUps).forEach(k => delete followUps[k])
    Object.keys(touchedGroups).forEach(k => delete touchedGroups[k])
    currentIndex.value = 0
    direction.value = 'forward'
  }

  /** ساخت خروجی نهایی برای نگهداری محلی (بدون ارسال به سرور) */
  function buildCompletionPayload(selection: SurveySelection): SurveyCompletionPayload {
    return {
      selection: { ...selection },
      categories: stepList.value.map(g => ({
        id: g.category?.strategy_node_id ?? '',
        title: g.category?.strategy_node_title ?? '',
        questions: g.questions.map(q => ({
          _id: q._id,
          text: q.text,
          selected: (q.selected ?? null) as AnswerValue
        }))
      })),
      followUps: { ...followUps },
      completedAt: Date.now()
    }
  }

  function scrollTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return {
    displayGroups,
    stepperSteps,
    currentIndex,
    currentGroup,
    direction,
    isFirst,
    isLast,
    progress,
    totalDisplayQuestions,
    answeredCount,
    totalAnswerable,
    currentErrors,
    showErrors,
    followUps,
    isQuestionAnswered,
    isQuestionInvalid,
    isFollowUpVisible,
    isFollowUpAnswered,
    isFollowUpInvalid,
    stepStatus,
    setAnswer,
    setFollowUp,
    next,
    prev,
    goTo,
    validateAll,
    buildCompletionPayload,
    reset
  }
}
