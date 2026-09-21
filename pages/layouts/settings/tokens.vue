<script setup lang="ts">
definePageMeta({
  title: 'توکن‌های API',
  preview: {
    title: 'توکن‌های API',
    description: 'برای مدیریت تنظیمات',
    categories: ['چیدمان‌ها', 'تنظیمات'],
    src: '/img/screens/layouts-settings-tokens.png',
    srcDark: '/img/screens/layouts-settings-tokens-dark.png',
    order: 37,
    new: true,
  },
})
</script>

<template>
  <div>
    <DemoPlaceholderMinimal
      title="در حال حاضر هیچ توکن API ندارید"
      description="اگر نیاز دارید به بک‌اند خود متصل شوید، می‌توانید یک توکن API ایجاد کنید تا بتوانید از یک اپلیکیشن خارجی به خدمات ما متصل شوید."
    >
      <div class="mt-3 flex justify-center">
        <BaseButton
          rounded="md"
          color="primary"
          class="w-40"
        >
          ایجاد نشانه
        </BaseButton>
      </div>
    </DemoPlaceholderMinimal>
  </div>
</template>
