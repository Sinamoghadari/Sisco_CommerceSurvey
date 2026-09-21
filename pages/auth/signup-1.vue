<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

import { AddonInputPassword } from '#components'

definePageMeta({
  layout: 'empty',
  title: 'ثبت‌نام',
  preview: {
    title: 'ثبت‌نام 1',
    description: 'برای احراز هویت و ثبت‌نام',
    categories: ['چیدمان‌ها', 'احراز هویت'],
    src: '/img/screens/auth-signup-1.png',
    srcDark: '/img/screens/auth-signup-1-dark.png',
    order: 157,
  },
})

const passwordRef = ref<InstanceType<typeof AddonInputPassword>>()

const VALIDATION_TEXT = {
  EMAIL_REQUIRED: 'یک ایمیل معتبر لازم است',
  USERNAME_LENGTH: 'نام کاربری باید حداقل ۳ کاراکتر باشد',
  PASSWORD_LENGTH: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
  PASSWORD_CONTAINS_EMAIL: 'رمز عبور نمی‌تواند شامل ایمیل شما باشد',
  PASSWORD_MATCH: 'رمزهای عبور مطابقت ندارند',
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    username: z.string().min(3, VALIDATION_TEXT.USERNAME_LENGTH),
    email: z.string().email(VALIDATION_TEXT.EMAIL_REQUIRED),
    password: z.string().min(8, VALIDATION_TEXT.PASSWORD_LENGTH),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    // This is a custom validation function that will be called
    // before the form is submitted
    if (passwordRef.value?.validation?.feedback?.warning || passwordRef.value?.validation?.feedback?.suggestions?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: passwordRef.value?.validation?.feedback?.warning || passwordRef.value.validation.feedback?.suggestions?.[0],
        path: ['password'],
      })
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.PASSWORD_MATCH,
        path: ['confirmPassword'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  username: 'maya',
  email: '',
  password: '',
  confirmPassword: '',
} satisfies FormInput

const { values, handleSubmit, isSubmitting, setFieldError } = useForm({
  validationSchema,
  initialValues,
})

const router = useRouter()
const toaster = useToaster()

