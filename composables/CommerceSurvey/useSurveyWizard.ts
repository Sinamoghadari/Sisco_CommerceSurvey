import { computed, reactive, ref, watch } from 'vue'
import type { SurveyQuestion, SurveyStep, SurveySubQuestion } from './useSurveyDefinition'

export type AnswerValue = number | string | string[] | null

export interface SurveyAnswers {
  [questionId: string]: AnswerValue
}

/**
 * مدیریت وضعیت ویزارد نظرسنجی: پاسخ‌ها، استپ فعلی، اعتبارسنجی و ناوبری.
 *
 * سؤال‌های تکمیلی (شرطی):
 * - فقط وقتی «نمایان» هستند که پاسخ سؤال اصلی عددی <= آستانه‌ی سؤال تکمیلی باشد.
 * - اعتبارسنجی فقط روی سؤال‌های نمایان اعمال می‌شود.
 * - با تغییر امتیاز سؤال اصلی به بالاتر از آستانه، پاسخِ ذخیره‌شده‌ی
 *   سؤال تکمیلی به‌طور خودکار پاک می‌شود (مدیریت وضعیت تمیز).
 *
 * کاملاً سمت کلاینت و بدون هیچ‌گونه فراخوانی API.
 */
export function useSurveyWizard(steps: () => SurveyStep[]) {
  const currentIndex = ref(0)
  const answers = reactive<SurveyAnswers>({})
  const touchedSteps = reactive<Record<string, boolean>>({})
  const direction = ref<'forward' | 'backward'>('forward')

  const stepList = computed(() => steps())
  const currentStep = computed(() => stepList.value[currentIndex.value])
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === stepList.value.length - 1)
  const progress = computed(() =>
    stepList.value.length ? Math.round(((currentIndex.value + 1) / stepList.value.length) * 100) : 0
  )

  // نگاشت شناسه‌ی سؤال به تعریف آن (برای دسترسی سریع به سؤال‌های تکمیلی)
  const questionIndex = computed<Record<string, SurveyQuestion>>(() => {
    const map: Record<string, SurveyQuestion> = {}
    for (const step of stepList.value) {
      for (const q of step.questions) map[q.id] = q
    }
    return map
  })

  // اگر ساختار استپ‌ها تغییر کند (مثلاً تغییر محصول) پاسخ‌ها ریست می‌شوند
  watch(
    () => stepList.value.map(s => s.id).join('|'),
    () => reset()
  )

  function isAnswered(q: Pick<SurveyQuestion, 'id'>): boolean {
    const v = answers[q.id]
    if (v === null || v === undefined) return false
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'string') return v.trim().length > 0
    return true
  }

  /** آیا سؤال تکمیلیِ مشخص‌شده باید نمایش داده شود؟ (امتیاز والد <= آستانه) */
  function isSubQuestionVisible(q: SurveyQuestion, sub: SurveySubQuestion): boolean {
    const v = answers[q.id]
    return typeof v === 'number' && v <= sub.showWhenScoreAtMost
  }

  function isSubAnswered(q: SurveyQuestion, sub: SurveySubQuestion): boolean {
    return isAnswered({ id: sub.id })
  }

  /** آیا خودِ سؤال اصلی بی‌پاسخ است؟ */
  function isQuestionInvalid(q: SurveyQuestion): boolean {
    return Boolean(q.required) && !isAnswered(q)
  }

  /** سؤال تکمیلی فقط وقتی الزامی است که نمایان باشد */
  function isSubInvalid(q: SurveyQuestion, sub: SurveySubQuestion): boolean {
    return Boolean(sub.required) && isSubQuestionVisible(q, sub) && !isSubAnswered(q, sub)
  }

  /** تمام کلیدهای بی‌پاسخِ یک سؤال (سؤال اصلی + سؤال‌های تکمیلی نمایان) */
  function questionInvalidKeys(q: SurveyQuestion): string[] {
    const keys: string[] = []
    if (isQuestionInvalid(q)) keys.push(q.id)
    for (const sub of q.subQuestions ?? []) {
      if (isSubInvalid(q, sub)) keys.push(sub.id)
    }
    return keys
  }

  function stepErrors(step: SurveyStep): string[] {
    return step.questions.flatMap(questionInvalidKeys)
  }

  const currentErrors = computed(() => stepErrors(currentStep.value))
  const showErrors = computed(() => Boolean(touchedSteps[currentStep.value?.id]))

  function stepStatus(index: number): 'done' | 'active' | 'pending' | 'error' {
    const step = stepList.value[index]
    if (index === currentIndex.value) return 'active'
    if (index < currentIndex.value) return stepErrors(step).length ? 'error' : 'done'
    return 'pending'
  }

  function setAnswer(id: string, value: AnswerValue) {
    answers[id] = value

    // پاک‌سازی پاسخ سؤال‌های تکمیلیِ شرطی که با تغییر امتیاز والد نمایان نیستند
    const parent = questionIndex.value[id]
    if (parent?.subQuestions?.length) {
      for (const sub of parent.subQuestions) {
        if (sub.id in answers && !isSubQuestionVisible(parent, sub)) {
          delete answers[sub.id]
        }
      }
    }
  }

  function next(): boolean {
    touchedSteps[currentStep.value.id] = true
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

  function goTo(index: number) {
    // فقط پیمایش به استپ‌های قبلی یا استپ‌های تکمیل‌شده مجاز است
    if (index < 0 || index >= stepList.value.length) return
    if (index > currentIndex.value) {
      for (let i = currentIndex.value; i < index; i++) {
        touchedSteps[stepList.value[i].id] = true
        if (stepErrors(stepList.value[i]).length) {
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
    stepList.value.forEach((s, i) => {
      touchedSteps[s.id] = true
      if (firstInvalid === -1 && stepErrors(s).length) firstInvalid = i
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
    Object.keys(touchedSteps).forEach(k => delete touchedSteps[k])
    currentIndex.value = 0
    direction.value = 'forward'
  }

  function scrollTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return {
    steps: stepList,
    currentIndex,
    currentStep,
    answers,
    direction,
    isFirst,
    isLast,
    progress,
    currentErrors,
    showErrors,
    isAnswered,
    isSubQuestionVisible,
    isSubAnswered,
    isSubInvalid,
    isQuestionInvalid,
    questionInvalidKeys,
    stepStatus,
    setAnswer,
    next,
    prev,
    goTo,
    validateAll,
    reset
  }
}
