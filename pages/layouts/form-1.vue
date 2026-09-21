<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  title: 'طرح‌بندی فرم ۱',
  preview: {
    title: 'طرح‌بندی فرم ۱',
    description: 'برای فرم‌ها و فیلدهای ورودی',
    categories: ['چیدمان‌ها', 'فرم‌ها'],
    src: '/img/screens/layouts-form-1.png',
    srcDark: '/img/screens/layouts-form-1-dark.png',
    order: 47,
  },
})

const people = [
  {
    id: 1,
    name: 'کلاریسا پرز',
    text: 'مدیر فروش',
    media: '/img/avatars/19.svg',
  },
  {
    id: 2,
    name: 'آرون اسپلاتر',
    text: 'مدیر پروژه',
    media: '/img/avatars/16.svg',
  },
  {
    id: 3,
    name: 'مایک میلر',
    text: 'طراح UI/UX',
    media: '/img/avatars/3.svg',
  },
  {
    id: 4,
    name: 'بندیکت کسلر',
    text: 'توسعه‌دهنده موبایل',
    media: '/img/avatars/22.svg',
  },
  {
    id: 5,
    name: 'مایا روسلینی',
    text: 'مدیر محصول',
    media: '/img/avatars/2.svg',
  },
]

// This is the object that will contain the validation messages
const ONE_MB = 1000000
const VALIDATION_TEXT = {
  NAME_REQUIRED: 'نام شرکت نمی‌تواند خالی باشد',
  EMAIL_REQUIRED: 'آدرس ایمیل نمی‌تواند خالی باشد',
  OPTION_REQUIRED: 'لطفاً یک گزینه انتخاب کنید',
  MANAGER_REQUIRED: 'لطفاً یک مدیر انتخاب کنید',
  STATUS_REQUIRED: 'وضعیت را انتخاب کنید',
  AVATAR_TOO_BIG: `اندازه آواتار باید کمتر از ۱ مگابایت باشد`,
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    avatar: z.custom<File>(v => v instanceof File).nullable(),
    company: z.object({
      name: z.string().min(1, VALIDATION_TEXT.NAME_REQUIRED),
      email: z.string().min(1, VALIDATION_TEXT.EMAIL_REQUIRED),
      type: z.string().optional(),
      website: z.string().optional(),
      phone: z.string().optional(),
      status: z.union([z.literal('active'), z.literal('inactive')]).nullable(),
      employees: z
        .union([
          z.literal('۱-۱۰ کارمند'),
          z.literal('۱۰-۵۰ کارمند'),
          z.literal('۵۰-۱۰۰ کارمند'),
          z.literal('بیش از ۱۰۰ کارمند'),
        ])
        .nullable(),
      manager: z
        .object({
          id: z.number(),
          name: z.string(),
          text: z.string(),
          media: z.string(),
        })
        .nullable(),
      income: z
        .union([
          z.literal('۰ - ۲۵۰ هزار تومان'),
          z.literal('۲۵۰ تا ۵۰۰ هزار'),
          z.literal('۵۰۰ هزار - ۱ میلیون تومان'),
          z.literal('۱ میلیون - ۵ میلیون تومان'),
          z.literal('بیش از ۱۰ میلیون'),
        ])
        .nullable(),
      notes: z.string().optional(),
      privateRecord: z.boolean(),
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
    if (!data.company.income) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['company.income'],
      })
    }
    if (!data.company.employees) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['company.employees'],
      })
    }
    if (!data.company.status) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.STATUS_REQUIRED,
        path: ['company.status'],
      })
    }
    if (!data.company.manager) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.MANAGER_REQUIRED,
        path: ['company.manager'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  avatar: null,
  company: {
    name: '',
    email: '',
    website: '',
    type: '',
    phone: '',
    income: null,
    employees: null,
    manager: null,
    status: null,
    notes: '',
    privateRecord: false,
  },
} satisfies FormInput

// This is the computed value that will be used to display the current avatar
const currentAvatar = computed(() => '/img/avatars/company.svg')

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
    console.log('company-create-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.company.name === 'ایر‌بی‌ان‌بی') {
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
        setFieldError('company.name', 'این نام مجاز نیست')

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
    console.log('company-create-error', error)

    // you can use it to scroll to the first error
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
)
</script>

