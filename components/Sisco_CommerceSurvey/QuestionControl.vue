<script setup lang="ts">
import { computed } from 'vue'
import { normalizeOptions } from '~/composables/CommerceSurvey/useSurveyApi'
import type { AnswerValue } from '~/composables/CommerceSurvey/useSurveyWizard'
import RatingGroup from './RatingGroup.vue'
import QuestionStarRating from './QuestionStarRating.vue'
import ChoiceGroup from './ChoiceGroup.vue'

/**
 * رندر‌کننده‌ی چندریختی (Polymorphic) فیلد سؤال – بر اساس type:
 *  - text: ورودی متنی/چندخطی با placeholder فارسی
 *  - single_choice: تک‌انتخابی از options (پشتیبانی از need_text)
 *  - multiple_choice: چندانتخابی از options (پشتیبانی از need_text)
 *  - rating: ستاره‌ای داینامیک بین range_min..range_max
 *  - range_rating / strategy_range_rating: طیف عددی RTL (min راست، max چپ)
 * این کامپوننت هم برای سؤال اصلی و هم برای سؤال تکمیلی شرطی استفاده می‌شود.
 */
const props = withDefaults(
  defineProps<{
    type: string
    modelValue: AnswerValue
    options?: unknown
    rangeMin?: number
    rangeMax?: number
    optionTexts?: Record<string, string>
    optionKeyPrefix?: string
    invalid?: boolean
    name?: string
    placeholder?: string
  }>(),
  {
    options: () => [],
    rangeMin: 0,
    rangeMax: 10,
    optionTexts: () => ({}),
    optionKeyPrefix: '',
    invalid: false,
    placeholder: 'پاسخ خود را بنویسید...'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: AnswerValue): void
  (e: 'option-text', key: string, text: string): void
}>()

const normalizedOptions = computed(() => normalizeOptions(props.options))

const isChoice = computed(() => props.type === 'single_choice' || props.type === 'multiple_choice')
const isStar = computed(() => props.type === 'rating')
const isNumericScale = computed(() => props.type === 'range_rating' || props.type === 'strategy_range_rating')
const isTextarea = computed(() => props.type === 'text')

const stringValue = computed(() => (typeof props.modelValue === 'string' ? props.modelValue : null))
const numberValue = computed(() => (typeof props.modelValue === 'number' && Number.isFinite(props.modelValue) ? props.modelValue : null))
const arrayValue = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : null))

function update(v: AnswerValue) {
  emit('update:modelValue', v)
}
</script>

<template>
  <!-- متن -->
  <textarea
    v-if="isTextarea"
    :value="stringValue ?? ''"
    rows="4"
    :placeholder="placeholder"
    class="w-full rounded-xl border px-4 py-3 text-sm leading-7 bg-white dark:bg-slate-900 text-muted-800 dark:text-muted-100 placeholder:text-muted-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 resize-y"
    :class="invalid ? 'border-red-400' : 'border-muted-300 dark:border-muted-700'"
    @input="update(($event.target as HTMLTextAreaElement).value)"
  />

  <!-- انتخابی -->
  <ChoiceGroup
    v-else-if="isChoice"
    :model-value="arrayValue ?? stringValue"
    :options="normalizedOptions"
    :multiple="type === 'multiple_choice'"
    :invalid="invalid"
    :option-texts="optionTexts"
    :option-key-prefix="optionKeyPrefix"
    @update:model-value="update"
    @option-text="(key, text) => emit('option-text', key, text)"
  />

  <!-- ستاره‌ای -->
  <QuestionStarRating
    v-else-if="isStar"
    :model-value="numberValue"
    :min="rangeMin"
    :max="rangeMax"
    :invalid="invalid"
    :name="name"
    @update:model-value="update"
  />

  <!-- طیف عددی (RTL) -->
  <RatingGroup
    v-else-if="isNumericScale"
    :model-value="numberValue"
    :min="rangeMin"
    :max="rangeMax"
    :invalid="invalid"
    :name="name"
    @update:model-value="update"
  />

  <!-- نوع ناشناخته: ورودی متنی به‌عنوان حالت ایمن -->
  <input
    v-else
    type="text"
    :value="stringValue ?? ''"
    :placeholder="placeholder"
    class="w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-slate-900 text-muted-800 dark:text-muted-100 placeholder:text-muted-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
    :class="invalid ? 'border-red-400' : 'border-muted-300 dark:border-muted-700'"
    @input="update(($event.target as HTMLInputElement).value)"
  />
</template>
