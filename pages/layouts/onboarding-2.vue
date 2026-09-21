<script setup lang="ts">
definePageMeta({
  title: 'مقدمات ورود',
  layout: 'empty',
  preview: {
    title: 'مقدمات ورود ۲',
    description: 'برای ورود کاربران جدید',
    categories: ['چیدمان‌ها', 'مقدمات ورود'],
    src: '/img/screens/layouts-onboarding-2.png',
    srcDark: '/img/screens/layouts-onboarding-2-dark.png',
    order: 94,
  },
})

const pricingMode = ref('free')
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen">
    <div
      class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4"
    >
      <NuxtLink
        to="/"
        class="text-muted-400 hover:text-primary-500 dark:text-muted-700 dark:hover:text-primary-500 transition-colors duration-300"
      >
        <TairoLogo class="size-10" />
      </NuxtLink>
      <div class="flex items-center gap-4">
        <BaseThemeToggle />
      </div>
    </div>
    <form
      action=""
      method="POST"
      class="mx-auto max-w-7xl px-4"
      @submit.prevent
    >
      <div>
        <div class="pt-8 text-center">
          <BaseHeading
            tag="h2"
            size="3xl"
            weight="medium"
            class="mb-2"
          >
            شروع دوره آزمایشی رایگان
          </BaseHeading>
          <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-8">
            ما قبل از پایان دوره آزمایشی ۱۴ روزه شما، هزینه‌ای دریافت نخواهیم کرد.
          </BaseParagraph>
        </div>

        <div>
          <div class="w-full">
            <div class="mx-auto w-full">
              <div class="w-full">
                <div class="mx-auto mb-8 grid max-w-4xl gap-6 sm:grid-cols-3">
                  <BaseRadioHeadless
                    v-model="pricingMode"
                    name="radio_custom"
                    value="free"
                  >
                    <BaseCard
                      rounded="lg"
                      class="peer-checked:!border-primary-500 relative border-2 p-8 opacity-60 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:[&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/pricing-1.svg"
                          alt="تأیید هویت دو مرحله‌ای با ایمیل"
                          class="mx-auto mb-3 max-w-[160px]"
                        >
                        <BaseHeading
                          size="md"
                          weight="medium"
                        >
                          رایگان
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          با اکثر ویژگی‌های ما به‌صورت رایگان شروع کنید. با آن آشنا شوید و هنگامی که آماده بودید، ارتقا دهید.
                        </BaseParagraph>
                        <div
                          class="flex items-center justify-center gap-2 pt-4"
                        >
                          <BaseText>
                            <span>۰</span>
                            <span class="text-muted-400 text-xs">
                              / در ماه</span>
                          </BaseText>
                        </div>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-0">
                        <Icon
                          name="ph:check-circle-duotone"
                          class="text-primary-500 size-7"
                        />
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="pricingMode"
                    name="radio_custom"
                    value="starter"
                  >
                    <BaseCard
                      rounded="lg"
                      class="peer-checked:!border-primary-500 relative border-2 p-8 opacity-60 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:[&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/pricing-2.svg"
                          alt="تأیید هویت دو مرحله‌ای با پیامک"
                          class="mx-auto mb-3 max-w-[160px]"
                        >
                        <BaseHeading
                          size="md"
                          weight="medium"
                        >
                          مبتدی
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          برنامه‌ای پیشرفته‌تر با ویژگی‌های بیشتر و ذخیره‌سازی اضافی. عالی برای رشد کسب‌وکارتان.
                        </BaseParagraph>
                        <div
                          class="flex items-center justify-center gap-2 pt-4"
                        >
                          <BaseText>
                            <span>۱٬۴۵۰٬۰۰۰ تومان</span>
                            <span class="text-muted-400 text-xs">
                              / در ماه</span>
                          </BaseText>
                        </div>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-0">
                        <Icon
                          name="ph:check-circle-duotone"
                          class="text-primary-500 size-7"
                        />
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="pricingMode"
                    name="radio_custom"
                    value="business"
                  >
                    <BaseCard
                      rounded="lg"
                      class="peer-checked:!border-primary-500 relative border-2 p-8 opacity-60 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:[&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/pricing-3.svg"
                          alt="تأیید هویت دو مرحله‌ای با اپلیکیشن"
                          class="mx-auto mb-3 max-w-[160px]"
                        >
                        <BaseHeading
                          size="md"
                          weight="medium"
                        >
                          کسب‌وکار
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          یک پلن جامع برای کسب‌وکارتان با تمام چیزهایی که نیاز دارید. ایده‌آل برای رشد در مقیاس بزرگ.
                        </BaseParagraph>
                        <div
                          class="flex items-center justify-center gap-2 pt-4"
                        >
                          <BaseText>
                            <span>۴۹۰,۰۰۰ تومان</span>
                            <span class="text-muted-400 text-xs">
                              / در ماه</span>
                          </BaseText>
                        </div>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-0">
                        <Icon
                          name="ph:check-circle-duotone"
                          class="text-primary-500 size-7"
                        />
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
                <div class="mx-auto flex flex-col items-center">
                  <BaseButton
                    to="/dashboards"
                    type="button"
                    rounded="lg"
                    class="!h-12 w-48"
                    color="primary"
                  >
                    تایید
                  </BaseButton>
                  <NuxtLink
                    to="#"
                    class="text-muted-400 hover:text-primary-500 mt-4 text-xs font-medium underline-offset-4 transition-colors duration-300 hover:underline"
                  >
                    بیشتر بیاموزید
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
