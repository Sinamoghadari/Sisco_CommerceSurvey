<script setup lang="ts">
import type { PaymentSend, StepData } from '../../types'

definePageMeta({
  layout: 'empty',
})
useHead({
  titleTemplate: title => `${title} | ارسال پول - مرحله ${currentStepId.value + 1}`,
})

const initialState = ref<PaymentSend>({
  recipient: {
    name: '',
    picture: '',
    address: {
      lineOne: '',
      lineTwo: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'ایالات متحده',
    },
  },
  amount: 0,
  account: null,
  routingNumber: '',
  prefix: '',
  method: null,
})

const toaster = useToaster()

const { handleSubmit, currentStepId, progress, complete, steps, errors, goToStep } = provideMultiStepForm({
  initialState,
  steps: [
    {
      to: '/layouts/send',
      meta: {
        name: 'دریافت‌کننده',
        title: 'شما به چه کسی پرداخت می‌کنید؟',
        subtitle:
          'نام شخص یا شرکت مورد نظر برای ارسال پول را وارد کنید',
      } satisfies StepData,
      validate({ data, setFieldError, resetFieldError }) {
        resetFieldError('recipient.name')
        if (!data.value.recipient?.name) setFieldError('recipient.name', 'یک نام معتبر وارد کنید')
      },
    },
    {
      to: '/layouts/send/method',
      meta: {
        name: 'روش پرداخت',
        title: 'چگونه می‌خواهید پرداخت کنید؟',
        subtitle:
          'یکی از روش‌های پرداخت موجود را برای ادامه پرداخت انتخاب کنید',
      } satisfies StepData,
      validate({ data, setFieldError, resetFieldError }) {
        resetFieldError(['method'])
        if (!data.value?.method) {
          setFieldError('method', 'لطفا یک روش پرداخت انتخاب کنید')
        }
      },
    },
    {
      to: '/layouts/send/recipient',
      meta: {
        name: 'جزئیات دریافت‌کننده',
        title: 'جزئیات دریافت‌کننده',
        subtitle:
          'جزئیات مسیریابی دریافت‌کننده را وارد کنید تا پول به حساب آن‌ها ارسال شود',
      } satisfies StepData,
      validate({ data, setFieldError, resetFieldError }) {
        resetFieldError(['routingNumber'])
        if (!data.value.routingNumber) setFieldError('routingNumber', 'یک نام معتبر وارد کنید')
      },
    },
    {
      to: '/layouts/send/address',
      meta: {
        name: 'آدرس دریافت‌کننده',
        title: 'آدرس دریافت‌کننده',
        subtitle:
          'دریافت‌کننده شما باید آدرس قانونی داشته باشد تا بتوانید برای او پول ارسال کنید',
      } satisfies StepData,
      validate({ data, setFieldError, resetFieldError }) {
        resetFieldError([
          'recipient.address.lineOne',
          'recipient.address.city',
          'recipient.address.postalCode',
        ])
        if (!data.value.recipient?.address?.lineOne) setFieldError('recipient.address.lineOne', 'آدرسی وارد کنید')
        if (!data.value.recipient?.address?.city) setFieldError('recipient.address.city', 'یک شهر وارد کنید')
        if (!data.value.recipient?.address?.postalCode) setFieldError('recipient.address.postalCode', 'یک کد پستی وارد کنید')
      },
    },
    {
      to: '/layouts/send/amount',
      meta: {
        name: 'مقدار',
        title: 'یک مقدار برای انتقال تعیین کنید',
        subtitle:
          'مبلغی برای انتقال وارد کنید. این مبلغ نمی‌تواند از موجودی حساب انتخاب شده بیشتر باشد',
      } satisfies StepData,
      validate({ data, setFieldError, resetFieldError }) {
        resetFieldError([
          'amount',
          'account',
        ])
        if (!data.value.account) setFieldError('account', 'یک حساب را انتخاب کنید')

        if (data.value.amount <= 0) setFieldError('amount', 'یک مقدار مثبت وارد کنید')
        else if (data.value.account && data.value.amount > data.value.account.balance) setFieldError('amount', 'مقدار باید کمتر از موجودی باشد')
      },
    },
    {
      to: '/layouts/send/review',
      meta: {
        name: 'بازبینی',
        title: 'بررسی و ارسال',
        subtitle:
          'قبل از ارسال پول، مطمئن شوید که همه چیز در فرآیند درست است',
      } satisfies StepData,
    },
  ],
  onSubmit: async (state, ctx) => {
    // Simulate async request
    await new Promise(resolve => setTimeout(resolve, 4000))

    toaster.clearAll()
    toaster.show({
      title: 'موفقیت',
      message: `درخواست انتقال ارسال شد!`,
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
  },
  onError: (error) => {
    toaster.clearAll()
    toaster.show({
      title: 'خطا',
      message: error.message,
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  },
})
</script>

<template>
  <div class="dark:bg-muted-900 bg-muted-50 min-h-screen">
    <DemoNavigationTop title="ارسال پول" close-to="/layouts/payments" />

    <div class="w-full pb-20 pt-32">
      <div class="mx-auto w-full max-w-6xl px-4">
        <div class="grid w-full gap-10 md:grid-cols-12">
          <!--Stepper column-->
          <div :class="complete ? 'hidden' : 'md:col-span-3 lg:col-span-4'">
            <!--Stepper-->
            <div
              class="xs:w-full xs:max-w-xs xs:mx-auto flex flex-col gap-4 md:flex-row"
            >
              <div
                class="xs:max-w-xs xs:mx-auto relative flex justify-between gap-7 md:flex-col"
              >
                <!--Progress-->
                <div
                  class="xs:top-1.5 xs:inset-x-0 bg-muted-200 dark:bg-muted-700 absolute start-2 top-2 z-0 mx-auto h-1 w-[calc(100%_-_1rem)] md:h-[calc(100%_-_1rem)] md:w-1 ltr:md:-translate-x-1/2 rtl:md:translate-x-1/2"
                />
                <!--Vertical progress-->
                <div
                  class="bg-primary-500 absolute start-2 top-0 z-10 mx-auto hidden w-0.5 rounded-full transition-all duration-300 md:block ltr:-translate-x-1/2 rtl:translate-x-1/2"
                  :style="`height: ${progress}%;`"
                />
                <!--Horizontal progress (mobile)-->
                <div
                  class="bg-primary-500 absolute start-1.5 top-[7px] z-10 h-0.5 rounded-full transition-all duration-300 md:hidden"
                  :style="`width: calc(${progress}% - 0.5rem);`"
                />
                <!--Nodes-->
                <div
                  v-for="(step, index) in steps"
                  :key="index"
                  class="bg-muted-200 dark:bg-muted-700 relative z-20 flex size-4 items-center justify-center rounded-full"
                >
                  <span
                    class="bg-primary-500 block size-2 rounded-full transition-transform duration-300"
                    :class="currentStepId >= index ? 'scale-1' : 'scale-0'"
                  />
                </div>
              </div>
              <div
                class="relative flex justify-center gap-7 md:flex-col md:justify-between"
              >
                <a
                  v-for="(step, index) in steps"
                  :key="index"
                  class="h-4 leading-none"
                  role="button"
                  :tabindex="0"
                  :class="[currentStepId === index ? '' : 'xs:hidden', currentStepId > step.id ? 'nui-link' : 'cursor-default']"
                  @click.prevent="currentStepId > step.id ? goToStep(step) : () => {}"
                >
                  <span
                    class="font-heading block text-xs"
                    :class="
                      currentStepId === index
                        ? 'text-muted-800 dark:text-muted-100'
                        : 'text-muted-400 dark:text-muted-500'
                    "
                  >
                    {{ step.meta.name }}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <!--Steps column-->
          <div
            :class="complete ? 'col-span-12' : 'md:col-span-9 lg:col-span-8'"
          >
            <form
              action=""
              method="POST"
              novalidate
              @submit.prevent="handleSubmit"
            >
              <NuxtPage />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
