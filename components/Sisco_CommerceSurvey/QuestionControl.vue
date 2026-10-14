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

/** نوع نرمال‌شده (حذف فاصله/حروف بزرگ) تا تنوع ارسال سرور باعث رد شدن شرط رندر نشود */
const normalizedType = computed(() => String(props.type ?? '').trim().toLowerCase())

const isChoice = computed(() => normalizedType.value === 'single_choice' || normalizedType.value === 'multiple_choice')
const isStar = computed(() => normalizedType.value === 'rating')
const isNumericScale = computed(() => normalizedType.value === 'range_rating' || normalizedType.value === 'strategy_range_rating')
const isTextarea = computed(() => normalizedType.value === 'text')

/** تبدیل امن مقدار بازه به عدد صحیح؛ در صورت نامعتبر بودن از مقدار پیش‌فرض استفاده می‌شود */
function toInt(v: unknown, fallback: number): number {
  // مقادیر غایب (null/undefined/رشته‌ی خالی) باید به پیش‌فرض برسند، نه صفر
  if (v === null || v === undefined || v === '') return fallback
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : fallback
}

/**
 * بازه‌ی مؤثر طیف:
 *  - rating (ستاره‌ای): پیش‌فرض ۰ تا ۵ – حتی اگر سرور مقادیر را ارسال نکرده باشد
 *    یا به‌صورت رشته/null باشند، مقیاس ستاره‌ها همیشه کامل رندر می‌شود.
 *  - سایر طیف‌های عددی: پیش‌فرض ۰ تا ۱۰.
 */
const scaleRange = computed<{ min: number; max: number }>(() => {
  if (isStar.value) {
    return { min: toInt(props.rangeMin, 0), max: toInt(props.rangeMax, 5) }
  }
  return { min: toInt(props.rangeMin, 0), max: toInt(props.rangeMax, 10) }
})

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
    class="w-full rounded-lg border px-4 py-3 text-sm leading-7 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-600/20 focus:border-green-700 resize-y"
    :class="invalid ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'"
    @input="update(($event.target as HTMLTextAreaElement).value)"
  />

  <!-- انتخابی -->
  <ChoiceGroup
    v-else-if="isChoice"
    :model-value="arrayValue ?? stringValue"
    :options="normalizedOptions"
    :multiple="normalizedType === 'multiple_choice'"
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
    :min="scaleRange.min"
    :max="scaleRange.max"
    :invalid="invalid"
    :name="name"
    @update:model-value="update"
  />

  <!-- طیف عددی (RTL) -->
  <RatingGroup
    v-else-if="isNumericScale"
    :model-value="numberValue"
    :min="scaleRange.min"
    :max="scaleRange.max"
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
    class="w-full rounded-lg border px-4 py-3 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-600/20 focus:border-green-700"
    :class="invalid ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'"
    @input="update(($event.target as HTMLInputElement).value)"
  />
</template>
