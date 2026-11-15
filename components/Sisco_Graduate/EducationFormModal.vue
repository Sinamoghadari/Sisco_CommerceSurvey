<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { DatePicker } from 'v-calendars'
import 'v-calendars/dist/style.css'
import FormFieldError from '~/components/Sisco_Graduate/FormFieldError.vue'
import SearchableSelect from '~/components/Sisco_Graduate/SearchableSelect.vue'
import {
  ATTACHMENT_ACCEPT,
  EDUCATION_CITY_OPTIONS,
  EDUCATION_LEVELS,
  REQUIRED_ATTACHMENT_MESSAGE,
  STUDY_FIELD_OPTIONS,
  createEducationRecordId,
  isCustomOption,
  isValidGpa,
  isValidPersianParagraph,
  isValidPersianText,
  normalizePersianText,
  resolveOptionValue,
  sanitizeGpaInput,
  validateAttachmentFile,
  type EducationLevel,
  type EducationRecord,
} from '~/composables/Sisco_Graduate/useEducationRecords'

/**
 * مودال «افزودن اطلاعات تحصیلی»
 * فقط فرم و اعتبارسنجی سمت کلاینت؛ هیچ فایلی بارگذاری و هیچ داده‌ای ارسال نمی‌شود.
 */
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', record: EducationRecord): void
}>()

type FieldKey
  = 'city'
    | 'cityCustom'
    | 'level'
    | 'field'
    | 'fieldCustom'
    | 'graduationDate'
    | 'institution'
    | 'gpa'
    | 'description'
    | 'attachment'

/** الگوی تاریخ، هم‌سو با الگوی date-picker موجود در پروژه */
const datePickerMasks = { input: 'YYYY-MM-DD' }

const form = reactive({
  /** شهر تحصیل؛ یا یکی از شهرهای دیتاست یا گزینه‌ی «سایر» */
  city: '',
  cityCustom: '',
  level: '' as EducationLevel | '',
  /** رشته تحصیلی؛ یا یکی از رشته‌های دیتاست یا گزینه‌ی «سایر» */
  field: '',
  fieldCustom: '',
  graduationDate: null as Date | null,
  institution: '',
  gpa: '',
  description: '',
})

const attachment = ref<File | null>(null)
const attachmentError = ref('')
const attempted = ref(false)
const touched = reactive<Record<FieldKey, boolean>>({
  city: false,
  cityCustom: false,
  level: false,
  field: false,
  fieldCustom: false,
  graduationDate: false,
  institution: false,
  gpa: false,
  description: false,
  attachment: false,
})

const PERSIAN_ONLY_MESSAGE = 'باید فقط با حروف فارسی، فاصله و نیم‌فاصله نوشته شود؛ حروف لاتین و اعداد مجاز نیستند.'

const validationErrors = computed<Record<FieldKey, string>>(() => {
  const errors: Record<FieldKey, string> = {
    city: '',
    cityCustom: '',
    level: '',
    field: '',
    fieldCustom: '',
    graduationDate: '',
    institution: '',
    gpa: '',
    description: '',
    attachment: attachmentError.value || (attachment.value ? '' : REQUIRED_ATTACHMENT_MESSAGE),
  }

  if (!form.city) {
    errors.city = 'انتخاب شهر تحصیل الزامی است.'
  }
  else if (isCustomOption(form.city)) {
    const customCity = normalizePersianText(form.cityCustom)
    if (!customCity) {
      errors.cityCustom = 'نام شهر تحصیل را وارد کنید.'
    }
    else if (!isValidPersianText(customCity)) {
      errors.cityCustom = `شهر تحصیل ${PERSIAN_ONLY_MESSAGE}`
    }
  }

  if (!form.level) {
    errors.level = 'انتخاب مقطع تحصیلی الزامی است.'
  }

  if (!form.field) {
    errors.field = 'انتخاب رشته تحصیلی الزامی است.'
  }
  else if (isCustomOption(form.field)) {
    const customField = normalizePersianText(form.fieldCustom)
    if (!customField) {
      errors.fieldCustom = 'نام رشته تحصیل را وارد کنید.'
    }
    else if (!isValidPersianText(customField)) {
      errors.fieldCustom = `رشته تحصیل ${PERSIAN_ONLY_MESSAGE}`
    }
  }

  if (!form.graduationDate) {
    errors.graduationDate = 'تاریخ پایان تحصیلی الزامی است.'
  }

  if (!form.institution.trim()) {
    errors.institution = 'موسسه آموزشی الزامی است.'
  }

  // معدل اختیاری است؛ فقط در صورت وارد شدن مقدار، قالب عددی بررسی می‌شود.
  const gpaValue = form.gpa.trim()
  if (gpaValue && !isValidGpa(gpaValue)) {
    errors.gpa = 'معدل باید عددی با حداکثر دو رقم اعشار باشد.'
  }

  if (form.description.trim() && !isValidPersianParagraph(form.description)) {
    errors.description = `توضیحات ${PERSIAN_ONLY_MESSAGE}`
  }

  return errors
})

