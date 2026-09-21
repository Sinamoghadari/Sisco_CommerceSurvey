<script setup lang="ts">
definePageMeta({
  title: 'نمای کلی',
  preview: {
    title: 'نمای کلی',
    description: 'برای رصد و اقدام سریع',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-overview.png',
    srcDark: '/img/screens/dashboards-overview-dark.png',
    order: 5,
    new: true,
  },
})
</script>

<template>
  <div class="pb-20 pt-6">
    <div class="grid grid-cols-12 gap-6">
      <!--Cards-->
      <div
        class="ptablet:col-span-5 ltablet:col-span-4 col-span-12 lg:col-span-4"
      >
        <div class="bg-muted-50 dark:bg-muted-950 border-muted-200 dark:border-muted-800 ltablet:p-12 rounded-2xl border p-6 lg:p-12">
          <!--Header-->
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
              کارت‌های شما
            </BaseHeading>
            <BaseButtonIcon
              to="/layouts/card/new"
              rounded="lg"
              size="sm"
            >
              <Icon name="lucide:plus" class="size-4" />
            </BaseButtonIcon>
          </div>
          <!--Cards and accounts-->
          <div
            class="border-muted-300 dark:border-muted-800 flex flex-col gap-6 border-b pb-10"
          >
            <!--Card-->
            <div class="bg-muted-200 dark:bg-muted-800 mx-auto w-full max-w-[315px] rounded-2xl p-2">
              <DemoCreditCardReal
                status="active"
                name="کندرا ویلسون"
                number="•••• •••• •••• 4479"
                brand="mastercard"
              />
            </div>
            <!--Account-->
            <NuxtLink
              to="/layouts/accounts"
              class="bg-muted-100 hover:bg-muted-200 dark:bg-muted-950 dark:hover:bg-muted-900 flex items-center rounded-xl p-6 transition-colors duration-300"
            >
              <BaseText
                size="sm"
                weight="semibold"
                lead="none"
                class="text-muted-800 dark:text-muted-100"
              >
                {{ asToman(9543.13) }}
              </BaseText>
              <div
                class="divide-muted-300 dark:divide-muted-800 ms-auto flex items-center divide-x rtl:divide-x-reverse"
              >
                <BaseText
                  size="sm"
                  weight="medium"
                  lead="none"
                  class="text-muted-800 dark:text-muted-100 px-3"
                >
                  **** 4869
                </BaseText>
                <div class="px-3">
                  <Icon name="logos:mastercard" class="size-6" />
                </div>
              </div>
            </NuxtLink>
            <!--Account-->
            <NuxtLink
              to="/layouts/accounts"
              class="bg-muted-100 hover:bg-muted-200 dark:bg-muted-950 dark:hover:bg-muted-900 flex items-center rounded-xl p-6 transition-colors duration-300"
            >
              <BaseText
                size="sm"
                weight="semibold"
                lead="none"
                class="text-muted-800 dark:text-muted-100"
              >
                {{ asToman(2816.27) }}
              </BaseText>
              <div
                class="divide-muted-300 dark:divide-muted-800 ms-auto flex items-center divide-x rtl:divide-x-reverse"
              >
                <BaseText
                  size="sm"
                  weight="medium"
                  lead="none"
                  class="text-muted-800 dark:text-muted-100 px-3"
                >
                  **** 1521
                </BaseText>
                <div class="px-3">
                  <Icon name="logos:visa" class="size-6" />
                </div>
              </div>
            </NuxtLink>
          </div>
          <!--Limits-->
          <div class="flex flex-col gap-6 pt-6">
            <!--Withdrawal-->
            <NuxtLink
              to="/layouts/cards"
              class="hover:bg-muted-100 dark:hover:bg-muted-900 flex items-center gap-3 rounded-2xl p-3 transition-colors duration-200"
            >
              <div
                class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 flex size-12 items-center justify-center rounded-xl border bg-white"
              >
                <Icon
                  name="guidance:atm"
                  class="text-muted-800 dark:text-muted-100 size-5"
                />
              </div>
              <div>
                <BaseHeading
                  weight="medium"
                  size="sm"
                  class="text-mute-800 dark:text-muted-100"
                >
                  {{ asToman(950) }} /
                  <span class="font-semibold">{{
                    asToman(2500)
                  }}</span>
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  class="text-muted-400"
                >
                  حد برداشت
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseButtonIcon rounded="lg" size="sm">
                  <Icon name="lucide:chevron-right" class="size-4 rtl:rotate-180" />
                </BaseButtonIcon>
              </div>
            </NuxtLink>
            <!--Payment-->
            <NuxtLink
              to="/layouts/cards"
              class="hover:bg-muted-100 dark:hover:bg-muted-900 flex items-center gap-3 rounded-2xl p-3 transition-colors duration-200"
            >
              <div
                class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 flex size-12 items-center justify-center rounded-xl border bg-white"
              >
                <Icon
                  name="guidance:money"
                  class="text-muted-800 dark:text-muted-100 size-5"
                />
              </div>
              <div>
                <BaseHeading
                  weight="medium"
                  size="sm"
                  class="text-mute-800 dark:text-muted-100"
                >
                  {{ asToman(231.12) }} /
                  <span class="font-semibold">{{
                    asToman(5000)
                  }}</span>
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  class="text-muted-400"
                >
                  حد مجاز پرداخت
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseButtonIcon rounded="lg" size="sm">
                  <Icon name="lucide:chevron-right" class="rtl:rotate-180 size-4" />
                </BaseButtonIcon>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
      <!--Quick transactions-->
      <div
        class="ptablet:col-span-7 ltablet:col-span-8 col-span-12 lg:col-span-8"
      >
        <div
          class="ltablet:p-12 bg-muted-200 dark:bg-muted-950 rounded-2xl p-6 lg:p-12"
        >
          <!--Header---->
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
              تراکنش سریع
            </BaseHeading>
            <BaseButtonIcon
              to="/layouts/send"
              rounded="lg"
              size="sm"
            >
              <Icon name="lucide:plus" class="size-4" />
            </BaseButtonIcon>
          </div>
          <div
            class="nui-slimscroll ltablet:overflow-x-hidden flex gap-4 overflow-x-auto lg:overflow-x-hidden"
          >
            <NuxtLink
              to="/layouts/send"
              class="bg-muted-200 dark:bg-muted-950 hover:bg-muted-300 dark:hover:bg-muted-900 flex-1 rounded-2xl p-4 text-center transition-colors duration-200"
            >
              <BaseIconBox
                size="md"
                rounded="none"
                mask="blob"
                class="dark:bg-muted-950 mx-auto mb-2 bg-white"
              >
                <Icon name="ph:bank-duotone" class="size-5" />
              </BaseIconBox>
              <BaseText size="sm" class="line-clamp-1">
                دستورالعمل
              </BaseText>
            </NuxtLink>
            <div
              role="button"
              class="bg-muted-200 dark:bg-muted-950 hover:bg-muted-300 dark:hover:bg-muted-900 flex-1 rounded-2xl p-4 text-center transition-colors duration-200"
            >
              <BaseAvatar
                src="/img/avatars/3.svg"
                size="md"
                rounded="none"
                mask="blob"
                class="mx-auto mb-2"
              />
              <BaseText size="sm" class="line-clamp-1">
                کالب دبلیو.
              </BaseText>
            </div>
            <div
              role="button"
              class="bg-muted-200 dark:bg-muted-950 hover:bg-muted-300 dark:hover:bg-muted-900 flex-1 rounded-2xl p-4 text-center transition-colors duration-200"
            >
              <BaseAvatar
                src="/img/avatars/8.svg"
                size="md"
                rounded="none"
                mask="blob"
                class="mx-auto mb-2"
              />
              <BaseText size="sm" class="line-clamp-1">
                جان بی.
              </BaseText>
            </div>
            <div
              role="button"
              class="bg-muted-200 dark:bg-muted-950 hover:bg-muted-300 dark:hover:bg-muted-900 flex-1 rounded-2xl p-4 text-center transition-colors duration-200"
            >
              <BaseAvatar
                src="/img/avatars/24.svg"
                size="md"
                rounded="none"
                mask="blob"
                class="mx-auto mb-2"
              />
              <BaseText size="sm" class="line-clamp-1">
                امبر و.
              </BaseText>
            </div>
            <div
              role="button"
              class="bg-muted-200 dark:bg-muted-950 hover:bg-muted-300 dark:hover:bg-muted-900 flex-1 rounded-2xl p-4 text-center transition-colors duration-200"
            >
              <BaseAvatar
                src="/img/avatars/12.svg"
                size="md"
                rounded="none"
                mask="blob"
                class="mx-auto mb-2"
              />
              <BaseText size="sm" class="line-clamp-1">
                جنیفر و.
              </BaseText>
            </div>
            <div
              role="button"
              class="bg-muted-200 dark:bg-muted-950 hover:bg-muted-300 dark:hover:bg-muted-900 flex-1 rounded-2xl p-4 text-center transition-colors duration-200"
            >
              <BaseAvatar
                src="/img/avatars/13.svg"
                size="md"
                rounded="none"
                mask="blob"
                class="mx-auto mb-2"
              />
              <BaseText size="sm" class="line-clamp-1">
                جاش دی.
              </BaseText>
            </div>
          </div>
          <div class="py-10">
            <div>
              <DemoChartAreaBalance />
            </div>
          </div>
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
              فعالیت‌های اخیر
            </BaseHeading>
            <DemoLinkArrow to="/layouts" />
          </div>
          <div class="space-y-6">
            <!--Item-->
            <div class="flex items-center gap-3">
              <div
                class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 flex size-12 items-center justify-center rounded-xl border bg-white"
              >
                <Icon
                  name="ph:credit-card-duotone"
                  class="text-muted-800 dark:text-muted-100 size-5"
                />
              </div>
              <div>
                <BaseHeading
                  weight="medium"
                  size="sm"
                  class="text-mute-800 dark:text-muted-100"
                >
                  گوشه ویکتوریا
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  class="text-muted-400"
                >
                  پرداخت خروجی
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseText
                  size="sm"
                  weight="semibold"
                  lead="none"
                  class="text-muted-800 dark:text-muted-100"
                >
                  - {{ asToman(938.39) }}
                </BaseText>
              </div>
            </div>
            <!--Item-->
            <div class="flex items-center gap-3">
              <div
                class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 flex size-12 items-center justify-center rounded-xl border bg-white"
              >
                <Icon
                  name="ph:bank-duotone"
                  class="text-muted-800 dark:text-muted-100 size-5"
                />
              </div>
              <div>
                <BaseHeading
                  weight="medium"
                  size="sm"
                  class="text-mute-800 dark:text-muted-100"
                >
                  جان رولند
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  class="text-muted-400"
                >
                  پرداخت خروجی
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseText
                  size="sm"
                  weight="semibold"
                  lead="none"
                  class="text-muted-800 dark:text-muted-100"
                >
                  - {{ asToman(1234.15) }}
                </BaseText>
              </div>
            </div>
            <!--Item-->
            <div class="flex items-center gap-3">
              <div
                class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 flex size-12 items-center justify-center rounded-xl border bg-white"
              >
                <Icon
                  name="ph:credit-card-duotone"
                  class="text-muted-800 dark:text-muted-100 size-5"
                />
              </div>
              <div>
                <BaseHeading
                  weight="medium"
                  size="sm"
                  class="text-mute-800 dark:text-muted-100"
                >
                  برگر کالی
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  class="text-muted-400"
                >
                  پرداخت خروجی
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseText
                  size="sm"
                  weight="semibold"
                  lead="none"
                  class="text-muted-800 dark:text-muted-100"
                >
                  - {{ asToman(23.69) }}
                </BaseText>
              </div>
            </div>
            <!--Item-->
            <div class="flex items-center gap-3">
              <div
                class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 flex size-12 items-center justify-center rounded-xl border bg-white"
              >
                <Icon
                  name="ph:bank-duotone"
                  class="text-muted-800 dark:text-muted-100 size-5"
                />
              </div>
              <div>
                <BaseHeading
                  weight="medium"
                  size="sm"
                  class="text-mute-800 dark:text-muted-100"
                >
                  ریل‌وی اینک
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  class="text-muted-400"
                >
                  پرداخت ورودی
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseText
                  size="sm"
                  weight="semibold"
                  lead="none"
                  class="text-muted-800 dark:text-muted-100"
                >
                  + {{ asToman(2399.99) }}
                </BaseText>
              </div>
            </div>
            <!--Item-->
            <div class="flex items-center gap-3">
              <div
                class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 flex size-12 items-center justify-center rounded-xl border bg-white"
              >
                <Icon
                  name="ph:credit-card-duotone"
                  class="text-muted-800 dark:text-muted-100 size-5"
                />
              </div>
              <div>
                <BaseHeading
                  weight="medium"
                  size="sm"
                  class="text-mute-800 dark:text-muted-100"
                >
                  موبی‌هاوس
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  class="text-muted-400"
                >
                  پرداخت خروجی
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseText
                  size="sm"
                  weight="semibold"
                  lead="none"
                  class="text-muted-800 dark:text-muted-100"
                >
                  - {{ asToman(49.99) }}
                </BaseText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
