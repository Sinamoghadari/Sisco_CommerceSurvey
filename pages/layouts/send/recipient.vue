<script setup lang="ts">
import type { PaymentSend, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'ارسال - مرحله ۳',
    description: 'برای ارسال پرداخت‌ها به افراد',
    categories: ['چیدمان‌ها', 'ویزاردها', 'فرم‌ها'],
    src: '/img/screens/layouts-send-recipient.png',
    srcDark: '/img/screens/layouts-send-recipient-dark.png',
    order: 20,
    new: true,
  },
})
useHead({
  title: 'جزئیات',
})

const {
  data: request,
  currentStepId,
  loading,
  getPrevStep,
  errors,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<PaymentSend, StepData>()

onBeforeMount(checkPreviousSteps)
</script>

<template>
  <div class="w-full">
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
      <div class="mb-4">
        <!--Grid-->
        <div class="grid gap-4 md:grid-cols-2">
          <div class="group relative col-span-2">
            <BaseInput
              :model-value="request.recipient.name"
              :error="errors.fields?.['recipient.name']"
              label="دریافت‌کننده نام"
              icon="ph:user-duotone"
              placeholder="مثال: قاسم قاسمی"
              readonly
              :classes="{
                input: 'bg-muted-100 dark:!bg-muted-900',
              }"
            />
          </div>
          <div class="relative">
            <BaseInput
              v-model="request.routingNumber"
              v-focus
              :error="errors.fields.routingNumber"
              label="شماره مسیریابی"
              placeholder="مثال: 183402022"
            />
          </div>
          <div class="relative">
            <BaseInput
              v-model="request.prefix"
              :error="errors.fields.prefix"
              label="پیشوند (اختیاری)"
              placeholder="مثال: XCQ23"
            />
          </div>
        </div>
      </div>

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
        >
          <span>ادامه</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
