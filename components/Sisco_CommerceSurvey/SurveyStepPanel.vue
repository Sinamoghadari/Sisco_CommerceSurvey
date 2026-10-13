<script setup lang="ts">
import type { SurveyQuestion } from '~/composables/CommerceSurvey/useSurveyApi'
import type { AnswerValue, FollowUpAnswer } from '~/composables/CommerceSurvey/useSurveyWizard'
import QuestionField from './QuestionField.vue'

/**
 * پنل یک بخش (دسته‌ی API) – سؤال‌های مرتب‌شده را به موتور رندر می‌سپارد.
 */
defineProps<{
  questions: SurveyQuestion[]
  /** پاسخ سؤال‌های تکمیلی (کلید: _id سؤال اصلی) */
  followUps: Record<string, FollowUpAnswer>
  showErrors: boolean
  isInvalid: (q: SurveyQuestion) => boolean
  isFollowUpInvalid: (q: SurveyQuestion) => boolean
}>()

const emit = defineEmits<{
  (e: 'select', q: SurveyQuestion, v: AnswerValue): void
  (e: 'follow-up', q: SurveyQuestion, v: number | string): void
}>()
</script>

<template>
  <div class="space-y-4">
    <TransitionGroup name="list" tag="div" class="space-y-4">
      <QuestionField
        v-for="(q, i) in questions"
        :key="q._id"
        :question="q"
        :index="i"
        :follow-up-value="followUps[q._id] ?? null"
        :invalid="showErrors && isInvalid(q)"
        :follow-up-invalid="showErrors && isFollowUpInvalid(q)"
        @select="v => emit('select', q, v)"
        @follow-up="v => emit('follow-up', q, v)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
