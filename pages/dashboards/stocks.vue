<script setup lang="ts">
import { Calendar } from 'v-calendars'
import fa from 'apexcharts/dist/locales/fa.json'

import 'v-calendars/dist/style.css'
import '~/assets/css/vcalendar.css'

definePageMeta({
  title: 'سهام',
  preview: {
    title: 'داشبورد سهام',
    description: 'برای تحلیل بازار سهام',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-stocks.png',
    srcDark: '/img/screens/dashboards-stocks-dark.png',
    order: 5,
  },
})

const barProfit = reactive(useBarProfit())

function useBarProfit() {
  const { primary } = useTailwindColors()
  const type = 'bar'
  const height = 255

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
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: string) {
        return val + '%'
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    xaxis: {
      categories: ['اردیبهشت', 'خرداد', 'تیر', 'اَمرداد', 'شهریور'],
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val: string) {
          return val + '%'
        },
      },
    },
    colors: [primary.value],
    title: {
      text: undefined,
      align: 'left',
    },
  }

  const series = shallowRef([
    {
      name: 'Ratio',
      data: [2.3, 3.1, 4.0, 10.1, 4.0],
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
  <div>
    <!-- Investments -->
    <div
      class="ltablet:overflow-visible flex justify-around gap-6 overflow-x-auto pb-8 lg:overflow-visible"
    >
      <!-- Item -->
      <NuxtLink to="#" class="group flex flex-1 flex-col text-center">
        <div
          class="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90 group-hover:bg-yellow-400 dark:group-hover:bg-yellow-400"
        >
          <div
            class="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white"
          >
            <Icon name="ph:lightning-duotone" class="size-6 text-yellow-400" />
          </div>
        </div>
        <BaseHeading
          as="h5"
          size="md"
          weight="medium"
          lead="tight"
          class="text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200"
        >
          <span class="font-sans text-sm">انرژی</span>
        </BaseHeading>
      </NuxtLink>
      <!-- Item -->
      <NuxtLink to="#" class="group flex flex-1 flex-col text-center">
        <div
          class="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 group-hover:bg-primary-500 dark:group-hover:bg-primary-500 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90"
        >
          <div
            class="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white"
          >
            <Icon
              name="ph:buildings-duotone"
              class="text-primary-500 size-6"
            />
          </div>
        </div>
        <BaseHeading
          as="h5"
          size="md"
          weight="medium"
          lead="tight"
          class="text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200"
        >
          <span class="font-sans text-sm">املاک</span>
        </BaseHeading>
      </NuxtLink>
      <!-- Item -->
      <NuxtLink to="#" class="group flex flex-1 flex-col text-center">
        <div
          class="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 group-hover:bg-success-500 dark:group-hover:bg-success-500 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90"
        >
          <div
            class="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white"
          >
            <Icon name="ph:leaf-duotone" class="text-success-500 size-6" />
          </div>
        </div>
        <BaseHeading
          as="h5"
          size="md"
          weight="medium"
          lead="tight"
          class="text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200"
        >
          <span class="font-sans text-sm">کشاورزی</span>
        </BaseHeading>
      </NuxtLink>
      <!-- Item -->
      <NuxtLink to="#" class="group flex flex-1 flex-col text-center">
        <div
          class="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-500"
        >
          <div
            class="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white"
          >
            <Icon name="ph:bank-duotone" class="size-6 text-indigo-500" />
          </div>
        </div>
        <BaseHeading
          as="h5"
          size="md"
          weight="medium"
          lead="tight"
          class="text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200"
        >
          <span class="font-sans text-sm">مالی</span>
        </BaseHeading>
      </NuxtLink>
      <!-- Item -->
      <NuxtLink to="#" class="group flex flex-1 flex-col text-center">
        <div
          class="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90 group-hover:bg-lime-500 dark:group-hover:bg-lime-500"
        >
          <div
            class="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white"
          >
            <Icon name="ph:sketch-logo-duotone" class="size-6 text-lime-500" />
          </div>
        </div>
        <BaseHeading
          as="h5"
          size="md"
          weight="medium"
          lead="tight"
          class="text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200"
        >
          <span class="font-sans text-sm">الماس‌ها</span>
        </BaseHeading>
      </NuxtLink>
      <!-- Item -->
      <NuxtLink to="#" class="group flex flex-1 flex-col text-center">
        <div
          class="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90 group-hover:bg-sky-500 dark:group-hover:bg-sky-500"
        >
          <div
            class="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white"
          >
            <Icon name="ph:atom-duotone" class="size-6 text-sky-500" />
          </div>
        </div>
        <BaseHeading
          as="h5"
          size="md"
          weight="medium"
          lead="tight"
          class="text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200"
        >
          <span class="font-sans text-sm">تحقیق</span>
        </BaseHeading>
      </NuxtLink>
      <!-- Item -->
      <NuxtLink to="#" class="group flex flex-1 flex-col text-center">
        <div
          class="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90 group-hover:bg-orange-500 dark:group-hover:bg-orange-500"
        >
          <div
            class="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white"
          >
            <Icon name="ph:monitor-duotone" class="size-6 text-orange-500" />
          </div>
        </div>
        <BaseHeading
          as="h5"
          size="md"
          weight="medium"
          lead="tight"
          class="text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200"
        >
          <span class="font-sans text-sm">تکنولوژی</span>
        </BaseHeading>
      </NuxtLink>
      <!-- Item -->
      <NuxtLink to="#" class="group flex flex-1 flex-col text-center">
        <div
          class="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90 group-hover:bg-rose-500 dark:group-hover:bg-rose-500"
        >
          <div
            class="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white"
          >
            <Icon name="ph:pill-duotone" class="size-6 text-rose-500" />
          </div>
        </div>
        <BaseHeading
          as="h5"
          size="md"
          weight="medium"
          lead="tight"
          class="text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200"
        >
          <span class="font-sans text-sm">سلامت</span>
        </BaseHeading>
      </NuxtLink>
    </div>
    <!-- Tile grid -->
    <div
      class="ltablet:grid-cols-3 mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <!-- Tile -->
      <div class="relative">
        <BaseCard rounded="lg" class="p-6">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="block size-2 rounded-full bg-emerald-500" />
              <span class="text-muted-400 font-sans text-xs font-medium">
                آماده برای تراکنش‌ها
              </span>
            </div>
            <BaseDropdown
              variant="context"
              label="منوی کشویی"
              placement="bottom-end"
              class="z-20"
            >
              <BaseDropdownItem
                to="#"
                title="سرمایه‌گذاری"
                text="خرید سهام بیشتر"
              >
                <template #start>
                  <Icon name="ph:coin-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
              <BaseDropdownItem
                to="#"
                title="بنچ‌مارک"
                text="مقایسه دیگر منابع"
              >
                <template #start>
                  <Icon
                    name="ph:cell-signal-medium-duotone"
                    class="me-2 block size-5"
                  />
                </template>
              </BaseDropdownItem>
              <BaseDropdownItem
                to="#"
                title="تجارت"
                text="فرصت‌ها را مشاهده کنید"
              >
                <template #start>
                  <Icon name="ph:bank-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
              <BaseDropdownDivider />
              <BaseDropdownItem
                to="#"
                title="کیف پول"
                text="مدیریت کیف پول خود"
              >
                <template #start>
                  <Icon name="ph:wallet-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
            </BaseDropdown>
          </div>
          <div class="mb-4">
            <VectorChartStockOne
              class="text-muted-200 dark:text-muted-700 mx-auto mb-4"
            />
          </div>
          <div class="flex items-center gap-2">
            <BaseIconBox
              rounded="full"
              size="sm"
              class="bg-red-500 text-white shadow-xl shadow-red-500/20 dark:shadow-red-800/20"
              color="none"
            >
              <Icon name="cib:tesla" class="size-4" />
            </BaseIconBox>
            <div>
              <BaseHeading
                as="h4"
                size="sm"
                weight="semibold"
                lead="snug"
                class="text-muted-800 dark:text-white"
              >
                <span>TSL</span>
              </BaseHeading>
              <BaseParagraph lead="none" size="sm">
                <span class="text-muted-400">تسلا موتورز</span>
              </BaseParagraph>
            </div>
            <div class="ms-auto flex items-center gap-1">
              <Icon
                name="ph:check-circle-duotone"
                class="text-success-500 size-4"
              />
              <span
                class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
              >
                ۳۸۷۶.۲۱تومان
              </span>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Tile -->
      <div class="relative">
        <BaseCard rounded="lg" class="p-6">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="block size-2 rounded-full bg-emerald-500" />
              <span class="text-muted-400 font-sans text-xs font-medium">
                آماده برای تراکنش‌ها
              </span>
            </div>
            <BaseDropdown
              variant="context"
              label="منوی کشویی"
              placement="bottom-end"
              class="z-20"
            >
              <BaseDropdownItem
                to="#"
                title="سرمایه‌گذاری"
                text="خرید سهام بیشتر"
              >
                <template #start>
                  <Icon name="ph:coin-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
              <BaseDropdownItem
                to="#"
                title="بنچ‌مارک"
                text="مقایسه دیگر منابع"
              >
                <template #start>
                  <Icon
                    name="ph:cell-signal-medium-duotone"
                    class="me-2 block size-5"
                  />
                </template>
              </BaseDropdownItem>
              <BaseDropdownItem
                to="#"
                title="تجارت"
                text="فرصت‌ها را مشاهده کنید"
              >
                <template #start>
                  <Icon name="ph:bank-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
              <BaseDropdownDivider />
              <BaseDropdownItem
                to="#"
                title="کیف پول"
                text="مدیریت کیف پول خود"
              >
                <template #start>
                  <Icon name="ph:wallet-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
            </BaseDropdown>
          </div>
          <div class="mb-4">
            <VectorChartStockTwo
              class="text-muted-200 dark:text-muted-700 mx-auto mb-4"
            />
          </div>
          <div class="flex items-center gap-2">
            <BaseIconBox
              rounded="full"
              size="sm"
              class="bg-blue-800 text-white shadow-xl shadow-blue-500/20 dark:shadow-blue-800/20"
              color="none"
            >
              <Icon name="fa6-brands:facebook-f" class="size-4" />
            </BaseIconBox>
            <div>
              <BaseHeading
                as="h4"
                size="sm"
                weight="semibold"
                lead="snug"
                class="text-muted-800 dark:text-white"
              >
                <span>FCB</span>
              </BaseHeading>
              <BaseParagraph lead="none" size="sm">
                <span class="text-muted-400">شرکت فیس‌بوک</span>
              </BaseParagraph>
            </div>
            <div class="ms-auto flex items-center gap-1">
              <Icon
                name="ph:check-circle-duotone"
                class="text-success-500 size-4"
              />
              <span
                class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
              >
                ۵۲۱۴۸۷۰ تومان
              </span>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Tile -->
      <div class="relative">
        <BaseCard rounded="lg" class="p-6">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="bg-muted-300 dark:bg-muted-700/60 block size-2 rounded-full"
              />
              <span class="text-muted-400 font-sans text-xs font-medium">
                بسته به تراکنش‌ها
              </span>
            </div>
            <BaseDropdown
              variant="context"
              label="منوی کشویی"
              placement="bottom-end"
              class="z-20"
            >
              <BaseDropdownItem
                to="#"
                title="سرمایه‌گذاری"
                text="خرید سهام بیشتر"
              >
                <template #start>
                  <Icon name="ph:coin-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
              <BaseDropdownItem
                to="#"
                title="بنچ‌مارک"
                text="مقایسه دیگر منابع"
              >
                <template #start>
                  <Icon
                    name="ph:cell-signal-medium-duotone"
                    class="me-2 block size-5"
                  />
                </template>
              </BaseDropdownItem>
              <BaseDropdownItem
                to="#"
                title="تجارت"
                text="فرصت‌ها را مشاهده کنید"
              >
                <template #start>
                  <Icon name="ph:bank-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
              <BaseDropdownDivider />
              <BaseDropdownItem
                to="#"
                title="کیف پول"
                text="مدیریت کیف پول خود"
              >
                <template #start>
                  <Icon name="ph:wallet-duotone" class="me-2 block size-5" />
                </template>
              </BaseDropdownItem>
            </BaseDropdown>
          </div>
          <div class="mb-4">
            <VectorChartStockThree
              class="text-muted-200 dark:text-muted-700 mx-auto mb-4"
            />
          </div>
          <div class="flex items-center gap-2">
            <BaseIconBox
              rounded="full"
              size="sm"
              class="bg-sky-500 text-white shadow-xl shadow-sky-500/20 dark:shadow-sky-800/20"
              color="none"
            >
              <Icon name="fa6-brands:twitter" class="size-4" />
            </BaseIconBox>
            <div>
              <BaseHeading
                as="h4"
                size="sm"
                weight="semibold"
                lead="snug"
                class="text-muted-800 dark:text-white"
              >
                <span>TWT</span>
              </BaseHeading>
              <BaseParagraph lead="none" size="sm">
                <span class="text-muted-400">شرکت توییتر</span>
              </BaseParagraph>
            </div>
            <div class="ms-auto flex items-center gap-1">
              <Icon
                name="ph:check-circle-duotone"
                class="text-success-500 size-4"
              />
              <span
                class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
              >
                ۱٬۶۵۷٫۱۲تومان
              </span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
    <!-- Card grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Grid item -->
      <div class="ltablet:col-span-4 col-span-12 md:col-span-6 lg:col-span-4">
        <BaseCard rounded="lg" class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>سهام‌های محبوب</span>
            </BaseHeading>
            <BaseButton
              color="primary"
              size="sm"
              variant="pastel"
              rounded="md"
            >
              مشاهده همه
            </BaseButton>
          </div>
          <div class="mb-2 space-y-5">
            <!-- List item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                rounded="full"
                size="xs"
                class="bg-blue-800 text-white shadow-xl shadow-blue-500/20 dark:shadow-blue-800/20"
                color="none"
              >
                <Icon name="fa6-brands:linkedin-in" class="size-3" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="snug"
                  class="text-muted-800 dark:text-white"
                >
                  <span>LKN</span>
                </BaseHeading>
                <BaseParagraph lead="none" size="xs">
                  <span class="text-muted-400">شرکت لینکدین</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto flex items-center gap-1">
                <Icon
                  name="ph:check-circle-duotone"
                  class="text-success-500 size-4"
                />
                <span
                  class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
                >
                  ۱٬۴۷۸.۳۲ تومان
                </span>
              </div>
            </div>
            <!-- List item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                rounded="full"
                size="xs"
                class="bg-muted-900 dark:bg-muted-100 dark:text-muted-800 text-white"
                color="none"
              >
                <Icon name="fa6-brands:github" class="size-3" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="snug"
                  class="text-muted-800 dark:text-white"
                >
                  <span>GTB</span>
                </BaseHeading>
                <BaseParagraph lead="none" size="xs">
                  <span class="text-muted-400">شرکت گیتهاب</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto flex items-center gap-1">
                <Icon
                  name="ph:check-circle-duotone"
                  class="text-success-500 size-4"
                />
                <span
                  class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
                >
                  ۹۷۸.۲۱ تومان
                </span>
              </div>
            </div>
            <!-- List item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                rounded="full"
                size="xs"
                class="bg-rose-500 text-white shadow-xl shadow-rose-500/20 dark:shadow-rose-800/20"
                color="none"
              >
                <Icon name="fa6-brands:invision" class="size-4" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="snug"
                  class="text-muted-800 dark:text-white"
                >
                  <span>INV</span>
                </BaseHeading>
                <BaseParagraph lead="none" size="xs">
                  <span class="text-muted-400">شرکت اینوژن</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto flex items-center gap-1">
                <Icon
                  name="ph:check-circle-duotone"
                  class="text-success-500 size-4"
                />
                <span
                  class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
                >
                  1,671.89 تومان
                </span>
              </div>
            </div>
            <!-- List item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                rounded="full"
                size="xs"
                class="bg-sky-700 text-white shadow-xl shadow-sky-500/20 dark:shadow-sky-800/20"
                color="none"
              >
                <Icon name="fa-brands:telegram-plane" class="size-4" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="snug"
                  class="text-muted-800 dark:text-white"
                >
                  <span>TLG</span>
                </BaseHeading>
                <BaseParagraph lead="none" size="xs">
                  <span class="text-muted-400">تلگرام شرکت</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto flex items-center gap-1">
                <Icon
                  name="ph:check-circle-duotone"
                  class="text-success-500 size-4"
                />
                <span
                  class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
                >
                  ۴۹۱٫۵۴تومان
                </span>
              </div>
            </div>
            <!-- List item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                rounded="full"
                size="xs"
                class="bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 dark:shadow-emerald-800/20"
                color="none"
              >
                <Icon name="fa-brands:kickstarter-k" class="size-4" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="snug"
                  class="text-muted-800 dark:text-white"
                >
                  <span>KCK</span>
                </BaseHeading>
                <BaseParagraph lead="none" size="xs">
                  <span class="text-muted-400">شرکت کیک‌استارتر</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto flex items-center gap-1">
                <Icon
                  name="ph:check-circle-duotone"
                  class="text-success-500 size-4"
                />
                <span
                  class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
                >
                  ۱۱,۱۵۶,۸۰۰ تومان
                </span>
              </div>
            </div>
            <!-- List item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                rounded="full"
                size="xs"
                class="bg-yellow-500 text-white shadow-xl shadow-yellow-500/20 dark:shadow-yellow-800/20"
                color="none"
              >
                <Icon name="fa-brands:google" class="size-4" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="snug"
                  class="text-muted-800 dark:text-white"
                >
                  <span>GGL</span>
                </BaseHeading>
                <BaseParagraph lead="none" size="xs">
                  <span class="text-muted-400">گوگل کورپ.</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto flex items-center gap-1">
                <Icon
                  name="ph:check-circle-duotone"
                  class="text-success-500 size-4"
                />
                <span
                  class="text-muted-600 dark:text-muted-400 font-sans text-sm font-medium"
                >
                  ۲۵,۱۴۵,۱۰۰ تومان
                </span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Grid item -->
      <div class="ltablet:col-span-4 col-span-12 md:col-span-6 lg:col-span-4">
        <BaseCard class="relative p-6" rounded="lg">
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>تکامل سود</span>
            </BaseHeading>
          </div>
          <AddonApexcharts v-bind="barProfit" />
        </BaseCard>
      </div>
      <!-- Grid item -->
      <div class="ltablet:col-span-4 col-span-12 md:col-span-6 lg:col-span-4">
        <BaseCard class="p-4" rounded="lg">
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
      </div>
    </div>
  </div>
</template>
