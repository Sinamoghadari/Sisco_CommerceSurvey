<script setup lang="ts">
definePageMeta({
  title: 'اینفلوئنسر',
  preview: {
    title: 'داشبورد اینفلوئنسر',
    description: 'برای اینفلوئنسرهای شبکه‌های اجتماعی',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-influencer.png',
    srcDark: '/img/screens/dashboards-influencer-dark.png',
    order: 15,
  },
})

const companies = [
  {
    name: 'ایر‌بی‌ان‌بی',
    logo: 'logos:airbnb-icon',
    title: 'طراح UI / UX',
    description:
      'ایر‌بی‌ان‌بی شرکتی است که به افراد امکان می‌دهد اقامتگاه‌ها را فهرست، کشف و رزرو کنند در سراسر جهان.',
    tags: ['تمام وقت', 'طراحی تجربه کاربری', 'سطح ارشد'],
    stats: [
      {
        label: 'قراردادها',
        value: 22,
      },
      {
        label: 'نشریات',
        value: 49,
      },
      {
        label: 'درآمد',
        value: 43.2,
      },
    ],
    followers: [
      {
        tooltip: 'کلارک اسمیت',
        src: '/img/avatars/3.svg',
      },
      {
        tooltip: 'مایا روسلینی',
        src: '/img/avatars/2.svg',
      },
      {
        tooltip: 'کلاریسا میلر',
        src: '/img/avatars/5.svg',
      },
      {
        tooltip: 'جین دو',
        src: '/img/avatars/4.svg',
      },
    ],
  },
  {
    name: 'اسلک',
    logo: 'logos:slack-icon',
    title: 'محصول طراح',
    description:
      'اسلک مجموعه‌ای از ابزارها و خدمات همکاری تیمی مبتنی بر ابر است.',
    tags: ['تمام وقت', 'طراحی محصول', 'بازاریابی'],
    stats: [
      {
        label: 'قراردادها',
        value: 22,
      },
      {
        label: 'نشریات',
        value: 49,
      },
      {
        label: 'درآمد',
        value: 43.2,
      },
    ],
    followers: [
      {
        tooltip: 'هرمان مایر',
        src: '/img/avatars/16.svg',
      },
      {
        tooltip: 'جن راسی',
        src: '/img/avatars/10.svg',
      },
    ],
  },
  {
    name: 'گیت‌لب',
    logo: 'logos:gitlab',
    title: 'مدیر پروژه',
    description:
      'GitLab ابزاری مبتنی بر وب برای چرخه عمر DevOps است که مدیر مخزن Git را ارائه می‌دهد.',
    tags: ['تمام وقت', 'مدیریت محصول'],
    stats: [
      {
        label: 'قراردادها',
        value: 22,
      },
      {
        label: 'نشریات',
        value: 49,
      },
      {
        label: 'درآمد',
        value: 43.2,
      },
    ],
    followers: [
      {
        tooltip: 'الکس ویدلر',
        src: '/img/avatars/11.svg',
      },
      {
        tooltip: 'راب هاواردز',
        src: '/img/avatars/18.svg',
      },
    ],
  },
  {
    name: 'گوگل',
    logo: 'logos:google-icon',
    title: 'مالک محصول',
    description:
      'گوگل یک شرکت فناوری چندملیتی آمریکایی است که در خدمات و محصولات مربوط به اینترنت تخصص دارد.',
    tags: ['تمام وقت', 'مدیر اسکرام', 'مدیریت'],
    stats: [
      {
        label: 'قراردادها',
        value: 22,
      },
      {
        label: 'نشریات',
        value: 49,
      },
      {
        label: 'درآمد',
        value: 43.2,
      },
    ],
    followers: [
      {
        tooltip: 'کلارنس بودیکر',
        src: '/img/avatars/13.svg',
      },
      {
        tooltip: 'آندرو هولمز',
        src: '/img/avatars/14.svg',
      },
    ],
  },
  {
    name: 'آتلسیان',
    logo: 'logos:atlassian',
    title: 'توسعه‌دهنده فول استک',
    description:
      'آتلسیان شرکتی است که نرم‌افزارهای سازمانی برای تیم‌ها ارائه می‌دهد. این شرکت محصولات را برای توسعه‌دهندگان نرم‌افزار، مدیران پروژه و مدیریت محتوا توسعه می‌دهد.',
    tags: ['تمام وقت', 'فول استک', 'مهندسی'],
    stats: [
      {
        label: 'قراردادها',
        value: 22,
      },
      {
        label: 'نشریات',
        value: 49,
      },
      {
        label: 'درآمد',
        value: 43.2,
      },
    ],
    followers: [
      {
        tooltip: 'سام برتمن',
        src: '/img/avatars/15.svg',
      },
      {
        tooltip: 'الینا ویلر',
        src: '/img/avatars/9.svg',
      },
    ],
  },
  {
    name: 'دریبل',
    logo: 'logos:dribbble-icon',
    title: 'مدیر جامعه',
    description:
      'دریبل جامعه‌ای از طراحان است که اسکرین‌شات‌های کار، فرآیند و پروژه‌های خود را به اشتراک می‌گذارند.',
    tags: ['تمام وقت', 'مدیر', 'جامعه'],
    stats: [
      {
        label: 'قراردادها',
        value: 22,
      },
      {
        label: 'نشریات',
        value: 49,
      },
      {
        label: 'درآمد',
        value: 43.2,
      },
    ],
    followers: [
      {
        tooltip: 'جان باکستر',
        src: '/img/avatars/6.svg',
      },
      {
        tooltip: 'مایا روسلینی',
        src: '/img/avatars/2.svg',
      },
    ],
  },
  {
    name: 'فیگما',
    logo: 'logos:figma',
    title: 'توسعه‌دهنده کسب‌وکار',
    description:
      'فیگما یک ویرایشگر گرافیک برداری و ابزار پروتوتایپ است که عمدتاً مبتنی بر وب است و ویژگی‌های اضافی آفلاین از طریق برنامه‌های دسکتاپ برای macOS و Windows فعال شده‌اند.',
    tags: ['تمام وقت', 'کسب‌وکار', 'فروش'],
    stats: [
      {
        label: 'قراردادها',
        value: 22,
      },
      {
        label: 'نشریات',
        value: 49,
      },
      {
        label: 'درآمد',
        value: 43.2,
      },
    ],
    followers: [
      {
        tooltip: 'ادوارد روول',
        src: '/img/avatars/8.svg',
      },
      {
        tooltip: 'نیک کوالسکی',
        src: '/img/avatars/17.svg',
      },
    ],
  },
  {
    name: 'آیرتیبل',
    logo: 'logos:airtable',
    title: 'توسعه‌دهنده فرانت‌اند',
    description:
      'آیرتیبل یک هیبرید پایگاه‌داده-صفحه‌گسترده مبتنی بر ابر است که به کاربران امکان می‌دهد جداول و داده‌ها را از طریق مرورگر وب ایجاد و مدیریت کنند.',
    tags: ['تمام وقت', 'فرانت‌اند', 'فروش'],
    stats: [
      {
        label: 'قراردادها',
        value: 22,
      },
      {
        label: 'نشریات',
        value: 49,
      },
      {
        label: 'درآمد',
        value: 43.2,
      },
    ],
    followers: [
      {
        tooltip: 'ادوارد روول',
        src: '/img/avatars/8.svg',
      },
      {
        tooltip: 'نیک کوالسکی',
        src: '/img/avatars/17.svg',
      },
      {
        tooltip: 'جان باکستر',
        src: '/img/avatars/6.svg',
      },
      {
        tooltip: 'مایا روسلینی',
        src: '/img/avatars/2.svg',
      },
    ],
  },
]

