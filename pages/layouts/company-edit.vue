<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  title: 'ویرایش شرکت',
  preview: {
    title: 'ویرایش شرکت',
    description: 'برای ویرایش اطلاعات شرکت',
    categories: ['چیدمان‌ها', 'فرم‌ها'],
    src: '/img/screens/layouts-company-edit.png',
    srcDark: '/img/screens/layouts-company-edit-dark.png',
    order: 33,
    new: true,
  },
})

const masks = ref({
  input: 'YYYY-MM-DD',
})

// This is the object that will contain the validation messages
const ONE_MB = 1000000
const VALIDATION_TEXT = {
  COMPANY_NAME_REQUIRED: 'نام شرکت نمی‌تواند خالی باشد',
  LEGAL_NAME_REQUIRED: 'نام قانونی نمی‌تواند خالی باشد',
  PREFERRED_NAME_REQUIRED:
    'نام ترجیحی باید حداقل ۳ کاراکتر باشد',
  EMAIL_REQUIRED: 'آدرس ایمیل نمی‌تواند خالی باشد',
  PHONE_REQUIRED: 'شماره تلفن نمی‌تواند خالی باشد',
  TWITTER_REQUIRED: 'دسته توییتر نمی‌تواند خالی باشد',
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
      companyName: z.string().min(1, VALIDATION_TEXT.COMPANY_NAME_REQUIRED),
      dba: z.string().min(1, VALIDATION_TEXT.LEGAL_NAME_REQUIRED),
      commonName: z.string().optional(),
      email: z.string().min(1, VALIDATION_TEXT.EMAIL_REQUIRED),
      phone: z.string().min(1, VALIDATION_TEXT.PHONE_REQUIRED),
      twitterHandle: z.string().min(3, VALIDATION_TEXT.TWITTER_REQUIRED),
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
    if (data.profile.companyName === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.COMPANY_NAME_REQUIRED,
        path: ['profile.companyName'],
      })
    }
    if (data.profile.dba === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.LEGAL_NAME_REQUIRED,
        path: ['profile.dba'],
      })
    }
    if (
      data.profile.commonName
      && data.profile.commonName !== ''
      && data.profile.commonName.length < 3
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.PREFERRED_NAME_REQUIRED,
        path: ['profile.commonName'],
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
    companyName: '',
    dba: '',
    commonName: '',
    email: '',
    phone: '',
    twitterHandle: '',
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
const currentAvatar = computed(() => `/img/avatars/company.svg`)

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
    console.log('company-edit-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.profile.companyName === 'Acme') {
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
        setFieldError('profile.companyName', 'این نام مجاز نیست')

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
    console.log('company-edit-error', error)

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
                  <!--Company info-->
                  <TairoFormGroup
                    label="اطلاعات شرکت"
                    sublabel="اطلاعات پایه درباره شرکت"
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
                          name="profile.companyName"
                        >
                          <BaseInput
                            label="قانونی نام"
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
                          name="profile.dba"
                        >
                          <BaseInput
                            label="انجام کسب‌وکار تحت نام DBA"
                            icon="ph:buildings-duotone"
                            placeholder="مثال: سیستم‌های ال تم"
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
                          name="profile.commonName"
                        >
                          <BaseInput
                            label="نام متداول"
                            icon="ph:buildings-duotone"
                            placeholder="مثال: سیستم‌های ال تم"
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
                            placeholder="مثال: contact@eltheme.ir"
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
                          name="profile.twitterHandle"
                        >
                          <BaseInput
                            icon="lucide:twitter"
                            label="شناسه توئیتر"
                            placeholder="مثال: @eltheme"
                            :model-value="field.value"
                            :error="errorMessage"
                            :disabled="isSubmitting"
                            type="text"
                            @update:model-value="handleChange"
                            @blur="handleBlur"
                          />
                        </Field>
                      </div>
                    </div>
                  </TairoFormGroup>

                  <!--Address info-->
                  <TairoFormGroup
                    label="آدرس پستی"
                    sublabel="آدرس شرکت"
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
                    sublabel="آدرس قانونی شرکت"
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
                      to="/layouts/company"
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
