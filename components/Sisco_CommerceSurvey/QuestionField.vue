<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SurveyQuestion } from '~/composables/CommerceSurvey/useSurveyApi'
import type { AnswerValue } from '~/composables/CommerceSurvey/useSurveyWizard'
import { isFollowUpConditionMet } from '~/composables/CommerceSurvey/useSurveyWizard'
import QuestionControl from './QuestionControl.vue'

/**
 * کارت یک سؤال – عنوان، نشانگر الزامی (*) و بدنه‌ی چندریختی بر اساس type.
 * سؤال تکمیلی شرطی (conditional_follow_up) با برقراری شرط عددی، با انیمیشن
 * ظاهر می‌شود و با همان موتور رندر (QuestionControl) نمایش داده می‌شود.
 */
const props = withDefaults(
  defineProps<{
    question: SurveyQuestion
    index: number
    /** پاسخ فعلی سؤال اصلی (از نگه‌دارنده‌ی answers بر اساس _id) */
    answer: AnswerValue
    /** پاسخ فعلی سؤال تکمیلی */
    followUpValue: AnswerValue
    /** نگه‌دارنده‌ی توضیح متنی گزینه‌ها */
    optionTexts?: Record<string, string>
    invalid?: boolean
    followUpInvalid?: boolean
    /** سیگنال لرزش: با هر تغییر، در صورت بودن اولین سؤالِ بی‌پاسخ، انیمیشن اجرا می‌شود */
    shakeToken?: number
    /** آیا این سؤال، اولین سؤال بی‌پاسخِ الزامی است؟ */
    isFirstInvalid?: boolean
  }>(),
  {
    optionTexts: () => ({}),
    invalid: false,
    followUpInvalid: false,
    shakeToken: 0,
    isFirstInvalid: false
  }
)

const emit = defineEmits<{
  (e: 'select', v: AnswerValue): void
  (e: 'follow-up', v: AnswerValue): void
  (e: 'option-text', key: string, text: string): void
}>()

/** اجرای انیمیشن لرزش روی اولین سؤال بی‌پاسخ پس از تلاش ناموفق برای عبور */
const shaking = ref(false)
let shakeTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => props.shakeToken,
  () => {
    if (!props.isFirstInvalid) return
    shaking.value = false
    if (shakeTimer) clearTimeout(shakeTimer)
    requestAnimationFrame(() => {
      shaking.value = true
      shakeTimer = setTimeout(() => (shaking.value = false), 700)
    })
  }
)

const fu = computed(() => props.question.conditional_follow_up)
const fuVisible = computed(() => isFollowUpConditionMet({ ...props.question, selected: props.answer }))

const isAnswered = computed(() => {
  const v = props.answer
  if (v === null || v === undefined) return false
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'string') return v.trim().length > 0
  return typeof v === 'number' && Number.isFinite(v)
})
</script>

<template>
  <div
    :id="`q-${question._id}`"
    class="rounded-2xl border p-5 sm:p-6 transition-all duration-300 bg-white dark:bg-slate-900/60 scroll-mt-24"
    :class="[
      invalid
        ? 'border-red-300 dark:border-red-800 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
        : 'border-muted-200 dark:border-muted-800 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800',
      shaking ? 'question-shake' : ''
    ]"
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
          <span v-if="question.required" class="text-red-500 font-bold" title="لطفاً به این سوال پاسخ دهید">*</span>
        </label>
      </div>
    </div>

    <!-- بدنه‌ی سؤال بر اساس type -->
    <QuestionControl
      :type="question.type"
      :model-value="answer"
      :options="question.options"
      :range-min="question.range_min"
      :range-max="question.range_max"
      :option-texts="optionTexts"
      :option-key-prefix="question._id"
      :invalid="invalid"
      :name="question.text"
      @update:model-value="v => emit('select', v)"
      @option-text="(key, text) => emit('option-text', key, text)"
    />

    <!-- پیام خطای سؤال اصلی -->
    <Transition name="slide">
      <p v-if="invalid" class="flex items-center gap-1.5 text-xs text-red-500 mt-3">
        <Icon icon="lucide:alert-circle" class="w-4 h-4" />
        لطفاً به این سوال پاسخ دهید.
      </p>
    </Transition>

    <!-- سؤال تکمیلی شرطی (همان موتور رندر، فعال با شرط امتیاز) -->
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

        <QuestionControl
          :type="fu.type || 'text'"
          :model-value="followUpValue"
          :options="fu.options ?? []"
          :range-min="fu.range_min"
          :range-max="fu.range_max"
          :option-texts="optionTexts"
          :option-key-prefix="`${question._id}__fu`"
          :invalid="followUpInvalid"
          :name="fu.text"
          @update:model-value="v => emit('follow-up', v)"
          @option-text="(key, text) => emit('option-text', key, text)"
        />

        <Transition name="slide">
          <p v-if="followUpInvalid" class="flex items-center gap-1.5 text-xs text-red-500 mt-2">
            <Icon icon="lucide:alert-circle" class="w-4 h-4" />
            لطفاً به این سوال پاسخ دهید.
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

/* انیمیشن لرزش اولین سؤال بی‌پاسخ */
.question-shake {
  animation: question-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes question-shake {
  10%,
  90% {
    transform: translateX(-1px);
  }
  20%,
  80% {
    transform: translateX(2px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }
  40%,
  60% {
    transform: translateX(4px);
  }
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
