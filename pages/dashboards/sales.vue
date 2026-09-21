<script setup lang="ts">
/* eslint-disable sonarjs/no-identical-functions */
import { Calendar } from 'v-calendars'
import fa from 'apexcharts/dist/locales/fa.json'

import 'v-calendars/dist/style.css'
import '~/assets/css/vcalendar.css'

definePageMeta({
  title: 'فروش',
  preview: {
    title: 'داشبورد فروش',
    description: 'برای فروش و بازاریابی',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-sales.png',
    srcDark: '/img/screens/dashboards-sales-dark.png',
    order: 6,
  },
})

const sparkSalesOne = reactive(useSparkSalesOne())
const sparkSalesTwo = reactive(useSparkSalesTwo())
const sparkSalesThree = reactive(useSparkSalesThree())
const sparkSalesFour = reactive(useSparkSalesFour())
const areaCustomers = reactive(useAreaCustomers())
const radialSalesRevenue = reactive(useRadialSalesRevenue())
const radialSmallOne = reactive(useRadialSmallOne())
const radialSmallTwo = reactive(useRadialSmallTwo())
const radialSmallThree = reactive(useRadialSmallThree())
const gaugePersonal = reactive(useGaugePersonal())
const barOrders = reactive(useBarOrders())

function useSparkSalesOne() {
  const { primary, title, subtitle } = useTailwindColors()
  const type = 'area'
  const height = 130

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      id: 'sparkline1',
      group: 'sparklines',
      sparkline: {
        enabled: true,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [primary.value],
    stroke: {
      width: [2],
      curve: 'straight',
    },
    fill: {
      opacity: 1,
    },
    labels: [...Array(24).keys()].map(n => `2020-10-0${n + 1}`),
    yaxis: {
      min: 0,
      labels: {
        minWidth: 100,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    title: {
      text: 'کل فروش',
      offsetX: -5,
      align: 'right',
      style: {
        fontFamily: 'Vazirmatn FD, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        color: subtitle.value,
        cssClass: 'apexcharts-spark-title',
      },
    },
    subtitle: {
      text: '9,374',
      offsetX: -5,
      align: 'right',
      offsetY: 15,
      style: {
        fontFamily: 'Vazirmatn FD, sans-serif',
        fontSize: '22px',
        fontWeight: '500',
        color: title.value,
        cssClass: 'apexcharts-spark-subtitle',
      },
    },
  }

  const series = shallowRef([
    {
      name: 'کل فروش',
      data: randomizeArray([
        472, 454, 547, 385, 562, 247, 652, 318, 379, 391, 622, 515, 355, 415,
        358, 271, 932, 534, 615, 278, 546, 435, 192, 465,
      ]),
    },
  ])

  let timeout: any

  onMounted(() => {
    radomizeTimeout()
  })
  onBeforeUnmount(() => {
    clearTimeout(timeout)
  })

  function radomizeTimeout() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      series.value[0].data.push(randomNumber(200, 600))
      series.value[0].data.shift()
      radomizeTimeout()
    }, 2000)
  }

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function randomizeArray(arg: number[]) {
    const array = arg.slice()
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  return {
    type,
    height,
    options,
    series,
  }
}

