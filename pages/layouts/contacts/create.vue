<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  title: 'تماس جدید',
  preview: {
    title: 'تماس جدید',
    description: 'برای ایجاد مخاطب تماس',
    categories: ['چیدمان‌ها', 'فرم‌ها'],
    src: '/img/screens/layouts-contacts-create.png',
    srcDark: '/img/screens/layouts-contacts-create-dark.png',
    order: 47,
    new: true,
  },
})

// This is the object that will contain the validation messages
const ONE_MB = 1000000
const VALIDATION_TEXT = {
  FIRST_NAME_REQUIRED: 'نام نمی‌تواند خالی باشد',
  LAST_NAME_REQUIRED: 'نام خانوادگی نمی‌تواند خالی باشد',
  COMPANY_NAME_REQUIRED: 'نام شرکت نمی‌تواند خالی باشد',
  TITLE_REQUIRED: 'عنوان نمی‌تواند خالی باشد',
  EMAIL_REQUIRED: 'آدرس ایمیل نمی‌تواند خالی باشد',
  PHONE_REQUIRED: 'شماره تلفن نمی‌تواند خالی باشد',
  STATUS_REQUIRED: 'وضعیت را انتخاب کنید',
  ADDRESS_REQUIRED: 'لطفاً یک آدرس وارد کنید',
  CITY_REQUIRED: 'لطفاً یک شهر وارد کنید',
  STATE_REQUIRED: 'لطفاً یک استان وارد کنید',
  ZIPCODE_REQUIRED: 'لطفاً یک کد پستی وارد کنید',
  ACCOUNT_NUMBER_REQUIRED: 'شماره حساب نمی‌تواند خالی باشد',
  IBAN_REQUIRED: 'شماره IBAN نمی‌تواند خالی باشد',
  ROUTING_NUMBER_REQUIRED: 'شماره مسیردهی نمی‌تواند خالی باشد',
  TAXID_REQUIRED: 'کد مالیاتی نمی‌تواند خالی باشد',
  AVATAR_TOO_BIG: `اندازه آواتار باید کمتر از ۱ مگابایت باشد`,
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    avatar: z.custom<File>(v => v instanceof File).nullable(),
    contact: z.object({
      firstName: z
        .string()
        .min(1, VALIDATION_TEXT.FIRST_NAME_REQUIRED)
        .optional(),
      lastName: z
        .string()
        .min(1, VALIDATION_TEXT.LAST_NAME_REQUIRED)
        .optional(),
      companyName: z
        .string()
        .min(1, VALIDATION_TEXT.COMPANY_NAME_REQUIRED)
        .optional(),
      title: z.string().min(1, VALIDATION_TEXT.TITLE_REQUIRED),
      email: z.string().min(1, VALIDATION_TEXT.EMAIL_REQUIRED),
      phone: z.string().min(1, VALIDATION_TEXT.PHONE_REQUIRED),
      status: z.union([z.literal('active'), z.literal('inactive')]).nullable(),
      type: z.union([z.literal('person'), z.literal('company')]).nullable(),
      gender: z
        .union([z.literal('male'), z.literal('female'), z.literal('other')])
        .optional(),
      address: z.string().min(1, VALIDATION_TEXT.ADDRESS_REQUIRED),
      city: z.string().min(1, VALIDATION_TEXT.CITY_REQUIRED),
      state: z.string().min(1, VALIDATION_TEXT.STATE_REQUIRED),
      zipcode: z.string().min(5, VALIDATION_TEXT.ZIPCODE_REQUIRED),
      country: z.string(),
      accountNumber: z
        .number()
        .min(16, VALIDATION_TEXT.ACCOUNT_NUMBER_REQUIRED)
        .nullable(),
      routingNumber: z
        .number()
        .min(5, VALIDATION_TEXT.ROUTING_NUMBER_REQUIRED)
        .nullable(),
      iban: z.string().min(5, VALIDATION_TEXT.IBAN_REQUIRED).nullable(),
      taxId: z.string().min(5, VALIDATION_TEXT.TAXID_REQUIRED).nullable(),
      paymentMethod: z
        .union([z.literal('paypal'), z.literal('stripe'), z.literal('custom')])
        .nullable(),
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
    if (data.contact.firstName === '' && data.contact.type === 'person') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.FIRST_NAME_REQUIRED,
        path: ['contact.firstName'],
      })
    }
    if (data.contact.lastName === '' && data.contact.type === 'person') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.LAST_NAME_REQUIRED,
        path: ['contact.lastName'],
      })
    }
    if (data.contact.companyName === '' && data.contact.type === 'company') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.COMPANY_NAME_REQUIRED,
        path: ['contact.companyName'],
      })
    }
    if (!data.contact.status) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.STATUS_REQUIRED,
        path: ['contact.status'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  avatar: null,
  contact: {
    firstName: '',
    lastName: '',
    companyName: '',
    title: '',
    email: '',
    phone: '',
    type: 'person',
    gender: 'male',
    status: 'فعال',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'ایالات متحده',
    accountNumber: null,
    routingNumber: null,
    iban: null,
    taxId: null,
    paymentMethod: null,
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
  () => `/img/avatars/default-${values.contact?.gender}.jpg`,
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
    console.log('contact-create-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.contact.title === 'Clown') {
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
        message: `مخاطب ایجاد شد!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    catch (error: any) {
      // this will set the error on the form
      if (error.message === 'خطای اعتبارسنجی جعلی در بک‌اند') {
        setFieldError('contact.title', 'این عنوان مجاز نیست')

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
    console.log('contact-create-error', error)

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
                    sublabel="اطلاعات پایه در مورد مخاطب شما"
                  >
                    <div class="grid grid-cols-12 gap-4">
                      <div
                        v-if="values.contact?.type === 'person'"
                        class="ltablet:col-span-6 col-span-12 lg:col-span-6"
                      >
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="contact.firstName"
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
                      <div
                        v-if="values.contact?.type === 'person'"
                        class="ltablet:col-span-6 col-span-12 lg:col-span-6"
                      >
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="contact.lastName"
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
                      <div
                        v-if="values.contact?.type === 'company'"
                        class="col-span-12"
                      >
                        <Field
                          v-slot="{
                            field,
                            errorMessage,
                            handleChange,
                            handleBlur,
                          }"
                          name="contact.companyName"
                        >
                          <BaseInput
                            label="شرکت نام"
                            icon="ph:buildings-duotone"
                            placeholder="مثال: شرکت ال تم"
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
                          name="contact.title"
                        >
                          <BaseInput
                            label="عنوان / دسته‌بندی"
                            icon="ph:suitcase-duotone"
                            placeholder="مثال: فریلنسر / شرکت نرم‌افزاری"
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
                          name="contact.email"
                        >
                          <BaseInput
                            label="تماس ایمیل"
                            icon="ph:envelope-duotone"
                            placeholder="مثال: hello@eltheme.ir"
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
                          name="contact.phone"
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
                          name="contact.status"
                        >
                          <BaseSelect
                            rounded="md"
                            label="وضعیت"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          >
                            <option value="" hidden />
                            <option value="active">
                              فعال
                            </option>
                            <option value="inactive">
                              غیرفعال
                            </option>
                          </BaseSelect>
                        </Field>
                      </div>
                      <div class="col-span-12">
                        <div class="">
                          <label class="nui-label pb-2 text-[0.825rem]">نوع تماس</label>
                          <div class="grid gap-4 sm:grid-cols-2">
                            <Field
                              v-slot="{
                                field,
                                errorMessage,
                                handleChange,
                                handleBlur,
                              }"
                              name="contact.type"
                            >
                              <BaseRadioHeadless
                                value="person"
                                :model-value="field.value"
                                :error="errorMessage"
                                :disabled="isSubmitting"
                                @update:model-value="handleChange"
                                @blur="handleBlur"
                              >
                                <BaseCard
                                  rounded="md"
                                  class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-6"
                                  color="none"
                                >
                                  <div
                                    class="flex w-full flex-col items-center gap-2 text-center"
                                  >
                                    <Icon
                                      name="ph:user-duotone"
                                      class="child mx-auto size-6"
                                    />

                                    <div>
                                      <BaseHeading
                                        as="h4"
                                        size="sm"
                                        weight="medium"
                                        lead="none"
                                      >
                                        حقیقی
                                      </BaseHeading>

                                      <BaseText
                                        size="xs"
                                        class="text-muted-400"
                                      >
                                        تماس شخصی
                                      </BaseText>
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
                              name="contact.type"
                            >
                              <BaseRadioHeadless
                                value="company"
                                :model-value="field.value"
                                :error="errorMessage"
                                :disabled="isSubmitting"
                                @update:model-value="handleChange"
                                @blur="handleBlur"
                              >
                                <BaseCard
                                  rounded="md"
                                  class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-6"
                                  color="none"
                                >
                                  <div
                                    class="flex w-full flex-col items-center gap-2 text-center"
                                  >
                                    <Icon
                                      name="ph:buildings-duotone"
                                      class="child mx-auto size-6"
                                    />

                                    <div>
                                      <BaseHeading
                                        as="h4"
                                        size="sm"
                                        weight="medium"
                                        lead="none"
                                      >
                                        حقوقی
                                      </BaseHeading>

                                      <BaseText
                                        size="xs"
                                        class="text-muted-400"
                                      >
                                        تماس با سازمان
                                      </BaseText>
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
                      <div
                        v-if="values.contact?.type === 'person'"
                        class="col-span-12"
                      >
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
                              name="contact.gender"
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
                                  class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-6"
                                  color="none"
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
                              name="contact.gender"
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
                                  color="none"
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
                              name="contact.gender"
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
                                  color="none"
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
                    label="اطلاعات آدرس"
                    sublabel="آدرس مخاطب خود را اضافه کنید"
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
                          name="contact.address"
                        >
                          <BaseInput
                            label="آدرس / خیابان"
                            icon="ph:map-pin-duotone"
                            placeholder="مثال: اپ ۱۲ سوئیت G4 سانتا باربارا"
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
                          name="contact.city"
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
                          name="contact.state"
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
                          name="contact.zipcode"
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
                          name="contact.country"
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
                    label="اطلاعات مالی"
                    sublabel="اطلاعات مالی مخاطب خود را اضافه کنید"
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
                          name="contact.accountNumber"
                        >
                          <BaseInput
                            label="شماره حساب"
                            icon="ph:bank-duotone"
                            placeholder="مثال: ۴۱۳۴ ۱۲۱۳ ۳۲۹۸ ۴۲۷۳"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="number"
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
                          name="contact.iban"
                        >
                          <BaseInput
                            label="IBAN"
                            icon="ph:arrows-left-right-duotone"
                            placeholder="مثال: USX35B"
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
                          name="contact.routingNumber"
                        >
                          <BaseInput
                            label="شماره مسیریابی"
                            icon="ph:compass-duotone"
                            placeholder="مثال: ۲۸۷۳۲۱۳"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="number"
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
                          name="contact.taxId"
                        >
                          <BaseInput
                            label="شناسه مالیاتی"
                            icon="ph:note-duotone"
                            placeholder="مثال: TX-DHDZ526"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
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
                          name="contact.paymentMethod"
                        >
                          <BaseSelect
                            rounded="md"
                            label="روش پرداخت"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          >
                            <option value="" hidden />
                            <option value="stripe">
                              استرایپ
                            </option>
                            <option value="paypal">
                              پی‌پال
                            </option>
                            <option value="custom">
                              سفارشی
                            </option>
                          </BaseSelect>
                        </Field>
                      </div>
                    </div>
                  </TairoFormGroup>

                  <div
                    class="mt-5 flex flex-col-reverse text-end md:block md:space-x-3 md:space-x-reverse"
                  >
                    <BaseButton
                      to="/layouts/payments/recipients"
                      type="button"
                      color="muted"
                      class="w-full sm:w-44"
                      size="lg"
                      rounded="md"
                    >
                      لغو
                    </BaseButton>
                    <BaseButton
                      type="submit"
                      color="primary"
                      class="w-full sm:w-44"
                      size="lg"
                      rounded="md"
                      :loading="isSubmitting"
                    >
                      ذخیره تماس
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
