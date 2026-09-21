<script setup lang="ts">
definePageMeta({
  title: 'تایید',
  preview: {
    title: 'تایید حساب کاربری',
    description: 'برای تائید حساب کاربری',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-utility-confirm.png',
    srcDark: '/img/screens/layouts-utility-confirm-dark.png',
    order: 87,
  },
})
</script>

<template>
  <div class="flex items-center justify-center pb-12">
    <BasePlaceholderPage
      title="حساب خود را تأیید کنید"
      subtitle="سلام مایا، خوشحالیم که شما را در تیم خود داریم! لطفا حساب خود را تایید کنید تا بتوانید به استفاده از اپلیکیشن ما ادامه دهید."
    >
      <template #image>
        <img
          class="block dark:hidden"
          src="/img/illustrations/placeholders/flat/placeholder-launch.svg"
          alt="placeholder-image"
        >
        <img
          class="hidden dark:block"
          src="/img/illustrations/placeholders/flat/placeholder-launch-dark.svg"
          alt="placeholder-image"
        >
      </template>

      <div class="mx-auto mt-4 flex w-full max-w-[280px] justify-between gap-2">
        <BaseButton rounded="lg" class="h-11 w-full">
          لغو
        </BaseButton>
        <BaseButton
          color="primary"
          rounded="lg"
          class="h-11 w-full"
        >
          تایید
        </BaseButton>
      </div>
    </BasePlaceholderPage>
  </div>
</template>
