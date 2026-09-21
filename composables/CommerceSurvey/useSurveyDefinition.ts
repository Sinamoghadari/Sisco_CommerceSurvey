/**
 * تعریف ساختار پرسشنامه VOC (صدای مشتری) – امور بازرگانی فولاد سیرجان ایرانیان
 * این فایل صرفاً «اسکیمای پرسشنامه» است (نه داده‌ی ساختگی) و به صورت داینامیک
 * بر اساس گروه مشتری (گندله / شمش) و نوع مشتری (داخلی / خارجی) تولید می‌شود.
 *
 * قواعد کلیدی:
 * - تمام سؤال‌های امتیازدهی روی طیف ۱ تا ۱۰ (لیکرت ۱۰ درجه‌ای) هستند.
 * - مرحله‌ی «اطلاعات اولیه» سند اصلی به‌طور کامل حذف شده است.
 * - سؤال‌های تکمیلی (شرطی) فقط وقتی نمایش داده می‌شوند که امتیاز سؤال اصلی
 *   حداکثر `showWhenScoreAtMost` باشد (پیش‌فرض: امتیاز ۷ یا کمتر).
 */

export type CustomerGroup = 'pellet' | 'billet'
export type CustomerType = 'domestic' | 'export'

export type QuestionType =
  | 'rating'        // امتیاز ۱ تا ۱۰
  | 'score'         // امتیاز ۱ تا ۱۰ (امتیاز کلی / NPS)
  | 'single'        // تک‌انتخابی
  | 'multi'         // چندانتخابی
  | 'text'          // ورودی تک‌خطی
  | 'textarea'      // ورودی چندخطی

export interface QuestionOption {
  value: string
  label: string
}

/**
 * سؤال تکمیلی (شرطی) – فقط زمانی نمایش داده می‌شود که پاسخ سؤال اصلی
 * یک عدد بوده و از `showWhenScoreAtMost` کمتر یا مساوی باشد.
 */
export interface SurveySubQuestion {
  id: string
  title: string
  type: 'single' | 'multi' | 'text' | 'textarea'
  required?: boolean
  options?: QuestionOption[]
  placeholder?: string
  /** آستانه‌ی نمایش: امتیاز سؤال اصلی <= این مقدار */
  showWhenScoreAtMost: number
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
  /** سؤال‌های تکمیلی شرطی وابسته به امتیاز همین سؤال */
  subQuestions?: SurveySubQuestion[]
}

