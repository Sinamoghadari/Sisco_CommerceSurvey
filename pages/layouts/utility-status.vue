<script setup lang="ts">
definePageMeta({
  title: 'وضعیت',
  layout: 'empty',
  preview: {
    title: 'وضعیت خدمت',
    description: 'برای وضعیت خدمات شرکت',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-utility-status.png',
    srcDark: '/img/screens/layouts-utility-status-dark.png',
    order: 91,
  },
})
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen overflow-hidden px-4">
    <div class="mx-auto max-w-3xl">
      <div
        class="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4"
      >
        <NuxtLink
          to="/"
          class="text-muted-400 hover:text-primary-500 dark:text-muted-700 dark:hover:text-primary-500 transition-colors duration-300"
        >
          <TairoLogoText class="h-7" />
        </NuxtLink>
        <div class="flex items-center gap-4">
          <BaseThemeToggle />
        </div>
      </div>

      <div class="mx-auto max-w-4xl space-y-12 py-12">
        <div>
          <div class="flex flex-col gap-4 pb-16 text-center">
            <Icon
              name="ph:check-circle-duotone"
              class="text-success-500 mx-auto size-8"
            />
            <div>
              <BaseHeading
                as="h3"
                size="3xl"
                weight="medium"
                lead="none"
                class="mb-1"
              >
                همه خدمات آنلاین
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                تا تاریخ ۲۴ اسفند ۱۴۰۱ در ساعت ۱۱:۰۸ شب به وقت گرینویچ
              </BaseParagraph>
            </div>
          </div>
          <div class="px-8 py-5">
            <div class="flex gap-16">
              <BaseText
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                خدمت
              </BaseText>
              <BaseText
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                زمان بالا در ۹۰ روز گذشته
              </BaseText>
            </div>
          </div>
          <BaseCard rounded="lg" class="px-8">
            <div>
              <!-- Item -->
              <div
                class="border-muted-200 dark:border-muted-700 py-8 [&:not(:last-child)]:border-b"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="mb-1 flex items-center gap-2">
                    <Icon
                      name="ph:check-circle-duotone"
                      class="text-success-500 size-4"
                    />
                    <BaseText size="sm">
                      tairo.eltheme.ir
                    </BaseText>
                  </div>
                  <div>
                    <BaseText
                      size="sm"
                      class="text-success-600 dark:text-success-400"
                    >
                      ۹۹٫۹۸۹٪ زمان فعال
                    </BaseText>
                  </div>
                </div>

                <div class="flex w-full items-center">
                  <div
                    v-for="index in 90"
                    :key="index"
                    class="dark:border-muted-800 group relative h-8 flex-1 shrink-0 cursor-pointer rounded-[2px] border-x border-white"
                    :class="[
                      index !== 35 &&
                        index !== 54 &&
                        'bg-success-500 hover:bg-success-300 transition-colors duration-300',
                      index === 35 &&
                        'bg-orange-300 transition-colors duration-300 hover:bg-orange-500',
                      index === 54 &&
                        'bg-red-500 transition-colors duration-300 hover:bg-red-300',
                    ]"
                  >
                    <!-- Popup -->
                    <div
                      class="absolute -top-24 start-1/2 w-40 opacity-0 transition-all duration-300 group-hover:opacity-100 ltr:-translate-x-1/2 rtl:translate-x-1/2"
                    >
                      <BaseCard rounded="lg" elevated>
                        <div
                          class="border-muted-200 dark:border-muted-700 flex items-center gap-1 border-b p-3"
                        >
                          <Icon
                            name="ph:check-circle-duotone"
                            class="text-success-500 size-4"
                          />
                          <BaseText
                            size="sm"
                            class="text-muted-600 dark:text-muted-100"
                          >
                            عملیاتی
                          </BaseText>
                        </div>
                        <div class="text-muted-400 p-2 text-center">
                          <BaseText size="xs">
                            ۲۳ فروردین ۱۴۰۲
                          </BaseText>
                        </div>
                      </BaseCard>
                    </div>
                  </div>
                </div>
                <div
                  class="text-muted-400 mt-1 flex items-center justify-between gap-4"
                >
                  <div>
                    <BaseText size="xs" weight="medium">
                      ۹۰ روز پیش
                    </BaseText>
                  </div>
                  <div>
                    <BaseText size="xs" weight="medium">
                      امروز
                    </BaseText>
                  </div>
                </div>
              </div>
              <!-- Item -->
              <div
                class="border-muted-200 dark:border-muted-700 py-8 [&:not(:last-child)]:border-b"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="mb-1 flex items-center gap-2">
                    <Icon
                      name="ph:check-circle-duotone"
                      class="text-success-500 size-4"
                    />
                    <BaseText size="sm">
                      api.tairo.eltheme.ir
                    </BaseText>
                  </div>
                  <div>
                    <BaseText
                      size="sm"
                      class="text-success-600 dark:text-success-400"
                    >
                      ۹۹٫۹۸۹٪ زمان فعال
                    </BaseText>
                  </div>
                </div>

                <div class="flex w-full items-center">
                  <div
                    v-for="index in 90"
                    :key="index"
                    class="dark:border-muted-800 relative h-8 flex-1 shrink-0 cursor-pointer rounded-[2px] border-x border-white"
                    :class="[
                      index !== 35 &&
                        index !== 54 &&
                        'bg-success-500 hover:bg-success-300 transition-colors duration-300',
                      index === 35 &&
                        'bg-orange-300 transition-colors duration-300 hover:bg-orange-500',
                      index === 54 &&
                        'bg-red-500 transition-colors duration-300 hover:bg-red-300',
                    ]"
                  />
                </div>
                <div
                  class="text-muted-400 mt-1 flex items-center justify-between gap-4"
                >
                  <div>
                    <BaseText size="xs" weight="medium">
                      ۹۰ روز پیش
                    </BaseText>
                  </div>
                  <div>
                    <BaseText size="xs" weight="medium">
                      امروز
                    </BaseText>
                  </div>
                </div>
              </div>
              <!-- Item -->
              <div
                class="border-muted-200 dark:border-muted-700 py-8 [&:not(:last-child)]:border-b"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="mb-1 flex items-center gap-2">
                    <Icon
                      name="ph:check-circle-duotone"
                      class="text-success-500 size-4"
                    />
                    <BaseText size="sm">
                      hooks.tairo.eltheme.ir
                    </BaseText>
                  </div>
                  <div>
                    <BaseText
                      size="sm"
                      class="text-success-600 dark:text-success-400"
                    >
                      ۹۹٫۹۸۹٪ زمان فعال
                    </BaseText>
                  </div>
                </div>

                <div class="flex w-full items-center">
                  <div
                    v-for="index in 90"
                    :key="index"
                    class="dark:border-muted-800 relative h-8 flex-1 shrink-0 cursor-pointer rounded-[2px] border-x border-white"
                    :class="[
                      index !== 35 &&
                        index !== 54 &&
                        'bg-success-500 hover:bg-success-300 transition-colors duration-300',
                      index === 35 &&
                        'bg-orange-300 transition-colors duration-300 hover:bg-orange-500',
                      index === 54 &&
                        'bg-red-500 transition-colors duration-300 hover:bg-red-300',
                    ]"
                  />
                </div>
                <div
                  class="text-muted-400 mt-1 flex items-center justify-between gap-4"
                >
                  <div>
                    <BaseText size="xs" weight="medium">
                      ۹۰ روز پیش
                    </BaseText>
                  </div>
                  <div>
                    <BaseText size="xs" weight="medium">
                      امروز
                    </BaseText>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
        <BaseCard rounded="lg" class="mt-12">
          <div
            class="border-muted-200 dark:border-muted-700 flex items-center gap-3 border-b p-6"
          >
            <Icon name="fa6-brands:twitter" class="size-6 text-sky-500" />
            <BaseHeading size="sm" weight="medium">
              @eltheme
            </BaseHeading>
            <div class="ms-auto">
              <NuxtLink
                to="#"
                class="text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
              >
                مشاهده در توییتر
              </NuxtLink>
            </div>
          </div>
          <div class="space-y-8 px-6 py-8">
            <div class="flex gap-4">
              <BaseAvatar src="/img/logos/brands/hanzo.svg" size="sm" />
              <div>
                <BaseText
                  size="sm"
                  weight="medium"
                  class="text-muted-400 dark:text-muted-300 mb-1"
                >
                  14 فروردین ساعت 5:39 ب.ظ
                </BaseText>
                <BaseParagraph
                  size="sm"
                  class="text-muted-500 dark:text-muted-400 max-w-md"
                >
                  ما بار بیشتری از حد معمول بر زیرساخت گروهی خود تجربه می‌کنیم. وب‌هوک‌ها حدود یک ساعت تأخیر دارند. تماس‌های API تحت تأثیر قرار نگرفته‌اند
                </BaseParagraph>
              </div>
            </div>
            <div class="flex gap-4">
              <BaseAvatar src="/img/logos/brands/hanzo.svg" size="sm" />
              <div>
                <BaseText
                  size="sm"
                  weight="medium"
                  class="text-muted-400 dark:text-muted-300 mb-1"
                >
                  ۲۰ آذر ساعت ۸:۴۸ ق.ظ
                </BaseText>
                <BaseParagraph
                  size="sm"
                  class="text-muted-500 dark:text-muted-400 max-w-md"
                >
                  متاسفیم! سیستم‌های ما نشان می‌دهند که همه چیز به روز است. اگر همچنان مشکلی می‌بینید به ما اطلاع دهید!
                </BaseParagraph>
              </div>
            </div>
          </div>
        </BaseCard>
        <div
          class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 pb-24 pt-12"
        >
          <div class="flex items-center gap-8">
            <BaseThemeToggle />
            <NuxtLink
              to="#"
              class="text-muted-400 hover:text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
            >
              قانونی
            </NuxtLink>
            <NuxtLink
              to="#"
              class="text-muted-400 hover:text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
            >
              درباره
            </NuxtLink>
            <NuxtLink
              to="#"
              class="text-muted-400 hover:text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
            >
              مشاغل
            </NuxtLink>
          </div>
          <span class="text-muted-400 font-sans text-sm">&copy; 1397-{{ new Date().getFullYear() }} @eltheme</span>
        </div>
      </div>
    </div>
  </div>
</template>
