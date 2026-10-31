import { ref } from 'vue'
import type { SurveySubmitAnswers } from './useSurveyWizard'

/**
 * اتصال به سرویس ثبت پاسخ‌های نظرسنجی:
 *   POST {surveySubmitUrl}
 *   Content-Type: application/json
 *   { "token": "...", "answers": { "<question_id>": { "<question_type>": <value>, "conditional_answer"?: <value> } } }
 *
 * - آدرس سرویس از runtimeConfig.public.surveySubmitUrl خوانده می‌شود
 *   (پیش‌فرض: https://portal.sirjansteel.com/api/SurveyDistribution/Submit).
 * - توکن از route.query.token خوانده می‌شود و در نبود آن، مقدار پیش‌فرض
 *   SURVEY_TOKEN_FALLBACK استفاده می‌گردد.
 * - پاسخ موفق: هر پاسخ 2xx (و در صورت وجود فیلد result، مقدار OK).
 */

/** آدرس پیش‌فرض ثبت پاسخ‌ها */
export const DEFAULT_SURVEY_SUBMIT_URL = 'https://portal.sirjansteel.com/api/SurveyDistribution/Submit'

/**
 * توکن پیش‌فرض (قابل استفاده تا زمانی که توکن واقعی از مسیر ورود توزیع شود).
 * در صورت وجود ?token= در آدرس صفحه، همان مقدار اولویت دارد.
 */
export const SURVEY_TOKEN_FALLBACK = '3ef23fdeecad664aeedcb961a4561269988da62d1c6a12ce0951a7afc0bb8ede'

export interface SurveySubmitOptions {
  /** سریالایز پاسخ‌های ویزارد به ساختار answers سرویس */
  buildAnswers: () => SurveySubmitAnswers
  /** تعداد پاسخ‌های ثبت‌شده (برای نمایش خلاصه) */
  answeredCount: () => number
  /** تعداد کل پاسخ‌های مورد انتظار */
  totalQuestions: () => number
}

/** توکن را از کوئری می‌خواند؛ در نبود آن مقدار پیش‌فرض بازگردانده می‌شود */
function resolveToken(): string {
  try {
    const route = useRoute()
    const raw = route?.query?.token ?? null
    const first = Array.isArray(raw) ? raw[0] : raw
    if (first && String(first).trim().length > 0) {
      return String(first).trim()
    }
  } catch {
    /* useRoute خارج از context Nuxt در دسترس نیست */
  }
  return SURVEY_TOKEN_FALLBACK
}

/** آدرس سرویس ثبت (با امکان بازنویسی از runtimeConfig) */
function resolveSubmitUrl(): string {
  try {
    const config = useRuntimeConfig()
    const override = config?.public?.surveySubmitUrl as string | undefined
    if (override && override.trim().length > 0) return override.trim()
  } catch {
    /* useRuntimeConfig خارج از context Nuxt در دسترس نیست */
  }
  return DEFAULT_SURVEY_SUBMIT_URL
}

/** پیام خطای فارسی بر اساس خطای $fetch */
function toPersianError(err: unknown): string {
  const e = err as { data?: { message?: unknown; error?: unknown }; statusCode?: number }
  const apiMessage = e?.data?.message ?? e?.data?.error
  if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
    return apiMessage.trim()
  }
  if (e?.statusCode && e.statusCode >= 500) {
    return 'خطای سرور در ثبت پاسخ‌ها رخ داد. لطفاً چند لحظه بعد دوباره تلاش کنید.'
  }
  return 'ثبت پاسخ‌ها با خطا مواجه شد. لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید.'
}

/**
 * وضعیت ارسال نظرسنجی + متد submitSurvey
 * (اعتبارسنجی فیلدهای الزامی پیش از فراخوانی این تابع، در لایه‌ی UI
 * با validateAll انجام می‌شود تا اسکرول به اولین سؤال بی‌پاسخ فعال گردد.)
 */
export function useSurveySubmit(options: SurveySubmitOptions) {
  /** در حال انجام درخواست ثبت */
  const isSubmitting = ref(false)
  /** پیام خطای فارسی (در صورت شکست) */
  const submitError = ref<string | null>(null)
  /** ثبت با موفقیت انجام شده است */
  const isSubmitted = ref(false)

  /**
   * ارسال پاسخ‌ها به سرویس Submit.
   * true → موفق؛ false → ناموفق (جزئیات در submitError).
   * از ارسال تکراری همزمان یا دوباره پس از موفقیت جلوگیری می‌کند.
   */
  async function submitSurvey(): Promise<boolean> {
    if (isSubmitting.value || isSubmitted.value) return false
    submitError.value = null
    isSubmitting.value = true
    try {
      const token = resolveToken()
      const answers = options.buildAnswers()
      const response = await $fetch<Record<string, unknown>>(resolveSubmitUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { token, answers }
      })
      // اگر بدنه فیلد result داشت باید OK باشد؛ در غیر این صورت هر 2xx موفق است
      if (response && typeof response === 'object' && 'result' in response) {
        const result = String((response as Record<string, unknown>).result ?? '').toUpperCase()
        if (result && result !== 'OK') {
          submitError.value = toPersianError(response)
          return false
        }
      }
      isSubmitted.value = true
      return true
    } catch (err) {
      submitError.value = toPersianError(err)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  /** بازنشانی وضعیت خطا/موفقیت (مثلاً پس از شروع مجدد نظرسنجی) */
  function resetSubmit() {
    submitError.value = null
    isSubmitted.value = false
  }

  return { isSubmitting, submitError, isSubmitted, submitSurvey, resetSubmit }
}