function useSparkSalesTwo() {
  const { success, title, subtitle } = useTailwindColors()

  const type = 'area'
  const height = 130

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      id: 'sparkline1',
      group: 'sparklines',
      sparkline: {
        enabled: true,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [success.value],
    stroke: {
      width: [2],
      curve: 'straight',
    },
    fill: {
      opacity: 1,
    },
    labels: [...Array(24).keys()].map(n => `2020-10-0${n + 1}`),
    yaxis: {
      min: 0,
      labels: {
        minWidth: 100,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    title: {
      text: 'کل سود',
      offsetX: -5,
      align: 'right',
      style: {
        fontFamily: 'Vazirmatn FD, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        color: subtitle.value,
        cssClass: 'apexcharts-spark-title',
      },
    },
    subtitle: {
      text: '24,273.31 تومان',
      offsetX: -5,
      align: 'right',
      offsetY: 15,
      style: {
        fontFamily: 'Vazirmatn FD, sans-serif',
        fontSize: '22px',
        fontWeight: '500',
        color: title.value,
        cssClass: 'apexcharts-spark-subtitle',
      },
    },
  }

  const series = shallowRef([
    {
      name: 'کل سود',
      data: randomizeArray([
        472, 454, 547, 385, 562, 247, 652, 318, 379, 391, 622, 515, 355, 415,
        358, 271, 932, 534, 615, 278, 546, 435, 192, 465,
      ]),
    },
  ])

  let timeout: any

  onMounted(() => {
    radomizeTimeout()
  })
  onBeforeUnmount(() => {
    clearTimeout(timeout)
  })

  function radomizeTimeout() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      series.value[0].data.push(randomNumber(200, 600))
      series.value[0].data.shift()
      radomizeTimeout()
    }, 2000)
  }

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function randomizeArray(arg: number[]) {
    const array = arg.slice()
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  return {
    type,
    height,
    options,
    series,
  }
}

function useSparkSalesThree() {
  const { yellow, title, subtitle } = useTailwindColors()
  const type = 'area'
  const height = 130

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      id: 'sparkline1',
      group: 'sparklines',
      sparkline: {
        enabled: true,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [yellow.value],
    stroke: {
      width: [2],
      curve: 'straight',
    },
    fill: {
      opacity: 1,
    },
    labels: [...Array(24).keys()].map(n => `2020-10-0${n + 1}`),
    yaxis: {
      min: 0,
      labels: {
        minWidth: 100,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    title: {
      text: 'کل سفارشات',
      offsetX: -5,
      align: 'right',
      style: {
        fontFamily: 'Vazirmatn FD, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        color: subtitle.value,
        cssClass: 'apexcharts-spark-title',
      },
    },
    subtitle: {
      text: '3912',
      offsetX: -5,
      align: 'right',
      offsetY: 15,
      style: {
        fontFamily: 'Vazirmatn FD, sans-serif',
        fontSize: '22px',
        fontWeight: '500',
        color: title.value,
        cssClass: 'apexcharts-spark-subtitle',
      },
    },
  }

  const series = shallowRef([
    {
      name: 'کل سفارشات',
      data: randomizeArray([
        472, 454, 547, 385, 562, 247, 652, 318, 379, 391, 622, 515, 355, 415,
        358, 271, 932, 534, 615, 278, 546, 435, 192, 465,
      ]),
    },
  ])

  let timeout: any

  onMounted(() => {
    radomizeTimeout()
  })
  onBeforeUnmount(() => {
    clearTimeout(timeout)
  })

  function radomizeTimeout() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      series.value[0].data.push(randomNumber(200, 600))
      series.value[0].data.shift()
      radomizeTimeout()
    }, 2000)
  }

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function randomizeArray(arg: number[]) {
    const array = arg.slice()
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  return {
    type,
    height,
    options,
    series,
  }
}

function useSparkSalesFour() {
  const { info, title, subtitle } = useTailwindColors()

  const type = 'area'
  const height = 130

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      id: 'sparkline1',
      group: 'sparklines',
      sparkline: {
        enabled: true,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [info.value],
    stroke: {
      width: [2],
      curve: 'straight',
    },
    fill: {
      opacity: 1,
    },
    labels: [...Array(24).keys()].map(n => `2020-10-0${n + 1}`),
    yaxis: {
      min: 0,
      labels: {
        minWidth: 100,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    title: {
      text: 'تثبیت شده',
      offsetX: -5,
      align: 'right',
      style: {
        fontFamily: 'Vazirmatn FD, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        color: subtitle.value,
        cssClass: 'apexcharts-spark-title',
      },
    },
    subtitle: {
      text: '17,865.29 تومان',
      offsetX: -5,
      align: 'right',
      offsetY: 15,
      style: {
        fontFamily: 'Vazirmatn FD, sans-serif',
        fontSize: '22px',
        fontWeight: '500',
        color: title.value,
        cssClass: 'apexcharts-spark-subtitle',
      },
    },
  }

  const series = shallowRef([
    {
      name: 'تلفیقی',
      data: randomizeArray([
        472, 454, 547, 385, 562, 247, 652, 318, 379, 391, 622, 515, 355, 415,
        358, 271, 932, 534, 615, 278, 546, 435, 192, 465,
      ]),
    },
  ])

  let timeout: any

  onMounted(() => {
    radomizeTimeout()
  })
  onBeforeUnmount(() => {
    clearTimeout(timeout)
  })

  function radomizeTimeout() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      series.value[0].data.push(randomNumber(200, 600))
      series.value[0].data.shift()
      radomizeTimeout()
    }, 2000)
  }

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function randomizeArray(arg: number[]) {
    const array = arg.slice()
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  return {
    type,
    height,
    options,
    series,
  }
}

