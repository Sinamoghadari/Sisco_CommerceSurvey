<script setup lang="ts">
const demoBarRange = reactive(useDemoBarRange())

function useDemoBarRange() {
  const { primary, info, success, warning } = useTailwindColors()
  const type = 'rangeBar'
  const height = 280

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value, success.value, info.value, warning.value],
    title: {
      text: '',
      align: 'left',
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
    },
  }

  const series = shallowRef([
    {
      name: 'شرکتی',
      data: [
        {
          x: 'تیم A',
          y: [1, 5],
        },
        {
          x: 'تیم B',
          y: [4, 6],
        },
        {
          x: 'تیم C',
          y: [5, 8],
        },
        {
          x: 'تیم D',
          y: [3, 11],
        },
      ],
    },
    {
      name: 'خدمت',
      data: [
        {
          x: 'تیم A',
          y: [2, 6],
        },
        {
          x: 'تیم B',
          y: [1, 3],
        },
        {
          x: 'تیم C',
          y: [7, 8],
        },
        {
          x: 'تیم D',
          y: [5, 9],
        },
      ],
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
          <span>ستون بازه</span>
        </BaseHeading>
      </div>
      <AddonApexcharts v-bind="demoBarRange" class="ltr:-ms-4 rtl:-me-4" />
    </BaseCard>
  </div>
</template>
