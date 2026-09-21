<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { DatePicker } from 'v-calendars'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  title: 'جلسه',
  preview: {
    title: 'چیدمان فرم 6',
    description: 'برای فرم‌ها و فیلدهای ورودی',
    categories: ['چیدمان‌ها', 'فرم‌ها'],
    src: '/img/screens/layouts-form-6.png',
    srcDark: '/img/screens/layouts-form-6-dark.png',
    order: 52,
  },
})

const VALIDATION_TEXT = {
  FIRSTNAME_REQUIRED: 'نام نمی‌تواند خالی باشد',
  LASTNAME_REQUIRED: 'نام خانوادگی نمی‌تواند خالی باشد',
  EMAIL_REQUIRED: 'آدرس ایمیل نمی‌تواند خالی باشد',
  OPTION_REQUIRED: 'لطفاً یک گزینه انتخاب کنید',
  ADDRESS_REQUIRED: 'لطفاً یک آدرس وارد کنید',
  CITY_REQUIRED: 'لطفاً یک شهر وارد کنید',
  STATE_REQUIRED: 'لطفاً یک استان وارد کنید',
  ZIPCODE_REQUIRED: 'لطفاً یک کد پستی وارد کنید',
  STATUS_REQUIRED: 'وضعیت را انتخاب کنید',
  AVATAR_TOO_BIG: `اندازه آواتار باید کمتر از ۱ مگابایت باشد`,
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z.object({
  meeting: z.object({
    title: z.string().min(5, VALIDATION_TEXT.FIRSTNAME_REQUIRED),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    startTime: z.date().nullable(),
    endTime: z.date().nullable(),
    frequency: z.string(),
    participants: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        avatar: z.string().optional(),
      }),
    ),
    location: z.string(),
    url: z.string().optional(),
    calendar: z.string(),
    description: z.string().min(40, VALIDATION_TEXT.FIRSTNAME_REQUIRED),
    colorCode: z.string(),
    notifications: z.object({
      general: z.boolean(),
      team: z.boolean(),
      reminders: z.boolean(),
      modifications: z.boolean(),
    }),
  }),
})

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  meeting: {
    title: '',
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    frequency: 'day',
    participants: [],
    location: '',
    url: '',
    calendar: '',
    description: '',
    colorCode: '',
    notifications: {
      general: false,
      team: false,
      reminders: false,
      modifications: false,
    },
  },
} satisfies FormInput

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
  meta,
  values,
  errors,
  resetForm,
  setFieldValue,
  setErrors,
} = useForm({
  validationSchema,
  initialValues,
})

const success = ref(false)
const fieldsWithErrors = computed(() => Object.keys(errors.value).length)

// Ask the user for confirmation before leaving the page if the form has unsaved changes
onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
    return confirm('تغییرات ذخیره نشده دارید. آیا مطمئنید که می‌خواهید ترک کنید؟')
  }
})

const toaster = useToaster()

