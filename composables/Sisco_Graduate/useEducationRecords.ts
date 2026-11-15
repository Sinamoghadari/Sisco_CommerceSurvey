/**
 * منطق مشترک «اطلاعات تحصیلی پرسنل»
 * فقط شامل انواع، اعتبارسنجی و قالب‌بندی است.
 * هیچ ارتباطی با سرور، پایگاه داده یا ذخیره‌سازی دائمی در این فایل وجود ندارد.
 */

export type EducationLevel = 'دیپلم' | 'فوق دیپلم' | 'کارشناسی' | 'کارشناسی ارشد'

/** مقاطع تحصیلی مجاز، دقیقاً به همان ترتیب خواسته‌شده در فرم */
export const EDUCATION_LEVELS: EducationLevel[] = [
  'دیپلم',
  'فوق دیپلم',
  'کارشناسی',
  'کارشناسی ارشد',
]

/** یک رکورد تحصیلی که فقط در حافظه‌ی همین صفحه نگهداری می‌شود */
export interface EducationRecord {
  id: string
  /** مقطع تحصیلی */
  level: EducationLevel
  /** رشته تحصیلی */
  field: string
  /** تاریخ پایان تحصیلی */
  graduationDate: Date
  /** موسسه آموزشی */
  institution: string
  /** معدل (به صورت رشته نگهداری می‌شود تا اعشار از دست نرود) */
  gpa: string
  /** توضیحات */
  description: string
  /** نام فایل پیوست؛ فایل بارگذاری نمی‌شود و فقط نام آن نمایش داده می‌شود */
  attachmentName: string | null
}

/* -------------------------------------------------------------------------- */
/* اعتبارسنجی متن فارسی                                                        */
/* -------------------------------------------------------------------------- */

/**
 * حروف فارسی/عربی، فاصله، نیم‌فاصله (U+200C) و فاصله‌ی مجازی (U+200D).
 * ارقام فارسی (U+06F0..U+06F9)، ارقام عربی (U+0660..U+0669) و حروف لاتین
 * خارج از این محدوده هستند و بنابراین رد می‌شوند.
 */
const PERSIAN_TEXT_PATTERN = /^[\u0621-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\u200C\u200D ]+$/

/** همان الگو برای متن‌های چندخطی (توضیحات) که شکستن خط در آن‌ها مجاز است */
const PERSIAN_PARAGRAPH_PATTERN = /^[\u0621-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\u200C\u200D \n]+$/

/** یکسان‌سازی حروف عربی با معادل فارسی و حذف فاصله‌های اضافی */
export function normalizePersianText(value: string): string {
  return String(value ?? '')
    .replace(/\u064A/g, '\u06CC') // ي عربی → ی فارسی
    .replace(/\u0643/g, '\u06A9') // ك عربی → ک فارسی
    .replace(/\u00A0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** متن تک‌خطی فقط با حروف فارسی، فاصله و نیم‌فاصله */
export function isValidPersianText(value: string): boolean {
  const normalized = normalizePersianText(value)
  return normalized.length > 0 && PERSIAN_TEXT_PATTERN.test(normalized)
}

/** متن چندخطی (توضیحات) فقط با حروف فارسی، فاصله و نیم‌فاصله */
export function isValidPersianParagraph(value: string): boolean {
  const normalized = normalizePersianText(value)
  return normalized.length > 0 && PERSIAN_PARAGRAPH_PATTERN.test(normalized)
}

/* -------------------------------------------------------------------------- */
/* اعتبارسنجی معدل                                                            */
/* -------------------------------------------------------------------------- */

/** ارقام فارسی و عربی را به ارقام لاتین تبدیل می‌کند */
export function toLatinDigits(value: string): string {
  return String(value ?? '')
    .replace(/[\u06F0-\u06F9]/g, char => String(char.charCodeAt(0) - 0x06F0))
    .replace(/[\u0660-\u0669]/g, char => String(char.charCodeAt(0) - 0x0660))
}

/**
 * ورودی معدل را پاک‌سازی می‌کند: فقط رقم و یک ممیز، حداکثر دو رقم اعشار.
 * هیچ کمینه یا بیشینه‌ای برای مقدار معدل تعیین نمی‌شود.
 */
export function sanitizeGpaInput(raw: string): string {
  const normalized = toLatinDigits(raw).replace(/[,\u060C\u066B]/g, '.')
  let cleaned = normalized.replace(/[^\d.]/g, '')

  const firstDot = cleaned.indexOf('.')
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '')
  }
  if (cleaned.startsWith('.')) {
    cleaned = `0${cleaned}`
  }

  const [integerPart, decimalPart] = cleaned.split('.')
  if (decimalPart === undefined) {
    return integerPart
  }
  return `${integerPart}.${decimalPart.slice(0, 2)}`
}

const GPA_PATTERN = /^\d+(\.\d{1,2})?$/

/** فقط عدد صحیح یا عدد با حداکثر دو رقم اعشار */
export function isValidGpa(value: string): boolean {
  return GPA_PATTERN.test(String(value ?? '').trim())
}

/* -------------------------------------------------------------------------- */
/* اعتبارسنجی پیوست                                                           */
/* -------------------------------------------------------------------------- */

export const ALLOWED_ATTACHMENT_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'] as const

export const ALLOWED_ATTACHMENT_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const

/** مقدار ویژگی accept برای input فایل */
export const ATTACHMENT_ACCEPT = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  'application/pdf',
  'image/png',
  'image/jpeg',
].join(',')

/** پیام خطای اعتبارسنجی فایل یا null در صورت معتبر بودن */
export function validateAttachmentFile(file: File): string | null {
  const fileName = String(file?.name ?? '')
  const extension = fileName.includes('.')
    ? fileName.split('.').pop()!.toLowerCase()
    : ''
  const mimeType = String(file?.type ?? '').toLowerCase()

  const extensionAllowed = (ALLOWED_ATTACHMENT_EXTENSIONS as readonly string[]).includes(extension)
  const mimeAllowed = mimeType === ''
    || (ALLOWED_ATTACHMENT_MIME_TYPES as readonly string[]).includes(mimeType)

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

/** شناسه‌ی موقت رکورد در حافظه‌ی مرورگر */
export function createEducationRecordId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `edu-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}
