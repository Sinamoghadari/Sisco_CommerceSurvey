import { computed, reactive, ref, watch } from 'vue'
import { followUpKey, type SurveyFollowUp, type SurveyQuestion, type SurveyStep } from './useSurveyDefinition'

export type AnswerValue = number | string | string[] | null

export interface SurveyAnswers {
  [questionId: string]: AnswerValue
}

/**
 * مدیریت وضعیت ویزارد نظرسنجی: پاسخ‌ها، استپ فعلی، اعتبارسنجی و ناوبری.
 * اعتبارسنجی شامل سؤال‌های پیگیر (Follow-up) نیز می‌شود.
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

  // اگر ساختار استپ‌ها تغییر کند (مثلاً تغییر محصول) پاسخ‌ها ریست می‌شوند
  watch(
    () => stepList.value.map(s => s.id).join('|'),
    () => reset()
  )

  function isAnswered(q: SurveyQuestion): boolean {
    const v = answers[q.id]
    if (v === null || v === undefined) return false
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'string') return v.trim().length > 0
    return true
  }

  function isFollowUpAnswered(q: SurveyQuestion, fu: SurveyFollowUp): boolean {
    return isAnswered({ ...q, id: followUpKey(q.id, fu.id) })
  }

  /** آیا خودِ سؤال اصلی (نه پیگیرهایش) بی‌پاسخ است؟ */
  function isQuestionInvalid(q: SurveyQuestion): boolean {
    return Boolean(q.required) && !isAnswered(q)
  }

  /** آیا سؤال پیگیرِ مشخص‌شده بی‌پاسخ است؟ */
  function isFollowUpInvalid(q: SurveyQuestion, fu: SurveyFollowUp): boolean {
    return Boolean(fu.required) && !isFollowUpAnswered(q, fu)
  }

  /** تمام کلیدهای بی‌پاسخِ یک سؤال (سؤال اصلی + پیگیرها) */
  function questionInvalidKeys(q: SurveyQuestion): string[] {
    const keys: string[] = []
    if (isQuestionInvalid(q)) keys.push(q.id)
    for (const fu of q.followUps ?? []) {
      if (isFollowUpInvalid(q, fu)) keys.push(followUpKey(q.id, fu.id))
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
    isFollowUpAnswered,
    isQuestionInvalid,
    isFollowUpInvalid,
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
