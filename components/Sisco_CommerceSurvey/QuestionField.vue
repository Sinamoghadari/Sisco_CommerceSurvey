<script setup lang="ts">
import { computed } from 'vue'
import type { SurveyQuestion, ConditionalFollowUp } from '~/composables/CommerceSurvey/useSurveyApi'
import type { AnswerValue } from '~/composables/CommerceSurvey/useSurveyWizard'
import { isFollowUpConditionMet } from '~/composables/CommerceSurvey/useSurveyWizard'
import RatingGroup from './RatingGroup.vue'
import ChoiceGroup from './ChoiceGroup.vue'

/**
 * موتور رندر سؤال – کاملاً بر اساس داده‌ی API:
 * - strategy_range_rating: طیف داینامیک بین range_min و range_max
 * - single_choice: گزینه‌های رشته‌ای سؤال
 * - text: ورودی متنی
 * در صورت فعال بودن conditional_follow_up و برقراری شرط عددی، سؤال تکمیلی
 * با انیمیشن نمایش داده می‌شود (تک‌انتخابی از options، طیف امتیاز یا ورودی متنی).
 */
const props = withDefaults(
  defineProps<{
    question: SurveyQuestion
    index: number
    /** پاسخ فعلی سؤال تکمیلی (کلید: _id سؤال) */
    followUpValue?: number | string | null
    invalid?: boolean
    followUpInvalid?: boolean
  }>(),
  {
    followUpValue: null,
    invalid: false,
    followUpInvalid: false
  }
)

const emit = defineEmits<{
  (e: 'select', v: AnswerValue): void
  (e: 'follow-up', v: number | string): void
}>()

const fu = computed<ConditionalFollowUp | undefined>(() => props.question.conditional_follow_up)
const fuVisible = computed(() => isFollowUpConditionMet(props.question))
const fuOptions = computed(() => (fu.value?.options ?? []).map(o => ({ value: o, label: o })))

const selectedNumber = computed(() =>
  typeof props.question.selected === 'number' && Number.isFinite(props.question.selected)
    ? props.question.selected
    : null
)

const selectedString = computed(() =>
  typeof props.question.selected === 'string' ? props.question.selected : null
)

const isAnswered = computed(
  () =>
    props.question.selected !== null &&
    props.question.selected !== undefined &&
    !(typeof props.question.selected === 'string' && !props.question.selected.trim())
)

function onSelect(v: AnswerValue) {
  emit('select', v)
}

function onTextArea(e: Event) {
  emit('select', (e.target as HTMLTextAreaElement).value)
}

function onInput(e: Event) {
  emit('select', (e.target as HTMLInputElement).value)
}

function onFollowUp(v: number | string) {
  emit('follow-up', v)
}

