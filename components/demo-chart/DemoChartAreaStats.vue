<script setup lang="ts">
const areaSubscriptions = reactive(useAreaSubscriptions())

function useAreaSubscriptions() {
  const { primary, info, success } = useTailwindColors()
  const type = 'area'
  const height = 180

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: [primary.value, success.value, info.value],
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2],
      curve: 'smooth',
    },
    xaxis: {
      type: 'numeric',
      lines: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: [
      {
        y: 0,
        offsetX: 0,
        offsetY: 0,
        labels: {
          show: false,
        },
        padding: {
          left: 0,
          right: 0,
        },
      },
    ],
    tooltip: {
      x: {
        show: false,
        format: 'dd/MM/yy HH:mm',
      },
    },
  }

  const series = shallowRef([
    {
      name: 'کاربران جدید',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: 'تمدیدها',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: 'استعفا',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ])

  return { type, height, options, series }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="border-muted-200 dark:border-muted-700 mb-6 border-b p-6 text-center"
    >
      <div
        class="divide-muted-200 dark:divide-muted-700 flex w-full items-center divide-x rtl:divide-x-reverse"
      >
        <!-- Item -->
        <div class="flex-1">
          <div class="flex flex-col px-4 text-center">
            <h4
              class="text-muted-800 dark:text-muted-100 font-sans text-xl font-semibold"
            >
              314
            </h4>
            <p
              class="font-sansfont-semibold text-muted-400 text-[0.65rem] uppercase"
            >
              جدید
            </p>
          </div>
        </div>
        <!-- Item -->
        <div class="flex-1">
          <div class="flex flex-col px-4 text-center">
            <h4
              class="text-muted-800 dark:text-muted-100 font-sans text-xl font-semibold"
            >
              611
            </h4>
            <p
              class="text-muted-400 font-sans text-[0.65rem] font-semibold uppercase"
            >
              تمدیدها
            </p>
          </div>
        </div>
        <!-- Item -->
        <div class="flex-1">
          <div class="flex flex-col px-4 text-center">
            <h4
              class="text-muted-800 dark:text-muted-100 font-sans text-xl font-semibold"
            >
              49
            </h4>
            <p
              class="font-sansfont-semibold text-muted-400 text-[0.65rem] uppercase"
            >
              استعفا
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-auto w-full">
      <AddonApexcharts v-bind="areaSubscriptions" />
    </div>
  </div>
</template>
