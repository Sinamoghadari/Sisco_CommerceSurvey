<script setup lang="ts">
import fa from 'apexcharts/dist/locales/fa.json'

definePageMeta({
  title: 'مرور کلی',
  preview: {
    title: 'داشبورد بانکی نسخه ۱',
    description: 'برای بانکداری و حساب‌ها',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-banking-1.png',
    srcDark: '/img/screens/dashboards-banking-1-dark.png',
    order: 7,
  },
})

const incomeHistory = reactive(useIncomeHistory())

function useIncomeHistory() {
  const { primary, info, success } = useTailwindColors()
  const type = 'area'
  const height = 315

  const options = {
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      type: 'area',
      toolbar: {
        show: false,
      },
      defaultLocale: 'fa',
      locales: [fa],
    },
    colors: [primary.value, success.value, info.value],
    title: {
      text: '',
      align: 'left',
    },
    legend: {
      position: 'top',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2022-10-19T00:00:00.000Z',
        '2022-10-20T01:30:00.000Z',
        '2022-10-21T02:30:00.000Z',
        '2022-10-22T03:30:00.000Z',
        '2022-10-23T04:30:00.000Z',
        '2022-10-24T05:30:00.000Z',
        '2022-10-25T06:30:00.000Z',
        '2022-10-26T06:30:00.000Z',
        '2022-10-27T06:30:00.000Z',
        '2022-10-28T06:30:00.000Z',
      ],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
      y: {
        formatter: function (val: number) {
          return '$' + val
        },
      },
    },
  }

  const series = shallowRef([
    {
      name: 'هزینه‌ها',
      data: [318, 150, 49, 152.13, 421, 1009, 1220, 418, 113, 45],
    },
    {
      name: 'درآمد',
      data: [192, 263, 459, 312, 349, 527, 397, 351, 618, 511],
    },
  ])

  return { type, height, options, series }
}

const banks = [
  {
    id: 1,
    name: 'بانک ایکس',
    text: 'در حال بررسی **** **** 0499',
    media: '/img/icons/banking/bank-1.svg',
  },
  {
    id: 2,
    name: 'بانکاریا',
    text: 'در حال بررسی **** **** 1548',
    media: '/img/icons/banking/bank-2.svg',
  },
  {
    id: 3,
    name: 'بانکوس',
    text: 'در حال بررسی **** **** 8448',
    media: '/img/icons/banking/bank-3.svg',
  },
]

const selectedBankTransfert = shallowRef(banks[0])
const selectedBankSendTo = shallowRef(banks[0])
const selectedCurrency = ref('usd')
const amount = ref<number>(0)
</script>

