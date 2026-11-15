<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { DatePicker } from 'v-calendars'
import 'v-calendars/dist/style.css'
import FormFieldError from '~/components/Sisco_WorkExperiences/FormFieldError.vue'
import {
  INSURANCE_FILE_ACCEPT,
  createEntityId,
  createExperienceDraft,
  hasExperienceError,
  isDigitsOnlyInput,
  toInsuranceDays,
  toLatinDigits,
  validateExperienceDraft,
  validateInsuranceFile,
  type OrganizationRecord,
  type WorkExperienceDraft,
  type WorkExperienceDraftErrors,
} from '~/composables/Sisco_WorkExperiences/useWorkExperiences'

/**
 * مودال «افزودن سابقه کاری»
 * ساختار والد/فرزند: یک سازمان با چند سابقه‌ی کاری.
 * فقط فرم و اعتبارسنجی سمت کلاینت؛ هیچ فایلی بارگذاری و هیچ داده‌ای ارسال نمی‌شود.
 */
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', record: OrganizationRecord): void
}>()

type DraftFieldKey = 'fromDate' | 'toDate' | 'position' | 'insuranceDays' | 'insuranceFile'

/** الگوی تاریخ، هم‌سو با الگوی date-input موجود در پروژه */
const datePickerMasks = { input: 'YYYY-MM-DD' }

const organization = reactive({
  name: '',
  contact: '',
})

const experiences = ref<WorkExperienceDraft[]>([createExperienceDraft()])
const fileErrors = reactive<Record<string, string>>({})
const attempted = ref(false)
const organizationTouched = reactive({ name: false })

const touchedExperiences = reactive<Record<string, Partial<Record<DraftFieldKey, boolean>>>>({})

function markTouched(id: string, key: DraftFieldKey) {
  if (!touchedExperiences[id]) {
    touchedExperiences[id] = {}
  }
  touchedExperiences[id][key] = true
}

const draftErrors = computed<Record<string, WorkExperienceDraftErrors>>(() => {
  const map: Record<string, WorkExperienceDraftErrors> = {}
  for (const draft of experiences.value) {
    map[draft.id] = validateExperienceDraft(draft)
  }
  return map
})

const nameError = computed(() => (organization.name.trim() ? '' : 'نام سازمان الزامی است.'))
const recordsError = computed(() => (experiences.value.length === 0
  ? 'حداقل یک سابقه کاری برای سازمان ثبت کنید.'
  : ''))

function organizationNameError(): string {
  if (!attempted.value && !organizationTouched.name) {
    return ''
  }
  return nameError.value
}

