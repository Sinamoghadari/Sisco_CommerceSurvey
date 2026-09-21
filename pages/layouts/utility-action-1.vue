<script setup lang="ts">
definePageMeta({
  title: 'اقدام',
  preview: {
    title: 'اقدام 1',
    description: 'برای اقدامات و وظایف',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-subpages-action-1.png',
    srcDark: '/img/screens/layouts-subpages-action-1-dark.png',
    order: 85,
  },
})
</script>

<template>
  <div class="flex items-center justify-center py-8">
    <div class="mx-auto w-full max-w-md">
      <BaseCard class="p-6">
        <div class="flex flex-col py-2">
          <BaseAvatar
            class="mx-auto"
            size="xl"
            src="/img/avatars/10.svg"
            badge-src="/img/stacks/reactjs.svg"
          />
          <div class="mx-auto mb-4 max-w-xs text-center">
            <BaseHeading
              tag="h2"
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
                tag="h3"
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
                سلام مایا، واقعاً عالی می‌شود اگر بتوانید در این پروژه به ما کمک کنید. هر روز تعداد زیادی کار ظاهر می‌شود و فکر می‌کنم تیم کمی تحت فشار قرار گرفته است. خوشحال می‌شویم که شما را در تیم داشته باشیم.
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
      </BaseCard>
    </div>
  </div>
</template>
