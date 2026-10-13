<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SurveyCategoryGroup } from '~/composables/CommerceSurvey/useSurveyApi'
import type { SurveyFetchStatus } from '~/composables/CommerceSurvey/useSurveyApi'
import {
  useSurveyWizard,
  type SurveyCompletionPayload
} from '~/composables/CommerceSurvey/useSurveyWizard'
import { groupLabel, typeLabel, type SurveySelection } from '~/composables/CommerceSurvey/useSurveyDefinition'
import SurveyStepper from './SurveyStepper.vue'
import SurveyStepPanel from './SurveyStepPanel.vue'

/**
 * ویزارد پرسشنامه‌ی داینامیک – تمام محتوا (دسته‌ها، سؤال‌ها، طیف‌ها و
 * سؤال‌های تکمیلی شرطی) از پاسخ API ساخته می‌شود؛ هیچ مرحله یا سؤال
 * هاردکدشده‌ای وجود ندارد.
 * وضعیت‌های بارگذاری / خطا / خالی به‌صورت کامل مدیریت می‌شوند.
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

const isConfirmOpen = ref(false)

const isEmptyView = computed(
  () => wizard.stepperSteps.value.length === 0 || wizard.totalDisplayQuestions.value === 0
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
    <BaseCard v-if="status === 'loading'" class="mb-6 overflow-hidden">
      <div class="px-6 sm:px-8 py-6 border-b border-muted-200 dark:border-muted-800">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
            <Icon icon="lucide:loader-circle" class="w-5 h-5 text-primary-600 dark:text-primary-300 animate-spin" />
          </span>
          <div>
            <p class="font-bold text-gray-900 dark:text-white">در حال دریافت پرسشنامه…</p>
            <p class="text-xs text-muted-500 dark:text-muted-400 mt-0.5">دریافت سؤال‌ها از سرویس توزیع نظرسنجی</p>
          </div>
        </div>
      </div>
      <div class="px-6 sm:px-8 py-6 space-y-4" aria-hidden="true">
        <div v-for="n in 3" :key="n" class="rounded-2xl border border-muted-200 dark:border-muted-800 p-5">
          <div class="h-4 rounded bg-muted-200 dark:bg-muted-700 animate-pulse w-2/3 mb-3" />
          <div class="h-9 rounded-xl bg-muted-100 dark:bg-slate-800 animate-pulse w-full mb-2" />
          <div class="h-3 rounded bg-muted-100 dark:bg-slate-800 animate-pulse w-1/3" />
        </div>
      </div>
    </BaseCard>

    <!-- ================= خطا ================= -->
    <BaseCard v-else-if="status === 'error'" class="mb-6 overflow-hidden">
      <div class="px-8 py-12 text-center">
        <div class="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-4">
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
    <BaseCard v-else-if="isEmptyView" class="mb-6 overflow-hidden">
      <div class="px-8 py-12 text-center">
        <div class="mx-auto w-16 h-16 rounded-2xl bg-muted-100 dark:bg-slate-800 text-muted-400 flex items-center justify-center mb-4">
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
          class="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
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
            {{ wizard.answeredCount.value }} / {{ wizard.totalAnswerable.value }} پاسخ
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
        <!-- استپر داینامیک (از دسته‌های API) -->
        <div class="px-6 sm:px-8 py-6 border-b border-muted-200 dark:border-muted-800 bg-muted-50/60 dark:bg-slate-900/40">
          <SurveyStepper
            :steps="wizard.stepperSteps.value"
            :current-index="wizard.currentIndex.value"
            :progress="wizard.progress.value"
            :status="wizard.stepStatus"
            @select="wizard.goTo"
          />
        </div>

        <!-- عنوان بخش جاری (strategy_node_title) -->
        <div class="px-6 sm:px-8 pt-7 pb-2">
          <Transition :name="wizard.direction.value === 'forward' ? 'step-forward' : 'step-backward'" mode="out-in">
            <div :key="wizard.currentGroup.value?.category?.strategy_node_id || wizard.currentIndex.value" class="flex items-start gap-3">
              <span class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center flex-shrink-0 font-bold">
                {{ wizard.currentIndex.value + 1 }}
              </span>
              <div>
                <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {{ wizard.currentGroup.value?.category?.strategy_node_title }}
                </h2>
                <p class="text-sm text-muted-500 dark:text-muted-400 mt-0.5">
                  {{ wizard.currentGroup.value?.questions.length }} سؤال
                  <template v-if="wizard.currentGroup.value?.category?.strategy_node_weight !== undefined && wizard.currentGroup.value?.category?.strategy_node_weight !== null">
                    • وزن بخش: {{ wizard.currentGroup.value?.category?.strategy_node_weight }}
                  </template>
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
            لطفاً به {{ wizard.currentErrors.value.length }} پاسخ الزامی باقی‌مانده در این بخش پاسخ دهید.
          </div>
        </Transition>

        <!-- بدنه‌ی بخش: سؤال‌های داینامیک -->
        <div class="px-6 sm:px-8 py-6">
          <Transition :name="wizard.direction.value === 'forward' ? 'step-forward' : 'step-backward'" mode="out-in">
            <div :key="wizard.currentGroup.value?.category?.strategy_node_id || wizard.currentIndex.value">
              <SurveyStepPanel
                :questions="wizard.currentGroup.value?.questions ?? []"
                :follow-ups="wizard.followUps"
                :show-errors="wizard.showErrors.value"
                :is-invalid="wizard.isQuestionInvalid"
                :is-follow-up-invalid="wizard.isFollowUpInvalid"
                @select="wizard.setAnswer"
                @follow-up="wizard.setFollowUp"
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
              بخش قبل
            </span>
          </BaseButton>

          <span class="hidden sm:block text-xs text-muted-400">
            بخش {{ wizard.currentIndex.value + 1 }} از {{ wizard.stepperSteps.value.length }}
          </span>

          <BaseButton
            type="button"
            :color="wizard.isLast.value ? 'success' : 'primary'"
            class="!px-7 shadow-md hover:-translate-y-0.5 transition-all"
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
              <button type="button" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" @click="isConfirmOpen = false">خیر</button>
              <button type="button" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors" @click="confirmSubmit">بله، ثبت شود</button>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped>
.chip {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800;
}
.chip--muted {
  @apply bg-muted-100 dark:bg-slate-800 text-muted-600 dark:text-muted-300 border-muted-200 dark:border-muted-700;
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
