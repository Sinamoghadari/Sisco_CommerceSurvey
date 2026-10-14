import { computed, reactive, ref, watch } from 'vue'
import type { QuestionCategory, SurveyCategoryGroup, SurveyQuestion } from './useSurveyApi'
import type { SurveySelection } from './useSurveyDefinition'

export type AnswerValue = number | string | string[] | null

/** شناسه و عنوان بخش جمع‌بندی (سؤال‌های عمومی خارج از گره‌های استراتژیک) */
export const GENERAL_STEP_ID = 'general-summary'
export const GENERAL_STEP_TITLE = 'نظرات و جمع‌بندی'

/** یک بخش نمایشی ویزارد (استراتژیک یا جمع‌بندی) */
export interface DisplayGroup {
  id: string
  title: string
  isGeneral: boolean
  questions: SurveyQuestion[]
}

/** خروجی نهایی نظرسنجی (فقط در حافظه‌ی کلاینت نگهداری می‌شود) */
export interface SurveyCompletionPayload {
  selection: SurveySelection
  categories: Array<{
    id: string
    title: string
    isGeneral: boolean
    questions: Array<{ _id: string; text: string; selected: AnswerValue }>
  }>
  followUps: Record<string, AnswerValue>
  optionTexts: Record<string, string>
  completedAt: number
}

/**
 * ارزیابی شرط نمایش سؤال تکمیلی بر اساس امتیاز انتخاب‌شده.
 * عملگرهای استاندارد عددی: less_than (<) ، greater_than (>) ، equal (==)
 * و حالت‌های <= و >= نیز پشتیبانی می‌شوند.
 */
