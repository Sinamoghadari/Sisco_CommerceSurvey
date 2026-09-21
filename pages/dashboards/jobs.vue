<script setup lang="ts">
definePageMeta({
  title: 'مشاغل',
  preview: {
    title: 'داشبورد مشاغل',
    description: 'برای استخدام و جستجوی شغل',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-jobs.png',
    srcDark: '/img/screens/dashboards-jobs-dark.png',
    order: 14,
  },
})

const search = ref('')
const location = ref('')
const alertKeyword = ref('')

const selectedType = ref('all')
const selectedRange = ref('all')

const jobTypes = ref([])
const jobSeniority = ref([])
const jobSalary = ref([])

const jobs = [
  {
    company: 'ایر‌بی‌ان‌بی',
    logo: 'logos:airbnb-icon',
    title: 'طراح UI / UX',
    description:
      'ما به دنبال یک طراح UI / UX هستیم تا تجربیات کاربری فوق‌العاده‌ای خلق کند. کاندیدای ایده‌آل باید دیدی برای طراحی تمیز و هنری داشته باشد، مهارت‌های برتر UI را دارا باشد و بتواند نیازهای سطح بالا را به جریان‌های تعاملی و آثار تبدیل کند و آن‌ها را به رابط‌های کاربری زیبا، شهودی و کاربردی تبدیل کند.',
    tags: ['تمام وقت', 'طراحی تجربه کاربری', 'سطح ارشد'],
    applicants: [
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
    company: 'اسلک',
    logo: 'logos:slack-icon',
    title: 'محصول طراح',
    description:
      'ما به دنبال یک طراح محصول هستیم تا تجربیات کاربری فوق‌العاده‌ای خلق کند. کاندیدای ایده‌آل باید دیدی برای طراحی تمیز و هنری داشته باشد، مهارت‌های برتر UI را دارا باشد و بتواند نیازهای سطح بالا را به جریان‌های تعاملی و آثار تبدیل کند و آن‌ها را به رابط‌های کاربری زیبا، شهودی و کاربردی تبدیل کند.',
    tags: ['تمام وقت', 'طراحی محصول', 'بازاریابی'],
    applicants: [
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
    company: 'گیت‌لب',
    logo: 'logos:gitlab',
    title: 'مدیر پروژه',
    description:
      'ما به دنبال یک مدیر پروژه هستیم تا تجربیات کاربری فوق‌العاده‌ای خلق کند. کاندیدای ایده‌آل باید دیدی برای طراحی تمیز و هنری داشته باشد، مهارت‌های برتر UI را دارا باشد و بتواند نیازهای سطح بالا را به جریان‌های تعاملی و آثار تبدیل کند و آن‌ها را به رابط‌های کاربری زیبا، شهودی و کاربردی تبدیل کند.',
    tags: ['تمام وقت', 'مدیریت محصول'],
    applicants: [
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
    company: 'گوگل',
    logo: 'logos:google-icon',
    title: 'مالک محصول',
    description:
      'ما به دنبال یک مالک محصول هستیم تا تجربه‌های کاربری شگفت‌انگیزی خلق کند. کاندیدای ایده‌آل باید دارای چشم‌دیدی برای طراحی تمیز و هنرمندانه باشد، مهارت‌های UI فوق‌العاده‌ای داشته باشد و قادر به تبدیل نیازهای سطح بالا به جریان‌ها و آثار تعامل و تبدیل آن‌ها به رابط‌های کاربری زیبا، شهودی و کاربردی باشد.',
    tags: ['تمام وقت', 'مدیر اسکرام', 'مدیریت'],
    applicants: [
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
    company: 'آتلسیان',
    logo: 'logos:atlassian',
    title: 'توسعه‌دهنده فول استک',
    description:
      'ما به دنبال یک توسعه‌دهنده فول‌استک هستیم تا تجربه‌های کاربری شگفت‌انگیزی خلق کند. کاندیدای ایده‌آل باید دارای چشم‌دیدی برای طراحی تمیز و هنرمندانه باشد، مهارت‌های UI فوق‌العاده‌ای داشته باشد و قادر به تبدیل نیازهای سطح بالا به جریان‌ها و آثار تعامل و تبدیل آن‌ها به رابط‌های کاربری زیبا، شهودی و کاربردی باشد.',
    tags: ['تمام وقت', 'فول استک', 'مهندسی'],
    applicants: [
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
    company: 'دریبل',
    logo: 'logos:dribbble-icon',
    title: 'مدیر جامعه',
    description:
      'ما به دنبال یک مدیر جامعه هستیم تا تجربه‌های کاربری شگفت‌انگیزی خلق کند. کاندیدای ایده‌آل باید دارای چشم‌دیدی برای طراحی تمیز و هنرمندانه باشد، مهارت‌های UI فوق‌العاده‌ای داشته باشد و قادر به تبدیل نیازهای سطح بالا به جریان‌ها و آثار تعامل و تبدیل آن‌ها به رابط‌های کاربری زیبا، شهودی و کاربردی باشد.',
    tags: ['تمام وقت', 'مدیر', 'جامعه'],
    applicants: [
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
    company: 'فیگما',
    logo: 'logos:figma',
    title: 'توسعه‌دهنده کسب‌وکار',
    description:
      'ما به دنبال یک توسعه‌دهنده کسب‌وکار هستیم تا تجربه‌های کاربری شگفت‌انگیزی خلق کند. کاندیدای ایده‌آل باید دارای چشم‌دیدی برای طراحی تمیز و هنرمندانه باشد، مهارت‌های UI فوق‌العاده‌ای داشته باشد و قادر به تبدیل نیازهای سطح بالا به جریان‌ها و آثار تعامل و تبدیل آن‌ها به رابط‌های کاربری زیبا، شهودی و کاربردی باشد.',
    tags: ['تمام وقت', 'کسب‌وکار', 'فروش'],
    applicants: [
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
    company: 'آیرتیبل',
    logo: 'logos:airtable',
    title: 'توسعه‌دهنده فرانت‌اند',
    description:
      'ما به دنبال یک توسعه‌دهنده فرانت‌اند هستیم تا تجربه‌های کاربری شگفت‌انگیزی خلق کند. کاندیدای ایده‌آل باید دارای چشم‌دیدی برای طراحی تمیز و هنرمندانه باشد، مهارت‌های UI فوق‌العاده‌ای داشته باشد و قادر به تبدیل نیازهای سطح بالا به جریان‌ها و آثار تعامل و تبدیل آن‌ها به رابط‌های کاربری زیبا، شهودی و کاربردی باشد.',
    tags: ['تمام وقت', 'فرانت‌اند', 'فروش'],
    applicants: [
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
</script>

<template>
  <div>
    <!-- Search bar -->
    <div class="relative">
      <BaseCard
        rounded="lg"
        class="ptablet:py-6 ptablet:px-4 ptablet:grid ptablet:grid-cols-12 ltablet:divide-x divide-muted-200 dark:divide-muted-700 mb-10 flex w-full flex-col items-center py-2 sm:flex-row sm:py-0 lg:divide-x rtl:divide-x-reverse"
      >
        <div
          class="ptablet:ps-4 ptablet:col-span-6 w-full py-2 pe-4 ps-4 sm:w-auto sm:grow sm:ps-2"
        >
          <BaseInput
            v-model.trim="search"
            rounded="lg"
            icon="lucide:search"
            placeholder="کلمات کلیدی شغل"
          />
        </div>
        <div class="ptablet:col-span-6 w-full flex-1 px-4 py-2 sm:w-auto">
          <BaseInput
            v-model.trim="location"
            rounded="lg"
            icon="lucide:map-pin"
            placeholder="موقعیت"
          />
        </div>
        <div class="ptablet:col-span-6 w-full flex-1 px-4 py-2 sm:w-auto">
          <BaseSelect
            v-model="selectedType"
            rounded="lg"
            icon="lucide:briefcase"
            label=""
            hide-label
          >
            <option value="">
              نوعی را انتخاب کنید
            </option>
            <option value="all">
              همه
            </option>
            <option value="design">
              طراحی
            </option>
            <option value="engineering">
              مهندسی
            </option>
            <option value="frontend">
              فرانت‌اند
            </option>
            <option value="backend">
              بک‌اند
            </option>
          </BaseSelect>
        </div>
        <div class="ptablet:col-span-6 w-full flex-1 px-4 py-2 sm:w-auto">
          <BaseSelect
            v-model="selectedRange"
            rounded="lg"
            icon="lucide:dollar-sign"
            label=""
            hide-label
          >
            <option value="">
              یک محدوده را انتخاب کنید
            </option>
            <option value="all">
              همه
            </option>
            <option value="10k-20k">
              ۱۰ هزار ~ ۲۰ هزار تومان
            </option>
            <option value="20k-30k">
              ۲۰ هزار ~ ۴۰ هزار
            </option>
            <option value="40k-75k">
              ۴۰ هزار ~ ۷۵ هزار
            </option>
            <option value="75k">
              بیش از ۷۵ هزار
            </option>
          </BaseSelect>
        </div>
        <div class="ptablet:col-span-12 w-full px-4 py-2 sm:w-auto">
          <BaseButton
            rounded="lg"
            color="primary"
            class="ptablet:w-full w-full sm:w-32"
          >
            جستجو
          </BaseButton>
        </div>
      </BaseCard>
    </div>
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Column -->
      <div
        class="ptablet:col-span-4 ltablet:col-span-4 col-span-12 lg:col-span-3"
      >
        <div class="w-full">
          <div class="bg-muted-200 dark:bg-muted-800 mb-12 rounded-xl p-6">
            <!-- Title -->
            <div class="mb-6">
              <BaseHeading
                as="h3"
                size="md"
                weight="light"
                lead="tight"
                class="text-muted-800 mb-2 dark:text-white"
              >
                <span>ایجاد هشدار شغلی</span>
              </BaseHeading>
              <BaseParagraph size="xs">
                <span class="text-muted-500">
                  یک هشدار شغلی با کلمات کلیدی زیر ایجاد کنید و به محض اینکه پیشنهاد جدیدی که با معیارهای شما مطابقت دارد، منتشر شد، مطلع شوید.
                </span>
              </BaseParagraph>
            </div>
            <!-- Form -->
            <form class="space-y-2">
              <BaseInput
                v-model.trim="alertKeyword"
                rounded="lg"
                icon="lucide:search"
                placeholder="کلمات کلیدی شغل"
              />
              <BaseButton
                rounded="lg"
                color="primary"
                class="w-full"
              >
                ایجاد هشدار
              </BaseButton>
            </form>
          </div>
          <!-- Filters -->
          <div class="space-y-12">
            <!-- Filter group -->
            <div class="relative">
              <!-- Title -->
              <div class="mb-6">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 mb-2 dark:text-white"
                >
                  <span>نوع شغل</span>
                </BaseHeading>
              </div>
              <!-- Checkboxes -->
              <div class="flex flex-col gap-4 ps-2">
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobTypes"
                    value="job-types-1"
                    label="مشاغل تمام وقت"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    67
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobTypes"
                    value="job-types-2"
                    label="مشاغل پاره وقت"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    31
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobTypes"
                    value="job-types-3"
                    label="مشاغل از راه دور"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    49
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobTypes"
                    value="job-types-4"
                    label="کارآموزی‌ها"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    17
                  </BaseTag>
                </div>
              </div>
            </div>
            <!-- Filter group -->
            <div class="relative">
              <!-- Title -->
              <div class="mb-6">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 mb-2 dark:text-white"
                >
                  <span>سابقه کار</span>
                </BaseHeading>
              </div>
              <!-- Checkboxes -->
              <div class="flex flex-col gap-4 ps-2">
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="seniority-level-1"
                    label="سطح دانشجویی"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    56
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="seniority-level-2"
                    label="سطح مبتدی"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    84
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="seniority-level-3"
                    label="سطح میانی"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    31
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="seniority-level-4"
                    label="سطح ارشد"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    59
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="seniority-level-5"
                    label="سطح مدیر"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    11
                  </BaseTag>
                </div>
              </div>
            </div>
            <!-- Filter group -->
            <div class="relative">
              <!-- Title -->
              <div class="mb-6">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 mb-2 dark:text-white"
                >
                  <span>محدوده حقوق</span>
                </BaseHeading>
              </div>
              <!-- Checkboxes -->
              <div class="flex flex-col gap-4 ps-2">
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="salary-range-1"
                    label="۱۰ هزار ~ ۲۰ هزار تومان"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    61
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="salary-range-2"
                    label="۲۰ هزار ~ ۴۰ هزار"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    28
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="salary-range-3"
                    label="۴۰ هزار ~ ۷۵ هزار"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    112
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="jobSeniority"
                    value="salary-range-4"
                    label="بیش از ۷۵ هزار"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    58
                  </BaseTag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Column -->
      <div
        class="ptablet:col-span-8 ltablet:col-span-8 col-span-12 lg:col-span-9"
      >
        <!-- Title -->
        <div class="mb-6 mt-12 sm:mt-0">
          <BaseHeading
            as="h3"
            size="lg"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>نمایش 46 شغل</span>
          </BaseHeading>
          <BaseParagraph size="sm">
            <span class="text-muted-500">
              این‌ها مشاغل مطابقی هستند که پیدا کردیم
            </span>
          </BaseParagraph>
        </div>
        <!-- Inner jobs grid -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div
            v-for="(job, index) in jobs"
            :key="index"
            class="relative"
          >
            <BaseCard rounded="lg" class="p-6">
              <div class="flex w-full flex-col gap-4 sm:flex-row">
                <div :data-nui-tooltip="job.company">
                  <Icon :name="job.logo" class="size-10 shrink-0" />
                </div>
                <div>
                  <BaseHeading
                    as="h4"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="after:text-muted-800 mb-4 dark:text-white"
                  >
                    <span>{{ job.title }}</span>
                  </BaseHeading>
                  <BaseParagraph size="sm">
                    <span
                      class="text-muted-500 dark:text-muted-400 line-clamp-4"
                    >
                      {{ job.description }}
                    </span>
                  </BaseParagraph>
                  <div class="flex flex-wrap items-center gap-2 py-4">
                    <BaseTag
                      v-for="tag in job.tags"
                      :key="tag"
                      color="default"
                      size="sm"
                      class="text-xs"
                    >
                      {{ tag }}
                    </BaseTag>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <BaseAvatarGroup
                        :avatars="job.applicants"
                        :limit="2"
                        size="xs"
                      />
                    </div>
                    <div class="flex gap-2">
                      <BaseButton
                        rounded="lg"
                        color="primary"
                        class="w-24"
                      >
                        درخواست
                      </BaseButton>
                      <BaseButton
                        rounded="lg"
                        color="default"
                        class="w-24"
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
