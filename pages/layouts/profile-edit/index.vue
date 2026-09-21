<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useFieldError, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  title: 'ویرایش پروفایل',
  preview: {
    title: 'ویرایش پروفایل 1',
    description: 'برای ویرایش پروفایل کاربر',
    categories: ['چیدمان‌ها', 'پروفایل', 'فرم‌ها'],
    src: '/img/screens/layouts-subpages-profile-edit-1.png',
    srcDark: '/img/screens/layouts-subpages-profile-edit-1-dark.png',
    order: 76,
  },
  pageTransition: {
    enterActiveClass: 'transition-all duration-500 ease-out',
    enterFromClass: 'translate-y-20 opacity-0',
    enterToClass: 'translate-y-0 opacity-100',
    leaveActiveClass: 'transition-all duration-200 ease-in',
    leaveFromClass: 'translate-y-0 opacity-100',
    leaveToClass: 'translate-y-20 opacity-0',
  },
})

// This is the object that will contain the validation messages
const ONE_MB = 1000000
const VALIDATION_TEXT = {
  FIRST_REQUIRED: 'Your first name can\'t be empty',
  LASTNAME_REQUIRED: 'Your last name can\'t be empty',
  OPTION_REQUIRED: 'لطفاً یک گزینه انتخاب کنید',
  AVATAR_TOO_BIG: `اندازه آواتار باید کمتر از ۱ مگابایت باشد`,
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    avatar: z.custom<File>(v => v instanceof File).nullable(),
    profile: z.object({
      firstName: z.string().min(1, VALIDATION_TEXT.FIRST_REQUIRED),
      lastName: z.string().min(1, VALIDATION_TEXT.LASTNAME_REQUIRED),
      role: z.string().optional(),
      location: z.string(),
      bio: z.string(),
    }),
    info: z.object({
      experience: z
        .union([
          z.literal('0-2 سال'),
          z.literal('2-5 سال'),
          z.literal('5-10 سال'),
          z.literal('بیش از 10 سال'),
        ])
        .nullable(),
      firstJob: z
        .object({
          label: z.string(),
          value: z.boolean(),
        })
        .nullable(),
      flexible: z
        .object({
          label: z.string(),
          value: z.boolean(),
        })
        .nullable(),
      remote: z
        .object({
          label: z.string(),
          value: z.boolean(),
        })
        .nullable(),
    }),
    social: z.object({
      facebook: z.string(),
      twitter: z.string(),
      dribbble: z.string(),
      instagram: z.string(),
      github: z.string(),
      gitlab: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    // This is a custom validation function that will be called
    // before the form is submitted
    if (!data.info.experience) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['info.experience'],
      })
    }
    if (!data.info.firstJob) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['info.firstJob'],
      })
    }
    if (!data.info.flexible) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['info.flexible'],
      })
    }
    if (!data.info.remote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.OPTION_REQUIRED,
        path: ['info.remote'],
      })
    }
    if (data.avatar && data.avatar.size > ONE_MB) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.AVATAR_TOO_BIG,
        path: ['avatar'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const { data, pending, error, refresh } = await useFetch('/api/profile')

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  avatar: null,
  profile: {
    firstName: data.value?.personalInfo?.firstName || '',
    lastName: data.value?.personalInfo?.lastName || '',
    role: data.value?.personalInfo?.role || '',
    location: '',
    bio: '',
  },
  info: {
    experience: null,
    firstJob: null,
    flexible: null,
    remote: null,
  },
  social: {
    facebook: '',
    twitter: '',
    dribbble: '',
    instagram: '',
    github: '',
    gitlab: '',
  },
} satisfies FormInput

// This is the list of options for the select inputs
const experience = ['0-2 سال', '2-5 سال', '5-10 سال', 'بیش از 10 سال']
const answers = [
  {
    label: 'بله',
    value: true,
  },
  {
    label: 'خیر',
    value: false,
  },
]