export function isFollowUpConditionMet(
  q: Pick<SurveyQuestion, 'conditional_follow_up'> & { selected?: AnswerValue }
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

/** آیا این دسته، یک گره‌ی استراتژیک واقعی است (واجد شرایط دایره‌ی استپر)؟ */
export function isStrategyCategory(cat?: QuestionCategory): boolean {
  return Boolean(
    cat &&
      cat.is_general !== true &&
      cat.strategy_node_id !== null &&
      cat.strategy_node_id !== undefined &&
      cat.strategy_node_id !== ''
  )
}

/** کلید نگه‌داری توضیح متنی گزینه‌ها: `{questionId}:{value}` یا `{questionId}__fu:{value}` */
export const optionTextKey = (questionId: string, value: string, followUp = false) =>
  `${questionId}${followUp ? '__fu' : ''}:${value}`

/**
 * موتور وضعیت ویزارد پرسشنامه‌ی داینامیک.
 *
 * معماری وضعیت (نگاشت بر اساس question._id):
 *  - answers:     پاسخ سؤال‌های اصلی
 *  - followUps:   پاسخ سؤال‌های تکمیلی شرطی (کلید: _id سؤال اصلی)
 *  - optionTexts: توضیح متنی گزینه‌های دارای need_text
 *
 * تقسیم‌بندی بخش‌ها:
 *  - فقط دسته‌های استراتژیک (is_general === false و strategy_node_id !== null)
 *    به‌صورت دایره‌های شماره‌دار استپر ظاهر می‌شوند.
 *  - سؤال‌های type === 'range_rating' و تمام محتوای دسته‌های عمومی، در
 *    بخش پایانی «نظرات و جمع‌بندی» (آخرین صفحه‌ی ویزارد) تجمیع می‌شوند.
 */
export function useSurveyWizard(groups: () => SurveyCategoryGroup[]) {
  const currentIndex = ref(0)
  /**
   * سقف دسترسی خطی (Strict Linear Stepper):
   * کاربر فقط می‌تواند به بخش‌هایی برود که به‌ترتیب به آن‌ها رسیده است.
   * این مقدار فقط با پیشروی موفق (عبور از اعتبارسنجی بخش فعلی) افزایش می‌یابد
   * و پرش به جلو بدون تکمیل مراحل میانی را ممنوع می‌کند.
   */
  const maxReachedIndex = ref(0)
  const direction = ref<'forward' | 'backward'>('forward')
  const touchedGroups = reactive<Record<string, boolean>>({})

  /** پاسخ سؤال‌های اصلی – نگاشت بر اساس question._id */
  const answers = reactive<Record<string, AnswerValue>>({})
  /** پاسخ سؤال‌های تکمیلی شرطی – کلید: _id سؤال اصلی */
  const followUps = reactive<Record<string, AnswerValue>>({})
  /** توضیح متنی گزینه‌های دارای need_text */
  const optionTexts = reactive<Record<string, string>>({})

  /* ------------------------- آماده‌سازی داده‌ی API ------------------------ */

  const cleanedGroups = computed<SurveyCategoryGroup[]>(() =>
    (groups() ?? []).map(g => ({
      category: g.category,
      questions: (g.questions ?? [])
        .filter(q => q.status !== false && q.delete !== true)
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }))
  )

  /**
   * بخش‌های نمایشی:
   * - دسته‌های استراتژیک با سؤال‌های غیر range_rating
   * - سؤال‌های range_rating + محتوای دسته‌های عمومی → بخش پایانی جمع‌بندی
   */
  const displayGroups = computed<DisplayGroup[]>(() => {
    const strategy: DisplayGroup[] = []
    const generalQuestions: SurveyQuestion[] = []

    for (const g of cleanedGroups.value) {
      if (isStrategyCategory(g.category)) {
        generalQuestions.push(...g.questions.filter(q => q.type === 'range_rating'))
        const qs = g.questions.filter(q => q.type !== 'range_rating')
        if (qs.length) {
          strategy.push({
            id: String(g.category!.strategy_node_id),
            title: g.category!.strategy_node_title || 'بخش استراتژیک',
            isGeneral: false,
            questions: qs
          })
        }
      } else {
        generalQuestions.push(...g.questions)
      }
    }

    const out: DisplayGroup[] = [...strategy]
    if (generalQuestions.length) {
      out.push({ id: GENERAL_STEP_ID, title: GENERAL_STEP_TITLE, isGeneral: true, questions: generalQuestions })
    }
    return out
  })

  /** دایره‌های شماره‌دار استپر – فقط گره‌های استراتژیک */
  const strategySteps = computed(() =>
    displayGroups.value.filter(g => !g.isGeneral).map(g => ({ id: g.id, title: g.title }))
  )

  /** بخش پایانی (جمع‌بندی) – خارج از دایره‌های استراتژیک، آخرین صفحه‌ی ویزارد */
  const finalStep = computed<{ id: string; title: string } | null>(() => {
    const g = displayGroups.value.find(x => x.isGeneral)
    return g ? { id: g.id, title: g.title } : null
  })

  const stepList = displayGroups
  const currentGroup = computed(() => stepList.value[currentIndex.value])
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === stepList.value.length - 1)
  const progress = computed(() =>
    stepList.value.length ? Math.round(((currentIndex.value + 1) / stepList.value.length) * 100) : 0
  )

  const totalDisplayQuestions = computed(() =>
    stepList.value.reduce((acc, g) => acc + g.questions.length, 0)
  )

  // با جایگزینی داده (refetch) وضعیت ویزارد از صفر ساخته می‌شود
  watch(
    () => stepList.value.map(g => g.id).join('|'),
    () => reset()
  )

  /* ------------------------------ وضعیت پاسخ‌ها --------------------------- */

  function getAnswer(q: SurveyQuestion): AnswerValue {
    return answers[q._id] ?? null
  }

  function isQuestionAnswered(q: SurveyQuestion): boolean {
    const v = getAnswer(q)
    if (v === null || v === undefined) return false
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'string') return v.trim().length > 0
    return typeof v === 'number' && Number.isFinite(v)
  }

  function isQuestionInvalid(q: SurveyQuestion): boolean {
    return Boolean(q.required) && !isQuestionAnswered(q)
  }

  const isFollowUpVisible = (q: SurveyQuestion) => isFollowUpConditionMet({ ...q, selected: getAnswer(q) })

  function getFollowUp(q: SurveyQuestion): AnswerValue {
    return followUps[q._id] ?? null
  }

  function isFollowUpAnswered(q: SurveyQuestion): boolean {
    return isValueAnswered(followUps[q._id] ?? null)
  }

  function isValueAnswered(v: AnswerValue): boolean {
    if (v === null || v === undefined) return false
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'string') return v.trim().length > 0
    return typeof v === 'number' && Number.isFinite(v)
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

  function groupErrors(g: DisplayGroup): string[] {
    return g.questions.flatMap(questionInvalidKeys)
  }

  const currentErrors = computed(() => (currentGroup.value ? groupErrors(currentGroup.value) : []))
  const showErrors = computed(() => {
    const id = currentGroup.value?.id
    return id ? Boolean(touchedGroups[id]) : false
  })

  /**
   * شناسه‌ی اولین سؤال بی‌پاسخِ الزامیِ بخش جاری (برای اسکرول خودکار).
   * کلیدهای سؤال تکمیلی پسوند __follow_up دارند که در اینجا حذف می‌شود.
   */
  const firstInvalidQuestionId = computed<string | null>(() => {
    const first = currentErrors.value[0]
    if (!first) return null
    return first.replace('__follow_up', '')
  })

  function stepStatus(index: number): 'done' | 'active' | 'pending' | 'error' {
    const group = stepList.value[index]
    if (!group) return 'pending'
    if (index === currentIndex.value) return 'active'
    if (index < currentIndex.value) return groupErrors(group).length ? 'error' : 'done'
    return 'pending'
  }

  /* ------------------------------ موتاتورها ------------------------------- */

  function setAnswer(q: SurveyQuestion, value: AnswerValue) {
    answers[q._id] = value
    // اگر با تغییر امتیاز، سؤال تکمیلی دیگر نمایان نیست، پاسخ قدیمی آن پاک می‌شود
    if (q._id in followUps && !isFollowUpVisible(q)) {
      delete followUps[q._id]
    }
  }

  function setFollowUp(q: SurveyQuestion, value: AnswerValue) {
    followUps[q._id] = value
  }

  function setOptionText(key: string, text: string) {
    optionTexts[key] = text
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
      (acc, g) => acc + g.questions.reduce((qAcc, q) => qAcc + 1 + (isFollowUpVisible(q) ? 1 : 0), 0),
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
      // پیشروی خطی: سقف دسترسی فقط با عبور موفق از اعتبارسنجی بالا می‌رود
      if (currentIndex.value > maxReachedIndex.value) {
        maxReachedIndex.value = currentIndex.value
      }
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
    const id = currentGroup.value?.id
    if (id) touchedGroups[id] = true
  }

  function goTo(index: number) {
    if (index < 0 || index >= stepList.value.length) return
    // Strict Linear Stepper: پرش به جلو ممنوع است
    if (index <= currentIndex.value) {
      // حرکت به عقب به بخش‌های دیده‌شده همیشه مجاز است
      direction.value = 'backward'
      currentIndex.value = index
      scrollTop()
      return
    }
    if (index === currentIndex.value + 1) {
      // یک گام جلو: فقط با عبور از اعتبارسنجی بخش فعلی (همان رفتار «بخش بعد»)
      next()
      return
    }
    // index > currentIndex + 1 → پرش روی دایره‌های نرسیده مجاز نیست
  }

  function validateAll(): boolean {
    let firstInvalid = -1
    stepList.value.forEach((g, i) => {
      touchedGroups[g.id] = true
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
    Object.keys(answers).forEach(k => delete answers[k])
    Object.keys(followUps).forEach(k => delete followUps[k])
    Object.keys(optionTexts).forEach(k => delete optionTexts[k])
    Object.keys(touchedGroups).forEach(k => delete touchedGroups[k])
    currentIndex.value = 0
    maxReachedIndex.value = 0
    direction.value = 'forward'
  }

  /** ساخت خروجی نهایی برای نگهداری محلی (بدون ارسال به سرور) */
  function buildCompletionPayload(selection: SurveySelection): SurveyCompletionPayload {
    return {
      selection: { ...selection },
      categories: stepList.value.map(g => ({
        id: g.id,
        title: g.title,
        isGeneral: g.isGeneral,
        questions: g.questions.map(q => ({
          _id: q._id,
          text: q.text,
          selected: getAnswer(q)
        }))
      })),
      followUps: { ...followUps },
      optionTexts: { ...optionTexts },
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
    strategySteps,
    finalStep,
    currentIndex,
    maxReachedIndex,
    currentGroup,
    direction,
    isFirst,
    isLast,
    progress,
    totalDisplayQuestions,
    answers,
    followUps,
    optionTexts,
    answeredCount,
    totalAnswerable,
    currentErrors,
    showErrors,
    firstInvalidQuestionId,
    getAnswer,
    getFollowUp,
    isQuestionAnswered,
    isQuestionInvalid,
    isFollowUpVisible,
    isFollowUpAnswered,
    isFollowUpInvalid,
    stepStatus,
    setAnswer,
    setFollowUp,
    setOptionText,
    next,
    prev,
    goTo,
    validateAll,
    buildCompletionPayload,
    reset
  }
}
