<script setup lang="ts">
import { computed } from 'vue'

/**
 * استپر بالای ویزارد:
 * - دایره‌های شماره‌دار فقط برای گره‌های استراتژیک (strategySteps از API).
 * - بخش «نظرات و جمع‌بندی» (در صورت وجود) به‌صورت نشان پایانی متمایز و
 *   بدون شماره، به‌عنوان آخرین صفحه‌ی ویزارد نمایش داده می‌شود.
 * - برچسب زیر هر دایره فقط عنوان دسته است (بدون «بخش X» تکراری).
 * - ظاهر صنعتی/سازمانی: سبز سازمانی محدود + خنثی‌های اسلیت، بدون سایه‌های پرزرق‌وبرق.
 * - کنتراست همه‌ی حالت‌ها تضمین‌شده: دایره‌های پر متن سفید دارند.
 */
const props = defineProps<{
  steps: Array<{ id: string; title: string }>
  /** بخش پایانی جمع‌بندی (خارج از دایره‌های شماره‌دار) */
  finalStep: { id: string; title: string } | null
  /** ایندکس جاری در فضای کل بخش‌ها (استراتژیک + پایانی) */
  currentIndex: number
  /** سقف دسترسی خطی: فقط دایره‌های <= این مقدار قابل کلیک‌اند (Strict Linear Stepper) */
  maxReachable: number
  progress: number
  status: (index: number) => 'done' | 'active' | 'pending' | 'error'
}>()

const emit = defineEmits<{ (e: 'select', index: number): void }>()

/** کلاس دایره‌ی استراتژیک بر اساس وضعیت – با کنتراست تضمین‌شده */
function circleClass(index: number): string {
  switch (props.status(index)) {
    case 'active':
      // دایره‌ی پر سبز سازمانی – عدد سفید واضح + تفکیک ظریف از حالت انجام‌شده
      return 'bg-green-700 border-green-700 text-white ring-4 ring-green-600/15 scale-105'
    case 'done':
      // دایره‌ی پر سبز – تیک سفید واضح
      return 'bg-green-700 border-green-700 text-white'
    case 'error':
      // دایره‌ی پر قرمز – هشدار سفید واضح
      return 'bg-red-600 border-red-600 text-white'
    default:
      // دایره‌ی خاموش – متن خاکستری خوانا روی زمینه‌ی روشن/تیره
      return 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
  }
}

/** کلاس نشان پایانی (جمع‌بندی) */
function finalClass(): string {
  if (!props.finalStep) return ''
  return props.currentIndex >= props.steps.length
    ? 'bg-green-700 border-green-700 text-white ring-4 ring-green-600/15 scale-105'
    : 'bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
}

/** فقط بخش‌های رسیده‌شده (به‌ترتیب) قابل کلیک هستند؛ پرش به جلو ممنوع */
function isNavigable(index: number): boolean {
  return index <= props.maxReachable
}

/** تبدیل ارقام لاتین به فارسی */
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
function fa(n: number | string): string {
  return String(n).replace(/\d/g, d => FA_DIGITS[+d])
}

/** عنوان بخش جاری برای نمای موبایل (استراتژیک یا پایانی) */
const mobileTitle = computed(() =>
  props.currentIndex < props.steps.length
    ? props.steps[props.currentIndex]?.title ?? ''
    : props.finalStep?.title ?? ''
)
</script>

