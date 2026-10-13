/**
 * کلاینت سرویس توزیع نظرسنجی (Survey Distribution API)
 * https://portal.sirjansteel.com/api/SurveyDistribution/Access
 *
 * این فایل تنها محل تعریف اسکیمای پاسخ سرور و دریافت داینامیک پرسشنامه است؛
 * تمام سؤال‌ها، دسته‌ها و طیف‌های امتیازدهی از همین API خوانده می‌شوند و
 * هیچ ساختار هاردکدشده‌ای در کامپوننت‌ها وجود ندارد.
 *
 * آدرس سرویس از runtimeConfig.public.surveyApiUrl خوانده می‌شود (قابل بازنویسی
 * با متغیر محیطی NUXT_PUBLIC_SURVEY_API_URL) و در غیر این صورت به آدرس
 * پیش‌فرض بالا برمی‌گردد.
 */
import { computed, ref } from 'vue'

/** آدرس پیش‌فرض سرویس توزیع نظرسنجی */
export const DEFAULT_SURVEY_API_URL = 'https://portal.sirjansteel.com/api/SurveyDistribution/Access'

/* -------------------------------------------------------------------------- */
/*                           اسکیمای پاسخ سرور (Schema)                       */
/* -------------------------------------------------------------------------- */

export interface ConditionalFollowUp {
  enabled: boolean
  operator: 'less_than' | 'greater_than' | 'equal' | string
  threshold: number
  text: string
  required: boolean
  type: 'text' | 'strategy_range_rating' | string
  options: string[]
  range_min: number
  range_max: number
}

export interface SurveyQuestion {
  _id: string
  survey_id: string
  text: string
  type: 'strategy_range_rating' | 'single_choice' | 'text' | string
  options: string[]
  order: number
  required: boolean
  status: boolean
  delete: boolean
  score: number
  equal_score: boolean
  range_min: number
  range_max: number
  strategy_node_id: string
  strategy_node_title: string
  strategy_node_weight: number
  conditional_follow_up?: ConditionalFollowUp
  selected?: number | string | null
}

export interface QuestionCategory {
  key: string
  strategy_node_id: string
  strategy_node_title: string
  strategy_node_weight: number
  is_general: boolean
}

export interface SurveyCategoryGroup {
  category: QuestionCategory
  questions: SurveyQuestion[]
}

export interface SurveyApiResponse {
  result: string
  title: string
  description: string
  start_date: string
  end_date: string
  SurveyQuestions: SurveyCategoryGroup[]
  provider: any
  already_answered: boolean
}

export type SurveyFetchStatus = 'idle' | 'loading' | 'success' | 'error'

/* -------------------------------------------------------------------------- */
/*                                  Composable                                */
/* -------------------------------------------------------------------------- */

/** کلیدهای کوئری مجاز برای انتقال توکن/شناسه‌ی دسترسیِ لینک توزیع */
const ACCESS_QUERY_KEYS = ['access', 'token', 'guid', 'key', 'id'] as const

export function useSurveyApi() {
  const config = useRuntimeConfig()
  const route = useRoute()

  const apiUrl = computed(
    () => (config.public?.surveyApiUrl as string) || DEFAULT_SURVEY_API_URL
  )

  /** دسته‌بندی‌ها و سؤال‌های پرسشنامه (clone واکنش‌پذیر از پاسخ سرور) */
  const categories = ref<SurveyCategoryGroup[] | null>(null)
  const title = ref('')
  const description = ref('')
  const alreadyAnswered = ref(false)
  const status = ref<SurveyFetchStatus>('idle')
  const error = ref<string | null>(null)

  const isEmpty = computed(() => {
    if (!categories.value) return false
    return categories.value.reduce((n, g) => n + (g.questions?.length ?? 0), 0) === 0
  })

  /** کلیدهای کوئری لینک توزیع (در صورت وجود در URL فعلی) برای پیوست به درخواست */
  function accessQuery(): Record<string, string> {
    const out: Record<string, string> = {}
    for (const key of ACCESS_QUERY_KEYS) {
      const v = route.query[key]
      if (typeof v === 'string' && v) out[key] = v
    }
    return out
  }

  function clone<T>(value: T): T {
    if (typeof structuredClone === 'function') return structuredClone(value)
    return JSON.parse(JSON.stringify(value)) as T
  }

  /**
   * دریافت پرسشنامه از سرویس توزیع.
   * @param force در صورت true، حتی اگر داده‌ی کش‌شده وجود دارد دوباره دریافت می‌شود.
   */
  async function fetchSurvey(force = false): Promise<void> {
    if (status.value === 'loading') return
    if (!force && categories.value) return

    status.value = 'loading'
    error.value = null

    try {
      const res = await $fetch<SurveyApiResponse>(apiUrl.value, {
        method: 'GET',
        query: accessQuery(),
        timeout: 20000
      })

      // سازگار با الگوی result: 'OK' | 'NOK' سرویس‌های داخلی
      if (res && typeof res.result === 'string' && res.result.toUpperCase() !== 'OK') {
        status.value = 'error'
        error.value = res.description || 'سرویس نظرسنجی درخواست را نپذیرفت.'
        return
      }

      title.value = res?.title ?? ''
      description.value = res?.description ?? ''
      alreadyAnswered.value = Boolean(res?.already_answered)
      categories.value = clone(res?.SurveyQuestions ?? [])
      status.value = 'success'
    } catch (e: any) {
      status.value = 'error'
      error.value =
        e?.data?.description ||
        e?.data?.message ||
        e?.message ||
        'خطا در دریافت اطلاعات نظرسنجی از سرور.'
    }
  }

  /** پاک‌سازی پاسخ‌های انتخابی روی سؤال‌ها (شروع اجرای جدید) */
  function resetAnswers() {
    for (const g of categories.value ?? []) {
      for (const q of g.questions ?? []) {
        q.selected = null
      }
    }
  }

  return {
    apiUrl,
    categories,
    title,
    description,
    alreadyAnswered,
    status,
    error,
    isEmpty,
    fetchSurvey,
    resetAnswers
  }
}
