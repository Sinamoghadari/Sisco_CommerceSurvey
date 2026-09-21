<script setup lang="ts">
import type { Invite, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'دعوت - مرحله ۳',
    description: 'برای دعوت افراد',
    categories: ['چیدمان‌ها', 'ویزاردها', 'فرم‌ها'],
    src: '/img/screens/layouts-invite-review.png',
    srcDark: '/img/screens/layouts-invite-review-dark.png',
    order: 37,
    new: true,
  },
})
useHead({
  title: 'بازبینی',
})

const {
  data: request,
  currentStepId,
  loading,
  complete,
  getPrevStep,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<Invite, StepData>()

onBeforeMount(checkPreviousSteps)
</script>

<template>
  <div class="w-full">
    <div v-if="!complete">
      <div class="mb-8 space-y-2">
        <BaseHeading
          as="h2"
          size="2xl"
          weight="medium"
          class="md:!3xl text-muted-800 dark:text-white"
        >
          {{ steps[currentStepId].meta.title }}
        </BaseHeading>
        <BaseParagraph
          size="sm"
          class="text-muted-500 dark:text-muted-400 max-w-sm"
        >
          {{ steps[currentStepId].meta.subtitle }}
        </BaseParagraph>
      </div>

      <div class="w-full max-w-md">
        <div class="mb-6 w-full">
          <BaseCard
            rounded="md"
            class="p-8"
          >
            <div class="mb-6 flex items-center gap-3">
              <BaseAvatar
                :alt="request?.firstName"
                size="sm"
                rounded="none"
                mask="blob"
                :text="request?.firstName[0]"
                color="primary"
              />
              <div>
                <BaseHeading
                  v-if="request?.firstName && request?.lastName"
                  weight="medium"
                  size="md"
                  lead="none"
                  class="line-clamp-1"
                >
                  {{ request?.firstName }} {{ request?.lastName }}
                  <BaseTag
                    v-if="request.role"
                    rounded="lg"
                    class="capitalize"
                    size="sm"
                  >
                    {{ request?.role }}
                  </BaseTag>
                </BaseHeading>
                <BaseHeading
                  v-else
                  weight="medium"
                  size="md"
                  lead="none"
                  class="line-clamp-1"
                >
                  هیچ اسمی ارائه نشده است
                </BaseHeading>
                <BaseParagraph
                  v-if="request?.email"
                  size="xs"
                  class="text-muted-400 line-clamp-1"
                >
                  {{ request.email }}
                </BaseParagraph>
                <BaseParagraph
                  v-else
                  size="xs"
                  class="text-muted-400 line-clamp-1"
                >
                  ایمیلی هنوز ارائه نشده است
                </BaseParagraph>
              </div>
            </div>
            <div>
              <BaseParagraph size="sm" class="text-muted-500">
                {{ request?.firstName ? request?.firstName : 'این کاربر' }}
                می‌تواند:
              </BaseParagraph>
              <div class="mt-6">
                <ul class="space-y-2">
                  <li class="flex gap-2">
                    <Icon
                      v-if="request?.role === 'admin'"
                      name="lucide:check"
                      class="text-success-500 relative top-1 size-4 shrink-0"
                    />
                    <Icon
                      v-else
                      name="lucide:x"
                      class="text-danger-500 relative top-1 size-4 shrink-0"
                    />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-800 dark:text-muted-400"
                    >
                      مدیریت تمام حساب‌های بانکی
                    </BaseParagraph>
                  </li>
                  <li class="flex gap-2">
                    <Icon
                      v-if="
                        request?.role === 'admin' || request?.role === 'custom'
                      "
                      name="lucide:check"
                      class="text-success-500 relative top-1 size-4 shrink-0"
                    />
                    <Icon
                      v-else
                      name="lucide:x"
                      class="text-danger-500 relative top-1 size-4 shrink-0"
                    />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-800 dark:text-muted-400"
                    >
                      ارسال پول
                    </BaseParagraph>
                  </li>
                  <li class="flex gap-2">
                    <Icon
                      v-if="
                        request?.role === 'admin' ||
                          request?.role === 'bookkeeper' ||
                          request?.role === 'custom'
                      "
                      name="lucide:check"
                      class="text-success-500 relative top-1 size-4 shrink-0"
                    />
                    <Icon
                      v-else
                      name="lucide:x"
                      class="text-danger-500 relative top-1 size-4 shrink-0"
                    />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-800 dark:text-muted-400"
                    >
                      یادداشت‌ها و پیوست‌ها را به تراکنش‌ها اضافه کنید.
                    </BaseParagraph>
                  </li>
                  <li class="flex gap-2">
                    <Icon
                      v-if="request?.role === 'admin'"
                      name="lucide:check"
                      class="text-success-500 relative top-1 size-4 shrink-0"
                    />
                    <Icon
                      v-else
                      name="lucide:x"
                      class="text-danger-500 relative top-1 size-4 shrink-0"
                    />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-800 dark:text-muted-400"
                    >
                      مدیریت دعوت‌نامه‌ها و مجوزهای تیم
                    </BaseParagraph>
                  </li>
                  <li class="flex gap-2">
                    <Icon
                      v-if="request?.role === 'admin'"
                      name="lucide:check"
                      class="text-success-500 relative top-1 size-4 shrink-0"
                    />
                    <Icon
                      v-else
                      name="lucide:x"
                      class="text-danger-500 relative top-1 size-4 shrink-0"
                    />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-800 dark:text-muted-400"
                    >
                      مدیریت تنظیمات امنیتی شرکت
                    </BaseParagraph>
                  </li>
                  <li class="flex gap-2">
                    <Icon
                      v-if="
                        request?.role === 'admin' || request?.role === 'custom'
                      "
                      name="lucide:check"
                      class="text-success-500 relative top-1 size-4 shrink-0"
                    />
                    <Icon
                      v-else
                      name="lucide:x"
                      class="text-danger-500 relative top-1 size-4 shrink-0"
                    />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-800 dark:text-muted-400"
                    >
                      کارت‌ها را صادر کنید و محدودیت‌ها را مدیریت کنید
                    </BaseParagraph>
                  </li>
                  <li class="flex gap-2">
                    <Icon
                      v-if="
                        request?.role === 'admin' ||
                          request?.role === 'bookkeeper'
                      "
                      name="lucide:check"
                      class="text-success-500 relative top-1 size-4 shrink-0"
                    />
                    <Icon
                      v-else
                      name="lucide:x"
                      class="text-danger-500 relative top-1 size-4 shrink-0"
                    />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-800 dark:text-muted-400"
                    >
                      بارگیری صورت‌حساب‌ها
                    </BaseParagraph>
                  </li>
                  <li class="flex gap-2">
                    <Icon
                      v-if="
                        request?.role === 'admin' ||
                          request?.role === 'cardonly' ||
                          request?.role === 'custom'
                      "
                      name="lucide:check"
                      class="text-success-500 relative top-1 size-4 shrink-0"
                    />
                    <Icon
                      v-else
                      name="lucide:x"
                      class="text-danger-500 relative top-1 size-4 shrink-0"
                    />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-800 dark:text-muted-400"
                    >
                      یک کارت بگیرید
                    </BaseParagraph>
                  </li>
                </ul>
              </div>
            </div>
          </BaseCard>
        </div>

        <!--Buttons-->
        <div class="flex gap-4">
          <BaseButton
            v-if="currentStepId > 0"
            :to="loading ? undefined : getPrevStep()?.to"
            :disabled="!getPrevStep()"
            size="lg"
            class="w-full"
          >
            <span>قبلی</span>
          </BaseButton>
          <BaseButton
            type="submit"
            color="primary"
            size="lg"
            class="w-full"
            :loading="loading"
            :disabled="loading"
          >
            <span>ارسال دعوت‌نامه</span>
          </BaseButton>
        </div>
      </div>
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
          دعوت‌نامه ارسال شد!
        </BaseHeading>
        <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-5">
          عالی! دعوت‌نامه خود را به درستی پر کرده‌اید. به محض اینکه شخص آن را قبول کرد، به شما اطلاع خواهیم داد.
        </BaseParagraph>
        <div class="flex justify-center">
          <BaseButton
            to="/layouts/members"
            color="primary"
            rounded="md"
            class="w-48"
          >
            بازگشت به اعضا
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
