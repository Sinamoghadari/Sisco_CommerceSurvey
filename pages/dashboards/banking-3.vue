<script setup lang="ts">
import fa from 'apexcharts/dist/locales/fa.json'

definePageMeta({
  title: 'ارز دیجیتال',
  preview: {
    title: 'داشبورد بانکی نسخه ۳',
    description: 'برای بانکداری و حساب‌ها',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-banking-3.png',
    srcDark: '/img/screens/dashboards-banking-3-dark.png',
    order: 9,
  },
})

const activePeriod = ref('week')

const areaBtcPrice = reactive(useAreaBtcPrice())
const radialEvolution = reactive(useRadialEvolution())
const radialPopularity = reactive(useRadialPopularity())

function useAreaBtcPrice() {
  const { primary, info, success } = useTailwindColors()

  const type = 'area'
  const height = 350

  const options = shallowRef({
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      foreColor: '#999',
      stacked: true,
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        enabledSeries: [0],
        top: -2,
        left: 2,
        blur: 5,
        opacity: 0.06,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [success.value, primary.value, info.value],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    title: {
      text: '',
      align: 'left',
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      strokeColor: '#fff',
      strokeWidth: 3,
      strokeOpacity: 1,
      fillOpacity: 1,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        offsetX: 0,
        offsetY: -5,
      },
      tooltip: {
        enabled: true,
      },
    },
    grid: {
      show: true,
      padding: {
        left: -5,
        right: 5,
      },
    },
    tooltip: {
      x: {
        format: 'dd MMMM yyyy',
      },
      y: {
        formatter: function (val: number) {
          return val + '%'
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    fill: {
      type: 'solid',
      fillOpacity: 0.7,
    },
  })

  const series = shallowRef([
    {
      name: 'مورد انتظار',
      data: generateDayWiseTimeSeries(0, 18),
    },
    {
      name: 'واقعی',
      data: generateDayWiseTimeSeries(1, 18),
    },
  ])

  function generateDayWiseTimeSeries(s: number, count: number) {
    const values = [
      [
        0.4, 0.3, 1, 0.9, 2.9, 1.9, 2.5, 0.9, 1.2, 0.7, 1.9, 0.5, 1.3, 0.9, 1.7,
        0.2, 0.7, 0.5,
      ],
      [
        0.2, 0.3, 0.8, 0.7, 2.2, 1.6, 2.3, 0.7, 1.1, 0.5, 1.2, 0.5, 1, 0.4, 1.5,
        0.2, 0.6, 2,
      ],
    ]
    let i = 0
    const series = []
    let x = new Date('11 Nov 2022').getTime()
    while (i < count) {
      series.push([x, values[s][i]])
      x += 86400000
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

function useRadialEvolution() {
  const { primary, info, success } = useTailwindColors()
  const type = 'radialBar'
  const height = 220

  const series = shallowRef([54])

  const options = {
    colors: [primary.value, success.value, info.value],
    title: {
      text: '',
      align: 'left',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            offsetY: 15,
            fontSize: '13px',
            fontFamily: 'Vazirmatn FD, sans-serif',
            color: 'var(--color-muted-400)',
            formatter: function () {
              return ['(۳۰ روز)']
            },
          },
          value: {
            color: 'var(--color-muted-400)',
            offsetY: -20,
            fontSize: '16px',
            fontFamily: 'Vazirmatn FD, sans-serif',
            fontWeight: '500',
          },
        },
      },
    },
    labels: ['نسبت میانه'],
  }

  return {
    type,
    height,
    series,
    options,
  }
}

function useRadialPopularity() {
  const { primary, success } = useTailwindColors()
  const type = 'radialBar'
  const height = 225

  const options = {
    title: {
      text: '',
    },
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value, success.value],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-muted-400)',
            offsetY: 80,
          },
          value: {
            offsetY: 40,
            fontSize: '18px',
            fontFamily: 'Vazirmatn FD, sans-serif',
            fontWeight: '500',
            color: undefined,
            formatter: function (val: number) {
              return val + '%'
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: ['(۳۰ روز)'],
  }

  const series = shallowRef([67])

  return {
    type,
    height,
    options,
    series,
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div
      class="mb-6 flex flex-col justify-between gap-y-4 sm:flex-row sm:items-center"
    >
      <div>
        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
          آخرین نمودار قیمت بیت‌کوین (BTC)
        </BaseParagraph>
        <BaseHeading
          size="3xl"
          weight="bold"
          class="text-muted-800 dark:text-white"
        >
          <span
            class="after:text-success-500 after:relative after:-end-2 after:-top-3 after:text-sm after:content-['+3.4%']"
          >
            {{ formatPrice(10584.3) }}
          </span>
        </BaseHeading>
      </div>
      <div class="flex gap-2 sm:justify-end">
        <BaseButtonAction
          :color="activePeriod === 'hour' ? 'primary' : 'default'"
          @click="activePeriod = 'hour'"
        >
          ساعت
        </BaseButtonAction>
        <BaseButtonAction
          :color="activePeriod === 'day' ? 'primary' : 'default'"
          @click="activePeriod = 'day'"
        >
          روز
        </BaseButtonAction>
        <BaseButtonAction
          :color="activePeriod === 'week' ? 'primary' : 'default'"
          @click="activePeriod = 'week'"
        >
          هفته
        </BaseButtonAction>
        <BaseButtonAction
          :color="activePeriod === 'month' ? 'primary' : 'default'"
          @click="activePeriod = 'month'"
        >
          ماه
        </BaseButtonAction>
        <BaseButtonAction
          :color="activePeriod === 'year' ? 'primary' : 'default'"
          @click="activePeriod = 'year'"
        >
          سال
        </BaseButtonAction>
      </div>
    </div>
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-4">
      <!-- Column -->
      <div class="ltablet:col-span-8 col-span-12 gap-4 lg:col-span-8">
        <div class="flex flex-col gap-4">
          <!-- Tile grid -->
          <div class="grid gap-4 sm:grid-cols-3">
            <!-- Tile -->
            <div class="relative">
              <BaseCard class="space-y-1 p-5">
                <BaseParagraph
                  size="xs"
                  class="text-muted-500 dark:text-muted-400"
                >
                  ارزش بازار
                </BaseParagraph>
                <BaseHeading
                  size="lg"
                  weight="semibold"
                  class="text-muted-800 dark:text-white"
                >
                  <span>{{ formatPrice(129992260090) }}</span>
                </BaseHeading>
              </BaseCard>
            </div>
            <!-- Tile -->
            <div class="relative">
              <BaseCard class="space-y-1 p-5">
                <BaseParagraph
                  size="xs"
                  class="text-muted-500 dark:text-muted-400"
                >
                  حجم ۲۴ ساعت
                </BaseParagraph>
                <BaseHeading
                  size="lg"
                  weight="semibold"
                  class="text-muted-800 dark:text-white"
                >
                  <span>{{ formatPrice(453178) }}</span>
                </BaseHeading>
              </BaseCard>
            </div>
            <!-- Tile -->
            <div class="relative">
              <BaseCard class="space-y-1 p-5">
                <BaseParagraph
                  size="xs"
                  class="text-muted-500 dark:text-muted-400"
                >
                  بالا و پایین در ۲۴ ساعت
                </BaseParagraph>
                <BaseHeading
                  size="lg"
                  weight="semibold"
                  class="text-muted-800 dark:text-white"
                >
                  <span>
                    {{ formatPrice(10212) }} - {{ formatPrice(10584) }}
                  </span>
                </BaseHeading>
              </BaseCard>
            </div>
          </div>
          <!-- Chart -->
          <BaseCard class="relative p-6">
            <div class="mb-6">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>نمودار قیمت BTC</span>
              </BaseHeading>
            </div>

            <AddonApexcharts v-bind="areaBtcPrice" class="ltr:-ms-4 rtl:-me-4" />
          </BaseCard>
          <!-- Subgrid -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Chart -->
            <div class="relative">
              <BaseCard class="p-6">
                <div class="mb-6 flex items-center justify-between">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>تحول BTC</span>
                  </BaseHeading>
                  <BaseButton
                    color="primary"
                    size="sm"
                    variant="pastel"
                    rounded="md"
                  >
                    خرید بیت‌کوین
                  </BaseButton>
                </div>
                <AddonApexcharts v-bind="radialEvolution" />
              </BaseCard>
            </div>
            <!-- Chart -->
            <div class="relative">
              <BaseCard class="p-6">
                <div class="mb-6 flex items-center justify-between">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>محبوبیت بیت‌کوین</span>
                  </BaseHeading>
                  <BaseButton
                    color="primary"
                    size="sm"
                    variant="pastel"
                    rounded="md"
                  >
                    خرید BT
                  </BaseButton>
                </div>
                <AddonApexcharts v-bind="radialPopularity" />
              </BaseCard>
            </div>
          </div>
        </div>
      </div>
      <!-- Column -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="flex flex-col gap-4">
          <!-- Currency -->
          <div class="relative">
            <BaseCard class="p-8">
              <div class="mb-6 flex items-center gap-2">
                <Icon
                  name="cryptocurrency:btc"
                  class="size-9 text-orange-400"
                />
                <div>
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="snug"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>بیت‌کوین</span>
                  </BaseHeading>
                  <BaseParagraph
                    size="xs"
                    weight="semibold"
                    class="text-muted-500 dark:text-muted-400"
                  >
                    BTC
                  </BaseParagraph>
                </div>
                <div class="ms-auto">
                  <BaseButtonAction
                    size="sm"
                    class="text-muted-500 dark:text-muted-400"
                  >
                    ارزها
                  </BaseButtonAction>
                </div>
              </div>
              <div>
                <BaseParagraph
                  size="sm"
                  class="text-muted-500 dark:text-muted-400"
                >
                  بیت‌کوین یک ارز دیجیتال است که در سال ۲۰۰۸ توسط شخص یا گروهی ناشناس با نام ساتوشی ناکاموتو اختراع شد. این ارز به صورت ناشناس راه‌اندازی شد، بدون بانک مرکزی یا مدیر واحد، و به صورت همتا به همتا عمل می‌کند.
                </BaseParagraph>
              </div>
              <div class="mt-6 flex items-center gap-2">
                <BaseButton color="default" class="w-full">
                  <span>مقایسه</span>
                </BaseButton>
                <BaseButton color="primary" class="w-full">
                  <span>خرید بیت‌کوین</span>
                </BaseButton>
              </div>
            </BaseCard>
          </div>
          <!-- Widget -->
          <div class="relative">
            <BaseCard class="p-6">
              <!-- Title -->
              <div class="mb-8 flex items-center justify-between">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>تیم من</span>
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
              <DemoTeamListCompact actions />
            </BaseCard>
          </div>
          <!--Grid item-->
          <div class="relative">
            <BaseCard class="p-6">
              <!-- Title -->
              <div class="mb-8 flex items-center justify-between">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>سکه‌های محبوب</span>
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
              <DemoPopularCryptos />
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
