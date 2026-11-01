import { ref } from 'vue'
import type { SurveySubmitAnswers } from './useSurveyWizard'

/**
 * اتصال به سرویس ثبت پاسخ‌های نظرسنجی:
 *   POST {surveySubmitUrl}
 *   Content-Type: application/json
 *   { "token": "...", "answers": { ... } }
 *
 * فاز تست: در هر تلاش ثبت، یکی از توکن‌های آزمایشی به‌صورت تصادفی انتخاب و
 * به‌صورت مقدار خام در body.token ارسال می‌شود (انتخاب در لحظه‌ی Submit،
 * نه یک‌بار در ابتدای صفحه؛ بدون ترتیب round-robin و بدون منبع توکن دیگر).
 *
 * - آدرس سرویس از runtimeConfig.public.surveySubmitUrl خوانده می‌شود
 *   (پیش‌فرض: https://portal.sirjansteel.com/api/SurveyDistribution/Submit).
 * - پاسخ موفق: هر پاسخ 2xx (و در صورت وجود فیلد result، مقدار OK).
 * - msg_description سرور به‌صورت داینامیک در serverMessage نگه داشته می‌شود.
 */

/** آدرس پیش‌فرض ثبت پاسخ‌ها */
export const DEFAULT_SURVEY_SUBMIT_URL = 'https://portal.sirjansteel.com/api/SurveyDistribution/Submit'

/**
 * پیام پیش‌فرض موفقیت – فقط وقتی استفاده می‌شود که سرور msg_description
 * نداده باشد (undefined/null). پیام واقعی سرور همیشه عیناً نمایش داده می‌شود.
 */
export const SURVEY_FALLBACK_SUCCESS_MESSAGE = 'پاسخ شما با موفقیت ثبت شد.'

/**
 * توکن‌های آزمایشی فاز تست – در هر تلاش ثبت، یکی به‌صورت تصادفی انتخاب می‌شود.
 */
export const TEST_TOKENS = [
  '0cfb2529ef87511f2b314dbf7640b66a5ecba69e82bd7a55e21ef6f0dfe98420',
  '6a82d3cab153bd6a6cea95db807301f3053b850bf77030d1a4ca6bd92087162e',
  '705479d831d147a19eab91fbfc73a9d26e645e4eee326f88d2057d87684f433d'
]

/** انتخاب تصادفی توکن در هر تلاش ثبت (بدون round-robin) */
export function pickRandomTestToken(): string {
  return TEST_TOKENS[Math.floor(Math.random() * TEST_TOKENS.length)]!
}

export interface SurveySubmitOptions {
  /** سریالایز پاسخ‌های ویزارد به ساختار answers سرویس */
  buildAnswers: () => SurveySubmitAnswers
  /** تعداد پاسخ‌های ثبت‌شده (برای نمایش خلاصه) */
  answeredCount: () => number
  /** تعداد کل پاسخ‌های مورد انتظار */
  totalQuestions: () => number
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
      // توکن آزمایشی در هر تلاش تصادفی انتخاب می‌شود
      const token = pickRandomTestToken()
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
