<script setup lang="ts">
definePageMeta({
  title: 'بارگذاری مکانی',
  preview: {
    title: 'بارگذاری مکانی 2',
    description: 'برای وضعیت‌های بارگذاری',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-placeload-2.png',
    srcDark: '/img/screens/layouts-placeload-2-dark.png',
    order: 54,
  },
})
const fake = ref('')
const fakePerPage = ref('')
const fakeAll = ref(true)
const fakeItems = ref([])
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="fake"
          icon="lucide:search"
          placeholder="فیلتر کردن کاربران..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
          disabled
        />
      </template>
      <template #right>
        <BaseSelect
          v-model="fakePerPage"
          placeholder="آیتم‌ها در هر صفحه"
          label=""
          :classes="{
            wrapper: 'w-full sm:w-40',
          }"
          disabled
        >
          <option :value="10">
            ۱۰ مورد در هر صفحه
          </option>
          <option :value="25">
            ۲۵ در هر صفحه
          </option>
          <option :value="50">
            ۵۰ مورد در هر صفحه
          </option>
          <option :value="100">
            ۱۰۰ در هر صفحه
          </option>
        </BaseSelect>
      </template>
      <div>
        <div class="w-full">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading
                uppercase
                spaced
                class="p-4"
              >
                <div class="flex items-center">
                  <BaseCheckbox
                    v-model="fakeAll"
                    rounded="full"
                    color="primary"
                  />
                </div>
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                نوع
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                نام
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                اندازه
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                نسخه
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                آخرین به‌روزرسانی
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                اقدام
              </TairoTableHeading>
            </template>

            <TairoTableRow v-for="index in 10" :key="index">
              <TairoTableCell spaced>
                <div class="flex items-center">
                  <BaseCheckbox
                    v-model="fakeItems"
                    :value="`placeload-item-checkbox-${index}`"
                    rounded="full"
                    color="primary"
                  />
                </div>
              </TairoTableCell>
              <TairoTableCell light spaced>
                <BasePlaceload class="size-[46px] shrink-0 rounded-xl" />
              </TairoTableCell>
              <TairoTableCell spaced>
                <BasePlaceload class="h-3 w-24 rounded-lg" />
              </TairoTableCell>
              <TairoTableCell light spaced>
                <BasePlaceload class="h-3 w-12 rounded-lg" />
              </TairoTableCell>
              <TairoTableCell light spaced>
                <BasePlaceload class="h-3 w-12 rounded-lg" />
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="flex items-center gap-2">
                  <BasePlaceload class="size-8 shrink-0 rounded-full" />
                  <div class="space-y-1">
                    <BasePlaceload class="h-2 w-[70px] rounded-lg" />
                    <BasePlaceload class="h-2 w-[50px] rounded-lg" />
                  </div>
                </div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <BasePlaceload class="h-8 w-16 rounded-lg" />
              </TairoTableCell>
            </TairoTableRow>
          </TairoTable>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
