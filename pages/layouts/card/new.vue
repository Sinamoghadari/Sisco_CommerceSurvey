<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({
  title: 'کارت جدید',
  layout: 'empty',
  preview: {
    title: 'ویزارد کارت',
    description: 'برای ایجاد کارت جدید',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-card-new.png',
    srcDark: '/img/screens/layouts-card-new-dark.png',
    order: 14,
    new: true,
  },
})

const complete = ref(false)
const accounts = ref([
  {
    id: 1,
    type: 'جاری',
    label: '**** 4897',
    number: '1487 3256 54122 4897',
    balance: 9543.12,
  },
  {
    id: 2,
    type: 'جاری',
    label: '**** 4869',
    number: '3524 65456 3245 4869',
    balance: 1211.67,
  },
  {
    id: 3,
    type: 'پس‌انداز',
    label: '**** 6279',
    number: '3524 65456 3245 6279',
    balance: 4653.97,
  },
])

// This is the object that will contain the validation messages
const VALIDATION_TEXT = {
  DAILY_SPEND_REQUIRED: 'محدودیت هزینه روزانه را تعریف کنید',
  DAILY_WITHDRAW_REQUIRED: 'محدودیت برداشت روزانه را تعریف کنید',
  DAILY_LIMIT: 'شما باید حداقل ۵۰ تومان برای خرج کردن روزانه مجاز کنید.',
  ACCOUNT_SELECTION: 'باید یک حساب کاربری را انتخاب کنید',
  OWNER_SELECTION: 'باید یک مالک را انتخاب کنید',
  BRAND_SELECTION: 'شما باید یک برند کارت انتخاب کنید',
  TYPE_SELECTION: 'باید نوع کارت را انتخاب کنید',
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z
  .object({
    owner: z.string().min(1, VALIDATION_TEXT.OWNER_SELECTION),
    account: z
      .object({
        id: z.number(),
        number: z.string(),
        type: z.string(),
        label: z.string(),
        balance: z.number(),
      })
      .nullable(),
    brand: z.string().min(1, VALIDATION_TEXT.BRAND_SELECTION),
    type: z.string().min(1, VALIDATION_TEXT.TYPE_SELECTION),
    dailySpend: z.number(),
    dailyWithdraw: z.number(),
  })
  .superRefine((data, ctx) => {
    // This is a custom validation function that will be called
    // before the form is submitted
    if (data.account === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.ACCOUNT_SELECTION,
        path: ['account'],
      })
    }
    if (data.dailySpend === null || data.dailySpend <= 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.DAILY_LIMIT,
        path: ['dailySpend'],
      })
    }
    if (data.dailyWithdraw === null || data.dailyWithdraw <= 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_TEXT.DAILY_LIMIT,
        path: ['dailyWithdraw'],
      })
    }
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
  owner: '',
  account: null,
  brand: '',
  type: '',
  dailySpend: 0,
  dailyWithdraw: 0,
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

// Ask the user for confirmation before leaving the page if the form has unsaved changes
onBeforeRouteLeave(() => {
  if (meta.value.dirty && !success.value) {
    return confirm('تغییرات ذخیره نشده دارید. آیا مطمئنید که می‌خواهید ترک کنید؟')
  }
})

const toaster = useToaster()

