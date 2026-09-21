<script setup lang="ts">
definePageMeta({
  title: 'دانلود',
  preview: {
    title: 'دانلودها',
    description: 'برای خروجی گرفتن و دانلود داده‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-downloads.png',
    srcDark: '/img/screens/layouts-downloads-dark.png',
    order: 37,
    new: true,
  },
})

const format = ref('quickbooks')
</script>

<template>
  <div class="w-full pb-24">
    <!--Header-->
    <div class="border-muted-200 dark:border-muted-800 border-b py-6">
      <div
        class="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-start"
      >
        <BaseIconBox
          color="primary"
          variant="pastel"
          size="md"
          rounded="none"
          mask="blob"
        >
          <Icon name="ph:chart-pie-slice-duotone" class="size-6" />
        </BaseIconBox>
        <div>
          <BaseHeading
            as="h2"
            size="xl"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            خروجی گرفتن از داده‌هایتان
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
            داده‌های خود را در قالب CSV دانلود کنید.
          </BaseParagraph>
        </div>
        <div class="sm:ms-auto">
          <BaseSelect v-model="format" rounded="full">
            <option value="quickbooks">
              کوییک‌بوکس CSV
            </option>
            <option value="xero">
              زرو CSV
            </option>
            <option value="freshbooks">
              فایل CSV فرشباکس
            </option>
          </BaseSelect>
        </div>
      </div>
    </div>

    <!--Body-->
    <div class="divide-muted-200 dark:divide-muted-800 space-y-10 py-6">
      <!--Transaction-->
      <div class="grid gap-8 md:grid-cols-12">
        <!--Column-->
        <div class="md:col-span-4">
          <div class="flex gap-3">
            <BaseAvatar
              size="sm"
              :src="`/img/logos/companies/${format}-full.svg`"
            />
            <div>
              <BaseHeading
                as="h3"
                size="xl"
                weight="medium"
                class="text-muted-800 mb-1 dark:text-white"
              >
                داده‌های تراکنش
              </BaseHeading>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-xs"
              >
                تراکنش‌ها را در قالب CSV برای این حساب دانلود کنید. مطمئن شوید که قالب CSV مناسب را انتخاب کرده‌اید.
              </BaseParagraph>
            </div>
          </div>
        </div>
        <!--Column-->
        <div class="md:col-span-8">
          <BaseHeading
            as="h4"
            size="xs"
            weight="medium"
            class="border-muted-200 dark:border-muted-800 text-muted-800 dark:text-muted-100 border-b px-4 pb-4"
          >
            دوره صورت‌حساب
          </BaseHeading>
          <div
            class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
          >
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="#"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
              >
                <BaseText size="sm">
                  تیر ۱۴۰۲
                </BaseText>
                <Icon name="lucide:download" class="size-4" />
                <BaseText
                  size="xs"
                  weight="semibold"
                  class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  دانلود PDF
                </BaseText>
              </NuxtLink>
            </div>
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="#"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
              >
                <BaseText size="sm">
                  خرداد ۱۴۰۲
                </BaseText>
                <Icon name="lucide:download" class="size-4" />
                <BaseText
                  size="xs"
                  weight="semibold"
                  class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  دانلود PDF
                </BaseText>
              </NuxtLink>
            </div>
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="#"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
              >
                <BaseText size="sm">
                  اردیبهشت ۱۴۰۲
                </BaseText>
                <Icon name="lucide:download" class="size-4" />
                <BaseText
                  size="xs"
                  weight="semibold"
                  class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  دانلود PDF
                </BaseText>
              </NuxtLink>
            </div>
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="#"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
              >
                <BaseText size="sm">
                  فروردین ۱۴۰۲
                </BaseText>
                <Icon name="lucide:download" class="size-4" />
                <BaseText
                  size="xs"
                  weight="semibold"
                  class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  دانلود PDF
                </BaseText>
              </NuxtLink>
            </div>
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="#"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
              >
                <BaseText size="sm">
                  اسفند ۱۴۰۱
                </BaseText>
                <Icon name="lucide:download" class="size-4" />
                <BaseText
                  size="xs"
                  weight="semibold"
                  class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  دانلود PDF
                </BaseText>
              </NuxtLink>
            </div>
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="#"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
              >
                <BaseText size="sm">
                  بهمن ۱۴۰۱
                </BaseText>
                <Icon name="lucide:download" class="size-4" />
                <BaseText
                  size="xs"
                  weight="semibold"
                  class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  دانلود PDF
                </BaseText>
              </NuxtLink>
            </div>
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="#"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
              >
                <BaseText size="sm">
                  دی ۱۴۰۲
                </BaseText>
                <Icon name="lucide:download" class="size-4" />
                <BaseText
                  size="xs"
                  weight="semibold"
                  class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  دانلود PDF
                </BaseText>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
