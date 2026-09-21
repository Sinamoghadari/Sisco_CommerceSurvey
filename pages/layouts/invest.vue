<script setup lang="ts">
definePageMeta({
  title: 'سرمایه‌گذاری‌ها',
  preview: {
    title: 'سرمایه‌گذاری‌ها',
    description: 'برای گزینه‌های تأمین مالی و سرمایه‌گذاری',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-invest.png',
    srcDark: '/img/screens/layouts-invest-dark.png',
    order: 37,
    new: true,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(45)
const { open } = usePanels()

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
})

const query = computed(() => {
  return {
    filter: filter.value,
    perPage: perPage.value,
    page: page.value,
  }
})

const { data, pending, error, refresh } = await useFetch('/api/invest', {
  query,
})

const currentOption = ref()

function openOptionPanel(id: number, options: any) {
  currentOption.value = options.find((option: any) => option.id === id)
  open('invest', { option: currentOption })
}

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
    <!--Content-->
    <div class="ltablet:col-span-9 col-span-12 lg:col-span-9">
      <div class="w-full max-w-full">
        <!--Invest widget-->
        <DemoWidgetInvest />
        <!--Content-->
        <div class="w-full">
          <!--Header-->
          <div class="border-muted-200 dark:border-muted-800 border-b py-6">
            <BaseHeading
              as="h2"
              size="2xl"
              weight="medium"
              class="text-muted-800 dark:text-white"
            >
              گزینه‌ها را بررسی کنید
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
              گزینه‌های سرمایه‌گذاری ما را ارزیابی کنید
            </BaseParagraph>
          </div>
          <!--Options-->
          <div class="mt-7 overflow-auto">
            <table class="w-full whitespace-nowrap">
              <thead>
                <th
                  class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold md:w-1/5"
                >
                  <span>دسته‌بندی</span>
                </th>
                <th
                  class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold md:w-3/5"
                >
                  <span>معمولاً صرف شده در</span>
                </th>
                <th
                  class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-end font-sans text-xs font-semibold"
                >
                  <span>تأمین مالی بر اساس</span>
                </th>
              </thead>
              <tbody>
                <tr
                  v-for="option in data?.data"
                  :key="option.id"
                  tabindex="0"
                  class="hover:bg-muted-200 dark:hover:bg-muted-800 border-muted-200 dark:border-muted-800 cursor-pointer border-b transition-colors duration-200 ease-in-out"
                  @click="openOptionPanel(option.id, data?.data)"
                >
                  <td class="p-4">
                    <div>
                      <BaseHeading
                        as="h4"
                        size="md"
                        weight="medium"
                        class="text-muted-800 dark:text-muted-100"
                      >
                        {{ option.title }}
                      </BaseHeading>
                      <BaseParagraph size="xs" class="text-muted-400">
                        {{ option.subtitle }}
                      </BaseParagraph>
                    </div>
                  </td>
                  <td class="p-4">
                    <div class="flex items-center gap-2">
                      <BaseTag
                        v-for="target in option.targets"
                        :key="target"
                        size="sm"
                        rounded="full"
                      >
                        {{ target }}
                      </BaseTag>
                    </div>
                  </td>
                  <td class="p-4 text-end">
                    <div class="flex justify-end">
                      <BaseParagraph
                        size="sm"
                        lead="none"
                        class="text-muted-500 dark:text-muted-400 block"
                      >
                        {{ option.purpose }}
                      </BaseParagraph>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!--Side widgets-->
    <div class="ltablet:col-span-3 col-span-12 lg:col-span-3">
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
        <BaseCard class="p-6" rounded="md">
          <DemoNotificationsCompact />
        </BaseCard>
      </div>
    </div>
  </div>
</template>
