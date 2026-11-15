/**
 * منطق مشترک «اطلاعات دوره های آموزشی پرسنل»
 * فقط انواع، اعتبارسنجی و قالب‌بندی؛ بدون هیچ ارتباطی با سرور یا ذخیره‌سازی دائمی.
 */

export type TrainingMode = 'حضوری' | 'آنلاین'

/** روش‌های آموزشی مجاز، دقیقاً همان دو گزینه‌ی خواسته‌شده */
export const TRAINING_MODES: TrainingMode[] = ['حضوری', 'آنلاین']

/** یک دوره‌ی آموزشی که فقط در حافظه‌ی همین صفحه نگهداری می‌شود */
export interface TrainingCourseRecord {
  id: string
  /** عنوان دوره آموزشی */
  title: string
  /** نام مرکز آموزشی */
  center: string
  /** مدت زمان دوره(ساعت) */
  durationHours: number
  /** تاریخ شروع دوره */
  startDate: Date
  /** تاریخ پایان دوره */
  endDate: Date
  /** روش آموزشی */
  mode: TrainingMode
  /** نمره یا نتیجه (متن یا عدد، اختیاری) */
  score: string
  /** توضیحات */
  description: string
  /** نام فایل گواهینامه؛ فایل بارگذاری نمی‌شود و فقط نام آن نمایش داده می‌شود */
  certificateName: string | null
}

/* -------------------------------------------------------------------------- */
/* مدت زمان دوره                                                              */
/* -------------------------------------------------------------------------- */

/** ارقام فارسی و عربی را به ارقام لاتین تبدیل می‌کند */
export function toLatinDigits(value: string): string {
  return String(value ?? '')
    .replace(/[\u06F0-\u06F9]/g, char => String(char.charCodeAt(0) - 0x06F0))
    .replace(/[\u0660-\u0669]/g, char => String(char.charCodeAt(0) - 0x0660))
}

/** ورودی مدت زمان را به عدد صحیح نامنفی محدود می‌کند (علامت منفی و ممیز پذیرفته نمی‌شود) */
export function sanitizeDurationInput(raw: string): string {
  return toLatinDigits(raw).replace(/\D/g, '')
}

/**
 * عدد صحیح و نامنفی؛ صفر نیز معتبر است.
 * مقدار خام بررسی می‌شود تا «۲.۵» یا «-۳» نامعتبر باشند (بدون پاک‌سازی خودکار).
 */
export function isValidDurationHours(value: string): boolean {
  const normalized = toLatinDigits(String(value ?? '').trim())
  return /^\d+$/.test(normalized)
}

/** تبدیل مقدار معتبر به عدد برای نگهداری در رکورد */
export function toDurationHours(value: string): number {
  return Number.parseInt(sanitizeDurationInput(value), 10)
}

/* -------------------------------------------------------------------------- */
/* پیوست گواهینامه                                                            */
/* -------------------------------------------------------------------------- */

export const ALLOWED_CERTIFICATE_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'] as const

export const ALLOWED_CERTIFICATE_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const

/** مقدار ویژگی accept برای input فایل */
export const CERTIFICATE_ACCEPT = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  'application/pdf',
  'image/png',
  'image/jpeg',
].join(',')

/** پیام خطای اعتبارسنجی فایل یا null در صورت معتبر بودن */
export function validateCertificateFile(file: File): string | null {
  const fileName = String(file?.name ?? '')
  const extension = fileName.includes('.')
    ? fileName.split('.').pop()!.toLowerCase()
    : ''
  const mimeType = String(file?.type ?? '').toLowerCase()

  const extensionAllowed = (ALLOWED_CERTIFICATE_EXTENSIONS as readonly string[]).includes(extension)
  const mimeAllowed = mimeType === ''
    || (ALLOWED_CERTIFICATE_MIME_TYPES as readonly string[]).includes(mimeType)

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
export function createTrainingCourseId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `course-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}
