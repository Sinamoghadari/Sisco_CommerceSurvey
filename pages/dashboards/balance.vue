<script setup lang="ts">
import { Calendar } from 'v-calendars'

import 'v-calendars/dist/style.css'
import '~/assets/css/vcalendar.css'

definePageMeta({
  title: 'داشبورد',
  preview: {
    title: 'داشبورد موجودی',
    description: 'برای مرور حساب بانکی',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-balance.png',
    srcDark: '/img/screens/dashboards-balance-dark.png',
    order: 5,
    new: true,
  },
})

const showFeatures = ref(true)
const gaugePersonal = reactive(useGaugePersonal())

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
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-9">
      <Transition
        leave-active-class="transition origin-top duration-75 ease-in"
        leave-from-class="transform scale-y-100 opacity-100"
        leave-to-class="transform scale-y-0 opacity-0"
      >
        <div v-if="showFeatures" class="w-full pb-6">
          <!--Features widget-->
          <DemoWidgetFeatures>
            <template #actions>
              <BaseButtonClose
                size="sm"
                color="muted"
                data-nui-tooltip="Hide this"
                @click="showFeatures = false"
              />
            </template>
          </DemoWidgetFeatures>
        </div>
      </Transition>

      <div class="grid grid-cols-12 gap-6">
        <!--Grid item-->
        <div class="col-span-12 md:col-span-5">
          <!--Welcome widget-->
          <DemoWidgetWelcome />
        </div>
        <div class="col-span-12 md:col-span-7">
          <!--Account balance widget-->
          <DemoWidgetAccountBalance />
        </div>
        <div class="col-span-12 md:col-span-6">
          <!--Money out widget-->
          <DemoWidgetMoneyOut />
        </div>
        <div class="col-span-12 md:col-span-6">
          <!--Money in widget-->
          <DemoWidgetMoneyIn />
        </div>
        <div class="col-span-12 md:col-span-12">
          <!--Transactions widget-->
          <DemoWidgetTransactionSummary />
        </div>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-3">
      <!-- Column -->
      <div class="relative flex flex-col gap-6">
        <!-- Widget -->
        <DemoActionText
          title="ارتقاء به پرو"
          text="لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. وید سنسز این لاتینو فوره؟ نام آنته آریستپوس، ات ایله ملیوس."
          label="ارتقاء دهید"
          to="#"
          rounded="md"
        />
        <!-- Widget -->
        <BaseCard rounded="md" class="flex flex-col p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="sm"
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
        <!-- Widget -->
        <BaseCard rounded="md" class="p-2">
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
            class="max-w-full rounded-xl"
          />
        </BaseCard>
        <!-- Widget -->
        <BaseCard class="p-6" rounded="md">
          <DemoNotificationsCompact />
        </BaseCard>
      </div>
    </div>
  </div>
</template>
