<script setup lang="ts">
definePageMeta({
  title: 'ارتقاء',
  preview: {
    title: 'ارتقاء',
    description: 'برای آفرهای ارتقاء',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-utility-promotion.png',
    srcDark: '/img/screens/layouts-utility-promotion-dark.png',
    order: 88,
  },
})
</script>

<template>
  <div class="flex items-center justify-center py-8">
    <div class="mx-auto w-full max-w-4xl">
      <BaseCard>
        <div
          class="divide-muted-200 dark:divide-muted-700 grid divide-y sm:grid-cols-2 sm:divide-x rtl:divide-x-reverse sm:divide-y-0"
        >
          <div class="flex flex-col p-8">
            <BasePlaceholderPage
              title="قدرت‌بخشی به تیم خود"
              subtitle="تیم خود را با طرح پریمیوم ما کارآمدتر و پربازده‌تر کنید. این فرصت عالی را از دست ندهید!"
            >
              <template #image>
                <img
                  class="block dark:hidden"
                  src="/img/illustrations/placeholders/flat/placeholder-promotion.svg"
                  alt="placeholder-image"
                >
                <img
                  class="hidden dark:block"
                  src="/img/illustrations/placeholders/flat/placeholder-promotion-dark.svg"
                  alt="placeholder-image"
                >
              </template>

              <div
                class="mx-auto mt-6 flex w-full max-w-[280px] items-end justify-center gap-2"
              >
                <BaseHeading
                  as="h3"
                  size="2xl"
                  weight="medium"
                  lead="none"
                >
                  <span class="text-muted-400 text-sm">فقط</span>
                  <span class="px-1"> ۴۴.۹۹ تومان</span>
                  <span class="text-muted-400 text-sm">/ در ماه</span>
                </BaseHeading>
              </div>
              <div class="mt-8 flex items-center justify-between gap-2">
                <BaseButton class="w-full">
                  رد کردن
                </BaseButton>
                <BaseButton color="primary" class="w-full">
                  ارتقاء
                </BaseButton>
              </div>
            </BasePlaceholderPage>
          </div>
          <div>
            <div class="flex flex-col p-8">
              <BaseHeading
                tag="h2"
                size="md"
                weight="medium"
                class="mt-4"
              >
                ارتقاء دهید
              </BaseHeading>
              <BaseText
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-xs"
              >
                نگاهی به برخی از ویژگی‌های شگفت‌انگیز که به طرح پریمیوم ما اضافه شده‌اند بیندازید. باور نمی‌کنید!
              </BaseText>
              <div class="mt-6">
                <ul class="space-y-6">
                  <li class="flex gap-3">
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex size-9 items-center justify-center rounded-full border bg-white shadow-xl"
                    >
                      <Icon
                        name="lucide:check"
                        class="text-success-500 size-4"
                      />
                    </div>
                    <div>
                      <BaseHeading
                        as="h3"
                        size="sm"
                        weight="medium"
                      >
                        ۸ صندلی تیم
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-[210px]"
                      >
                        هر عضو تیم در حساب شما می‌تواند پروژه‌ها و وظایفی ایجاد کند.
                      </BaseText>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex size-9 items-center justify-center rounded-full border bg-white shadow-xl"
                    >
                      <Icon
                        name="lucide:check"
                        class="text-success-500 size-4"
                      />
                    </div>
                    <div>
                      <BaseHeading
                        as="h3"
                        size="sm"
                        weight="medium"
                      >
                        یکپارچگی‌ها
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-[210px]"
                      >
                        تا ۵ افزونه به برنامه اصلی خود اضافه کنید تا به مدیریت شما کمک کنند.
                      </BaseText>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <div
                      class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex size-9 items-center justify-center rounded-full border bg-white shadow-xl"
                    >
                      <Icon
                        name="lucide:check"
                        class="text-success-500 size-4"
                      />
                    </div>
                    <div>
                      <BaseHeading
                        as="h3"
                        size="sm"
                        weight="medium"
                      >
                        مقیاس رشد
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-[210px]"
                      >
                        برنامه شما به موازات کسب‌وکارتان رشد می‌کند، بدون هیچ تلاشی.
                      </BaseText>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
