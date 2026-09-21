<script setup lang="ts">
definePageMeta({
  title: 'حساب‌های کاربری',
  preview: {
    title: 'داشبورد بانکی نسخه ۵',
    description: 'برای مدیریت حساب‌های بانکی',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-banking-5.png',
    srcDark: '/img/screens/dashboards-banking-5-dark.png',
    order: 10,
    new: true,
  },
})
</script>

<template>
  <div class="space-y-6 pb-20 pt-4">
    <div class="grid grid-cols-12 gap-6">
      <!-- Balance -->
      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
        <BaseCard
          rounded="md"
          class="h-full p-8"
        >
          <div
            class="flex h-full flex-col justify-between gap-y-6 sm:flex-row sm:gap-y-0"
          >
            <div class="flex flex-col">
              <BaseParagraph
                size="sm"
                class="text-muted-400 mb-4"
              >
                حساب اصلی
              </BaseParagraph>
              <BaseHeading
                weight="medium"
                class="text-muted-800 dark:text-muted-100"
              >
                حساب جاری
              </BaseHeading>
              <BaseParagraph
                size="sm"
                class="text-muted-400 mb-6"
              >
                1487 3256 54122 4897
              </BaseParagraph>
              <div class="mt-auto flex flex-col items-center gap-2 sm:flex-row">
                <BaseButton
                  to="/layouts/send"
                  rounded="md"
                  color="primary"
                  class="w-full sm:w-auto"
                >
                  انتقال پول
                </BaseButton>
                <BaseButton
                  to="/layouts/accounts/linked"
                  rounded="md"
                  class="w-full sm:w-auto"
                >
                  اتصال حساب‌ها
                </BaseButton>
              </div>
            </div>
            <div class="flex flex-col">
              <BaseParagraph
                size="sm"
                class="text-muted-400 mb-4"
              >
                بودجه‌های موجود
              </BaseParagraph>
              <BaseHeading
                as="h5"
                size="2xl"
                class="mb-6"
              >
                ۹۵۴۳۱۲۰ تومان
              </BaseHeading>

              <div class="ms-auto mt-auto">
                <TairoLogo class="text-muted-400 size-12" />
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Orders -->
      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
        <BaseCard
          rounded="md"
          class="!bg-primary-800 !border-primary-800 h-full p-8"
        >
          <div
            class="flex flex-col justify-between gap-y-16 sm:flex-row sm:gap-y-0"
          >
            <div class="flex flex-col">
              <BaseHeading
                weight="medium"
                class="mb-3 text-white"
              >
                دستورات ایستاده
              </BaseHeading>
              <BaseParagraph
                size="sm"
                class="text-muted-100 mb-6"
              >
                لورم ایپسوم دولور سیت آمت، کنسکتتور آدیپیسینگ الیت. سی
                لونگوس، لوویس دیکتا سانت. کوره آتنده، کوایسو
              </BaseParagraph>
              <div class="mt-auto flex items-center gap-2">
                <BaseButton
                  to="/layouts/send"
                  rounded="md"
                >
                  مدیریت سفارشات
                </BaseButton>
              </div>
            </div>
            <div class="relative min-h-[180px] min-w-[160px] shrink-0">
              <div
                class="absolute bottom-0 end-0 min-w-[250px] max-w-[250px] sm:-end-16 sm:min-w-[220px]"
              >
                <VectorIllustrationCalendar class="text-primary-500" />
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Tile -->
      <div class="col-span-12 sm:col-span-4">
        <BaseCard
          rounded="md"
          class="p-6"
        >
          <div class="mb-6 flex justify-between">
            <div class="flex flex-col">
              <BaseHeading
                weight="medium"
                size="md"
                class="text-muted-800 dark:text-muted-100 mb-&"
              >
                بانک چیس
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                **** **** 1728
              </BaseParagraph>
            </div>
            <div>
              <img
                src="/img/logos/companies/chase-full.svg"
                alt="Bank logo"
                class="size-8"
              >
            </div>
          </div>
          <div class="flex justify-between">
            <div>
              <BaseHeading as="h5" size="xl">
                ۳٬۴۶۲٫۱۲تومان
              </BaseHeading>
            </div>
            <div>
              <BaseButtonIcon size="sm" rounded="lg">
                <Icon name="lucide:arrow-right" class="rtl:-scale-x-100" />
              </BaseButtonIcon>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Tile -->
      <div class="col-span-12 sm:col-span-4">
        <BaseCard
          rounded="md"
          class="p-6"
        >
          <div class="mb-6 flex justify-between">
            <div class="flex flex-col">
              <BaseHeading
                weight="medium"
                size="md"
                class="text-muted-800 dark:text-muted-100 mb-&"
              >
                بانک اوراسیایی
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                **** **** 3291
              </BaseParagraph>
            </div>
            <div>
              <img
                src="/img/logos/companies/eurasian-full.svg"
                alt="Bank logo"
                class="size-8"
              >
            </div>
          </div>
          <div class="flex justify-between">
            <div>
              <BaseHeading as="h5" size="xl">
                ۱,۷۶۳.۴۹ تومان
              </BaseHeading>
            </div>
            <div>
              <BaseButtonIcon size="sm" rounded="lg">
                <Icon name="lucide:arrow-right" class="rtl:-scale-x-100" />
              </BaseButtonIcon>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Tile -->
      <div class="col-span-12 sm:col-span-4">
        <BaseCard
          rounded="md"
          class="p-6"
        >
          <div class="mb-6 flex justify-between">
            <div class="flex flex-col">
              <BaseHeading
                weight="medium"
                size="md"
                class="text-muted-800 dark:text-muted-100 mb-&"
              >
                بانک آمریکا
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                **** **** 5482
              </BaseParagraph>
            </div>
            <div>
              <img
                src="/img/logos/companies/bank-of-america-full.svg"
                alt="Bank logo"
                class="size-8"
              >
            </div>
          </div>
          <div class="flex justify-between">
            <div>
              <BaseHeading as="h5" size="xl">
                ۶۷,۲۹۸,۷۰۰ تومان
              </BaseHeading>
            </div>
            <div>
              <BaseButtonIcon size="sm" rounded="lg">
                <Icon name="lucide:arrow-right" class="rtl:-scale-x-100" />
              </BaseButtonIcon>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Transactions -->
      <div class="col-span-12">
        <DemoWidgetTransactionSummary />
      </div>
      <!-- Chart -->
      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
        <BaseCard
          rounded="md"
          class="flex h-full flex-col p-8"
        >
          <div class="mb-8 items-center justify-between sm:flex">
            <BaseHeading
              as="h4"
              size="sm"
              weight="medium"
              lead="none"
              class="text-muted-400 uppercase"
            >
              تمام هزینه‌ها
            </BaseHeading>
          </div>
          <div
            class="border-muted-200 dark:border-muted-800 mb-4 flex justify-between border-b pb-4"
          >
            <div>
              <BaseParagraph size="xs" class="text-muted-400 mb-1">
                روزانه
              </BaseParagraph>
              <BaseHeading as="h5" size="md">
                ۲۷۶۴ تومان
              </BaseHeading>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-400 mb-1">
                هفتگی
              </BaseParagraph>
              <BaseHeading as="h5" size="md">
                ۱۲,۸۷۱,۲۰۰ تومان
              </BaseHeading>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-400 mb-1">
                ماهانه
              </BaseParagraph>
              <BaseHeading as="h5" size="md">
                ۳۴,۱۶۲,۰۵۰ تومان
              </BaseHeading>
            </div>
          </div>
          <div class="mt-auto sm:px-4">
            <DemoChartDonutExpenses />
          </div>
        </BaseCard>
      </div>
      <!-- Chart -->
      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
        <BaseCard
          rounded="md"
          class="h-full flex-col p-8"
        >
          <div class="mb-8 items-center justify-between sm:flex">
            <BaseHeading
              as="h4"
              size="sm"
              weight="medium"
              lead="none"
              class="text-muted-400 uppercase"
            >
              درآمد
            </BaseHeading>
          </div>
          <div
            class="border-muted-200 dark:border-muted-800 mb-4 flex justify-between border-b pb-4"
          >
            <div>
              <BaseParagraph size="xs" class="text-muted-400 mb-1">
                روزانه
              </BaseParagraph>
              <BaseHeading as="h5" size="md">
                ۳,۷۸۱,۲۰۰ تومان
              </BaseHeading>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-400 mb-1">
                هفتگی
              </BaseParagraph>
              <BaseHeading as="h5" size="md">
                ۸۳۲.۲۱ تومان
              </BaseHeading>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-400 mb-1">
                ماهانه
              </BaseParagraph>
              <BaseHeading as="h5" size="md">
                ۴۲,۱۴۹,۷۰ تومان
              </BaseHeading>
            </div>
          </div>
          <div class="mt-auto sm:px-4">
            <DemoChartBarMultiIncome />
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
