<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

import { AddonInputPhone } from '#components'

definePageMeta({
  title: 'پزشک جدید',
  preview: {
    title: 'چیدمان فرم ۲',
    description: 'برای فرم‌ها و فیلدهای ورودی',
    categories: ['چیدمان‌ها', 'فرم‌ها'],
    src: '/img/screens/layouts-form-2.png',
    srcDark: '/img/screens/layouts-form-2-dark.png',
    order: 48,
  },
})

// This is the object that will contain the validation messages
const ONE_MB = 1000000
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

const inputPhoneRef = ref<InstanceType<typeof AddonInputPhone>>()

function phoneErrorMessage(code?: string) {
  switch (code) {
    case 'INVALID_COUNTRY':
      return 'لطفاً یک کشور انتخاب کنید'
    case 'NO_POSSIBLE_COUNTRIES':
      return 'کشورهای ممکن برای این شماره تلفن موجود نیستند'
    case 'PHONE_NUMBER_NOT_POSSIBLE':
      return 'این شماره تلفن برای کشور انتخاب شده معتبر نیست'
    case 'NOT_A_NUMBER':
    case 'TOO_SHORT':
    case 'TOO_LONG':
    default:
      return 'لطفاً یک شماره تلفن معتبر وارد کنید'
  }
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    avatar: z.custom<File>(v => v instanceof File).nullable(),
    doctor: z.object({
      firstName: z.string().min(1, VALIDATION_TEXT.FIRSTNAME_REQUIRED),
      lastName: z.string().min(1, VALIDATION_TEXT.LASTNAME_REQUIRED),
      email: z.string().min(1, VALIDATION_TEXT.EMAIL_REQUIRED),
      comments: z.string().optional(),
      phone: z.string().optional(),
      status: z
        .union([
          z.literal('اینترن'),
          z.literal('رزیدنت'),
          z.literal('صاحب عنوان'),
        ])
        .nullable(),
      speciality: z
        .union([
          z.literal('جراحی'),
          z.literal('قلب‌شناسی'),
          z.literal('پدیاتری'),
          z.literal('پوست‌شناسی'),
          z.literal('تروماتولوژی'),
        ])
        .nullable(),
      experience: z
        .union([
          z.literal('0-5'),
          z.literal('5-10'),
          z.literal('10-15'),
          z.literal('15+'),
        ])
        .nullable(),
      rating: z
        .union([
          z.literal('1'),
          z.literal('2'),
          z.literal('3'),
          z.literal('4'),
          z.literal('5'),
        ])
        .nullable(),
      address: z.string().min(1, VALIDATION_TEXT.ADDRESS_REQUIRED),
      city: z.string().min(1, VALIDATION_TEXT.CITY_REQUIRED),
      state: z.string().min(1, VALIDATION_TEXT.STATE_REQUIRED),
      zipcode: z.string().min(5, VALIDATION_TEXT.ZIPCODE_REQUIRED),
      country: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    // This is a custom validation function that will be called
    // before the form is submitted
    if (data.avatar && data.avatar.size > ONE_MB) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.AVATAR_TOO_BIG,
        path: ['avatar'],
      })
    }
    if (!data.doctor.status) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['doctor.status'],
      })
    }
    if (!data.doctor.speciality) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['doctor.speciality'],
      })
    }
    if (!data.doctor.experience) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['doctor.experience'],
      })
    }
    if (!data.doctor.rating) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['doctor.rating'],
      })
    }

    if (!inputPhoneRef.value?.validation?.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: phoneErrorMessage(inputPhoneRef.value?.validation?.error) || VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['doctor.phone'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  avatar: null,
  doctor: {
    firstName: '',
    lastName: '',
    email: '',
    comments: '',
    status: null,
    speciality: null,
    experience: null,
    rating: null,
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'ایالات متحده',
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

// BaseInputFileHeadless gives us a listfile input, but we need to
// extract the file from the list and set it to the form
const inputFile = ref<FileList | null>()
const fileError = useFieldError('avatar')
watch(inputFile, (value) => {
  const file = value?.item(0) || null
  setFieldValue('avatar', file)
})

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
    console.log('doctor-create-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.doctor.speciality === 'قلب‌شناسی') {
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
        message: `پزشک افزوده شد!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    catch (error: any) {
      // this will set the error on the form
      if (error.message === 'خطای اعتبارسنجی جعلی در بک‌اند') {
        setFieldError('doctor.speciality', 'ما کاردیولوژیست‌های زیادی داریم')

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
    console.log('doctor-create-error', error)

    // you can use it to scroll to the first error
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
)

const currentRating = computed(() => {
  if (values.doctor?.rating === undefined || values.doctor?.rating === null)
    return 0
  return parseInt(values.doctor?.rating)
})

const currentRatingText = computed(() => {
  switch (currentRating.value) {
    case 1:
      return 'استاندارد'
    case 2:
      return 'خوب'
    case 3:
      return 'حرفه‌ای'
    case 4:
      return 'متخصص'
    case 5:
      return '۳ درصد نخبه'
    default:
      return 'نامشخص'
  }
})
</script>

<template>
  <form
    action=""
    method="POST"
    class="grid grid-cols-12 gap-6"
    @submit.prevent="onSubmit"
  >
    <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
      <BaseCard rounded="sm" class="p-4 md:p-8">
        <div class="grid grid-cols-1 gap-4 gap-y-2 text-sm lg:grid-cols-12">
          <div class="col-span-12 mb-10 text-gray-600 sm:col-span-3 sm:mb-0">
            <BaseHeading
              as="h2"
              size="lg"
              weight="medium"
              class="text-muted-800 dark:text-white"
            >
              پزشک جدید
            </BaseHeading>
            <BaseText
              size="xs"
              class="text-muted-400"
            >
              فیلدهای الزامی را پر کنید
            </BaseText>
          </div>

          <div class="ltablet:col-span-9 col-span-12 space-y-10 lg:col-span-9">
            <TairoFormGroup
              label="اطلاعات عمومی"
              sublabel="برخی اطلاعات عمومی"
            >
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.firstName"
                  >
                    <BaseInput
                      label="نام"
                      icon="ph:user-duotone"
                      placeholder="مثال: قاسم"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <div class="col-span-12 md:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.lastName"
                  >
                    <BaseInput
                      label="نام خانوادگی"
                      icon="ph:user-duotone"
                      placeholder="مثال: قاسمی"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <div class="col-span-12 md:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.email"
                  >
                    <BaseInput
                      label="آدرس ایمیل"
                      icon="ph:envelope-duotone"
                      placeholder="مثال: ghasem@eltheme.ir"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="email"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <div class="col-span-12 md:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.speciality"
                  >
                    <BaseSelect
                      label="تخصص"
                      icon="ph:first-aid-duotone"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    >
                      <option value="" hidden />
                      <option value="جراحی">
                        جراحی
                      </option>
                      <option value="قلب‌شناسی">
                        قلب‌شناسی
                      </option>
                      <option value="پدیاتری">
                        پدیاتری
                      </option>
                      <option value="پوست‌شناسی">
                        پوست‌شناسی
                      </option>
                      <option value="تروماتولوژی">
                        تروماتولوژی
                      </option>
                    </BaseSelect>
                  </Field>
                </div>

                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.phone"
                  >
                    <AddonInputPhone
                      ref="inputPhoneRef"
                      label="تلفن اضطراری"
                      placeholder="مثال: +۱ ۵۵۵ ۵۵۵ ۵۵۵۵"
                      icon="lucide:phone"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.comments"
                  >
                    <BaseTextarea
                      label="نظرات"
                      placeholder="مثال: جراحی ارتوپدی عمومی، جراحی پا و مچ پا"
                      rows="3"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>

                <div class="col-span-12 md:col-span-4">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.status"
                  >
                    <BaseSelect
                      label="وضعیت"
                      icon="ph:heartbeat-duotone"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    >
                      <option value="" hidden />
                      <option value="اینترن">
                        اینترن
                      </option>
                      <option value="رزیدنت">
                        رزیدنت
                      </option>
                      <option value="صاحب عنوان">
                        صاحب عنوان
                      </option>
                    </BaseSelect>
                  </Field>
                </div>

                <div class="col-span-12 md:col-span-4">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.experience"
                  >
                    <BaseSelect
                      label="تجربه"
                      icon="ph:trophy-duotone"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    >
                      <option value="" hidden />
                      <option value="0-5">
                        0-5
                      </option>
                      <option value="5-10">
                        5-10
                      </option>
                      <option value="10-15">
                        10-15
                      </option>
                      <option value="15+">
                        15+
                      </option>
                    </BaseSelect>
                  </Field>
                </div>

                <div class="col-span-12 md:col-span-4">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.rating"
                  >
                    <BaseSelect
                      label="رتبه‌بندی"
                      icon="ph:star-duotone"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    >
                      <option value="" hidden />
                      <option value="1">
                        B+
                      </option>
                      <option value="2">
                        A
                      </option>
                      <option value="3">
                        A+
                      </option>
                      <option value="4">
                        S
                      </option>
                      <option value="5">
                        S+
                      </option>
                    </BaseSelect>
                  </Field>
                </div>
              </div>
            </TairoFormGroup>

            <TairoFormGroup
              label="اطلاعات شخصی"
              sublabel="برخی اطلاعات شخصی"
            >
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.address"
                  >
                    <BaseInput
                      label="آدرس / خیابان"
                      icon="ph:map-pin-duotone"
                      placeholder="مثال: اپلیکیشن ۲، سوئیت G3، سانتا مونیکا"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
                <div class="col-span-12 sm:col-span-4">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.city"
                  >
                    <BaseInput
                      label="شهر"
                      icon="ph:buildings-duotone"
                      placeholder="مثال: لس آنجلس"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
                <div class="col-span-12 sm:col-span-4">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.state"
                  >
                    <BaseInput
                      label="استان/ایالت"
                      icon="ph:globe-duotone"
                      placeholder="مثال: CA"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
                <div class="col-span-12 sm:col-span-4">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="doctor.zipcode"
                  >
                    <BaseInput
                      type="text"
                      label="کد پستی"
                      icon="ph:paper-plane-tilt-duotone"
                      placeholder="مثال: ۹۱۲۶۵۶"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
                <div class="col-span-12">
                  <div
                    class="bg-muted-100 dark:bg-muted-700/70 flex items-center gap-2 rounded-lg p-4"
                  >
                    <BaseAvatar
                      size="xs"
                      src="/img/icons/flags/united-states-of-america.svg"
                    />
                    <BaseText
                      size="sm"
                      class="text-muted-500 dark:text-muted-400"
                    >
                      ایالات متحده
                    </BaseText>
                    <div class="ms-auto">
                      <NuxtLink
                        to="#"
                        class="text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                      >
                        تغییر
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </TairoFormGroup>

            <div class="text-right md:col-span-5">
              <div
                class="-mt-4 inline-flex w-full items-center justify-end gap-2 sm:w-auto"
              >
                <BaseButton class="!h-12 w-full sm:w-40">
                  لغو
                </BaseButton>
                <BaseButton
                  type="submit"
                  color="primary"
                  class="!h-12 w-full sm:w-40"
                >
                  ارسال
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
      <BaseCard class="ptablet:p-8 p-6 lg:p-8">
        <BaseText
          size="xs"
          weight="medium"
          class="text-muted-400 mb-6 block uppercase tracking-wider"
        >
          پیش‌نمایش رکورد
        </BaseText>
        <div class="mb-4 flex">
          <div class="grow">
            <BaseHeading
              as="h3"
              weight="medium"
            >
              دکتر {{ values.doctor?.firstName }} {{ values.doctor?.lastName }}
            </BaseHeading>
            <BaseText
              size="sm"
              class="text-muted-400"
            >
              {{ values.doctor?.city === '' ? 'شهر' : values.doctor?.city }},
              {{
                values.doctor?.state === '' ? 'استان' : values.doctor?.state
              }}
            </BaseText>
          </div>
          <div class="shrink-0">
            <BaseAvatar size="lg" src="/img/avatars/20.svg" />
          </div>
        </div>
        <div>
          <BaseHeading
            as="h3"
            size="md"
            weight="medium"
          >
            {{
              values.doctor?.speciality === null
                ? 'تخصص اصلی'
                : values.doctor?.speciality
            }}
          </BaseHeading>
          <BaseText size="sm" class="text-muted-400">
            {{
              values.doctor?.comments === ''
                ? 'مشاهدات در اینجا نمایش داده می‌شوند'
                : values.doctor?.comments
            }}
          </BaseText>
        </div>
        <div
          class="divide-muted-200 dark:divide-muted-700 flex w-full items-center divide-x py-6 rtl:divide-x-reverse"
        >
          <div class="xxl:pe-6 flex flex-1 flex-col gap-1 pe-4">
            <BaseHeading
              as="h3"
              size="sm"
              weight="medium"
              lead="none"
            >
              {{
                values.doctor?.status === null ? 'نامشخص' : values.doctor?.status
              }}
            </BaseHeading>
            <BaseText size="xs" class="text-muted-400">
              وضعیت نقش
            </BaseText>
          </div>
          <div class="xxl:px-6 flex flex-1 flex-col gap-1 px-4">
            <BaseHeading
              as="h3"
              size="sm"
              weight="medium"
              lead="none"
            >
              {{
                values.doctor?.experience === null
                  ? 'نامشخص'
                  : values.doctor?.experience
              }}
            </BaseHeading>
            <BaseText size="xs" class="text-muted-400">
              سال‌های تجربه
            </BaseText>
          </div>
          <div class="xxl:ps-6 flex flex-1 flex-col gap-1 ps-4">
            <BaseHeading
              as="h3"
              size="sm"
              weight="medium"
              lead="none"
            >
              سطح
              {{
                values.doctor?.rating === null ? 'نامشخص' : values.doctor?.rating
              }}
            </BaseHeading>
            <BaseText size="xs" class="text-muted-400">
              رتبه‌بندی جهانی
            </BaseText>
          </div>
        </div>
        <div>
          <div class="flex items-end justify-between">
            <div class="w-24 text-xs uppercase leading-tight">
              رتبه‌بندی
            </div>
            <div class="text-success-600 font-sans text-xs font-semibold">
              {{ currentRatingText }}
            </div>
          </div>
          <div class="mt-1 flex">
            <div
              class="dark:border-muted-800 h-3 grow border-x border-white"
              :class="
                currentRating > 0
                  ? 'bg-success-600'
                  : 'bg-muted-200 dark:bg-muted-700'
              "
            />
            <div
              class="dark:border-muted-800 h-3 grow border-x border-white"
              :class="
                currentRating >= 2
                  ? 'bg-success-600'
                  : 'bg-muted-200 dark:bg-muted-700'
              "
            />
            <div
              class="dark:border-muted-800 h-3 grow border-x border-white"
              :class="
                currentRating >= 3
                  ? 'bg-success-600'
                  : 'bg-muted-200 dark:bg-muted-700'
              "
            />
            <div
              class="dark:border-muted-800 h-3 grow border-x border-white"
              :class="
                currentRating >= 4
                  ? 'bg-success-600'
                  : 'bg-muted-200 dark:bg-muted-700'
              "
            />
            <div
              class="dark:border-muted-800 h-3 grow border-x border-white"
              :class="
                currentRating === 5
                  ? 'bg-success-600'
                  : 'bg-muted-200 dark:bg-muted-700'
              "
            />
          </div>
        </div>
        <div class="text-muted-400 mt-6 flex items-center gap-2">
          <Icon name="lucide:mail" class="size-4" />
          <BaseLink
            v-if="values.doctor?.email"
            class="block"
            :href="`mailto:${values.doctor?.email}`"
          >
            <BaseText size="xs">
              {{ values.doctor?.email }}
            </BaseText>
          </BaseLink>
          <BaseText
            v-else
            size="xs"
            class="dark:text-muted-200 opacity-50"
          >
            ایمیل خود را پر کنید
          </BaseText>
        </div>
        <div class="text-muted-400 mt-6 flex items-center gap-2">
          <Icon name="lucide:phone" class="size-4" />
          <BaseLink
            v-if="values.doctor?.phone"
            class="block"
            :href="`tel:${values.doctor?.phone}`"
          >
            <BaseText size="xs">
              {{ values.doctor?.phone }}
            </BaseText>
          </BaseLink>
          <BaseText
            v-else
            size="xs"
            class="dark:text-muted-200 opacity-50"
          >
            تلفن اضطراری خود را پر کنید
          </BaseText>
        </div>
      </BaseCard>
    </div>
  </form>
</template>
