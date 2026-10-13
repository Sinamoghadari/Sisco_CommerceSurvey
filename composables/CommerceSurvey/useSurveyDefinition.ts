/**
 * ثابت‌های فرم ورود صفحه‌ی نظرسنجی امور بازرگانی (فولاد سیرجان ایرانیان)
 *
 * توجه: تمام سؤال‌ها، دسته‌ها و طیف‌های امتیازدهی پرسشنامه به‌صورت داینامیک
 * از سرویس توزیع نظرسنجی دریافت می‌شود (useSurveyApi) و طبق الزام معماری،
 * هیچ سؤال یا مقیاس هاردکدشده‌ای در این پروژه وجود ندارد.
 * این فایل صرفاً گزینه‌های فرم ورود (گروه/نوع مشتری) را تعریف می‌کند.
 */

export type CustomerGroup = 'pellet' | 'billet'
export type CustomerType = 'domestic' | 'export'

export interface SurveySelection {
  group: CustomerGroup
  type: CustomerType
}

/** شکل عمومی گزینه‌ی انتخابی (استفاده در گروه‌های انتخاب UI) */
export interface QuestionOption {
  value: string
  label: string
}

export const CUSTOMER_GROUP_OPTIONS: Array<{
  value: CustomerGroup
  label: string
  description: string
  icon: string
}> = [
  {
    value: 'billet',
    label: 'شمش',
    description: 'شمش فولادی – محصول نهایی واحد فولادسازی و ریخته‌گری',
    icon: '/img/Sisco_CommerceSurvey/billet.svg'
  },
  {
    value: 'pellet',
    label: 'گندله',
    description: 'گندله سنگ‌آهن – خوراک واحدهای احیای مستقیم',
    icon: '/img/Sisco_CommerceSurvey/pellet.svg'
  }
]

export const CUSTOMER_TYPE_OPTIONS: Array<{
  value: CustomerType
  label: string
  description: string
  icon: string
}> = [
  {
    value: 'domestic',
    label: 'داخلی',
    description: 'مشتریان بازار داخل کشور',
    icon: 'lucide:map-pin'
  },
  {
    value: 'export',
    label: 'خارجی',
    description: 'مشتریان صادراتی و بین‌المللی',
    icon: 'lucide:globe'
  }
]

export const groupLabel = (g: CustomerGroup) => (g === 'pellet' ? 'گندله' : 'شمش')
export const typeLabel = (t: CustomerType) => (t === 'domestic' ? 'داخلی' : 'خارجی')
