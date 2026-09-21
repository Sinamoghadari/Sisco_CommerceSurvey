<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  buildSurveySteps,
  groupLabel,
  typeLabel,
  type SurveySelection
} from '~/composables/CommerceSurvey/useSurveyDefinition'
import { useSurveyWizard, type SurveyAnswers } from '~/composables/CommerceSurvey/useSurveyWizard'
import SurveyStepper from './SurveyStepper.vue'
import SurveyStepPanel from './SurveyStepPanel.vue'

/**
 * ویزارد چندمرحله‌ای نظرسنجی – استپ‌ها به‌صورت داینامیک بر اساس انتخاب کاربر ساخته می‌شوند.
 * سؤال‌های تکمیلی شرطی (امتیاز <= ۷) در شمارش و اعتبارسنجی لحاظ می‌شوند.
 */
const props = defineProps<{
  selection: SurveySelection
}>()

const emit = defineEmits<{
  (e: 'complete', payload: { selection: SurveySelection; answers: SurveyAnswers }): void
  (e: 'change-selection'): void
}>()

const steps = computed(() => buildSurveySteps(props.selection))
const wizard = useSurveyWizard(() => steps.value)

const isConfirmOpen = ref(false)

/** تعداد پاسخ‌های داده‌شده (سؤال‌های اصلی + سؤال‌های تکمیلیِ نمایان) */
const answeredCount = computed(() =>
  steps.value.reduce(
    (acc, s) =>
      acc +
      s.questions.reduce((qAcc, q) => {
        let n = wizard.isAnswered(q) ? 1 : 0
        for (const sub of q.subQuestions ?? []) {
          if (wizard.isSubQuestionVisible(q, sub) && wizard.isSubAnswered(q, sub)) n++
        }
        return qAcc + n
      }, 0),
    0
  )
)

/** تعداد کل (سؤال‌های اصلی + سؤال‌های تکمیلیِ نمایان) */
const totalQuestions = computed(() =>
  steps.value.reduce(
    (acc, s) =>
      acc +
      s.questions.reduce((qAcc, q) => {
        let n = 1
        for (const sub of q.subQuestions ?? []) {
          if (wizard.isSubQuestionVisible(q, sub)) n++
        }
        return qAcc + n
      }, 0),
    0
  )
)

function onNext() {
  if (wizard.isLast.value) {
    if (wizard.validateAll()) isConfirmOpen.value = true
    return
  }
  wizard.next()
}

function confirmSubmit() {
  isConfirmOpen.value = false
  emit('complete', { selection: props.selection, answers: { ...wizard.answers } })
}
</script>

