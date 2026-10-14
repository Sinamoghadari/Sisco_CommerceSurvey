<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * امتیازدهی ستاره‌ای – تعداد ستاره‌ها به‌صورت داینامیک بین range_min و
 * range_max ساخته می‌شود (مثلاً ۰ تا ۵ ستاره).
 * - ستاره‌ها با SVG درون‌خطی (بدون وابستگی به کامپوننت Icon یا مجموعه آیکون)
 *   رندر می‌شوند تا در هیچ محیطی خالی نمانند.
 * - چیدمان راست‌به‌چپ: خانه‌ی «۰» و کمترین مقدار سمت راست، بیشترین مقدار چپ.
 * - پر شدن با طلایی/کهربایی گرم (amber) و پیش‌نمایش hover.
 * - انتخاب ۰: از طریق خانه‌ی صفر یا کلیک دوباره روی اولین ستاره‌ی انتخاب‌شده.
 */
const props = withDefaults(
  defineProps<{
    modelValue: number | null
    min: number
    max: number
    invalid?: boolean
    name?: string
  }>(),
  { invalid: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

const hover = ref<number | null>(null)

const lo = computed(() => Math.ceil(Math.min(props.min, props.max)))
const hiRaw = computed(() => Math.floor(Math.max(props.min, props.max)))

/** سقف مؤثر طیف: بازه‌ی degenerate (مثلاً ۰ تا ۰) حداقل یک ستاره دارد */
const hi = computed(() => {
  const floor = Math.max(1, lo.value)
  return hiRaw.value >= floor ? hiRaw.value : floor
})

/** آیا بازه شامل مقدار ۰ است؟ (نمایش خانه‌ی «بدون امتیاز») */
const hasZeroCell = computed(() => lo.value <= 0 && hi.value >= 0)

/** مقادیر ستاره‌ای (حداقل ۱) تا سقف بازه */
const starValues = computed<number[]>(() => {
  const start = Math.max(1, lo.value)
  const out: number[] = []
  for (let n = start; n <= hi.value; n++) out.push(n)
  return out
})

const effective = computed(() => hover.value ?? props.modelValue)

function isFilled(n: number): boolean {
  const v = effective.value
  return typeof v === 'number' && n > 0 && n <= v
}

/** مسیر ستاره‌ی پنج‌پر 24x24 – مشترک بین همه‌ی ستاره‌ها */
const STAR_PATH = 'M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.58l-5.9 3.1 1.13-6.58L4.45 9.44l6.6-.96L12 2.5z'

/**
 * انتخاب مقدار:
 *  - کلیک روی ستاره‌ی انتخاب‌شده‌ی اول (۱) آن را پاک می‌کند و به ۰ برمی‌گرداند.
 *  - سایر ستاره‌ها مقدار خودشان را تنظیم می‌کنند.
 */
function select(n: number) {
  if (props.modelValue === n && n === 1 && hasZeroCell.value) {
    emit('update:modelValue', 0)
    return
  }
  emit('update:modelValue', n)
}

function onKey(e: KeyboardEvent) {
  const v = props.modelValue ?? hover.value ?? lo.value
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    emit('update:modelValue', Math.min(hi.value, v + 1))
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    emit('update:modelValue', Math.max(hasZeroCell.value ? 0 : lo.value, v - 1))
  }
}
</script>

<template>
  <div class="w-full" role="radiogroup" :aria-label="name" @keydown="onKey">
    <div
      class="flex items-center gap-1 rounded-lg border p-2 transition-colors w-fit max-w-full"
      :class="invalid ? 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40'"
      dir="rtl"
    >
      <!-- خانه‌ی صفر (بدون امتیاز) – ابتدای طیف در سمت راست -->
      <button
        v-if="hasZeroCell"
        type="button"
        role="radio"
        :aria-checked="modelValue === 0"
        aria-label="بدون امتیاز (۰)"
        :tabindex="modelValue === 0 || modelValue === null ? 0 : -1"
        class="h-9 w-9 sm:h-10 sm:w-10 rounded-md border flex items-center justify-center text-sm font-bold leading-none transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/25"
        :class="
          modelValue === 0
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-amber-400 hover:text-amber-600'
        "
        @mouseenter="hover = 0"
        @mouseleave="hover = null"
        @click="emit('update:modelValue', 0)"
      >
        0
      </button>

      <span v-if="hasZeroCell" class="w-px h-7 bg-slate-200 dark:bg-slate-700 mx-0.5" aria-hidden="true" />

      <!-- ستاره‌ها: SVG درون‌خطی با fill صریح (مستقل از Icon/CSS) -->
      <button
        v-for="n in starValues"
        :key="n"
        type="button"
        role="radio"
        :aria-checked="modelValue === n"
        :aria-label="`${n} ستاره`"
        :tabindex="modelValue === n || (modelValue === null && n === Math.max(1, lo)) ? 0 : -1"
        class="w-10 h-10 sm:w-11 sm:h-11 rounded-md flex items-center justify-center transition-transform duration-150 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/25 hover:scale-105"
        @mouseenter="hover = n"
        @mouseleave="hover = null"
        @click="select(n)"
      >
        <svg
          viewBox="0 0 24 24"
          class="w-7 h-7 sm:w-8 sm:h-8"
          aria-hidden="true"
        >
          <path
            :d="STAR_PATH"
            :fill="isFilled(n) ? '#fbbf24' : '#f8fafc'"
            :stroke="isFilled(n) ? '#d97706' : '#cbd5e1'"
            stroke-width="1.4"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <p v-if="invalid" class="text-xs text-red-600 dark:text-red-400 mt-2">
      لطفاً به این سوال پاسخ دهید.
    </p>
  </div>
</template>
