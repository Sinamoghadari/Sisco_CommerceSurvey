<script setup lang="ts">
import { computed } from 'vue'
import type { NormalizedOption } from '~/composables/CommerceSurvey/useSurveyApi'
import { optionTextKey } from '~/composables/CommerceSurvey/useSurveyWizard'

/**
 * گروه انتخاب – تک‌انتخابی (single_choice) یا چندانتخابی (multiple_choice)
 * با گزینه‌های نرمال‌شده‌ی سرویس (رشته یا شیء).
 * گزینه‌های دارای need_text با انتخاب شدن، یک ورودی متنی توضیح باز می‌کنند
 * که مقدار آن در نگه‌دارنده‌ی optionTexts (کلید: optionTextKey) ذخیره می‌شود.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string | string[] | null
    options: NormalizedOption[]
    multiple?: boolean
    invalid?: boolean
    /** نگه‌دارنده‌ی توضیح متنی گزینه‌ها (کلید: optionTextKey) */
    optionTexts?: Record<string, string>
    /** پیشوند کلید (شناسه سؤال برای پاسخ اصلی، `{id}__fu` برای سؤال تکمیلی) */
    optionKeyPrefix?: string
    /** برچسب ورودی توضیح (پیش‌فرض: «توضیح خود را بنویسید») */
    needTextPlaceholder?: string
  }>(),
  {
    multiple: false,
    invalid: false,
    optionTexts: () => ({}),
    optionKeyPrefix: '',
    needTextPlaceholder: 'توضیح خود را بنویسید...'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | string[]): void
  (e: 'option-text', key: string, text: string): void
}>()

const selected = computed<string[]>(() => {
  if (props.modelValue === null || props.modelValue === undefined) return []
  return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
})

function isChecked(value: string) {
  return selected.value.includes(value)
}

function toggle(value: string) {
  if (props.multiple) {
    const set = new Set(selected.value)
    if (set.has(value)) set.delete(value)
    else set.add(value)
    emit('update:modelValue', Array.from(set))
  } else {
    emit('update:modelValue', value)
  }
}

/** گزینه‌های نیازمند توضیح متنی که در حال حاضر انتخاب شده‌اند */
const activeNeedTextOptions = computed<NormalizedOption[]>(() => {
  if (!props.optionKeyPrefix) return []
  return props.options.filter(o => o.needText && isChecked(o.value))
})

function textValue(option: NormalizedOption): string {
  return props.optionTexts?.[optionTextKey(props.optionKeyPrefix, option.value)] ?? ''
}

function onOptionText(option: NormalizedOption, event: Event) {
  emit('option-text', optionTextKey(props.optionKeyPrefix, option.value), (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div
    class="space-y-3"
    :class="invalid ? 'rounded-lg ring-1 ring-red-300 dark:ring-red-800 bg-red-50/50 dark:bg-red-900/10 p-1.5' : ''"
    :role="multiple ? 'group' : 'radiogroup'"
  >
    <button
      v-for="opt in options"
      :key="opt.id"
      type="button"
      :role="multiple ? 'checkbox' : 'radio'"
      :aria-checked="isChecked(opt.value)"
      class="group w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-right transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25"
      :class="
        isChecked(opt.value)
          ? 'border-green-700 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/60'
      "
      @click="toggle(opt.value)"
    >
      <span
        class="flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all duration-200"
        :class="[
          multiple ? 'rounded-[4px]' : 'rounded-full',
          isChecked(opt.value)
            ? 'border-green-700 bg-green-700 text-white'
            : 'border-slate-300 dark:border-slate-600 group-hover:border-green-600'
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

    <!-- ورودی متنی تکمیلی برای گزینه‌های دارای need_text -->
    <TransitionGroup v-if="activeNeedTextOptions.length" name="needtext" tag="div" class="space-y-3">
      <div
        v-for="opt in activeNeedTextOptions"
        :key="`needtext-${opt.id}`"
        class="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 p-3.5"
      >
        <label :for="`needtext-${optionKeyPrefix}-${opt.id}`" class="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          توضیح برای «{{ opt.label }}»
        </label>
        <textarea
          :id="`needtext-${optionKeyPrefix}-${opt.id}`"
          rows="2"
          :value="textValue(opt)"
          :placeholder="needTextPlaceholder"
          class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm leading-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-600/20 focus:border-green-700 resize-y"
          @input="onOptionText(opt, $event)"
        />
      </div>
    </TransitionGroup>
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
.needtext-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.needtext-leave-active {
  transition: all 0.15s ease;
}
.needtext-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.needtext-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
