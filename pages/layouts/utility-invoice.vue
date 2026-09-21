<script setup lang="ts">
definePageMeta({
  title: 'فاکتور',
  preview: {
    title: 'فاکتور',
    description: 'برای حسابداری و فاکتورها',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-utility-invoice.png',
    srcDark: '/img/screens/layouts-utility-invoice-dark.png',
    order: 90,
  },
})

const data = ref([
  {
    name: 'بازطراحی وب‌سایت',
    unit: 'hrs',
    quantity: 54,
    rate: 24,
  },
  {
    name: 'لوگو طراحی',
    unit: 'hrs',
    quantity: 12,
    rate: 24,
  },
  {
    name: 'تصاویر دلخواه',
    unit: 'hrs',
    quantity: 7,
    rate: 32,
  },
])

const vatRate = 0.1
const totalData = computed(() => {
  const subtotal = data.value.reduce((acc, item) => {
    return acc + item.quantity * item.rate
  }, 0)
  const vatValue = subtotal * vatRate
  const total = subtotal + vatValue

  return [
    {
      label: 'زیرمجموعه',
      value: subtotal,
    },
    {
      label: 'مالیات‌ها',
      value: vatValue,
    },
    {
      label: "مجموع",
      value: total,
    },
  ]
})
</script>

<template>
  <div class="mx-auto max-w-3xl py-10">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <BaseHeading
          as="h2"
          size="xl"
          weight="medium"
          lead="none"
        >
          سفارش #ox-81469
        </BaseHeading>
      </div>
      <div class="flex items-center justify-end gap-3">
        <BaseButtonIcon
          size="sm"
          rounded="full"
          data-nui-tooltip="ویرایش فاکتور"
        >
          <Icon name="ph:pencil-duotone" class="size-4" />
        </BaseButtonIcon>
        <BaseButtonIcon
          size="sm"
          rounded="full"
          data-nui-tooltip="ارسال از طریق ایمیل"
        >
          <Icon name="ph:envelope-duotone" class="size-4" />
        </BaseButtonIcon>
        <BaseButtonIcon
          size="sm"
          rounded="full"
          data-nui-tooltip="Print invoice"
        >
          <Icon name="ph:printer-duotone" class="size-4" />
        </BaseButtonIcon>
        <BaseButtonIcon
          size="sm"
          rounded="full"
          data-nui-tooltip="دانلود به عنوان PDF"
        >
          <Icon name="ph:download-duotone" class="size-4" />
        </BaseButtonIcon>
      </div>
    </div>
    <div>
      <BaseCard>
        <div class="overflow-hidden font-sans">
          <div>
            <div
              class="border-muted-200 dark:border-muted-700 flex flex-col justify-between gap-y-8 border-b p-8 sm:flex-row sm:items-center"
            >
              <div class="flex items-center gap-3">
                <BaseAvatar
                  src="/img/avatars/24.svg"
                  badge-src="/img/stacks/reactjs.svg"
                  size="lg"
                />
                <div class="">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="medium"
                    lead="none"
                  >
                    بتی لوپز
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-400">
                    bettylopez@eltheme.ir
                  </BaseParagraph>
                </div>
              </div>
              <div class="flex gap-12">
                <div
                  class="text-muted-500 dark:text-muted-400 text-sm font-light"
                >
                  <p
                    class="text-muted-700 dark:text-muted-100 text-xs font-normal"
                  >
                    شماره فاکتور
                  </p>
                  <p>INV-48654</p>

                  <p
                    class="text-muted-700 dark:text-muted-100 mt-2 text-xs font-normal"
                  >
                    تاریخ صدور
                  </p>
                  <p>۲۹ اسفند ۱۴۰۱</p>
                </div>
                <div
                  class="text-muted-500 dark:text-muted-400 text-sm font-light"
                >
                  <p
                    class="text-muted-700 dark:text-muted-100 text-xs font-normal"
                  >
                    شرایط
                  </p>
                  <p>۳۰ روز</p>

                  <p
                    class="text-muted-700 dark:text-muted-100 mt-2 text-xs font-normal"
                  >
                    مقرری
                  </p>
                  <p>۱۹.۰۴.۱۴۰۲</p>
                </div>
              </div>
            </div>
            <div
              class="border-muted-200 dark:border-muted-700 flex flex-col justify-between gap-y-8 border-b p-8 sm:flex-row sm:items-center"
            >
              <div class="flex items-center gap-4">
                <TairoLogo class="text-primary-500 size-12" />
                <div class="">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="medium"
                    lead="none"
                  >
                    تایرو
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-400">
                    شرکت نرم‌افزاری
                  </BaseParagraph>
                </div>
              </div>
              <div class="flex gap-12">
                <div
                  class="text-muted-500 dark:text-muted-400 text-sm font-light"
                >
                  <p
                    class="text-muted-700 dark:text-muted-100 text-sm font-normal"
                  >
                    آدرس
                  </p>
                  <p class="text-xs">
                    خیابان کلیسا، شماره 43
                  </p>
                  <p class="text-xs">
                    سن خوزه د لا هریدا
                  </p>
                  <p class="text-xs">
                    کالیفرنیا 91853
                  </p>
                </div>
              </div>
            </div>
            <div class="px-6 py-8 sm:p-8">
              <div class="flex flex-col">
                <table
                  class="divide-muted-200 dark:divide-muted-700 min-w-full divide-y"
                >
                  <thead class="font-sans">
                    <tr>
                      <th
                        scope="col"
                        class="text-muted-400 py-3.5 pe-3 ps-4 text-start text-xs font-medium uppercase sm:ps-6 md:ps-0"
                      >
                        توضیحات
                      </th>
                      <th
                        scope="col"
                        class="text-muted-400 hidden px-3 py-3.5 text-right text-xs font-medium uppercase sm:table-cell"
                      >
                        واحد
                      </th>
                      <th
                        scope="col"
                        class="text-muted-400 hidden px-3 py-3.5 text-right text-xs font-medium uppercase sm:table-cell"
                      >
                        تعداد
                      </th>
                      <th
                        scope="col"
                        class="text-muted-400 hidden px-3 py-3.5 text-right text-xs font-medium uppercase sm:table-cell"
                      >
                        نرخ
                      </th>
                      <th
                        scope="col"
                        class="text-muted-400 py-3.5 pe-4 ps-3 text-right text-xs font-medium uppercase sm:pe-6 md:pe-0"
                      >
                        مقدار
                      </th>
                    </tr>
                  </thead>
                  <tbody class="font-sans">
                    <tr
                      v-for="item in data"
                      :key="item.name"
                      class="border-muted-200 dark:border-muted-700 border-b"
                    >
                      <td class="py-4 pe-3 ps-4 text-sm sm:ps-6 md:ps-0">
                        <div
                          class="text-muted-800 dark:text-muted-100 font-medium"
                        >
                          {{ item.name }}
                        </div>
                        <div class="text-muted-400 mt-0.5 text-xs">
                          {{ item.quantity }} واحد به قیمت نرخ {{ item.rate }} تومان
                        </div>
                      </td>
                      <td
                        class="text-muted-500 dark:text-muted-400 hidden px-3 py-4 text-right text-sm sm:table-cell"
                      >
                        ساعت‌ها
                      </td>
                      <td
                        class="hidden px-3 py-4 text-right text-sm sm:table-cell"
                      >
                        <div class="flex justify-end">
                          <BaseInputNumber
                            v-model="item.quantity"
                            :min="0"
                            :classes="{
                              wrapper: 'w-32',
                            }"
                          />
                        </div>
                      </td>
                      <td
                        class="text-muted-400 hidden px-3 py-4 text-right text-sm sm:table-cell"
                      >
                        نرخ {{ item.rate }} تومان
                      </td>
                      <td
                        class="text-muted-800 dark:text-muted-100 py-4 pe-4 ps-3 text-right text-sm sm:pe-6 md:pe-0"
                      >
                        {{ (item.rate * item.quantity).toFixed(2) }} تومان
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr v-for="item in totalData" :key="item.label">
                      <th
                        scope="row"
                        colspan="4"
                        class="text-muted-400 hidden pe-3 ps-6 pt-6 text-right text-sm font-light sm:table-cell md:ps-0"
                      >
                        {{ item.label }}
                      </th>
                      <th
                        scope="row"
                        class="text-muted-500 pe-3 ps-4 pt-6 text-start text-sm font-light sm:hidden"
                      >
                        {{ item.label }}
                      </th>
                      <td
                        class="pe-4 ps-3 pt-6 text-right sm:pe-6 md:pe-0"
                        :class="
                          item.label === 'مجموع'
                            ? 'font-semibold text-lg text-muted-800 dark:text-muted-100'
                            : 'text-sm text-muted-500 dark:text-muted-200/70'
                        "
                      >
                        {{ item.value.toFixed(2) }} تومان
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div class="mt-8 p-8">
              <div class="border-muted-200 dark:border-muted-700 border-t pt-8">
                <div class="text-muted-400">
                  <BaseParagraph size="xs">
                    شرایط پرداخت ۱۴ روز است. لطفاً توجه داشته باشید که طبق قانون تأخیر در پرداخت بدهی‌های شرکت، فریلنسرها حق دارند در صورت عدم پرداخت بدهی پس از این مدت، مبلغ تأخیر مطالبه کنند و فاکتور جدیدی با افزودن این هزینه صادر خواهد شد. اگر پرداخت فاکتور اصلاح‌شده در مدت ۱۴ روز دیگر دریافت نشود، بهره اضافی به حساب دیرکرد اضافه شده و نرخ قانونی ۸٪ به‌علاوه ۰.۵٪ پایه بانک اعمال می‌شود که در مجموع ۸.۵٪ خواهد بود. طرفین نمی‌توانند از مفاد این قانون خارج شوند.
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
