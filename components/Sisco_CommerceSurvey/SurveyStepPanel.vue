<script setup lang="ts">
import type { SurveyQuestion } from '~/composables/CommerceSurvey/useSurveyApi'
import type { AnswerValue } from '~/composables/CommerceSurvey/useSurveyWizard'
import QuestionField from './QuestionField.vue'

/**
 * پنل یک بخش (دسته‌ی API) – سؤال‌های مرتب‌شده را به موتور رندر می‌سپارد.
 * پاسخ‌ها به‌صورت نگاشت بر اساس question._id پاس داده می‌شوند.
 */
defineProps<{
  questions: SurveyQuestion[]
  /** نگاشت پاسخ سؤال‌های اصلی (کلید: _id) */
  answers: Record<string, AnswerValue>
  /** نگاشت پاسخ سؤال‌های تکمیلی (کلید: _id سؤال اصلی) */
  followUps: Record<string, AnswerValue>
  /** نگاشت توضیح متنی گزینه‌های need_text */
  optionTexts: Record<string, string>
  showErrors: boolean
  isInvalid: (q: SurveyQuestion) => boolean
  isFollowUpInvalid: (q: SurveyQuestion) => boolean
  /** سیگنال لرزش (با هر تلاش ناموفق افزایش می‌یابد) */
  shakeToken?: number
  /** شناسه‌ی اولین سؤال بی‌پاسخ (برای اسکرول و لرزش) */
  firstInvalidId?: string | null
}>()

const emit = defineEmits<{
  (e: 'select', q: SurveyQuestion, v: AnswerValue): void
  (e: 'follow-up', q: SurveyQuestion, v: AnswerValue): void
  (e: 'option-text', key: string, text: string): void
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
        :answer="answers[q._id] ?? null"
        :follow-up-value="followUps[q._id] ?? null"
        :option-texts="optionTexts"
        :invalid="showErrors && isInvalid(q)"
        :follow-up-invalid="showErrors && isFollowUpInvalid(q)"
        :shake-token="shakeToken ?? 0"
        :is-first-invalid="firstInvalidId === q._id"
        @select="v => emit('select', q, v)"
        @follow-up="v => emit('follow-up', q, v)"
        @option-text="(key, text) => emit('option-text', key, text)"
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
