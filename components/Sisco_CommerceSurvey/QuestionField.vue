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
    class="rounded-xl border p-5 sm:p-6 transition-all duration-300 bg-white dark:bg-slate-900/60 scroll-mt-24"
    :class="[
      invalid
        ? 'border-red-300 dark:border-red-800 shadow-[0_0_0_3px_rgba(220,38,38,0.06)]'
        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
      shaking ? 'question-shake' : ''
    ]"
  >
    <!-- عنوان سؤال (از question.text) -->
    <div class="flex items-start gap-3 mb-4">
      <span
        class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
        :class="isAnswered ? 'bg-green-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
      >
        {{ index + 1 }}
      </span>
      <div class="flex-1">
        <label class="block text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-7">
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
      <p v-if="invalid" class="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-3">
        <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
        لطفاً به این سوال پاسخ دهید.
      </p>
    </Transition>

    <!-- سؤال تکمیلی شرطی (همان موتور رندر، فعال با شرط امتیاز) -->
    <Transition name="reveal">
      <div
        v-if="fu && fuVisible"
        class="mt-6 rounded-lg border border-dashed p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300"
        :class="followUpInvalid ? 'border-red-400 dark:border-red-700' : 'border-slate-300 dark:border-slate-600'"
      >
        <div class="flex items-start gap-2.5 mb-3">
          <span class="flex-shrink-0 inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold leading-5">
            <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              <path d="m9 10-5 5 5 5" />
            </svg>
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
          <p v-if="followUpInvalid" class="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-2">
            <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
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