/** پیام خطایی که باید نمایش داده شود (پس از لمس فیلد یا تلاش برای ثبت) */
function errorFor(key: FieldKey): string {
  if (!attempted.value && !touched[key]) {
    return ''
  }
  return validationErrors.value[key]
}

const baseFieldClass
  = 'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-muted-700 shadow-sm transition-colors placeholder:text-muted-400 focus:outline-none focus:ring-2 dark:bg-muted-900 dark:text-muted-100 dark:placeholder:text-muted-500'

function fieldClass(hasError: boolean): string[] {
  return [
    baseFieldClass,
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30 dark:border-red-500/70'
      : 'border-muted-300 focus:border-primary-500 focus:ring-primary-500/30 dark:border-muted-700',
  ]
}

/* -------------------------------------------------------------------------- */
/* ارجاع به کنترل‌ها برای مدیریت فوکوس                                        */
/* -------------------------------------------------------------------------- */

const modalRef = ref<HTMLElement | null>(null)
const citySelectRef = ref<{ focus: () => void } | null>(null)
const cityCustomRef = ref<HTMLInputElement | null>(null)
const levelSelectRef = ref<HTMLSelectElement | null>(null)
const fieldSelectRef = ref<{ focus: () => void } | null>(null)
const fieldCustomRef = ref<HTMLInputElement | null>(null)
const dateInputRef = ref<HTMLInputElement | null>(null)
const institutionInputRef = ref<HTMLInputElement | null>(null)
const gpaInputRef = ref<HTMLInputElement | null>(null)
const descriptionRef = ref<HTMLTextAreaElement | null>(null)
const attachmentInputRef = ref<HTMLInputElement | null>(null)

const focusTargets: Array<[FieldKey, () => void]> = [
  ['city', () => citySelectRef.value?.focus()],
  ['cityCustom', () => cityCustomRef.value?.focus()],
  ['level', () => levelSelectRef.value?.focus()],
  ['field', () => fieldSelectRef.value?.focus()],
  ['fieldCustom', () => fieldCustomRef.value?.focus()],
  ['graduationDate', () => dateInputRef.value?.focus()],
  ['institution', () => institutionInputRef.value?.focus()],
  ['gpa', () => gpaInputRef.value?.focus()],
  ['description', () => descriptionRef.value?.focus()],
  ['attachment', () => attachmentInputRef.value?.focus()],
]

/** با هر انتخاب، فیلد لمس‌شده در نظر گرفته می‌شود تا خطای آن به‌موقع نمایش داده شود */
watch(() => form.city, value => {
  if (value) {
    touched.city = true
  }
})

watch(() => form.field, value => {
  if (value) {
    touched.field = true
  }
})

/** با انتخاب «سایر»، فوکوس به فیلد متنی همان بخش منتقل می‌شود */
watch(() => form.city, async (value) => {
  if (!isCustomOption(value)) {
    return
  }
  await nextTick()
  cityCustomRef.value?.focus()
})

watch(() => form.field, async (value) => {
  if (!isCustomOption(value)) {
    return
  }
  await nextTick()
  fieldCustomRef.value?.focus()
})

/* -------------------------------------------------------------------------- */
/* رویدادهای فرم                                                              */
/* -------------------------------------------------------------------------- */

