<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  title: 'ویرایش کاربر',
  preview: {
    title: 'ویرایش کاربر',
    description: 'برای ویرایش اطلاعات کاربر',
    categories: ['چیدمان‌ها', 'فرم‌ها'],
    src: '/img/screens/layouts-user-edit.png',
    srcDark: '/img/screens/layouts-user-edit-dark.png',
    order: 31,
    new: true,
  },
})

const masks = ref({
  input: 'YYYY-MM-DD',
})

// This is the object that will contain the validation messages
const ONE_MB = 1000000
const VALIDATION_TEXT = {
  FIRST_NAME_REQUIRED: 'نام نمی‌تواند خالی باشد',
  LAST_NAME_REQUIRED: 'نام خانوادگی نمی‌تواند خالی باشد',
  PREFERRED_NAME_REQUIRED:
    'نام ترجیحی باید حداقل ۳ کاراکتر باشد',
  BIRTHDAY_REQUIRED: 'تاریخ تولد نمی‌تواند خالی باشد',
  BIRTHMONTH_REQUIRED: 'ماه تولد نمی‌تواند خالی باشد',
  BIRTHYEAR_REQUIRED: 'سال تولد نمی‌تواند خالی باشد',
  EMAIL_REQUIRED: 'آدرس ایمیل نمی‌تواند خالی باشد',
  PHONE_REQUIRED: 'شماره تلفن نمی‌تواند خالی باشد',
  STATUS_REQUIRED: 'وضعیت را انتخاب کنید',
  ADDRESS_REQUIRED: 'لطفاً یک آدرس وارد کنید',
  CITY_REQUIRED: 'لطفاً یک شهر وارد کنید',
  STATE_REQUIRED: 'لطفاً یک استان وارد کنید',
  ZIPCODE_REQUIRED: 'لطفاً یک کد پستی وارد کنید',
  AVATAR_TOO_BIG: `اندازه آواتار باید کمتر از ۱ مگابایت باشد`,
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    avatar: z.custom<File>(v => v instanceof File).nullable(),
    profile: z.object({
      firstName: z.string().min(1, VALIDATION_TEXT.FIRST_NAME_REQUIRED),
      lastName: z.string().min(1, VALIDATION_TEXT.LAST_NAME_REQUIRED),
      preferredName: z.string().optional(),
      email: z.string().min(1, VALIDATION_TEXT.EMAIL_REQUIRED),
      phone: z.string().min(1, VALIDATION_TEXT.PHONE_REQUIRED),
      birthday: z.object({
        year: z.number().nullable(),
        month: z.string().nullable(),
        day: z.string().nullable(),
      }),
      status: z
        .union([
          z.literal('single'),
          z.literal('married'),
          z.literal('divorced'),
          z.literal('widower'),
        ])
        .nullable(),
      gender: z
        .union([z.literal('male'), z.literal('female'), z.literal('other')])
        .optional(),
      mailingAddress: z.object({
        address: z.string().min(1, VALIDATION_TEXT.ADDRESS_REQUIRED),
        suite: z.string().min(1, VALIDATION_TEXT.ADDRESS_REQUIRED).optional(),
        city: z.string().min(1, VALIDATION_TEXT.CITY_REQUIRED),
        state: z.string().min(1, VALIDATION_TEXT.STATE_REQUIRED),
        zipcode: z.string().min(5, VALIDATION_TEXT.ZIPCODE_REQUIRED),
        country: z.string(),
      }),
      legalAddress: z.object({
        address: z.string().min(1, VALIDATION_TEXT.ADDRESS_REQUIRED),
        suite: z.string().min(1, VALIDATION_TEXT.ADDRESS_REQUIRED).optional(),
        city: z.string().min(1, VALIDATION_TEXT.CITY_REQUIRED),
        state: z.string().min(1, VALIDATION_TEXT.STATE_REQUIRED),
        zipcode: z.string().min(5, VALIDATION_TEXT.ZIPCODE_REQUIRED),
        country: z.string(),
      }),
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
    if (data.profile.firstName === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.FIRST_NAME_REQUIRED,
        path: ['profile.firstName'],
      })
    }
    if (data.profile.lastName === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.LAST_NAME_REQUIRED,
        path: ['profile.lastName'],
      })
    }
    if (
      data.profile.preferredName
      && data.profile.preferredName !== ''
      && data.profile.preferredName.length < 3
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.PREFERRED_NAME_REQUIRED,
        path: ['profile.preferredName'],
      })
    }
    if (data.profile.birthday.day === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.BIRTHDAY_REQUIRED,
        path: ['profile.birthday.day'],
      })
    }
    if (data.profile.birthday.month === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.BIRTHMONTH_REQUIRED,
        path: ['profile.birthday.month'],
      })
    }
    if (data.profile.birthday.year === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.BIRTHYEAR_REQUIRED,
        path: ['profile.birthday.year'],
      })
    }
    if (!data.profile.status) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.STATUS_REQUIRED,
        path: ['profile.status'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  avatar: null,
  profile: {
    firstName: '',
    lastName: '',
    preferredName: '',
    email: '',
    phone: '',
    birthday: {
      year: null,
      month: null,
      day: null,
    },
    gender: 'male',
    status: 'single',
    mailingAddress: {
      address: '',
      suite: '',
      city: '',
      state: '',
      zipcode: '',
      country: 'ایالات متحده',
    },
    legalAddress: {
      address: '',
      suite: '',
      city: '',
      state: '',
      zipcode: '',
      country: 'ایالات متحده',
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

// This is the computed value that will be used to display the current avatar
const currentAvatar = computed(
  () => `/img/avatars/default-${values.profile?.gender}.jpg`,
)

const success = ref(false)
const fieldsWithErrors = computed(() => Object.keys(errors.value).length)

// BaseInputFileHeadless gives us a listfile input, but we need to
// extract the file from the list and set it to the form
const inputFile = ref<FileList | null>(null)
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
    console.log('profile-edit-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.profile.firstName === 'Edgar') {
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
        message: `Changes have been saved!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    catch (error: any) {
      // this will set the error on the form
      if (error.message === 'خطای اعتبارسنجی جعلی در بک‌اند') {
        setFieldError('profile.firstName', 'این نام مجاز نیست')

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
    console.log('profile-edit-error', error)

    // you can use it to scroll to the first error
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
)
</script>

<template>
  <div class="w-full">
    <div>
      <form
        method="POST"
        action=""
        class=""
        @submit.prevent="onSubmit"
      >
        <div class="space-y-8">
          <div class="mx-auto flex w-full max-w-2xl flex-col">
            <div>
              <div>
                <div
                  class="relative mb-5 flex flex-col items-center justify-center gap-4"
                >
                  <BaseFullscreenDropfile
                    icon="ph:image-duotone"
                    :filter-file-dropped="
                      (file) => file.type.startsWith('image')
                    "
                    @drop="
                      (value) => {
                        inputFile = value
                      }
                    "
                  />
                  <BaseInputFileHeadless
                    v-slot="{ open, remove, preview, files }"
                    v-model="inputFile"
                    accept="image/*"
                  >
                    <div class="relative size-28">
                      <img
                        v-if="files?.length && files.item(0)"
                        :src="preview(files.item(0)!).value"
                        alt="پیشنمایش آپلود"
                        class="bg-muted-200 dark:bg-muted-700/60 size-28 rounded-full object-cover object-center"
                      >
                      <img
                        v-else
                        :src="currentAvatar"
                        alt="پیشنمایش آپلود"
                        class="bg-muted-200 dark:bg-muted-700/60 size-28 rounded-full object-cover object-center dark:invert"
                      >
                      <div
                        v-if="files?.length && files.item(0)"
                        class="absolute bottom-1 end-1 z-20"
                      >
                        <BaseButtonIcon
                          size="sm"
                          rounded="full"
                          data-tooltip="حذف تصویر"
                          class="scale-90"
                          @click="remove(files.item(0)!)"
                        >
                          <Icon name="lucide:x" class="size-4" />
                        </BaseButtonIcon>
                      </div>
                      <div v-else class="absolute bottom-1 end-1 z-20">
                        <div class="relative" data-tooltip="تصویر بارگذاری">
                          <BaseButtonIcon
                            size="sm"
                            rounded="full"
                            @click="open"
                          >
                            <Icon name="lucide:plus" class="size-4" />
                          </BaseButtonIcon>
                        </div>
                      </div>
                    </div>
                  </BaseInputFileHeadless>
                  <div
                    v-if="fileError"
                    class="text-danger-600 inline-block font-sans text-[.8rem]"
                  >
                    {{ fileError }}
                  </div>
                </div>
                <!--Form fields-->
                <div class="space-y-12">
                  <!--Personal info-->
                  <TairoFormGroup
                    label="اطلاعات شخصی"
                    sublabel="اطلاعات پایه در مورد شما"
                  >
                    <div class="grid grid-cols-12 gap-4">
                      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.firstName"
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
                      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.lastName"
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
                      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.preferredName"
                        >
                          <BaseInput
                            label="نام ترجیحی"
                            icon="ph:mask-happy-duotone"
                            placeholder="مثال: قاسم قاسمی"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.email"
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
                      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.phone"
                        >
                          <BaseInput
                            icon="lucide:phone"
                            label="شماره تلفن"
                            placeholder="مثال: +1 555 123 4567"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.status"
                        >
                          <BaseSelect
                            rounded="md"
                            label="خانواده وضعیت"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          >
                            <option value="" hidden />
                            <option value="single">
                              تک
                            </option>
                            <option value="married">
                              متاهل
                            </option>
                            <option value="divorced">
                              طلاق گرفته
                            </option>
                            <option value="widower">
                              Widow/Widower
                            </option>
                          </BaseSelect>
                        </Field>
                      </div>
                      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.birthday.day"
                        >
                          <BaseSelect
                            rounded="md"
                            label="روز تولد"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          >
                            <option value="" hidden />
                            <option
                              v-for="index in 31"
                              :key="index"
                              :value="index"
                            >
                              {{ index }}
                            </option>
                          </BaseSelect>
                        </Field>
                      </div>
                      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.birthday.month"
                        >
                          <BaseSelect
                            rounded="md"
                            label="ماه تولد"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          >
                            <option value="" hidden />
                            <option value="january">
                              فروردین
                            </option>
                            <option value="february">
                              اردیبهشت
                            </option>
                            <option value="march">
                              خرداد
                            </option>
                            <option value="april">
                              تیر
                            </option>
                            <option value="may">
                              مرداد
                            </option>
                            <option value="june">
                              شهریور
                            </option>
                            <option value="july">
                              مهر
                            </option>
                            <option value="august">
                              آبان
                            </option>
                            <option value="september">
                              آذر
                            </option>
                            <option value="october">
                              دی
                            </option>
                            <option value="november">
                              بهمن
                            </option>
                            <option value="december">
                              اسفند
                            </option>
                          </BaseSelect>
                        </Field>
                      </div>
                      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.birthday.year"
                        >
                          <BaseInput
                            label="سال تولد"
                            placeholder="مثال: ۱۳۶۶"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="number"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                      <div class="col-span-12">
                        <div class="">
                          <label class="nui-label pb-2 text-[0.825rem]">جنسیت</label>
                          <div class="grid gap-4 sm:grid-cols-3">
                            <Field
                              v-slot="{
                                field,
                                errorMessage,
                                handleChange,
                                handleBlur,
                              }"
                              name="profile.gender"
                            >
                              <BaseRadioHeadless
                                value="male"
                                :model-value="field.value"
                                :error="errorMessage"
                                :disabled="isSubmitting"
                                @update:model-value="handleChange"
                                @blur="handleBlur"
                              >
                                <BaseCard
                                  rounded="md"
                                  color="none"
                                  class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-6"
                                >
                                  <div
                                    class="flex w-full flex-col items-center gap-2 text-center"
                                  >
                                    <Icon
                                      name="ph:gender-male-duotone"
                                      class="child mx-auto size-6"
                                    />

                                    <div>
                                      <BaseHeading
                                        as="h4"
                                        size="sm"
                                        weight="medium"
                                        lead="none"
                                      >
                                        مرد
                                      </BaseHeading>
                                    </div>

                                    <div
                                      class="child text-muted-300 absolute end-2 top-2 ms-auto"
                                    >
                                      <div
                                        class="size-2 rounded-full bg-current"
                                      />
                                    </div>
                                  </div>
                                </BaseCard>
                              </BaseRadioHeadless>
                            </Field>

                            <Field
                              v-slot="{
                                field,
                                errorMessage,
                                handleChange,
                                handleBlur,
                              }"
                              name="profile.gender"
                            >
                              <BaseRadioHeadless
                                value="female"
                                :model-value="field.value"
                                :error="errorMessage"
                                :disabled="isSubmitting"
                                @update:model-value="handleChange"
                                @blur="handleBlur"
                              >
                                <BaseCard
                                  rounded="md"
                                  class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-6"
                                >
                                  <div
                                    class="flex w-full flex-col items-center gap-2 text-center"
                                  >
                                    <Icon
                                      name="ph:gender-female-duotone"
                                      class="child mx-auto size-6"
                                    />

                                    <div>
                                      <BaseHeading
                                        as="h4"
                                        size="sm"
                                        weight="medium"
                                        lead="none"
                                      >
                                        زن
                                      </BaseHeading>
                                    </div>

                                    <div
                                      class="child text-muted-300 absolute end-2 top-2 ms-auto"
                                    >
                                      <div
                                        class="size-2 rounded-full bg-current"
                                      />
                                    </div>
                                  </div>
                                </BaseCard>
                              </BaseRadioHeadless>
                            </Field>

                            <Field
                              v-slot="{
                                field,
                                errorMessage,
                                handleChange,
                                handleBlur,
                              }"
                              name="profile.gender"
                            >
                              <BaseRadioHeadless
                                value="other"
                                :model-value="field.value"
                                :error="errorMessage"
                                :disabled="isSubmitting"
                                @update:model-value="handleChange"
                                @blur="handleBlur"
                              >
                                <BaseCard
                                  rounded="md"
                                  class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-6"
                                >
                                  <div
                                    class="flex w-full flex-col items-center gap-2 text-center"
                                  >
                                    <Icon
                                      name="ph:gender-neuter-duotone"
                                      class="child mx-auto size-6"
                                    />

                                    <div>
                                      <BaseHeading
                                        as="h4"
                                        size="sm"
                                        weight="medium"
                                        lead="none"
                                      >
                                        دیگر
                                      </BaseHeading>
                                    </div>

                                    <div
                                      class="child text-muted-300 absolute end-2 top-2 ms-auto"
                                    >
                                      <div
                                        class="size-2 rounded-full bg-current"
                                      />
                                    </div>
                                  </div>
                                </BaseCard>
                              </BaseRadioHeadless>
                            </Field>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TairoFormGroup>

                  <!--Address info-->
                  <TairoFormGroup
                    label="آدرس پستی"
                    sublabel="آدرسی که برای ارسال نامه استفاده خواهیم کرد"
                  >
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-12">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.mailingAddress.address"
                        >
                          <BaseInput
                            label="آدرس"
                            icon="ph:map-pin-duotone"
                            placeholder="مثال: ۴۸، راه‌آهن سانتا باربارا"
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
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.mailingAddress.suite"
                        >
                          <BaseInput
                            label="خیابان / سوئیت"
                            icon="ph:map-pin-duotone"
                            placeholder="مثال: آپارتمان 12، سوئیت G4"
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
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.mailingAddress.city"
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
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.mailingAddress.state"
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
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.mailingAddress.zipcode"
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
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.mailingAddress.country"
                        >
                          <BaseSelect
                            rounded="md"
                            label="کشور"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          >
                            <option value="" hidden />
                            <option value="ایالات متحده">
                              ایالات متحده
                            </option>
                            <option value="کانادا">
                              کانادا
                            </option>
                            <option value="فرانسه">
                              فرانسه
                            </option>
                            <option value="آلمان">
                              آلمان
                            </option>
                            <option value="اسپانیا">
                              اسپانیا
                            </option>
                            <option value="چین">
                              چین
                            </option>
                            <option value="ژاپن">
                              ژاپن
                            </option>
                          </BaseSelect>
                        </Field>
                      </div>
                    </div>
                  </TairoFormGroup>

                  <!--Address info-->
                  <TairoFormGroup
                    label="آدرس قانونی"
                    sublabel="آدرس قانونی شما برای امور صورتحساب"
                  >
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-12">
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.legalAddress.address"
                        >
                          <BaseInput
                            label="آدرس"
                            icon="ph:map-pin-duotone"
                            placeholder="مثال: ۴۸، راه‌آهن سانتا باربارا"
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
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.legalAddress.suite"
                        >
                          <BaseInput
                            label="خیابان / سوئیت"
                            icon="ph:map-pin-duotone"
                            placeholder="مثال: آپارتمان 12، سوئیت G4"
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
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.legalAddress.city"
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
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.legalAddress.state"
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
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.legalAddress.zipcode"
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
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="profile.legalAddress.country"
                        >
                          <BaseSelect
                            rounded="md"
                            label="کشور"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          >
                            <option value="" hidden />
                            <option value="ایالات متحده">
                              ایالات متحده
                            </option>
                            <option value="کانادا">
                              کانادا
                            </option>
                            <option value="فرانسه">
                              فرانسه
                            </option>
                            <option value="آلمان">
                              آلمان
                            </option>
                            <option value="اسپانیا">
                              اسپانیا
                            </option>
                            <option value="چین">
                              چین
                            </option>
                            <option value="ژاپن">
                              ژاپن
                            </option>
                          </BaseSelect>
                        </Field>
                      </div>
                    </div>
                  </TairoFormGroup>

                  <div
                    class="mt-5 flex flex-col-reverse gap-y-4 text-end md:block md:space-x-3 md:space-x-reverse"
                  >
                    <BaseButton
                      to="/layouts/profile"
                      type="button"
                      color="muted"
                      class="w-full sm:w-40"
                      rounded="md"
                      size="lg"
                    >
                      لغو
                    </BaseButton>
                    <BaseButton
                      type="submit"
                      color="primary"
                      class="w-full sm:w-40"
                      rounded="md"
                      size="lg"
                      :loading="isSubmitting"
                    >
                      ذخیره تغییرات
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
