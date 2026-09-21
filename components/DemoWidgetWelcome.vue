<script setup lang="ts"></script>

<template>
  <BaseCard
    rounded="md"
    class="h-full p-10"
  >
    <div class="flex h-full flex-col justify-between gap-5">
      <BaseHeading
        as="h4"
        size="sm"
        weight="medium"
        lead="none"
        class="text-muted-400 uppercase"
      >
        حساب مایا
      </BaseHeading>

      <h2
        class="font-heading ptablet:text-2xl text-muted-800 text-4xl font-medium dark:text-white"
      >
        خوش برگشتی، مایا! 👋
      </h2>
      <BaseParagraph class="text-muted-500">
        همه چیز از آخرین بازدید شما به نظر خوب و به‌روز می‌رسد. آیا می‌خواهید حساب خود را تأمین مالی کنید؟
      </BaseParagraph>
      <BaseButton
        color="primary"
        rounded="md"
        size="lg"
        class="w-full"
        shadow="hover"
      >
        تامین مالی حساب من
      </BaseButton>
    </div>
  </BaseCard>
</template>
