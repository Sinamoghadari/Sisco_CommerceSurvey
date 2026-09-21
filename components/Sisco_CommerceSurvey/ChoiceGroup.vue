<script setup lang="ts">
import { computed } from 'vue'
import type { QuestionOption } from '~/composables/CommerceSurvey/useSurveyDefinition'

/**
 * گروه انتخاب – تک‌انتخابی (radio) یا چندانتخابی (checkbox) با ظاهر چیپ/کارت
 */
const props = withDefaults(
  defineProps<{
    modelValue: string | string[] | null
    options: QuestionOption[]
    multiple?: boolean
    invalid?: boolean
  }>(),
  { multiple: false, invalid: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: string | string[]): void }>()

const selected = computed<string[]>(() => {
  if (props.modelValue === null || props.modelValue === undefined) return []
  return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
})

function isChecked(v: string) {
  return selected.value.includes(v)
}

function toggle(v: string) {
  if (props.multiple) {
    const set = new Set(selected.value)
    set.has(v) ? set.delete(v) : set.add(v)
    emit('update:modelValue', Array.from(set))
  } else {
    emit('update:modelValue', v)
  }
}
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 rounded-xl p-1 transition-colors"
    :class="invalid ? 'ring-1 ring-red-300 dark:ring-red-800 bg-red-50/40 dark:bg-red-900/10' : ''"
    :role="multiple ? 'group' : 'radiogroup'"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :role="multiple ? 'checkbox' : 'radio'"
      :aria-checked="isChecked(opt.value)"
      class="group flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm text-right transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
      :class="
        isChecked(opt.value)
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
          : 'border-muted-200 dark:border-muted-700 bg-white dark:bg-slate-900 text-muted-700 dark:text-muted-200 hover:border-primary-300 hover:bg-primary-50/40'
      "
      @click="toggle(opt.value)"
    >
      <span
        class="flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all duration-200"
        :class="[
          multiple ? 'rounded-md' : 'rounded-full',
          isChecked(opt.value)
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-muted-300 dark:border-muted-600 group-hover:border-primary-400'
        ]"
      >
        <Transition name="pop">
          <svg v-if="isChecked(opt.value)" viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </Transition>
      </span>
      <span class="font-medium leading-6">{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.pop-enter-active {
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s ease;
}
.pop-enter-from {
  transform: scale(0.3);
  opacity: 0;
}
</style>