function onGpaInput(event: Event) {
  const target = event.target as HTMLInputElement
  const sanitized = sanitizeGpaInput(target.value)
  form.gpa = sanitized
  if (target.value !== sanitized) {
    target.value = sanitized
  }
}

function onGpaBlur() {
  form.gpa = form.gpa.replace(/\.$/, '')
  touched.gpa = true
}

function onPersianBlur(key: 'cityCustom' | 'fieldCustom' | 'description') {
  form[key] = normalizePersianText(form[key])
  touched[key] = true
}

function onAttachmentChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  attachmentError.value = ''
  touched.attachment = true

  if (!files || files.length === 0) {
    attachment.value = null
    return
  }

  if (files.length > 1) {
    attachmentError.value = 'تنها یک فایل می‌توانید پیوست کنید.'
    attachment.value = null
    input.value = ''
    return
  }

  const file = files[0]
  const fileError = validateAttachmentFile(file)
  if (fileError) {
    attachmentError.value = fileError
    attachment.value = null
    input.value = ''
    return
  }

  attachment.value = file
  input.value = ''
}

function clearAttachment() {
  attachment.value = null
  attachmentError.value = ''
  touched.attachment = true
  if (attachmentInputRef.value) {
    attachmentInputRef.value.value = ''
  }
}

function focusFirstInvalid() {
  const target = focusTargets.find(([key]) => validationErrors.value[key])
  target?.[1]()
}

function handleSubmit() {
  attempted.value = true

  const hasError = (Object.keys(validationErrors.value) as FieldKey[]).some(
    key => Boolean(validationErrors.value[key]),
  )

  if (hasError) {
    focusFirstInvalid()
    return
  }

  const record: EducationRecord = {
    id: createEducationRecordId(),
    level: form.level as EducationLevel,
    city: resolveOptionValue(form.city, form.cityCustom),
    field: resolveOptionValue(form.field, form.fieldCustom),
    graduationDate: form.graduationDate as Date,
    institution: form.institution.trim(),
    gpa: form.gpa.trim(),
    description: normalizePersianText(form.description),
    attachmentName: attachment.value?.name ?? null,
  }

  resetForm()
  emit('submit', record)
}

function resetForm() {
  form.city = ''
  form.cityCustom = ''
  form.level = ''
  form.field = ''
  form.fieldCustom = ''
  form.graduationDate = null
  form.institution = ''
  form.gpa = ''
  form.description = ''
  attachment.value = null
  attachmentError.value = ''
  attempted.value = false
  ;(Object.keys(touched) as FieldKey[]).forEach((key) => {
    touched[key] = false
  })
}

/* -------------------------------------------------------------------------- */
/* دسترس‌پذیری: بستن با Escape، حبس فوکوس و مدیریت اسکرول                     */
/* -------------------------------------------------------------------------- */

function requestClose() {
  emit('close')
}

/** عناصر پنهان (مانند پاپ‌آور تقویم در حالت بسته) از چرخه‌ی Tab کنار گذاشته می‌شوند */
function isElementVisible(element: HTMLElement): boolean {
  if (element.hasAttribute('hidden')) {
    return false
  }

  let node: HTMLElement | null = element
  while (node) {
    const style = window.getComputedStyle(node)
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false
    }
    node = node.parentElement
  }

  return true
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    // اگر فهرست یکی از فیلدهای جستجوپذیر باز است، همان فیلد با Escape بسته می‌شود
    const active = document.activeElement as HTMLElement | null
    if (active?.getAttribute('role') === 'combobox' && active.getAttribute('aria-expanded') === 'true') {
      return
    }

    event.preventDefault()
    requestClose()
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const container = modalRef.value
  if (!container) {
    return
  }

  const focusables = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(isElementVisible)

  if (focusables.length === 0) {
    return
  }

  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = document.activeElement as HTMLElement | null
  const isInside = active ? container.contains(active) : false

  if (event.shiftKey && (!isInside || active === first)) {
    event.preventDefault()
    last.focus()
    return
  }

  if (!event.shiftKey && (!isInside || active === last)) {
    event.preventDefault()
    first.focus()
  }
}

