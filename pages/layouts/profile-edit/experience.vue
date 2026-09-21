<script setup lang="ts">
definePageMeta({
  title: 'تجربه',
  preview: {
    title: 'ویرایش پروفایل 2',
    description: 'برای ویرایش پروفایل کاربر',
    categories: ['چیدمان‌ها', 'پروفایل', 'فرم‌ها'],
    src: '/img/screens/layouts-subpages-profile-edit-2.png',
    srcDark: '/img/screens/layouts-subpages-profile-edit-2-dark.png',
    order: 77,
  },
  pageTransition: {
    enterActiveClass: 'transition-all duration-500 ease-out',
    enterFromClass: 'translate-y-20 opacity-0',
    enterToClass: 'translate-y-0 opacity-100',
    leaveActiveClass: 'transition-all duration-200 ease-in',
    leaveFromClass: 'translate-y-0 opacity-100',
    leaveToClass: 'translate-y-20 opacity-0',
  },
})

const { data, pending, error, refresh } = await useFetch('/api/profile')
</script>

<template>
  <form class="w-full pb-16">
    <BaseCard>
      <div class="flex items-center justify-between p-4">
        <div>
          <BaseHeading
            tag="h2"
            size="sm"
            weight="medium"
            lead="normal"
            class="uppercase tracking-wider"
          >
            تجربه کاری
          </BaseHeading>
          <BaseText size="xs" class="text-muted-400">
            ویرایش اطلاعات سابقه کاری شما
          </BaseText>
        </div>
        <div class="flex items-center gap-2">
          <BaseButton class="w-24" to="/layouts/profile">
            لغو
          </BaseButton>
          <BaseButton color="primary" class="w-24">
            ذخیره
          </BaseButton>
        </div>
      </div>
      <div class="p-4">
        <div v-if="!data">
          <BasePlaceholderPage
            title="بدون تجربه"
            subtitle="به نظر می‌رسد هنوز هیچ تجربه‌ای اضافه نکرده‌اید. تجربیات خود را به اشتراک بگذارید تا پروفایل خود را بهبود دهید."
            class="scale-90"
          >
            <template #image>
              <img
                class="block dark:hidden"
                src="/img/illustrations/placeholders/flat/placeholder-search-2.svg"
                alt="تصویر مکان نگهدار"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-search-2-dark.svg"
                alt="تصویر مکان نگهدار"
              >
            </template>
            <BaseButton class="mt-4 w-40">
              افزودن تجربه
            </BaseButton>
          </BasePlaceholderPage>
        </div>
        <div v-else class="mx-auto max-w-lg space-y-12 py-8">
          <TairoFormGroup
            label="قبلی تجربیات"
            sublabel="این به دیگران کمک می‌کند تا تجربیات شما را ارزیابی کنند"
          >
            <div class="space-y-8">
              <div
                v-for="item in data.personalInfo.experiences"
                :key="item.company"
                class="flex w-full items-center gap-2"
              >
                <img
                  :src="item.logo"
                  :alt="item.company"
                  class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 max-w-[50px] rounded-full border bg-white"
                >
                <div>
                  <BaseHeading
                    tag="h3"
                    size="sm"
                    weight="medium"
                  >
                    {{ item.company }}
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-400">
                    <span>{{ item.period }}</span>
                  </BaseParagraph>
                  <BaseParagraph size="xs" class="text-primary-500">
                    <span>{{ item.position }}</span>
                  </BaseParagraph>
                </div>
                <div class="ms-auto">
                  <BaseDropdown
                    variant="context"
                    label="منوی کشویی"
                    placement="bottom-end"
                    size="md"
                    class="z-20"
                    rounded="lg"
                  >
                    <BaseDropdownItem
                      to="#"
                      title="ویرایش"
                      text="ویرایش این تجربه"
                    >
                      <template #start>
                        <Icon
                          name="ph:pencil-duotone"
                          class="me-2 block size-5"
                        />
                      </template>
                    </BaseDropdownItem>
                    <BaseDropdownDivider />
                    <BaseDropdownItem
                      to="#"
                      title="حذف"
                      text="حذف این تجربه"
                    >
                      <template #start>
                        <Icon
                          name="ph:trash-duotone"
                          class="me-2 block size-5"
                        />
                      </template>
                    </BaseDropdownItem>
                  </BaseDropdown>
                </div>
              </div>
            </div>
            <div
              class="border-muted-200 dark:border-muted-700 mt-8 flex w-full items-center gap-2 border-t pt-8"
            >
              <div
                class="bg-muted-100 dark:bg-muted-700/60 text-muted-400 flex size-[50px] items-center justify-center rounded-full"
              >
                <Icon name="ph:suitcase-duotone" class="size-5" />
              </div>
              <div>
                <BaseHeading
                  tag="h3"
                  size="sm"
                  weight="medium"
                >
                  تجربه جدید
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-400">
                  <span>افزودن یک تجربه کاری جدید</span>
                </BaseParagraph>
              </div>
              <div class="ms-auto">
                <BaseButtonIcon rounded="full" size="sm">
                  <Icon name="lucide:plus" class="size-4" />
                </BaseButtonIcon>
              </div>
            </div>
          </TairoFormGroup>
        </div>
      </div>
    </BaseCard>
    <TairoFormSave />
  </form>
</template>
