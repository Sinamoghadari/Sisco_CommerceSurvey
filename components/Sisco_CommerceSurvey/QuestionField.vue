<script setup lang="ts">
import type { SurveyQuestion } from '~/composables/Sisco_CommerceSurvey/useSurveyDefinition'
import type { AnswerValue } from '~/composables/Sisco_CommerceSurvey/useSurveyWizard'
import RatingGroup from './RatingGroup.vue'
import ChoiceGroup from './ChoiceGroup.vue'

/**
 * رندر یک سؤال بر اساس نوع آن (rating / score / single / multi / text / textarea)
 */
const props = withDefaults(
  defineProps<{
    question: SurveyQuestion
    modelValue: AnswerValue
    index: number
    invalid?: boolean
  }>(),
  { invalid: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: AnswerValue): void }>()

function update(v: AnswerValue) {
  emit('update:modelValue', v)
}
</script>

<template>
  <div
    class="rounded-2xl border p-5 sm:p-6 transition-all duration-300 bg-white dark:bg-slate-900/60"
    :class="
      invalid
        ? 'border-red-300 dark:border-red-800 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
        : 'border-muted-200 dark:border-muted-800 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800'
    "
  >
    <!-- عنوان سؤال -->
    <div class="flex items-start gap-3 mb-4">
      <span
        class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
        :class="
          modelValue !== null && modelValue !== undefined && modelValue !== '' && !(Array.isArray(modelValue) && !modelValue.length)
            ? 'bg-green-500 text-white'
            : 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
        "
      >
        {{ index + 1 }}
      </span>
      <div class="flex-1">
        <label class="block text-sm sm:text-base font-bold text-green-600 dark:text-green-400 leading-7">
          {{ question.title }}
          <span v-if="question.required" class="text-red-500 font-bold">*</span>
          <span v-else class="text-xs font-normal text-muted-400 mr-1">(اختیاری)</span>
        </label>
        <p v-if="question.hint" class="text-xs text-muted-500 dark:text-muted-400 mt-1 leading-6">
          {{ question.hint }}
        </p>
      </div>
    </div>

    <!-- بدنه‌ی سؤال -->
    <RatingGroup
      v-if="question.type === 'rating' || question.type === 'score'"
      :model-value="(modelValue as number | null)"
      :max="question.type === 'score' ? 10 : 5"
      :labels="question.scaleLabels"
      :invalid="invalid"
      :name="question.title"
      @update:model-value="update"
    />

    <ChoiceGroup
      v-else-if="question.type === 'single' || question.type === 'multi'"
      :model-value="(modelValue as string | string[] | null)"
      :options="question.options ?? []"
      :multiple="question.type === 'multi'"
      :invalid="invalid"
      @update:model-value="update"
    />

    <textarea
      v-else-if="question.type === 'textarea'"
      :value="(modelValue as string) ?? ''"
      rows="4"
      :placeholder="question.placeholder"
      class="w-full rounded-xl border px-4 py-3 text-sm leading-7 bg-white dark:bg-slate-900 text-muted-800 dark:text-muted-100 placeholder:text-muted-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 resize-y"
      :class="invalid ? 'border-red-400' : 'border-muted-300 dark:border-muted-700'"
      @input="update(($event.target as HTMLTextAreaElement).value)"
    />

    <input
      v-else
      type="text"
      :value="(modelValue as string) ?? ''"
      :placeholder="question.placeholder"
      class="w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-slate-900 text-muted-800 dark:text-muted-100 placeholder:text-muted-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
      :class="invalid ? 'border-red-400' : 'border-muted-300 dark:border-muted-700'"
      @input="update(($event.target as HTMLInputElement).value)"
    />

    <!-- پیام خطا -->
    <Transition name="slide">
      <p v-if="invalid" class="flex items-center gap-1.5 text-xs text-red-500 mt-3">
        <Icon icon="lucide:alert-circle" class="w-4 h-4" />
        پاسخ به این سؤال الزامی است.
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
