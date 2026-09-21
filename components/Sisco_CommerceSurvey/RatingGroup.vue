<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * گروه امتیازدهی – طیف ۱ تا ۱۰ (لیکرت ۱۰ درجه‌ای)
 * پیکان‌های کیبورد و حالت hover با برچسب بازه‌ای پشتیبانی می‌شوند.
 */
const props = withDefaults(
  defineProps<{
    modelValue: number | null
    max?: number
    labels?: { min: string; max: string }
    invalid?: boolean
    name?: string
  }>(),
  { max: 10, invalid: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

const hover = ref<number | null>(null)
const items = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

/** برچسب بازه‌ی فعال (۱ تا ۱۰) */
const activeLabel = computed(() => {
  const v = hover.value ?? props.modelValue
  if (!v) return ''
  const ratio = v / props.max
  if (ratio <= 0.2) return 'ناراضی'
  if (ratio <= 0.4) return 'نسبتاً ناراضی'
  if (ratio <= 0.6) return 'متوسط'
  if (ratio <= 0.8) return 'راضی'
  return 'بسیار راضی'
})

function toneClass(n: number, selected: boolean) {
  const v = hover.value ?? props.modelValue ?? 0
  const filled = n <= v
  if (!filled) {
    return 'bg-white dark:bg-slate-900 border-muted-300 dark:border-muted-700 text-muted-500 dark:text-muted-400 hover:border-primary-400 hover:text-primary-600'
  }
  const ratio = n / props.max
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

function onKey(e: KeyboardEvent) {
  const v = props.modelValue ?? 0
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    emit('update:modelValue', Math.min(props.max, v + 1))
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    emit('update:modelValue', Math.max(1, v - 1))
  }
}
</script>

<template>
  <div class="w-full" role="radiogroup" :aria-label="name" @keydown="onKey">
    <div
      class="flex items-center justify-between gap-1 sm:gap-1.5 rounded-xl p-2 sm:p-3 border transition-colors"
      :class="invalid ? 'border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-900/10' : 'border-transparent'"
      dir="rtl"
    >
      <button
        v-for="n in items"
        :key="n"
        type="button"
        role="radio"
        :aria-checked="modelValue === n"
        :aria-label="`${n} از ${max}`"
        :tabindex="modelValue === n || (!modelValue && n === 1) ? 0 : -1"
        class="flex-1 aspect-square max-w-[46px] rounded-lg border-2 font-bold text-xs sm:text-sm transition-all duration-150 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
        :class="toneClass(n, modelValue === n)"
        @mouseenter="hover = n"
        @mouseleave="hover = null"
        @click="emit('update:modelValue', n)"
      >
        {{ n }}
      </button>
    </div>

    <div class="flex items-center justify-between px-3 mt-1 text-[11px] sm:text-xs text-muted-500 dark:text-muted-400">
      <span>{{ labels?.min ?? 'کاملاً ناراضی' }}</span>
      <Transition name="fade" mode="out-in">
        <span
          v-if="activeLabel"
          :key="activeLabel"
          class="font-bold text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30"
        >
          {{ activeLabel }}
        </span>
      </Transition>
      <span>{{ labels?.max ?? 'کاملاً راضی' }}</span>
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