function onFollowUpText(e: Event) {
  emit('follow-up', (e.target as HTMLTextAreaElement).value)
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
    <!-- عنوان سؤال (از question.text) -->
    <div class="flex items-start gap-3 mb-4">
      <span
        class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
        :class="isAnswered ? 'bg-green-500 text-white' : 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'"
      >
        {{ index + 1 }}
      </span>
      <div class="flex-1">
        <label class="block text-sm sm:text-base font-bold text-green-600 dark:text-green-400 leading-7">
          {{ question.text }}
          <span v-if="question.required" class="text-red-500 font-bold" title="پاسخ به این سؤال الزامی است">*</span>
        </label>
      </div>
    </div>

    <!-- بدنه‌ی سؤال بر اساس type -->
    <RatingGroup
      v-if="question.type === 'strategy_range_rating'"
      :model-value="selectedNumber"
      :min="question.range_min"
      :max="question.range_max"
      :labels="{ min: String(question.range_min), max: String(question.range_max) }"
      :invalid="invalid"
      :name="question.text"
      @update:model-value="onSelect"
    />

    <ChoiceGroup
      v-else-if="question.type === 'single_choice'"
      :model-value="selectedString"
      :options="(question.options ?? []).map(o => ({ value: o, label: o }))"
      :multiple="false"
      :invalid="invalid"
      @update:model-value="onSelect"
    />

    <textarea
      v-else-if="question.type === 'text'"
      :value="selectedString ?? ''"
      rows="4"
      class="w-full rounded-xl border px-4 py-3 text-sm leading-7 bg-white dark:bg-slate-900 text-muted-800 dark:text-muted-100 placeholder:text-muted-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 resize-y"
      :class="invalid ? 'border-red-400' : 'border-muted-300 dark:border-muted-700'"
      @input="onTextArea"
    />

    <!-- نوع ناشناخته: ورودی متنی به‌عنوان حالت ایمن -->
    <input
      v-else
      type="text"
      :value="selectedString ?? ''"
      class="w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-slate-900 text-muted-800 dark:text-muted-100 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
      :class="invalid ? 'border-red-400' : 'border-muted-300 dark:border-muted-700'"
      @input="onInput"
    />

    <!-- پیام خطای سؤال اصلی -->
    <Transition name="slide">
      <p v-if="invalid" class="flex items-center gap-1.5 text-xs text-red-500 mt-3">
        <Icon icon="lucide:alert-circle" class="w-4 h-4" />
        پاسخ به این سؤال الزامی است.
      </p>
    </Transition>

    <!-- سؤال تکمیلی شرطی (نمایش با برقراری شرط عددی) -->
    <Transition name="reveal">
      <div
        v-if="fu && fuVisible"
        class="mt-5 rounded-xl border-2 border-dashed p-4 bg-amber-50/50 dark:bg-amber-900/10 transition-colors duration-300"
        :class="followUpInvalid ? 'border-red-400 dark:border-red-700' : 'border-amber-300 dark:border-amber-700'"
      >
        <div class="flex items-start gap-2.5 mb-3">
          <span class="flex-shrink-0 inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold leading-5">
            <Icon icon="lucide:corner-down-left" class="w-3 h-3" />
            سؤال تکمیلی
          </span>
          <label class="block text-sm font-bold text-gray-900 dark:text-white leading-6">
            {{ fu.text }}
            <span v-if="fu.required" class="text-red-500 font-bold">*</span>
          </label>
        </div>

        <!-- نوع فیلد سؤال تکمیلی: گزینه‌ها → تک‌انتخابی / طیف امتیاز / متن -->
        <ChoiceGroup
          v-if="fuOptions.length"
          :model-value="typeof followUpValue === 'string' ? followUpValue : null"
          :options="fuOptions"
          :multiple="false"
          :invalid="followUpInvalid"
          @update:model-value="v => onFollowUp(String(v))"
        />

        <RatingGroup
          v-else-if="fu.type === 'strategy_range_rating'"
          :model-value="typeof followUpValue === 'number' ? followUpValue : null"
          :min="fu.range_min"
          :max="fu.range_max"
          :labels="{ min: String(fu.range_min), max: String(fu.range_max) }"
          :invalid="followUpInvalid"
          :name="fu.text"
          @update:model-value="onFollowUp"
        />

        <textarea
          v-else
          :value="followUpValue !== null && followUpValue !== undefined ? String(followUpValue) : ''"
          rows="3"
          class="w-full rounded-xl border px-4 py-3 text-sm leading-7 bg-white dark:bg-slate-900 text-muted-800 dark:text-muted-100 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 resize-y"
          :class="followUpInvalid ? 'border-red-400' : 'border-muted-300 dark:border-muted-700'"
          @input="onFollowUpText"
        />

        <Transition name="slide">
          <p v-if="followUpInvalid" class="flex items-center gap-1.5 text-xs text-red-500 mt-2">
            <Icon icon="lucide:alert-circle" class="w-4 h-4" />
            پاسخ به این سؤال الزامی است.
          </p>
        </Transition>
      </div>
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

/* انیمیشن ظهور سؤال تکمیلی شرطی */
.reveal-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.reveal-leave-active {
  transition: all 0.18s ease;
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
.reveal-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