<template>
  <!-- Grid -->
  <div class="grid gap-4 md:grid-cols-12">
    <!--Grid column -->
    <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
      <!--Inner column -->
      <div class="flex flex-col gap-4">
        <BaseCard class="flex flex-col py-6">
          <div class="mb-6 flex items-center justify-between px-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>کارت‌های من</span>
            </BaseHeading>
            <BaseButtonIcon rounded="full" small>
              <Icon name="lucide:plus" class="size-3" />
            </BaseButtonIcon>
          </div>
          <div class="mb-8 flex items-center gap-4 px-6">
            <DemoCreditCardSmall class="text-primary-500" />
            <div>
              <BaseParagraph size="sm" weight="medium">
                <span class="text-muted-400">موجودی کارت</span>
              </BaseParagraph>
              <BaseHeading
                as="h4"
                size="xl"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>۱۴,۱۷۱,۵۵۰ تومان</span>
              </BaseHeading>
            </div>
            <div class="ms-auto">
              <BaseDropdown
                variant="context"
                label="منوی کشویی"
                placement="bottom-end"
                size="md"
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
          </div>
          <div
            class="border-muted-200 dark:border-muted-700 mb-8 space-y-5 border-b-2 border-dashed px-6 pb-6"
          >
            <div class="flex items-center justify-between">
              <BaseHeading
                as="h5"
                size="sm"
                weight="medium"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>اطلاعات</span>
              </BaseHeading>
              <NuxtLink
                to="#"
                class="text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
              >
                ویرایش
              </NuxtLink>
            </div>
            <div class="flex items-center justify-between">
              <BaseHeading
                as="h5"
                size="sm"
                weight="medium"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>وضعیت</span>
              </BaseHeading>
              <div class="flex items-center gap-1">
                <span class="block size-2 rounded-full bg-emerald-500" />
                <p class="text-muted-400 font-sans text-sm">
                  فعال
                </p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <BaseHeading
                as="h5"
                size="sm"
                weight="medium"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>منقضی می‌شود در</span>
              </BaseHeading>
              <div class="flex items-center gap-1">
                <p class="text-muted-400 font-sans text-sm">
                  ۱۲۵ روز
                </p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <BaseHeading
                as="h5"
                size="sm"
                weight="medium"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>نوع</span>
              </BaseHeading>
              <div class="flex items-center gap-1">
                <Icon name="cib:visa" class="text-muted-400 size-10" />
                <p class="text-muted-400 font-sans text-xs">
                  کارت اعتباری
                </p>
              </div>
            </div>
          </div>
          <div class="mb-2 flex items-center gap-4 px-6">
            <DemoCreditCardSmall class="text-success-500" />
            <div>
              <BaseParagraph size="sm" weight="medium">
                <span class="text-muted-400">موجودی کارت</span>
              </BaseParagraph>
              <BaseHeading
                as="h4"
                size="xl"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>۱۴,۱۷۱,۵۵۰ تومان</span>
              </BaseHeading>
            </div>
            <div class="ms-auto">
              <BaseDropdown
                variant="context"
                label="منوی کشویی"
                placement="bottom-end"
                size="md"
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
          </div>
        </BaseCard>
        <!-- Widget -->
        <BaseCard class="flex h-full flex-col p-6">
          <div class="mb-4 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>تراکنش‌ها</span>
            </BaseHeading>
            <div>
              <NuxtLink
                to="#"
                class="text-muted-400 hover:text-primary-500 font-sans text-sm underline-offset-4 transition-colors duration-300 hover:underline"
              >
                مشاهده همه
              </NuxtLink>
            </div>
          </div>
          <div class="space-y-4">
            <!-- Item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                class="bg-success-500/10 text-success-500"
                size="md"
                rounded="full"
                color="none"
              >
                <Icon name="ph:pizza-duotone" class="size-5" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>تحویل غذا</span>
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-400">
                  <span>۱ آبان ۱۴۰۱ - ۸:۴۶ شب</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <span
                  class="text-muted-800 dark:text-muted-100 font-sans text-sm font-semibold"
                >
                  - ۴۱.۴۹ تومان
                </span>
              </div>
            </div>
            <!-- Item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                class="bg-orange-500/10 text-orange-500"
                size="md"
                rounded="full"
                color="none"
              >
                <Icon name="ph:storefront-duotone" class="size-5" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>درآمد بازار</span>
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-400">
                  <span>۱۸ مهر ۱۴۰۱ - ساعت ۹:۱۱ ق.ظ</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <span
                  class="text-muted-800 dark:text-muted-100 font-sans text-sm font-semibold"
                >
                  + ۲,۶۳۳ تومان
                </span>
              </div>
            </div>
            <!-- Item -->
            <div class="flex items-center gap-2">
              <BaseIconBox
                class="bg-indigo-500/10 text-indigo-500"
                size="md"
                rounded="full"
                color="none"
              >
                <Icon name="ph:shopping-cart-duotone" class="size-5" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>سفارش آنلاین</span>
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-400">
                  <span>۱۶ مهر ۱۴۰۱ - ساعت ۲:۱۳ ب.ظ</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <span
                  class="text-muted-800 dark:text-muted-100 font-sans text-sm font-semibold"
                >
                  - ۹۲٫۰۰تومان
                </span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
    <!--Grid column -->
    <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
      <!-- Sub grid -->
      <div class="grid gap-4 md:grid-cols-12">
        <!-- Sub column -->
        <div
          class="ltablet:col-span-6 col-span-12 flex flex-col gap-4 lg:col-span-6"
        >
          <!-- Widget -->
          <form
            method="POST"
            action=""
            class="relative"
            @submit.prevent
          >
            <BaseCard class="flex flex-col p-6">
              <div class="mb-4 flex items-center justify-between">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>انتقال سریع</span>
                </BaseHeading>
              </div>
              <div>
                <BaseListbox
                  v-model="selectedBankTransfert"
                  :items="banks"
                  :properties="{
                    value: 'id',
                    label: 'name',
                    sublabel: 'text',
                    media: 'media',
                  }"
                />
                <div class="mt-2">
                  <p
                    class="text-muted-500 dark:text-muted-400 font-sans text-xs leading-tight"
                  >
                    یکی از حساب‌های بانکی خود را برای انتقال برخی از وجوه انتخاب کنید. انتقال نباید از ۲۰٪ موجودی شما تجاوز کند.
                  </p>
                  <div class="mt-2 flex justify-end">
                    <button
                      type="submit"
                      class="text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                    >
                      تأیید و ارسال
                    </button>
                  </div>
                </div>
              </div>
            </BaseCard>
          </form>
          <!-- Widget -->
          <div class="relative">
            <BaseCard class="flex flex-col p-6">
              <div class="mb-4 flex items-center justify-between">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>پیشرفت کلی</span>
                </BaseHeading>
                <div>
                  <span class="text-muted-400 font-sans text-sm">سطح ۳</span>
                </div>
              </div>
              <div>
                <BaseProgress size="xs" :value="60" />
                <div class="mt-2">
                  <p
                    class="text-muted-500 dark:text-muted-400 font-sans text-xs leading-tight"
                  >
                    این سطح مشتری تایرو شما است. به سطوح بالاتر دست یابید تا دستاوردها، هدایا ویژه و بیشتر را باز کنید.
                  </p>
                  <div class="mt-2 flex justify-end">
                    <NuxtLink
                      to="#"
                      class="text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                    >
                      جزئیات
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
        <!-- Sub column -->
        <form
          method="POST"
          action=""
          class="ltablet:col-span-6 col-span-12 lg:col-span-6"
          @submit.prevent
        >
          <!-- Widget -->
          <div class="relative h-full">
            <BaseCard class="flex h-full flex-col p-6">
              <div class="mb-4 flex items-center justify-between">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>پول ارسال کنید به</span>
                </BaseHeading>
                <div>
                  <NuxtLink
                    to="#"
                    class="text-muted-400 hover:text-primary-500 font-sans text-sm underline-offset-4 transition-colors duration-300 hover:underline"
                  >
                    مشاهده همه
                  </NuxtLink>
                </div>
              </div>
              <div>
                <div class="mb-4 flex gap-3">
                  <BaseAvatar src="/img/avatars/16.svg" size="xs" />
                  <BaseAvatar
                    text="LT"
                    size="xs"
                    class="bg-yellow-400/20 text-yellow-400"
                  />
                  <BaseAvatar src="/img/avatars/3.svg" size="xs" />
                  <BaseAvatar
                    text="KC"
                    size="xs"
                    class="bg-indigo-400/20 text-indigo-400"
                  />
                </div>
                <NuxtLink
                  to="#"
                  class="text-muted-400 hover:text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                >
                  مشاهده همه مخاطبان
                </NuxtLink>
              </div>
              <div class="mt-auto">
                <div class="space-y-3">
                  <div>
                    <BaseListbox
                      v-model="selectedBankSendTo"
                      :items="banks"
                      :properties="{
                        value: 'id',
                        label: 'name',
                        sublabel: 'text',
                        media: 'media',
                      }"
                    />
                  </div>
                  <div class="flex w-full gap-2">
                    <BaseSelect
                      v-model="selectedCurrency"
                      rounded="sm"
                      label="ارز"
                      class="w-16"
                    >
                      <option value="" />
                      <option value="usd">
                        $
                      </option>
                      <option value="gbp">
                        £
                      </option>
                      <option value="eur">
                        €
                      </option>
                    </BaseSelect>
                    <BaseInputNumber
                      v-model="amount"
                      :classes="{ wrapper: 'grow' }"
                      placeholder="0.00"
                      rounded="sm"
                      label="مقدار"
                      :min="0"
                    />
                  </div>
                </div>
                <p
                  class="text-muted-500 dark:text-muted-400 my-3 font-sans text-xs leading-tight"
                >
                  وجوه فردا به مقصد خواهند رسید.
                </p>
                <div>
                  <BaseButton
                    type="submit"
                    rounded="sm"
                    size="sm"
                    color="primary"
                    class="w-full"
                  >
                    ارسال پول
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>
        </form>
        <!-- Sub column -->
        <div class="col-span-12">
          <div class="relative h-full">
            <BaseCard class="flex h-full flex-col p-6">
              <div class="mb-4 flex items-center justify-between">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="text-muted-800 dark:text-white"
                >
                  <span>تاریخچه</span>
                </BaseHeading>
                <div>
                  <NuxtLink
                    to="#"
                    class="text-muted-400 hover:text-primary-500 font-sans text-sm underline-offset-4 transition-colors duration-300 hover:underline"
                  >
                    مشاهده گزارش‌ها
                  </NuxtLink>
                </div>
              </div>
              <AddonApexcharts v-bind="incomeHistory" class="ltr:-ms-4 rtl:-me-4" />
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