function useAreaCustomers() {
  const { primary, info, success } = useTailwindColors()
  const type = 'area'
  const height = 258

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [primary.value, info.value, success.value],
    title: {
      show: false,
      text: undefined,
      align: 'left',
    },
    legend: {
      show: true,
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
      name: 'بازگشت',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'نوآوران',
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: 'رد شده',
      data: [78, 53, 36, 10, 14, 5, 2],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}

function useRadialSalesRevenue() {
  const { primary } = useTailwindColors()
  const type = 'radialBar'
  const height = 155

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [primary.value],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '75%',
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
            fontSize: '12px',
            fontFamily: 'Vazirmatn FD, sans-serif',
            fontWeight: 400,
            offsetY: 5,
          },
          value: {
            show: true,
            fontWeight: 600,
            fontFamily: 'Vazirmatn FD, sans-serif',
            fontSize: '16px',
            offsetY: 5,
          },
        },
      },
    },
    labels: ['پیشرفت'],
  }

  const series = shallowRef([65])

  return {
    type,
    height,
    options,
    series,
  }
}

function useRadialSmallOne() {
  const { primary } = useTailwindColors()
  const type = 'radialBar'
  const height = 100

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      height: 100,
      type: 'radialBar',
      offsetY: -10,
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '35%',
        },
        dataLabels: {
          show: false,
        },
      },
    },
    labels: [''],
  }

  const series = shallowRef([31])

  return {
    type,
    height,
    options,
    series,
  }
}

function useRadialSmallTwo() {
  const { success } = useTailwindColors()
  const type = 'radialBar'
  const height = 100

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      height: 100,
      type: 'radialBar',
      offsetY: -10,
      toolbar: {
        show: false,
      },
    },
    colors: [success.value],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '35%',
        },
        dataLabels: {
          show: false,
        },
      },
    },
    labels: [''],
  }

  const series = shallowRef([53])

  return {
    type,
    height,
    options,
    series,
  }
}

function useRadialSmallThree() {
  const { danger } = useTailwindColors()
  const type = 'radialBar'
  const height = 100

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      height: 100,
      type: 'radialBar',
      offsetY: -10,
      toolbar: {
        show: false,
      },
    },
    colors: [danger.value],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '35%',
        },
        dataLabels: {
          show: false,
        },
      },
    },
    labels: [''],
  }

  const series = shallowRef([84])

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

