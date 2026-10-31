import { ref } from 'vue'

/**
 * اتصال به سرویس گزارش نظرسنجی راهبردی:
 *   POST {surveyReportUrl}
 *   Content-Type: application/json
 *   { "distribution_id": "..." }
 *
 * - آدرس سرویس از runtimeConfig.public.surveyReportUrl خوانده می‌شود
 *   (پیش‌فرض: https://portal.sirjansteel.com/api/SurveyDistribution/GetStrategySurveyReport).
 * - distribution_id از route.query.distribution_id خوانده می‌شود و در نبود آن
 *   مقدار پیش‌فرض SURVEY_DISTRIBUTION_ID_FALLBACK استفاده می‌گردد
 *   (آماده‌ی پذیرش مقادیر داینامیک از route params یا state در مراحل بعد).
 * - پاسخ خام سرویس بدون تغییر در reportData نگهداری می‌شود (برای JSON Inspector).
 */

/** آدرس پیش‌فرض گزارش نظرسنجی راهبردی */
export const DEFAULT_SURVEY_REPORT_URL = 'https://portal.sirjansteel.com/api/SurveyDistribution/GetStrategySurveyReport'

/**
 * مقدار پیش‌فرض distribution_id (تا زمانی که شناسه‌ی توزیع واقعی از
 * مسیر ورود توزیع شود). در صورت وجود ?distribution_id= در آدرس صفحه،
 * همان مقدار اولویت دارد.
 */
export const SURVEY_DISTRIBUTION_ID_FALLBACK = '3ef23fdeecad664aeedcb961a4561269988da62d1c6a12ce0951a7afc0bb8ede'

/** خواندن distribution_id از کوئری؛ در نبود آن مقدار پیش‌فرض */
function resolveDistributionId(): string {
  try {
    const route = useRoute()
    const raw = route?.query?.distribution_id ?? null
    const first = Array.isArray(raw) ? raw[0] : raw
    if (first && String(first).trim().length > 0) {
      return String(first).trim()
    }
  } catch {
    /* useRoute خارج از context Nuxt در دسترس نیست */
  }
  return SURVEY_DISTRIBUTION_ID_FALLBACK
}

/** آدرس سرویس گزارش (با امکان بازنویسی از runtimeConfig) */
function resolveReportUrl(): string {
  try {
    const config = useRuntimeConfig()
    const override = config?.public?.surveyReportUrl as string | undefined
    if (override && override.trim().length > 0) return override.trim()
  } catch {
    /* useRuntimeConfig خارج از context Nuxt در دسترس نیست */
  }
  return DEFAULT_SURVEY_REPORT_URL
}

/** پیام خطای فارسی بر اساس خطای $fetch */
function toReportError(err: unknown): string {
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
    return 'خطای سرور در دریافت گزارش رخ داد. لطفاً چند لحظه بعد دوباره تلاش کنید.'
  }
  return 'دریافت گزارش با خطا مواجه شد. لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید.'
}

/**
 * وضعیت دریافت گزارش نظرسنجی راهبردی + متد fetchStrategySurveyReport.
 * پاسخ خام سرور عیناً در reportData نگهداری می‌شود.
 */
export function useStrategySurveyReport() {
  /** در حال دریافت گزارش */
  const isReportLoading = ref(false)
  /** پیام خطای فارسی (در صورت شکست) */
  const reportError = ref<string | null>(null)
  /** داده‌ی خام گزارش (بدون تغییر – برای نمایش/کپی JSON) */
  const reportData = ref<unknown>(null)

  /** دریافت گزارش از سرویس؛ true → موفق */
  async function fetchStrategySurveyReport(): Promise<boolean> {
    if (isReportLoading.value) return false
    reportError.value = null
    isReportLoading.value = true
    try {
      const distributionId = resolveDistributionId()
      const response = await $fetch<unknown>(resolveReportUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { distribution_id: distributionId }
      })
      reportData.value = response
      return true
    } catch (err) {
      reportError.value = toReportError(err)
      return false
    } finally {
      isReportLoading.value = false
    }
  }

  /** پاک‌سازی وضعیت گزارش */
  function resetReport() {
    reportError.value = null
    reportData.value = null
  }

  return { isReportLoading, reportError, reportData, fetchStrategySurveyReport, resetReport }
}
