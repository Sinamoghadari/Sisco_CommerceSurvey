import { ref } from 'vue'
import { useSurveyApi } from './useSurveyApi'
import type { SurveySelection } from './useSurveyDefinition'
import type { SurveyCompletionPayload } from './useSurveyWizard'

/**
 * ماشین حالت صفحه‌ی نظرسنجی امور بازرگانی.
 *
 * فازها:
 *  select   → فرم انتخاب گروه/نوع مشتری + راه‌های ارتباطی
 *  survey   → دریافت داینامیک پرسشنامه از API و ویزارد چندمرحله‌ای
 *  complete → صفحه‌ی تشکر
 *
 * دریافت پرسشنامه از سرویس توزیع (SurveyDistribution/Access) و مدیریت
 * وضعیت نظرسنجی هر دو در همین ماژول (و useSurveyApi) انجام می‌شود.
 * پاسخ‌های کاربر فقط در حافظه‌ی کلاینت نگهداری می‌شوند؛ endpoint ثبت
 * نظرسنجی در این فاز مشخص نیست و هیچ ارسال انجام نمی‌شود.
 */

export type SurveyPhase = 'select' | 'survey' | 'complete'

export interface SurveyCompletion {
  selection: SurveySelection
  answeredCount: number
  totalQuestions: number
  completedAt: number
}

export interface SurveySubmitPayload {
  payload: SurveyCompletionPayload
  answeredCount: number
  totalQuestions: number
}

export function useCommerceSurvey() {
  const phase = ref<SurveyPhase>('select')
  /** انتخاب جاری کاربر (گروه و نوع مشتری) – زمینه‌ی نمایشی ورود به نظرسنجی */
  const selection = ref<SurveySelection | null>(null)
  const completion = ref<SurveyCompletion | null>(null)
  /** نسخه‌ی هر اجرا؛ با تغییر آن وضعیت ویزارد از صفر ساخته می‌شود */
  const runId = ref(0)

  /** کلاینت API نظرسنجی (داده، وضعیت بارگذاری، خطا، دریافت مجدد) */
  const survey = useSurveyApi()

  /** شروع نظرسنجی: پاک‌سازی پاسخ‌های قبلی و دریافت پرسشنامه از API */
  function startSurvey(sel: SurveySelection) {
    selection.value = { group: sel.group, type: sel.type }
    runId.value++
    phase.value = 'survey'
    survey.resetAnswers()
    void survey.fetchSurvey()
  }

  /** دریافت مجدد پرسشنامه پس از خطا */
  function retryFetch() {
    void survey.fetchSurvey(true)
  }

  /** بازگشت به نمای انتخاب */
  function changeSelection() {
    phase.value = 'select'
  }

  /** پایان نظرسنجی (ذخیره‌ی محلی خروجی – بدون فراخوانی شبکه) */
  function completeSurvey(result: SurveySubmitPayload) {
    completion.value = {
      selection: { ...result.payload.selection },
      answeredCount: result.answeredCount,
      totalQuestions: result.totalQuestions,
      completedAt: result.payload.completedAt
    }
    phase.value = 'complete'
  }

  /** شروع مجدد و پاک‌سازی کامل وضعیت */
  function restart() {
    completion.value = null
    selection.value = null
    runId.value++
    phase.value = 'select'
  }

  return {
    phase,
    selection,
    completion,
    runId,
    survey,
    startSurvey,
    retryFetch,
    changeSelection,
    completeSurvey,
    restart
  }
}