function useBarOrders() {
  const { primary, success } = useTailwindColors()
  const type = 'bar'
  const height = 210

  const series = shallowRef<any[]>([])

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [primary.value, success.value],
    dataLabels: {
      enabled: false,
    },
    noData: {
      text: 'در حال بارگذاری...',
    },
    xaxis: {
      type: 'category',
      tickPlacement: 'on',
      labels: {
        rotate: -45,
        rotateAlways: true,
      },
    },
  }

  // delay the data loading
  let timeout: any
  let timeout2: any

  onMounted(() => {
    const { series } = useBarOrders()

    timeout = setTimeout(() => {
      series.value.push({
        name: 'سفارشات',
        data: [
          {
            x: 'دی',
            y: 322,
          },
          {
            x: 'بهمن',
            y: 459,
          },
          {
            x: 'اسفند',
            y: 212,
          },
          {
            x: 'فروردین',
            y: 345,
          },
          {
            x: 'اردیبهشت',
            y: 111,
          },
          {
            x: 'خرداد',
            y: 189,
          },
          {
            x: 'تیر',
            y: 498,
          },
          {
            x: 'اَمرداد',
            y: 612,
          },
          {
            x: 'شهریور',
            y: 451,
          },
          {
            x: 'مهر',
            y: 248,
          },
          {
            x: 'آبان',
            y: 306,
          },
          {
            x: 'آذر',
            y: 366,
          },
        ],
      })
    }, 1000)

    timeout2 = setTimeout(() => {
      series.value.push({
        name: 'رد شده',
        data: [
          {
            x: 'دی',
            y: 25,
          },
          {
            x: 'بهمن',
            y: 49,
          },
          {
            x: 'اسفند',
            y: 36,
          },
          {
            x: 'فروردین',
            y: 84,
          },
          {
            x: 'اردیبهشت',
            y: 64,
          },
          {
            x: 'خرداد',
            y: 131,
          },
          {
            x: 'تیر',
            y: 48,
          },
          {
            x: 'اَمرداد',
            y: 144,
          },
          {
            x: 'شهریور',
            y: 96,
          },
          {
            x: 'مهر',
            y: 11,
          },
          {
            x: 'آبان',
            y: 31,
          },
          {
            x: 'آذر',
            y: 8,
          },
        ],
      })
    }, 2500)
  })

  onBeforeUnmount(() => {
    clearTimeout(timeout)
    clearTimeout(timeout2)
  })

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
    <div class="mb-8 flex flex-col justify-between md:flex-row md:items-center">
      <div
        class="ltablet:max-w-full flex max-w-[425px] flex-col items-center gap-4 text-center md:flex-row md:text-start lg:max-w-full"
      >
        <BaseAvatar src="/img/avatars/2.svg" size="lg" />
        <div>
          <BaseHeading
            as="h2"
            size="xl"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>خوش آمدید، مایا</span>
          </BaseHeading>
          <BaseParagraph>
            <span class="text-muted-500">
              خوشحالیم که دوباره شما را در داشبوردتان می‌بینیم.
            </span>
          </BaseParagraph>
        </div>
      </div>
      <div
        class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start"
      >
        <BaseButton>
          <span>مشاهده گزارش‌ها</span>
        </BaseButton>
        <BaseButton color="primary">
          <span>تراکنش‌ها</span>
        </BaseButton>
      </div>
    </div>
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Sparkline -->
      <div
        class="ltablet:col-span-3 relative col-span-12 md:col-span-6 lg:col-span-3"
      >
        <BaseCard class="pt-4">
          <AddonApexcharts v-bind="sparkSalesOne" />
        </BaseCard>
      </div>
      <!-- Sparkline -->
      <div
        class="ltablet:col-span-3 relative col-span-12 md:col-span-6 lg:col-span-3"
      >
        <BaseCard class="pt-4">
          <AddonApexcharts v-bind="sparkSalesTwo" />
        </BaseCard>
      </div>
      <!-- Sparkline -->
      <div
        class="ltablet:col-span-3 relative col-span-12 md:col-span-6 lg:col-span-3"
      >
        <BaseCard class="pt-4">
          <AddonApexcharts v-bind="sparkSalesThree" />
        </BaseCard>
      </div>
      <!-- Sparkline -->
      <div
        class="ltablet:col-span-3 relative col-span-12 md:col-span-6 lg:col-span-3"
      >
        <BaseCard class="pt-4">
          <AddonApexcharts v-bind="sparkSalesFour" />
        </BaseCard>
      </div>
      <!-- Chart -->
      <div class="relative col-span-12 md:col-span-7">
        <BaseCard class="p-6">
          <div class="mb-2 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>بررسی درآمد</span>
            </BaseHeading>
            <BaseButton
              color="primary"
              size="sm"
              variant="pastel"
              rounded="md"
            >
              جزئیات
            </BaseButton>
          </div>
          <div class="flex gap-8">
            <div>
              <span class="text-muted-400 font-sans text-xs">این ماه</span>
              <p class="text-primary-500 font-sans text-lg font-medium">
                ۷۵۶۸۹۰ تومان
              </p>
            </div>
            <div>
              <span class="text-muted-400 font-sans text-xs">ماه گذشته</span>
              <p
                class="text-muted-800 dark:text-muted-100 font-sans text-lg font-medium"
              >
                ۵۹,۷۲۴ تومان
              </p>
            </div>
            <div>
              <span class="text-muted-400 font-sans text-xs">میانگین</span>
              <p
                class="text-muted-800 dark:text-muted-100 font-sans text-lg font-medium"
              >
                66,561 تومان
              </p>
            </div>
          </div>
          <AddonApexcharts v-bind="areaCustomers" class="ltr:-ms-4 rtl:-me-4" />
        </BaseCard>
      </div>
      <!-- Column -->
      <div class="relative col-span-12 md:col-span-5">
        <div class="flex h-full flex-col gap-6">
          <!-- Chart -->
          <BaseCard class="flex-1 p-6">
            <div class="flex items-center justify-center">
              <div class="flex-1">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="text-muted-800 mb-4 dark:text-white"
                >
                  <span>درآمد فروش</span>
                </BaseHeading>
                <BaseHeading
                  as="h4"
                  size="lg"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 mb-2 dark:text-white"
                >
                  <span>۸۶,۴۱۲,۶۰۰ تومان</span>
                </BaseHeading>
                <BaseParagraph size="xs">
                  <span class="text-muted-400">
                    لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت.
                    بونوم اینتگراتیاس کوریس.
                  </span>
                </BaseParagraph>
              </div>
              <div class="flex-1">
                <AddonApexcharts v-bind="radialSalesRevenue" />
              </div>
            </div>
          </BaseCard>
          <!-- Charts -->
          <BaseCard class="flex-1 p-6">
            <div class="mb-6 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>آمار اضافی</span>
              </BaseHeading>
            </div>
            <div class="flex justify-between gap-2">
              <div class="flex flex-1 flex-col gap-2 text-center">
                <AddonApexcharts v-bind="radialSmallOne" />
                <div class="-mt-6">
                  <BaseHeading
                    as="h5"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>278</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">قراردادهای جدید</span>
                  </BaseParagraph>
                </div>
              </div>
              <div class="flex flex-1 flex-col gap-2 text-center">
                <AddonApexcharts v-bind="radialSmallTwo" />
                <div class="-mt-6">
                  <BaseHeading
                    as="h5"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>1,519</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">پیشنهادات</span>
                  </BaseParagraph>
                </div>
              </div>
              <div class="flex flex-1 flex-col gap-2 text-center">
                <AddonApexcharts v-bind="radialSmallThree" />
                <div class="-mt-6">
                  <BaseHeading
                    as="h5"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    <span>3,214</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">قراردادهای بسته‌شده</span>
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
      <!-- Column -->
      <div
        class="ltablet:col-span-4 relative col-span-12 md:col-span-6 lg:col-span-3"
      >
        <BaseCard class="flex flex-col p-6">
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
      <!-- Column -->
      <div
        class="ltablet:col-span-4 relative col-span-12 md:col-span-6 lg:col-span-6"
      >
        <BaseCard class="relative p-6">
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>خلاصه سفارشات</span>
            </BaseHeading>
          </div>
          <AddonApexcharts v-bind="barOrders" class="ltr:-ms-4 rtl:-me-4" />
        </BaseCard>
      </div>
      <!-- Column -->
      <div
        class="ltablet:col-span-4 relative col-span-12 md:col-span-6 lg:col-span-3"
      >
        <!-- Calendar -->
        <BaseCard class="py-2">
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
            class="max-w-full rounded-md"
          />
        </BaseCard>
      </div>
    </div>
  </div>
</template>
