<script setup lang="ts">
const demoRadialGaugeAlt = reactive(useDemoRadialGaugeAlt())

function useDemoRadialGaugeAlt() {
  const { primary } = useTailwindColors()
  const height = 295
  const type = 'radialBar'

  const options = {
    title: {
      text: '',
    },
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      height: 295,
      type: 'radialBar',
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
          <span>نمودار سنجش</span>
        </BaseHeading>
      </div>
      <AddonApexcharts v-bind="demoRadialGaugeAlt" />
    </BaseCard>
  </div>
</template>