let previousBodyOverflow = ''

onMounted(async () => {
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown, true)

  await nextTick()
  citySelectRef.value?.focus()
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow
  document.removeEventListener('keydown', onKeydown, true)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/50 p-3 backdrop-blur-sm sm:p-6"
      @click.self="requestClose"
    >
      <div
        class="flex min-h-full items-start justify-center py-2 sm:py-6"
        @click.self="requestClose"
      >
        <form
          ref="modalRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="education-modal-title"
          novalidate
          class="flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-muted-900"
          @submit.prevent="handleSubmit"
        >
          <!-- سربرگ مودال -->
          <div class="flex items-start justify-between gap-4 border-b border-muted-200 px-5 py-4 dark:border-muted-800 sm:px-6">
            <div>
              <h2 id="education-modal-title" class="text-base font-bold text-muted-800 dark:text-white sm:text-lg">
                افزودن اطلاعات تحصیلی
              </h2>
              <p class="mt-1 text-xs text-muted-500 dark:text-muted-400">
                فیلدهای دارای ستاره الزامی هستند.
              </p>
            </div>

            <button
              type="button"
              class="-m-1 rounded-lg p-1.5 text-muted-400 transition-colors hover:bg-muted-100 hover:text-muted-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 dark:hover:bg-muted-800 dark:hover:text-muted-200"
              aria-label="بستن فرم اطلاعات تحصیلی"
              @click="requestClose"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- بدنه‌ی فرم -->
          <div class="px-5 py-5 sm:px-6">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <!-- شهر تحصیل -->
              <div>
                <label for="education-city" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  شهر تحصیل <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <SearchableSelect
                  id="education-city"
                  ref="citySelectRef"
                  v-model="form.city"
                  :options="EDUCATION_CITY_OPTIONS"
                  :input-class="fieldClass(Boolean(errorFor('city')))"
                  :has-error="Boolean(errorFor('city'))"
                  error-id="education-city-error"
                  placeholder="جستجوی شهر…"
                />
                <p class="mt-1 text-[11px] leading-5 text-muted-500 dark:text-muted-400">
                  با تایپ کردن جستجو می‌شود؛ اگر شهر موردنظر در فهرست نبود، «سایر» را انتخاب کنید.
                </p>
                <FormFieldError error-id="education-city-error" :message="errorFor('city')" />

                <div v-if="isCustomOption(form.city)" class="mt-2">
                  <label for="education-city-custom" class="mb-1.5 block text-xs font-bold text-muted-700 dark:text-muted-300">
                    نام شهر تحصیل <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="education-city-custom"
                    ref="cityCustomRef"
                    v-model="form.cityCustom"
                    type="text"
                    autocomplete="off"
                    placeholder="شهر تحصیل را وارد کنید"
                    :class="fieldClass(Boolean(errorFor('cityCustom')))"
                    :aria-invalid="Boolean(errorFor('cityCustom'))"
                    :aria-describedby="errorFor('cityCustom') ? 'education-city-custom-error' : undefined"
                    @blur="onPersianBlur('cityCustom')"
                  >
                  <FormFieldError
                    error-id="education-city-custom-error"
                    :message="errorFor('cityCustom')"
                  />
                </div>
              </div>

              <!-- مقطع تحصیلی -->
              <div>
                <label for="education-level" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  مقطع تحصیلی <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="education-level"
                  ref="levelSelectRef"
                  v-model="form.level"
                  :class="fieldClass(Boolean(errorFor('level')))"
                  :aria-invalid="Boolean(errorFor('level'))"
                  :aria-describedby="errorFor('level') ? 'education-level-error' : undefined"
                  @blur="touched.level = true"
                >
                  <option value="" disabled>
                    انتخاب کنید
                  </option>
                  <option v-for="level in EDUCATION_LEVELS" :key="level" :value="level">
                    {{ level }}
                  </option>
                </select>
                <FormFieldError error-id="education-level-error" :message="errorFor('level')" />
              </div>

              <!-- رشته تحصیلی -->
              <div>
                <label for="education-field" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  رشته تحصیلی <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <SearchableSelect
                  id="education-field"
                  ref="fieldSelectRef"
                  v-model="form.field"
                  :options="STUDY_FIELD_OPTIONS"
                  :input-class="fieldClass(Boolean(errorFor('field')))"
                  :has-error="Boolean(errorFor('field'))"
                  error-id="education-field-error"
                  placeholder="جستجوی رشته تحصیلی…"
                />
                <p class="mt-1 text-[11px] leading-5 text-muted-500 dark:text-muted-400">
                  با تایپ کردن جستجو می‌شود؛ اگر رشته موردنظر در فهرست نبود، «سایر» را انتخاب کنید.
                </p>
                <FormFieldError error-id="education-field-error" :message="errorFor('field')" />

                <div v-if="isCustomOption(form.field)" class="mt-2">
                  <label for="education-field-custom" class="mb-1.5 block text-xs font-bold text-muted-700 dark:text-muted-300">
                    نام رشته تحصیل <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="education-field-custom"
                    ref="fieldCustomRef"
                    v-model="form.fieldCustom"
                    type="text"
                    autocomplete="off"
                    placeholder="رشته تحصیل را وارد کنید"
                    :class="fieldClass(Boolean(errorFor('fieldCustom')))"
                    :aria-invalid="Boolean(errorFor('fieldCustom'))"
                    :aria-describedby="errorFor('fieldCustom') ? 'education-field-custom-error' : undefined"
                    @blur="onPersianBlur('fieldCustom')"
                  >
                  <FormFieldError
                    error-id="education-field-custom-error"
                    :message="errorFor('fieldCustom')"
                  />
                </div>
              </div>

              <!-- تاریخ پایان تحصیلی -->
              <div>
                <label for="education-graduation-date" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  تاریخ پایان تحصیلی <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <DatePicker
                  v-model="form.graduationDate"
                  :masks="datePickerMasks"
                  locale="fa"
                >
                  <template #default="{ inputValue, inputEvents }">
                    <input
                      id="education-graduation-date"
                      ref="dateInputRef"
                      dir="ltr"
                      type="text"
                      autocomplete="off"
                      placeholder="۱۴۰۳-۰۵-۱۲"
                      :value="inputValue"
                      :class="[...fieldClass(Boolean(errorFor('graduationDate'))), 'text-left']"
                      :aria-invalid="Boolean(errorFor('graduationDate'))"
                      :aria-describedby="errorFor('graduationDate') ? 'education-graduation-date-error' : undefined"
                      v-on="inputEvents"
                      @blur="touched.graduationDate = true"
                    >
                  </template>
                </DatePicker>
                <FormFieldError
                  error-id="education-graduation-date-error"
                  :message="errorFor('graduationDate')"
                />
              </div>

              <!-- موسسه آموزشی -->
              <div>
                <label for="education-institution" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  موسسه آموزشی <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="education-institution"
                  ref="institutionInputRef"
                  v-model="form.institution"
                  type="text"
                  autocomplete="off"
                  placeholder="نام دانشگاه یا موسسه"
                  :class="fieldClass(Boolean(errorFor('institution')))"
                  :aria-invalid="Boolean(errorFor('institution'))"
                  :aria-describedby="errorFor('institution') ? 'education-institution-error' : undefined"
                  @blur="touched.institution = true"
                >
                <FormFieldError error-id="education-institution-error" :message="errorFor('institution')" />
              </div>

              <!-- معدل (اختیاری) -->
              <div>
                <label for="education-gpa" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  معدل
                </label>
                <input
                  id="education-gpa"
                  ref="gpaInputRef"
                  v-model="form.gpa"
                  dir="ltr"
                  type="text"
                  inputmode="decimal"
                  autocomplete="off"
                  placeholder="0.00"
                  :class="[...fieldClass(Boolean(errorFor('gpa'))), 'text-left']"
                  :aria-invalid="Boolean(errorFor('gpa'))"
                  :aria-describedby="errorFor('gpa') ? 'education-gpa-error' : undefined"
                  @input="onGpaInput"
                  @blur="onGpaBlur"
                >
                <p class="mt-1 text-[11px] leading-5 text-muted-500 dark:text-muted-400">
                  اختیاری؛ در صورت وارد کردن، عددی با حداکثر دو رقم اعشار باشد.
                </p>
                <FormFieldError error-id="education-gpa-error" :message="errorFor('gpa')" />
              </div>

              <!-- توضیحات -->
              <div class="md:col-span-2">
                <label for="education-description" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  توضیحات
                </label>
                <textarea
                  id="education-description"
                  ref="descriptionRef"
                  v-model="form.description"
                  rows="3"
                  placeholder="در صورت نیاز توضیح تکمیلی بنویسید"
                  :class="[...fieldClass(Boolean(errorFor('description'))), 'resize-y leading-6']"
                  :aria-invalid="Boolean(errorFor('description'))"
                  :aria-describedby="errorFor('description') ? 'education-description-error' : undefined"
                  @blur="onPersianBlur('description')"
                />
                <FormFieldError
                  error-id="education-description-error"
                  :message="errorFor('description')"
                />
              </div>

              <!-- پیوست -->
              <div class="md:col-span-2">
                <label for="education-attachment" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  پیوست <span class="text-red-500" aria-hidden="true">*</span>
                </label>

                <div
                  class="rounded-lg border border-dashed p-4"
                  :class="errorFor('attachment')
                    ? 'border-red-400 dark:border-red-500/70'
                    : 'border-muted-300 dark:border-muted-700'"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label
                      for="education-attachment"
                      class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-muted-300 bg-muted-50 px-4 py-2 text-sm font-medium text-muted-700 transition-colors hover:bg-muted-100 focus-within:ring-2 focus-within:ring-primary-500/40 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-200 dark:hover:bg-muted-700"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-4 w-4"
                      >
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      انتخاب فایل
                    </label>

                    <input
                      id="education-attachment"
                      ref="attachmentInputRef"
                      type="file"
                      class="sr-only"
                      :accept="ATTACHMENT_ACCEPT"
                      :aria-invalid="Boolean(errorFor('attachment'))"
                      :aria-describedby="errorFor('attachment') ? 'education-attachment-error' : undefined"
                      @change="onAttachmentChange"
                    >

                    <div class="flex min-w-0 flex-1 items-center gap-2 text-sm">
                      <span
                        v-if="attachment"
                        class="truncate text-muted-700 dark:text-muted-200"
                        :title="attachment.name"
                      >
                        {{ attachment.name }}
                      </span>
                      <span v-else class="text-muted-400 dark:text-muted-500">
                        فایلی انتخاب نشده است
                      </span>

                      <button
                        v-if="attachment"
                        type="button"
                        class="flex-shrink-0 rounded px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        @click="clearAttachment"
                      >
                        حذف فایل
                      </button>
                    </div>
                  </div>

                  <p class="mt-2 text-xs leading-5 text-muted-500 dark:text-muted-400">
                    پیوست الزامی است؛ تنها یک فایل با فرمت PDF، PNG یا JPG/JPEG قابل انتخاب است.
                    فایل فقط نامش در همین صفحه نمایش داده می‌شود و بارگذاری نخواهد شد.
                  </p>
                </div>

                <FormFieldError
                  error-id="education-attachment-error"
                  :message="errorFor('attachment')"
                />
              </div>
            </div>
          </div>

          <!-- پانویس مودال -->
          <div class="flex flex-col-reverse gap-2 border-t border-muted-200 px-5 py-4 dark:border-muted-800 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <button
              type="button"
              class="rounded-lg border border-muted-300 bg-white px-5 py-2 text-sm font-medium text-muted-700 transition-colors hover:bg-muted-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-muted-400/40 dark:border-muted-700 dark:bg-muted-900 dark:text-muted-200 dark:hover:bg-muted-800"
              @click="requestClose"
            >
              انصراف
            </button>

            <BaseButton
              type="submit"
              color="primary"
              size="md"
              class="!rounded-lg !bg-violet-600 !px-6 !text-white shadow-sm shadow-violet-600/20 transition-colors hover:!bg-violet-700"
            >
              ثبت اطلاعات
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
