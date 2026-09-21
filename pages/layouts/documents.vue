<script setup lang="ts">
definePageMeta({
  title: 'مدارک',
  preview: {
    title: 'مدارک',
    description: 'برای مدیریت مستندات',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-documents.png',
    srcDark: '/img/screens/layouts-documents-dark.png',
    order: 37,
    new: true,
  },
})
</script>

<template>
  <div class="w-full pb-24">
    <!--Header-->
    <div class="border-muted-200 dark:border-muted-800 border-b py-6">
      <BaseHeading
        as="h2"
        size="xl"
        weight="medium"
        class="text-muted-800 dark:text-white"
      >
        مدارک
      </BaseHeading>
      <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
        مدارک خود را مشاهده و دانلود کنید
      </BaseParagraph>
    </div>

    <!--Body-->
    <div class="divide-muted-200 dark:divide-muted-800 space-y-10 py-6">
      <!--Statements-->
      <div class="grid gap-8 md:grid-cols-12">
        <!--Column-->
        <div class="md:col-span-4">
          <BaseHeading
            as="h3"
            size="lg"
            weight="medium"
            class="text-muted-800 mb-1 dark:text-white"
          >
            صورت‌حساب‌ها
          </BaseHeading>
          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 max-w-xs">
            تراکنش‌ها و مجموع هزینه‌های این حساب را مشاهده کنید. برای دانلود CSV از
            گزینه‌های خروجی استفاده کنید.
          </BaseParagraph>
        </div>
        <!--Column-->
        <div class="md:col-span-8">
          <BaseHeading
            as="h4"
            size="xs"
            weight="medium"
            class="border-muted-200 dark:border-muted-800 text-muted-800 dark:text-muted-100 border-b px-4 pb-4"
          >
            فایل‌های صورت‌حساب
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
                  گزارش سه ماهه اول
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
                  بیانیه Q۲
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
                  صورت‌حساب سه‌ماهه سوم
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

      <!--Documents-->
      <div class="grid gap-8 md:grid-cols-12">
        <!--Column-->
        <div class="md:col-span-4">
          <BaseHeading
            as="h3"
            size="lg"
            weight="medium"
            class="text-muted-800 mb-1 dark:text-white"
          >
            سایر اسناد
          </BaseHeading>
          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 max-w-xs">
            برخی اسناد مفید که ممکن است هر زمان برای به اشتراک‌گذاری یا تأیید نیاز داشته باشید.
          </BaseParagraph>
        </div>
        <!--Column-->
        <div class="md:col-span-8">
          <BaseHeading
            as="h4"
            size="xs"
            weight="medium"
            class="border-muted-200 dark:border-muted-800 text-muted-800 dark:text-muted-100 border-b px-4 pb-4"
          >
            سایر اسناد
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
                  جزئیات حواله
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
                  قرارداد بانکی
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
