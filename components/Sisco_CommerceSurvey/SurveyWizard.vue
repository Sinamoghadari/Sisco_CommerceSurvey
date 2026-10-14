<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { SurveyCategoryGroup } from '~/composables/CommerceSurvey/useSurveyApi'
import type { SurveyFetchStatus } from '~/composables/CommerceSurvey/useSurveyApi'
import {
  useSurveyWizard,
  GENERAL_STEP_TITLE,
  type SurveyCompletionPayload
} from '~/composables/CommerceSurvey/useSurveyWizard'
import type { SurveySelection } from '~/composables/CommerceSurvey/useSurveyDefinition'
import SurveyStepper from './SurveyStepper.vue'
import SurveyStepPanel from './SurveyStepPanel.vue'

/**
 * ویزارد پرسشنامه‌ی داینامیک – تمام محتوا از پاسخ API ساخته می‌شود.
 * - دایره‌های استپر فقط گره‌های استراتژیک هستند؛ بخش «نظرات و جمع‌بندی»
 *   به‌صورت نشان پایانی متمایز و آخرین صفحه ظاهر می‌شود.
 * - همه‌ی انواع سؤال (متن، تک/چندانتخابی با need_text، ستاره‌ای، طیف عددی
 *   و طیف استراتژیک) و سؤال‌های تکمیلی شرطی به‌صورت یکسان رندر می‌شوند.
 * - وضعیت‌های بارگذاری / خطا / خالی به‌صورت کامل مدیریت می‌شوند.
 */
const props = defineProps<{
  selection: SurveySelection
  groups: SurveyCategoryGroup[] | null
  status: SurveyFetchStatus
  errorMessage: string | null
  surveyTitle: string
  surveyDescription: string
  alreadyAnswered: boolean
}>()

const emit = defineEmits<{
  (e: 'complete', result: { payload: SurveyCompletionPayload; answeredCount: number; totalQuestions: number }): void
  (e: 'retry'): void
  (e: 'change-selection'): void
}>()

const wizard = useSurveyWizard(() => props.groups ?? [])

/** تبدیل ارقام لاتین به فارسی برای نمایش یکدست counters */
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
function fa(n: number | string): string {
  return String(n).replace(/\d/g, d => FA_DIGITS[+d])
}

const isConfirmOpen = ref(false)

const isEmptyView = computed(
  () => wizard.displayGroups.value.length === 0 || wizard.totalDisplayQuestions.value === 0
)

/** سیگنال لرزش (shake) – با هر تلاش ناموفق برای عبور، افزایش می‌یابد */
const validationSignal = ref(0)