<template>
  <div class="w-full">
    <!-- دسکتاپ -->
    <ol class="hidden md:flex items-start justify-between relative">
      <li
        v-for="(step, i) in steps"
        :key="step.id"
        class="relative flex-1 flex flex-col items-center text-center group"
      >
        <!-- خط اتصال -->
        <div
          v-if="i < steps.length - 1 || finalStep"
          class="absolute top-5 left-0 w-1/2 h-px transition-colors duration-500"
          :class="i < currentIndex ? 'bg-green-700' : 'bg-slate-200 dark:bg-slate-700'"
        />
        <div
          v-if="i > 0"
          class="absolute top-5 right-0 w-1/2 h-px transition-colors duration-500"
          :class="i <= currentIndex ? 'bg-green-700' : 'bg-slate-200 dark:bg-slate-700'"
        />

        <button
          type="button"
          :disabled="!isNavigable(i)"
          class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25 disabled:cursor-not-allowed"
          :class="[circleClass(i), isNavigable(i) ? 'cursor-pointer' : 'cursor-not-allowed opacity-70']"
          :aria-current="status(i) === 'active' ? 'step' : undefined"
          :aria-disabled="!isNavigable(i)"
          :title="isNavigable(i) ? step.title : 'برای دسترسی به این بخش، ابتدا بخش‌های قبلی را تکمیل کنید'"
          :aria-label="`${step.title} – بخش ${i + 1}`"
          @click="emit('select', i)"
        >
          <!-- تیک (انجام‌شده) -->
          <svg v-if="status(i) === 'done'" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <!-- هشدار (خطا) -->
          <svg v-else-if="status(i) === 'error'" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <span v-else class="text-inherit">{{ i + 1 }}</span>
        </button>

        <!-- فقط عنوان دسته – بدون زیرنویس «بخش X» -->
        <span
          class="mt-2.5 text-[11px] lg:text-xs font-bold transition-colors leading-5 px-1"
          :class="status(i) === 'active' ? 'text-slate-900 dark:text-white' : status(i) === 'pending' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'"
        >
          {{ step.title }}
        </span>
      </li>

      <!-- نشان پایانی: نظرات و جمع‌بندی (بدون شماره، متمایز) -->
      <li v-if="finalStep" class="relative flex-1 flex flex-col items-center text-center group">
        <div
          class="absolute top-5 right-0 w-1/2 h-px transition-colors duration-500"
          :class="currentIndex >= steps.length - 1 && steps.length > 0 ? 'bg-green-700' : 'bg-slate-200 dark:bg-slate-700'"
        />

        <button
          type="button"
          :disabled="!isNavigable(steps.length)"
          class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25 disabled:cursor-not-allowed"
          :class="[finalClass(), isNavigable(steps.length) ? 'cursor-pointer' : 'cursor-not-allowed opacity-70']"
          :aria-current="currentIndex >= steps.length ? 'step' : undefined"
          :aria-disabled="!isNavigable(steps.length)"
          :title="isNavigable(steps.length) ? finalStep.title : 'برای دسترسی به این بخش، ابتدا بخش‌های قبلی را تکمیل کنید'"
          :aria-label="finalStep.title"
          @click="emit('select', steps.length)"
        >
          <!-- آیکون جمع‌بندی -->
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="m9 14 2 2 4-4" />
          </svg>
        </button>

        <!-- فقط عنوان – بدون زیرنویس «پایانی» -->
        <span
          class="mt-2.5 text-[11px] lg:text-xs font-bold transition-colors leading-5 px-1"
          :class="currentIndex >= steps.length ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ finalStep.title }}
        </span>
      </li>
    </ol>

    <!-- موبایل -->
    <div class="md:hidden">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-green-700 border-green-700 text-white"
          >
            <svg v-if="currentIndex >= steps.length" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
            <template v-else>{{ currentIndex + 1 }}</template>
          </span>
          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ mobileTitle }}</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              بخش {{ fa(currentIndex + 1) }} از {{ fa(steps.length + (finalStep ? 1 : 0)) }}
            </p>
          </div>
        </div>
        <span class="text-xs font-bold text-green-700 dark:text-green-500">{{ fa(progress) }}٪</span>
      </div>
      <div class="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          class="h-full rounded-full bg-green-700 transition-all duration-500 ease-out"
          :style="{ width: progress + '%' }"
        />
      </div>
    </div>
  </div>
</template>
