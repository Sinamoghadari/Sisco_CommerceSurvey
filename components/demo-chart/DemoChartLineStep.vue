<script setup lang="ts">
const demoLineStep = reactive(useDemoLineStep())

function useDemoLineStep() {
  const { primary } = useTailwindColors()
  const type = 'line'
  const height = 280

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'stepline',
    },
    colors: [primary.value],
    dataLabels: {
      enabled: false,
    },
    title: {
      text: '',
      align: 'left',
    },
    markers: {
      hover: {
        sizeOffset: 4,
      },
    },
    xaxis: {
      categories: [
        'بهمن',
        'اسفند',
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
      ],
    },
  }

  const series = shallowRef([
    {
      name: 'کاربران تازه وارد',
      data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58, 79],
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
          <span>نمودار استپ‌لاین</span>
        </BaseHeading>
      </div>
      <AddonApexcharts v-bind="demoLineStep" class="ltr:-ms-4 rtl:-me-4" />
    </BaseCard>
  </div>
</template>
