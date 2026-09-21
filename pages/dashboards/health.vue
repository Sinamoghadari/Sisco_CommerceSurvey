<script setup lang="ts">
import { Calendar } from 'v-calendars'
import fa from 'apexcharts/dist/locales/fa.json'

import 'v-calendars/dist/style.css'
import '~/assets/css/vcalendar.css'

definePageMeta({
  title: 'سلامتی',
  preview: {
    title: 'داشبورد سلامتی',
    description: 'برای سلامتی و ورزش',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-health.png',
    srcDark: '/img/screens/dashboards-health-dark.png',
    order: 17,
  },
})

const areaCondition = reactive(useAreaCondition())
const scatterEnergy = reactive(useScatterEnergy())
const barOxygen = reactive(useBarOxygen())
const areaProgress = reactive(useAreaProgress())
const gaugePersonal = reactive(useGaugePersonal())

function useAreaCondition() {
  const { primary } = useTailwindColors()
  const type = 'area'
  const height = 280

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      offsetX: 20,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'straight',
    },
    colors: [primary.value],
    labels: ['خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر'],
    yaxis: {
      opposite: true,
    },
    legend: {
      horizontalAlign: 'left',
    },
  }

  const series = shallowRef([
    {
      name: 'وضعیت (pt)',
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

function useScatterEnergy() {
  const { primary, info, success } = useTailwindColors()
  const height = 280
  const type = 'scatter'

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      height: 280,
      type: 'scatter',
      zoom: {
        type: 'xy',
      },
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [primary.value, success.value, info.value],
    dataLabels: {
      enabled: false,
      show: false,
    },
    grid: {
      show: false,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      show: false,
      type: 'datetime',
    },
    yaxis: {
      show: false,
      max: 70,
    },
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'center',
    },
  }

  const series = shallowRef([
    {
      name: 'تونیک',
      data: generateDayWiseTimeSeries(
        new Date('Oct 11 2020 GMT').getTime(),
        20,
        {
          min: 10,
          max: 60,
        },
      ),
    },
    {
      name: 'تانترا',
      data: generateDayWiseTimeSeries(
        new Date('Oct 11 2020 GMT').getTime(),
        20,
        {
          min: 10,
          max: 60,
        },
      ),
    },
    {
      name: 'حیاتی',
      data: generateDayWiseTimeSeries(
        new Date('Oct 11 2020 GMT').getTime(),
        30,
        {
          min: 10,
          max: 60,
        },
      ),
    },
  ])

  function generateDayWiseTimeSeries(
    baseval: number,
    count: number,
    yrange: { min: number, max: number },
  ) {
    let i = 0
    const series = []
    while (i < count) {
      const y
        = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min

      series.push([baseval, y])
      baseval += 86400000
      i++
    }
    return series
  }

  return {
    type,
    height,
    options,
    series,
  }
}

function useBarOxygen() {
  const { primary } = useTailwindColors()
  const height = 280
  const type = 'bar'

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: asPercent,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: ['دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یک‌شنبه'],
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: asPercent,
      },
    },
    colors: [primary.value],
  }

  const series = shallowRef([
    {
      name: 'تغییرات (pt)',
      data: [23, 26, 10, 7, 11, 18, 16],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}

function useAreaProgress() {
  const { primary } = useTailwindColors()
  const type = 'area'
  const height = 280

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      offsetX: 20,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'smooth',
    },
    colors: [primary.value],
    labels: ['خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر'],
    yaxis: {
      opposite: true,
    },
    legend: {
      horizontalAlign: 'left',
    },
  } as const

  const series = shallowRef([
    {
      name: 'پیشرفت (pt)',
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

function useGaugePersonal() {
  const { primary } = useTailwindColors()
  const type = 'radialBar'
  const height = 220

  const options = {
    title: {
      text: undefined,
    },
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2,
          },
        },
        hollow: {
          margin: 0,
          size: '35%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ['نتایج متوسط'],
  }

  const series = shallowRef([76])

  return {
    type,
    height,
    options,
    series,
  }
}
</script>

<template>
  <div class="relative">
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Header -->
      <div class="col-span-12">
        <div
          class="bg-primary-800 flex flex-col items-center rounded-2xl p-4 sm:flex-row"
        >
          <div class="relative h-[168px] w-[280px] shrink-0">
            <img
              class="pointer-events-none absolute -start-6 -top-20 sm:-start-10"
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="Doctor illustration"
            >
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-start">
              <BaseHeading tag="h1" class="text-white opacity-90">
                <span>خلاصه امروز</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="text-white opacity-70">
                <span>
                  فعالیت خود را نظارت کنید و به بهبود نقاط ضعف خود ادامه دهید.
                </span>
              </BaseParagraph>
              <div
                class="mt-6 flex flex-wrap gap-y-6 pb-4 text-center sm:mt-4 sm:gap-x-8 sm:pb-0 sm:text-start"
              >
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>۹۰۰ کیلوکالری</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>سوزانده شده امروز</span>
                  </BaseParagraph>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>۲۳۰۰ کیلوکالری</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>خورده شده امروز</span>
                  </BaseParagraph>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>2%</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>چربی سوزانده شده</span>
                  </BaseParagraph>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>11,424</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>گام‌های پیموده‌شده</span>
                  </BaseParagraph>
                </div>
                <div class="ptablet:hidden min-w-[33.3%] sm:min-w-0">
                  <BaseHeading
                    tag="h4"
                    weight="medium"
                    size="sm"
                    class="text-white opacity-90"
                  >
                    <span>۸.۴ کیلومتر</span>
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-white opacity-70">
                    <span>فاصله امروز</span>
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Icon box -->
      <div class="col-span-6 sm:col-span-3">
        <div class="flex flex-col">
          <div class="mb-3 flex items-center gap-2">
            <BaseIconBox
              size="md"
              class="bg-primary-500/10"
              color="none"
            >
              <Icon name="ph:drop-duotone" class="text-primary-500 size-5" />
            </BaseIconBox>
            <div class="flex items-center gap-1 font-sans">
              <span class="text-muted-800 dark:text-muted-100 font-semibold">
                114/90
              </span>
              <span class="text-muted-400 text-sm">حداقل/حداکثر</span>
            </div>
          </div>
          <div>
            <BaseHeading
              tag="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
              <span>کیفیت خون</span>
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-400">
              <span>
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت ایلیس
                ویدتور.
              </span>
            </BaseParagraph>
          </div>
        </div>
      </div>
      <!-- Icon box -->
      <div class="col-span-6 sm:col-span-3">
        <div class="flex flex-col">
          <div class="mb-3 flex items-center gap-2">
            <BaseIconBox
              size="md"
              class="bg-primary-500/10"
              color="none"
            >
              <Icon
                name="ph:heartbeat-duotone"
                class="text-primary-500 size-5"
              />
            </BaseIconBox>
            <div class="flex items-center gap-1 font-sans">
              <span class="text-muted-800 dark:text-muted-100 font-semibold">
                112
              </span>
              <span class="text-muted-400 text-sm">بی‌پی‌ام</span>
            </div>
          </div>
          <div>
            <BaseHeading
              tag="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
              <span>ضربان قلب</span>
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-400">
              <span>
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت ایلیس
                ویدتور.
              </span>
            </BaseParagraph>
          </div>
        </div>
      </div>
      <!-- Icon box -->
      <div class="col-span-6 sm:col-span-3">
        <div class="flex flex-col">
          <div class="mb-3 flex items-center gap-2">
            <BaseIconBox
              size="md"
              class="bg-primary-500/10"
              color="none"
            >
              <Icon
                name="ph:drop-half-bottom-duotone"
                class="text-primary-500 size-5"
              />
            </BaseIconBox>
            <div class="flex items-center gap-1 font-sans">
              <span class="text-muted-800 dark:text-muted-100 font-semibold">
                12/14
              </span>
              <span class="text-muted-400 text-sm">واحدها</span>
            </div>
          </div>
          <div>
            <BaseHeading
              tag="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
              <span>فشار خون</span>
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-400">
              <span>
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت ایلیس
                ویدتور.
              </span>
            </BaseParagraph>
          </div>
        </div>
      </div>
      <!-- Icon box -->
      <div class="col-span-6 sm:col-span-3">
        <div class="flex flex-col">
          <div class="mb-3 flex items-center gap-2">
            <BaseIconBox
              size="md"
              class="bg-primary-500/10"
              color="none"
            >
              <Icon name="ph:gauge-duotone" class="text-primary-500 size-5" />
            </BaseIconBox>
            <div class="flex items-center gap-1 font-sans">
              <span class="text-muted-800 dark:text-muted-100 font-semibold">
                60.4
              </span>
              <span class="text-muted-400 text-sm">پوند</span>
            </div>
          </div>
          <div>
            <BaseHeading
              tag="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
              <span>وزن</span>
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-400">
              <span>
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت ایلیس
                ویدتور.
              </span>
            </BaseParagraph>
          </div>
        </div>
      </div>
      <!-- Column -->
      <div class="col-span-12">
        <!-- Inner grid -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Inner column -->
          <div class="ltablet:col-span-9 col-span-12 lg:col-span-9">
            <!-- Chart subgrid -->
            <div class="grid grid-cols-12 gap-6">
              <!-- Chart -->
              <div class="col-span-12 sm:col-span-6">
                <BaseCard rounded="lg" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>وضعیت کلی</span>
                    </BaseHeading>
                  </div>
                  <div>
                    <BaseParagraph
                      size="xs"
                      class="text-muted-400 max-w-[240px]"
                    >
                      <Icon name="ph:question-duotone" class="size-4" />
                      <span>
                        وضعیت کلی شما بسیار خوب است. آن را حتی
                        بهتر کنید.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        بخوانید چگونه
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <AddonApexcharts
                    v-bind="areaCondition"
                    class="relative -ms-4 ltr:-start-5 rtl:-end-5"
                  />
                </BaseCard>
              </div>
              <!-- Chart -->
              <div class="col-span-12 sm:col-span-6">
                <BaseCard rounded="lg" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>سطح انرژی</span>
                    </BaseHeading>
                  </div>
                  <div>
                    <BaseParagraph
                      size="xs"
                      class="text-muted-400 max-w-[240px]"
                    >
                      <Icon name="ph:question-duotone" class="size-4" />
                      <span>
                        انرژی شما کمی ناپایدار به نظر می‌رسد. می‌توانید آن را بهبود دهید.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        بخوانید چگونه
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <AddonApexcharts v-bind="scatterEnergy" />
                </BaseCard>
              </div>
              <!-- Chart -->
              <div class="col-span-12 sm:col-span-6">
                <BaseCard rounded="lg" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>اکسیژن‌رسانی</span>
                    </BaseHeading>
                  </div>
                  <div>
                    <BaseParagraph
                      size="xs"
                      class="text-muted-400 max-w-[240px]"
                    >
                      <Icon name="ph:question-duotone" class="size-4" />
                      <span>
                        سطح اکسیژن شما کمی ناپایدار به نظر می‌رسد. می‌توانید آن را بهبود دهید.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        بخوانید چگونه
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <AddonApexcharts
                    v-bind="barOxygen"
                    class="relative ltr:-start-5 rtl:-end-5"
                  />
                </BaseCard>
              </div>
              <!-- Chart -->
              <div class="col-span-12 sm:col-span-6">
                <BaseCard rounded="lg" class="p-6">
                  <div class="mb-2 flex items-center justify-between">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>پیشرفت کلی</span>
                    </BaseHeading>
                  </div>
                  <div>
                    <BaseParagraph
                      size="xs"
                      class="text-muted-400 max-w-[240px]"
                    >
                      <Icon name="ph:question-duotone" class="size-4" />
                      <span>
                        پیشرفت کلی شما بسیار خوب است. آن را حتی بهتر کنید.
                      </span>
                      <NuxtLink
                        to="#"
                        class="text-primary-500 underline-offset-4 hover:underline"
                      >
                        بخوانید چگونه
                      </NuxtLink>
                    </BaseParagraph>
                  </div>
                  <AddonApexcharts
                    v-bind="areaProgress"
                    class="relative ltr:-start-5 rtl:-end-5 -ms-4"
                  />
                </BaseCard>
              </div>
            </div>
          </div>
          <!-- Inner column -->
          <div class="ltablet:col-span-3 col-span-12 lg:col-span-3">
            <div class="flex flex-col gap-6">
              <!-- Widget -->
              <BaseCard class="p-6" rounded="lg">
                <div class="flex w-full items-center justify-between">
                  <DemoSearchCompact rounded="lg" />
                </div>
              </BaseCard>
              <!-- Widget -->
              <BaseCard rounded="lg" class="p-2">
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
              <BaseCard class="flex h-full flex-col p-6">
                <div class="mb-6 flex items-center justify-between">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>امتیاز شخصی</span>
                  </BaseHeading>
                </div>
                <div class="py-16">
                  <AddonApexcharts v-bind="gaugePersonal" class="-mt-14" />
                </div>
                <div class="mt-auto text-center">
                  <BaseParagraph size="sm">
                    <span class="text-muted-400">
                      امتیاز شما بر اساس جدیدترین معیارها محاسبه شده است.
                    </span>
                  </BaseParagraph>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
