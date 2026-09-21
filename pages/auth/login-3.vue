<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  layout: 'empty',
  title: 'ورود',
  preview: {
    title: 'ورود ۴',
    description: 'برای احراز هویت و ورود',
    categories: ['چیدمان‌ها', 'احراز هویت'],
    src: '/img/screens/auth-login-4.png',
    srcDark: '/img/screens/auth-login-4-dark.png',
    order: 154,
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
  <div class="flex h-screen w-full flex-col items-center md:flex-row">
    <div
      class="bg-muted-100 dark:bg-muted-900 hidden h-screen w-full md:w-1/2 lg:block xl:w-2/3"
    >
      <div
        class="mx-auto flex size-full max-w-4xl items-center justify-center"
      >
        <!--Media image-->
        <img
          class="mx-auto max-w-xl"
          src="/img/illustrations/people.svg"
          alt=""
          width="1200"
          height="996"
        >
      </div>
    </div>

    <div
      class="dark:bg-muted-800 flex h-screen w-full items-center justify-center bg-white px-6 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full lg:px-16 xl:w-1/3 xl:px-12"
    >
      <div
        class="mx-auto flex size-full max-w-xs flex-col items-center justify-between py-8"
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
        <div class="w-full">
          <BaseHeading
            as="h2"
            size="3xl"
            weight="medium"
          >
            خوش آمدید دوباره!
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400 mb-6">
            برای ورود به حساب خود، مشخصات حساب خود را وارد کنید
          </BaseParagraph>

          <form
            method="POST"
            action=""
            class="mt-6"
            novalidate
            @submit.prevent="onSubmit"
          >
            <div class="space-y-4">
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
                  icon="ph:user-duotone"
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
                  icon="ph:lock-duotone"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>
            </div>

            <!--Remember-->
            <div class="mt-6 flex items-center justify-between">
              <Field
                v-slot="{ field, handleChange, handleBlur }"
                name="trustDevice"
              >
                <BaseCheckbox
                  :model-value="field.value"
                  :disabled="isSubmitting"
                  rounded="sm"
                  label="اعتماد برای ۶۰ روز"
                  color="primary"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                />
              </Field>

              <div class="text-sm leading-5">
                <NuxtLink
                  to="/auth/recover"
                  class="text-primary-600 hover:text-primary-500 font-sans text-xs font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
                >
                  رمز عبور خود را فراموش کرده‌اید؟
                </NuxtLink>
              </div>
            </div>

            <!--Submit-->
            <div class="mt-6">
              <div class="block w-full rounded-md shadow-sm">
                <BaseButton
                  :disabled="isSubmitting"
                  :loading="isSubmitting"
                  type="submit"
                  color="primary"
                  class="!h-11 w-full"
                >
                  ورود
                </BaseButton>
              </div>
            </div>
          </form>

          <hr
            class="border-muted-200 dark:border-muted-700 my-6 w-full border-t"
          >

          <BaseButton class="!h-11 w-full">
            <Icon name="logos:google-icon" class="me-1 size-4" />
            <span>با گوگل وارد شوید</span>
          </BaseButton>

          <!--No account link-->
          <p
            class="text-muted-400 mt-4 flex justify-between font-sans text-xs leading-5"
          >
            <span>حساب کاربری ندارید؟</span>
            <NuxtLink
              to="/auth/signup-1"
              class="text-primary-600 hover:text-primary-500 font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline"
            >
              ایجاد حساب
            </NuxtLink>
          </p>
        </div>
        <div class="text-center">
          <BaseText size="xs" class="text-muted-400">
            © {{ new Date().getFullYear() }} تایرو. تمامی حقوق محفوظ است.
          </BaseText>
        </div>
      </div>
    </div>
  </div>
</template>
