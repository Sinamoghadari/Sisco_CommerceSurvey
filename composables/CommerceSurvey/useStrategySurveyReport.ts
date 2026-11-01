import { ref } from 'vue'

/**
 * اتصال به سرویس گزارش نظرسنجی راهبردی از طریق کلاینت مرکزی پروژه (useApi):
 *
 *   const api = useApi()
 *   const response = await api('/GetStrategySurveyReport', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: { distribution_id: pickRandomTestToken() }
 *   })
 *
 * - useApi توکن احراز هویت (کوکی sis_token) را به‌صورت Bearer به درخواست
 *   می‌افزاید و مسیرهای نسبی را روی https://portal.sirjansteel.com/api
 *   سوار می‌کند؛ فراخوانی مستقیم $fetch بدون اعتبارنامه با
 *   access_denied از سمت سرور مواجه می‌شود.
 * - قرارداد سرویس: بدنه‌ی JSON دقیقاً { distribution_id: <TOKEN> } است و
 *   مقدار آن یکی از توکن‌های فعال TEST_TOKENS است که در «هر فراخوانی»
 *   به‌صورت تصادفی انتخاب می‌شود (نه زیر کلید token، نه در query string؛
 *   هیچ fallback منقضی‌شده‌ای وجود ندارد).
 * - پاسخ خام سرویس بدون تغییر در reportData نگهداری می‌شود (JSON Inspector).
 */

/**
 * توکن‌های آزمایشی فاز تست – در هر درخواست گزارش، یکی به‌صورت تصادفی
 * انتخاب و به‌عنوان مقدار distribution_id در بدنه ارسال می‌شود (انتخاب در
 * لحظه‌ی درخواست، نه هنگام مقداردهی اولیه؛ بدون ترتیب round-robin).
 */
export const TEST_TOKENS = [
  '409138c71f5788ef4ee16c6961f50d1e87c0ab6290f71601c775268399e066bd',
  '76c188eb135a27b11fca3c769883a8bce78eabc6342107078da41ea8efdc001d',
  'ca4d87e9721d773bddb65f4eb89f0ccfdbc66006aeb0d9fc0d6d4e4510c9789c'
]

/** انتخاب تصادفی توکن در هر درخواست گزارش (بدون round-robin) */
export function pickRandomTestToken(): string {
  return TEST_TOKENS[Math.floor(Math.random() * TEST_TOKENS.length)]!
}

/** مسیر نسبی سرویس گزارش (روی base مرکزی useApi سوار می‌شود) */
export const SURVEY_REPORT_PATH = '/GetStrategySurveyReport'

/** پیام خطای فارسی بر اساس خطای کلاینت مرکزی */
function toReportError(e: any): string {
  return (
    e?.response?.data?.msg_description ||
    e?.data?.msg_description ||
    'خطا در برقراری ارتباط با سرور'
  )
}

/** خروجی استاندارد فراخوانی گزارش (مطابق الگوی ماژول‌های دیگر پروژه) */
export interface StrategyReportResult {
  result: boolean
  data?: unknown
  msg?: string
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

  /**
   * دریافت گزارش از سرویس – بدنه‌ی دقیق { distribution_id: <TOKEN> } که
   * مقدار آن در هر فراخوانی تصادفی از TEST_TOKENS انتخاب می‌شود.
   * true → موفق (داده در reportData)؛ false → ناموفق (پیام در reportError).
   */
  async function fetchStrategySurveyReport(): Promise<boolean> {
    if (isReportLoading.value) return false
    reportError.value = null
    isReportLoading.value = true
    try {
      // کلاینت مرکزی پروژه: افزودن اعتبارنامه/توکن + base URL
      const api = useApi()
      const response: any = await api(SURVEY_REPORT_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          // مقدار distribution_id = توکن فعال انتخاب‌شده در همین فراخوانی
          distribution_id: pickRandomTestToken()
        }
      })

      if (
        response &&
        (response.result === 'OK' || Array.isArray(response) || !response.access_denied)
      ) {
        reportData.value = response
        return true
      }

      // دسترسی رد شده / داده‌ای یافت نشد – پیام سرور عیناً نمایش داده می‌شود
      const msg = response?.msg_description || 'دسترسی مجاز نمی‌باشد یا داده‌ای یافت نشد.'
      reportError.value = msg
      return false
    } catch (e: any) {
      reportError.value = toReportError(e)
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
