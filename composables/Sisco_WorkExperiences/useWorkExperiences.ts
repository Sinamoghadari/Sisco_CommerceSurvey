/**
 * منطق مشترک «سوابق کاری پرسنل»
 * فقط انواع، اعتبارسنجی و قالب‌بندی؛ بدون هیچ ارتباطی با سرور یا ذخیره‌سازی دائمی.
 *
 * مدل داده:
 *   سازمان (والد) ──► چند سابقه‌ی کاری (فرزند)
 *   فیلدهای سازمان (نام، اطلاعات تماس) در سطح سازمان نگهداری می‌شوند و
 *   در سوابق کاری تکرار نمی‌شوند.
 */

/** یک سابقه‌ی کاری تکمیل‌شده که در فهرست صفحه نمایش داده می‌شود */
export interface WorkExperienceRecord {
  id: string
  /** از تاریخ */
  fromDate: Date
  /** تا تاریخ */
  toDate: Date
  /** سمت */
  position: string
  /** سابقه بیمه(روز) */
  insuranceDays: number
  /** توضیحات */
  description: string
  /** نام فایل بیمه؛ فایل بارگذاری نمی‌شود و فقط نام آن نمایش داده می‌شود */
  insuranceFileName: string | null
}

/** سازمان به همراه سوابق کاری فرزند */
export interface OrganizationRecord {
  id: string
  /** نام سازمان */
  name: string
  /** اطلاعات تماس سازمان */
  contact: string
  experiences: WorkExperienceRecord[]
}

/** سابقه‌ی کاری در حال تکمیل در فرم (تاریخ‌ها ممکن است هنوز خالی باشند) */
export interface WorkExperienceDraft {
  id: string
  fromDate: Date | null
  toDate: Date | null
  position: string
  insuranceDays: string
  description: string
  insuranceFileName: string | null
}

/** خطاهای یک سابقه‌ی کاری در فرم */
export interface WorkExperienceDraftErrors {
  fromDate: string
  toDate: string
  position: string
  insuranceDays: string
}

/* -------------------------------------------------------------------------- */
/* شناسه‌های پایدار برای کلیدهای لیست                                          */
/* -------------------------------------------------------------------------- */

export function createEntityId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

/** یک سابقه‌ی کاری خالی و مستقل برای فرم */
export function createExperienceDraft(): WorkExperienceDraft {
  return {
    id: createEntityId('exp'),
    fromDate: null,
    toDate: null,
    position: '',
    insuranceDays: '',
    description: '',
    insuranceFileName: null,
  }
}

/* -------------------------------------------------------------------------- */
/* ابزارهای عدد و تاریخ                                                       */
/* -------------------------------------------------------------------------- */

/** ارقام فارسی و عربی را به ارقام لاتین تبدیل می‌کند */
export function toLatinDigits(value: string): string {
  return String(value ?? '')
    .replace(/[\u06F0-\u06F9]/g, char => String(char.charCodeAt(0) - 0x06F0))
    .replace(/[\u0660-\u0669]/g, char => String(char.charCodeAt(0) - 0x0660))
}

/**
 * عدد صحیح و نامنفی؛ صفر معتبر است.
 * مقدار خام بررسی می‌شود تا «۲.۵» یا «-۳» نامعتبر باشند (بدون پاک‌سازی خودکار).
 */
export function isValidInsuranceDays(value: string): boolean {
  const normalized = toLatinDigits(String(value ?? '').trim())
  return /^\d+$/.test(normalized)
}

/** تبدیل مقدار معتبر به عدد برای نگهداری در رکورد */
export function toInsuranceDays(value: string): number {
  return Number.parseInt(toLatinDigits(String(value ?? '').trim()), 10)
}

/** فقط رقم پذیرفته می‌شود؛ مقدار اعشاری یا منفی رد می‌شود */
export function isDigitsOnlyInput(value: string): boolean {
  return /^\d*$/.test(toLatinDigits(String(value ?? '')))
}