// This is where you would send the form data to the server
const onSubmit = handleSubmit(
  async (values) => {
    success.value = false

    // here you have access to the validated form values
    console.log('card-create-success', values)

    try {
      // fake delay, this will make isSubmitting value to be true
      await new Promise((resolve, reject) => {
        if (values.dailySpend && values.dailySpend > 5000) {
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
        message: `کارت ایجاد شده است!`,
        color: 'success',
        icon: 'ph:check',
        closable: true,
      })
    }
    catch (error: any) {
      // this will set the error on the form
      if (error.message === 'خطای اعتبارسنجی جعلی در بک‌اند') {
        setFieldError('dailySpend', 'حداکثر محدودیت مجاز ۵۰۰۰ تومان است')

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

    // resetForm()

    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    success.value = true
  },
  (error) => {
    // this callback is optional and called only if the form has errors
    success.value = false

    // here you have access to the error
    console.log('card-create-error', error)

    // you can use it to scroll to the first error
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
)
</script>

<template>
  <div class="dark:bg-muted-900 bg-muted-50 min-h-screen">
    <DemoNavigationTop title="کارت جدید" close-to="/layouts/cards" />

    <div class="w-full pb-20 pt-32">
      <div class="mx-auto w-full max-w-6xl px-4">
        <div v-if="!success">
          <form
            action=""
            method="POST"
            class="ltablet:gap-16 grid w-full gap-8 md:grid-cols-12 lg:gap-16"
            @submit.prevent="onSubmit"
          >
            <!--Content column-->
            <div class="md:col-span-7 lg:col-span-7">
              <div class="w-full max-w-md">
                <div class="pb border-muted-200 dark:border-muted-800 border-b">
                  <BaseHeading
                    size="xl"
                    weight="medium"
                    class="text-muted-800 mb-8 dark:text-white"
                  >
                    کارت اعتباری جدید
                  </BaseHeading>
                </div>

                <div v-if="fieldsWithErrors" class="mt-8">
                  <BaseMessage
                    color="warning"
                    icon
                    @close="() => setErrors({})"
                  >
                    این فرم دارای {{ fieldsWithErrors }} خطا است، لطفاً قبل از ارسال آن‌ها را مرور کنید.
                  </BaseMessage>
                </div>

                <div
                  class="divide-muted-200 dark:divide-muted-800 space-y-8 divide-y"
                >
                  <!--Field-->
                  <div class="pt-8">
                    <BaseHeading
                      as="h4"
                      size="sm"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-400 mb-1"
                    >
                      حساب مرتبط
                    </BaseHeading>
                    <!--Dropdown-->
                    <BaseDropdown rounded="lg" :classes="{ menuWrapper: 'w-full [&>div]:end-0', menu: '!w-full' }">
                      <template #button="{ open }">
                        <BaseButton
                          size="xl"
                          rounded="lg"
                          class="!h-auto w-full !p-4"
                          :class="[errors.account ? '!border-danger-500' : '']"
                        >
                          <span class="flex w-full items-center gap-3 text-start">
                            <TairoLogo v-if="values?.account" class="text-primary-500 size-8" />
                            <Icon
                              v-else
                              name="lucide:wallet"
                              class="text-muted-500 mx-1 my-2 size-6"
                            />
                            <div v-if="values?.account">
                              <BaseText
                                size="sm"
                                class="text-muted-800 dark:text-muted-200 block capitalize"
                              >
                                {{ values.account.type }} {{ values.account.label }}
                              </BaseText>
                              <BaseText
                                size="xs"
                                class="text-muted-500 dark:text-muted-400 block"
                              >
                                {{ values.account.balance?.toFixed(2) }} تومان
                              </BaseText>
                            </div>
                            <span v-else>
                              یک حساب را انتخاب کنید
                            </span>
                            <Icon
                              name="lucide:chevron-down"
                              class="text-muted-400 ms-auto size-4 transition-transform duration-300"
                              :class="open && 'rotate-180'"
                            />
                          </span>
                        </BaseButton>
                      </template>
                      <BaseDropdownItem
                        v-for="account in accounts.filter((account) => account.id !== values?.account?.id)"
                        :key="account.id"
                        :title="`${account.type} ${account.label}`"
                        :text="`${account.balance.toFixed(2)} تومان`"
                        @click="setFieldValue('account', account)"
                      >
                        <template #start>
                          <TairoLogo
                            class="text-muted-300 dark:text-muted-700 group-hover:text-primary-500 size-8"
                          />
                        </template>
                      </BaseDropdownItem>
                    </BaseDropdown>

                    <BaseInputHelpText v-if="errors.account" color="danger">
                      {{ errors.account }}
                    </BaseInputHelpText>
                  </div>
                  <!--Field-->
                  <div class="pt-8">
                    <BaseHeading
                      as="h4"
                      size="sm"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-400 mb-1"
                    >
                      این کارت برای کیست؟
                    </BaseHeading>
                    <!--Select-->
                    <div class="relative">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="owner"
                      >
                        <BaseSelect
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          placeholder="یک نفر را انتخاب کنید"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        >
                          <option value="مایا روسلینی">
                            مایا روسلینی
                          </option>
                          <option value="کالب ویلسون">
                            کالب ویلسون
                          </option>
                          <option value="امبر ویلسون">
                            امبر ویلسون
                          </option>
                          <option value="جنیفر ویلسون">
                            جنیفر ویلسون
                          </option>
                          <option value="جان باکستر">
                            جان باکستر
                          </option>
                        </BaseSelect>
                      </Field>
                    </div>
                  </div>
                  <!--Field-->
                  <div class="pt-8">
                    <BaseHeading
                      as="h4"
                      size="sm"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-400 mb-1"
                    >
                      چه نوع کارتی نیاز دارید؟
                    </BaseHeading>
                    <!--Select-->
                    <div class="relative">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="brand"
                      >
                        <BaseSelect
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          placeholder="انتخاب برند کارت"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        >
                          <option value="visa">
                            ویزا
                          </option>
                          <option value="mastercard">
                            مسترکارت
                          </option>
                        </BaseSelect>
                      </Field>
                    </div>
                  </div>
                  <!--Field-->
                  <div class="pt-8">
                    <BaseHeading
                      as="h4"
                      size="sm"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-400 mb-1"
                    >
                      این کارت از چه نوعی است؟
                    </BaseHeading>
                    <!--Select-->
                    <div class="group relative">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="type"
                      >
                        <BaseSelect
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          placeholder="یک نوع کارت انتخاب کنید"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        >
                          <option value="فیزیکی">
                            فیزیکی
                          </option>
                          <option value="مجازی">
                            مجازی
                          </option>
                        </BaseSelect>
                      </Field>
                    </div>
                  </div>
                  <!--Field-->
                  <div class="pt-8">
                    <BaseHeading
                      as="h4"
                      size="sm"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-400 mb-1"
                    >
                      محدودیت هزینه روزانه چقدر است؟
                    </BaseHeading>
                    <!--Select-->
                    <div class="relative">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="dailySpend"
                      >
                        <BaseInputNumber
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          icon="lucide:dollar-sign"
                          placeholder="0.00"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        />
                      </Field>
                    </div>
                  </div>
                  <!--Field-->
                  <div class="pt-8">
                    <BaseHeading
                      as="h4"
                      size="sm"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-400 mb-1"
                    >
                      محدودیت برداشت روزانه چقدر است؟
                    </BaseHeading>
                    <!--Select-->
                    <div class="relative">
                      <Field
                        v-slot="{
                          field,
                          errorMessage,
                          handleChange,
                          handleBlur,
                        }"
                        name="dailyWithdraw"
                      >
                        <BaseInputNumber
                          :model-value="field.value"
                          :error="errorMessage"
                          :disabled="isSubmitting"
                          icon="lucide:dollar-sign"
                          placeholder="0.00"
                          @update:model-value="handleChange"
                          @blur="handleBlur"
                        />
                      </Field>
                    </div>
                  </div>
                  <!--Buttons-->
                  <div class="flex flex-col-reverse gap-4 py-8 sm:flex-row">
                    <div
                      class="inline-flex h-12 w-full items-center justify-center"
                    >
                      <BaseParagraph
                        size="sm"
                        class="text-muted-600 dark:text-muted-400"
                      >
                        کارت طی ۱-۲ روز کاری فعال خواهد شد.
                      </BaseParagraph>
                    </div>
                    <BaseButton
                      type="submit"
                      color="primary"
                      size="lg"
                      rounded="md"
                      class="w-full"
                      :loading="isSubmitting"
                    >
                      صدور کارت جدید
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>

            <!--Card column-->
            <div class="relative md:col-span-5 lg:col-span-5">
              <!--Tabs-->
              <div class="sticky top-20">
                <DemoCreditCardReal
                  status="active"
                  :name="values?.owner"
                  :number="values?.account?.number"
                  :brand="values?.brand"
                  contrast="high"
                />
              </div>
            </div>
          </form>
        </div>

        <!--Success section-->
        <div v-else>
          <div class="mx-auto w-full max-w-md py-6 text-center">
            <div class="text-primary-500 mx-auto mb-4 size-14">
              <TairoCheckAnimated color="primary" size="lg" />
            </div>
            <BaseHeading
              as="h2"
              weight="medium"
              size="2xl"
              lead="tight"
              class="text-muted-800 mb-2 dark:text-white"
            >
              کارت اعتباری ایجاد شد!
            </BaseHeading>
            <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-5">
              عالی! شما کارت جدید خود را به درستی ایجاد کرده‌اید. به محض ارسال آن به شما، اطلاع خواهیم داد.
            </BaseParagraph>
            <div class="flex justify-center">
              <BaseButton
                to="/layouts/cards"
                color="primary"
                rounded="md"
                class="w-48"
              >
                بازگشت به کارت‌ها
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
