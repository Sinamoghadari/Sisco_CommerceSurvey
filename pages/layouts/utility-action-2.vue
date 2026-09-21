<script setup lang="ts">
definePageMeta({
  title: 'اقدام',
  preview: {
    title: 'اقدام 2',
    description: 'برای اقدامات و وظایف',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-subpages-action-2.png',
    srcDark: '/img/screens/layouts-subpages-action-2-dark.png',
    order: 86,
  },
})
</script>

<template>
  <div class="flex items-center justify-center py-8">
    <div class="mx-auto w-full max-w-4xl">
      <BaseCard>
        <div
          class="divide-muted-200 dark:divide-muted-700 grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 rtl:divide-x-reverse"
        >
          <div class="flex flex-col p-8">
            <BaseAvatar
              class="mx-auto"
              size="xl"
              src="/img/avatars/10.svg"
              badge-src="/img/stacks/reactjs.svg"
            />
            <div class="mx-auto mb-4 max-w-xs text-center">
              <BaseHeading
                as="h2"
                size="md"
                weight="medium"
                class="mt-4"
              >
                کندرا دابلیو. شما را دعوت کرده به پروژه
                <span class="text-primary-500">وب‌سایت راه‌حل بانکی</span>
              </BaseHeading>
            </div>
            <div class="mx-auto max-w-sm">
              <BaseCard elevated class="p-6">
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400 mb-2 !text-[0.65rem] uppercase"
                >
                  پیام از کندرا
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  class="text-muted-500 dark:text-muted-400"
                >
                  سلام مایا، خیلی عالی می‌شود اگر بتوانی در این پروژه به ما کمک کنی. هر روز کارهای زیادی پیش می‌آید و احساس می‌کنم تیم کمی تحت فشار است. خوشحال می‌شویم که تو را در تیم داشته باشیم.
                </BaseParagraph>
              </BaseCard>
              <div class="mt-6 flex items-center justify-center gap-3">
                <BaseAvatar
                  src="/img/avatars/25.svg"
                  size="xs"
                  data-nui-tooltip="ملانی ال."
                />
                <BaseAvatar
                  size="xs"
                  text="OD"
                  data-nui-tooltip="Oliver D."
                  :class="getRandomColor()"
                />
                <BaseAvatar
                  src="/img/avatars/16.svg"
                  size="xs"
                  data-nui-tooltip="هرمان م."
                />
              </div>
              <div class="mt-2 text-center">
                <BaseText size="xs" class="text-muted-400">
                  و ۵ نفر دیگر عضو این پروژه هستند
                </BaseText>
              </div>
              <div class="mt-6 flex items-center justify-between gap-2">
                <BaseButton class="w-full">
                  رد
                </BaseButton>
                <BaseButton color="primary" class="w-full">
                  پذیرفتن
                </BaseButton>
              </div>
            </div>
          </div>
          <div>
            <div class="flex flex-col p-8">
              <BaseHeading
                tag="h2"
                size="md"
                weight="medium"
                class="mt-4"
              >
                دستورات اضافی
              </BaseHeading>
              <BaseText
                size="xs"
                class="text-muted-500 dark:text-muted-400 max-w-xs"
              >
                لطفاً قبل از پذیرش دعوتنامه، دستورالعمل‌های زیر را به دقت بخوانید.
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
                        خلاصه پروژه
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-[210px]"
                      >
                        لطفاً خلاصه پروژه را بخوانید. آن را در صندوق ورودی خود پیدا خواهید کرد.
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
                        بررسی رابط کاربری
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-[210px]"
                      >
                        لطفاً جدیدترین وایرفریم‌هایی که تیم ارائه داده است را مرور کنید.
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
                        برنامه‌ریزی
                      </BaseHeading>
                      <BaseText
                        size="xs"
                        class="text-muted-500 dark:text-muted-400 max-w-[210px]"
                      >
                        لطفاً یک جلسه با تیم برنامه‌ریزی کنید تا شما را با روند کار آشنا کنند.
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
