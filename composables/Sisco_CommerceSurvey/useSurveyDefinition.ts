/**
 * تعریف ساختار پرسشنامه VOC (صدای مشتری) – امور بازرگانی فولاد سیرجان ایرانیان
 * این فایل صرفاً «اسکیمای پرسشنامه» است (نه داده‌ی ساختگی) و به صورت داینامیک
 * بر اساس گروه مشتری (گندله / شمش) و نوع مشتری (داخلی / خارجی) تولید می‌شود.
 */

export type CustomerGroup = 'pellet' | 'billet'
export type CustomerType = 'domestic' | 'export'

export type QuestionType =
  | 'rating'        // امتیاز ۱ تا ۵
  | 'score'         // امتیاز ۱ تا ۱۰ (امتیاز کلی)
  | 'single'        // تک‌انتخابی
  | 'multi'         // چندانتخابی
  | 'text'          // ورودی تک‌خطی
  | 'textarea'      // ورودی چندخطی

export interface QuestionOption {
  value: string
  label: string
}

export interface SurveyQuestion {
  id: string
  type: QuestionType
  title: string
  /** توضیح تکمیلی زیر عنوان سؤال */
  hint?: string
  required?: boolean
  options?: QuestionOption[]
  placeholder?: string
  /** برچسب دو سر طیف (برای rating / score) */
  scaleLabels?: { min: string; max: string }
  /** مقدار جایگزین (Tag) برای نمایش گروه‌بندی سؤال‌ها در یک استپ */
  group?: string
}

export interface SurveyStep {
  id: string
  /** شماره‌ی استپ در سند اصلی VOC (استپ ۱ حذف شده است) */
  order: number
  title: string
  subtitle: string
  icon: string
  questions: SurveyQuestion[]
}

export interface SurveySelection {
  group: CustomerGroup
  type: CustomerType
}

