<script setup lang="ts">
import { computed } from 'vue'
import {
  groupLabel,
  type CustomerGroup,
  type SurveyFollowUp,
  type SurveyQuestion,
  type SurveyStep
} from '~/composables/CommerceSurvey/useSurveyDefinition'
import type { AnswerValue, SurveyAnswers } from '~/composables/CommerceSurvey/useSurveyWizard'
import SurveyStepPanel from './SurveyStepPanel.vue'

/**
 * استپ کیفیت محصول – نسخه‌ی اختصاصی با بنر معرفی محصول انتخاب‌شده
 * (سؤال‌های q7_* و پیگیرهایشان به‌صورت داینامیک برای شمش یا گندله تولید می‌شوند)
 */
const props = defineProps<{
  step: SurveyStep
  group: CustomerGroup
  answers: SurveyAnswers
  showErrors: boolean
  isInvalid: (q: SurveyQuestion) => boolean
  isFollowUpInvalid?: (q: SurveyQuestion, fu: SurveyFollowUp) => boolean
}>()

const emit = defineEmits<{ (e: 'answer', id: string, value: AnswerValue): void }>()

/** شاخص‌های بنر محصول، مستقیماً از تعریف سؤال‌ها (followUps) استخراج می‌شود */
const productMeta = computed(() => {
  const icon = `/img/Sisco_CommerceSurvey/${props.group === 'billet' ? 'billet' : 'pellet'}.svg`
  const [physicalQ, metQ] = props.step.questions
  const joinLabels = (q?: SurveyQuestion) =>
    (q?.followUps ?? []).map(f => f.label).join('، ') || '—'
  return {
    icon,
    physical: joinLabels(physicalQ),
    metallurgical: joinLabels(metQ)
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- بنر محصول انتخاب‌شده -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary-200 dark:border-primary-800 bg-gradient-to-l from-primary-50 via-white to-white dark:from-primary-900/30 dark:via-slate-900 dark:to-slate-900 p-5"
    >
      <div class="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-primary-100/60 dark:bg-primary-800/20 blur-2xl" />
      <div class="relative flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-primary-600 dark:text-primary-300 flex-shrink-0">
          <img :src="productMeta.icon" :alt="groupLabel(group)" class="w-9 h-9 product-icon" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-muted-500 dark:text-muted-400">محصول مورد ارزیابی</p>
          <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ groupLabel(group) }}</h4>
        </div>
      </div>
      <div class="relative grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div class="rounded-xl bg-white/80 dark:bg-slate-800/60 border border-muted-200 dark:border-muted-700 px-4 py-3">
          <p class="text-[11px] font-bold text-primary-600 dark:text-primary-300 mb-1">شاخص‌های فیزیکی و ظاهری</p>
          <p class="text-xs text-muted-600 dark:text-muted-300 leading-6">{{ productMeta.physical }}</p>
        </div>
        <div class="rounded-xl bg-white/80 dark:bg-slate-800/60 border border-muted-200 dark:border-muted-700 px-4 py-3">
          <p class="text-[11px] font-bold text-primary-600 dark:text-primary-300 mb-1">شاخص‌های متالورژیکی</p>
          <p class="text-xs text-muted-600 dark:text-muted-300 leading-6" dir="auto">{{ productMeta.metallurgical }}</p>
        </div>
      </div>
    </div>

    <SurveyStepPanel
      :step="step"
      :answers="answers"
      :show-errors="showErrors"
      :is-invalid="isInvalid"
      :is-follow-up-invalid="isFollowUpInvalid"
      @answer="(id, v) => emit('answer', id, v)"
    />
  </div>
</template>

<style scoped>
/* رنگ‌آمیزی آیکون‌های SVG خطی با رنگ برند */
.product-icon {
  filter: invert(36%) sepia(80%) saturate(1600%) hue-rotate(200deg) brightness(95%) contrast(95%);
}
.dark .product-icon {
  filter: invert(70%) sepia(40%) saturate(900%) hue-rotate(190deg) brightness(105%);
}
</style>
