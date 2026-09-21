<script setup lang="ts">
import { computed, ref } from 'vue'
import { RATING_SCALE } from '~/composables/Sisco_CommerceSurvey/useSurveyDefinition'

/**
 * گروه امتیازدهی – برای مقیاس ۱ تا ۵ (rating) و ۱ تا ۱۰ (score)
 */
const props = withDefaults(
  defineProps<{
    modelValue: number | null
    max?: 5 | 10
    labels?: { min: string; max: string }
    invalid?: boolean
    name?: string
  }>(),
  { max: 5, invalid: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

const hover = ref<number | null>(null)
const items = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

const activeLabel = computed(() => {
  const v = hover.value ?? props.modelValue
  if (!v) return ''
  if (props.max === 5) return RATING_SCALE.find(s => s.value === v)?.label ?? ''
  if (v <= 3) return 'ناراضی'
  if (v <= 6) return 'متوسط'
  if (v <= 8) return 'راضی'
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
    ratio <= 0.4
      ? 'from-rose-500 to-rose-400 border-rose-500'
      : ratio <= 0.6
        ? 'from-amber-500 to-amber-400 border-amber-500'
        : ratio <= 0.8
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
      class="flex items-center justify-between gap-1.5 sm:gap-2.5 rounded-xl p-2 sm:p-3 border transition-colors"
      :class="invalid ? 'border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-900/10' : 'border-transparent'"
      dir="rtl"
    >
      <button
        v-for="n in items"
        :key="n"
        type="button"
        role="radio"
        :aria-checked="modelValue === n"
        :tabindex="modelValue === n || (!modelValue && n === 1) ? 0 : -1"
        class="flex-1 aspect-square max-w-[52px] rounded-xl border-2 font-bold text-sm sm:text-base transition-all duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
        :class="toneClass(n, modelValue === n)"
        @mouseenter="hover = n"
        @mouseleave="hover = null"
        @click="emit('update:modelValue', n)"
      >
        {{ n }}
      </button>
    </div>

    <div class="flex items-center justify-between px-3 mt-1 text-[11px] sm:text-xs text-muted-500 dark:text-muted-400">
      <span>{{ labels?.min ?? 'خیلی ضعیف' }}</span>
      <Transition name="fade" mode="out-in">
        <span
          v-if="activeLabel"
          :key="activeLabel"
          class="font-bold text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30"
        >
          {{ activeLabel }}
        </span>
      </Transition>
      <span>{{ labels?.max ?? 'عالی' }}</span>
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