function startOfDayTime(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** مقایسه‌ی تاریخ‌ها بدون در نظر گرفتن ساعت */
export function isDateBefore(earlier: Date, later: Date): boolean {
  return startOfDayTime(earlier) < startOfDayTime(later)
}

/** آیا تاریخ پایان پیش از تاریخ شروع است؟ */
export function isEndDateBeforeStartDate(start: Date, end: Date): boolean {
  return isDateBefore(end, start)
}

/* -------------------------------------------------------------------------- */
/* اعتبارسنجی سابقه‌ی کاری                                                    */
/* -------------------------------------------------------------------------- */

/** اعتبارسنجی یک سابقه‌ی کاری؛ متن پیام‌ها فارسی و آماده‌ی نمایش است */
export function validateExperienceDraft(draft: WorkExperienceDraft): WorkExperienceDraftErrors {
  const errors: WorkExperienceDraftErrors = {
    fromDate: '',
    toDate: '',
    position: '',
    insuranceDays: '',
  }

  if (!draft.fromDate) {
    errors.fromDate = 'تاریخ شروع الزامی است.'
  }

  if (!draft.toDate) {
    errors.toDate = 'تاریخ پایان الزامی است.'
  }
  else if (draft.fromDate && isEndDateBeforeStartDate(draft.fromDate, draft.toDate)) {
    errors.toDate = 'تاریخ پایان نباید پیش از تاریخ شروع باشد.'
  }

  if (!draft.position.trim()) {
    errors.position = 'سمت الزامی است.'
  }

  const insuranceDays = draft.insuranceDays.trim()
  if (!insuranceDays) {
    errors.insuranceDays = 'سابقه بیمه الزامی است.'
  }
  else if (!isValidInsuranceDays(insuranceDays)) {
    errors.insuranceDays = 'سابقه بیمه باید عدد صحیح و نامنفی بر حسب روز باشد.'
  }

  return errors
}

/** آیا سابقه‌ی کاری خطایی دارد؟ (خطای فایل جداگانه بررسی می‌شود) */
export function hasExperienceError(draft: WorkExperienceDraft): boolean {
  return Object.values(validateExperienceDraft(draft)).some(Boolean)
}

/* -------------------------------------------------------------------------- */
/* اعتبارسنجی فایل بیمه                                                       */
/* -------------------------------------------------------------------------- */

export const ALLOWED_INSURANCE_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'] as const

export const ALLOWED_INSURANCE_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const

/** مقدار ویژگی accept برای input فایل بیمه */
export const INSURANCE_FILE_ACCEPT = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  'application/pdf',
  'image/png',
  'image/jpeg',
].join(',')

/** پیام خطای اعتبارسنجی فایل یا null در صورت معتبر بودن */
export function validateInsuranceFile(file: File): string | null {
  const fileName = String(file?.name ?? '')
  const extension = fileName.includes('.')
    ? fileName.split('.').pop()!.toLowerCase()
    : ''
  const mimeType = String(file?.type ?? '').toLowerCase()

  const extensionAllowed = (ALLOWED_INSURANCE_EXTENSIONS as readonly string[]).includes(extension)
  const mimeAllowed = mimeType === ''
    || (ALLOWED_INSURANCE_MIME_TYPES as readonly string[]).includes(mimeType)

  if (!extensionAllowed || !mimeAllowed) {
    return 'فرمت فایل مجاز نیست؛ تنها فایل‌های PDF، PNG و JPG/JPEG پذیرفته می‌شوند.'
  }

  return null
}

/* -------------------------------------------------------------------------- */
/* نمایش تاریخ                                                                */
/* -------------------------------------------------------------------------- */

/** نمایش تاریخ به تقویم شمسی، هم‌سو با الگوی تاریخ موجود در پروژه */
export function formatJalaliDate(value: Date | string | null | undefined): string {
  if (!value) {
    return '-'
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }
  catch {
    return '-'
  }
}
