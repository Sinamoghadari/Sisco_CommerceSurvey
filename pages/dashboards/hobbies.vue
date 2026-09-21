<script setup lang="ts">
import { Calendar } from 'v-calendars'

import 'v-calendars/dist/style.css'
import '~/assets/css/vcalendar.css'

definePageMeta({
  title: 'سرگرمی‌ها',
  preview: {
    title: 'داشبورد سرگرمی‌ها',
    description: 'برای سرگرمی‌ها و علایق',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-hobbies.png',
    srcDark: '/img/screens/dashboards-hobbies-dark.png',
    order: 16,
  },
})

const trending = [
  {
    name: 'پیاده‌روی افراطی',
    date: '۹ آبان ۱۴۰۱',
    image: '/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg',
    icon: 'tabler:trekking',
  },
  {
    name: 'سفر رفتینگ شرکتی',
    date: '۲۳ آبان ۱۴۰۱',
    image: '/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg',
    icon: 'map:rafting',
  },
  {
    name: 'کوهنوردی در آلپ',
    date: '۱۲ آذر ۱۴۰۱',
    image: '/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg',
    icon: 'map:climbing',
  },
  {
    name: 'تسلط تیم دوچرخه‌سواری',
    date: '۲۶ آذر ۱۴۰۱',
    image: '/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg',
    icon: 'map:bicycle-store',
  },
]

