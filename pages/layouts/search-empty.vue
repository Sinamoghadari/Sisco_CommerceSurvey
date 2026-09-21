<script setup lang="ts">
definePageMeta({
  title: 'جستجوی خالی',
  preview: {
    title: 'جستجوی خالی',
    description: 'برای نمایش نتایج جستجو',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-subpages-search-empty.png',
    srcDark: '/img/screens/layouts-subpages-search-empty-dark.png',
    order: 83,
  },
})

const searchTerms = ref('پیتزای بستنی')
</script>

<template>
  <div class="mx-auto w-full max-w-5xl">
    <div class="mx-auto mt-6 flex w-full max-w-sm items-center justify-center">
      <BaseInput
        v-model="searchTerms"
        icon="lucide:search"
        placeholder="جستجو..."
        rounded="full"
        :classes="{
          wrapper: 'w-full',
          input: 'h-12 !ps-12',
          icon: 'h-12 w-12 [& > svg]:!w-7 [& > svg]:!h-7',
        }"
      />
    </div>
    <div class="mb-12 mt-2 text-center">
      <BaseText
        size="sm"
        class="text-muted-400"
      >
        ۰ نتیجه برای "پیتزای بستنی"
      </BaseText>
    </div>
    <div>
      <BasePlaceholderPage
        title="نتیجه‌ی منطبقی یافت نشد"
        subtitle="به نظر می‌رسد که نتوانستیم نتایج مطابقی برای عبارت‌های جستجوی شما پیدا کنیم. عبارت‌های جستجوی دیگری را امتحان کنید."
      >
        <template #image>
          <img
            class="block dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-search-4.svg"
            alt="تصویر مکان نگهدار"
          >
          <img
            class="hidden dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-search-4-dark.svg"
            alt="تصویر مکان نگهدار"
          >
        </template>
      </BasePlaceholderPage>
    </div>
  </div>
</template>
