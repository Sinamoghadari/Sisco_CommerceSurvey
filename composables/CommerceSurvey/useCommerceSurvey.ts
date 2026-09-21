import { computed, ref } from 'vue'
import type { AnswerValue, SurveyAnswers } from './useSurveyWizard'
import type { CustomerGroup, CustomerType, SurveySelection } from './useSurveyDefinition'

/**
 * ماشین حالت سمت کلاینت برای صفحه‌ی نظرسنجی امور بازرگانی.
 *
 * فازها:
 *  select   → فرم انتخاب گروه/نوع مشتری + جدول‌های مدیریت لینک نظرسنجی
 *  survey   → ویزارد چندمرحله‌ای پرسشنامه (بر اساس محصول فعال)
 *  complete → صفحه‌ی تشکر
 *
 * تمام وضعیت صرفاً محلی و reactive است؛ هیچ فراخوانی شبکه‌ای انجام نمی‌شود
 * و منطق اعتبارسنجی پاسخ‌ها در useSurveyWizard نگهداری می‌شود.
 */

export type SurveyPhase = 'select' | 'survey' | 'complete'

export interface SurveyCompletion {
  selection: SurveySelection
  answers: SurveyAnswers
  completedAt: number
}

export function useCommerceSurvey() {
  const phase = ref<SurveyPhase>('select')
  /** انتخاب جاری کاربر (گروه و نوع مشتری) */
  const selection = ref<SurveySelection | null>(null)
  /** نتیجه‌ی نهایی نظرسنجی پس از ثبت */
  const completion = ref<SurveyCompletion | null>(null)
  /** نسخه‌ی هر اجرای ویزارد؛ با تغییر آن، وضعیت ویزارد از صفر ساخته می‌شود */
  const runId = ref(0)

  const overallScore = computed<number | null>(() => {
    const v = completion.value?.answers?.o_score
    return typeof v === 'number' ? v : null
  })

  /** شروع نظرسنجی از فرم انتخاب (گروه + نوع) */
  function startSurvey(sel: SurveySelection) {
    selection.value = { group: sel.group, type: sel.type }
    runId.value++
    phase.value = 'survey'
  }

  /** شروع مستقیم نظرسنجی از لینک‌های جدول مدیریت (اکشن «لینک شمش/گندله») */
  function openSurveyFor(group: CustomerGroup, type: CustomerType) {
    startSurvey({ group, type })
  }

  /** بازگشت به نمای انتخاب */
  function changeSelection() {
    phase.value = 'select'
  }

  /** ثبت نهایی پاسخ‌ها (فقط ذخیره‌ی محلی – بدون ارسال به سرور) */
  function completeSurvey(payload: { selection: SurveySelection; answers: SurveyAnswers }) {
    completion.value = {
      selection: { ...payload.selection },
      answers: payload.answers as Record<string, AnswerValue>,
      completedAt: Date.now()
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
    overallScore,
    startSurvey,
    openSurveyFor,
    changeSelection,
    completeSurvey,
    restart
  }
}
