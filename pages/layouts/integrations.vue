<script setup lang="ts">
definePageMeta({
  title: 'یکپارچگی‌ها',
  preview: {
    title: 'یکپارچگی‌ها',
    description: 'برای یکپارچه‌سازی نرم‌افزارها',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-integrations.png',
    srcDark: '/img/screens/layouts-integrations-dark.png',
    order: 37,
    new: true,
  },
})
</script>

<template>
  <div class="w-full pb-20">
    <div class="space-y-16">
      <!--Group-->
      <div>
        <!--Header-->
        <div class="border-muted-200 dark:border-muted-800 border-b py-6">
          <BaseHeading
            as="h2"
            size="lg"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            فعال (۰)
          </BaseHeading>
          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 max-w-sm">
            یکپارچگی‌های فعال فعلی
          </BaseParagraph>
        </div>
        <!--Content-->
        <div class="pt-6">
          <DemoPlaceholderMinimal
            title="هیچ یکپارچه‌سازی‌ای وجود ندارد"
            description="شما هیچ یکپارچه‌سازی فعالی ندارید. با افزودن یک مورد شروع کنید"
          />
        </div>
      </div>
      <!--Group-->
      <div>
        <!--Header-->
        <div class="border-muted-200 dark:border-muted-800 border-b py-6">
          <BaseHeading
            as="h2"
            size="lg"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            حسابداری
          </BaseHeading>
          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 max-w-sm">
            ادغام‌های حسابداری موجود
          </BaseParagraph>
        </div>
        <!--Content-->
        <div
          class="divide-muted-200 dark:divide-muted-800 space-y-8 divide-y pt-6"
        >
          <!--Item-->
          <div class="ltablet:flex-row flex flex-col gap-3 pt-8 lg:flex-row">
            <BaseAvatar
              size="md"
              src="/img/logos/companies/quickbooks-full.svg"
            />
            <div class="max-w-lg">
              <BaseHeading
                as="h4"
                size="lg"
                weight="medium"
                lead="tight"
                class="text-muted-800 mb-1 dark:text-white"
              >
                کوییک‌بوکس
              </BaseHeading>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-sm"
              >
                کوئیک‌بوکس یک نرم‌افزار حسابداری ساده و کاربرپسند است که درآمد و هزینه‌های کسب‌وکار شما را پیگیری می‌کند و اطلاعات مالی شما را سازماندهی می‌کند، حذف ورود داده‌های دستی.
              </BaseParagraph>
            </div>
            <div class="ltablet:ms-auto lg:ms-auto">
              <BaseButton
                rounded="md"
                color="default"
                size="sm"
              >
                <Icon name="lucide:link" class="me-2 size-4" />
                <span>اتصال به کوئیک‌بوکس</span>
              </BaseButton>
            </div>
          </div>
          <!--Item-->
          <div class="ltablet:flex-row flex flex-col gap-3 pt-8 lg:flex-row">
            <BaseAvatar size="md" src="/img/logos/companies/xero-full.svg" />
            <div class="max-w-lg">
              <BaseHeading
                as="h4"
                size="lg"
                weight="medium"
                lead="tight"
                class="text-muted-800 mb-1 dark:text-white"
              >
                زرو
              </BaseHeading>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-sm"
              >
                زرو یک نرم‌افزار حسابداری ساده و کاربرپسند است که درآمد و هزینه‌های کسب‌وکار شما را پیگیری کرده و اطلاعات مالی شما را برایتان سازماندهی می‌کند و ورود داده‌های دستی را از بین می‌برد.
              </BaseParagraph>
            </div>
            <div class="ltablet:ms-auto lg:ms-auto">
              <BaseButton
                rounded="md"
                color="default"
                size="sm"
              >
                <Icon name="lucide:link" class="me-2 size-4" />
                <span>اتصال به زرو</span>
              </BaseButton>
            </div>
          </div>
          <!--Item-->
          <div class="ltablet:flex-row flex flex-col gap-3 pt-8 lg:flex-row">
            <BaseAvatar
              size="md"
              src="/img/logos/companies/freshbooks-full.svg"
            />
            <div class="max-w-lg">
              <BaseHeading
                as="h4"
                size="lg"
                weight="medium"
                lead="tight"
                class="text-muted-800 mb-1 dark:text-white"
              >
                فرش‌بوکس
              </BaseHeading>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-sm"
              >
                فِرش‌بوکس یک نرم‌افزار حسابداری ساده و کاربرپسند است که درآمد و هزینه‌های کسب‌وکار شما را ردیابی می‌کند و اطلاعات مالی شما را سازماندهی می‌کند، و ورود داده‌ها را به‌طور دستی حذف می‌کند.
              </BaseParagraph>
            </div>
            <div class="ltablet:ms-auto lg:ms-auto">
              <BaseButton
                rounded="md"
                color="default"
                size="sm"
              >
                <Icon name="lucide:link" class="me-2 size-4" />
                <span>اتصال به فرش‌بوکس</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
      <!--Group-->
      <div>
        <!--Header-->
        <div class="border-muted-200 dark:border-muted-800 border-b py-6">
          <BaseHeading
            as="h2"
            size="lg"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            دیگر
          </BaseHeading>
          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 max-w-sm">
            ادغام‌های دیگر موجود
          </BaseParagraph>
        </div>
        <!--Content-->
        <div
          class="divide-muted-200 dark:divide-muted-800 space-y-8 divide-y pt-6"
        >
          <!--Item-->
          <div class="ltablet:flex-row flex flex-col gap-3 pt-8 lg:flex-row">
            <BaseAvatar size="md" src="/img/logos/companies/zapier-full.svg" />
            <div class="max-w-lg">
              <BaseHeading
                as="h4"
                size="lg"
                weight="medium"
                lead="tight"
                class="text-muted-800 mb-1 dark:text-white"
              >
                زپیِر
              </BaseHeading>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-sm"
              >
                زپیِر یک نرم‌افزار حسابداری ساده و کاربرپسند است که درآمد و هزینه‌های کسب‌وکار شما را پیگیری می‌کند و اطلاعات مالی شما را برایتان سازماندهی می‌کند، و نیاز به ورود دستی داده‌ها را از بین می‌برد.
              </BaseParagraph>
            </div>
            <div class="ltablet:ms-auto lg:ms-auto">
              <BaseButton
                rounded="md"
                color="default"
                size="sm"
              >
                <Icon name="lucide:link" class="me-2 size-4" />
                <span>اتصال به زپیِر</span>
              </BaseButton>
            </div>
          </div>
          <!--Item-->
          <div class="ltablet:flex-row flex flex-col gap-3 pt-8 lg:flex-row">
            <BaseAvatar size="md" src="/img/logos/companies/google-full.svg" />
            <div class="max-w-lg">
              <BaseHeading
                as="h4"
                size="lg"
                weight="medium"
                lead="tight"
                class="text-muted-800 mb-1 dark:text-white"
              >
                سرویس گوگل
              </BaseHeading>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-sm"
              >
                گوگل نرم‌افزار حسابداری ساده و کاربرپسندی است که درآمد و هزینه‌های کسب‌وکار شما را ردیابی می‌کند و اطلاعات مالی شما را سازمان‌دهی می‌کند، و ورود دستی داده‌ها را حذف می‌کند.
              </BaseParagraph>
            </div>
            <div class="ltablet:ms-auto lg:ms-auto">
              <BaseButton
                rounded="md"
                color="default"
                size="sm"
              >
                <Icon name="lucide:link" class="me-2 size-4" />
                <span>اتصال به گوگل</span>
              </BaseButton>
            </div>
          </div>
          <!--Item-->
          <div class="ltablet:flex-row flex flex-col gap-3 pt-8 lg:flex-row">
            <BaseAvatar size="md" src="/img/logos/companies/stripe-full.svg" />
            <div class="max-w-lg">
              <BaseHeading
                as="h4"
                size="lg"
                weight="medium"
                lead="tight"
                class="text-muted-800 mb-1 dark:text-white"
              >
                استرایپ
              </BaseHeading>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-sm"
              >
                استرایپ یک نرم‌افزار حسابداری ساده و کاربرپسند است که درآمد و هزینه‌های کسب‌وکار شما را ردیابی کرده و اطلاعات مالی شما را سازماندهی می‌کند و نیاز به ورود دستی اطلاعات را از بین می‌برد.
              </BaseParagraph>
            </div>
            <div class="ltablet:ms-auto lg:ms-auto">
              <BaseButton
                rounded="md"
                color="default"
                size="sm"
              >
                <Icon name="lucide:link" class="me-2 size-4" />
                <span>اتصال به استرایپ</span>
              </BaseButton>
            </div>
          </div>
          <!--Item-->
          <div class="ltablet:flex-row flex flex-col gap-3 pt-8 lg:flex-row">
            <BaseAvatar size="md" src="/img/logos/companies/paypal-full.svg" />
            <div class="max-w-lg">
              <BaseHeading
                as="h4"
                size="lg"
                weight="medium"
                lead="tight"
                class="text-muted-800 mb-1 dark:text-white"
              >
                پی‌پال
              </BaseHeading>
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-sm"
              >
                پی‌پال یک نرم‌افزار حسابداری ساده و کاربرپسند است که درآمدها و هزینه‌های کسب و کار شما را پیگیری می‌کند و اطلاعات مالی شما را سازماندهی می‌کند و ورود دستی داده‌ها را حذف می‌کند.
              </BaseParagraph>
            </div>
            <div class="ltablet:ms-auto lg:ms-auto">
              <BaseButton
                rounded="md"
                color="default"
                size="sm"
              >
                <Icon name="lucide:link" class="me-2 size-4" />
                <span>اتصال به پی‌پال</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
