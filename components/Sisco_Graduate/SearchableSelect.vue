<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  CUSTOM_OPTION_LABEL,
  CUSTOM_OPTION_VALUE,
  filterSelectOptions,
  type SelectOption,
} from '~/composables/Sisco_Graduate/useEducationRecords'

/**
 * فیلد انتخابی تک‌مقداری با قابلیت جستجو.
 * - با تایپ کردن همان لحظه فیلتر می‌شود.
 * - فهرست نتایج محدود و اسکرول‌شو است و صفحه را باز نمی‌کند.
 * - گزینه‌ی «سایر» همیشه در پایین فهرست در دسترس است.
 */
const props = withDefaults(defineProps<{
  /** شناسه‌ی input برای اتصال label */
  id: string
  /** مقدار انتخاب‌شده (یا CUSTOM_OPTION_VALUE برای «سایر») */
  modelValue: string
  /** گزینه‌های مجاز */
  options: SelectOption[]
  /** کلاس‌های ظاهری input که از فرم گرفته می‌شود */
  inputClass?: string | string[]
  /** متن راهنمای فیلد */
  placeholder?: string
  /** آیا فیلد خطا دارد؟ */
  hasError?: boolean
  /** شناسه‌ی متن خطا برای aria-describedby */
  errorId?: string
}>(), {
  inputClass: '',
  placeholder: 'جستجو کنید…',
  hasError: false,
  errorId: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/** حداکثر تعداد نتایج نمایش‌داده‌شده؛ بقیه از طریق جستجوی دقیق‌تر پیدا می‌شوند */
const MAX_VISIBLE_RESULTS = 50

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)
/** جلوگیری از باز شدن دوباره‌ی فهرست هنگام بازگرداندن فوکوس بعد از انتخاب */
const suppressNextFocusOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  if (props.modelValue === CUSTOM_OPTION_VALUE) {
    return CUSTOM_OPTION_LABEL
  }
  return props.options.find(option => option.value === props.modelValue)?.label ?? ''
})

const matches = computed(() => filterSelectOptions(props.options, query.value))

const visibleOptions = computed(() => matches.value.slice(0, MAX_VISIBLE_RESULTS))

const hasHiddenMatches = computed(() => matches.value.length > MAX_VISIBLE_RESULTS)

const displayValue = computed(() => (isOpen.value ? query.value : selectedLabel.value))

const activeDescendant = computed(() => (isOpen.value && activeIndex.value >= 0
  ? `${props.id}-option-${activeIndex.value}`
  : undefined))

const listboxId = computed(() => `${props.id}-listbox`)

function openList() {
  if (isOpen.value || suppressNextFocusOpen.value) {
    return
  }
  isOpen.value = true
  query.value = ''
  activeIndex.value = -1
}

function closeList() {
  isOpen.value = false
  query.value = ''
  activeIndex.value = -1
}

function onInput(event: Event) {
  openList()
  query.value = (event.target as HTMLInputElement).value
  activeIndex.value = -1
}

function scrollActiveIntoView() {
  const container = wrapperRef.value?.querySelector<HTMLElement>('[role="listbox"]')
  const target = container?.querySelector<HTMLElement>(`[data-option-index="${activeIndex.value}"]`)
  if (container && target && typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ block: 'nearest' })
  }
}

function selectOption(value: string) {
  emit('update:modelValue', value)
  closeList()
  suppressNextFocusOpen.value = true
  inputRef.value?.focus()
  void nextTick(() => {
    suppressNextFocusOpen.value = false
  })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (isOpen.value) {
      event.preventDefault()
      event.stopPropagation()
      closeList()
    }
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openList()
    const total = visibleOptions.value.length
    if (total === 0) {
      activeIndex.value = -1
      return
    }
    activeIndex.value = event.key === 'ArrowDown'
      ? (activeIndex.value + 1) % total
      : (activeIndex.value <= 0 ? total - 1 : activeIndex.value - 1)
    void nextTick(scrollActiveIntoView)
    return
  }

  if (event.key === 'Enter') {
    if (!isOpen.value) {
      return
    }
    event.preventDefault()
    const option = visibleOptions.value[activeIndex.value]
    if (option) {
      selectOption(option.value)
    }
    else {
      closeList()
    }
  }
}

/** بستن فهرست وقتی فوکوس از محدوده‌ی فیلد خارج می‌شود */
function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && wrapperRef.value?.contains(next)) {
    return
  }
  closeList()
}

function onDocumentPointerDown(event: Event) {
  const target = event.target as Node | null
  if (target && wrapperRef.value?.contains(target)) {
    return
  }
  closeList()
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', onDocumentPointerDown, true)
  }
  else {
    document.removeEventListener('mousedown', onDocumentPointerDown, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentPointerDown, true)
})

/** برای انتقال فوکوس از فرم به این فیلد */
defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>

<template>
  <div ref="wrapperRef" class="relative" @focusout="onFocusOut">
    <input
      :id="id"
      ref="inputRef"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      :value="displayValue"
      :placeholder="placeholder"
      :class="[inputClass, 'pl-9']"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendant"
      :aria-invalid="hasError"
      :aria-describedby="hasError ? errorId : undefined"
      @focus="openList"
      @click="openList"
      @input="onInput"
      @keydown="onKeydown"
    >

    <span
      aria-hidden="true"
      class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-400 dark:text-muted-500"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>

    <div
      v-if="isOpen"
      class="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-muted-200 bg-white shadow-xl dark:border-muted-700 dark:bg-muted-900"
    >
      <ul
        :id="listboxId"
        role="listbox"
        class="max-h-56 overflow-y-auto py-1"
      >
        <li
          v-if="visibleOptions.length === 0"
          class="px-4 py-3 text-xs text-muted-500 dark:text-muted-400"
        >
          گزینه‌ای با این عنوان یافت نشد؛ در صورت نیاز «سایر» را انتخاب کنید.
        </li>

        <li
          v-for="(option, index) in visibleOptions"
          :id="`${id}-option-${index}`"
          :key="option.value"
          role="option"
          :data-option-index="index"
          :aria-selected="option.value === modelValue ? 'true' : 'false'"
          class="cursor-pointer px-4 py-2 text-sm text-muted-700 transition-colors dark:text-muted-200"
          :class="index === activeIndex
            ? 'bg-violet-50 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200'
            : 'hover:bg-muted-100 dark:hover:bg-muted-800'"
          @mousedown.prevent
          @click="selectOption(option.value)"
        >
          <span class="flex items-center justify-between gap-2">
            <span class="truncate">{{ option.label }}</span>
            <span
              v-if="option.hint"
              class="flex-shrink-0 text-[11px] text-muted-400 dark:text-muted-500"
            >
              {{ option.hint }}
            </span>
          </span>
        </li>

        <li
          v-if="hasHiddenMatches"
          class="px-4 pb-1 pt-0.5 text-[11px] text-muted-400 dark:text-muted-500"
        >
          برای دیدن نتایج بیشتر، عبارت جستجو را دقیق‌تر کنید.
        </li>
      </ul>

      <button
        type="button"
        class="flex w-full items-center gap-2 border-t border-muted-200 px-4 py-2.5 text-right text-sm font-medium text-violet-700 transition-colors hover:bg-violet-50 dark:border-muted-700 dark:text-violet-300 dark:hover:bg-violet-500/10"
        @mousedown.prevent
        @click="selectOption(CUSTOM_OPTION_VALUE)"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 flex-shrink-0"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {{ CUSTOM_OPTION_LABEL }}
      </button>
    </div>
  </div>
</template>
