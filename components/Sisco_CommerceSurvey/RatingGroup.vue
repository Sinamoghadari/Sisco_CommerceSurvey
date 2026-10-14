<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * گروه امتیازدهی داینامیک – طیف عددی بین range_min و range_max
 * (مثلاً ۰ تا ۱۰، ۱ تا ۱۰، یا بازه‌های منفی مثل ۲۰- تا ۲۰+).
 * چیدمان راست‌به‌چپ (RTL): کمترین مقدار (range_min) در سمت راست و
 * بیشترین مقدار (range_max) در سمت چپ قرار می‌گیرد.
 * برای بازه‌های پهن چیدمان فشرده + اسکرول افقی فعال می‌شود.
 */
const props = withDefaults(
  defineProps<{
    modelValue: number | null
    min: number
    max: number
    invalid?: boolean
    name?: string
    /** برچسب دو سر طیف (پیش‌فرض: خود اعداد بازه) */
    labels?: { min: string; max: string }
  }>(),
  { invalid: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

const hover = ref<number | null>(null)

const lo = computed(() => Math.ceil(Math.min(props.min, props.max)))
const hi = computed(() => Math.floor(Math.max(props.min, props.max)))

/** تمام اعداد صحیح بازه (از min تا max) */
const items = computed<number[]>(() => {
  const out: number[] = []
  for (let n = lo.value; n <= hi.value; n++) out.push(n)
  return out
})

/** بازه‌های پهن (بیش از ۱۵ گزینه) به چیدمان فشرده با اسکرول افقی نیاز دارند */
const compact = computed(() => items.value.length > 15)

/**
 * ظاهر صنعتی/سازمانی: خانه‌های پرشده سبز سازمانی یکدست (بدون گرادیان
 * رنگین‌کمانی)، متن سفید با کنتراست بالا و حلقه‌ی ظریف برای مقدار انتخابی.
 */
function toneClass(n: number, selected: boolean) {
  const v = hover.value ?? props.modelValue
  const filled = v !== null && v !== undefined && rangeContains(n, v)
  if (!filled) {
    return 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-green-600 hover:text-green-700 dark:hover:text-green-500'
  }
  return `bg-green-700 border-green-700 text-white ${selected ? 'ring-2 ring-green-600/25 scale-105' : ''}`
}

/** آیا مقدار انتخاب‌شده در بازه‌ی hover قرار می‌گیرد؟ (پر شدن بازه‌ای) */
function rangeContains(n: number, v: number) {
  return Math.abs(n - v) < 0.5
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
    <div class="overflow-x-auto pb-1 -mx-1 px-1">
      <div
        class="flex items-center rounded-lg p-2 sm:p-2.5 border transition-colors gap-1"
        :class="[
          compact ? 'min-w-max' : 'w-full justify-between gap-0.5',
          invalid ? 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40'
        ]"
        dir="rtl"
      >
        <button
          v-for="n in items"
          :key="n"
          type="button"
          role="radio"
          :aria-checked="modelValue === n"
          :aria-label="`${n} از ${max}`"
          :tabindex="modelValue === n || (modelValue === null && n === lo) ? 0 : -1"
          class="aspect-square rounded-md border-2 font-bold transition-all duration-150 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25"
          :class="[
            compact ? 'w-8 h-8 sm:w-9 sm:h-9 shrink-0 text-[11px] sm:text-xs' : 'flex-1 max-w-[46px] text-xs sm:text-sm',
            toneClass(n, modelValue === n)
          ]"
          @mouseenter="hover = n"
          @mouseleave="hover = null"
          @click="emit('update:modelValue', n)"
        >
          {{ n }}
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between px-3 mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium" dir="rtl">
      <span>{{ labels?.min ?? lo }}</span>
      <span>{{ labels?.max ?? hi }}</span>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(3px);
}
</style>