const popular = [
  {
    name: 'تریاتلون افراطی',
    date: '۱۵ بهمن ۱۴۰۱',
    image: '/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg',
    icon: 'map:kayaking',
  },
  {
    name: 'کوهنوردی در جنگل',
    date: '۲۱ دی ۱۴۰۱',
    image: '/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg',
    icon: 'map:playground',
  },
  {
    name: 'چالش تیراندازی با کمان',
    date: '۱۲ آذر ۱۴۰۱',
    image: '/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg',
    icon: 'map:archery',
  },
  {
    name: 'اسکی روی آب افراطی',
    date: '۳۰ آذر ۱۴۰۱',
    image: '/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg',
    icon: 'map:waterskiing',
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
        <div>
          <BaseHeading
            as="h2"
            size="xl"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>کاوش در سرگرمی‌ها</span>
          </BaseHeading>
          <BaseParagraph>
            <span class="text-muted-500">
              برخی از بهترین فعالیت‌های نزدیک در منطقه خود را کاوش کنید
            </span>
          </BaseParagraph>
        </div>
      </div>
      <div
        class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start"
      >
        <BaseButton color="primary" class="w-32">
          <span>مشاهده همه</span>
        </BaseButton>
      </div>
    </div>
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-4">
      <!-- Column -->
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <div class="grid grid-cols-12 gap-4">
          <!-- Grid item -->
          <div class="col-span-6 sm:col-span-3">
            <NuxtLink
              to="#"
              class="group relative flex w-full flex-col overflow-hidden rounded-2xl"
            >
              <img
                class="h-80 w-full object-cover object-center"
                src="/img/illustrations/dashboards/hobbies/hobby-1.svg"
                alt="Hobby cover"
              >
              <div
                class="bg-muted-900 absolute inset-0 z-10 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-50"
              />
              <div
                class="absolute inset-0 z-20 flex size-full flex-col justify-between p-6"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="-translate-y-2 font-sans tracking-wider text-white opacity-0 transition-all delay-100 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    کوهنوردی
                  </h3>
                  <Icon
                    name="eos-icons:bootstrapping"
                    class="size-5 -translate-y-2 text-white opacity-0 transition-all delay-300 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <h3
                    class="translate-y-2 font-sans text-sm text-white underline underline-offset-4 opacity-0 transition-all delay-500 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    مشاهده فعالیت‌ها
                  </h3>
                  <Icon
                    name="lucide:arrow-right"
                    class="size-4 translate-y-2 text-white opacity-0 transition-all delay-700 duration-300 group-hover:translate-y-0 group-hover:opacity-100 rtl:-scale-x-100"
                  />
                </div>
              </div>
            </NuxtLink>
          </div>
          <!-- Grid item -->
          <div class="col-span-6 sm:col-span-3">
            <NuxtLink
              to="#"
              class="group relative flex w-full flex-col overflow-hidden rounded-2xl"
            >
              <img
                class="h-80 w-full object-cover object-center"
                src="/img/illustrations/dashboards/hobbies/hobby-2.svg"
                alt="Hobby cover"
              >
              <div
                class="bg-muted-900 absolute inset-0 z-10 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-50"
              />
              <div
                class="absolute inset-0 z-20 flex size-full flex-col justify-between p-6"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="-translate-y-2 font-sans tracking-wider text-white opacity-0 transition-all delay-100 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    دوچرخه‌سواری
                  </h3>
                  <Icon
                    name="fluent-emoji-high-contrast:wheel"
                    class="size-5 -translate-y-2 text-white opacity-0 transition-all delay-300 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <h3
                    class="translate-y-2 font-sans text-sm text-white underline underline-offset-4 opacity-0 transition-all delay-500 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    مشاهده فعالیت‌ها
                  </h3>
                  <Icon
                    name="lucide:arrow-right"
                    class="size-4 translate-y-2 text-white opacity-0 transition-all delay-700 duration-300 group-hover:translate-y-0 group-hover:opacity-100 rtl:-scale-x-100"
                  />
                </div>
              </div>
            </NuxtLink>
          </div>
          <!-- Grid item -->
          <div class="col-span-6 sm:col-span-3">
            <NuxtLink
              to="#"
              class="group relative flex w-full flex-col overflow-hidden rounded-2xl"
            >
              <img
                class="h-80 w-full object-cover object-center"
                src="/img/illustrations/dashboards/hobbies/hobby-3.svg"
                alt="Hobby cover"
              >
              <div
                class="bg-muted-900 absolute inset-0 z-10 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-50"
              />
              <div
                class="absolute inset-0 z-20 flex size-full flex-col justify-between p-6"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="-translate-y-2 font-sans tracking-wider text-white opacity-0 transition-all delay-100 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    اکتشاف
                  </h3>
                  <Icon
                    name="fa6-solid:compass"
                    class="size-5 -translate-y-2 text-white opacity-0 transition-all delay-300 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <h3
                    class="translate-y-2 font-sans text-sm text-white underline underline-offset-4 opacity-0 transition-all delay-500 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    مشاهده فعالیت‌ها
                  </h3>
                  <Icon
                    name="lucide:arrow-right"
                    class="size-4 translate-y-2 text-white opacity-0 transition-all delay-700 duration-300 group-hover:translate-y-0 group-hover:opacity-100 rtl:-scale-x-100"
                  />
                </div>
              </div>
            </NuxtLink>
          </div>
          <!-- Grid item -->
          <div class="col-span-6 sm:col-span-3">
            <NuxtLink
              to="#"
              class="group relative flex w-full flex-col overflow-hidden rounded-2xl"
            >
              <img
                class="h-80 w-full object-cover object-center"
                src="/img/illustrations/dashboards/hobbies/hobby-4.svg"
                alt="Hobby cover"
              >
              <div
                class="bg-muted-900 absolute inset-0 z-10 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-50"
              />
              <div
                class="absolute inset-0 z-20 flex size-full flex-col justify-between p-6"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="-translate-y-2 font-sans tracking-wider text-white opacity-0 transition-all delay-100 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    کوهنوردی
                  </h3>
                  <Icon
                    name="mdi:pickaxe"
                    class="size-5 -translate-y-2 text-white opacity-0 transition-all delay-300 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <h3
                    class="translate-y-2 font-sans text-sm text-white underline underline-offset-4 opacity-0 transition-all delay-500 duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    مشاهده فعالیت‌ها
                  </h3>
                  <Icon
                    name="lucide:arrow-right"
                    class="size-4 translate-y-2 text-white opacity-0 transition-all delay-700 duration-300 group-hover:translate-y-0 group-hover:opacity-100 rtl:-scale-x-100"
                  />
                </div>
              </div>
            </NuxtLink>
          </div>
          <!-- Grid item -->
          <div class="col-span-12 sm:col-span-6">
            <div class="my-4">
              <BaseHeading
                as="h2"
                size="lg"
                weight="light"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>محبوب‌ترین‌ها اکنون</span>
              </BaseHeading>
              <BaseParagraph size="sm">
                <span class="text-muted-500">
                  آخرین فعالیت‌ها را بررسی کنید
                </span>
              </BaseParagraph>
            </div>
            <!-- List -->
            <div class="space-y-2">
              <!-- List item -->
              <BaseCard
                v-for="(item, i) in trending"
                :key="i"
                rounded="lg"
                class="flex items-center gap-3 p-3"
              >
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-full"
                  :class="getRandomColor()"
                >
                  <Icon :name="item.icon" class="size-5" />
                </div>
                <div>
                  <BaseHeading
                    as="h4"
                    size="sm"
                    weight="medium"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>{{ item.name }}</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">
                      {{ item.date }}
                    </span>
                  </BaseParagraph>
                </div>
                <div class="ms-auto flex items-center">
                  <BaseButtonIcon
                    rounded="lg"
                    muted
                    class="scale-75"
                  >
                    <Icon name="lucide:arrow-right" class="size-5 rtl:rotate-180" />
                  </BaseButtonIcon>
                </div>
              </BaseCard>
            </div>
          </div>
          <!-- Grid item -->
          <div class="col-span-12 sm:col-span-6">
            <div class="my-4">
              <BaseHeading
                as="h2"
                size="lg"
                weight="light"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>فعالیت‌های محبوب</span>
              </BaseHeading>
              <BaseParagraph size="sm">
                <span class="text-muted-500">
                  آخرین فعالیت‌ها را بررسی کنید
                </span>
              </BaseParagraph>
            </div>
            <!-- List -->
            <div class="space-y-2">
              <!-- List item -->
              <BaseCard
                v-for="(item, p) in popular"
                :key="p"
                rounded="lg"
                class="flex items-center gap-3 p-3"
              >
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-full"
                  :class="getRandomColor()"
                >
                  <Icon :name="item.icon" class="size-5" />
                </div>
                <div>
                  <BaseHeading
                    as="h4"
                    size="sm"
                    weight="medium"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>{{ item.name }}</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">
                      {{ item.date }}
                    </span>
                  </BaseParagraph>
                </div>
                <div class="ms-auto flex items-center">
                  <BaseButtonIcon
                    rounded="lg"
                    muted
                    class="scale-75"
                  >
                    <Icon name="lucide:arrow-right" class="size-5 rtl:rotate-180" />
                  </BaseButtonIcon>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
      </div>
      <!-- Column -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="flex flex-col gap-6">
          <!-- Widget -->
          <BaseCard class="p-6" rounded="lg">
            <div class="flex w-full items-center justify-between">
              <DemoSearchCompact rounded="lg" />
            </div>
          </BaseCard>
          <!-- Widget -->
          <BaseCard rounded="lg" class="p-4">
            <Calendar
              :attributes="[
                {
                  key: 'today',
                  highlight: true,
                  order: 0,
                  dates: [new Date()],
                },
              ]"
              locale="fa"
              title-position="right"
              expanded
              borderless
              transparent
              trim-weeks
              class="max-w-full rounded-xl"
            />
          </BaseCard>
          <!-- Widget -->
          <BaseCard class="p-6" rounded="lg">
            <div class="mb-6">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>موقعیت‌ها</span>
              </BaseHeading>
            </div>
            <div class="space-y-1">
              <!-- Item -->
              <NuxtLink
                to="#"
                class="hover:bg-muted-100 dark:hover:bg-muted-700/50 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors duration-300"
              >
                <img
                  src="/img/illustrations/dashboards/hobbies/landscape-thumb-1.svg"
                  alt="Hello"
                  class="max-w-[48px]"
                >
                <div>
                  <BaseHeading
                    as="h4"
                    size="sm"
                    weight="medium"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>کوه ویلبور</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">اورگن · سطح 3</span>
                  </BaseParagraph>
                </div>
                <div class="ms-auto flex items-center">
                  <BaseButtonIcon
                    rounded="lg"
                    muted
                    class="scale-75"
                  >
                    <Icon name="lucide:arrow-right" class="size-5 rtl:rotate-180" />
                  </BaseButtonIcon>
                </div>
              </NuxtLink>
              <!-- Item -->
              <NuxtLink
                to="#"
                class="hover:bg-muted-100 dark:hover:bg-muted-700/50 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors duration-300"
              >
                <img
                  src="/img/illustrations/dashboards/hobbies/landscape-thumb-7.svg"
                  alt="Hello"
                  class="max-w-[48px]"
                >
                <div>
                  <BaseHeading
                    as="h4"
                    size="sm"
                    weight="medium"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>غار شیطان</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">آلاباما · سطح ۷</span>
                  </BaseParagraph>
                </div>
                <div class="ms-auto flex items-center">
                  <BaseButtonIcon
                    rounded="lg"
                    muted
                    class="scale-75"
                  >
                    <Icon name="lucide:arrow-right" class="size-5 rtl:rotate-180" />
                  </BaseButtonIcon>
                </div>
              </NuxtLink>
              <!-- Item -->
              <NuxtLink
                to="#"
                class="hover:bg-muted-100 dark:hover:bg-muted-700/50 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors duration-300"
              >
                <img
                  src="/img/illustrations/dashboards/hobbies/landscape-thumb-4.svg"
                  alt="Hello"
                  class="max-w-[48px]"
                >
                <div>
                  <BaseHeading
                    as="h4"
                    size="sm"
                    weight="medium"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>آشیانه اژدها</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">میسوری · سطح ۴</span>
                  </BaseParagraph>
                </div>
                <div class="ms-auto flex items-center">
                  <BaseButtonIcon
                    rounded="lg"
                    muted
                    class="scale-75"
                  >
                    <Icon name="lucide:arrow-right" class="size-5 rtl:rotate-180" />
                  </BaseButtonIcon>
                </div>
              </NuxtLink>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
