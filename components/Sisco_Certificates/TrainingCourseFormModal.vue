<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { DatePicker } from 'v-calendars'
import 'v-calendars/dist/style.css'
import FormFieldError from '~/components/Sisco_Certificates/FormFieldError.vue'
import {
  CERTIFICATE_ACCEPT,
  REQUIRED_CERTIFICATE_MESSAGE,
  TRAINING_MODES,
  createTrainingCourseId,
  isEndDateBeforeStartDate,
  isValidDurationHours,
  toDurationHours,
  toLatinDigits,
  validateCertificateFile,
  type TrainingCourseRecord,
  type TrainingMode,
} from '~/composables/Sisco_Certificates/useTrainingCourses'

/**
 * مودال «افزودن دوره آموزشی»
 * فقط فرم و اعتبارسنجی سمت کلاینت؛ هیچ فایلی بارگذاری و هیچ داده‌ای ارسال نمی‌شود.
 */
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', record: TrainingCourseRecord): void
}>()

type FieldKey
  = 'title'
    | 'center'
    | 'durationHours'
    | 'startDate'
    | 'endDate'
    | 'mode'
    | 'score'
    | 'description'
    | 'certificate'

/** الگوی تاریخ، هم‌سو با الگوی date-input موجود در پروژه */
const datePickerMasks = { input: 'YYYY-MM-DD' }

const form = reactive({
  title: '',
  center: '',
  durationHours: '',
  startDate: null as Date | null,
  endDate: null as Date | null,
  mode: '' as TrainingMode | '',
  score: '',
  description: '',
})

const certificate = ref<File | null>(null)
const certificateError = ref('')
const attempted = ref(false)
const touched = reactive<Record<FieldKey, boolean>>({
  title: false,
  center: false,
  durationHours: false,
  startDate: false,
  endDate: false,
  mode: false,
  score: false,
  description: false,
  certificate: false,
})

