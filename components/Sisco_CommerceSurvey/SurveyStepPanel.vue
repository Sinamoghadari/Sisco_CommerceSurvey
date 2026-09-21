<script setup lang="ts">
import { computed } from 'vue'
import type { SurveyQuestion, SurveyStep, SurveySubQuestion } from '~/composables/CommerceSurvey/useSurveyDefinition'
import type { AnswerValue, SurveyAnswers } from '~/composables/CommerceSurvey/useSurveyWizard'
import QuestionField from './QuestionField.vue'

/**
 * پنل یک استپ – سؤال‌ها را بر اساس `group` دسته‌بندی و رندر می‌کند.
 */
const props = defineProps<{
  step: SurveyStep
  answers: SurveyAnswers
  showErrors: boolean
  isInvalid: (q: SurveyQuestion) => boolean
  isSubInvalid?: (q: SurveyQuestion, sub: SurveySubQuestion) => boolean
}>()

const emit = defineEmits<{ (e: 'answer', id: string, value: AnswerValue): void }>()

/** نسخه‌ی نهایی تشخیص خطای سؤال‌های تکمیلی (ترکیب با showErrors) */
const checkSubInvalid = computed(() => {
  if (!props.isSubInvalid) return undefined
  return (q: SurveyQuestion, sub: SurveySubQuestion) => props.showErrors && props.isSubInvalid!(q, sub)
})

interface QuestionGroup {
  title: string | null
  questions: Array<{ q: SurveyQuestion; index: number }>
}

const groups = computed<QuestionGroup[]>(() => {
  const out: QuestionGroup[] = []
  props.step.questions.forEach((q, index) => {
    const title = q.group ?? null
    const last = out[out.length - 1]
    if (last && last.title === title) last.questions.push({ q, index })
    else out.push({ title, questions: [{ q, index }] })
  })
  return out
})
</script>

<template>
  <div class="space-y-8">
    <section v-for="(g, gi) in groups" :key="gi" class="space-y-4">
      <div v-if="g.title" class="flex items-center gap-3">
        <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white whitespace-nowrap">
          {{ g.title }}
        </h3>
        <div class="flex-1 h-px bg-gradient-to-l from-primary-300/70 to-transparent dark:from-primary-700/70" />
      </div>

      <TransitionGroup name="list" tag="div" class="space-y-4">
        <QuestionField
          v-for="item in g.questions"
          :key="item.q.id"
          :question="item.q"
          :index="item.index"
          :model-value="answers[item.q.id] ?? null"
          :invalid="showErrors && isInvalid(item.q)"
          :answers="answers"
          :is-sub-invalid="checkSubInvalid"
          @update:model-value="v => emit('answer', item.q.id, v)"
          @answer="(id, v) => emit('answer', id, v)"
        />
      </TransitionGroup>
    </section>
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
