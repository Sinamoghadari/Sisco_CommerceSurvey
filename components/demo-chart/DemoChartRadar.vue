<script setup lang="ts">
const demoRadar = reactive(useDemoRadar())

function useDemoRadar() {
  const { primary, success, info, danger } = useTailwindColors()
  const height = 350
  const type = 'radar'

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value, success.value, info.value, danger.value],
    title: {
      text: '',
    },
    xaxis: {
      categories: ['اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر'],
    },
  }

  const series = shallowRef([
    {
      name: 'Series 1',
      data: [80, 50, 30, 40, 100, 20],
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
          <span>نمودار راداری</span>
        </BaseHeading>
      </div>
      <AddonApexcharts v-bind="demoRadar" />
    </BaseCard>
  </div>
</template>