const activeTab = ref('tab-1')
</script>

<template>
  <div>
    <!-- Header bg -->
    <div
      class="ltablet:h-[410px] dark:bg-muted-800 absolute start-0 top-0 h-[590px] w-full bg-white lg:h-[410px]"
    />
    <!-- Header -->
    <div
      class="ltablet:h-64 ltablet:flex-row relative flex h-[460px] w-full flex-col lg:h-64 lg:flex-row"
    >
      <div
        class="ltablet:flex-row relative z-10 flex w-full flex-col gap-6 lg:flex-row"
      >
        <BaseAvatar
          src="/img/avatars/5.svg"
          badge-src="/img/icons/flags/united-states-of-america.svg"
          size="3xl"
          alt="avatar"
          class="ltablet:mx-0 mx-auto lg:mx-0"
        />
        <div class="ltablet:text-start text-center lg:text-start">
          <BaseHeading
            as="h2"
            size="xl"
            weight="semibold"
            class="ltablet:justify-start flex items-center justify-center gap-2 lg:justify-start"
          >
            <span class="text-muted-800 dark:text-white">Sweet_Mango12</span>
            <Icon name="uiw:star-on" class="size-4 text-yellow-400" />
          </BaseHeading>
          <span class="text-muted-400 mb-4 block font-sans text-base">
            کلاریسا میلر
          </span>
          <div class="mb-6 flex items-center gap-x-6">
            <div
              class="ltablet:flex-row ltablet:flex-auto flex flex-1 flex-col gap-x-2 font-sans lg:flex-auto lg:flex-row"
            >
              <span class="text-muted-800 dark:text-muted-100 font-semibold">
                1512
              </span>
              <span
                class="text-muted-400 ltablet:text-base text-xs sm:text-sm lg:text-base"
              >
                پست‌ها
              </span>
            </div>
            <div
              class="ltablet:flex-row ltablet:flex-auto flex flex-1 flex-col gap-x-2 font-sans lg:flex-auto lg:flex-row"
            >
              <span class="text-muted-800 dark:text-muted-100 font-semibold">
                ۳۸.۳ هزار تومان
              </span>
              <span
                class="text-muted-400 ltablet:text-base text-xs sm:text-sm lg:text-base"
              >
                دنبال‌کنندگان
              </span>
            </div>
            <div
              class="ltablet:flex-row ltablet:flex-auto flex flex-1 flex-col gap-x-2 font-sans lg:flex-auto lg:flex-row"
            >
              <span class="text-muted-800 dark:text-muted-100 font-semibold">
                329
              </span>
              <span
                class="text-muted-400 ltablet:text-base text-xs sm:text-sm lg:text-base"
              >
                دنبال‌شدگان
              </span>
            </div>
          </div>
          <BaseProse
            class="ltablet:mx-0 prose-sm mx-auto mb-6 max-w-xl lg:mx-0"
          >
            <p class="line-clamp-3">
              هنرمند، موسیقی‌دان، ترانه‌سرا، اینفلوئنسر، اینها نام‌هایی هستند که مردم به من می‌دهند. اما برای شما، من فقط کلاریسا هستم. *همیشه با همه دوستانم* // آخرین ویدیو را می‌توانید اینجا ببینید <a href="#">youtu.be/8Tcee5Cyz</a>
            </p>
          </BaseProse>
          <div
            class="ltablet:justify-start flex justify-center gap-4 lg:justify-start"
          >
            <TairoPopover size="sm">
              <div
                class="dark:bg-muted-700 shadow-muted-300/40 dark:shadow-muted-900/20 flex size-10 items-center justify-center rounded-full bg-white shadow-xl"
              >
                <div
                  class="bg-danger-500/20 flex size-8 items-center justify-center rounded-full"
                >
                  <Icon name="ri:fire-fill" class="text-danger-500 size-5" />
                </div>
              </div>

              <template #content>
                <TairoPopoverContentHelp
                  title="در آتش"
                  subtitle="شما در حالت طغیان هستید"
                  text="شما در ۷ روز گذشته بسیار فعال بوده‌اید. به همین شکل ادامه دهید!"
                  icon="ri:fire-fill"
                  icon-color="danger"
                />
              </template>
            </TairoPopover>
            <TairoPopover size="sm">
              <div
                class="dark:bg-muted-700 shadow-muted-300/40 dark:shadow-muted-900/20 flex size-10 items-center justify-center rounded-full bg-white shadow-xl"
              >
                <div
                  class="bg-success-500/20 flex size-8 items-center justify-center rounded-full"
                >
                  <Icon name="ri:medal-fill" class="text-success-500 size-5" />
                </div>
              </div>

              <template #content>
                <TairoPopoverContentHelp
                  title="کهنه‌سرباز"
                  subtitle="Way to go soldier"
                  text="شما بیش از ۲۵۰ پست ارسال کرده‌اید. اکنون یک پست‌باز حرفه‌ای هستید!"
                  icon="ri:medal-fill"
                  icon-color="success"
                />
              </template>
            </TairoPopover>
            <TairoPopover size="sm">
              <div
                class="dark:bg-muted-700 shadow-muted-300/40 dark:shadow-muted-900/20 flex size-10 items-center justify-center rounded-full bg-white shadow-xl"
              >
                <div
                  class="bg-warning-500/20 flex size-8 items-center justify-center rounded-full"
                >
                  <Icon name="ri:trophy-fill" class="text-warning-500 size-5" />
                </div>
              </div>

              <template #content>
                <TairoPopoverContentHelp
                  title="قهرمان"
                  subtitle="Hail to the king"
                  text="شما بیش از ۱۰۰ هزار دنبال‌کننده دارید. شما یک قهرمان هستید!"
                  icon="ri:trophy-fill"
                  icon-color="warning"
                />
              </template>
            </TairoPopover>
          </div>
        </div>
      </div>
      <!-- Action -->
      <div
        class="ltablet:justify-start ltablet:ms-auto ltablet:mt-0 mt-4 flex shrink-0 justify-center lg:ms-auto lg:mt-0 lg:justify-start"
      >
        <BaseButton
          class="ltablet:w-auto ltablet:mx-0 mx-auto w-52 lg:mx-0 lg:w-auto"
        >
          <Icon name="lucide:plus" class="size-4" />
          <span>افزودن حساب</span>
        </BaseButton>
      </div>
      <!-- Tabs -->
      <div
        class="ltablet:bottom-[-70px] absolute bottom-[-48px] start-0 flex items-end gap-2 lg:bottom-[-70px]"
      >
        <button
          type="button"
          class="inline-flex items-center justify-center border-b-2 px-4 py-3 font-sans text-sm"
          :class="
            activeTab === 'tab-1'
              ? 'border-primary-500 text-muted-800 dark:text-muted-100'
              : 'border-transparent text-muted-400'
          "
          @click="activeTab = 'tab-1'"
        >
          <span>حساب‌های کاربری</span>
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center border-b-2 px-4 py-3 font-sans text-sm"
          :class="
            activeTab === 'tab-2'
              ? 'border-primary-500 text-muted-800 dark:text-muted-100'
              : 'border-transparent text-muted-400'
          "
          @click="activeTab = 'tab-2'"
        >
          <span>شرکت‌ها</span>
        </button>
      </div>
    </div>
    <!-- Dashboard content -->
    <div class="w-full">
      <!-- Tab content -->
      <div v-if="activeTab === 'tab-1'" class="mt-28">
        <!-- Groups -->
        <div class="space-y-16">
          <!-- Group -->
          <div>
            <!-- Title -->
            <div class="mb-6 flex w-full items-center justify-between">
              <div class="hidden sm:block">
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="medium"
                  lead="tight"
                  class="mb-2"
                >
                  <span class="text-muted-800 dark:text-muted-100">
                    آمار اینستاگرام
                  </span>
                </BaseHeading>
                <BaseParagraph
                  size="sm"
                  class="text-muted-500 dark:text-muted-400"
                >
                  <span>لورم ایپسوم سیت دلور امت یک متن ساختگی است</span>
                </BaseParagraph>
              </div>
              <div class="shrink-0">
                <Icon
                  name="logos:instagram"
                  class="w-24 text-3xl dark:invert"
                />
              </div>
            </div>
            <!-- Grid -->
            <div class="grid grid-cols-12 gap-6">
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>پست‌های محتوا (۳۰ روز)</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-pink-500/20 text-pink-500"
                      color="none"
                    >
                      <Icon name="ri:instagram-fill" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      119
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        پست‌های منتشر شده
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-danger-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-down-right" class="size-4" />
                      <span>-4.5%</span>
                    </div>
                    <span class="text-muted-400 text-sm">کمتر از حد معمول</span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>دنبال‌کنندگان</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-primary-500/20 text-primary-500"
                      color="none"
                    >
                      <Icon name="ph:users-four-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      ۱۴.۳ هزار تومان
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        دنبال کردن شما
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+9.2%</span>
                    </div>
                    <span class="text-muted-400 text-sm">رشد دنبال‌کنندگان</span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>دنبال‌شدگان</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-emerald-500/20 text-emerald-500"
                      color="none"
                    >
                      <Icon name="ph:users-three-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      224
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        دنبال شده توسط شما
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+1.1%</span>
                    </div>
                    <span class="text-muted-400 text-sm">بیشتر از حد معمول</span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>پسندها (۳۰ روز)</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-pink-500/20 text-pink-500"
                      color="none"
                    >
                      <Icon name="ph:heart-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      ۱۲۹.۷ هزار تومان
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        لایک‌های محتوای شما
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+25.7%</span>
                    </div>
                    <span class="text-muted-400 text-sm">
                      رشد تعامل
                    </span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>نظرات (۳۰ روز)</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-yellow-500/20 text-yellow-500"
                      color="none"
                    >
                      <Icon name="ph:chat-circle-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      5.2k
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        نظرات منتشر شده
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+11.3%</span>
                    </div>
                    <span class="text-muted-400 text-sm">
                      رشد تعامل
                    </span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>مشاهده پروفایل (۳۰ روز)</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-lime-500/20 text-lime-500"
                      color="none"
                    >
                      <Icon name="ph:user-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      12.7k
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        مشاهده‌های پروفایل
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+8.5%</span>
                    </div>
                    <span class="text-muted-400 text-sm">
                      رشد تعامل
                    </span>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
          <!-- Group -->
          <div>
            <!-- Title -->
            <div class="mb-6 flex w-full items-center justify-between">
              <div class="hidden sm:block">
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="medium"
                  lead="tight"
                  class="mb-2"
                >
                  <span class="text-muted-800 dark:text-muted-100">
                    آمار تیک‌تاک
                  </span>
                </BaseHeading>
                <BaseParagraph
                  size="sm"
                  class="text-muted-500 dark:text-muted-400"
                >
                  <span>لورم ایپسوم سیت دلور امت یک متن ساختگی است</span>
                </BaseParagraph>
              </div>
              <div class="shrink-0">
                <Icon name="logos:tiktok" class="w-24 text-3xl dark:invert" />
              </div>
            </div>
            <!-- Grid -->
            <div class="grid grid-cols-12 gap-6">
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>پست‌های محتوا (۳۰ روز)</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-sky-500/20 text-sky-500"
                      color="none"
                    >
                      <Icon name="fa6-brands:tiktok" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      248
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        پست‌های منتشر شده
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+15.5%</span>
                    </div>
                    <span class="text-muted-400 text-sm">بیشتر از حد معمول</span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>دنبال‌کنندگان</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-primary-500/20 text-primary-500"
                      color="none"
                    >
                      <Icon name="ph:users-four-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      ۵.۷ هزار تومان
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        دنبال کردن شما
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+17.2%</span>
                    </div>
                    <span class="text-muted-400 text-sm">رشد دنبال‌کنندگان</span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>دنبال‌شدگان</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-emerald-500/20 text-emerald-500"
                      color="none"
                    >
                      <Icon name="ph:users-three-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      29
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        دنبال شده توسط شما
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+0.3%</span>
                    </div>
                    <span class="text-muted-400 text-sm">بیشتر از حد معمول</span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>پسندها (۳۰ روز)</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-pink-500/20 text-pink-500"
                      color="none"
                    >
                      <Icon name="ph:heart-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      ۸۰.۴ هزار تومان
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        لایک‌های محتوای شما
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+65.7%</span>
                    </div>
                    <span class="text-muted-400 text-sm">
                      رشد تعامل
                    </span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>نظرات (۳۰ روز)</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-yellow-500/20 text-yellow-500"
                      color="none"
                    >
                      <Icon name="ph:chat-circle-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      ۲۲.۸ هزار تومان
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        نظرات منتشر شده
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+49.3%</span>
                    </div>
                    <span class="text-muted-400 text-sm">
                      رشد تعامل
                    </span>
                  </div>
                </BaseCard>
              </div>
              <!-- Grid item -->
              <div
                class="ltablet:col-span-4 col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <BaseCard class="p-6">
                  <div class="flex items-center justify-between">
                    <BaseParagraph
                      size="md"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      <span>مشاهده پروفایل (۳۰ روز)</span>
                    </BaseParagraph>
                    <BaseIconBox
                      size="md"
                      class="bg-lime-500/20 text-lime-500"
                      color="none"
                    >
                      <Icon name="ph:user-duotone" class="size-6" />
                    </BaseIconBox>
                  </div>
                  <div class="pb-6 pt-4">
                    <span
                      class="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none"
                    >
                      ۴۸.۳ هزار تومان
                      <small
                        class="text-muted-500 dark:text-muted-400 text-sm font-medium"
                      >
                        مشاهده‌های پروفایل
                      </small>
                    </span>
                  </div>
                  <div class="mb-2 flex items-center gap-2 font-sans">
                    <div
                      class="text-success-500 flex items-center font-semibold"
                    >
                      <Icon name="lucide:arrow-up-right" class="size-4" />
                      <span>+34.2%</span>
                    </div>
                    <span class="text-muted-400 text-sm">
                      رشد تعامل
                    </span>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Tab content -->
      <div v-else-if="activeTab === 'tab-2'" class="mt-28">
        <!-- Inner company grid -->
        <div
          class="ltablet:grid-cols-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="(company, index) in companies"
            :key="index"
            class="relative h-full"
          >
            <BaseCard rounded="lg" class="flex h-full flex-col p-6">
              <div class="flex size-full flex-col gap-4">
                <div :data-nui-tooltip="company.name">
                  <Icon :name="company.logo" class="size-8 shrink-0" />
                </div>
                <div class="flex h-full flex-col">
                  <BaseHeading
                    as="h4"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="after:text-muted-800 mb-4 dark:text-white"
                  >
                    <span>{{ company.name }}</span>
                  </BaseHeading>
                  <BaseParagraph size="sm">
                    <span
                      class="text-muted-500 dark:text-muted-400 line-clamp-4"
                    >
                      {{ company.description }}
                    </span>
                  </BaseParagraph>
                  <div
                    class="divide-muted-200 dark:divide-muted-700 mt-auto flex items-center justify-center divide-x rtl:divide-x-reverse py-4"
                  >
                    <div
                      v-for="(stat, statIndex) in company.stats"
                      :key="statIndex"
                      class="my-4 flex-1 px-4 text-center font-sans"
                    >
                      <span
                        class="text-muted-800 dark:text-muted-100 block font-semibold"
                      >
                        {{
                          stat.label === 'درآمد'
                            ? `$${stat.value}k`
                            : stat.value
                        }}
                      </span>
                      <span class="text-muted-400 block text-xs">
                        {{ stat.label }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <BaseAvatarGroup
                        :avatars="company.followers"
                        :limit="3"
                        size="xs"
                      />
                    </div>
                    <div class="flex gap-2">
                      <BaseButton
                        rounded="lg"
                        color="default"
                        class="w-28"
                      >
                        جزئیات
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