// This is where you would send the form data to the server
const onSubmit = handleSubmit(
  async (values) => {
    success.value = false

    // here you have access to the validated form values
    console.log('meeting-create-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.meeting.title === 'جلسه آزمایشی') {
          // simulate a backend error
          setTimeout(
            () => reject(new Error('خطای اعتبارسنجی جعلی در بک‌اند')),
            2000,
          )
        }
        setTimeout(resolve, 4000)
      })

      toaster.clearAll()
      toaster.show({
        title: 'موفقیت',
        message: `Record has been created!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    catch (error: any) {
      // this will set the error on the form
      if (error.message === 'خطای اعتبارسنجی جعلی در بک‌اند') {
        setFieldError('meeting.title', 'این نام مجاز نیست')

        document.documentElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        })

        toaster.clearAll()
        toaster.show({
          title: 'اوه!',
          message: 'لطفاً خطاهای فرم را بررسی کنید',
          color: 'danger',
          icon: 'lucide:alert-triangle',
          closable: true,
        })
      }
      return
    }

    resetForm()

    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  },
  (error) => {
    // this callback is optional and called only if the form has errors
    success.value = false

    // here you have access to the error
    console.log('meeting-create-error', error)

    // you can use it to scroll to the first error
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
)

const calendars = [
  {
    id: '1',
    name: 'تقویم من',
    text: 'تقویم شخصی شما',
    icon: 'ph:user-duotone',
  },
  {
    id: '2',
    name: 'تقویم تیم',
    text: 'تقویم تیم شما',
    icon: 'ph:users-duotone',
  },
  {
    id: '3',
    name: 'تقویم شرکت',
    text: 'تقویم شرکت شما',
    icon: 'ph:buildings-duotone',
  },
]

const dates = ref({
  start: new Date(),
  end: new Date(),
})

const masks = ref({
  input: 'YYYY-MM-DD',
})

const frequency = ref('day')
const selectedCalendar = ref({
  id: 1,
  name: 'تقویم من',
  text: 'تقویم شخصی شما',
  icon: 'ph:user-duotone',
})

const uploadedFiles = ref<FileList | null>(null)
const colorCode = ref('color_code_1')
</script>

<template>
  <form
    action=""
    method="POST"
    class="mx-auto w-full max-w-3xl"
    @submit.prevent="onSubmit"
  >
    <BaseCard>
      <div
        class="border-muted-200 dark:border-muted-700 flex items-center justify-between gap-4 border-b px-10 py-5"
      >
        <div>
          <BaseHeading
            as="h3"
            size="md"
            weight="medium"
          >
            جلسه جدید
          </BaseHeading>
          <BaseText
            size="xs"
            class="text-muted-400"
          >
            زمان‌بندی یک جلسه جدید
          </BaseText>
        </div>
        <div class="ms-auto flex items-center gap-2">
          <BaseButtonAction @click.prevent="$router.back()">
            <Icon name="lucide:arrow-left" class="size-3 me-2 rtl:rotate-180" />
            <span>لغو</span>
          </BaseButtonAction>
          <BaseButtonAction type="submit" color="primary">
            <Icon name="lucide:check" class="size-3 me-2" />
            <span>ذخیره</span>
          </BaseButtonAction>
        </div>
      </div>
     
      <div class="px-10 py-5">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <Field
              v-slot="{ field, errorMessage, handleChange, handleBlur }"
              name="meeting.title"
            >
              <BaseInput
                label="این جلسه در مورد چیست؟"
                placeholder="مثال: بررسی پروژه با تیم طراحی"
                icon="lucide:slack"
                :model-value="field.value"
                :error="errorMessage"
                :disabled="isSubmitting"
                type="text"
                @update:model-value="handleChange"
                @blur="handleBlur"
              />
            </Field>
          </div>
          <div class="col-span-12 sm:col-span-6">
            <DatePicker
              v-model.range="dates"
              :masks="masks"
              :min-date="new Date()"
              locale="fa"
              mode="date"
              hide-time-header
              trim-weeks
            >
              <template #default="{ inputValue, inputEvents }">
                <div class="flex w-full flex-col gap-4 sm:flex-row">
                  <div class="relative grow">
                    <Field
                      v-slot="{ field, errorMessage, handleChange, handleBlur }"
                      name="meeting.startDate"
                    >
                      <BaseInput
                        label="تاریخ شروع"
                        icon="ph:calendar-blank-duotone"
                        :value="inputValue.start"
                        :model-value="field.value"
                        :error="errorMessage"
                        :disabled="isSubmitting"
                        type="text"
                        v-on="inputEvents.start"
                        @update:model-value="handleChange"
                        @blur="handleBlur"
                      />
                    </Field>
                  </div>
                  <div class="relative grow">
                    <Field
                      v-slot="{ field, errorMessage, handleChange, handleBlur }"
                      name="meeting.endDate"
                    >
                      <BaseInput
                        label="تاریخ پایان"
                        icon="ph:calendar-blank-duotone"
                        :value="inputValue.end"
                        :model-value="field.value"
                        :error="errorMessage"
                        :disabled="isSubmitting"
                        type="text"
                        v-on="inputEvents.end"
                        @update:model-value="handleChange"
                        @blur="handleBlur"
                      />
                    </Field>
                  </div>
                </div>
              </template>
            </DatePicker>
          </div>
          <div class="col-span-12 sm:col-span-6">
            <DatePicker
              v-model.range="dates"
              :masks="masks"
              :min-date="new Date()"
              locale="fa"
              mode="time"
              hide-time-header
              trim-weeks
            >
              <template #default="{ inputValue, inputEvents }">
                <div class="flex w-full flex-col gap-4 sm:flex-row">
                  <div class="relative grow">
                    <Field
                      v-slot="{ field, errorMessage, handleChange, handleBlur }"
                      name="meeting.startTime"
                    >
                      <BaseInput
                        label="ساعت شروع"
                        icon="ph:calendar-blank-duotone"
                        :value="inputValue.start"
                        :model-value="field.value"
                        :error="errorMessage"
                        :disabled="isSubmitting"
                        type="text"
                        v-on="inputEvents.start"
                        @update:model-value="handleChange"
                        @blur="handleBlur"
                      />
                    </Field>
                  </div>
                  <div class="relative grow">
                    <Field
                      v-slot="{ field, errorMessage, handleChange, handleBlur }"
                      name="meeting.endTime"
                    >
                      <BaseInput
                        label="ساعت پایان"
                        icon="ph:calendar-blank-duotone"
                        :value="inputValue.end"
                        :model-value="field.value"
                        :error="errorMessage"
                        :disabled="isSubmitting"
                        type="text"
                        v-on="inputEvents.end"
                        @update:model-value="handleChange"
                        @blur="handleBlur"
                      />
                    </Field>
                  </div>
                </div>
              </template>
            </DatePicker>
          </div>
          <div class="col-span-12">
            <div class="my-4">
              <label class="nui-label pb-4 text-[0.825rem]">فراوانی جلسات</label>
              <div class="flex items-center gap-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.frequency"
                >
                  <BaseRadio
                    id="frequency-1"
                    name="unique_frequency"
                    label="تمام روز"
                    value="day"
                    color="primary"
                    :classes="{
                      label: 'relative top-0.5 text-xs',
                    }"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.frequency"
                >
                  <BaseRadio
                    id="frequency-2"
                    name="weekly_frequency"
                    label="هر هفته تکرار کن"
                    value="week"
                    color="primary"
                    :classes="{
                      label: 'relative top-0.5 text-xs',
                    }"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-10"
      >
        <div class="flex items-center justify-between">
          <div>
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
            >
              جزئیات جلسه
            </BaseHeading>
            <BaseText
              size="xs"
              class="text-muted-400"
            >
              برخی جزئیات جلسه را اضافه کنید
            </BaseText>
          </div>
          <div>
            <BaseButtonAction>
              <Icon name="lucide:plus" class="size-3 me-2" />
              <span>افزودن افراد</span>
            </BaseButtonAction>
          </div>
        </div>
        <div class="mt-10 grid grid-cols-12 gap-4">
          <div class="col-span-12 grid grid-cols-12">
            <div class="col-span-12 flex flex-col justify-center sm:col-span-3">
              <label class="nui-label text-[0.825rem]">شرکت‌کنندگان</label>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <div class="flex items-center gap-3">
                <BaseAvatar
                  src="/img/avatars/24.svg"
                  data-nui-tooltip="آنا بی."
                />
                <BaseAvatar
                  src="/img/avatars/10.svg"
                  data-nui-tooltip="کندرا و."
                />
                <BaseAvatar
                  src="/img/avatars/8.svg"
                  data-nui-tooltip="جان اچ."
                />
                <BaseAvatar
                  src="/img/avatars/25.svg"
                  data-nui-tooltip="ملانی ال."
                />
                <div class="ms-auto">
                  <button
                    type="button"
                    class="text-primary-500 font-sans text-sm underline underline-offset-4"
                  >
                    مدیریت
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 grid grid-cols-12">
            <div class="col-span-12 flex flex-col justify-center sm:col-span-3">
              <label class="nui-label text-[0.825rem]">مکان جلسه</label>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="meeting.location"
              >
                <BaseInput
                  type="text"
                  placeholder="مثال: اتاق جلسه A"
                  icon="lucide:map-pin"
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>
          </div>
          <div class="col-span-12 grid grid-cols-12">
            <div class="col-span-12 flex flex-col justify-center sm:col-span-3">
              <label class="nui-label text-[0.825rem]">لینک ملاقات</label>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="meeting.url"
              >
                <BaseInput
                  type="text"
                  placeholder="https://zoom.us/m/123456789"
                  icon="lucide:video"
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>
          </div>
          <div class="col-span-12 grid grid-cols-12">
            <div class="col-span-12 flex flex-col justify-center sm:col-span-3">
              <label class="nui-label text-[0.825rem]">تقویم</label>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="meeting.calendar"
              >
                <BaseListbox
                  :items="calendars"
                  :properties="{
                    value: 'id',
                    label: 'name',
                    sublabel: 'text',
                    icon: 'icon',
                  }"
                  :model-value="field.value"
                  :model-modifiers="{ prop: true }"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>
          </div>
          <div class="col-span-12 grid grid-cols-12">
            <div
              class="col-span-12 flex flex-col justify-start pt-2 sm:col-span-3"
            >
              <label class="nui-label text-[0.825rem]">توضیحات</label>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <Field
                v-slot="{ field, errorMessage, handleChange, handleBlur }"
                name="meeting.description"
              >
                <BaseTextarea
                  placeholder="برخی جزئیات اضافی درباره جلسه بنویسید..."
                  :model-value="field.value"
                  :error="errorMessage"
                  :disabled="isSubmitting"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>
          </div>
          <div class="col-span-12 grid grid-cols-12">
            <div
              class="col-span-12 flex flex-col justify-start pt-4 sm:col-span-3"
            >
              <label class="nui-label text-[0.825rem]">پیوست‌ها</label>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <BaseInputFileHeadless
                v-slot="{ open, remove, preview, drop, files }"
                v-model="uploadedFiles"
                multiple
              >
                <!-- Controls -->
                <div class="mb-4 flex items-center gap-2">
                  <button
                    type="button"
                    class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                   tooltip="انتخاب فایل‌ها"
                    @click="open"
                  >
                    <Icon
                      name="lucide:plus"
                      class="absolute start-1/2 top-1/2 size-4 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2"
                    />
                    <span class="sr-only">انتخاب فایل‌ها</span>
                  </button>
                  <button
                    type="button"
                    class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                    tooltip="شروع آپلود"
                  >
                    <Icon name="lucide:arrow-up" class="size-4" />

                    <span class="sr-only">شروع آپلود</span>
                  </button>
                </div>

                <div
                  role="button"
                  tabindex="-1"
                  class=""
                  @dragenter.stop.prevent
                  @dragover.stop.prevent
                  @drop="drop"
                >
                  <div
                    v-if="!files?.length"
                    class="nui-focus border-muted-300 dark:border-muted-700 hover:border-muted-400 focus:border-muted-400 dark:hover:border-muted-600 dark:focus:border-muted-700 group cursor-pointer rounded-lg border-[3px] border-dashed p-8 transition-colors duration-300"
                    tabindex="0"
                    role="button"
                    @click="open"
                    @keydown.enter.prevent="open"
                  >
                    <div class="p-5 text-center">
                      <Icon
                        name="mdi-light:cloud-upload"
                        class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 mb-2 size-10 transition-colors duration-300"
                      />
                      <h4 class="text-muted-400 font-sans text-sm">
                        فایل‌ها را برای بارگذاری رها کنید
                      </h4>
                      <div>
                        <span
                          class="text-muted-400 font-sans text-[0.7rem] font-semibold uppercase"
                        >
                          یا
                        </span>
                      </div>
                      <label
                        for="file"
                        class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 cursor-pointer font-sans text-sm underline underline-offset-4 transition-colors duration-300"
                      >
                        انتخاب فایل‌ها
                      </label>
                    </div>
                  </div>
                  <ul v-else class="mt-6 space-y-2">
                    <li v-for="file in files" :key="file.name">
                      <div
                        class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative flex items-center justify-end gap-2 rounded-xl border bg-white p-3"
                      >
                        <div class="flex items-center gap-2">
                          <div class="shrink-0">
                            <img
                              v-if="file.type.startsWith('image')"
                              class="size-14 rounded-xl object-cover object-center"
                              :src="preview(file).value"
                              alt="Image preview"
                            >
                            <img
                              v-else
                              class="size-14 rounded-xl object-cover object-center"
                              src="/img/avatars/placeholder-file.png"
                              alt="Image preview"
                            >
                          </div>
                          <div class="font-sans">
                            <span
                              class="text-muted-800 dark:text-muted-100 line-clamp-1 block text-sm"
                            >
                              {{ file.name }}
                            </span>
                            <span class="text-muted-400 block text-xs">
                              {{ formatFileSize(file.size) }}
                            </span>
                          </div>
                        </div>

                        <div
                          class="ms-auto w-32 px-4 transition-opacity duration-300"
                          :class="'opacity-100'"
                        >
                          <BaseProgress
                            :value="0"
                            size="xs"
                            :color="'success'"
                          />
                        </div>
                        <div class="flex gap-2">
                          <button
                            class="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled
                            type="button"
                           tooltip="لغو"
                          >
                            <Icon name="lucide:slash" class="size-4" />
                            <span class="sr-only">لغو</span>
                          </button>

                          <button
                            class="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                            type="button"
                           tooltip="بارگذاری"
                          >
                            <Icon name="lucide:arrow-up" class="size-4" />
                            <span class="sr-only">بارگذاری</span>
                          </button>
                          <button
                            class="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                            type="button"
                           tooltip="حذف"
                            @click.prevent="remove(file)"
                          >
                            <Icon name="lucide:x" class="size-4" />
                            <span class="sr-only">حذف</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </BaseInputFileHeadless>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-10"
      >
        <div class="grid grid-cols-12 gap-8 pb-6">
          <div class="col-span-12 grid grid-cols-12">
            <div class="col-span-12 flex flex-col justify-center sm:col-span-3">
              <label class="nui-label text-[0.825rem]">کد رنگ</label>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <div class="flex items-center gap-3">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.colorCode"
                >
                  <BaseRadioHeadless
                    name="color_code"
                    value="color_code_1"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <div
                      class="border-primary-500 peer-checked:bg-primary-500 size-4 rounded-full border-2 transition-colors duration-300"
                    />
                  </BaseRadioHeadless>
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.colorCode"
                >
                  <BaseRadioHeadless
                    name="color_code"
                    value="color_code_2"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <div
                      class="border-info-500 peer-checked:bg-info-500 size-4 rounded-full border-2 transition-colors duration-300"
                    />
                  </BaseRadioHeadless>
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.colorCode"
                >
                  <BaseRadioHeadless
                    name="color_code"
                    value="color_code_3"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <div
                      class="border-success-500 peer-checked:bg-success-500 size-4 rounded-full border-2 transition-colors duration-300"
                    />
                  </BaseRadioHeadless>
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.colorCode"
                >
                  <BaseRadioHeadless
                    name="color_code"
                    value="color_code_4"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <div
                      class="border-danger-500 peer-checked:bg-danger-500 size-4 rounded-full border-2 transition-colors duration-300"
                    />
                  </BaseRadioHeadless>
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.colorCode"
                >
                  <BaseRadioHeadless
                    name="color_code"
                    value="color_code_5"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <div
                      class="size-4 rounded-full border-2 border-lime-500 transition-colors duration-300 peer-checked:bg-lime-500"
                    />
                  </BaseRadioHeadless>
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.colorCode"
                >
                  <BaseRadioHeadless
                    name="color_code"
                    value="color_code_6"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <div
                      class="size-4 rounded-full border-2 border-pink-500 transition-colors duration-300 peer-checked:bg-pink-500"
                    />
                  </BaseRadioHeadless>
                </Field>
              </div>
            </div>
          </div>
          <div class="col-span-12 grid grid-cols-12">
            <div
              class="col-span-12 flex flex-col justify-start pt-1 sm:col-span-3"
            >
              <label class="nui-label text-[0.825rem]">اطلاعیه‌ها</label>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <div class="flex flex-col gap-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.notifications.general"
                >
                  <BaseCheckbox
                    color="primary"
                    label="اطلاعیه‌های عمومی"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.notifications.team"
                >
                  <BaseCheckbox
                    color="primary"
                    label="اطلاعیه‌های تیم"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.notifications.reminders"
                >
                  <BaseCheckbox
                    color="primary"
                    label="یادآوری‌های خودکار"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="meeting.notifications.modifications"
                >
                  <BaseCheckbox
                    color="primary"
                    label="تغییرات"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
    <TairoFormSave />
  </form>
</template>
