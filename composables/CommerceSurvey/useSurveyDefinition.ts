/**
 * ثابت‌های صفحه‌ی نظرسنجی امور بازرگانی (فولاد سیرجان ایرانیان)
 *
 * توجه: پرسشنامه به‌صورت داینامیک از سرویس توزیع نظرسنجی دریافت می‌شود
 * (useSurveyApi) و هیچ سؤال، دسته یا مقیاس هاردکدشده‌ای وجود ندارد.
 * فرم ورود نیز حذف شده است؛ گروه/نوع مشتری صرفاً به‌عنوان زمینه‌ی داخلی
 * با مقدار پیش‌فرض نگهداری می‌شود.
 */

export type CustomerGroup = 'pellet' | 'billet'
export type CustomerType = 'domestic' | 'export'

export interface SurveySelection {
  group: CustomerGroup
  type: CustomerType
}

/** انتخاب پیش‌فرض داخلی (فقط زمینه‌ی نمایشی – در UI جمع‌آوری نمی‌شود) */
export const DEFAULT_SURVEY_SELECTION: SurveySelection = {
  group: 'billet',
  type: 'domestic'
}
