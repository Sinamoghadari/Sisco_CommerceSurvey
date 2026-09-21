<script setup lang="ts">
import type { Invite, StepData } from '../../types'

definePageMeta({
  layout: 'empty',
})
useHead({
  titleTemplate: title => `${title} | دعوت - گام ${currentStepId.value + 1}`,
})

const initialState = ref<Invite>({
  firstName: '',
  lastName: '',
  email: '',
  role: null,
})

const toaster = useToaster()

const { handleSubmit, currentStepId, goToStep, progress, complete, steps } = provideMultiStepForm({
  initialState,
  steps: [
    {
      to: '/layouts/invite',
      meta: {
        name: 'دعوت از طریق ایمیل',
        title: 'چه کسی را می‌خواهید دعوت کنید؟',
        subtitle:
          'نام شخصی را که می‌خواهید به سازمان خود دعوت کنید وارد کنید',
      },
      async validate({ data, setFieldError, resetFieldError }) {
        resetFieldError(['email', 'firstName', 'lastName'])
        if (!data.value.email) setFieldError('email', 'آدرس ایمیل کاربر را وارد کنید')
        if (!data.value.firstName) setFieldError('firstName', 'نام کاربر را وارد کنید')
        if (!data.value.lastName) setFieldError('lastName', 'نام خانوادگی کاربر را وارد کنید')
      },
    },
    {
      to: '/layouts/invite/permissions',
      meta: {
        name: 'مجوزها',
        title: 'یک نقش به آن‌ها اختصاص دهید',
        subtitle:
          'نقش یک عضو تیم تعیین می‌کند که چه چیزی می‌تواند ببیند و چه کاری می‌تواند در حساب سازمان تایرو شما انجام دهد',
      },
      async validate({ data, setFieldError, resetFieldError }) {
        resetFieldError(['role'])
        if (!data.value.role) setFieldError('role', 'شما باید یک نقش انتخاب کنید')
      },
    },
    {
      to: '/layouts/invite/review',
      meta: {
        name: 'بازبینی',
        title: 'یک نگاه آخر',
        subtitle:
          'قبل از ارسال دعوت، مطمئن شوید که همه چیز در فرآیند درست است',
      },
    },
  ],
  onSubmit: async (data, ctx) => {
    // Simulate async request
    await new Promise(resolve => setTimeout(resolve, 4000))

    toaster.clearAll()
    toaster.show({
      title: 'موفقیت',
      message: `دعوت‌نامه ارسال شد!`,
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
  <div class="dark:bg-muted-900 min-h-screen bg-white">
    <DemoNavigationTop title="دعوت" close-to="/layouts/members" />

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
