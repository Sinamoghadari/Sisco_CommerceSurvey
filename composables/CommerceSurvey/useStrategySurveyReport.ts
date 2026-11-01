import { ref } from 'vue'

/**
 * اتصال به سرویس گزارش نظرسنجی راهبردی از طریق کلاینت مرکزی پروژه (useApi):
 *
 *   const api = useApi()
 *   const response = await api('/GetStrategySurveyReport', {
 *     method: 'POST',
 *     body: { distribution_id: distributionId }
 *   })
 *
 * - useApi توکن احراز هویت (کوکی sis_token) را به‌صورت Bearer به درخواست
 *   می‌افزاید و مسیرهای نسبی را روی https://portal.sirjansteel.com/api
 *   سوار می‌کند؛ فراخوانی مستقیم $fetch بدون اعتبارنامه با
 *   access_denied از سمت سرور مواجه می‌شود.
 * - distribution_id از route.query.distribution_id یا آرگومان ورودی
 *   خوانده می‌شود و در نبود آن‌ها مقدار پیش‌فرض
 *   SURVEY_DISTRIBUTION_ID_FALLBACK استفاده می‌گردد.
 * - پاسخ خام سرویس بدون تغییر در reportData نگهداری می‌شود (JSON Inspector).
 */

/**
 * مقدار پیش‌فرض distribution_id (تا زمانی که شناسه‌ی توزیع واقعی از
 * مسیر ورود توزیع شود). در صورت وجود ?distribution_id= در آدرس صفحه،
 * همان مقدار اولویت دارد.
 */
export const SURVEY_DISTRIBUTION_ID_FALLBACK = '3ef23fdeecad664aeedcb961a4561269988da62d1c6a12ce0951a7afc0bb8ede'

/**
 * توکن‌های آزمایشی فاز تست – در هر درخواست گزارش، یکی به‌صورت تصادفی
 * انتخاب و به‌صورت مقدار خام در body.token ارسال می‌شود (انتخاب در لحظه‌ی
 * درخواست، نه هنگام مقداردهی اولیه؛ بدون ترتیب round-robin).
 */
export const TEST_TOKENS = [
  '0cfb2529ef87511f2b314dbf7640b66a5ecba69e82bd7a55e21ef6f0dfe98420',
  '6a82d3cab153bd6a6cea95db807301f3053b850bf77030d1a4ca6bd92087162e',
  '705479d831d147a19eab91fbfc73a9d26e645e4eee326f88d2057d87684f433d'
]

/** انتخاب تصادفی توکن در هر درخواست گزارش (بدون round-robin) */
export function pickRandomTestToken(): string {
  return TEST_TOKENS[Math.floor(Math.random() * TEST_TOKENS.length)]!
}

/** مسیر نسبی سرویس گزارش (روی base مرکزی useApi سوار می‌شود) */
export const SURVEY_REPORT_PATH = '/GetStrategySurveyReport'

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
   * دریافت گزارش از سرویس (با اعتبارنامه‌ی مرکزی پروژه).
   * true → موفق (داده در reportData)؛ false → ناموفق (پیام در reportError).
   */
  async function fetchStrategySurveyReport(
    distributionId: string = resolveDistributionId()
  ): Promise<boolean> {
    if (isReportLoading.value) return false
    reportError.value = null
    isReportLoading.value = true
    try {
      // کلاینت مرکزی پروژه: افزودن اعتبارنامه/توکن + base URL
      const api = useApi()
      const response: any = await api(SURVEY_REPORT_PATH, {
        method: 'POST',
        body: {
          distribution_id: distributionId,
          // توکن آزمایشی – در هر درخواست تصادفی انتخاب می‌شود (مقدار خام)
          token: pickRandomTestToken()
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
