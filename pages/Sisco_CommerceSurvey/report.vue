<script setup lang="ts">
import StrategySurveyReport from '~/components/Sisco_CommerceSurvey/StrategySurveyReport.vue'

// تنظیمات متای صفحه‌ی گزارش‌دهی
definePageMeta({
  layout: 'sisco-commerce-survey',
  title: 'گزارش‌دهی نظرسنجی مشتریان امور بازرگانی'
})

/**
 * نمای «گزارش‌دهی» – بازرسی داده‌های جمع‌آوری‌شده‌ی نظرسنجی راهبردی
 * (GetStrategySurveyReport). دریافت گزارش در خود کامپوننت مدیریت می‌شود.
 */
</script>

<template>
  <div class="w-full">
    <!-- سرتیتر صفحه -->
    <div class="text-center mb-8">
      <BaseHeading as="h1" size="3xl" weight="bold" class="text-black dark:text-white">
        گزارش‌دهی نظرسنجی
      </BaseHeading>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
        بازرسی داده‌های نظرسنجی راهبردی – شرکت فولاد سیرجان ایرانیان
      </p>
    </div>

    <StrategySurveyReport />
  </div>
</template>