// This is the computed value that will be used to display the current avatar
const currentAvatar = computed(() => data.value?.personalInfo?.picture)

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
    console.log('profile-edit-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.profile.firstName === 'مایا') {
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
        message: `پروفایل شما به‌روزرسانی شد!`,
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

    // we can refresh the data from the server
    // this will update the initial values and the current avatar
    await refresh()

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
  <form
    method="POST"
    action=""
    class="w-full pb-16"
    @submit.prevent="onSubmit"
  >
    <BaseCard>
      <div class="flex items-center justify-between p-4">
        <div>
          <BaseHeading
            tag="h2"
            size="sm"
            weight="medium"
            lead="normal"
            class="uppercase tracking-wider"
          >
            اطلاعات عمومی
          </BaseHeading>
          <BaseText size="xs" class="text-muted-400">
            ویرایش اطلاعات عمومی حساب شما
          </BaseText>
        </div>
        <div class="flex items-center gap-2">
          <BaseButton class="w-24" to="/layouts/profile">
            لغو
          </BaseButton>
          <BaseButton
            type="submit"
            color="primary"
            class="w-24"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          >
            ذخیره
          </BaseButton>
        </div>
      </div>
      <div class="p-4">
        <div class="mx-auto max-w-lg space-y-12 py-8">
          <BaseMessage v-if="success" @close="success = false">
            پروفایل شما به‌روزرسانی شد!
          </BaseMessage>
          <BaseMessage
            v-if="fieldsWithErrors"
            type="danger"
            @close="() => setErrors({})"
          >
            این فرم دارای {{ fieldsWithErrors }} خطا است، لطفاً قبل از ارسال آنها را بررسی کنید.
          </BaseMessage>

          <TairoFormGroup
            label="تصویر پروفایل"
            sublabel="این همان چیزی است که دیگران شما را با آن می‌شناسند"
          >
            <div
              class="relative flex flex-col items-center justify-center gap-4"
            >
              <BaseFullscreenDropfile
                icon="ph:image-duotone"
                :filter-file-dropped="(file) => file.type.startsWith('image')"
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
                <div class="relative size-24">
                  <img
                    v-if="files?.length && files.item(0)"
                    :src="preview(files.item(0)!).value"
                    alt="پیشنمایش آپلود"
                    class="bg-muted-200 dark:bg-muted-700/60 size-24 rounded-full object-cover object-center"
                  >
                  <img
                    v-else
                    :src="currentAvatar"
                    alt="پیشنمایش آپلود"
                    class="bg-muted-200 dark:bg-muted-700/60 size-24 rounded-full object-cover object-center"
                  >
                  <div
                    v-if="files?.length && files.item(0)"
                    class="absolute bottom-0 end-0 z-20"
                  >
                    <BaseButtonIcon
                      size="sm"
                      rounded="full"
                      data-nui-tooltip="حذف تصویر"
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
          </TairoFormGroup>

          <TairoFormGroup
            label="اطلاعات پروفایل"
            sublabel="دیگران شایسته‌اند که بیشتر با شما آشنا شوند"
          >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="profile.firstName"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="ph:user-duotone"
                    placeholder="نام"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="profile.lastName"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="ph:user-duotone"
                    placeholder="نام خانوادگی"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="profile.role"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="ph:suitcase-duotone"
                    placeholder="عنوان شغل"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="profile.location"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="ph:map-pin-duotone"
                    placeholder="موقعیت"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="profile.bio"
                >
                  <BaseTextarea
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    rows="4"
                    placeholder="درباره شما / بیو کوتاه..."
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </TairoFormGroup>

          <TairoFormGroup
            label="اطلاعات حرفه‌ای"
            sublabel="این می‌تواند به شما کمک کند فرصت‌هایی را به دست آورید"
          >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="info.experience"
                >
                  <BaseListbox
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    :items="experience"
                    placeholder="تجربه"
                    rounded="sm"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="info.firstJob"
                >
                  <BaseListbox
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    :items="answers"
                    :properties="{ label: 'label', value: 'value' }"
                    placeholder="آیا این اولین شغل شماست؟"
                    rounded="sm"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="info.flexible"
                >
                  <BaseListbox
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    :items="answers"
                    :properties="{ label: 'label', value: 'value' }"
                    placeholder="آیا شما انعطاف‌پذیر هستید؟"
                    rounded="sm"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="info.remote"
                >
                  <BaseListbox
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    :items="answers"
                    :properties="{ label: 'label', value: 'value' }"
                    placeholder="آیا از راه دور کار می‌کنید؟"
                    rounded="sm"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </TairoFormGroup>

          <TairoFormGroup
            label="پروفایل‌های سوشیال مدیا"
            sublabel="این می‌تواند به دیگران کمک کند شما را در شبکه‌های اجتماعی پیدا کنند"
          >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="social.facebook"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="fa6-brands:facebook-f"
                    placeholder="آدرس فیسبوک"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="social.twitter"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="fa6-brands:twitter"
                    placeholder="آدرس توییتر"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="social.dribbble"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="fa6-brands:dribbble"
                    placeholder="آدرس دریببل"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="social.instagram"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="fa6-brands:instagram"
                    placeholder="آدرس اینستاگرام"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="social.github"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="fa6-brands:github"
                    placeholder="آدرس گیتهاب"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12 sm:col-span-6">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="social.gitlab"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="text"
                    icon="fa6-brands:gitlab"
                    placeholder="آدرس گیتلب"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </TairoFormGroup>
        </div>
      </div>
    </BaseCard>
    <TairoFormSave
      :disabled="isSubmitting"
      :loading="isSubmitting"
      @reset="resetForm"
    />
  </form>
</template>
