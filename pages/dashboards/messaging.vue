<script setup lang="ts">
definePageMeta({
  title: 'پیام‌رسانی',
  layout: 'empty',
  preview: {
    title: 'برنامه پیام‌رسان',
    description: 'برای اپلیکیشن‌های چت و پیام‌رسانی',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-messaging.png',
    srcDark: '/img/screens/dashboards-messaging-dark.png',
    order: 26,
  },
})

const { open } = usePanels()

const conversations = ref([
  {
    id: 1,
    user: {
      name: 'کلارک اسمیت',
      photo: '/img/avatars/3.svg',
      role: 'طراح UI/UX',
      bio: 'کلارک یک طراح UI/UX مستقر در نیویورک است و بیش از 10 سال تجربه در این زمینه دارد.',
      age: 32,
      location: 'نیویورک',
    },
    messages: [
      {
        type: 'separator',
        text: '',
        time: 'دیروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'سلام مایا، می‌خواستم بپرسم آیا هنوز آن طراحی که چند روز پیش برایم فرستادی را داری؟ قصد دارم از آن برای پروژه‌ای که در حال حاضر روی آن کار می‌کنم استفاده کنم.',
        time: '۱۰:۰۴ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'سلام کلارک، حتماً. همین حالا آن را برایت می‌فرستم. اگر به فایل فیگما هم نیاز داری، می‌توانم آن را هم بفرستم.',
        time: '۱۰:۰۹ ق.ظ',
        attachments: [
          {
            type: 'link',
            image: '/img/apps/1.png',
            url: 'https://tailwise.ir',
            text: 'فایل طراحی فیمگا توسط مایا',
          },
        ],
      },
      {
        type: 'separator',
        text: '',
        time: 'امروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'ممنون از آن. این کاملاً شگفت‌انگیز به نظر می‌رسد. اگر به چیز دیگری نیاز داشتم، به شما اطلاع خواهم داد.',
        time: '۱:۳۹ ب.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'تقریباً فراموش کردم، آن شرکت حسابداری که روز دیگر اشاره کردید چه بود؟ من به طراحی آن‌ها علاقه‌مند شدم.',
        time: '۱:۴۸ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'آه، بله، آن شرکت Titan حسابداری بود. آن‌ها شرکت بسیار خوبی هستند. من مدتی است که با آن‌ها همکاری می‌کنم.',
        time: '۲:۰۶ ب.ظ',
        attachments: [
          {
            type: 'link',
            image: '/img/apps/11.png',
            url: 'https://ideko.ir',
            text: 'حسابداری هوشمند برای همه آسان شده است',
          },
        ],
      },
      {
        type: 'received',
        text: 'بله، آن‌ها هستند. واقعاً برندینگ زیبایی دارند. من بررسی می‌کنم. ممنون ازراهنمایی!',
        time: '۲:۱۶ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'همیشه خوشحال به کمک! اگر به چیز دیگری نیاز داشتید، اطلاع دهید.',
        time: '۲:۲۶ ب.ظ',
        attachments: [],
      },
    ],
  },
  {
    id: 2,
    user: {
      name: 'هرمان مایر',
      photo: '/img/avatars/16.svg',
      role: 'مدیر پروژه',
      bio: 'هرمان مدیر پروژه‌ای مستقر در برلین است و بیش از 10 سال تجربه در این حوزه دارد.',
      age: 28,
      location: 'برلین',
    },
    messages: [
      {
        type: 'separator',
        text: '',
        time: 'دیروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'سلام مایا، آیا گزارش جان را دریافت کردی؟ من تازه آن را تأیید کردم، اما خواستم آن را به تو نشان دهم تا شاید نظری برای به اشتراک گذاشتن داشته باشی.',
        time: '۱۱:۰۴ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'بله، یک نسخه در صندوق ورودی‌ام دارم اما هنوز نتوانسته‌ام آن را بخوانم و یادداشت‌هایی بردارم.',
        time: '۱۱:۰۹ ق.ظ',
        attachments: [],
      },
      {
        type: 'separator',
        text: '',
        time: 'امروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'آیا وقت کردی آن را بخوانی؟ رئیس آن را درخواست کرده و من مطمئن نیستم که آیا باید آن را ارسال کنم یا خیر.',
        time: '۳:۳۹ ب.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'ببخشید اگر مزاحمتان شدم. 🫡',
        time: '۳:۴۸ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'نه، اینطور نباش! اصلاً مرا اذیت نمی‌کنی. من فقط کمی مشغول هستم. یادداشت‌هایم را برایت می‌فرستم و فکر نمی‌کنم چیزی وجود داشته باشد که مانع از نشان دادن آن به رئیس شود.',
        time: '۴:۰۶ ب.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'عالی است! خیلی ممنون مایا! واقعاً ازت سپاسگزارم. 🙏',
        time: '۴:۱۶ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'خواهش می‌کنم هرمان! اگر به چیز دیگری نیاز داشتید، اطلاع دهید.',
        time: '۴:۲۶ ب.ظ',
        attachments: [],
      },
    ],
  },
  {
    id: 3,
    user: {
      name: 'کلاریسا میلر',
      photo: '/img/avatars/5.svg',
      role: 'مدیر محصول',
      bio: 'کلاریسا مدیر محصولی مستقر در سیاتل است و بیش از 10 سال تجربه در این زمینه دارد.',
      age: 31,
      location: 'سیاتل',
    },
    messages: [
      {
        type: 'separator',
        text: '',
        time: 'دیروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'سلام مایا، رئیس دوباره بر روی من فشار می‌آورد. او می‌خواهد من گزارش را که چند روز پیش نوشتی برایش ارسال کنم. می‌خواستم بپرسم آیا هنوز آن طراحی که چند روز پیش برایم فرستادی را داری؟ قصد دارم از آن برای پروژه‌ای که در حال حاضر روی آن کار می‌کنم استفاده کنم.',
        time: '۱۱:۰۴ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'کلاریسا! حتماً، همین الان برایت ارسال می‌کنم. قرار نبود با هم ناهار بخوریم؟ اگر امروز وقت داری، می‌توانیم با هم یک لقمه‌ای بخوریم.',
        time: '۱۱:۰۹ ق.ظ',
        attachments: [],
      },
      {
        type: 'separator',
        text: '',
        time: 'امروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'بابت دیروز معذرت می‌خواهم، کاملاً غرق در کار بودم. امروز هم آزاد هستم. بیایید ساعت ۲ بعدازظهر غذایی بخوریم. آدرس را برایتان ارسال می‌کنم.',
        time: '۱:۰۹ ب.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'می‌خواهم آن رستوران کوچک سوشی که به شما گفتم را امتحان کنم. گرسنه‌ام!',
        time: '۱:۰۹ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'آه بله! بیایید سوشی بخوریم! من هم گرسنه‌ام. ساعت ۲ بعدازظهر می‌بینمت.',
        time: '۱:۱۲ ب.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'خیلی ممنون و دوباره بابت دیروز معذرت می‌خواهم. 🙏',
        time: '1:16 ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'نگران نباشید 😉 ',
        time: '۴:۲۶ ب.ظ',
        attachments: [],
      },
    ],
  },
  {
    id: 4,
    user: {
      name: 'جاشوا استیونس',
      photo: '/img/avatars/11.svg',
      role: 'توسعه‌دهنده فرانت‌اند',
      bio: 'جاشوا یک توسعه‌دهنده فرانت‌اند مستقر در لندن است. او بیش از 10 سال تجربه در این زمینه دارد',
      age: 43,
      location: 'لندن',
    },
    messages: [
      {
        type: 'separator',
        text: '',
        time: 'دیروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'سلام مایا، مشتری دوباره برای من مشکل ایجاد کرده است. او می‌خواهد من پیشنهادهایی که تو هفته گذشته روی آن کار کردی را ارائه دهم. آیا هنوز آن ارائه را داری؟ فکر می‌کنم از آن برای پروژه جدید استفاده کنم.',
        time: '۹:۰۴ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'هی، مشکلی نیست. هنوز آن را دارم. همین حالا آن را برایت می‌فرستم. امروز برای ناهار چی؟ من نزدیک ظهر آزاد هستم.',
        time: '۹:۰۹ ق.ظ',
        attachments: [],
      },
      {
        type: 'separator',
        text: '',
        time: 'امروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'بابت دیروز معذرت می‌خواهم، با کار غرق شده بودم. امروز هم آزاد هستم. بیایید ساعت ۱۲ ناهار بخوریم. در مرکز غذا دیدار می‌کنیم؟',
        time: '۱۱:۰۹ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'خوب به نظر می‌رسد. ساعت ۱۲ در مرکز غذا می‌بینمت.',
        time: '۱۱:۱۲ ق.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'ممنون از درکتان. و همچنین از ارسال پیشنهاد به من متشکرم. 🙏',
        time: '11:16 ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'مشکلی نیست. بیایید در ناهار بیشتر صحبت کنیم. 😉 ',
        time: '۱۲:۰۱ ب.ظ',
        attachments: [],
      },
    ],
  },
  {
    id: 5,
    user: {
      name: 'کندرا ویلسون',
      photo: '/img/avatars/10.svg',
      role: 'توسعه‌دهنده بک‌اند',
      bio: 'کندرا یک توسعه‌دهنده بک‌اند مستقر در تورنتو است. او بیش از ۱۰ سال تجربه در این حوزه دارد.',
      age: 26,
      location: 'تورنتو',
    },
    messages: [
      {
        type: 'separator',
        text: '',
        time: 'دیروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'سلام، می‌خواستم بازخوردت را درباره طراحی جدید رابط کاربری صفحه ورود بگیرم. تغییراتی براساس داده‌های تست کاربری هفته گذشته اعمال کرده‌ام.',
        time: '۴:۰۴ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'حتماً، الآن آن را بررسی می‌کنم. می‌توانی نسخه به‌روزرسانی شده را برایم بفرستی؟',
        time: '4:09 ب.ظ',
        attachments: [],
      },
      {
        type: 'separator',
        text: '',
        time: 'امروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'نسخه به‌روز شده را برایت ارسال کرده‌ام. همچنین چند یادداشت در مورد تغییراتی که انجام داده‌ام اضافه کرده‌ام.',
        time: '۹:۰۰ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'ممنون، الان به آن نگاهی می‌اندازم.',
        time: '۹:۰۱ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'فکر می‌کنم به‌روزرسانی‌ها عالی به نظر می‌رسند. به‌ویژه طرح رنگ جدید را دوست دارم. اما فکر می‌کنم باید افکت‌های هاور به دکمه‌ها اضافه کنیم تا تعامل‌پذیرتر شوند.',
        time: '9:15 ق.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'ممنون از بازخوردت، افکت‌های شناور را به دکمه‌ها اضافه می‌کنم. آیا بعداً وقت داری برای بحث در مورد سایر تغییرات ملاقات کنیم؟',
        time: '9:20 ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'البته، بیایید جلسه را برای ساعت ۱ بعدازظهر امروز تنظیم کنیم.',
        time: '9:22 ق.ظ',
        attachments: [],
      },
    ],
  },
  {
    id: 6,
    user: {
      name: 'کارولین کاتمن',
      photo: '/img/avatars/9.svg',
      role: 'مدیر محصول',
      bio: 'کارولین مدیر محصولی مستقر در پاریس است و بیش از 10 سال تجربه در این زمینه دارد.',
      age: 25,
      location: 'پاریس',
    },
    messages: [
      {
        type: 'separator',
        text: '',
        time: 'دیروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'سلام، آیا فرصتی داشتی که گزارش تحقیقات بازار برای عرضه محصول جدید را بررسی کنی؟',
        time: '۴:۰۴ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'بله، آن را بررسی کرده‌ام. داده‌ها امیدوارکننده به نظر می‌رسند. باید یک جلسه برای بحث درباره مراحل بعدی تنظیم کنیم.',
        time: '4:09 ب.ظ',
        attachments: [],
      },
      {
        type: 'separator',
        text: '',
        time: 'امروز',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'من جلسه‌ای را برای فردا ساعت ۱۰ صبح برنامه‌ریزی کرده‌ام تا درباره استراتژی عرضه محصول جدید صحبت کنیم. می‌توانی آخرین نسخه نقشه راه محصول را قبل از جلسه برایم بفرستی؟',
        time: '۹:۰۰ ق.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'حتماً، همین حالا آن را برایت می‌فرستم.',
        time: '۹:۰۱ ق.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'من نقشه راه محصول به‌روز شده را برایت ارسال کرده‌ام. همچنین چند یادداشت در مورد تغییراتی که بر اساس تحقیقات بازار اعمال کرده‌ام اضافه کرده‌ام.',
        time: '9:05 ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'ممنون، قبل از جلسه فردا آن را بررسی می‌کنم.',
        time: '9:06 ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'فقط یک یادآوری، جلسه فردا ساعت ۱۰ صبح در اتاق کنفرانس است.',
        time: '4:22 ب.ظ',
        attachments: [],
      },
    ],
  },
  {
    id: 7,
    user: {
      name: 'جاناتان کپلر',
      photo: '/img/avatars/8.svg',
      role: 'مدیر سیستم',
      bio: 'جاناتان مدیر سیستم مستقر در میامی است و بیش از 10 سال تجربه در این زمینه دارد.',
      age: 41,
      location: 'میامی',
    },
    messages: [
      {
        type: 'separator',
        text: '',
        time: 'دیروز',
        attachments: [],
      },
      {
        type: 'received',
        text: 'سلام، آیا اخیراً رفتار عجیبی با سرور مشاهده کرده‌اید؟',
        time: '2:04 ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'بله، من گزارش‌هایی درباره زمان‌های پاسخ‌دهی کند دریافت کرده‌ام. شروع به تحقیق کرده‌ام اما هنوز علت اصلی را پیدا نکرده‌ام.',
        time: '2:09 ب.ظ',
        attachments: [],
      },
      {
        type: 'separator',
        text: '',
        time: 'امروز',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'متوجه شدم که فضای دیسک سرور تقریباً پر شده است. قصد دارم امشب یک بازه نگهداری برنامه‌ریزی کنم تا فضای ذخیره‌سازی بیشتری اضافه کنم.',
        time: '۹:۰۰ ق.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'باشه، مطمئن می‌شوم تیم را مطلع کنم و هر زمان از کار افتادن مورد نیاز را برنامه‌ریزی کنم.',
        time: '۹:۰۱ صبح',
        attachments: [],
      },
      {
        type: 'received',
        text: 'من ایمیلی به تیم ارسال کرده‌ام و یک زمان تعمیراتی دو ساعته از ساعت 11 شب امروز برنامه‌ریزی کرده‌ام. آیا این زمان برایت مناسب است؟',
        time: '9:05 صبح',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'بله، برای من مناسب است. مطمئن می‌شوم که همه چیز قبل از بازه نگهداری تنظیم شده باشد.',
        time: '9:06 صبح',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'من فضای ذخیره‌سازی را اضافه کرده‌ام و سرور دوباره به‌طور روان کار می‌کند. آن را زیر نظر خواهم داشت و اگر مشکلی پیش آمد، به شما اطلاع خواهم داد.',
        time: '2:22 ب.ظ',
        attachments: [],
      },
    ],
  },
])

