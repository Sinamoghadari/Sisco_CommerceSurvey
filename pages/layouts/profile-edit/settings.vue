<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import IMask, { type InputMask } from 'imask'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

const VALIDATION_TEXT = {
  OLD_PASSWORD_REQUIRED: 'رمز عبور فعلی شما مورد نیاز است',
  NEW_PASSWORD_LENGTH: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
  NEW_PASSWORD_MATCH: 'رمزهای عبور مطابقت ندارند',
}

definePageMeta({
  title: 'تنظیمات',
  preview: {
    title: 'ویرایش پروفایل 4',
    description: 'برای ویرایش پروفایل کاربر',
    categories: ['چیدمان‌ها', 'پروفایل', 'فرم‌ها'],
    src: '/img/screens/layouts-subpages-profile-edit-4.png',
    srcDark: '/img/screens/layouts-subpages-profile-edit-4-dark.png',
    order: 79,
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

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    currentPassword: z.string().min(1, VALIDATION_TEXT.OLD_PASSWORD_REQUIRED),
    newPassword: z.string(),
    confirmPassword: z.string(),
    twoFactor: z.object({
      enabled: z.boolean(),
      phoneNumber: z.string().optional(),
    }),
    notifications: z.object({
      enabled: z.boolean(),
      flushLowPriority: z.boolean(),
      marketing: z.boolean(),
      partners: z.boolean(),
    }),
  })
  .superRefine((data, ctx) => {
    // This is a custom validation function that will be called
    // before the form is submitted

    if (data.newPassword) {
      if (data.newPassword.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_TEXT.NEW_PASSWORD_LENGTH,
          path: ['newPassword'],
        })
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_TEXT.NEW_PASSWORD_MATCH,
          path: ['confirmPassword'],
        })
      }
    }

    if (data.twoFactor.enabled && !data.twoFactor.phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A phone number is required',
        path: ['twoFactor.phoneNumber'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const { data, pending, error, refresh } = await useFetch('/api/profile')

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  currentPassword: 'password',
  newPassword: '',
  confirmPassword: '',
  twoFactor: {
    enabled: false,
    phoneNumber: '',
  },
  notifications: {
    enabled: true,
    flushLowPriority: true,
    marketing: false,
    partners: false,
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

// Here we register the phone number input with IMask
const phoneInput = ref<any>()
const mask = shallowRef<InputMask<{ mask: string }> | undefined>(undefined)
onMounted(() => {
  mask.value = IMask(phoneInput.value?.el, {
    mask: '(000) 000-0000',
  })
})
onBeforeUnmount(() => {
  mask.value?.destroy()
  mask.value = undefined
})

// Reset notifications when the user disables them
watch(
  () => values.notifications?.enabled,
  (value) => {
    if (!value) {
      setFieldValue('notifications.flushLowPriority', false)
      setFieldValue('notifications.marketing', false)
      setFieldValue('notifications.partners', false)
    }
  },
)

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
    console.log('profile-settings-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.currentPassword === 'password') {
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
        setFieldError('currentPassword', 'رمز عبور فعلی شما اشتباه است')

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
    console.log('profile-settings-error', error)

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
            تنظیمات
          </BaseHeading>
          <BaseText size="xs" class="text-muted-400">
            ویرایش ترجیحات و تنظیمات حساب کاربری شما
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
            تنظیمات شما ذخیره شد!
          </BaseMessage>
          <BaseMessage
            v-if="fieldsWithErrors"
            type="danger"
            @close="() => setErrors({})"
          >
            این فرم دارای {{ fieldsWithErrors }} خطا است، لطفاً قبل از ارسال آنها را بررسی کنید.
          </BaseMessage>

          <TairoFormGroup
            label="تغییر گذرواژه"
            sublabel="برای امنیت بهتر حساب کاربری"
          >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="currentPassword"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="password"
                    icon="ph:lock-duotone"
                    placeholder="رمز عبور قدیمی"
                    autocomplete="current-password"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="newPassword"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="password"
                    icon="ph:lock-duotone"
                    placeholder="رمز عبور جدید"
                    autocomplete="new-password"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div class="col-span-12">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="confirmPassword"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="password"
                    icon="ph:lock-duotone"
                    placeholder="تکرار رمز عبور جدید"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </TairoFormGroup>
          <TairoFormGroup
            label="دو عاملی احراز هویت"
            sublabel="احراز هویت دو مرحله‌ای"
          >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <Field
                  v-slot="{ field, handleChange, handleBlur }"
                  name="twoFactor.enabled"
                >
                  <BaseSwitchThin
                    :model-value="field.value"
                    :disabled="isSubmitting"
                    label="فعال شده"
                    sublabel="فعال/غیرفعال کردن تأیید هویت دو مرحله‌ای"
                    color="primary"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div
                v-show="values.twoFactor?.enabled"
                class="col-span-12"
                dir="ltr"
              >
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="twoFactor.phoneNumber"
                >
                  <BaseInput
                    ref="phoneInput"
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="tel"
                    icon="ph:phone-duotone"
                    placeholder="شماره تلفن"
                    autocomplete="tel"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
            </div>
          </TairoFormGroup>
          <TairoFormGroup
            label="اطلاعیه‌ها"
            sublabel="پیکربندی نحوه دریافت اعلان‌ها"
          >
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <Field
                  v-slot="{ field, handleChange, handleBlur }"
                  name="notifications.enabled"
                >
                  <BaseSwitchBall
                    :model-value="field.value"
                    :disabled="isSubmitting"
                    label="فعال شده"
                    sublabel="دریافت اعلان‌های ایمیلی از برنامه"
                    color="primary"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div v-show="values.notifications?.enabled" class="col-span-12">
                <Field
                  v-slot="{ field, handleChange, handleBlur }"
                  name="notifications.flushLowPriority"
                >
                  <BaseSwitchBall
                    :model-value="field.value"
                    :disabled="isSubmitting"
                    label="تخلیه"
                    sublabel="حذف اعلان‌های کم‌اهمیت"
                    color="primary"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div v-show="values.notifications?.enabled" class="col-span-12">
                <Field
                  v-slot="{ field, handleChange, handleBlur }"
                  name="notifications.marketing"
                >
                  <BaseSwitchBall
                    :model-value="field.value"
                    :disabled="isSubmitting"
                    label="بازاریابی"
                    sublabel="فعال‌سازی ایمیل‌های تبلیغاتی"
                    color="primary"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>
              </div>
              <div v-show="values.notifications?.enabled" class="col-span-12">
                <Field
                  v-slot="{ field, handleChange, handleBlur }"
                  name="notifications.partners"
                >
                  <BaseSwitchBall
                    :model-value="field.value"
                    :disabled="isSubmitting"
                    label="شرکا"
                    sublabel="فعال‌سازی ایمیل‌های شرکای تجاری"
                    color="primary"
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
