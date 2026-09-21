<script setup lang="ts">
definePageMeta({
  title: 'آموزش الکترونیکی',
  preview: {
    title: 'داشبورد دوره',
    description: 'برای مدرسه و تحصیلات',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-course.png',
    srcDark: '/img/screens/dashboards-course-dark.png',
    order: 13,
  },
})

const courses = [
  {
    title: 'ANA118 - آناتومی و فیزیولوژی افراد جوان',
    description:
      'این هفته به بررسی عمیق‌تر آناتومی افراد جوان و ویژگی‌های فیزیولوژیکی پایه می‌پردازد و بر جدیدترین مقالات منتشر شده تمرکز دارد.',
    category: 'کالبدشناسی',
    week: 6,
    duration: 120,
    comments: 25,
    time: '۱۰:۰۰ - ۱۲:۰۰',
    date: '۱۴ بهمن ۱۴۰۱',
    students: [
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
    title: 'IMM107 - ایمنی‌شناسی و درمان بیماری‌های انسانی',
    description:
      'این واحد تمرکز زیادی بر مشکلات بالینی مهم در ایمنی‌شناسی و زمینه‌های علمی آن‌ها دارد.',
    category: 'ایمنی‌شناسی',
    week: 6,
    duration: 90,
    comments: 12,
    time: '۹:۰۰ - ۱۰:۳۰',
    date: '۱۸ بهمن ۱۴۰۱',
    students: [
      {
        tooltip: 'آنا ورسکی',
        src: '/img/avatars/12.svg',
      },
      {
        tooltip: 'هرمان مایر',
        src: '/img/avatars/16.svg',
      },
      {
        tooltip: 'ادی جانسون',
        src: '/img/avatars/8.svg',
      },
      {
        tooltip: 'جین دو',
        src: '/img/avatars/14.svg',
      },
    ],
  },
  {
    title: 'CAR112 - مدیریت متابولیک قلبی عروقی',
    description:
      'این واحد تمرکز زیادی بر مشکلات بالینی مهم در ایمنی‌شناسی و زمینه‌های علمی آن‌ها دارد.',
    category: 'قلب‌شناسی',
    week: 6,
    duration: 120,
    comments: 7,
    time: '۱۴:۰۰ - ۱۶:۰۰',
    date: '۱۸ بهمن ۱۴۰۱',
    students: [
      {
        tooltip: 'تروی بیکر',
        src: '/img/avatars/15.svg',
      },
      {
        tooltip: 'آلن بکستر',
        src: '/img/avatars/11.svg',
      },
      {
        tooltip: 'اریک کلاوس',
        src: '/img/avatars/7.svg',
      },
      {
        tooltip: 'جین دو',
        src: '/img/avatars/17.svg',
      },
    ],
  },
]

const files = [
  {
    name: 'هولتز - آناتومی کامل',
    size: '94.7 MB',
    uploaded: '۲ روز پیش',
    icon: '/img/icons/files/pdf.svg',
  },
  {
    name: 'ارزیابی دوزها بخش ۲',
    size: '79 KB',
    uploaded: '۱ هفته پیش',
    icon: '/img/icons/files/sheet.svg',
  },
  {
    name: 'قالب آزمون کتبی',
    size: '42 KB',
    uploaded: '۲ هفته پیش',
    icon: '/img/icons/files/doc-2.svg',
  },
]

const students = [
  {
    name: 'مایا روسلینی',
    avatar: '/img/avatars/2.svg',
    completion: '78% تکمیل‌شده',
    location: 'لس‌آنجلس، کالیفرنیا',
    status: 'آنلاین',
    presence: 'به‌موقع',
  },
  {
    name: 'کلارک اسمیت',
    avatar: '/img/avatars/3.svg',
    completion: '64% تکمیل‌شده',
    location: 'سن‌دیگو، CA',
    status: 'آفلاین',
    presence: 'تاخیر (۱۰ دقیقه)',
  },
  {
    name: 'هرمان مایر',
    avatar: '/img/avatars/16.svg',
    completion: '37% تکمیل‌شده',
    location: 'نیویورک، نیویورک',
    status: 'آنلاین',
    presence: 'تاخیر (۵ دقیقه)',
  },
  {
    name: 'اندرو بریکمن',
    avatar: '/img/avatars/8.svg',
    completion: '89% تکمیل‌شده',
    location: 'سن‌دیگو، CA',
    status: 'آنلاین',
    presence: 'به‌موقع',
  },
  {
    name: 'جن کانللی',
    avatar: '/img/avatars/10.svg',
    completion: '54% تکمیل‌شده',
    location: 'سان فرانسیسکو، کالیفرنیا',
    status: 'آفلاین',
    presence: 'به‌موقع',
  },
]
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex flex-col justify-between md:flex-row md:items-center">
      <div
        class="ltablet:max-w-full flex max-w-[425px] flex-col items-center gap-4 text-center md:flex-row md:text-start lg:max-w-full"
      >
        <BaseAvatar src="/img/avatars/2.svg" size="lg" />
        <div>
          <BaseHeading
            as="h2"
            size="2xl"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>کلاس‌های هفته ۶</span>
          </BaseHeading>
          <BaseParagraph>
            <span class="text-muted-500">کلاس‌ها از ۶ تا ۱۰ اردیبهشت</span>
          </BaseParagraph>
        </div>
      </div>
      <div
        class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start"
      >
        <BaseButton>
          <span>تنظیمات</span>
        </BaseButton>
        <BaseButton color="primary">
          <span>برنامه‌ریزی</span>
        </BaseButton>
      </div>
    </div>
    <!-- Grid -->
    <div class="ltablet:gap-4 grid grid-cols-12 gap-6">
      <!-- Course Card -->
      <div
        v-for="(course, index) in courses"
        :key="index"
        class="ltablet:col-span-4 relative col-span-12 sm:col-span-6 lg:col-span-4"
      >
        <BaseCard rounded="lg" class="flex h-full flex-col p-6">
          <div class="mb-6">
            <BaseTag color="primary">
              <span>{{ course.category }}</span>
            </BaseTag>
          </div>
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="lg"
              weight="medium"
              lead="tight"
              class="mb-2"
            >
              <span class="text-muted-800 dark:text-muted-100">
                {{ course.title }}
              </span>
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
              <span>{{ course.description }}</span>
            </BaseParagraph>
          </div>
          <div class="mb-8 mt-auto flex items-center justify-between">
            <BaseAvatarGroup
              :avatars="course.students"
              :limit="3"
              size="sm"
            />
            <div>
              <BaseButtonAction>
                <span>بحث</span>
              </BaseButtonAction>
            </div>
          </div>
          <div class="mb-8">
            <BaseHeading
              as="h4"
              size="md"
              weight="medium"
              lead="tight"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              <span>ضبط سخنرانی هفته {{ course.week }}</span>
            </BaseHeading>
            <div class="flex gap-6">
              <div class="text-muted-400 flex items-center gap-1">
                <Icon name="ph:timer-duotone" class="size-5" />
                <span class="font-sans text-sm">{{ course.duration }} دقیقه</span>
              </div>
              <div class="text-muted-400 flex items-center gap-1">
                <Icon name="ph:chat-circle-dots-duotone" class="size-5" />
                <span class="font-sans text-sm">
                  {{ course.comments }} نظرها
                </span>
              </div>
            </div>
          </div>
          <div class="mb-8">
            <BaseHeading
              as="h4"
              size="md"
              weight="medium"
              lead="tight"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              <span>امتحان هفته {{ course.week }}</span>
            </BaseHeading>
            <div class="flex gap-6">
              <div class="text-muted-400 flex items-center gap-1">
                <Icon name="ph:calendar-check-duotone" class="size-5" />
                <span class="font-sans text-sm">
                  {{ course.date }} — {{ course.time }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <BaseButton
              color="primary"
              rounded="lg"
              class="w-full"
            >
              <span>جزئیات کلاس</span>
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
    <!-- Grid -->
    <div class="ltablet:gap-x-4 mt-10 grid grid-cols-12 gap-x-6 gap-y-12">
      <!-- Column -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="mb-4">
          <BaseHeading
            as="h2"
            size="lg"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>فایل‌های هفته ۶</span>
          </BaseHeading>
          <BaseParagraph size="sm">
            <span class="text-muted-500">
              فایل‌هایی که برای این هفته نیاز دارید
            </span>
          </BaseParagraph>
        </div>
        <div class="space-y-4">
          <BaseCard
            v-for="(file, fileIndex) in files"
            :key="fileIndex"
            rounded="lg"
            class="p-4"
          >
            <div class="flex w-full items-center gap-3">
              <img
                :src="file.icon"
                :alt="file.name"
                class="size-10 shrink-0"
              >
              <div>
                <BaseHeading
                  as="h2"
                  size="md"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>{{ file.name }}</span>
                </BaseHeading>
                <BaseParagraph size="xs">
                  <span class="text-muted-400">
                    {{ file.size }} · آپلود شده در {{ file.uploaded }}
                  </span>
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseButtonIcon small data-nui-tooltip="دانلود فایل">
                  <Icon name="lucide:arrow-down" class="size-4" />
                </BaseButtonIcon>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
      <!-- Column -->
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <div class="mb-4">
          <BaseHeading
            as="h2"
            size="lg"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>دانشجویان</span>
          </BaseHeading>
          <BaseParagraph size="sm">
            <span class="text-muted-500">خلاصه‌ای از دانش‌آموزان حاضر</span>
          </BaseParagraph>
        </div>
        <div class="space-y-2">
          <DemoFlexTableRow
            v-for="(student, studentIndex) in students"
            :key="studentIndex"
            rounded="lg"
            spaced
          >
            <template #start>
              <DemoFlexTableStart
                label="Student"
                hide-label
                :title="student.name"
                :subtitle="student.completion"
                :avatar="student.avatar"
              />
            </template>
            <template #end>
              <DemoFlexTableCell
                label="موقعیت"
                hide-label
                class="w-full sm:w-32"
              >
                <span
                  class="text-muted-500 dark:text-muted-400 line-clamp-1 font-sans text-sm"
                >
                  {{ student.location }}
                </span>
              </DemoFlexTableCell>
              <DemoFlexTableCell
                label="وضعیت"
                hide-label
                class="w-full sm:w-16"
              >
                <BaseTag
                  :color="student.status === 'آنلاین' ? 'success' : 'muted'"
                  rounded="full"
                  variant="pastel"
                  size="sm"
                >
                  {{ student.status }}
                </BaseTag>
              </DemoFlexTableCell>
              <DemoFlexTableCell
                label="موقعیت"
                hide-label
                class="w-full sm:w-28"
              >
                <span
                  class="text-muted-500 dark:text-muted-400 font-sans text-sm"
                >
                  {{ student.presence }}
                </span>
              </DemoFlexTableCell>
              <DemoFlexTableCell label="اقدام" hide-label>
                <BaseButtonAction>چت</BaseButtonAction>
              </DemoFlexTableCell>
            </template>
          </DemoFlexTableRow>
        </div>
      </div>
    </div>
  </div>
</template>
