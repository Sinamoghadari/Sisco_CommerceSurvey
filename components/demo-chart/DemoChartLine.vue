<script setup lang="ts">
const demoLine = reactive(useDemoLine())

function useDemoLine() {
  const { primary } = useTailwindColors()
  const type = 'line'
  const height = 280

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'straight',
    },
    title: {
      text: '',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
      ],
    },
  }

  const series = shallowRef([
    {
      name: 'فروش',
      data: [105, 414, 357, 511, 497, 621, 695, 912, 748],
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
          <span>نمودار خطی</span>
        </BaseHeading>
      </div>
      <AddonApexcharts v-bind="demoLine" class="ltr:-ms-4 rtl:-me-4" />
    </BaseCard>
  </div>
</template>
