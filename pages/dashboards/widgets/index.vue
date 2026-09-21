<script setup lang="ts">
import { Calendar } from 'v-calendars'

import 'v-calendars/dist/style.css'
import '~/assets/css/vcalendar.css'

definePageMeta({
  title: 'ویجت‌های UI',
  preview: {
    title: 'ویجت‌های UI',
    description: 'برای ترکیب صفحات',
    categories: ['داشبوردها', 'ویجت‌ها'],
    src: '/img/screens/dashboards-widgets-ui.png',
    srcDark: '/img/screens/dashboards-widgets-ui-dark.png',
    order: 27,
  },
})

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
  <div class="ptablet:grid-cols-2 grid gap-4 sm:grid-cols-4">
    <!-- Column -->
    <div class="relative flex flex-col gap-4">
      <!-- Widget -->
      <BaseCard rounded="lg" class="flex flex-col p-6">
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
      <BaseCard rounded="lg" class="p-6">
        <DemoFollowersCompact />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <div class="flex w-full items-center justify-between">
          <DemoSearchCompact rounded="lg" />
        </div>
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-3">
        <DemoVideoCompact rounded="lg" />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoTagListCompact rounded="lg" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative flex flex-col gap-4">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoIconLinks rounded="lg" />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoDaysSquare rounded="lg" />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-2">
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
      <BaseCard rounded="lg" class="p-4">
        <DemoMenuIconList rounded="lg" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative flex flex-col gap-4">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoIconText
          title="پرداخت"
          icon="lucide:bell"
          text="شما پرداختی در پیش دارید برای هزینه اشتراک دوره‌ای خود که در تاریخ ۲۰ شهریور ۱۳۹۹ موعد آن است. جزئیات صورتحساب خود را بررسی کنید."
          indicator
        />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-3">
        <DemoPicture
          src="/img/illustrations/widgets/mountain-picture.svg"
          alt="Picture widget image description"
          rounded="lg"
          :height="286"
          :width="212"
          loading
        />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoInboxMessage
          picture="/img/avatars/10.svg"
          name="کندرا و."
          title="پروژه طراحی"
          text="در زمینه طراحی کجا هستیم؟ نیاز داریم که صفحات جدید را بررسی کنیم."
          time="۲۸ دقیقه"
          rounded="lg"
        />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative flex flex-col gap-4">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <div class="mb-6 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>موضوعات محبوب</span>
          </BaseHeading>
        </div>
        <DemoTagListCompact rounded="lg" />
      </BaseCard>
      <!-- Widget -->
      <BaseCard class="p-6" rounded="lg">
        <DemoNotificationsCompact />
      </BaseCard>
      <!-- Widget -->
      <DemoActionText
        title="ارتقاء به پرو"
        text="لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. وید سنسز این لاتینو فوره؟ نام آنته آریستپوس، ات ایله ملیوس."
        label="ارتقاء دهید"
        to="#"
        rounded="lg"
      />
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoIconText
          title="پیام‌ها"
          icon="lucide:message-square"
          text="شما در حال حاضر بیش از ۱۰ پیام خوانده‌نشده در صندوق ورودی خود دارید. ممکن است زمان خوبی برای بررسی آن‌ها باشد."
          indicator
        />
      </BaseCard>
    </div>
  </div>
</template>