<template>
  <div>
    <div class="mb-4 flex flex-col justify-between md:flex-row md:items-center">
      <div
        class="ltablet:max-w-full flex max-w-[425px] flex-col items-center gap-4 text-center md:flex-row md:text-start lg:max-w-full"
      >
        <div>
          <BaseHeading
            as="h2"
            size="xl"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>شرکت جدید</span>
          </BaseHeading>
          <BaseParagraph size="sm">
            <span class="text-muted-500"> یک رکورد جدید برای شرکت ایجاد کنید </span>
          </BaseParagraph>
        </div>
      </div>
      <div
        class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start"
      >
        <BaseButtonAction @click.prevent="$router.back()">
          <Icon name="lucide:arrow-left" class="size-3" />
          <span>لغو</span>
        </BaseButtonAction>
      </div>
    </div>
    <BaseCard>
      <form
        method="POST"
        action=""
        class="divide-muted-200 dark:divide-muted-700 grid divide-x rtl:divide-x-reverse sm:grid-cols-2"
        @submit.prevent="onSubmit"
      >
        <div
          rounded="lg"
          class="bg-muted-50 dark:bg-muted-800/60 space-y-8 p-10"
        >
          <div class="mx-auto flex w-full max-w-[410px] flex-col">
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
                  <div class="relative size-20">
                    <img
                      v-if="files?.length && files.item(0)"
                      :src="preview(files.item(0)!).value"
                      alt="پیشنمایش آپلود"
                      class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center"
                    >
                    <img
                      v-else
                      :src="currentAvatar"
                      alt="پیشنمایش آپلود"
                      class="bg-muted-200 dark:bg-muted-700/60 size-20 rounded-full object-cover object-center dark:invert"
                    >
                    <div
                      v-if="files?.length && files.item(0)"
                      class="absolute bottom-0 end-0 z-20"
                    >
                      <BaseButtonIcon
                        size="sm"
                        rounded="full"
                        data-nui-tooltip="حذف تصویر"
                        class="scale-90"
                        @click="remove(files.item(0)!)"
                      >
                        <Icon name="lucide:x" class="size-4" />
                      </BaseButtonIcon>
                    </div>
                    <div v-else class="absolute bottom-0 end-0 z-20">
                      <div class="relative" data-nui-tooltip="تصویر بارگذاری">
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
              <div class="grid grid-cols-12 gap-4">
                <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="company.name"
                  >
                    <BaseInput
                      label="شرکت نام"
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
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="company.email"
                  >
                    <BaseInput
                      label="شرکت ایمیل"
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
                <div class="col-span-12">
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="company.website"
                  >
                    <BaseInput
                      icon="lucide:globe"
                      label="وب‌سایت شرکت"
                      placeholder="مثال: https://eltheme.ir"
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
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="company.phone"
                  >
                    <AddonInputPhone
                      label="شرکت تلفن"
                      placeholder="مثال: +۱ ۵۵۵ ۵۵۵ ۵۵۵۵"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
              </div>
              <div class="mb-6 mt-4">
                <label class="nui-label pb-2 text-[0.825rem]">نوع شرکت</label>
                <div
                  class="ptablet:grid-cols-2 ltablet:grid-cols-3 grid gap-4 lg:grid-cols-3"
                >
                  <Field
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="company.type"
                  >
                    <BaseRadioHeadless
                      value="team_member_1"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    >
                      <BaseCard
                        rounded="sm"
                        class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-4"
                        color="none"
                      >
                        <div
                          class="flex w-full flex-col items-center gap-2 text-center"
                        >
                          <Icon
                            name="ph:house-simple-duotone"
                            class="child mx-auto size-5"
                          />

                          <div>
                            <BaseHeading
                              as="h4"
                              size="sm"
                              weight="medium"
                              lead="none"
                            >
                              تک
                            </BaseHeading>

                            <BaseText
                              size="xs"
                              class="text-muted-400"
                            >
                              شرکت کوچک
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
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="company.type"
                  >
                    <BaseRadioHeadless
                      value="team_member_2"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    >
                      <BaseCard
                        rounded="sm"
                        class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-4"
                        color="none"
                      >
                        <div
                          class="flex w-full flex-col items-center gap-2 text-center"
                        >
                          <Icon
                            name="ph:storefront-duotone"
                            class="child mx-auto size-5"
                          />

                          <div>
                            <BaseHeading
                              as="h4"
                              size="sm"
                              weight="medium"
                              lead="none"
                            >
                              مسئولیت محدود
                            </BaseHeading>

                            <BaseText
                              size="xs"
                              class="text-muted-400"
                            >
                              شرکت متوسط
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
                    v-slot="{ field, errorMessage, handleChange, handleBlur }"
                    name="company.type"
                  >
                    <BaseRadioHeadless
                      value="team_member_3"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    >
                      <BaseCard
                        rounded="sm"
                        class="text-muted-400 nui-card-muted peer-checked:nui-card-primary peer-checked:[&_.child]:!text-primary-500 relative border px-2 py-4"
                        color="none"
                      >
                        <div
                          class="flex w-full flex-col items-center gap-2 text-center"
                        >
                          <Icon
                            name="ph:buildings-duotone"
                            class="child mx-auto size-5"
                          />

                          <div>
                            <BaseHeading
                              as="h4"
                              size="sm"
                              weight="medium"
                              lead="none"
                            >
                              شرکت
                            </BaseHeading>

                            <BaseText
                              size="xs"
                              class="text-muted-400"
                            >
                              شرکت بزرگ‌تر
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
          </div>
        </div>
        <div rounded="lg" class="w-full space-y-8 p-10">
          <div class="mx-auto w-full max-w-[410px] sm:pt-28">
            <div class="grid grid-cols-12 gap-4">
              <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="company.income"
                >
                  <BaseSelect
                    rounded="sm"
                    label="درآمد"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <option value="" hidden />
                    <option value="۰ - ۲۵۰ هزار تومان">
                      ۰ - ۲۵۰ هزار تومان
                    </option>
                    <option value="۲۵۰ تا ۵۰۰ هزار">
                      ۲۵۰ تا ۵۰۰ هزار
                    </option>
                    <option value="۵۰۰ هزار - ۱ میلیون تومان">
                      ۵۰۰ هزار - ۱ میلیون تومان
                    </option>
                    <option value="۱ میلیون - ۵ میلیون تومان">
                      ۱ میلیون - ۵ میلیون تومان
                    </option>
                    <option value="بیش از ۱۰ میلیون">
                      بیش از ۱۰ میلیون
                    </option>
                  </BaseSelect>
                </Field>
              </div>
              <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="company.employees"
                >
                  <BaseSelect
                    rounded="sm"
                    label="کارمندان"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  >
                    <option value="" hidden />
                    <option value="۱-۱۰ کارمند">
                      ۱-۱۰ کارمند
                    </option>
                    <option value="۱۰-۵۰ کارمند">
                      ۱۰-۵۰ کارمند
                    </option>
                    <option value="۵۰-۱۰۰ کارمند">
                      ۵۰-۱۰۰ کارمند
                    </option>
                    <option value="بیش از ۱۰۰ کارمند">
                      بیش از ۱۰۰ کارمند
                    </option>
                  </BaseSelect>
                </Field>
              </div>
              <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="company.manager"
                >
                  <BaseListbox
                    label="مدیر"
                    :items="people"
                    :properties="{
                      value: 'id',
                      label: 'name',
                      sublabel: 'text',
                      media: 'media',
                    }"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="company.status"
                >
                  <BaseSelect
                    rounded="sm"
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
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="company.notes"
                >
                  <BaseTextarea
                    label="نوت‌های شرکت"
                    placeholder="نوشتن یادداشت‌هایی..."
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
                  name="company.privateRecord"
                >
                  <BaseCheckbox
                    label="این رکورد خصوصی است"
                    rounded="sm"
                    color="primary"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
            <div
              class="mt-5 flex flex-col-reverse text-right md:block md:space-x-3 md:space-x-reverse"
            >
              <BaseButton
                type="submit"
                color="primary"
                class="!h-12 w-full sm:w-40"
              >
                ایجاد شرکت
              </BaseButton>
            </div>
          </div>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
