<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  layout: 'empty',
  title: 'ورود',
  preview: {
    title: 'ورود ۳',
    description: 'برای احراز هویت و ورود',
    categories: ['چیدمان‌ها', 'احراز هویت'],
    src: '/img/screens/auth-login-3.png',
    srcDark: '/img/screens/auth-login-3-dark.png',
    order: 153,
  },
})

const VALIDATION_TEXT = {
  EMAIL_REQUIRED: 'یک ایمیل معتبر لازم است',
  PASSWORD_REQUIRED: 'یک رمز عبور لازم است',
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z.object({
  email: z.string().email(VALIDATION_TEXT.EMAIL_REQUIRED),
  password: z.string().min(1, VALIDATION_TEXT.PASSWORD_REQUIRED),
  trustDevice: z.boolean(),
})

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  email: '',
  password: '',
  trustDevice: false,
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

const router = useRouter()
const toaster = useToaster()

// This is where you would send the form data to the server
const onSubmit = handleSubmit(async (values) => {
  // here you have access to the validated form values
  console.log('auth-success', values)

  try {
    // fake delay, this will make isSubmitting value to be true
    await new Promise((resolve, reject) => {
      if (values.password !== 'password') {
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
      message: `خوش آمدید دوباره!`,
      color: 'success',
      icon: 'ph:user-circle-fill',
      closable: true,
    })
  }
  catch (error: any) {
    // this will set the error on the form
    if (error.message === 'خطای اعتبارسنجی جعلی در بک‌اند') {
      setFieldError('password', 'اعتبارات نامعتبر (از "password" استفاده کنید)')
    }
    return
  }

  router.push('/dashboards')
})
</script>

<template>
  <div
    class="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-hidden px-4"
  >
    <div
      class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4"
    >
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
    <div class="flex w-full items-center justify-center">
      <div class="relative mx-auto w-full max-w-2xl">
        <!--Form-->
        <div class="me-auto ms-auto mt-4 w-full">
          <form
            method="POST"
            action=""
            class="me-auto ms-auto mt-4 w-full max-w-md"
            novalidate
            @submit.prevent="onSubmit"
          >
            <div class="text-center">
              <BaseHeading
                as="h2"
                size="3xl"
                weight="medium"
              >
                خوش آمدید دوباره!
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400 mb-6">
                با استفاده از رسانه‌های اجتماعی یا اطلاعات ورود خود وارد شوید.
              </BaseParagraph>
            </div>
            <div class="px-8 py-4">
              <div class="mb-4 space-y-4">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="email"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="email"
                    label="آدرس ایمیل"
                    placeholder="آدرس ایمیل"
                    :classes="{
                      input: 'h-12',
                    }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="password"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="password"
                    label="رمز عبور"
                    placeholder="رمز عبور"
                    :classes="{
                      input: 'h-12',
                    }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="mb-6">
                <div class="mt-6 flex items-center justify-between">
                  <Field
                    v-slot="{ field, handleChange, handleBlur }"
                    name="trustDevice"
                  >
                    <BaseCheckbox
                      :model-value="field.value"
                      :disabled="isSubmitting"
                      rounded="sm"
                      label="به این دستگاه برای ۶۰ روز اعتماد کنید"
                      color="primary"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </Field>
                </div>
              </div>
              <div class="mb-6">
                <BaseButton
                  :disabled="isSubmitting"
                  :loading="isSubmitting"
                  type="submit"
                  color="primary"
                  class="!h-12 w-full"
                >
                  ورود
                </BaseButton>
              </div>
              <div class="mb-6 grid gap-0 sm:grid-cols-3">
                <hr
                  class="border-muted-200 dark:border-muted-700 mt-3 hidden border-t sm:block"
                >
                <span
                  class="bg-muted-100 dark:bg-muted-900 text-muted-400 relative top-0.5 text-center font-sans text-sm"
                >
                  یا ادامه دهید با
                </span>
                <hr
                  class="border-muted-200 dark:border-muted-700 mt-3 hidden border-t sm:block"
                >
              </div>
              <!--Social signup-->
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  class="bg-muted-200 dark:bg-muted-700 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 nui-focus relative inline-flex w-full items-center justify-center rounded px-0 py-3 text-center text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-white"
                >
                  <Icon name="fa6-brands:google" class="size-5" />
                </button>
                <button
                  type="button"
                  class="bg-muted-200 dark:bg-muted-700 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 nui-focus relative inline-flex w-full items-center justify-center rounded px-0 py-3 text-center text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-white"
                >
                  <Icon name="fa6-brands:twitter" class="size-5" />
                </button>
                <button
                  type="button"
                  class="bg-muted-200 dark:bg-muted-700 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 nui-focus relative inline-flex w-full items-center justify-center rounded px-0 py-3 text-center text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-white"
                >
                  <Icon name="fa6-brands:linkedin-in" class="size-5" />
                </button>
              </div>

              <!--No account link-->
              <p
                class="text-muted-400 mt-4 flex justify-between font-sans text-sm leading-5"
              >
                <span>حساب کاربری ندارید؟</span>
                <NuxtLink
                  to="/auth/signup-2"
                  class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
                >
                  ثبت‌نام
                </NuxtLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