const validationErrors = computed<Record<FieldKey, string>>(() => {
  const errors: Record<FieldKey, string> = {
    title: '',
    center: '',
    durationHours: '',
    startDate: '',
    endDate: '',
    mode: '',
    score: '',
    description: '',
    certificate: certificateError.value || (certificate.value ? '' : REQUIRED_CERTIFICATE_MESSAGE),
  }

  if (!form.title.trim()) {
    errors.title = 'عنوان دوره آموزشی الزامی است.'
  }

  if (!form.center.trim()) {
    errors.center = 'نام مرکز آموزشی الزامی است.'
  }

  if (!form.durationHours.trim()) {
    errors.durationHours = 'مدت زمان دوره الزامی است.'
  }
  else if (!isValidDurationHours(form.durationHours)) {
    errors.durationHours = 'مدت زمان دوره باید عدد صحیح و نامنفی بر حسب ساعت باشد.'
  }

  if (!form.startDate) {
    errors.startDate = 'تاریخ شروع دوره الزامی است.'
  }

  if (!form.endDate) {
    errors.endDate = 'تاریخ پایان دوره الزامی است.'
  }
  else if (form.startDate && isEndDateBeforeStartDate(form.startDate, form.endDate)) {
    // برابری تاریخ شروع و پایان مجاز است؛ فقط پایانِ زودتر نامعتبر است.
    errors.endDate = 'تاریخ پایان دوره نباید پیش از تاریخ شروع دوره باشد.'
  }

  if (!form.mode) {
    errors.mode = 'انتخاب روش آموزشی الزامی است.'
  }

  // «نمره یا نتیجه» اختیاری است و هیچ محدوده یا قالب خاصی برای آن تعیین نمی‌شود.

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
const titleInputRef = ref<HTMLInputElement | null>(null)
const centerInputRef = ref<HTMLInputElement | null>(null)
const durationInputRef = ref<HTMLInputElement | null>(null)
const startDateRef = ref<HTMLInputElement | null>(null)
const endDateRef = ref<HTMLInputElement | null>(null)
const modeSelectRef = ref<HTMLSelectElement | null>(null)
const scoreInputRef = ref<HTMLInputElement | null>(null)
const descriptionRef = ref<HTMLInputElement | null>(null)
const certificateInputRef = ref<HTMLInputElement | null>(null)

const focusTargets: Array<[FieldKey, () => HTMLElement | null]> = [
  ['title', () => titleInputRef.value],
  ['center', () => centerInputRef.value],
  ['durationHours', () => durationInputRef.value],
  ['startDate', () => startDateRef.value],
  ['endDate', () => endDateRef.value],
  ['mode', () => modeSelectRef.value],
  ['score', () => scoreInputRef.value],
  ['description', () => descriptionRef.value],
  ['certificate', () => certificateInputRef.value],
]

/* -------------------------------------------------------------------------- */
/* رویدادهای فرم                                                              */
/* -------------------------------------------------------------------------- */

/** فقط رقم پذیرفته می‌شود؛ علامت منفی و ممیز (یعنی مقدار اعشاری یا منفی) رد می‌شوند */
function onDurationInput(event: Event) {
  const target = event.target as HTMLInputElement
  const digits = toLatinDigits(target.value)

  if (!/^\d*$/.test(digits)) {
    target.value = form.durationHours
    return
  }

  form.durationHours = digits
  if (target.value !== digits) {
    target.value = digits
  }
}

function onCertificateChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  certificateError.value = ''
  touched.certificate = true

  if (!files || files.length === 0) {
    certificate.value = null
    return
  }

  if (files.length > 1) {
    certificateError.value = 'تنها یک فایل می‌توانید به عنوان گواهینامه پیوست کنید.'
    certificate.value = null
    input.value = ''
    return
  }

  const file = files[0]
  const fileError = validateCertificateFile(file)
  if (fileError) {
    certificateError.value = fileError
    certificate.value = null
    input.value = ''
    return
  }

  certificate.value = file
  input.value = ''
}

function clearCertificate() {
  certificate.value = null
  certificateError.value = ''
  touched.certificate = false
  if (certificateInputRef.value) {
    certificateInputRef.value.value = ''
  }
}

function focusFirstInvalid() {
  const target = focusTargets.find(([key]) => validationErrors.value[key])
  const element = target?.[1]()
  element?.focus()
}

function handleSubmit() {
  attempted.value = true

  const hasFieldError = (Object.keys(validationErrors.value) as FieldKey[]).some(
    key => key !== 'certificate' && Boolean(validationErrors.value[key]),
  )

  if (hasFieldError || validationErrors.value.certificate) {
    if (hasFieldError) {
      focusFirstInvalid()
    }
    return
  }

  const record: TrainingCourseRecord = {
    id: createTrainingCourseId(),
    title: form.title.trim(),
    center: form.center.trim(),
    durationHours: toDurationHours(form.durationHours),
    startDate: form.startDate as Date,
    endDate: form.endDate as Date,
    mode: form.mode as TrainingMode,
    score: form.score.trim(),
    description: form.description.trim(),
    certificateName: certificate.value?.name ?? null,
  }

  resetForm()
  emit('submit', record)
}

function resetForm() {
  form.title = ''
  form.center = ''
  form.durationHours = ''
  form.startDate = null
  form.endDate = null
  form.mode = ''
  form.score = ''
  form.description = ''
  certificate.value = null
  certificateError.value = ''
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
  titleInputRef.value?.focus()
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
          aria-labelledby="training-modal-title"
          novalidate
          class="flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-muted-900"
          @submit.prevent="handleSubmit"
        >
          <!-- سربرگ مودال -->
          <div class="flex items-start justify-between gap-4 border-b border-muted-200 px-5 py-4 dark:border-muted-800 sm:px-6">
            <div>
              <h2 id="training-modal-title" class="text-base font-bold text-muted-800 dark:text-white sm:text-lg">
                افزودن دوره آموزشی
              </h2>
              <p class="mt-1 text-xs text-muted-500 dark:text-muted-400">
                فیلدهای دارای ستاره الزامی هستند.
              </p>
            </div>

            <button
              type="button"
              class="-m-1 rounded-lg p-1.5 text-muted-400 transition-colors hover:bg-muted-100 hover:text-muted-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 dark:hover:bg-muted-800 dark:hover:text-muted-200"
              aria-label="بستن فرم دوره آموزشی"
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
              <!-- عنوان دوره آموزشی -->
              <div>
                <label for="training-title" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  عنوان دوره آموزشی <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="training-title"
                  ref="titleInputRef"
                  v-model="form.title"
                  type="text"
                  autocomplete="off"
                  placeholder="عنوان دوره را وارد کنید"
                  :class="fieldClass(Boolean(errorFor('title')))"
                  :aria-invalid="Boolean(errorFor('title'))"
                  :aria-describedby="errorFor('title') ? 'training-title-error' : undefined"
                  @blur="touched.title = true"
                >
                <FormFieldError error-id="training-title-error" :message="errorFor('title')" />
              </div>

              <!-- نام مرکز آموزشی -->
              <div>
                <label for="training-center" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  نام مرکز آموزشی <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="training-center"
                  ref="centerInputRef"
                  v-model="form.center"
                  type="text"
                  autocomplete="off"
                  placeholder="نام مرکز یا برگزارکننده دوره"
                  :class="fieldClass(Boolean(errorFor('center')))"
                  :aria-invalid="Boolean(errorFor('center'))"
                  :aria-describedby="errorFor('center') ? 'training-center-error' : undefined"
                  @blur="touched.center = true"
                >
                <FormFieldError error-id="training-center-error" :message="errorFor('center')" />
              </div>

              <!-- مدت زمان دوره(ساعت) -->
              <div>
                <label for="training-duration" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  مدت زمان دوره(ساعت) <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="training-duration"
                  ref="durationInputRef"
                  :value="form.durationHours"
                  dir="ltr"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="0"
                  :class="[...fieldClass(Boolean(errorFor('durationHours'))), 'text-left']"
                  :aria-invalid="Boolean(errorFor('durationHours'))"
                  :aria-describedby="errorFor('durationHours') ? 'training-duration-error' : undefined"
                  @input="onDurationInput"
                  @blur="touched.durationHours = true"
                >
                <FormFieldError error-id="training-duration-error" :message="errorFor('durationHours')" />
              </div>

              <!-- روش آموزشی -->
              <div>
                <label for="training-mode" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  روش آموزشی <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="training-mode"
                  ref="modeSelectRef"
                  v-model="form.mode"
                  :class="fieldClass(Boolean(errorFor('mode')))"
                  :aria-invalid="Boolean(errorFor('mode'))"
                  :aria-describedby="errorFor('mode') ? 'training-mode-error' : undefined"
                  @blur="touched.mode = true"
                >
                  <option value="" disabled>
                    انتخاب کنید
                  </option>
                  <option v-for="mode in TRAINING_MODES" :key="mode" :value="mode">
                    {{ mode }}
                  </option>
                </select>
                <FormFieldError error-id="training-mode-error" :message="errorFor('mode')" />
              </div>

              <!-- تاریخ شروع دوره -->
              <div>
                <label for="training-start-date" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  تاریخ شروع دوره <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <DatePicker
                  v-model="form.startDate"
                  :masks="datePickerMasks"
                  locale="fa"
                >
                  <template #default="{ inputValue, inputEvents }">
                    <input
                      id="training-start-date"
                      ref="startDateRef"
                      dir="ltr"
                      type="text"
                      autocomplete="off"
                      placeholder="۱۴۰۳-۰۵-۱۲"
                      :value="inputValue"
                      :class="[...fieldClass(Boolean(errorFor('startDate'))), 'text-left']"
                      :aria-invalid="Boolean(errorFor('startDate'))"
                      :aria-describedby="errorFor('startDate') ? 'training-start-date-error' : undefined"
                      v-on="inputEvents"
                      @blur="touched.startDate = true"
                    >
                  </template>
                </DatePicker>
                <FormFieldError error-id="training-start-date-error" :message="errorFor('startDate')" />
              </div>

              <!-- تاریخ پایان دوره -->
              <div>
                <label for="training-end-date" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  تاریخ پایان دوره <span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <DatePicker
                  v-model="form.endDate"
                  :masks="datePickerMasks"
                  locale="fa"
                >
                  <template #default="{ inputValue, inputEvents }">
                    <input
                      id="training-end-date"
                      ref="endDateRef"
                      dir="ltr"
                      type="text"
                      autocomplete="off"
                      placeholder="۱۴۰۳-۰۶-۲۰"
                      :value="inputValue"
                      :class="[...fieldClass(Boolean(errorFor('endDate'))), 'text-left']"
                      :aria-invalid="Boolean(errorFor('endDate'))"
                      :aria-describedby="errorFor('endDate') ? 'training-end-date-error' : undefined"
                      v-on="inputEvents"
                      @blur="touched.endDate = true"
                    >
                  </template>
                </DatePicker>
                <FormFieldError error-id="training-end-date-error" :message="errorFor('endDate')" />
              </div>

              <!-- نمره یا نتیجه -->
              <div>
                <label for="training-score" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  نمره یا نتیجه
                </label>
                <input
                  id="training-score"
                  ref="scoreInputRef"
                  v-model="form.score"
                  type="text"
                  autocomplete="off"
                  placeholder="در صورت وجود، نمره یا نتیجه را وارد کنید"
                  :class="fieldClass(Boolean(errorFor('score')))"
                  :aria-invalid="Boolean(errorFor('score'))"
                  @blur="touched.score = true"
                >
                <FormFieldError error-id="training-score-error" :message="errorFor('score')" />
              </div>

              <!-- توضیحات -->
              <div>
                <label for="training-description" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  توضیحات
                </label>
                <input
                  id="training-description"
                  ref="descriptionRef"
                  v-model="form.description"
                  type="text"
                  autocomplete="off"
                  placeholder="در صورت نیاز توضیح تکمیلی بنویسید"
                  :class="fieldClass(Boolean(errorFor('description')))"
                  :aria-invalid="Boolean(errorFor('description'))"
                  @blur="touched.description = true"
                >
                <FormFieldError error-id="training-description-error" :message="errorFor('description')" />
              </div>

              <!-- فایل گواهینامه -->
              <div class="md:col-span-2">
                <label for="training-certificate" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                  فایل گواهینامه <span class="text-red-500" aria-hidden="true">*</span>
                </label>

                <div
                  class="rounded-lg border border-dashed p-4"
                  :class="errorFor('certificate')
                    ? 'border-red-400 dark:border-red-500/70'
                    : 'border-muted-300 dark:border-muted-700'"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label
                      for="training-certificate"
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
                      id="training-certificate"
                      ref="certificateInputRef"
                      type="file"
                      class="sr-only"
                      :accept="CERTIFICATE_ACCEPT"
                      :aria-invalid="Boolean(errorFor('certificate'))"
                      :aria-describedby="errorFor('certificate') ? 'training-certificate-error' : undefined"
                      @change="onCertificateChange"
                    >

                    <div class="flex min-w-0 flex-1 items-center gap-2 text-sm">
                      <span
                        v-if="certificate"
                        class="truncate text-muted-700 dark:text-muted-200"
                        :title="certificate.name"
                      >
                        {{ certificate.name }}
                      </span>
                      <span v-else class="text-muted-400 dark:text-muted-500">
                        فایلی انتخاب نشده است
                      </span>

                      <button
                        v-if="certificate"
                        type="button"
                        class="flex-shrink-0 rounded px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        @click="clearCertificate"
                      >
                        حذف فایل
                      </button>
                    </div>
                  </div>

                  <p class="mt-2 text-xs leading-5 text-muted-500 dark:text-muted-400">
                    فایل گواهینامه الزامی است؛ تنها یک فایل با فرمت PDF، PNG یا JPG/JPEG قابل انتخاب
                    است. فایل فقط نامش در همین صفحه نمایش داده می‌شود و بارگذاری نخواهد شد.
                  </p>
                </div>

                <FormFieldError
                  error-id="training-certificate-error"
                  :message="errorFor('certificate')"
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
              ثبت دوره
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
