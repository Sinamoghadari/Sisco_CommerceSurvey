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
 * پیام پیش‌فرض موفقیت – فقط وقتی استفاده می‌شود که سرور msg_description
 * نداده باشد (undefined/null). پیام واقعی سرور همیشه عیناً نمایش داده می‌شود.
 */
export const SURVEY_FALLBACK_SUCCESS_MESSAGE = 'پاسخ شما با موفقیت ثبت شد.'

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

/**
 * پیام خطای فارسی بر اساس خطای $fetch.
 * اولویت: msg_description سرور (هشدار/خطای اختصاصی بک‌اند) → message → error
 * → پیام عمومی بر اساس کد وضعیت.
 */
function toPersianError(err: unknown): string {
  const e = err as { data?: { msg_description?: unknown; message?: unknown; error?: unknown }; statusCode?: number }
  const serverDescription = e?.data?.msg_description
  if (typeof serverDescription === 'string' && serverDescription.trim().length > 0) {
    return serverDescription.trim()
  }
  const apiMessage = e?.data?.message ?? e?.data?.error
  if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
    return apiMessage.trim()
  }
  if (e?.statusCode && e.statusCode >= 500) {
    return 'خطای سرور در ثبت پاسخ‌ها رخ داد. لطفاً چند لحظه بعد دوباره تلاش کنید.'
  }
  return 'ثبت پاسخ‌ها با خطا مواجه شد. لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید.'
}

/** استخراج msg_description از بدنه‌ی پاسخ (در صورت وجود رشته‌ی غیرخالی) */
function extractServerMessage(body: unknown): string | null {
  if (body && typeof body === 'object' && 'msg_description' in body) {
    const msg = (body as Record<string, unknown>).msg_description
    if (typeof msg === 'string' && msg.trim().length > 0) return msg.trim()
  }
  return null
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
   * پیام دقیق سرور (msg_description) – بدون hardcode؛ در صورت undefined/null
   * بودن، UI از SURVEY_FALLBACK_SUCCESS_MESSAGE استفاده می‌کند.
   */
  const serverMessage = ref<string | null>(null)
  /** شناسه‌ی پاسخ ثبت‌شده از سرویس (response_id) */
  const responseId = ref<string | null>(null)

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
          // پیام اختصاصی سرور (مثلاً هشدار پاسخ تکراری) عیناً نمایش داده می‌شود
          submitError.value = extractServerMessage(response) ?? toPersianError(response)
          return false
        }
      }
      // بازخورد داینامیک سرور: msg_description و response_id (در صورت وجود)
      serverMessage.value = extractServerMessage(response)
      const rid = response && typeof response === 'object' ? (response as Record<string, unknown>).response_id : null
      responseId.value = rid !== null && rid !== undefined ? String(rid) : null
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
    serverMessage.value = null
    responseId.value = null
  }

  return { isSubmitting, submitError, isSubmitted, serverMessage, responseId, submitSurvey, resetSubmit }
}
