<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * امتیازدهی ستاره‌ای – تعداد ستاره‌ها به‌صورت داینامیک بین range_min و
 * range_max ساخته می‌شود (مثلاً ۰ تا ۵ ستاره).
 * - چیدمان راست‌به‌چپ: کمترین مقدار در سمت راست قرار می‌گیرد.
 * - پر شدن با طلایی/زرد و افکت نرم hover.
 * - اگر بازه شامل ۰ باشد، خانه‌ی «۰» (بدون امتیاز) به‌صورت عددی ابتدای طیف است.
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
const hi = computed(() => Math.floor(Math.max(props.min, props.max)))

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

function isSelected(n: number): boolean {
  return props.modelValue === n
}

function cellClass(n: number): string {
  const selected = isSelected(n)
  if (n === 0) {
    // خانه‌ی «۰» – بدون امتیاز
    if (props.modelValue === 0) {
      return 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/20 scale-110'
    }
    return 'border-muted-300 dark:border-muted-600 text-muted-400 hover:border-amber-400 hover:text-amber-500'
  }
  if (isFilled(n)) {
    return `border-amber-400 text-amber-400 ${selected ? 'scale-110 drop-shadow-[0_2px_6px_rgba(245,158,11,0.45)]' : ''}`
  }
  return 'border-muted-200 dark:border-muted-700 text-muted-300 dark:text-muted-600 hover:text-amber-300 hover:border-amber-300'
}

function onKey(e: KeyboardEvent) {
  const v = props.modelValue ?? hover.value ?? lo.value
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    emit('update:modelValue', Math.min(hi.value, v + 1))
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    emit('update:modelValue', Math.max(lo.value, v - 1))
  }
}
</script>

<template>
  <div class="w-full" role="radiogroup" :aria-label="name" @keydown="onKey">
    <div
      class="flex items-center gap-1.5 rounded-xl p-2.5 border transition-colors w-fit max-w-full"
      :class="invalid ? 'border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-900/10' : 'border-transparent'"
      dir="rtl"
    >
      <!-- خانه‌ی صفر (در صورت وجود در بازه) -->
      <button
        v-if="hasZeroCell"
        type="button"
        role="radio"
        :aria-checked="modelValue === 0"
        aria-label="بدون امتیاز"
        :tabindex="modelValue === 0 || modelValue === null ? 0 : -1"
        class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-150 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/30"
        :class="cellClass(0)"
        @mouseenter="hover = 0"
        @mouseleave="hover = null"
        @click="emit('update:modelValue', 0)"
      >
        {{ lo }}
      </button>

      <span v-if="hasZeroCell" class="w-px h-6 bg-muted-200 dark:bg-muted-700 mx-0.5" aria-hidden="true" />

      <!-- ستاره‌ها -->
      <button
        v-for="n in starValues"
        :key="n"
        type="button"
        role="radio"
        :aria-checked="modelValue === n"
        :aria-label="`${n} ستاره`"
        :tabindex="modelValue === n || (modelValue === null && n === Math.max(1, lo)) ? 0 : -1"
        class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-150 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/30 star-cell"
        :class="[cellClass(n), isFilled(n) ? 'star-filled' : '']"
        @mouseenter="hover = n"
        @mouseleave="hover = null"
        @click="emit('update:modelValue', n)"
      >
        <Icon icon="lucide:star" class="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </div>

    <p v-if="invalid" class="flex items-center gap-1.5 text-xs text-red-500 mt-2">
      <Icon icon="lucide:alert-circle" class="w-4 h-4" />
      انتخاب امتیاز الزامی است.
    </p>
  </div>
</template>

<style scoped>
/* پر کردن ستاره‌ی lucide (خطی) با رنگ طلایی جاری هنگام انتخاب/hover */
.star-cell svg {
  fill: transparent;
  transition: fill 0.15s ease;
}
.star-filled svg {
  fill: currentColor;
}
</style>
