<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * گروه امتیازدهی داینامیک – طیف عددی بین range_min و range_max
 * (مثلاً ۰ تا ۱۰، ۱ تا ۱۰، یا بازه‌های منفی مثل ۲۰- تا ۲۰+).
 * هر دو سر بازه و مقادیر میانی به‌صورت دکمه رندر می‌شوند؛ برای بازه‌های پهن
 * چیدمان فشرده + اسکرول افقی فعال می‌شود.
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

function toneClass(n: number, selected: boolean) {
  const v = hover.value ?? props.modelValue
  const filled = v !== null && v !== undefined && rangeContains(n, v)
  if (!filled) {
    return 'bg-white dark:bg-slate-900 border-muted-300 dark:border-muted-700 text-muted-500 dark:text-muted-400 hover:border-primary-400 hover:text-primary-600'
  }
  const span = hi.value - lo.value || 1
  const ratio = (n - lo.value) / span
  const tone =
    ratio <= 0.3
      ? 'from-rose-500 to-rose-400 border-rose-500'
      : ratio <= 0.5
        ? 'from-amber-500 to-amber-400 border-amber-500'
        : ratio <= 0.7
          ? 'from-lime-500 to-lime-400 border-lime-500'
          : 'from-green-600 to-green-500 border-green-600'
  return `bg-gradient-to-br ${tone} text-white shadow-md ${selected ? 'scale-110 ring-4 ring-primary-500/20' : ''}`
}

/** آیا مقدار انتخاب‌شده در بازه‌ی hover قرار می‌گیرد؟ (پر شدن بازه‌ای) */
function rangeContains(n: number, v: number) {
  return Math.abs(n - v) < 0.5
}

const activeLabel = computed(() => {
  const v = hover.value ?? props.modelValue
  if (v === null || v === undefined) return ''
  const span = hi.value - lo.value || 1
  const ratio = (v - lo.value) / span
  if (ratio <= 0.2) return 'خیلی ضعیف'
  if (ratio <= 0.4) return 'ضعیف'
  if (ratio <= 0.6) return 'متوسط'
  if (ratio <= 0.8) return 'خوب'
  return 'عالی'
})

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
        class="flex items-center rounded-xl p-2 sm:p-3 border transition-colors gap-1"
        :class="[
          compact ? 'min-w-max' : 'w-full justify-between gap-0.5',
          invalid ? 'border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-900/10' : 'border-transparent'
        ]"
        dir="ltr"
      >
        <button
          v-for="n in items"
          :key="n"
          type="button"
          role="radio"
          :aria-checked="modelValue === n"
          :aria-label="`${n} از ${max}`"
          :tabindex="modelValue === n || (modelValue === null && n === lo) ? 0 : -1"
          class="aspect-square rounded-lg border-2 font-bold transition-all duration-150 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
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

    <div class="flex items-center justify-between px-3 mt-1 text-[11px] sm:text-xs text-muted-500 dark:text-muted-400" dir="rtl">
      <span>{{ labels?.min ?? lo }}</span>
      <Transition name="fade" mode="out-in">
        <span
          v-if="activeLabel"
          :key="activeLabel"
          class="font-bold text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30"
        >
          {{ activeLabel }}
        </span>
      </Transition>
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
