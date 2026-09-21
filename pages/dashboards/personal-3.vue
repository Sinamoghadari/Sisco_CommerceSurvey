<script setup lang="ts">
import { Calendar } from 'v-calendars'
import fa from 'apexcharts/dist/locales/fa.json'

import 'v-calendars/dist/style.css'
import '~/assets/css/vcalendar.css'

definePageMeta({
  title: 'مصاحبه‌ها',
  preview: {
    title: 'داشبورد شخصی نسخه ۳',
    description: 'برای استفاده و گزارش‌های شخصی',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-personal-3.png',
    srcDark: '/img/screens/dashboards-personal-3-dark.png',
    order: 3,
  },
})

const areaInterviews = reactive(useAreaInterviews())

function useAreaInterviews() {
  const { primary, info, success } = useTailwindColors()
  const type = 'area'
  const height = 220

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      height: 220,
      type: 'area',
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [primary.value, info.value, success.value],
    title: {
      text: undefined,
      align: 'left',
    },
    legend: {
      position: 'top',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2020-09-19T00:00:00.000Z',
        '2020-09-20T01:30:00.000Z',
        '2020-09-21T02:30:00.000Z',
        '2020-09-22T03:30:00.000Z',
        '2020-09-23T04:30:00.000Z',
        '2020-09-24T05:30:00.000Z',
        '2020-09-25T06:30:00.000Z',
      ],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  }

  const series = shallowRef([
    {
      name: 'مصاحبه‌ها',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}

const candidates = [
  {
    id: 0,
    tooltip: 'آدام رانگلر',
    src: '/img/avatars/15.svg',
    text: 'EC',
    role: 'طراح رابط کاربری / تجربه کاربری',
  },
  {
    id: 1,
    tooltip: 'جنیفر میلر',
    src: '/img/avatars/5.svg',
    text: 'JM',
    role: 'توسعه‌دهنده فرانت‌اند',
  },
  {
    id: 2,
    tooltip: 'تارا سوِنسون',
    src: '/img/avatars/4.svg',
    text: 'TS',
    role: 'معمار نرم‌افزار',
  },
  {
    id: 3,
    tooltip: 'نائومی لیورسکی',
    src: undefined,
    text: 'NL',
    role: 'طراح رابط کاربری / تجربه کاربری',
  },
]
</script>

<template>
  <div
    class="ltablet:grid-cols-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
  >
    <!--Grid item-->
    <div>
      <BaseCard
        class="bg-muted-200 flex h-full flex-col border-0 p-8"
        rounded="lg"
      >
        <div class="mb-5">
          <BaseHeading
            as="h2"
            size="3xl"
            weight="light"
            lead="tight"
            class="text-muted-800 mb-2 dark:text-white"
          >
            <span>سلام، مایا ر.</span>
          </BaseHeading>
          <BaseParagraph size="sm">
            <span class="text-muted-400">
              شما باید ۶ مصاحبه در این هفته انجام دهید. پیشرفت فعلی شما عالی است. برنامه خود را بررسی کنید و هیچ فعالیتی را از دست ندهید.
            </span>
          </BaseParagraph>
        </div>
        <div class="mb-4 mt-auto flex items-center gap-2">
          <div class="text-4xl">
            <span>🎉</span>
          </div>
          <div>
            <BaseParagraph size="xs">
              <span class="text-muted-400 mb-2">پیشرفت شما</span>
            </BaseParagraph>
            <BaseHeading
              as="h4"
              size="md"
              weight="light"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>برجسته</span>
            </BaseHeading>
          </div>
        </div>
        <div>
          <BaseButton
            color="primary"
            rounded="lg"
            class="h-11 w-full"
          >
            <span>مشاهده برنامه</span>
          </BaseButton>
        </div>
      </BaseCard>
    </div>
    <!--Grid item-->
    <div class="grid grid-cols-2 gap-4">
      <!-- Inner item -->
      <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
        <BaseIconBox
          size="sm"
          class="bg-info-100 text-info-500 dark:bg-info-500/20 dark:text-info-400 dark:border-info-500 dark:border-2"
          rounded="full"
          color="none"
        >
          <Icon name="ph:timer-duotone" class="size-5" />
        </BaseIconBox>
        <div>
          <BaseHeading
            as="h2"
            size="sm"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>۶۲ هزار تومان</span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <span class="text-muted-500 dark:text-muted-400">دقایق</span>
          </BaseParagraph>
        </div>
      </BaseCard>
      <!-- Inner item -->
      <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
        <BaseIconBox
          size="sm"
          class="bg-primary-100 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500 dark:border-2"
          rounded="full"
          color="none"
        >
          <Icon name="ph:broadcast-duotone" class="size-5" />
        </BaseIconBox>
        <div>
          <BaseHeading
            as="h2"
            size="sm"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>263</span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <span class="text-muted-500 dark:text-muted-400">مصاحبه‌ها</span>
          </BaseParagraph>
        </div>
      </BaseCard>
      <!-- Inner item -->
      <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
        <BaseIconBox
          size="sm"
          class="bg-lime-100 text-lime-500 dark:border-2 dark:border-lime-500 dark:bg-lime-500/20 dark:text-lime-400"
          rounded="full"
          color="none"
        >
          <Icon name="ph:user-plus-duotone" class="size-5" />
        </BaseIconBox>
        <div>
          <BaseHeading
            as="h2"
            size="sm"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>49</span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <span class="text-muted-500 dark:text-muted-400">تأیید شده</span>
          </BaseParagraph>
        </div>
      </BaseCard>
      <!-- Inner item -->
      <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
        <BaseIconBox
          size="sm"
          class="bg-amber-100 text-amber-500 dark:border-2 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-400"
          rounded="full"
          color="none"
        >
          <Icon name="ph:door-duotone" class="size-5" />
        </BaseIconBox>
        <div>
          <BaseHeading
            as="h2"
            size="sm"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>214</span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <span class="text-muted-500 dark:text-muted-400">رد شده</span>
          </BaseParagraph>
        </div>
      </BaseCard>
      <!-- Inner item -->
      <div class="col-span-2">
        <div class="mt-auto flex h-full items-end justify-between pb-4">
          <div>
            <BaseHeading
              as="h2"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>کل مصاحبه‌ها</span>
            </BaseHeading>
            <BaseParagraph size="xs">
              <span class="text-muted-500 dark:text-muted-400">
                ۲۳ مصاحبه در این ماه
              </span>
            </BaseParagraph>
          </div>
          <div>
            <BaseAvatarGroup
              :avatars="candidates"
              size="sm"
              :limit="2"
            />
          </div>
        </div>
      </div>
    </div>
    <!--Grid item-->
    <div>
      <BaseCard class="p-4" rounded="lg">
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
    </div>
    <!--Grid item-->
    <div>
      <BaseCard class="p-6" rounded="lg">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>مهارت‌های ترند</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTrendingSkills />
      </BaseCard>
    </div>
    <!-- Grid item -->
    <div>
      <!-- Chart -->
      <BaseCard rounded="lg" class="p-6">
        <div class="mb-6 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>مصاحبه‌ها</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            گزارش‌ها
          </BaseButton>
        </div>
        <AddonApexcharts v-bind="areaInterviews" class="ltr:-ms-4 rtl:-me-4" />
      </BaseCard>
    </div>
    <!-- Grid item -->
    <div class="flex flex-col gap-4">
      <!-- Card -->
      <BaseCard rounded="lg" class="flex items-center gap-3 p-4">
        <BaseAvatar src="/img/avatars/11.svg" size="md" />
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>جاناتان ک.</span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <span class="text-muted-400">۸:۰۰ ق.ظ — ۹:۰۰ ق.ظ</span>
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
      <!-- Card -->
      <BaseCard rounded="lg" class="flex items-center gap-3 p-4">
        <BaseAvatar src="/img/avatars/16.svg" size="md" />
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>اروین اس.</span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <span class="text-muted-400">۱۰:۳۰ ق.ظ — ۱۱:۳۰ ق.ظ</span>
          </BaseParagraph>
        </div>
        <div class="ms-auto flex items-center">
          <BaseButtonIcon
            rounded="lg"
            muted
            class="scale-75"
          >
            <Icon name="lucide:arrow-right" class="rtl:rotate-180 size-5" />
          </BaseButtonIcon>
        </div>
      </BaseCard>
      <!-- Card -->
      <BaseCard rounded="lg" class="flex items-center gap-3 p-4">
        <BaseAvatar src="/img/avatars/5.svg" size="md" />
        <div>
          <BaseHeading
            as="h4"
            size="sm"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>جنیفر م.</span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <span class="text-muted-400">۱۴:۰۰ — ۱۵:۰۰</span>
          </BaseParagraph>
        </div>
        <div class="ms-auto flex items-center">
          <BaseButtonIcon
            rounded="lg"
            muted
            class="scale-75"
          >
            <Icon name="lucide:arrow-right" class="rtl:rotate-180 size-5" />
          </BaseButtonIcon>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
