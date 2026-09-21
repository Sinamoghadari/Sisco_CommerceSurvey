<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SurveySelection } from '~/composables/Sisco_CommerceSurvey/useSurveyDefinition'
import type { SurveyAnswers } from '~/composables/Sisco_CommerceSurvey/useSurveyWizard'
import CustomerSelector from '~/components/Sisco_CommerceSurvey/CustomerSelector.vue'
import SurveyWizard from '~/components/Sisco_CommerceSurvey/SurveyWizard.vue'
import SurveyComplete from '~/components/Sisco_CommerceSurvey/SurveyComplete.vue'

// تنظیمات متای صفحه
definePageMeta({
  layout: 'sisco-commerce-survey',
  title: 'نظرسنجی مشتریان امور بازرگانی'
})

/**
 * ماشین حالت صفحه:
 *  select   → انتخاب گروه/نوع مشتری
 *  survey   → ویزارد چندمرحله‌ای
 *  complete → صفحه‌ی تشکر
 */
type Phase = 'select' | 'survey' | 'complete'

const phase = ref<Phase>('select')
const selection = ref<SurveySelection | null>(null)
const result = ref<{ selection: SurveySelection; answers: SurveyAnswers } | null>(null)

const overallScore = computed(() => {
  const v = result.value?.answers?.o_score
  return typeof v === 'number' ? v : null
})

function startSurvey(sel: SurveySelection) {
  selection.value = sel
  phase.value = 'survey'
}

function changeSelection() {
  phase.value = 'select'
}

function completeSurvey(payload: { selection: SurveySelection; answers: SurveyAnswers }) {
  // ارسال به سرور در محدوده‌ی این فاز نیست؛ نتیجه فقط در حافظه‌ی کلاینت نگهداری می‌شود.
  result.value = payload
  phase.value = 'complete'
}

function restart() {
  result.value = null
  selection.value = null
  phase.value = 'select'
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
      <CustomerSelector
        v-if="phase === 'select'"
        key="select"
        :initial="selection"
        @submit="startSurvey"
      />

      <SurveyWizard
        v-else-if="phase === 'survey' && selection"
        :key="`survey-${selection.group}-${selection.type}`"
        :selection="selection"
        @complete="completeSurvey"
        @change-selection="changeSelection"
      />

      <SurveyComplete
        v-else-if="phase === 'complete' && result"
        key="complete"
        :selection="result.selection"
        :overall-score="overallScore"
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
