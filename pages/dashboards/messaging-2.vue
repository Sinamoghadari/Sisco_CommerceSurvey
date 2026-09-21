<script setup lang="ts">
definePageMeta({
  title: 'پیام‌رسانی',
  layout: 'empty',
  preview: {
    title: 'برنامه پیام‌رسان',
    description: 'برای گفتگوها و چت‌ها',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-messaging-2.png',
    srcDark: '/img/screens/dashboards-messaging-2-dark.png',
    order: 26,
    new: true,
  },
})

const conversations = ref([
  {
    id: 1,
    user: {
      name: 'کالب ویلسون',
      photo: '/img/avatars/3.svg',
      role: 'تماس شخصی',
      bio: 'کالیب یکی از اعضای خانواده است که تحت همان حساب ثبت شده است.',
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
        text: 'سلام مامان، می‌خواستم بدانم آیا هنوز آن عکسی که چند روز پیش برایم فرستادی را داری؟ من فکر می‌کردم از آن برای پروژه‌ای که روی آن کار می‌کنم استفاده کنم.',
        time: '۱۰:۰۴ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'سلام کالیب، حتماً. همین حالا برایتان ارسال می‌کنم. اگر نیاز دارید می‌توانم لینک وب‌سایت را نیز برایتان ارسال کنم.',
        time: '۱۰:۰۹ ق.ظ',
        attachments: [
          {
            type: 'link',
            image: '/img/apps/5.png',
            url: 'https://mizzle.eltheme.ir',
            text: 'نرم‌افزار بازاریابی اورتو',
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
        text: 'آه بله، آن بانک Qonto بود. آن‌ها شرکت عالی هستند. مدتی است که با آن‌ها کار می‌کنم.',
        time: '۲:۰۶ ب.ظ',
        attachments: [
          {
            type: 'link',
            image: '/img/apps/2.png',
            url: 'https://nephos.ir',
            text: 'نرم‌افزار بانکی',
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
      role: 'مشاور بانکی',
      bio: 'هرمان یکی از مشاوران بانکی ما است. هر سوالی دارید بپرسید.',
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
        text: 'سلام خانم ویلسون، آیا آن گزارش حسابی که صادر کردیم را دریافت کردید؟ من تازه آن را تأیید کردم ولی می‌خواستم آن را به شما نشان دهم، شاید نظراتی برای به اشتراک گذاشتن داشته باشید.',
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
        text: 'آیا وقت داشتید آن را بخوانید؟ مدیرم از من بازبینی نهایی را درخواست کرده است، بنابراین به بازخوردی نیاز دارم.',
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
        text: 'نه، اینطور نباشید! شما اصلاً من را آزار نمی‌دهید. من فقط الان کمی مشغول هستم. یادداشت‌های خود را برایتان ارسال می‌کنم، اما بله، چیزی نمی‌بینم که مانع از نشان دادن آن به مدیرتان شود.',
        time: '۴:۰۶ ب.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'Aعالی! خیلی ممنون خانم ویلسون! واقعاً از شما متشکرم. 🙏',
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
      name: 'ادوارد فلین',
      photo: '/img/avatars/14.svg',
      role: 'همکار بازاریابی',
      bio: 'ادوارد یکی از همکاران بازاریابی ما است. هر سوالی در مورد پیشنهادات ما دارید از او بپرسید.',
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
        text: 'سلام خانم ویلسون، مدیریت من دوباره به من فشار می‌آورد. آن‌ها می‌خواهند بدانند آیا تصمیم نهایی خود را در مورد اشتراک شما در برنامه مالی جدید ما گرفته‌اید یا خیر.',
        time: '۱۱:۰۴ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'سلام آقای فلین! حتماً. من در حال بررسی آن هستم. قرار نبود دیروز ناهار داشته باشیم؟ امروز آزاد هستم اگر بخواهید غذایی بخوریم.',
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
        text: 'نگران نباشید 😉. بیایید این معامله را تمام کنیم تا به کارهای دیگر بپردازیم. ',
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
      role: 'مشاور بانکی',
      bio: 'یوشوا یکی از مشاوران بانکی ما است. هر سوالی در مورد حساب خود دارید از او بپرسید.',
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
        text: 'سلام خانم ویلسون، مشتری دوباره به من مشکل ایجاد کرده است. او می‌خواهد که من پیشنهاد را که شما هفته گذشته روی آن کار کردید ارائه دهم. آیا هنوز آن ارائه را دارید؟ من فکر می‌کردم از آن برای این پروژه جدید استفاده کنم.',
        time: '۹:۰۴ ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'سلام یوشوا، مشکلی نیست. هنوز آن را دارم. همین حالا برایتان ارسال می‌کنم. چطور است امروز ناهار بخوریم؟ من حدود ظهر آزاد هستم.',
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
      name: 'جنیفر ویلسون',
      photo: '/img/avatars/12.svg',
      role: 'تماس شخصی',
      bio: 'جنیفر یکی از اعضای خانواده است که تحت همان حساب ثبت شده است.',
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
        text: 'سلام کندرا، می‌خواستم در مورد هزینه‌هایم مشاوره بگیرم. به‌روزرسانی‌هایی را در حسابم دیده‌ام که خیلی مرا خوشحال نکرده است.',
        time: '۴:۰۴ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'حتماً، الان به آن نگاهی می‌اندازم. می‌توانید لاگ به‌روز شده را برایم ارسال کنید؟',
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
        text: 'من لاگ به‌روز شده را برایتان ارسال کرده‌ام. همچنین برخی یادداشت‌ها و فاکتورها را که داشتم، ضمیمه کرده‌ام.',
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
        text: 'فکر می‌کنم شما بیش از حد برای پوشاک و رستوران‌ها خرج می‌کنید. حتماً باید در این موارد کاهش دهید.',
        time: '9:15 ق.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'ممنون بابت بازخورد، بله می‌دانم که زیاد خرج کرده‌ام. سعی می‌کنم کمی کاهش دهم.',
        time: '9:20 ق.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'حتماً، می‌دانم که می‌توانید مدیریت کنید.',
        time: '9:22 ق.ظ',
        attachments: [],
      },
    ],
  },
  {
    id: 6,
    user: {
      name: 'امبر ویلسون',
      photo: '/img/avatars/24.svg',
      role: 'تماس شخصی',
      bio: 'آمبر یکی از اعضای خانواده است که تحت همان حساب ثبت شده است.',
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
        text: 'سلام مامان، الان واقعاً در مشکل هستم، به کمک شما نیاز دارم.',
        time: '۴:۰۴ ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'چه خبر است؟ آیا مشکلی با حساب بانکی‌تان دارید؟',
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
        text: 'نه اینکه اخیراً پولی برایتان نفرستاده باشیم. چه خبر است؟',
        time: '۹:۰۰ ق.ظ',
        attachments: [],
      },
      {
        type: 'received',
        text: 'بله، فکر می‌کنم کمی بیش از حد خرج کرده‌ام، اما فقط کمی.',
        time: '۹:۰۱ صبح',
        attachments: [],
      },
      {
        type: 'received',
        text: 'به حسابم نگاه کردم و کمی شوکه شدم.',
        time: '9:05 صبح',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'خدا را شکر، پدرت دوباره عصبانی خواهد شد.',
        time: '9:06 صبح',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'من خودم به این موضوع رسیدگی می‌کنم و یک انتقال نقدی سریع برایتان ارسال می‌کنم.',
        time: '4:22 ب.ظ',
        attachments: [],
      },
    ],
  },
  {
    id: 7,
    user: {
      name: 'جان باکستر',
      photo: '/img/avatars/8.svg',
      role: 'تماس شخصی',
      bio: 'جان یکی از اعضای خانواده است که تحت همان حساب ثبت شده است.',
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
        text: 'سلام عزیز، آیا اخیراً هنگام صحبت با آمبر رفتار عجیبی مشاهده کرده‌اید؟',
        time: '2:04 ب.ظ',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'بله، با او صحبت کرده‌ام و به نظر می‌رسد که کمی با حساب خود دچار مشکل شده است.',
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
        text: 'فکر می‌کنم کمی زیاد خرج کرده است، می‌دانید که دخترتان چگونه است.',
        time: '۹:۰۰ صبح',
        attachments: [],
      },
      {
        type: 'received',
        text: 'دوباره؟ آن دختر واقعاً باید یاد بگیرد چگونه پول خود را مدیریت کند. با او صحبت می‌کنم.',
        time: '۹:۰۱ صبح',
        attachments: [],
      },
      {
        type: 'received',
        text: 'آیا باید با او تماس بگیرم؟',
        time: '9:05 صبح',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'نه، من قبلاً به آن رسیدگی کرده‌ام. سعی می‌کنم نگذارم با امتحانات پایانی‌اش به هم بریزد.',
        time: '9:06 صبح',
        attachments: [],
      },
      {
        type: 'sent',
        text: 'چند صد تومان ارسال کرده‌ام تا برای این ماه جبران کند.',
        time: '2:22 ب.ظ',
        attachments: [],
      },
    ],
  },
])

const searchMessages = ref('')
const selectedOption = ref('chat')
const mobileOpen = ref(false)

const chatEl = ref<HTMLElement>()
const expanded = ref(false)
const loading = ref(false)
const search = ref('')
const message = ref('')
const messageLoading = ref(false)
const activeConversation = ref(1)

const selectedConversation = computed(() => {
  mobileOpen.value = false
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
  <div class="text-muted-800 h-screen antialiased">
    <!--Header-->
    <div
      class="ltablet:z-30 border-muted-200 dark:border-muted-800 dark:bg-muted-950 relative flex h-16 w-full items-center justify-between border-b bg-white px-4 lg:z-30"
      :class="mobileOpen ? 'z-20' : 'z-30'"
    >
      <div class="flex w-1/2 items-center gap-2 sm:w-1/5">
        <!-- Hamburger -->
        <button
          class="ltablet:hidden relative flex size-10 items-center justify-center lg:hidden"
          @click="mobileOpen = !mobileOpen"
        >
          <div
            class="start-6 top-1/2 block w-4 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2"
          >
            <span
              class="text-primary-500 absolute block h-0.5 w-6 bg-current transition duration-500 ease-in-out"
              :class="mobileOpen ? 'rotate-45' : '-translate-y-2'"
            />
            <span
              class="text-primary-500 absolute block h-0.5 w-5 bg-current transition duration-500 ease-in-out"
              :class="mobileOpen ? 'opacity-0' : ''"
            />
            <span
              class="text-primary-500 absolute block h-0.5 w-6 bg-current transition duration-500 ease-in-out"
              :class="mobileOpen ? '-rotate-45' : 'translate-y-2'"
            />
          </div>
        </button>
        <NuxtLink
          to="/"
          class="ltablet:flex hidden items-center gap-2 lg:flex"
          aria-label="رفتن به صفحه اول تایرو"
        >
          <TairoLogoText class="text-primary-500 h-6 dark:text-white" />
        </NuxtLink>
      </div>
      <div
        class="ltablet:max-w-sm mx-auto hidden max-w-xs grow sm:block lg:max-w-xl"
      >
        <BaseInput
          v-model="searchMessages"
          rounded="lg"
          icon="lucide:search"
          placeholder="پیام‌ها را جستجو کنید..."
          :classes="{
            input: '!h-11 !ps-11',
            icon: '!h-11 !w-11',
          }"
        />
      </div>
      <div class="flex w-1/2 items-center justify-end gap-4 sm:w-1/5">
        <DemoThemeSwitch />
        <DemoAccountMenu horizontal />
      </div>
    </div>
    <!--Wrapper-->
    <div
      class="relative z-20 flex h-[calc(100dvh_-_64px)] w-full flex-row overflow-x-hidden"
    >
      <!--Conversations sidebar-->
      <div
        class="ltablet:static ltablet:py-4 dark:bg-muted-900 ltablet:dark:bg-muted-950 lg:dark:bg-muted-950 fixed start-0 top-0 z-30 flex h-full w-72 shrink-0 flex-col bg-white ps-4 transition-transform duration-300 lg:static lg:py-4"
        :class="
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full ltablet:translate-x-0 lg:translate-x-0'
        "
      >
        <!--Mobile header-->
        <div
          class="ltablet:hidden flex h-16 items-center justify-between pe-4 lg:hidden"
        >
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
            aria-label="Go to Tairo homepage"
          >
            <TairoLogo class="text-muted-800 h-9 dark:text-white" />
            <TairoLogoText class="text-muted-800 h-3 dark:text-white" />
          </NuxtLink>
          <BaseButtonClose
            color="muted"
            rounded="lg"
            @click="mobileOpen = false"
          />
        </div>
        <div class="ltablet:pe-0 flex h-full flex-col pe-2 lg:pe-0">
          <!--New conversation-->
          <div class="flex h-20 items-center justify-center pe-2">
            <BaseButton
              rounded="full"
              color="primary"
              class="w-full"
            >
              <Icon name="lucide:plus" class="size-4" />
              <span>گفتگوی جدید</span>
            </BaseButton>
          </div>
          <!--Conversations list-->
          <div
            class="nui-slimscroll flex h-[calc(100dvh_-_160px)] flex-col space-y-1 overflow-y-auto pe-2"
          >
            <button
              v-for="conversation in conversations"
              :key="conversation.id"
              class="flex items-center gap-2 rounded-xl p-2 transition-colors duration-200 ease-in-out"
              :class="
                activeConversation === conversation.id
                  ? 'bg-primary-500/10'
                  : 'hover:bg-muted-100 dark:hover:bg-muted-900'
              "
              @click.prevent="selectConversation(conversation.id)"
            >
              <BaseAvatar :src="conversation.user.photo" />
              <BaseText
                size="sm"
                :class="
                  activeConversation === conversation.id
                    ? 'text-primary-500'
                    : 'text-muted-500 dark:text-muted-400'
                "
              >
                {{ conversation.user.name }}
              </BaseText>
              <span
                class="bg-primary-500 me-3 ms-auto block size-2 rounded-full transition-opacity duration-300"
                :class="
                  activeConversation === conversation.id
                    ? 'opacity-100'
                    : 'opacity-0'
                "
              />
            </button>
          </div>
          <!--Footer actions-->
          <div class="flex h-20 items-center justify-between gap-3 pe-2">
            <NuxtLink
              to="/dashboards"
              class="text-muted-500 dark:text-muted-400 hover:text-primary-500 border-muted-200 dark:border-muted-800 hover:border-primary-500 flex size-12 items-center justify-center rounded-xl border transition-colors duration-200 dark:hover:border-purple-500 dark:hover:text-purple-500"
            >
              <Icon name="ion:arrow-back-outline" class="size-4 rtl:rotate-180" />
            </NuxtLink>
            <button
              class="flex size-12 items-center justify-center rounded-xl transition-colors duration-200"
              :class="
                selectedOption === 'chat'
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'bg-muted-50 hover:bg-muted-100 dark:bg-muted-900 dark:hover:bg-muted-800 text-muted-500'
              "
              data-nui-tooltip="پیام‌رسانی"
              @click="selectedOption = 'chat'"
            >
              <Icon name="ion:chatbubble-outline" class="size-5" />
            </button>
            <button
              class="flex size-12 items-center justify-center rounded-xl transition-colors duration-200"
              :class="
                selectedOption === 'calendar'
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'bg-muted-50 hover:bg-muted-100 dark:bg-muted-900 dark:hover:bg-muted-800 text-muted-500'
              "
              data-nui-tooltip="تقویم"
              @click="selectedOption = 'calendar'"
            >
              <Icon name="ion:calendar-outline" class="size-5" />
            </button>
            <button
              class="flex size-12 items-center justify-center rounded-xl transition-colors duration-200"
              :class="
                selectedOption === 'settings'
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'bg-muted-50 hover:bg-muted-100 dark:bg-muted-900 dark:hover:bg-muted-800 text-muted-500'
              "
              data-nui-tooltip="تنظیمات"
              @click="selectedOption = 'settings'"
            >
              <Icon name="ion:options-outline" class="size-5" />
            </button>
          </div>
        </div>
      </div>

      <!--Chat body-->
      <div
        class="dark:bg-muted-950 flex h-full flex-auto flex-col bg-white p-4"
      >
        <div
          class="bg-muted-100 dark:bg-muted-900 flex h-full flex-auto shrink-0 flex-col overflow-hidden rounded-2xl"
        >
          <div class="relative flex h-full flex-col">
            <div
              ref="chatEl"
              class="relative flex h-full flex-col px-4 pb-24 pt-12"
              :class="
                loading ? 'overflow-hidden' : 'overflow-y-auto nui-slimscroll'
              "
            >
              <!-- Loader-->
              <div
                class="bg-muted-100 dark:bg-muted-900 pointer-events-none absolute inset-0 z-10 size-full p-8 transition-opacity duration-300"
                :class="
                  loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                "
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
                        class="text-muted-800 dark:text-muted-200 rounded-xl p-4"
                        :class="[
                          item.type === 'received'
                            ? 'bg-muted-200 dark:bg-muted-950 rounded-ss-none'
                            : '',
                          item.type === 'sent'
                            ? 'bg-primary-500/20 rounded-se-none'
                            : '',
                        ]"
                      >
                        <p class="font-sans text-sm">
                          {{ item.text }}
                        </p>
                      </div>
                      <div
                        class="text-muted-400 mt-1 font-sans text-xs"
                        :class="item.type === 'received' ? 'text-end' : ''"
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
                            class="dark:bg-muted-950 block max-w-xs rounded-2xl bg-white p-2"
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
                                {{
                                  attachment.url?.replace(/(^\w+:|^)\/\//, '')
                                }}
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
            <!--Compose-->
            <div class="absolute inset-x-0 bottom-4 w-full px-4">
              <form
                method="POST"
                action=""
                class="dark:bg-muted-950 flex h-16 flex-row items-center gap-2 rounded-xl bg-white px-3"
                @submit.prevent="submitMessage"
              >
                <div class="hidden sm:block">
                  <button
                    class="hover:bg-muted-100 dark:hover:bg-muted-900 text-muted-400 hover:text-muted-600 dark:hover:text-muted-200 hidden size-10 items-center justify-center rounded-xl transition-colors duration-200 focus:outline-none sm:flex"
                  >
                    <Icon name="lucide:paperclip" class="size-5" />
                  </button>
                </div>
                <div class="grow">
                  <div class="relative w-full">
                    <BaseInput
                      v-model.trim="message"
                      :disabled="messageLoading"
                      rounded="lg"
                      :classes="{
                        input: 'pe-10',
                      }"
                      placeholder="نوشتن پیام..."
                    />
                    <button
                      class="text-muted-400 hover:text-muted-600 absolute end-0 top-0 flex h-full w-12 items-center justify-center"
                    >
                      <svg
                        class="size-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <BaseButton
                    type="submit"
                    color="primary"
                    rounded="lg"
                  >
                    <span>ارسال</span>
                    <Icon
                      name="ph:paper-plane-right-duotone"
                      class="!hidden size-5 sm:!block rtl:rotate-180"
                    />
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!--Chat side-->
      <div
        class="dark:bg-muted-950 hidden w-80 shrink-0 flex-col bg-white py-4 pe-8 ps-4 lg:flex"
      >
        <div class="relative flex w-full flex-col">
          <!-- Loader -->
          <div v-if="loading" class="mt-4">
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
          <div v-else class="mt-4">
            <div class="flex items-center justify-center">
              <BaseAvatar :src="selectedConversation?.user.photo" size="2xl" />
            </div>
            <div class="text-center">
              <BaseHeading
                tag="h3"
                size="lg"
                class="text-muted-800 dark:text-muted-100 mt-4"
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
                <NuxtLink
                  to="/layouts/members"
                  class="text-primary-500 mt-3 block font-sans text-sm underline-offset-4 hover:underline"
                >
                  مدیریت اعضا
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
