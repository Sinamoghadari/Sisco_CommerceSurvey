<script setup lang="ts">
import fa from 'apexcharts/dist/locales/fa.json'

const demoBarMulti = reactive(useDemoBarMulti())

function useDemoBarMulti() {
  const { primary, info, success, warning } = useTailwindColors()
  const type = 'bar'
  const height = 280

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
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    colors: [primary.value, success.value, info.value, warning.value],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'اسفند',
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
      ],
    },
    yaxis: {
      title: {
        text: 'مقدار',
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    title: {
      text: '',
      align: 'left',
    },
    tooltip: {
      y: {
        formatter: asToman,
      },
    },
  }

  const series = ref([
    {
      name: 'سود خالص',
      data: [2134, 1932, 2141, 3455, 1242, 4212, 2342, 1983, 2421],
    },
    {
      name: 'درآمد',
      data: [8231, 7232, 9233, 8320, 7313, 8923, 9331, 8912, 9218],
    },
    {
      name: 'جریان نقدی آزاد',
      data: [1523, 932, 2189, 1732, 1632, 1874, 1947, 2420, 2312],
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
    <AddonApexcharts v-bind="demoBarMulti" class="ltr:-ms-4 rtl:-me-4" />
  </div>
</template>