export const CUSTOMER_GROUP_OPTIONS: Array<{
  value: CustomerGroup
  label: string
  description: string
  icon: string
}> = [
  {
    value: 'pellet',
    label: 'گندله',
    description: 'گندله سنگ‌آهن – خوراک واحدهای احیای مستقیم',
    icon: '/img/icons/Sisco_CommerceSurvey/pellet.svg'
  },
  {
    value: 'billet',
    label: 'شمش',
    description: 'شمش فولادی – محصول نهایی واحد فولادسازی',
    icon: '/img/icons/Sisco_CommerceSurvey/billet.svg'
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

export const RATING_SCALE = [
  { value: 1, label: 'خیلی ضعیف' },
  { value: 2, label: 'ضعیف' },
  { value: 3, label: 'متوسط' },
  { value: 4, label: 'خوب' },
  { value: 5, label: 'عالی' }
] as const

export const groupLabel = (g: CustomerGroup) => (g === 'pellet' ? 'گندله' : 'شمش')
export const typeLabel = (t: CustomerType) => (t === 'domestic' ? 'داخلی' : 'خارجی')

/* -------------------------------------------------------------------------- */
/*                               سازنده‌ی استپ‌ها                              */
/* -------------------------------------------------------------------------- */

const ratingLabels = { min: 'خیلی ضعیف', max: 'عالی' }

function buildQualityStep(group: CustomerGroup): SurveyStep {
  const isBillet = group === 'billet'

  const physical: SurveyQuestion = isBillet
    ? {
        id: 'q_physical',
        type: 'rating',
        group: 'ارزیابی اختصاصی شمش',
        title: 'کیفیت فیزیکی و ظاهری شمش',
        hint: 'ابعاد، ترک سطحی، حباب، زنگ‌زدگی و فرم فیزیکی',
        required: true,
        scaleLabels: ratingLabels
      }
    : {
        id: 'q_physical',
        type: 'rating',
        group: 'ارزیابی اختصاصی گندله',
        title: 'کیفیت فیزیکی و ظاهری گندله',
        hint: 'دانه‌بندی، تخلخل و استحکام فشاری (CCS)',
        required: true,
        scaleLabels: ratingLabels
      }

  const metallurgical: SurveyQuestion = isBillet
    ? {
        id: 'q_metallurgical',
        type: 'rating',
        group: 'ارزیابی اختصاصی شمش',
        title: 'کیفیت متالورژیکی و آنالیز شیمیایی شمش',
        hint: 'درصد منگنز، کربن، مس، نیکل، کروم و سایر عناصر',
        required: true,
        scaleLabels: ratingLabels
      }
    : {
        id: 'q_metallurgical',
        type: 'rating',
        group: 'ارزیابی اختصاصی گندله',
        title: 'کیفیت متالورژیکی و آنالیز شیمیایی گندله',
        hint: 'درصد Fe، درصد FeO و درصد S (گوگرد)',
        required: true,
        scaleLabels: ratingLabels
      }

  return {
    id: 'quality',
    order: 2,
    title: 'کیفیت محصول',
    subtitle: `ارزیابی کیفیت ${groupLabel(group)} دریافتی از فولاد سیرجان ایرانیان`,
    icon: 'lucide:badge-check',
    questions: [
      physical,
      metallurgical,
      {
        id: 'q_reliability',
        type: 'rating',
        group: 'ابعاد عمومی کیفیت',
        title: 'قابلیت اطمینان و یکنواختی کیفی در طول زمان',
        hint: 'میزان ثبات کیفیت در محموله‌های مختلف',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'q_compliance',
        type: 'rating',
        group: 'ابعاد عمومی کیفیت',
        title: 'میزان مطابقت محصول با سفارش و استانداردهای درخواستی',
        hint: 'تطابق آنالیز، ابعاد و مشخصات فنی با قرارداد',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'q_feedback',
        type: 'textarea',
        group: 'ابعاد عمومی کیفیت',
        title: 'پیشنهادات و انتقادات کیفی',
        hint: 'اختیاری – هرگونه نکته‌ی کیفی که مایل به اشتراک آن هستید',
        placeholder: 'نظر خود را در خصوص کیفیت محصول بنویسید...',
        required: false
      }
    ]
  }
}

function buildServiceStep(type: CustomerType): SurveyStep {
  const questions: SurveyQuestion[] = [
    {
      id: 's_responsiveness',
      type: 'rating',
      group: 'تیم فروش و پشتیبانی',
      title: 'سرعت و کیفیت پاسخگویی واحد فروش',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_expertise',
      type: 'rating',
      group: 'تیم فروش و پشتیبانی',
      title: 'دانش و تخصص فنی کارشناسان',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_behavior',
      type: 'rating',
      group: 'تیم فروش و پشتیبانی',
      title: 'رفتار حرفه‌ای و برخورد محترمانه',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_transparency',
      type: 'rating',
      group: 'تیم فروش و پشتیبانی',
      title: 'شفافیت در اطلاع‌رسانی و ارائه‌ی اطلاعات',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_ordering',
      type: 'rating',
      group: 'فرآیند سفارش و تحویل',
      title: 'سهولت فرآیند ثبت سفارش',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_delivery',
      type: 'rating',
      group: 'فرآیند سفارش و تحویل',
      title: 'تحویل به‌موقع محموله‌ها',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_docs',
      type: 'rating',
      group: 'فرآیند سفارش و تحویل',
      title: 'دقت و صحت اسناد و مدارک',
      hint:
        type === 'export'
          ? 'فاکتور، گواهی آنالیز، بارنامه و اسناد گمرکی'
          : 'فاکتور، گواهی آنالیز، حواله و بارنامه',
      required: true,
      scaleLabels: ratingLabels
    }
  ]

  if (type === 'export') {
    questions.push({
      id: 's_logistics',
      type: 'rating',
      group: 'فرآیند سفارش و تحویل',
      title: 'هماهنگی امور لجستیک و حمل بین‌المللی',
      hint: 'هماهنگی بندری، اسناد صادراتی و پیگیری حمل',
      required: true,
      scaleLabels: ratingLabels
    })
  }

  questions.push(
    {
      id: 's_channels_used',
      type: 'multi',
      group: 'ارتباطات و انعطاف‌پذیری',
      title: 'کانال‌های ارتباطی مورد استفاده شما با شرکت',
      required: true,
      options: [
        { value: 'phone', label: 'تماس تلفنی' },
        { value: 'email', label: 'ایمیل' },
        { value: 'messenger', label: 'پیام‌رسان' },
        { value: 'visit', label: 'مراجعه حضوری' },
        { value: 'portal', label: 'پورتال / سامانه فروش' }
      ]
    },
    {
      id: 's_channels_rating',
      type: 'rating',
      group: 'ارتباطات و انعطاف‌پذیری',
      title: 'ارزیابی کلی کانال‌های ارتباطی (در دسترس بودن و اثربخشی)',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_flexibility',
      type: 'rating',
      group: 'ارتباطات و انعطاف‌پذیری',
      title: 'انعطاف‌پذیری در برابر درخواست‌ها و شرایط خاص',
      required: true,
      scaleLabels: ratingLabels
    }
  )

  return {
    id: 'service',
    order: 3,
    title: 'کیفیت خدمات',
    subtitle: 'ارزیابی عملکرد تیم فروش، فرآیند سفارش و ارتباطات',
    icon: 'lucide:headset',
    questions
  }
}

function buildPricingStep(type: CustomerType): SurveyStep {
  return {
    id: 'pricing',
    order: 4,
    title: 'قیمت و شرایط مالی',
    subtitle: 'ارزیابی رقابت‌پذیری قیمت و شرایط پرداخت',
    icon: 'lucide:coins',
    questions: [
      {
        id: 'p_competitiveness',
        type: 'rating',
        title: 'رقابتی بودن قیمت نسبت به سایر تأمین‌کنندگان',
        hint: type === 'export' ? 'در مقایسه با قیمت‌های بازار منطقه‌ای و جهانی' : 'در مقایسه با بازار داخلی',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'p_value',
        type: 'rating',
        title: 'تناسب قیمت با کیفیت محصول (ارزش دریافتی)',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'p_payment',
        type: 'rating',
        title: 'انعطاف‌پذیری در شرایط و روش‌های پرداخت',
        hint: type === 'export' ? 'LC، حواله، مدت‌دار و ...' : 'نقدی، مدت‌دار، اعتباری و ...',
        required: true,
        scaleLabels: ratingLabels
      }
    ]
  }
}

function buildLoyaltyStep(group: CustomerGroup): SurveyStep {
  return {
    id: 'loyalty',
    order: 5,
    title: 'وفاداری و آینده',
    subtitle: 'جایگاه ما در میان رقبا و چشم‌انداز همکاری آتی',
    icon: 'lucide:heart-handshake',
    questions: [
      {
        id: 'l_competitors',
        type: 'textarea',
        title: `از چه تأمین‌کنندگان دیگری ${groupLabel(group)} خریداری می‌کنید؟`,
        hint: 'نام شرکت‌ها و در صورت تمایل، نقاط قوت آن‌ها',
        placeholder: 'نام رقبا و دلیل انتخاب آن‌ها...',
        required: false
      },
      {
        id: 'l_advantages',
        type: 'multi',
        title: 'مزیت‌های رقابتی کلیدی فولاد سیرجان ایرانیان از نظر شما',
        hint: 'می‌توانید چند گزینه انتخاب کنید',
        required: true,
        options: [
          { value: 'quality', label: 'کیفیت محصول' },
          { value: 'price', label: 'قیمت مناسب' },
          { value: 'delivery', label: 'تحویل به‌موقع' },
          { value: 'support', label: 'پشتیبانی و پاسخگویی' },
          { value: 'payment', label: 'شرایط پرداخت' },
          { value: 'brand', label: 'اعتبار برند' },
          { value: 'location', label: 'موقعیت جغرافیایی و حمل' }
        ]
      },
      {
        id: 'l_repurchase',
        type: 'single',
        title: 'احتمال خرید مجدد شما از فولاد سیرجان ایرانیان',
        required: true,
        options: [
          { value: 'certain', label: 'قطعاً خرید می‌کنم' },
          { value: 'likely', label: 'احتمالاً خرید می‌کنم' },
          { value: 'unsure', label: 'مطمئن نیستم' },
          { value: 'unlikely', label: 'بعید است' }
        ]
      },
      {
        id: 'l_future_trend',
        type: 'single',
        title: 'پیش‌بینی شما از میزان نیاز آتی به این محصول',
        required: true,
        options: [
          { value: 'increase', label: 'افزایش می‌یابد' },
          { value: 'same', label: 'ثابت می‌ماند' },
          { value: 'decrease', label: 'کاهش می‌یابد' }
        ]
      },
      {
        id: 'l_future_needs',
        type: 'textarea',
        title: 'نیازمندی‌ها و انتظارات آتی شما',
        hint: 'گرید جدید، حجم، بسته‌بندی، خدمات ویژه و ...',
        placeholder: 'انتظارات خود از همکاری آینده را بنویسید...',
        required: false
      }
    ]
  }
}

function buildBrandStep(): SurveyStep {
  return {
    id: 'brand',
    order: 6,
    title: 'تصویر برند و اعتماد',
    subtitle: 'ادراک شما از برند فولاد سیرجان ایرانیان',
    icon: 'lucide:shield-check',
    questions: [
      {
        id: 'b_trust',
        type: 'rating',
        title: 'میزان اعتماد شما به برند فولاد سیرجان ایرانیان',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'b_commitment',
        type: 'rating',
        title: 'پایبندی شرکت به تعهدات و وعده‌ها',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'b_accountability',
        type: 'rating',
        title: 'مسئولیت‌پذیری در قبال مشکلات و شکایات',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'b_reputation',
        type: 'rating',
        title: 'اعتبار و خوش‌نامی شرکت در بازار',
        required: true,
        scaleLabels: ratingLabels
      }
    ]
  }
}

function buildSummaryStep(): SurveyStep {
  return {
    id: 'summary',
    order: 7,
    title: 'امتیاز کلی و جمع‌بندی',
    subtitle: 'ارزیابی نهایی و پیشنهادات شما',
    icon: 'lucide:flag',
    questions: [
      {
        id: 'o_score',
        type: 'score',
        title: 'امتیاز کلی شما به فولاد سیرجان ایرانیان (سیسکو)',
        hint: 'از ۱ (کاملاً ناراضی) تا ۱۰ (کاملاً راضی)',
        required: true,
        scaleLabels: { min: 'کاملاً ناراضی', max: 'کاملاً راضی' }
      },
      {
        id: 'o_recommendations',
        type: 'textarea',
        title: 'پیشنهادات و توصیه‌های شما برای بهبود',
        placeholder: 'هر پیشنهادی که به بهبود همکاری کمک می‌کند...',
        required: false
      },
      {
        id: 'o_discovery',
        type: 'single',
        title: 'از چه طریقی با فولاد سیرجان ایرانیان آشنا شدید؟',
        required: true,
        options: [
          { value: 'exhibition', label: 'نمایشگاه‌ها و رویدادها' },
          { value: 'referral', label: 'معرفی سایر مشتریان' },
          { value: 'website', label: 'وب‌سایت / فضای مجازی' },
          { value: 'sales', label: 'تماس مستقیم تیم فروش' },
          { value: 'exchange', label: 'بورس کالا' },
          { value: 'other', label: 'سایر' }
        ]
      }
    ]
  }
}

/** تولید داینامیک کل پرسشنامه بر اساس انتخاب کاربر (استپ ۱ به‌طور کامل حذف شده است) */
export function buildSurveySteps(selection: SurveySelection): SurveyStep[] {
  return [
    buildQualityStep(selection.group),
    buildServiceStep(selection.type),
    buildPricingStep(selection.type),
    buildLoyaltyStep(selection.group),
    buildBrandStep(),
    buildSummaryStep()
  ]
}