export interface SurveyStep {
  id: string
  /** شماره‌ی بخش در پرسشنامه (بخش ۱ = کیفیت محصول) */
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

/* -------------------------------------------------------------------------- */
/*                           گزینه‌های فرم ورود                               */
/* -------------------------------------------------------------------------- */

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

/** آستانه‌ی پیش‌فرض نمایش سؤال تکمیلی: امتیاز ۷ یا کمتر */
export const SUB_QUESTION_SCORE_THRESHOLD = 7

/* -------------------------------------------------------------------------- */
/*                               سازنده‌ی استپ‌ها                              */
/* -------------------------------------------------------------------------- */

/** طیف استاندارد رضایت ۱ تا ۱۰ */
const satisfactionScale = { min: 'کاملاً ناراضی', max: 'کاملاً راضی' }
const ratingLabels = satisfactionScale

/**
 * بخش ۱ – کیفیت محصول.
 * دو سؤال اول دارای سؤال تکمیلیِ شرطی هستند: در صورت امتیاز ۷ یا کمتر،
 * بلافاصله سؤال تکمیلی مربوطه نمایش داده می‌شود.
 */
function buildQualityStep(group: CustomerGroup): SurveyStep {
  const isBillet = group === 'billet'
  const product = groupLabel(group)

  const physicalSub: SurveySubQuestion = {
    id: 'q_phys_issue',
    type: 'single',
    title: `از کدام مشخصه ظاهری و فیزیکی ${product} ناراضی هستید؟`,
    required: true,
    showWhenScoreAtMost: SUB_QUESTION_SCORE_THRESHOLD,
    options: isBillet
      ? [
          { value: 'dims', label: 'ابعاد شمش' },
          { value: 'crack', label: 'وجود ترک روی سطح شمش' },
          { value: 'bubble', label: 'حباب دار بودن شمش' },
          { value: 'rust', label: 'زنگ زدگی سطح شمش' },
          { value: 'form', label: 'فرم فیزیکی شمش' },
          { value: 'other', label: 'سایر موارد' }
        ]
      : [
          { value: 'sizing', label: 'دانه‌بندی گندله' },
          { value: 'porosity', label: 'تخلخل گندله' },
          { value: 'ccs', label: 'استحکام فشاری (CCS)' },
          { value: 'other', label: 'سایر موارد' }
        ]
  }

  const metallurgicalSub: SurveySubQuestion = {
    id: 'q_met_issue',
    type: 'single',
    title: `از کدام مشخصه متالورژیکی ${product} ناراضی هستید؟`,
    required: true,
    showWhenScoreAtMost: SUB_QUESTION_SCORE_THRESHOLD,
    options: isBillet
      ? [
          { value: 'mn', label: 'درصد منگنز' },
          { value: 'c', label: 'درصد کربن' },
          { value: 'other', label: 'سایر موارد' }
        ]
      : [
          { value: 'fe', label: 'درصد Fe' },
          { value: 'feo', label: 'درصد FeO' },
          { value: 's', label: 'درصد S (گوگرد)' },
          { value: 'other', label: 'سایر موارد' }
        ]
  }

  return {
    id: 'quality',
    order: 1,
    title: 'کیفیت محصول',
    subtitle: `ارزیابی کیفیت ${product} دریافتی از فولاد سیرجان ایرانیان`,
    icon: 'lucide:badge-check',
    questions: [
      {
        id: 'q_phys',
        type: 'rating',
        title: `کیفیت ظاهری و فیزیکی ${product}`,
        hint: 'در صورت امتیاز ۷ یا کمتر، سؤال تکمیلی نمایش داده می‌شود.',
        required: true,
        scaleLabels: ratingLabels,
        subQuestions: [physicalSub]
      },
      {
        id: 'q_met',
        type: 'rating',
        title: `کیفیت متالورژیکی ${product}`,
        hint: 'در صورت امتیاز ۷ یا کمتر، سؤال تکمیلی نمایش داده می‌شود.',
        required: true,
        scaleLabels: ratingLabels,
        subQuestions: [metallurgicalSub]
      },
      {
        id: 'q_reliability',
        type: 'rating',
        title: 'یکسان بودن و پایایی کیفی محصولات در جریان زمان (قابلیت اطمینان)',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'q_compliance',
        type: 'rating',
        title: 'میزان مطابقت محصول با سفارش و استانداردهای درخواستی',
        required: true,
        scaleLabels: ratingLabels
      },
      {
        id: 'q_feedback',
        type: 'textarea',
        title: 'پیشنهادات و انتقادات جهت بهبود کیفیت محصول از دیدگاه شما',
        placeholder: 'نظر خود را در خصوص کیفیت محصول بنویسید...',
        required: false
      }
    ]
  }
}

/**
 * بخش ۲ – کیفیت خدمات (فروش و پشتیبانی).
 * سؤال ۱ (نحوه آشنایی) و سؤال ۸ (بهترین راه ارتباطی) تک‌انتخابی و
 * بقیه (به جز سؤال پایانی اختیاری) روی طیف ۱ تا ۱۰ هستند.
 */
function buildServiceStep(): SurveyStep {
  const questions: SurveyQuestion[] = [
    {
      id: 's_discovery',
      type: 'single',
      group: 'شناخت مشتری',
      title: 'نحوه آشنایی شما با ما از چه طریقی بوده است؟',
      required: true,
      options: [
        { value: 'google', label: 'جستجو گوگل' },
        { value: 'ai', label: 'پرسش از هوش مصنوعی' },
        { value: 'colleagues', label: 'پرس و جو از همکاران و شرکت ها' },
        { value: 'ime', label: 'بازار بورس کالا' },
        { value: 'social', label: 'شبکه های اجتماعی(اینستاگرام، لینکدین و..)' },
        { value: 'other', label: 'سایر موارد' }
      ]
    },
    {
      id: 's_responsiveness',
      type: 'rating',
      group: 'عملکرد واحد فروش',
      title: 'سرعت پاسخگویی واحد فروش به درخواست‌ها',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_behavior',
      type: 'rating',
      group: 'عملکرد واحد فروش',
      title: 'برخورد و رفتار حرفه‌ای کارشناسان فروش',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_transparency',
      type: 'rating',
      group: 'عملکرد واحد فروش',
      title: 'شفافیت در ارائه اطلاعات',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_ordering',
      type: 'rating',
      group: 'عملکرد واحد فروش',
      title: 'سهولت فرآیند ثبت سفارش و عقد قرارداد',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_delivery',
      type: 'rating',
      group: 'عملکرد واحد فروش',
      title: 'تحویل به‌موقع محموله طبق برنامه زمان‌بندی',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_docs',
      type: 'rating',
      group: 'عملکرد واحد فروش',
      title: 'دقت و صحت اسناد حمل و گزارش‌ها',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_best_channel',
      type: 'single',
      group: 'ارتباط با واحد فروش',
      title: 'بهترین راه ارتباطی با واحد فروش و پشتیبانی از دیدگاه شما',
      required: true,
      options: [
        { value: 'phone_direct', label: 'تلفن مستقیم شرکت' },
        { value: 'email', label: 'ایمیل شرکت' },
        { value: 'mobile', label: 'تلفن همراه کارشناسان فروش' },
        { value: 'website', label: 'سایت شرکت' },
        { value: 'social', label: 'شبکه های اجتماعی(اینستاگرام، لینکدین و..)' },
        { value: 'other', label: 'سایر موارد' }
      ]
    },
    {
      id: 's_ease_contact',
      type: 'rating',
      group: 'ارتباط با واحد فروش',
      title: 'سهولت در ارتباط با کارشناسان فروش',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_flexibility',
      type: 'rating',
      group: 'انعطاف‌پذیری و پاسخگویی',
      title: 'انعطاف در تغییر سفارش، زمان تحویل و یا شرایط همکاری',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_complaints',
      type: 'rating',
      group: 'انعطاف‌پذیری و پاسخگویی',
      title: 'سرعت و کیفیت رسیدگی به شکایات و انتقادات',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_accountability',
      type: 'rating',
      group: 'انعطاف‌پذیری و پاسخگویی',
      title: 'سازمان اشتباهات و نقایص خود را می‌پذیرد و خسارات وارده احتمالی را جبران می‌کند',
      required: true,
      scaleLabels: ratingLabels
    },
    {
      id: 's_feedback',
      type: 'textarea',
      group: 'انعطاف‌پذیری و پاسخگویی',
      title: 'انتقادات و پیشنهادات اختیاری برای بهبود عملکرد واحد فروش و بازاریابی از دیدگاه شما',
      placeholder: 'نظر خود را در خصوص عملکرد واحد فروش بنویسید...',
      required: false
    }
  ]

  return {
    id: 'service',
    order: 2,
    title: 'کیفیت خدمات',
    subtitle: 'ارزیابی کیفیت خدمات فروش و پشتیبانی',
    icon: 'lucide:headset',
    questions
  }
}

/** بخش ۳ – قیمت و ارزش (مشترک) */
function buildPricingStep(): SurveyStep {
  return {
    id: 'pricing',
    order: 3,
    title: 'قیمت و ارزش',
    subtitle: 'ارزیابی رقابت‌پذیری قیمت و شرایط پرداخت',
    icon: 'lucide:coins',
    questions: [
      {
        id: 'p_competitiveness',
        type: 'rating',
        title: 'رقابتی بودن قیمت نسبت به سایر تأمین‌کنندگان',
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
        required: true,
        scaleLabels: ratingLabels
      }
    ]
  }
}

/** بخش ۴ – وفاداری و NPS (مشترک) */
function buildLoyaltyStep(group: CustomerGroup): SurveyStep {
  return {
    id: 'loyalty',
    order: 4,
    title: 'وفاداری و NPS',
    subtitle: 'جایگاه ما در میان رقبا و چشم‌انداز همکاری آتی',
    icon: 'lucide:heart-handshake',
    questions: [
      {
        id: 'l_nps',
        type: 'score',
        title: 'احتمال توصیه‌ی فولاد سیرجان ایرانیان به سایر همکاران (NPS)',
        hint: 'از ۱ (به هیچ وجه) تا ۱۰ (قطعاً توصیه می‌کنم)',
        required: true,
        scaleLabels: { min: 'به هیچ وجه', max: 'قطعاً توصیه می‌کنم' }
      },
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

/** بخش ۵ – تصویر برند (مشترک) */
function buildBrandStep(): SurveyStep {
  return {
    id: 'brand',
    order: 5,
    title: 'تصویر برند',
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

/** بخش ۶ – ارزیابی کلی (مشترک) */
function buildSummaryStep(): SurveyStep {
  return {
    id: 'summary',
    order: 6,
    title: 'ارزیابی کلی',
    subtitle: 'امتیاز نهایی و پیشنهادات شما',
    icon: 'lucide:flag',
    questions: [
      {
        id: 'o_score',
        type: 'score',
        title: 'امتیاز کلی شما به فولاد سیرجان ایرانیان (سیسکو)',
        hint: 'از ۱ (کاملاً ناراضی) تا ۱۰ (کاملاً راضی)',
        required: true,
        scaleLabels: satisfactionScale
      },
      {
        id: 'o_recommendations',
        type: 'textarea',
        title: 'پیشنهادات و توصیه‌های شما برای بهبود',
        placeholder: 'هر پیشنهادی که به بهبود همکاری کمک می‌کند...',
        required: false
      }
    ]
  }
}

/**
 * تولید داینامیک کل پرسشنامه بر اساس انتخاب کاربر.
 * بخش ۱: کیفیت محصول (شرطی) – بخش ۲: کیفیت خدمات – و بخش‌های مشترک بعدی.
 * مرحله‌ی «اطلاعات اولیه» سند اصلی حذف شده است.
 */
export function buildSurveySteps(selection: SurveySelection): SurveyStep[] {
  return [
    buildQualityStep(selection.group),
    buildServiceStep(),
    buildPricingStep(),
    buildLoyaltyStep(selection.group),
    buildBrandStep(),
    buildSummaryStep()
  ]
}