/** پیام خطای هر فیلد از سابقه‌ی کاری؛ پس از لمس فیلد یا تلاش برای ثبت نمایش داده می‌شود */
function experienceErrorFor(id: string, key: DraftFieldKey): string {
  if (key === 'insuranceFile') {
    return fileErrors[id] ?? ''
  }

  if (!attempted.value && !touchedExperiences[id]?.[key]) {
    return ''
  }

  return draftErrors.value[id]?.[key] ?? ''
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
/* مدیریت سوابق کاری زیرمجموعه‌ی سازمان                                        */
/* -------------------------------------------------------------------------- */

const modalRef = ref<HTMLElement | null>(null)
const organizationNameRef = ref<HTMLInputElement | null>(null)

/** افزودن یک سابقه‌ی کاری جدید؛ فیلدهای سازمان و سوابق قبلی دست‌نخورده می‌مانند */
function addExperience() {
  experiences.value.push(createExperienceDraft())
}

/** حذف یک سابقه‌ی کاری؛ سازمان و بقیه‌ی سوابق حذف نمی‌شوند */
function removeExperience(id: string) {
  experiences.value = experiences.value.filter(draft => draft.id !== id)
  delete fileErrors[id]
  delete touchedExperiences[id]
}

function onInsuranceDaysInput(draft: WorkExperienceDraft, event: Event) {
  const target = event.target as HTMLInputElement
  const digits = toLatinDigits(target.value)

  if (!isDigitsOnlyInput(digits)) {
    target.value = draft.insuranceDays
    return
  }

  draft.insuranceDays = digits
  if (target.value !== digits) {
    target.value = digits
  }
}

function onInsuranceFileChange(draft: WorkExperienceDraft, event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  fileErrors[draft.id] = ''
  markTouched(draft.id, 'insuranceFile')

  if (!files || files.length === 0) {
    draft.insuranceFileName = null
    return
  }

  if (files.length > 1) {
    fileErrors[draft.id] = 'تنها یک فایل می‌توانید به عنوان فایل بیمه انتخاب کنید.'
    draft.insuranceFileName = null
    input.value = ''
    return
  }

  const file = files[0]
  const fileError = validateInsuranceFile(file)
  if (fileError) {
    fileErrors[draft.id] = fileError
    draft.insuranceFileName = null
    input.value = ''
    return
  }

  draft.insuranceFileName = file.name
  input.value = ''
}

function clearInsuranceFile(draft: WorkExperienceDraft) {
  draft.insuranceFileName = null
  fileErrors[draft.id] = ''
  markTouched(draft.id, 'insuranceFile')

  const input = document.getElementById(
    `experience-${draft.id}-insurance-file`,
  ) as HTMLInputElement | null
  if (input) {
    input.value = ''
  }
}

/* -------------------------------------------------------------------------- */
/* ثبت و بازنشانی                                                            */
/* -------------------------------------------------------------------------- */

async function focusFirstInvalid() {
  await nextTick()
  const target = modalRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')
  target?.focus()
}

function handleSubmit() {
  attempted.value = true

  const hasInvalidRecord = experiences.value.some(
    draft => hasExperienceError(draft) || Boolean(fileErrors[draft.id]),
  )
  const isInvalid
    = Boolean(nameError.value) || experiences.value.length === 0 || hasInvalidRecord

  if (isInvalid) {
    void focusFirstInvalid()
    return
  }

  const record: OrganizationRecord = {
    id: createEntityId('org'),
    name: organization.name.trim(),
    contact: organization.contact.trim(),
    experiences: experiences.value.map(draft => ({
      id: createEntityId('exp'),
      fromDate: draft.fromDate as Date,
      toDate: draft.toDate as Date,
      position: draft.position.trim(),
      insuranceDays: toInsuranceDays(draft.insuranceDays),
      description: draft.description.trim(),
      insuranceFileName: draft.insuranceFileName,
    })),
  }

  resetForm()
  emit('submit', record)
}

function resetForm() {
  organization.name = ''
  organization.contact = ''
  organizationTouched.name = false
  experiences.value = [createExperienceDraft()]
  attempted.value = false

  ;(Object.keys(fileErrors) as string[]).forEach((key) => {
    delete fileErrors[key]
  })
  ;(Object.keys(touchedExperiences) as string[]).forEach((key) => {
    delete touchedExperiences[key]
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
  organizationNameRef.value?.focus()
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
          aria-labelledby="work-experience-modal-title"
          novalidate
          class="flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-muted-900"
          @submit.prevent="handleSubmit"
        >
          <!-- سربرگ مودال -->
          <div class="flex items-start justify-between gap-4 border-b border-muted-200 px-5 py-4 dark:border-muted-800 sm:px-6">
            <div>
              <h2 id="work-experience-modal-title" class="text-base font-bold text-muted-800 dark:text-white sm:text-lg">
                افزودن سابقه کاری
              </h2>
              <p class="mt-1 text-xs text-muted-500 dark:text-muted-400">
                ابتدا اطلاعات سازمان را وارد کنید، سپس سوابق کاری زیرمجموعه‌ی آن را تکمیل کنید.
                فیلدهای دارای ستاره الزامی هستند.
              </p>
            </div>

            <button
              type="button"
              class="-m-1 rounded-lg p-1.5 text-muted-400 transition-colors hover:bg-muted-100 hover:text-muted-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 dark:hover:bg-muted-800 dark:hover:text-muted-200"
              aria-label="بستن فرم سابقه کاری"
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
          <div class="space-y-6 px-5 py-5 sm:px-6">
            <!-- بخش سازمان (والد) -->
            <section class="rounded-xl border border-muted-200 p-4 dark:border-muted-800 sm:p-5">
              <div class="mb-4 flex items-center gap-2">
                <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
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
                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    <rect width="20" height="14" x="2" y="6" rx="2" />
                  </svg>
                </span>
                <h3 class="text-sm font-bold text-muted-800 dark:text-white sm:text-base">
                  اطلاعات سازمان
                </h3>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <!-- نام سازمان -->
                <div>
                  <label for="organization-name" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                    نام سازمان <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="organization-name"
                    ref="organizationNameRef"
                    v-model="organization.name"
                    type="text"
                    autocomplete="off"
                    placeholder="نام سازمان را وارد کنید"
                    :class="fieldClass(Boolean(organizationNameError()))"
                    :aria-invalid="Boolean(organizationNameError())"
                    :aria-describedby="organizationNameError() ? 'organization-name-error' : undefined"
                    @blur="organizationTouched.name = true"
                  >
                  <FormFieldError
                    error-id="organization-name-error"
                    :message="organizationNameError()"
                  />
                </div>

                <!-- اطلاعات تماس سازمان -->
                <div>
                  <label for="organization-contact" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                    اطلاعات تماس سازمان
                  </label>
                  <input
                    id="organization-contact"
                    v-model="organization.contact"
                    type="text"
                    autocomplete="off"
                    placeholder="تلفن، نشانی یا هر راه تماس"
                    :class="fieldClass(false)"
                  >
                </div>
              </div>
            </section>

            <!-- بخش سوابق کاری (فرزند) -->
            <section>
              <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-muted-800 dark:text-white sm:text-base">
                    سوابق کاری در این سازمان
                  </h3>
                  <span class="rounded-full bg-muted-100 px-2 py-0.5 text-xs font-bold text-muted-600 dark:bg-muted-800 dark:text-muted-300">
                    {{ experiences.length.toLocaleString('fa-IR') }}
                  </span>
                </div>

                <BaseButton
                  type="button"
                  color="primary"
                  variant="outline"
                  size="sm"
                  class="!rounded-lg"
                  @click="addExperience"
                >
                  <span class="flex items-center gap-1.5">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-3.5 w-3.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    افزودن سابقه کاری
                  </span>
                </BaseButton>
              </div>

              <FormFieldError error-id="organization-records-error" :message="recordsError" />

              <p
                v-if="experiences.length === 0"
                class="mt-3 rounded-lg border border-dashed border-muted-300 px-4 py-6 text-center text-xs text-muted-500 dark:border-muted-700 dark:text-muted-400"
              >
                هنوز سابقه‌ای برای این سازمان ثبت نشده است. با دکمه «افزودن سابقه کاری» یک سابقه
                اضافه کنید.
              </p>

              <div class="space-y-4">
                <div
                  v-for="(draft, index) in experiences"
                  :key="draft.id"
                  class="rounded-xl border border-muted-200 p-4 dark:border-muted-800 sm:p-5"
                >
                  <div class="mb-4 flex items-center justify-between gap-3">
                    <h4 class="text-xs font-black text-muted-600 dark:text-muted-300 sm:text-sm">
                      سابقه کاری {{ (index + 1).toLocaleString('fa-IR') }}
                    </h4>

                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 dark:hover:bg-red-500/10"
                      :aria-label="`حذف سابقه کاری ${index + 1}`"
                      @click="removeExperience(draft.id)"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-3.5 w-3.5"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      حذف سابقه
                    </button>
                  </div>

                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <!-- از تاریخ -->
                    <div>
                      <label :for="`experience-${draft.id}-from-date`" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                        از تاریخ <span class="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <DatePicker
                        v-model="draft.fromDate"
                        :masks="datePickerMasks"
                        locale="fa"
                      >
                        <template #default="{ inputValue, inputEvents }">
                          <input
                            :id="`experience-${draft.id}-from-date`"
                            dir="ltr"
                            type="text"
                            autocomplete="off"
                            placeholder="۱۴۰۰-۰۱-۱۵"
                            :value="inputValue"
                            :class="[...fieldClass(Boolean(experienceErrorFor(draft.id, 'fromDate'))), 'text-left']"
                            :aria-invalid="Boolean(experienceErrorFor(draft.id, 'fromDate'))"
                            :aria-describedby="experienceErrorFor(draft.id, 'fromDate') ? `experience-${draft.id}-from-date-error` : undefined"
                            v-on="inputEvents"
                            @blur="markTouched(draft.id, 'fromDate')"
                          >
                        </template>
                      </DatePicker>
                      <FormFieldError
                        :error-id="`experience-${draft.id}-from-date-error`"
                        :message="experienceErrorFor(draft.id, 'fromDate')"
                      />
                    </div>

                    <!-- تا تاریخ -->
                    <div>
                      <label :for="`experience-${draft.id}-to-date`" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                        تا تاریخ <span class="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <DatePicker
                        v-model="draft.toDate"
                        :masks="datePickerMasks"
                        locale="fa"
                      >
                        <template #default="{ inputValue, inputEvents }">
                          <input
                            :id="`experience-${draft.id}-to-date`"
                            dir="ltr"
                            type="text"
                            autocomplete="off"
                            placeholder="۱۴۰۲-۰۴-۳۰"
                            :value="inputValue"
                            :class="[...fieldClass(Boolean(experienceErrorFor(draft.id, 'toDate'))), 'text-left']"
                            :aria-invalid="Boolean(experienceErrorFor(draft.id, 'toDate'))"
                            :aria-describedby="experienceErrorFor(draft.id, 'toDate') ? `experience-${draft.id}-to-date-error` : undefined"
                            v-on="inputEvents"
                            @blur="markTouched(draft.id, 'toDate')"
                          >
                        </template>
                      </DatePicker>
                      <FormFieldError
                        :error-id="`experience-${draft.id}-to-date-error`"
                        :message="experienceErrorFor(draft.id, 'toDate')"
                      />
                    </div>

                    <!-- سمت -->
                    <div>
                      <label :for="`experience-${draft.id}-position`" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                        سمت <span class="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        :id="`experience-${draft.id}-position`"
                        v-model="draft.position"
                        type="text"
                        autocomplete="off"
                        placeholder="عنوان شغل یا سمت"
                        :class="fieldClass(Boolean(experienceErrorFor(draft.id, 'position')))"
                        :aria-invalid="Boolean(experienceErrorFor(draft.id, 'position'))"
                        :aria-describedby="experienceErrorFor(draft.id, 'position') ? `experience-${draft.id}-position-error` : undefined"
                        @blur="markTouched(draft.id, 'position')"
                      >
                      <FormFieldError
                        :error-id="`experience-${draft.id}-position-error`"
                        :message="experienceErrorFor(draft.id, 'position')"
                      />
                    </div>

                    <!-- سابقه بیمه(روز) -->
                    <div>
                      <label :for="`experience-${draft.id}-insurance-days`" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                        سابقه بیمه(روز) <span class="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        :id="`experience-${draft.id}-insurance-days`"
                        :value="draft.insuranceDays"
                        dir="ltr"
                        type="text"
                        inputmode="numeric"
                        autocomplete="off"
                        placeholder="0"
                        :class="[...fieldClass(Boolean(experienceErrorFor(draft.id, 'insuranceDays'))), 'text-left']"
                        :aria-invalid="Boolean(experienceErrorFor(draft.id, 'insuranceDays'))"
                        :aria-describedby="experienceErrorFor(draft.id, 'insuranceDays') ? `experience-${draft.id}-insurance-days-error` : undefined"
                        @input="onInsuranceDaysInput(draft, $event)"
                        @blur="markTouched(draft.id, 'insuranceDays')"
                      >
                      <FormFieldError
                        :error-id="`experience-${draft.id}-insurance-days-error`"
                        :message="experienceErrorFor(draft.id, 'insuranceDays')"
                      />
                    </div>

                    <!-- توضیحات -->
                    <div class="md:col-span-2">
                      <label :for="`experience-${draft.id}-description`" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                        توضیحات
                      </label>
                      <input
                        :id="`experience-${draft.id}-description`"
                        v-model="draft.description"
                        type="text"
                        autocomplete="off"
                        placeholder="در صورت نیاز توضیح تکمیلی بنویسید"
                        :class="fieldClass(false)"
                      >
                    </div>

                    <!-- فایل بیمه -->
                    <div class="md:col-span-2">
                      <label :for="`experience-${draft.id}-insurance-file`" class="mb-1.5 block text-sm font-bold text-muted-700 dark:text-muted-300">
                        فایل بیمه
                      </label>

                      <div
                        class="rounded-lg border border-dashed border-muted-300 p-3 dark:border-muted-700 sm:p-4"
                        :class="fileErrors[draft.id] ? 'border-red-400 dark:border-red-500/70' : ''"
                      >
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <label
                            :for="`experience-${draft.id}-insurance-file`"
                            class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-muted-300 bg-muted-50 px-4 py-2 text-sm font-medium text-muted-700 transition-colors hover:bg-muted-100 focus-within:ring-2 focus-within:ring-primary-500/40 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-200 dark:hover:bg-muted-700"
                          >
                            انتخاب فایل
                          </label>

                          <input
                            :id="`experience-${draft.id}-insurance-file`"
                            type="file"
                            class="sr-only"
                            :accept="INSURANCE_FILE_ACCEPT"
                            :aria-invalid="Boolean(fileErrors[draft.id])"
                            :aria-describedby="fileErrors[draft.id] ? `experience-${draft.id}-insurance-file-error` : undefined"
                            @change="onInsuranceFileChange(draft, $event)"
                          >

                          <div class="flex min-w-0 flex-1 items-center gap-2 text-sm">
                            <span
                              v-if="draft.insuranceFileName"
                              class="truncate text-muted-700 dark:text-muted-200"
                              :title="draft.insuranceFileName"
                            >
                              {{ draft.insuranceFileName }}
                            </span>
                            <span v-else class="text-muted-400 dark:text-muted-500">
                              فایلی انتخاب نشده است
                            </span>

                            <button
                              v-if="draft.insuranceFileName"
                              type="button"
                              class="flex-shrink-0 rounded px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                              @click="clearInsuranceFile(draft)"
                            >
                              حذف فایل
                            </button>
                          </div>
                        </div>

                        <p class="mt-2 text-xs leading-5 text-muted-500 dark:text-muted-400">
                          تنها یک فایل با فرمت PDF، PNG یا JPG/JPEG قابل انتخاب است. فایل فقط نامش
                          نمایش داده می‌شود و بارگذاری نخواهد شد.
                        </p>
                      </div>

                      <FormFieldError
                        :error-id="`experience-${draft.id}-insurance-file-error`"
                        :message="experienceErrorFor(draft.id, 'insuranceFile')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
              ثبت سابقه کاری
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