/** اسکرول نرم به اولین سؤال بی‌پاسخِ الزامی بخش جاری */
async function scrollToFirstInvalid() {
  validationSignal.value++
  await nextTick()
  const qid = wizard.firstInvalidQuestionId.value
  if (!qid || typeof document === 'undefined') return
  const el = document.getElementById(`q-${CSS.escape(qid)}`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function onNext() {
  if (wizard.isLast.value) {
    if (!wizard.validateAll()) {
      void scrollToFirstInvalid()
      return
    }
    isConfirmOpen.value = true
    return
  }
  if (!wizard.next()) {
    void scrollToFirstInvalid()
  }
}

function confirmSubmit() {
  isConfirmOpen.value = false
  emit('complete', {
    payload: wizard.buildCompletionPayload(props.selection),
    answeredCount: wizard.answeredCount.value,
    totalQuestions: wizard.totalAnswerable.value
  })
}
</script>

<template>
  <div class="mx-auto w-full max-w-4xl">
    <!-- ================= بارگذاری ================= -->
    <BaseCard v-if="status === 'loading'" class="mb-6 overflow-hidden !rounded-xl">
      <div class="px-6 sm:px-8 py-6 border-b border-muted-200 dark:border-muted-800">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Icon icon="lucide:loader-circle" class="w-5 h-5 text-slate-600 dark:text-slate-300 animate-spin" />
          </span>
          <div>
            <p class="font-bold text-gray-900 dark:text-white">در حال دریافت پرسشنامه…</p>
            <p class="text-xs text-muted-500 dark:text-muted-400 mt-0.5">دریافت سؤال‌ها از سرویس توزیع نظرسنجی</p>
          </div>
        </div>
      </div>
      <div class="px-6 sm:px-8 py-6 space-y-4" aria-hidden="true">
        <div v-for="n in 3" :key="n" class="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div class="h-4 rounded bg-muted-200 dark:bg-muted-700 animate-pulse w-2/3 mb-3" />
          <div class="h-9 rounded-xl bg-muted-100 dark:bg-slate-800 animate-pulse w-full mb-2" />
          <div class="h-3 rounded bg-muted-100 dark:bg-slate-800 animate-pulse w-1/3" />
        </div>
      </div>
    </BaseCard>

    <!-- ================= خطا ================= -->
    <BaseCard v-else-if="status === 'error'" class="mb-6 overflow-hidden !rounded-xl">
      <div class="px-8 py-12 text-center">
        <div class="mx-auto w-16 h-16 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-4">
          <Icon icon="lucide:cloud-alert" class="w-8 h-8" />
        </div>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">خطا در دریافت پرسشنامه</h2>
        <p class="text-sm text-muted-500 dark:text-muted-400 leading-7 mb-6 max-w-md mx-auto">
          {{ errorMessage || 'ارتباط با سرویس نظرسنجی برقرار نشد. لطفاً دوباره تلاش کنید.' }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <BaseButton color="primary" @click="emit('retry')">
            <span class="flex items-center gap-2">
              <Icon icon="lucide:rotate-cw" class="w-4 h-4" />
              تلاش مجدد
            </span>
          </BaseButton>
          <BaseButton color="muted" variant="outline" @click="emit('change-selection')">
            بازگشت به صفحه‌ی ورود
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- ================= خالی ================= -->
    <BaseCard v-else-if="isEmptyView" class="mb-6 overflow-hidden !rounded-xl">
      <div class="px-8 py-12 text-center">
        <div class="mx-auto w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
          <Icon icon="lucide:inbox" class="w-8 h-8" />
        </div>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">پرسشنامه‌ای برای نمایش وجود ندارد</h2>
        <p class="text-sm text-muted-500 dark:text-muted-400 leading-7 mb-6">
          سرویس نظرسنجی در حال حاضر هیچ بخش یا سؤال فعالی برای این نظرسنجی ارسال نکرده است.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <BaseButton color="primary" variant="outline" @click="emit('retry')">
            <span class="flex items-center gap-2">
              <Icon icon="lucide:rotate-cw" class="w-4 h-4" />
              دریافت مجدد
            </span>
          </BaseButton>
          <BaseButton color="muted" variant="outline" @click="emit('change-selection')">بازگشت</BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- ================= پرسشنامه ================= -->
    <template v-else>
      <!-- هشدار پاسخ قبلی -->
      <Transition name="slide" appear>
        <div
          v-if="alreadyAnswered"
          class="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
        >
          <Icon icon="lucide:info" class="w-4 h-4 flex-shrink-0" />
          بر اساس اطلاعات سرویس، شما قبلاً در این نظرسنجی شرکت کرده‌اید.
        </div>
      </Transition>

      <!-- معرفی پرسشنامه از API -->
      <div v-if="surveyTitle || surveyDescription" class="mb-5 px-1">
        <h2 v-if="surveyTitle" class="text-lg font-bold text-gray-900 dark:text-white">{{ surveyTitle }}</h2>
        <p v-if="surveyDescription" class="text-sm text-muted-500 dark:text-muted-400 mt-1 leading-7">{{ surveyDescription }}</p>
      </div>

      <!-- نوار پیشرفت: نشان با تراز عمودی/افقی دقیق -->
      <div class="flex items-center mb-5">
        <span class="progress-pill" dir="rtl">
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m3 17 2 2 4-4" />
            <path d="m3 7 2 2 4-4" />
            <path d="M13 6h8" />
            <path d="M13 12h8" />
            <path d="M13 18h8" />
          </svg>
          <span class="progress-pill__text">
            {{ fa(wizard.answeredCount.value) }} / {{ fa(wizard.totalAnswerable.value) }} پاسخ
          </span>
        </span>
      </div>

      <BaseCard class="mb-6 overflow-hidden !rounded-xl">
        <!-- استپر: دایره‌های استراتژیک + نشان پایانی جمع‌بندی -->
        <div class="px-6 sm:px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
          <SurveyStepper
            :steps="wizard.strategySteps.value"
            :final-step="wizard.finalStep.value"
            :current-index="wizard.currentIndex.value"
            :max-reachable="wizard.maxReachedIndex.value"
            :progress="wizard.progress.value"
            :status="wizard.stepStatus"
            @select="wizard.goTo"
          />
        </div>

        <!-- عنوان بخش جاری -->
        <div class="px-6 sm:px-8 pt-7 pb-2">
          <Transition :name="wizard.direction.value === 'forward' ? 'step-forward' : 'step-backward'" mode="out-in">
            <div :key="wizard.currentGroup.value?.id || wizard.currentIndex.value" class="flex items-start gap-3">
              <span
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold"
                :class="wizard.currentGroup.value?.isGeneral
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
              >
                <Icon v-if="wizard.currentGroup.value?.isGeneral" icon="lucide:clipboard-check" class="w-5 h-5 text-white" />
                <template v-else>{{ wizard.currentIndex.value + 1 }}</template>
              </span>
              <div>
                <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {{ wizard.currentGroup.value?.title || GENERAL_STEP_TITLE }}
                </h2>
                <p class="text-sm text-muted-500 dark:text-muted-400 mt-0.5">
                  {{ wizard.currentGroup.value?.questions.length }} سؤال
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <!-- هشدار خطا -->
        <Transition name="slide">
          <div
            v-if="wizard.showErrors.value && wizard.currentErrors.value.length"
            class="mx-6 sm:mx-8 mt-4 flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-300"
          >
            <Icon icon="lucide:alert-triangle" class="w-4 h-4 flex-shrink-0" />
            لطفاً به {{ wizard.currentErrors.value.length }} پاسخ الزامی باقی‌مانده در این بخش پاسخ دهید.
          </div>
        </Transition>

        <!-- بدنه‌ی بخش: سؤال‌های داینامیک -->
        <div class="px-6 sm:px-8 py-6">
          <Transition :name="wizard.direction.value === 'forward' ? 'step-forward' : 'step-backward'" mode="out-in">
            <div :key="wizard.currentGroup.value?.id || wizard.currentIndex.value">
              <SurveyStepPanel
                :questions="wizard.currentGroup.value?.questions ?? []"
                :answers="wizard.answers"
                :follow-ups="wizard.followUps"
                :option-texts="wizard.optionTexts"
                :show-errors="wizard.showErrors.value"
                :is-invalid="wizard.isQuestionInvalid"
                :is-follow-up-invalid="wizard.isFollowUpInvalid"
                :shake-token="validationSignal"
                :first-invalid-id="wizard.firstInvalidQuestionId.value"
                @select="wizard.setAnswer"
                @follow-up="wizard.setFollowUp"
                @option-text="wizard.setOptionText"
              />
            </div>
          </Transition>
        </div>

        <!-- ناوبری -->
        <div class="px-6 sm:px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-3">
          <BaseButton
            type="button"
            color="muted"
            variant="outline"
            :disabled="wizard.isFirst.value"
            @click="wizard.prev"
          >
            <span class="flex items-center gap-2">
              <Icon icon="lucide:arrow-right" class="w-4 h-4" />
              بخش قبل
            </span>
          </BaseButton>

          <span class="hidden sm:block text-xs text-slate-400 font-medium">
            بخش {{ fa(wizard.currentIndex.value + 1) }} از {{ fa(wizard.displayGroups.value.length) }}
          </span>

          <BaseButton
            type="button"
            :color="wizard.isLast.value ? 'success' : 'primary'"
            class="!px-6"
            @click="onNext"
          >
            <span class="flex items-center gap-2">
              {{ wizard.isLast.value ? 'ثبت نهایی نظرسنجی' : 'بخش بعد' }}
              <Icon :icon="wizard.isLast.value ? 'lucide:send' : 'lucide:arrow-left'" class="w-4 h-4" />
            </span>
          </BaseButton>
        </div>
      </BaseCard>

      <!-- مودال تایید ثبت نهایی -->
      <Transition name="fade">
        <div v-if="isConfirmOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" @click.self="isConfirmOpen = false">
          <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6 modal-panel">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">تایید ثبت نظرسنجی</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-7">
              آیا از ثبت نهایی پاسخ‌های خود اطمینان دارید؟
            </p>
            <div class="flex justify-end gap-2">
              <button type="button" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" @click="isConfirmOpen = false">خیر</button>
              <button type="button" class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors" @click="confirmSubmit">بله، ثبت شود</button>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped>
/**
 * نشان پیشرفت: تراز مرکزی کامل (عمودی/افقی) با ارسال ثابت، line-height یک
 * و فاصله‌گذاری متقارن – متناسب با ارقام فارسی.
 */
.progress-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  height: 2rem;
  min-width: 2rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}
.progress-pill__text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  letter-spacing: 0;
  transform: translateY(0.5px);
}

/* ترنزیشن جابه‌جایی بخش‌ها (RTL: جلو = ورود از چپ) */
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
