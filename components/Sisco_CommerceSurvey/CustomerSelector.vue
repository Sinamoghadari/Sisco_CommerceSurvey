<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  CUSTOMER_GROUP_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  type CustomerGroup,
  type CustomerType,
  type SurveySelection
} from '~/composables/CommerceSurvey/useSurveyDefinition'

/**
 * صفحه‌ی ورود: انتخاب گروه مشتری (گندله/شمش) و نوع مشتری (داخلی/خارجی)
 */
const props = defineProps<{
  initial?: Partial<SurveySelection> | null
}>()

const emit = defineEmits<{ (e: 'submit', selection: SurveySelection): void }>()

const group = ref<CustomerGroup | null>(props.initial?.group ?? null)
const type = ref<CustomerType | null>(props.initial?.type ?? null)
const submitted = ref(false)

const groupError = computed(() => submitted.value && !group.value)
const typeError = computed(() => submitted.value && !type.value)
const isValid = computed(() => Boolean(group.value && type.value))

function submit() {
  submitted.value = true
  if (!isValid.value) return
  emit('submit', { group: group.value!, type: type.value! })
}
</script>

<template>
  <form class="mx-auto w-full max-w-4xl" @submit.prevent="submit">
    <BaseCard class="mb-6 overflow-hidden">
      <!-- سربرگ کارت -->
      <div class="relative px-8 py-7 border-b border-muted-200 dark:border-muted-800 bg-gradient-to-l from-primary-50/70 to-transparent dark:from-primary-900/20">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
            <Icon icon="lucide:sliders-horizontal" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-dark-600 dark:text-white">انتخاب پارامترهای نظرسنجی</h2>
            <p class="text-sm text-muted-500 dark:text-muted-400 mt-1">
              لطفاً گروه و نوع مشتری را مشخص کنید تا پرسشنامه‌ی متناسب بارگذاری شود.
            </p>
          </div>
        </div>
      </div>

      <!-- فیلد ۱: گروه مشتری -->
      <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
        <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-3">
          گروه مشتری <span class="text-red-500 font-bold">*</span>
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup">
          <button
            v-for="opt in CUSTOMER_GROUP_OPTIONS"
            :key="opt.value"
            type="button"
            role="radio"
            :aria-checked="group === opt.value"
            class="option-card group"
            :class="[
              group === opt.value ? 'option-card--active' : '',
              groupError ? 'option-card--error' : ''
            ]"
            @click="group = opt.value"
          >
            <span class="option-card__icon">
              <img :src="opt.icon" :alt="opt.label" class="w-8 h-8 product-icon" />
            </span>
            <span class="flex-1 text-right">
              <span class="block text-base font-bold">{{ opt.label }}</span>
              <span class="block text-xs text-muted-500 dark:text-muted-400 mt-1 leading-5">{{ opt.description }}</span>
            </span>
            <span class="option-card__check">
              <Icon icon="lucide:check" class="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        <Transition name="slide">
          <p v-if="groupError" class="flex items-center gap-1.5 text-xs text-red-500 mt-3">
            <Icon icon="lucide:alert-circle" class="w-4 h-4" />
            انتخاب گروه مشتری الزامی است.
          </p>
        </Transition>
      </div>

      <!-- فیلد ۲: نوع مشتری -->
      <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
        <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-3">
          نوع مشتری <span class="text-red-500 font-bold">*</span>
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup">
          <button
            v-for="opt in CUSTOMER_TYPE_OPTIONS"
            :key="opt.value"
            type="button"
            role="radio"
            :aria-checked="type === opt.value"
            class="option-card group"
            :class="[
              type === opt.value ? 'option-card--active' : '',
              typeError ? 'option-card--error' : ''
            ]"
            @click="type = opt.value"
          >
            <span class="option-card__icon">
              <Icon :icon="opt.icon" class="w-7 h-7" />
            </span>
            <span class="flex-1 text-right">
              <span class="block text-base font-bold">{{ opt.label }}</span>
              <span class="block text-xs text-muted-500 dark:text-muted-400 mt-1 leading-5">{{ opt.description }}</span>
            </span>
            <span class="option-card__check">
              <Icon icon="lucide:check" class="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        <Transition name="slide">
          <p v-if="typeError" class="flex items-center gap-1.5 text-xs text-red-500 mt-3">
            <Icon icon="lucide:alert-circle" class="w-4 h-4" />
            انتخاب نوع مشتری الزامی است.
          </p>
        </Transition>
      </div>

      <!-- اکشن‌ها -->
      <div class="px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="flex items-center gap-2 text-xs text-muted-500 dark:text-muted-400 order-2 sm:order-1 leading-6">
            <Icon icon="lucide:info" class="w-4 h-4 flex-shrink-0" />
            پرسشنامه بر اساس انتخاب شما به‌صورت داینامیک ساخته می‌شود.
          </p>

          <BaseButton
            type="submit"
            color="success"
            size="lg"
            class="order-1 sm:order-2 w-full sm:w-auto !px-8 transition-all duration-300"
            :class="isValid ? 'shadow-lg shadow-green-500/25 hover:-translate-y-0.5' : 'opacity-80'"
          >
            <span class="flex items-center gap-2">
              تایید و شروع نظرسنجی
              <Icon icon="lucide:arrow-left" class="w-5 h-5" />
            </span>
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </form>
</template>

<style scoped>
.option-card {
  @apply relative flex items-center gap-4 p-4 rounded-2xl border-2 text-right transition-all duration-300
    bg-white dark:bg-slate-900 border-muted-200 dark:border-muted-700 text-dark-600 dark:text-white
    hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5
    focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30;
}
.option-card--active {
  @apply border-primary-500 bg-primary-50/70 dark:bg-primary-900/30 shadow-lg shadow-primary-500/10;
}
.option-card--error {
  @apply border-red-300 dark:border-red-800;
}
.option-card__icon {
  @apply w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300
    bg-muted-100 dark:bg-slate-800 text-muted-500 dark:text-muted-300;
}
.option-card--active .option-card__icon {
  @apply bg-primary-500 text-white shadow-md shadow-primary-500/30;
}
.option-card__check {
  @apply absolute top-3 left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
    border-muted-300 dark:border-muted-600 text-transparent scale-90;
}
.option-card--active .option-card__check {
  @apply border-primary-500 bg-primary-500 text-white scale-100;
}
.product-icon {
  filter: invert(45%) sepia(10%) saturate(500%) hue-rotate(180deg) brightness(90%);
  transition: filter 0.3s ease;
}
.option-card--active .product-icon {
  filter: invert(100%);
}
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
