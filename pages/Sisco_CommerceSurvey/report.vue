<script setup lang="ts">
import { onMounted } from 'vue'
import StrategySurveyReport from '~/components/Sisco_CommerceSurvey/StrategySurveyReport.vue'
import { useSurveyApi } from '~/composables/CommerceSurvey/useSurveyApi'

// تنظیمات متای صفحه‌ی گزارش‌دهی
definePageMeta({
  layout: 'sisco-commerce-survey',
  title: 'گزارش‌دهی نظرسنجی مشتریان امور بازرگانی'
})

/**
 * نمای «گزارش‌دهی» – داشبورد داده‌های نظرسنجی راهبردی (GetStrategySurveyReport).
 * برای نگاشت تأییدشده‌ی question_id → دسته، متادیتای پرسشنامه از همان سرویس
 * Access (همان منبع پرسشنامه) نیز دریافت می‌شود؛ نگاشت هرگز بر اساس متن سؤال
 * یا عنوان گره انجام نمی‌شود.
 */
const { categories: accessGroups, fetchSurvey } = useSurveyApi()

onMounted(() => {
  if (!accessGroups.value) {
    void fetchSurvey()
  }
})
</script>

<template>
  <div class="w-full">
    <!-- سرتیتر صفحه -->
    <div class="text-center mb-8">
      <BaseHeading as="h1" size="3xl" weight="bold" class="text-black dark:text-white">
        گزارش‌دهی نظرسنجی
      </BaseHeading>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
        داشبورد داده‌های نظرسنجی راهبردی – شرکت فولاد سیرجان ایرانیان
      </p>
    </div>

    <StrategySurveyReport :groups="accessGroups" />
  </div>
</template>
