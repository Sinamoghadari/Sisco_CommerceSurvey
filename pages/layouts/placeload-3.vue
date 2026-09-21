<script setup lang="ts">
definePageMeta({
  title: 'بارگذاری مکانی',
  preview: {
    title: 'بارگذاری مکانی 3',
    description: 'برای وضعیت‌های بارگذاری',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-placeload-3.png',
    srcDark: '/img/screens/layouts-placeload-3-dark.png',
    order: 55,
  },
})

const input = ref('')
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="input"
          icon="lucide:search"
          placeholder="فیلتر کردن کاربران..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
          disabled
        />
      </template>
      <template #right>
        <BaseButton class="w-full sm:w-32" disabled>
          مدیریت
        </BaseButton>
        <BaseButton
          color="primary"
          class="w-full text-nowrap sm:w-32"
          disabled
        >
          <Icon name="lucide:plus" class="me-2 size-4" />
          <span>افزودن کاربر</span>
        </BaseButton>
      </template>
      <div>
        <div
          class="ltablet:grid-cols-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <BaseCard
            v-for="index in 12"
            :key="index"
            class="flex flex-col p-6"
          >
            <BasePlaceload class="mx-auto size-20 shrink-0 rounded-full" />
            <div class="mb-6 mt-4 space-y-2">
              <BasePlaceload class="mx-auto h-3 w-40 rounded-lg" />
              <BasePlaceload class="mx-auto h-3 w-32 rounded-lg" />
            </div>
            <div class="mb-6 flex items-center justify-center gap-3">
              <BasePlaceload class="size-8 shrink-0 rounded-full" />
              <BasePlaceload class="size-8 shrink-0 rounded-full" />
              <BasePlaceload class="size-8 shrink-0 rounded-full" />
            </div>
            <div class="flex items-center justify-center gap-2">
              <BaseButton loading class="w-full">
                مشاهده
              </BaseButton>
              <BaseButton loading class="w-full">
                ویرایش
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
