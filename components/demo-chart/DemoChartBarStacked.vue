<script setup lang="ts">
import fa from 'apexcharts/dist/locales/fa.json'

const demoBarStacked = reactive(useDemoBarStacked())

function useDemoBarStacked() {
  const { primary, info, success, danger } = useTailwindColors()
  const type = 'bar'
  const height = 280

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      stacked: true,
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      style: {
        colors: ['#fff'],
        fontWeight: 300,
      },
    },
    colors: [primary.value, success.value, info.value, danger.value],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'top',
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    tooltip: {
      x: {
        format: 'dd MMMM yyyy',
      },
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '01/01/2011 GMT',
        '01/02/2011 GMT',
        '01/03/2011 GMT',
        '01/04/2011 GMT',
        '01/05/2011 GMT',
        '01/06/2011 GMT',
      ],
    },
    title: {
      text: '',
      align: 'left',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    fill: {
      opacity: 1,
    },
  }

  const series = shallowRef([
    {
      name: 'دسکتاپ‌ها',
      data: [44, 55, 41, 67, 22, 43],
    },
    {
      name: 'موبایل‌ها',
      data: [13, 23, 20, 8, 13, 27],
    },
    {
      name: 'تبلت‌ها',
      data: [11, 17, 15, 15, 21, 14],
    },
    {
      name: 'هیبریدها',
      data: [21, 7, 25, 13, 22, 8],
    },
  ])

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
    <BaseCard class="p-6">
      <!-- Title -->
      <div class="mb-6">
        <BaseHeading
          as="h3"
          size="md"
          weight="semibold"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>میله‌های انباشته</span>
        </BaseHeading>
      </div>
      <AddonApexcharts v-bind="demoBarStacked" class="ltr:-ms-4 rtl:-me-4" />
    </BaseCard>
  </div>
</template>
