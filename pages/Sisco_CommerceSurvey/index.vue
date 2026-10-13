<script setup lang="ts">
import { useCommerceSurvey } from '~/composables/CommerceSurvey/useCommerceSurvey'
import type { SurveySelection } from '~/composables/CommerceSurvey/useSurveyDefinition'
import CustomerSelector from '~/components/Sisco_CommerceSurvey/CustomerSelector.vue'
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
 *  select   → فرم انتخاب گروه/نوع مشتری + راه‌های ارتباطی
 *  survey   → دریافت از API و ویزارد چندمرحله‌ی داینامیک
 *  complete → صفحه‌ی تشکر
 */
const {
  phase,
  selection,
  completion,
  runId,
  survey,
  startSurvey,
  retryFetch,
  changeSelection,
  completeSurvey,
  restart
} = useCommerceSurvey()

const { categories, title, description, alreadyAnswered, status, error } = survey

function onSelectorSubmit(sel: SurveySelection) {
  startSurvey(sel)
}
</script>

<template>
  <div class="w-full">
    <!-- سرتیتر صفحه -->
    <div class="text-center mb-8">
      <BaseHeading as="h1" size="3xl" weight="bold" class="text-black dark:text-white">
        نظرسنجی مشتریان امور بازرگانی
      </BaseHeading>
      <p class="mt-2 text-sm text-muted-500 dark:text-muted-400">
        صدای مشتری (VOC) – شرکت فولاد سیرجان ایرانیان
      </p>
    </div>

    <Transition name="phase" mode="out-in">
      <!-- نمای انتخاب: فرم ورود + راه‌های ارتباطی -->
      <div v-if="phase === 'select'" key="select" class="space-y-6">
        <CustomerSelector :initial="selection" @submit="onSelectorSubmit" />

        <div class="mx-auto w-full max-w-4xl">
          <ContactChannels />
        </div>
      </div>

      <!-- نمای پرسشنامه‌ی داینامیک (از API) -->
      <SurveyWizard
        v-else-if="phase === 'survey' && selection"
        :key="`survey-${selection.group}-${selection.type}-${runId}`"
        :selection="selection"
        :groups="categories"
        :status="status"
        :error-message="error"
        :survey-title="title"
        :survey-description="description"
        :already-answered="alreadyAnswered"
        @complete="completeSurvey"
        @retry="retryFetch"
        @change-selection="changeSelection"
      />

      <!-- نمای پایان -->
      <SurveyComplete
        v-else-if="phase === 'complete' && completion"
        key="complete"
        :selection="completion.selection"
        :answered-count="completion.answeredCount"
        :total-questions="completion.totalQuestions"
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
