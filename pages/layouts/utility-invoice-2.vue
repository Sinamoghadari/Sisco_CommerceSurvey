<script setup lang="ts">
definePageMeta({
  title: 'فاکتور',
  preview: {
    title: 'فاکتور',
    description: 'برای خدمات و حسابداری',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-utility-invoice-2.png',
    srcDark: '/img/screens/layouts-utility-invoice-2-dark.png',
    order: 8,
    new: true,
  },
})

const pdfAttachment = ref(true)
const itemName = ref('طراحی UI/UX')
const itemHours = ref(20)
const hourRate = ref(50.45)
const taxRate = ref(6.5)

const itemSubtotal = computed(() =>
  (
    itemHours.value * hourRate.value
    + itemHours.value * hourRate.value * (taxRate.value / 100)
  ).toFixed(2),
)
</script>

<template>
  <div class="pb-20">
    <div class="grid grid-cols-12 gap-6">
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <div class="flex flex-col gap-6">
          <BaseCard
            rounded="md"
            class="p-6"
          >
            <div class="mb-8 flex items-center gap-4">
              <BaseAvatar
                src="/img/logos/companies/amazon.svg"
                alt="آمازون"
                size="md"
                rounded="none"
                mask="blob"
                class="bg-muted-100 dark:bg-muted-900"
              />
              <div>
                <BaseHeading
                  weight="medium"
                  size="lg"
                  lead="none"
                  class="line-clamp-1"
                >
                  آمازون
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-400 line-clamp-1">
                  شرکت تجارت الکترونیک
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <div class="text-end">
                  <BaseParagraph size="sm" class="text-muted-400 line-clamp-1">
                    خیابان چرچ ۴۸
                  </BaseParagraph>
                  <BaseParagraph size="sm" class="text-muted-400 line-clamp-1">
                    لس‌آنجلس، ۹۲۳۸۴
                  </BaseParagraph>
                  <BaseParagraph size="sm" class="text-muted-400 line-clamp-1">
                    ایالات متحده
                  </BaseParagraph>
                </div>
              </div>
            </div>
            <div
              class="bg-primary-800 relative flex flex-col justify-between gap-y-6 overflow-hidden rounded-2xl p-8 sm:flex-row"
            >
              <div
                class="absolute -bottom-10 -start-10 size-48 rounded-full bg-white/10"
              />
              <div
                class="absolute -end-24 -top-10 hidden size-80 rounded-full bg-white/10 sm:block"
              />
              <div class="relative z-20">
                <BaseHeading
                  as="h5"
                  weight="medium"
                  size="sm"
                  lead="none"
                  class="mb-1 text-white"
                >
                  شماره فاکتور
                </BaseHeading>
                <BaseParagraph
                  weight="semibold"
                  class="mb-2 text-white"
                >
                  INV-2023-276
                </BaseParagraph>
                <BaseParagraph
                  size="sm"
                  class="mb-1 text-white"
                >
                  تاریخ صدور: 11 خرداد 1402
                </BaseParagraph>
                <BaseParagraph
                  size="sm"
                  class="text-white"
                >
                  تاریخ سررسید: ۱۱ تیر ۱۴۰۲
                </BaseParagraph>
              </div>
              <div class="relative z-20 sm:text-end">
                <BaseHeading
                  as="h5"
                  weight="medium"
                  size="sm"
                  lead="none"
                  class="mb-1 text-white"
                >
                  صورتحساب به
                </BaseHeading>
                <BaseParagraph
                  weight="semibold"
                  class="mb-2 text-white"
                >
                  کندرا ویلسون
                </BaseParagraph>
                <BaseParagraph
                  size="sm"
                  class="mb-1 text-white"
                >
                  خیابان جامپوال ۲۱
                </BaseParagraph>
                <BaseParagraph
                  size="sm"
                  class="mb-1 text-white"
                >
                  واحد G2، بلوک 23
                </BaseParagraph>
                <BaseParagraph
                  size="sm"
                  class="text-white"
                >
                  لس‌آنجلس، ایالات متحده آمریکا
                </BaseParagraph>
              </div>
            </div>
            <div class="py-6">
              <div class="mb-8 flex items-center">
                <div>
                  <BaseHeading
                    weight="medium"
                    size="sm"
                    class="text-mute-800 dark:text-muted-100"
                  >
                    جزئیات فاکتور
                  </BaseHeading>
                  <BaseParagraph
                    size="xs"
                    class="text-muted-400"
                  >
                    لیست اقلام فاکتور شده
                  </BaseParagraph>
                </div>
                <div class="ms-auto">
                  <BaseButton rounded="md">
                    سفارشی‌سازی
                  </BaseButton>
                </div>
              </div>
              <div
                class="border-muted-200 dark:border-muted-800 w-full overflow-x-auto border-b pb-8"
              >
                <table class="w-full text-start">
                  <thead>
                    <th
                      class="min-w-[200px] px-2 text-start sm:w-1/3 sm:min-w-[auto]"
                    >
                      <BaseText
                        size="xs"
                        weight="semibold"
                        class="text-muted-400"
                      >
                        نام مورد
                      </BaseText>
                    </th>
                    <th class="min-w-[90px] px-2 text-start sm:min-w-[auto]">
                      <BaseText
                        size="xs"
                        weight="semibold"
                        class="text-muted-400"
                      >
                        ساعت‌ها
                      </BaseText>
                    </th>
                    <th class="min-w-[120px] px-2 text-start sm:min-w-[auto]">
                      <BaseText
                        size="xs"
                        weight="semibold"
                        class="text-muted-400"
                      >
                        نرخ / ساعتی
                      </BaseText>
                    </th>
                    <th class="min-w-[60px] px-2 text-start sm:min-w-[60px]">
                      <BaseText
                        size="xs"
                        weight="semibold"
                        class="text-muted-400"
                      >
                        مالیات
                      </BaseText>
                    </th>
                    <th class="min-w-[120px] px-2 text-start sm:min-w-[120px]">
                      <BaseText
                        size="xs"
                        weight="semibold"
                        class="text-muted-400"
                      >
                        زیرمجموعه
                      </BaseText>
                    </th>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="px-2 py-4">
                        <BaseInput
                          v-model="itemName"
                          placeholder="نام مورد"
                        />
                      </td>
                      <td class="px-2 py-4">
                        <BaseInput v-model="itemHours" placeholder="0" />
                      </td>
                      <td class="px-2 py-4">
                        <BaseInput
                          v-model="hourRate"
                          icon="lucide:dollar-sign"
                          placeholder="0.00"
                        />
                      </td>
                      <td class="px-2 py-4">
                        <BaseInput
                          v-model="taxRate"
                          icon="lucide:percent"
                          placeholder="0"
                        />
                      </td>
                      <td class="px-2 py-4">
                        <BaseInput
                          v-model="itemSubtotal"
                          icon="lucide:dollar-sign"
                          placeholder="0.00"
                          readonly
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <button
                    type="button"
                    class="text-primary-500 flex items-center gap-1 underline-offset-4 hover:underline"
                  >
                    <Icon name="lucide:plus" class="size-4" />
                    <BaseText
                      size="xs"
                      weight="semibold"
                    >
                      افزودن آیتم جدید
                    </BaseText>
                  </button>
                </div>
              </div>
              <div class="w-full pt-8">
                <div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
                  <!--Payment method-->
                  <div>
                    <div class="mb-6 flex items-center justify-between">
                      <BaseHeading
                        weight="medium"
                        size="sm"
                        class="text-muted-800 dark:text-muted-100"
                      >
                        روش پرداخت
                      </BaseHeading>
                      <BaseButtonIcon
                        to="/layouts/card/new"
                        rounded="lg"
                        size="sm"
                      >
                        <Icon name="lucide:edit-2" class="size-4" />
                      </BaseButtonIcon>
                    </div>
                    <div class="bg-muted-100 dark:bg-muted-900 rounded-xl p-6">
                      <div class="mb-6 flex items-center justify-between">
                        <div>
                          <BaseHeading as="h4" size="sm">
                            پی‌پال
                          </BaseHeading>
                        </div>
                        <div>
                          <Icon name="logos:paypal" class="size-6" />
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div class="flex items-center justify-between">
                          <BaseParagraph
                            size="sm"
                            class="text-muted-400"
                          >
                            نام
                          </BaseParagraph>
                          <BaseParagraph
                            size="sm"
                            weight="semibold"
                            class="text-muted-800 dark:text-muted-100"
                          >
                            کندرا ویلسون
                          </BaseParagraph>
                        </div>
                        <div class="flex items-center justify-between">
                          <BaseParagraph
                            size="sm"
                            class="text-muted-400"
                          >
                            حساب کاربری
                          </BaseParagraph>
                          <BaseParagraph
                            size="sm"
                            weight="medium"
                            class="text-muted-800 dark:text-muted-100"
                          >
                            3524 65456 3245 4869
                          </BaseParagraph>
                        </div>
                        <div class="flex items-center justify-between">
                          <BaseParagraph
                            size="sm"
                            class="text-muted-400"
                          >
                            مسیریابی
                          </BaseParagraph>
                          <BaseParagraph
                            size="sm"
                            weight="medium"
                            class="text-muted-800 dark:text-muted-100"
                          >
                            4238293
                          </BaseParagraph>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--Total-->
                  <div class="flex h-full flex-col">
                    <div class="mb-6 space-y-2 sm:ps-10">
                      <div class="mb-6 flex items-center justify-between">
                        <BaseHeading
                          weight="medium"
                          size="sm"
                          class="text-muted-800 dark:text-muted-100"
                        >
                          مبلغ صورتحساب
                        </BaseHeading>
                        <BaseButtonIcon
                          to="/layouts/card/new"
                          rounded="lg"
                          size="sm"
                        >
                          <Icon name="lucide:printer" class="size-4" />
                        </BaseButtonIcon>
                      </div>
                      <div class="flex items-center justify-between">
                        <BaseParagraph
                          size="sm"
                          class="text-muted-400"
                        >
                          زیرمجموعه
                        </BaseParagraph>
                        <BaseParagraph
                          size="sm"
                          weight="semibold"
                          class="text-muted-800 dark:text-muted-100"
                        >
                          {{ asToman(1525.18) }}
                        </BaseParagraph>
                      </div>
                      <div class="flex items-center justify-between">
                        <BaseParagraph
                          size="sm"
                          class="text-muted-400"
                        >
                          تخفیف
                        </BaseParagraph>
                        <BaseParagraph
                          size="sm"
                          weight="semibold"
                          class="text-muted-800 dark:text-muted-100"
                        >
                          {{ asToman(0.0) }}
                        </BaseParagraph>
                      </div>
                      <div class="flex items-center justify-between">
                        <BaseParagraph
                          size="sm"
                          class="text-muted-400"
                        >
                          مالیات‌ها
                        </BaseParagraph>
                        <BaseParagraph
                          size="sm"
                          weight="semibold"
                          class="text-muted-800 dark:text-muted-100"
                        >
                          {{ asToman(0.0) }}
                        </BaseParagraph>
                      </div>
                    </div>
                    <div class="mt-auto sm:ps-10">
                      <div
                        class="border-muted-200 dark:border-muted-800 flex items-center justify-between border-t pt-6"
                      >
                        <BaseParagraph
                          size="sm"
                          class="text-muted-400"
                        >
                          مجموع
                        </BaseParagraph>
                        <BaseParagraph
                          size="sm"
                          weight="semibold"
                          class="text-muted-800 dark:text-muted-100"
                        >
                          {{ asToman(parseInt(itemSubtotal)) }}
                        </BaseParagraph>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="flex flex-col gap-6">
          <!--Customer-->
          <BaseCard
            rounded="md"
            elevated
            class="p-6"
          >
            <div
              class="border-muted-200 dark:border-muted-800 mb-6 flex items-center gap-4 border-b pb-8"
            >
              <BaseAvatar
                src="/img/avatars/10.svg"
                alt="گیت‌لب"
                size="md"
                rounded="none"
                mask="blob"
                class="bg-muted-100 dark:bg-muted-900"
              />
              <div>
                <BaseHeading
                  weight="medium"
                  size="md"
                  lead="none"
                  class="line-clamp-1"
                >
                  کندرا ویلسون
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-400 line-clamp-1">
                  kendraw@eltheme.ir
                </BaseParagraph>
              </div>
            </div>
            <div class="mb-6">
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                خیابان ویکتوریا ۱۴۸، واحد D23، طبقه ۳
              </BaseParagraph>
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                نیویورک، آمریکا
              </BaseParagraph>
            </div>
            <div>
              <BaseButton
                variant="pastel"
                rounded="md"
                color="primary"
                class="w-full"
              >
                ویرایش مشتری
              </BaseButton>
            </div>
          </BaseCard>
          <!--Amount-->
          <BaseCard
            rounded="md"
            class="p-6"
          >
            <div class="mb-6">
              <BaseHeading
                weight="medium"
                size="md"
                lead="none"
                class="line-clamp-1"
              >
                مبلغ فاکتور
              </BaseHeading>
              <BaseParagraph size="xs" class="text-muted-400 line-clamp-1">
                بر حسبتومان بیان شده
              </BaseParagraph>
            </div>
            <div class="border-muted-200 dark:border-muted-800 border-b pb-4">
              <BaseHeading
                weight="semibold"
                size="2xl"
                lead="none"
                class="mb-3"
              >
                {{ asToman(parseInt(itemSubtotal)) }}
                <BaseText size="xs" class="text-muted-400 inline">
                  (شامل مالیات)
                </BaseText>
              </BaseHeading>
              <BaseTag
                rounded="full"
                variant="pastel"
                color="danger"
              >
                موعد پرداخت: 23 فروردین 1403
              </BaseTag>
            </div>
            <div class="flex items-center justify-between pt-4">
              <BaseText
                size="sm"
                class="text-muted-400"
              >
                ضمیمه کردن PDF در ایمیل
              </BaseText>
              <div>
                <BaseSwitchBall v-model="pdfAttachment" color="primary" />
              </div>
            </div>
          </BaseCard>
          <!--Actions-->
          <BaseCard
            rounded="md"
            class="p-6"
          >
            <div class="flex gap-4">
              <BaseButton rounded="md" class="w-full">
                <Icon name="lucide:eye" class="size-4" />
                <span>پیش‌نمایش</span>
              </BaseButton>
              <BaseButton rounded="md" class="w-full">
                <Icon name="lucide:download" class="size-4" />
                <span>دانلود</span>
              </BaseButton>
            </div>
          </BaseCard>
          <!--Submit-->
          <div>
            <BaseButton
              rounded="md"
              color="primary"
              size="lg"
              class="w-full"
            >
              <Icon name="lucide:mail" class="size-4" />
              <span>ارسال فاکتور</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