// This is where you would send the form data to the server
const onSubmit = handleSubmit(async (values) => {
  // here you have access to the validated form values
  console.log('auth-success', values)

  try {
    // fake delay, this will make isSubmitting value to be true
    await new Promise((resolve, reject) => {
      if (values.username === 'maya') {
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
      message: `حساب برای ${values.username} ایجاد شد`,
      color: 'success',
      icon: 'ph:user-circle-fill',
      closable: true,
    })
    router.push('/layouts/onboarding-1')
  }
  catch (error: any) {
    // this will set the error on the form
    if (error.message === 'خطای اعتبارسنجی جعلی در بک‌اند') {
      setFieldError('username', 'این نام کاربری قبلاً گرفته شده است')
    }
  }
})
</script>

<template>
  <div class="h-screen md:flex">
    <div
      class="from-primary-900 to-primary-500 i group relative hidden w-1/2 items-center justify-around overflow-hidden bg-gradient-to-tr md:flex"
    >
      <div class="mx-auto max-w-xs text-center">
        <BaseHeading
          as="h2"
          size="3xl"
          weight="medium"
          class="text-white"
        >
          حساب دارید؟
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-200 mb-3">
          نیازی به هدر دادن زمان در این صفحه نیست، بگذارید شما را به حساب کاربری‌تان برگردانیم
        </BaseParagraph>
        <BaseButton
          to="/auth/login-1"
          rounded="lg"
          class="w-full"
        >
          وارد حساب شوید
        </BaseButton>
      </div>
      <div
        class="bg-muted-200/20 absolute -start-6 -top-6 h-14 w-0 rounded-full transition-all delay-[25ms] duration-300 group-hover:w-72 ltr:origin-top-left ltr:rotate-45 rtl:origin-top-right rtl:-rotate-45"
      />
      <div
        class="bg-muted-200/20 absolute -top-12 start-20 h-14 w-0 rounded-full transition-all delay-75 duration-300 group-hover:w-48 ltr:origin-top-left ltr:rotate-45 rtl:origin-top-right rtl:-rotate-45"
      />
      <div
        class="bg-muted-200/20 absolute -start-7 top-24 h-14 w-0 rounded-full transition-all delay-150 duration-300 group-hover:w-40 ltr:origin-top-left ltr:rotate-45 rtl:origin-top-right rtl:-rotate-45"
      />

      <div
        class="bg-muted-200/20 absolute -bottom-6 -end-6 h-14 w-0 rounded-full transition-all delay-150 duration-300 group-hover:w-72 ltr:origin-bottom-right ltr:rotate-45 rtl:origin-bottom-left rtl:-rotate-45"
      />
      <div
        class="bg-muted-200/20 absolute -bottom-12 end-20 h-14 w-0 rounded-full transition-all delay-75 duration-300 group-hover:w-48 ltr:origin-bottom-right ltr:rotate-45 rtl:origin-bottom-left rtl:-rotate-45"
      />
      <div
        class="bg-muted-200/20 absolute -end-7 bottom-24 h-14 w-0 rounded-full transition-all delay-[25ms] duration-300 group-hover:w-40 ltr:origin-bottom-right ltr:rotate-45 rtl:origin-bottom-left rtl:-rotate-45"
      />
    </div>
    <div
      class="dark:bg-muted-900 flex flex-col items-center justify-between bg-white py-10 md:w-1/2"
    >
      <div class="mx-auto flex w-full max-w-xs items-center justify-between">
        <NuxtLink
          to="/dashboards"
          class="text-muted-400 hover:text-primary-500 dark:text-muted-700 dark:hover:text-primary-500 transition-colors duration-300"
        >
          <TairoLogo class="size-10" />
        </NuxtLink>
        <div>
          <BaseThemeToggle />
        </div>
      </div>
      <form
        method="POST"
        action=""
        class="mx-auto w-full max-w-xs"
        novalidate
        @submit.prevent="onSubmit"
      >
        <BaseHeading
          as="h2"
          size="3xl"
          weight="medium"
        >
          به تایرو خوش آمدید
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-400 mb-6">
          بیایید با ایجاد حساب شما شروع کنیم
        </BaseParagraph>

        <div class="mb-4 space-y-3">
          <Field
            v-slot="{ field, errorMessage, handleChange, handleBlur }"
            name="username"
          >
            <BaseInput
              :model-value="field.value"
              :error="errorMessage"
              :disabled="isSubmitting"
              type="text"
              rounded="lg"
              placeholder="نام کاربری"
              icon="ph:fingerprint-duotone"
              @update:model-value="handleChange"
              @blur="handleBlur"
            />
          </Field>
          <Field
            v-slot="{ field, errorMessage, handleChange, handleBlur }"
            name="email"
          >
            <BaseInput
              :model-value="field.value"
              :error="errorMessage"
              :disabled="isSubmitting"
              type="email"
              rounded="lg"
              placeholder="آدرس ایمیل"
              icon="ph:at-duotone"
              @update:model-value="handleChange"
              @blur="handleBlur"
            />
          </Field>
          <Field
            v-slot="{ field, errorMessage, handleChange, handleBlur }"
            name="password"
          >
            <AddonInputPassword
              ref="passwordRef"
              :model-value="field.value"
              :error="errorMessage"
              :disabled="isSubmitting"
              :user-inputs="[values.username ?? '', values.email ?? '']"
              rounded="lg"
              placeholder="رمز عبور"
              icon="ph:lock-duotone"
              @update:model-value="handleChange"
              @blur="handleBlur"
            />
          </Field>
          <Field
            v-slot="{ field, errorMessage, handleChange, handleBlur }"
            name="confirmPassword"
          >
            <BaseInput
              :model-value="field.value"
              :error="errorMessage"
              :disabled="isSubmitting"
              type="password"
              rounded="lg"
              placeholder="تأیید رمز عبور"
              icon="ph:check"
              @update:model-value="handleChange"
              @blur="handleBlur"
            />
          </Field>
        </div>
        <BaseButton
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          rounded="lg"
          color="primary"
          class="!h-11 w-full"
        >
          ایجاد حساب
        </BaseButton>
        <!--No account link-->
        <p
          class="text-muted-400 mt-4 flex justify-between font-sans text-sm leading-5"
        >
          <span>حساب کاربری دارید؟</span>
          <NuxtLink
            to="/auth/login-1"
            class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline focus:underline focus:outline-none"
          >
            اینجا وارد شوید
          </NuxtLink>
        </p>
      </form>
      <div class="text-center">
        <BaseText size="sm" class="text-muted-400">
          © {{ new Date().getFullYear() }} تایرو. تمامی حقوق محفوظ است.
        </BaseText>
      </div>
    </div>
  </div>
</template>
