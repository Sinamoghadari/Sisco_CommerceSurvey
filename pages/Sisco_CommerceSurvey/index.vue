<script setup lang="ts">
import { useCommerceSurvey } from '~/composables/CommerceSurvey/useCommerceSurvey'
import { DEFAULT_SURVEY_SELECTION } from '~/composables/CommerceSurvey/useSurveyDefinition'
import ContactChannels from '~/components/Sisco_CommerceSurvey/ContactChannels.vue'
import SurveyWizard from '~/components/Sisco_CommerceSurvey/SurveyWizard.vue'
import SurveyComplete from '~/components/Sisco_CommerceSurvey/SurveyComplete.vue'

// تنظیمات متای صفحه
definePageMeta({
  layout: 'sisco-commerce-survey',
  title: 'نظرسنجی مشتریان امور بازرگانی'
})

/**
 * وضعیت صفحه از کامپوزیبل اختصاصی مدیریت می‌شود؛ پرسشنامه به‌صورت داینامیک
 * از سرویس توزیع نظرسنجی (SurveyDistribution/Access) دریافت می‌شود:
 *  select   → صفحه‌ی ورود (شروع نظرسنجی + راه‌های ارتباطی)
 *  survey   → دریافت از API و ویزارد چندمرحله‌ای داینامیک
 *  complete → صفحه‌ی تشکر
 */
const {
  phase,
  completion,
  runId,
  survey,
  startSurvey,
  retryFetch,
  changeSelection,
  completeSurvey,
  restart
} = useCommerceSurvey()

const { categories, alreadyAnswered, status, error } = survey
</script>

<template>
  <div class="w-full">
    <!-- سرتیتر صفحه -->
    <div class="text-center mb-8">
      <BaseHeading as="h1" size="3xl" weight="bold" class="text-black dark:text-white">
        نظرسنجی مشتریان امور بازرگانی
      </BaseHeading>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
        صدای مشتری (VOC) – شرکت فولاد سیرجان ایرانیان
      </p>
    </div>

    <Transition name="phase" mode="out-in">
      <!-- نمای ورود: دکمه‌ی شروع + راه‌های ارتباطی -->
      <div v-if="phase === 'select'" key="select" class="space-y-6">
        <!-- کارت معرفی نظرسنجی (بالای دکمه‌ی شروع) -->
        <div class="mx-auto w-full max-w-4xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 sm:px-8 py-7 text-center shadow-sm">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            فرم ارزیابی رضایت مشتریان
          </h2>
          <p class="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-8 font-medium max-w-2xl mx-auto">
            لطفاً با اختصاص چند دقیقه زمان و تکمیل این فرم، ما را در بهبود کیفیت محصولات و خدمات خود یاری فرمایید.
          </p>
          <div class="mt-4 inline-flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5 text-right">
            <Icon icon="lucide:info" class="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span class="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 leading-6">
              توجه فرمائید برای پر کردن سوالات هر بخش، ابتدا بخش قبلی می بایست تکمیل گردد
            </span>
          </div>
        </div>

        <div class="mx-auto w-full max-w-4xl flex flex-col items-center gap-3">
          <BaseButton
            type="button"
            color="success"
            size="lg"
            class="!px-12 !rounded-xl text-lg font-bold"
            @click="startSurvey(DEFAULT_SURVEY_SELECTION)"
          >
            <span class="flex items-center gap-2">
              شروع نظرسنجی
              <Icon icon="lucide:arrow-left" class="w-5 h-5" />
            </span>
          </BaseButton>
          
        </div>

        <div class="mx-auto w-full max-w-4xl">
          <ContactChannels />
        </div>
      </div>

      <!-- نمای پرسشنامه‌ی داینامیک (از API) -->
      <SurveyWizard
        v-else-if="phase === 'survey'"
        :key="`survey-${runId}`"
        :selection="DEFAULT_SURVEY_SELECTION"
        :groups="categories"
        :status="status"
        :error-message="error"
        :already-answered="alreadyAnswered"
        @complete="completeSurvey"
        @retry="retryFetch"
        @change-selection="changeSelection"
      />

      <!-- نمای پایان -->
      <SurveyComplete
        v-else-if="phase === 'complete' && completion"
        key="complete"
        :answered-count="completion.answeredCount"
        :total-questions="completion.totalQuestions"
        :server-message="completion.serverMessage"
        @restart="restart"
      />
    </Transition>
  </div>
</template>

<style scoped>
.phase-enter-active,
.phase-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.phase-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.phase-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