<template>
  <div class="mx-auto w-full max-w-4xl">
    <!-- نوار خلاصه انتخاب -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div class="flex flex-wrap items-center gap-2">
        <span class="chip">
          <Icon icon="lucide:package" class="w-3.5 h-3.5" />
          گروه: <b>{{ groupLabel(selection.group) }}</b>
        </span>
        <span class="chip">
          <Icon :icon="selection.type === 'export' ? 'lucide:globe' : 'lucide:map-pin'" class="w-3.5 h-3.5" />
          نوع: <b>{{ typeLabel(selection.type) }}</b>
        </span>
        <span class="chip chip--muted">
          <Icon icon="lucide:list-checks" class="w-3.5 h-3.5" />
          {{ answeredCount }} / {{ totalQuestions }} پاسخ
        </span>
      </div>
      <button
        type="button"
        class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline underline-offset-4 flex items-center gap-1"
        @click="emit('change-selection')"
      >
        <Icon icon="lucide:rotate-ccw" class="w-3.5 h-3.5" />
        تغییر پارامترها
      </button>
    </div>

    <BaseCard class="mb-6 overflow-hidden">
      <!-- استپر -->
      <div class="px-6 sm:px-8 py-6 border-b border-muted-200 dark:border-muted-800 bg-muted-50/60 dark:bg-slate-900/40">
        <SurveyStepper
          :steps="wizard.steps.value"
          :current-index="wizard.currentIndex.value"
          :progress="wizard.progress.value"
          :status="wizard.stepStatus"
          @select="wizard.goTo"
        />
      </div>

      <!-- عنوان استپ -->
      <div class="px-6 sm:px-8 pt-7 pb-2">
        <Transition :name="wizard.direction.value === 'forward' ? 'step-forward' : 'step-backward'" mode="out-in">
          <div :key="wizard.currentStep.value.id" class="flex items-start gap-3">
            <span class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center flex-shrink-0">
              <Icon :icon="wizard.currentStep.value.icon" class="w-5 h-5" />
            </span>
            <div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {{ wizard.currentStep.value.title }}
              </h2>
              <p class="text-sm text-muted-500 dark:text-muted-400 mt-0.5">
                {{ wizard.currentStep.value.subtitle }}
              </p>
            </div>
          </div>
        </Transition>
      </div>

      <!-- هشدار خطا -->
      <Transition name="slide">
        <div
          v-if="wizard.showErrors.value && wizard.currentErrors.value.length"
          class="mx-6 sm:mx-8 mt-4 flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-300"
        >
          <Icon icon="lucide:alert-triangle" class="w-4 h-4 flex-shrink-0" />
          لطفاً به {{ wizard.currentErrors.value.length }} پاسخ الزامی باقی‌مانده در این مرحله پاسخ دهید.
        </div>
      </Transition>

      <!-- بدنه‌ی استپ -->
      <div class="px-6 sm:px-8 py-6">
        <Transition :name="wizard.direction.value === 'forward' ? 'step-forward' : 'step-backward'" mode="out-in">
          <div :key="wizard.currentStep.value.id">
            <SurveyStepPanel
              :step="wizard.currentStep.value"
              :answers="wizard.answers"
              :show-errors="wizard.showErrors.value"
              :is-invalid="wizard.isQuestionInvalid"
              :is-sub-invalid="wizard.isSubInvalid"
              @answer="wizard.setAnswer"
            />
          </div>
        </Transition>
      </div>

      <!-- ناوبری -->
      <div class="px-6 sm:px-8 py-5 border-t border-muted-200 dark:border-muted-800 bg-muted-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-3">
        <BaseButton
          type="button"
          color="muted"
          variant="outline"
          :disabled="wizard.isFirst.value"
          @click="wizard.prev"
        >
          <span class="flex items-center gap-2">
            <Icon icon="lucide:arrow-right" class="w-4 h-4" />
            مرحله قبل
          </span>
        </BaseButton>

        <span class="hidden sm:block text-xs text-muted-400">
          مرحله {{ wizard.currentIndex.value + 1 }} از {{ wizard.steps.value.length }}
        </span>

        <BaseButton
          type="button"
          :color="wizard.isLast.value ? 'success' : 'primary'"
          class="!px-7 shadow-md hover:-translate-y-0.5 transition-all"
          @click="onNext"
        >
          <span class="flex items-center gap-2">
            {{ wizard.isLast.value ? 'ثبت نهایی نظرسنجی' : 'مرحله بعد' }}
            <Icon :icon="wizard.isLast.value ? 'lucide:send' : 'lucide:arrow-left'" class="w-4 h-4" />
          </span>
        </BaseButton>
      </div>
    </BaseCard>

    <!-- مودال تایید ثبت نهایی (هم‌راستا با الگوی صفحه‌ی پیشنهادات) -->
    <Transition name="fade">
      <div v-if="isConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" @click.self="isConfirmOpen = false">
        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6 modal-panel">
          <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">تایید ثبت نظرسنجی</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-7">
            آیا از ثبت نهایی پاسخ‌های خود اطمینان دارید؟ پس از ثبت امکان ویرایش وجود نخواهد داشت.
          </p>
          <div class="flex justify-end gap-2">
            <button type="button" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" @click="isConfirmOpen = false">خیر</button>
            <button type="button" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors" @click="confirmSubmit">بله، ثبت شود</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chip {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800;
}
.chip--muted {
  @apply bg-muted-100 dark:bg-slate-800 text-muted-600 dark:text-muted-300 border-muted-200 dark:border-muted-700;
}

/* ترنزیشن جابه‌جایی استپ‌ها (RTL: جلو = ورود از چپ) */
.step-forward-enter-active,
.step-forward-leave-active,
.step-backward-enter-active,
.step-backward-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.step-forward-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.step-forward-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
.step-backward-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.step-backward-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active .modal-panel {
  animation: modal-in 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
}
@keyframes modal-in {
  from {
    transform: translateY(12px) scale(0.97);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
</style>