const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const loading = ref(false)
const search = ref('')
const message = ref('')
const messageLoading = ref(false)
const activeConversation = ref(1)

const selectedConversation = computed(() => {
  return conversations.value.find(
    conversation => conversation.id === activeConversation.value,
  )
})

onMounted(() => {
  setTimeout(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 300)
})

function selectConversation(id: number) {
  if (messageLoading.value) return

  loading.value = true
  message.value = ''

  setTimeout(() => {
    activeConversation.value = id
    loading.value = false
    setTimeout(() => {
      expanded.value = false

      if (chatEl.value) {
        chatEl.value.scrollTo({
          top: chatEl.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 300)
  }, 1000)
}

async function submitMessage() {
  if (!message.value) return
  if (messageLoading.value) return

  messageLoading.value = true

  const newMessage = {
    type: 'sent',
    text: message.value,
    time: 'هم اکنون',
    attachments: [],
  }

  const index = conversations.value.findIndex(
    conversation => conversation.id === activeConversation.value,
  )

  await new Promise(resolve => setTimeout(resolve, 200))

  conversations.value[index].messages.push(newMessage)
  message.value = ''
  messageLoading.value = false

  await nextTick()

  if (chatEl.value) {
    chatEl.value.scrollTo({
      top: chatEl.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <div class="relative">
    <div class="bg-muted-100 dark:bg-muted-900 flex min-h-screen">
      <!-- Sidebar -->
      <div
        class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-10 hidden h-screen w-20 border-e bg-white sm:block"
      >
        <div class="flex h-full flex-col justify-between">
          <div class="flex flex-col">
            <div
              class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
            >
              <NuxtLink to="#" class="flex items-center justify-center">
                <TairoLogo class="text-primary-600 h-10" />
              </NuxtLink>
            </div>
            <div
              class="ltablet:w-full flex size-16 shrink-0 items-center justify-center lg:w-full"
            >
              <a
                href="#"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="بازگشت"
                @click.prevent="$router.back()"
              >
                <Icon name="lucide:arrow-left" class="size-5 rtl:rotate-180" />
              </a>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex h-16 w-full items-center justify-center">
              <button
                type="button"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="جستجو"
                @click="open('search')"
              >
                <Icon name="ph:magnifying-glass-duotone" class="size-5" />
              </button>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <NuxtLink
                to="#"
                class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
                title="تنظیمات"
              >
                <Icon name="ph:gear-six-duotone" class="size-5" />
              </NuxtLink>
            </div>
            <div class="flex h-16 w-full items-center justify-center">
              <DemoAccountMenu />
            </div>
          </div>
        </div>
      </div>
      <!-- Conversations -->
      <div
        class="ltablet:border-e border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative z-[9] h-screen w-16 bg-white sm:w-20 lg:border-e"
      >
        <div class="flex h-full flex-col">
          <button
            class="flex size-16 shrink-0 items-center justify-center sm:w-20"
          >
            <span
              class="bg-primary-500 flex size-10 items-center justify-center rounded-full text-white"
            >
              <Icon name="lucide:plus" class="size-4" />
            </span>
          </button>
          <!-- List -->
          <a
            v-for="conversation in conversations"
            :key="conversation.id"
            href="#"
            class="flex size-16 shrink-0 items-center justify-center border-s-2 sm:w-20"
            :class="
              activeConversation === conversation.id
                ? 'border-primary-500'
                : 'border-transparent'
            "
            @click.prevent="selectConversation(conversation.id)"
          >
            <BaseAvatar :src="conversation.user.photo" size="sm" />
          </a>
        </div>
      </div>
      <!-- Current conversation -->
      <div
        class="relative w-full transition-all duration-300"
        :class="
          expanded
            ? 'ltablet:max-w-[calc(100%_-_160px)] lg:max-w-[calc(100%_-_160px)]'
            : 'ltablet:max-w-[calc(100%_-_470px)] lg:max-w-[calc(100%_-_550px)]'
        "
      >
        <div class="flex w-full flex-col">
          <!-- Header -->
          <div
            class="flex h-16 w-full items-center justify-between px-4 sm:px-8"
          >
            <div class="flex items-center gap-2">
              <BaseInput
                v-model="search"
                rounded="lg"
                icon="lucide:search"
                placeholder="جستجو"
              />
            </div>

            <TairoSidebarTools
              class="relative -end-4 z-20 flex h-16 w-full scale-90 items-center justify-end gap-2 sm:end-0 sm:scale-100"
            />
          </div>
          <!-- Body -->
          <div
            ref="chatEl"
            class="relative h-[calc(100vh_-_128px)] w-full p-4 sm:p-8"
            :class="
              loading ? 'overflow-hidden' : 'overflow-y-auto nui-slimscroll'
            "
          >
            <!-- Loader-->
            <div
              class="bg-muted-100 dark:bg-muted-900 pointer-events-none absolute inset-0 z-10 size-full p-8 transition-opacity duration-300"
              :class="loading ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
              <div class="mt-12 space-y-12">
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-56 rounded" />
                    <BasePlaceload class="h-3 w-full max-w-32 rounded" />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-64 rounded" />
                    <BasePlaceload class="h-3 w-full max-w-48 rounded" />
                  </div>
                </div>
                <div
                  class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4"
                >
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-64 rounded"
                    />
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-48 rounded"
                    />
                  </div>
                </div>
                <div
                  class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4"
                >
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-56 rounded"
                    />
                    <BasePlaceload
                      class="ms-auto h-3 w-full max-w-32 rounded"
                    />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-56 rounded" />
                    <BasePlaceload class="h-3 w-full max-w-32 rounded" />
                  </div>
                </div>
                <div class="flex w-full max-w-md gap-4">
                  <BasePlaceload
                    class="size-8 shrink-0 rounded-full"
                    :width="32"
                    :height="32"
                  />
                  <div class="grow space-y-2">
                    <BasePlaceload class="h-3 w-full max-w-64 rounded" />
                    <BasePlaceload class="h-3 w-full max-w-48 rounded" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Messages loop -->
            <div v-if="!loading" class="space-y-12">
              <div
                v-for="(item, index) in selectedConversation?.messages"
                :key="index"
                class="relative flex w-full gap-4"
                :class="[
                  item.type === 'received' ? 'flex-row' : 'flex-row-reverse',
                  item.type === 'separator' ? 'justify-center' : '',
                ]"
              >
                <template v-if="item.type !== 'separator'">
                  <div class="shrink-0">
                    <BaseAvatar
                      v-if="item.type === 'received'"
                      :src="selectedConversation?.user.photo"
                      size="xs"
                    />
                    <BaseAvatar
                      v-else-if="item.type === 'sent'"
                      src="/img/avatars/2.svg"
                      size="xs"
                    />
                  </div>
                  <div class="flex max-w-md flex-col">
                    <div
                      class="bg-muted-200 dark:bg-muted-800 rounded-xl p-4"
                      :class="[
                        item.type === 'received' ? 'rounded-ss-none' : '',
                        item.type === 'sent' ? 'rounded-se-none' : '',
                      ]"
                    >
                      <p class="font-sans text-sm">
                        {{ item.text }}
                      </p>
                    </div>
                    <div
                      class="text-muted-400 mt-1 font-sans text-xs"
                      :class="item.type === 'received' ? 'text-right' : ''"
                    >
                      {{ item.time }}
                    </div>
                    <div
                      v-if="item.attachments.length > 0"
                      class="mt-2 space-y-2"
                    >
                      <template
                        v-for="(attachment, idx) in item.attachments"
                        :key="idx"
                      >
                        <div
                          v-if="attachment.type === 'image'"
                          class="dark:bg-muted-800 max-w-xs rounded-2xl bg-white p-2"
                          :class="item.type === 'sent' ? 'ms-auto' : ''"
                        >
                          <img
                            :src="attachment.image"
                            :alt="attachment.text"
                            class="rounded-xl"
                          >
                        </div>
                        <NuxtLink
                          v-else-if="attachment.type === 'link'"
                          :to="attachment.url"
                          class="dark:bg-muted-800 block max-w-xs rounded-2xl bg-white p-2"
                          :class="item.type === 'sent' ? 'ms-auto' : ''"
                        >
                          <img
                            :src="attachment.image"
                            :alt="attachment.text"
                            class="rounded-xl"
                          >
                          <div class="px-1 py-2">
                            <p
                              class="text-muted-800 dark:text-muted-100 font-sans"
                            >
                              {{ attachment.url?.replace(/(^\w+:|^)\/\//, '') }}
                            </p>
                            <p class="text-muted-400 font-sans text-xs">
                              {{ attachment.text }}
                            </p>
                          </div>
                        </NuxtLink>
                      </template>
                    </div>
                  </div>
                </template>
                <div v-else>
                  <div
                    class="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div
                      class="border-muted-300/50 dark:border-muted-800 w-full border-t"
                    />
                  </div>
                  <div class="relative flex justify-center">
                    <span
                      class="bg-muted-100 dark:bg-muted-900 text-muted-400 px-3 font-sans text-xs uppercase"
                    >
                      {{ item.time }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Compose -->
          <form
            method="POST"
            action=""
            class="bg-muted-100 dark:bg-muted-900 flex h-16 w-full items-center px-4 sm:px-8"
            @submit.prevent="submitMessage"
          >
            <div class="relative w-full">
              <BaseInput
                v-model.trim="message"
                :disabled="messageLoading"
                rounded="full"
                :classes="{
                  input: 'h-12 ps-6 pe-24',
                }"
                placeholder="نوشتن پیام..."
              />
              <div class="absolute end-2 top-0 flex h-10 items-center gap-1">
                <button
                  type="button"
                  class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                >
                  <Icon name="lucide:smile" class="size-5" />
                </button>
                <button
                  type="button"
                  class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                >
                  <Icon name="lucide:paperclip" class="size-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Current user -->
      <div
        class="ltablet:w-[310px] dark:bg-muted-800 fixed end-0 top-0 z-20 h-full w-[390px] bg-white transition-transform duration-300"
        :class="expanded ? 'ltr:translate-x-full rtl:-translate-x-full' : 'translate-x-0'"
      >
        <div class="flex h-16 w-full items-center justify-between px-8">
          <BaseHeading
            tag="h3"
            size="lg"
            class="text-muted-800 dark:text-white"
          >
            <span>جزئیات کاربر</span>
          </BaseHeading>
          <BaseButtonIcon small @click="expanded = true">
            <Icon
              name="lucide:arrow-right"
              class="pointer-events-none size-4 rtl:rotate-180"
            />
          </BaseButtonIcon>
        </div>
        <div class="relative flex w-full flex-col px-8">
          <!-- Loader -->
          <div v-if="loading" class="mt-8">
            <div class="mb-3 flex items-center justify-center">
              <BasePlaceload
                class="size-24 shrink-0 rounded-full"
                :width="96"
                :height="96"
              />
            </div>
            <div class="flex flex-col items-center">
              <BasePlaceload class="mb-2 h-3 w-full max-w-40 rounded" />
              <BasePlaceload class="mb-2 h-3 w-full max-w-24 rounded" />
              <div class="my-4 flex w-full flex-col items-center">
                <BasePlaceload class="mb-2 h-2 w-full max-w-60 rounded" />
                <BasePlaceload class="mb-2 h-2 w-full max-w-52 rounded" />
              </div>
              <div class="mb-6 flex w-full items-center justify-center">
                <div class="px-4">
                  <BasePlaceload class="h-3 w-14 rounded" />
                </div>
                <div class="px-4">
                  <BasePlaceload class="h-3 w-14 rounded" />
                </div>
              </div>
              <div class="w-full">
                <BasePlaceload class="h-10 w-full rounded-xl" />
                <BasePlaceload class="mx-auto mt-3 h-3 w-[7.5rem] rounded" />
              </div>
            </div>
          </div>
          <!-- User details -->
          <div v-else class="mt-8">
            <div class="flex items-center justify-center">
              <BaseAvatar :src="selectedConversation?.user.photo" size="2xl" />
            </div>
            <div class="text-center">
              <BaseHeading
                tag="h3"
                size="lg"
                class="mt-4"
              >
                <span>{{ selectedConversation?.user.name }}</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                <span>{{ selectedConversation?.user.role }}</span>
              </BaseParagraph>
              <div class="my-4">
                <BaseParagraph
                  size="sm"
                  class="text-muted-500 dark:text-muted-400"
                >
                  <span>{{ selectedConversation?.user.bio }}</span>
                </BaseParagraph>
              </div>
              <div
                class="divide-muted-200 dark:divide-muted-700 flex items-center justify-center divide-x rtl:divide-x-reverse"
              >
                <div class="flex items-center justify-center gap-2 px-4">
                  <Icon
                    name="ph:timer-duotone"
                    class="text-muted-400 size-4"
                  />
                  <span class="text-muted-400 font-sans text-xs">
                    سن: {{ selectedConversation?.user.age }}
                  </span>
                </div>
                <div class="flex items-center justify-center gap-2 px-4">
                  <Icon
                    name="ph:map-pin-duotone"
                    class="text-muted-400 size-4"
                  />
                  <span class="text-muted-400 font-sans text-xs">
                    {{ selectedConversation?.user.location }}
                  </span>
                </div>
              </div>
              <div class="mt-6">
                <BaseButton rounded="lg" class="w-full">
                  <span>
                    پروفایل {{ selectedConversation?.user.name }} را مشاهده کنید
                  </span>
                </BaseButton>
                <button
                  type="button"
                  class="text-primary-500 mt-3 font-sans text-sm underline-offset-4 hover:underline"
                >
                  ارسال درخواست دوستی
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
