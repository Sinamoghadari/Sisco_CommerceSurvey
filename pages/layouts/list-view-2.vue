<script setup lang="ts">
definePageMeta({
  title: 'لیست مشاهده',
  preview: {
    title: 'نمای لیست ۲',
    description: 'برای نمای لیست‌ها و مجموعه‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-list-view-2.png',
    srcDark: '/img/screens/layouts-list-view-2-dark.png',
    order: 38,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(10)

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
})

const query = computed(() => {
  return {
    filter: filter.value,
    perPage: perPage.value,
    page: page.value,
  }
})

const { data, pending, error, refresh } = await useFetch('/api/rentals', {
  query,
})
</script>

<template>
  <div>
    <TairoContentWrapperTabbed :labels="['فعال', 'غیرفعال']">
      <template #left>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          placeholder="فیلتر کردن ویژگی‌ها..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #tab-1>
        <div>
          <div v-if="!pending && data?.data.length === 0">
            <BasePlaceholderPage
              title="نتیجه‌ی منطبقی یافت نشد"
              subtitle="به نظر می‌رسد که نتوانستیم نتایج مطابقی برای عبارت‌های جستجوی شما پیدا کنیم. عبارت‌های جستجوی دیگری را امتحان کنید."
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
            </BasePlaceholderPage>
          </div>
          <div v-else class="space-y-4">
            <TransitionGroup
              enter-active-class="transform-gpu"
              enter-from-class="opacity-0 -translate-x-full"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="absolute transform-gpu"
              leave-from-class="opacity-100 translate-x-0"
              leave-to-class="opacity-0 -translate-x-full"
            >
              <BaseCard
                v-for="item in data?.data"
                :key="item.id"
                rounded="lg"
                class="flex flex-col p-5 sm:flex-row sm:items-center"
              >
                <div
                  class="flex flex-col justify-center gap-3 text-center sm:flex-row sm:justify-start sm:text-start"
                >
                  <img
                    class="bg-muted-100 dark:bg-muted-700/60 w-full rounded-lg sm:max-w-[130px]"
                    :src="item.picture"
                    :alt="item.name"
                    :height="190"
                    :width="130"
                  >
                  <div>
                    <div
                      class="flex flex-col gap-2 text-start sm:flex-row sm:items-center"
                    >
                      <BaseHeading
                        tag="h3"
                        size="sm"
                        weight="medium"
                        class="text-muted-800 dark:text-muted-100"
                      >
                        {{ item.name }}
                      </BaseHeading>
                      <div class="flex items-center gap-2">
                        <Icon
                          name="uiw:star-on"
                          class="size-3"
                          :class="
                            item.rating > 0
                              ? 'text-yellow-400'
                              : 'text-muted-400'
                          "
                        />
                        <Icon
                          name="uiw:star-on"
                          class="size-3"
                          :class="
                            item.rating >= 2
                              ? 'text-yellow-400'
                              : 'text-muted-400'
                          "
                        />
                        <Icon
                          name="uiw:star-on"
                          class="size-3"
                          :class="
                            item.rating >= 3
                              ? 'text-yellow-400'
                              : 'text-muted-400'
                          "
                        />
                        <Icon
                          name="uiw:star-on"
                          class="size-3"
                          :class="
                            item.rating >= 4
                              ? 'text-yellow-400'
                              : 'text-muted-400'
                          "
                        />
                        <Icon
                          name="uiw:star-on"
                          class="size-3"
                          :class="
                            item.rating === 5
                              ? 'text-yellow-400'
                              : 'text-muted-400'
                          "
                        />
                      </div>
                    </div>
                    <BaseParagraph
                      size="xs"
                      lead="none"
                      class="text-muted-400 mt-3 flex gap-1 text-start text-sm sm:mt-0 sm:items-end"
                    >
                      <Icon name="lucide:map-pin" class="size-3" />
                      <span>{{ item.location }}</span>
                    </BaseParagraph>
                    <div class="text-primary-500 my-2 flex items-center gap-2">
                      <span class="font-sans text-xs">
                        {{ item.details.rooms }} اتاق
                      </span>
                      <span class="text-muted-400">&middot;</span>
                      <span class="font-sans text-xs">
                        {{ item.details.beds }} تخت خواب
                      </span>
                      <span class="text-muted-400">&middot;</span>
                      <span class="font-sans text-xs">
                        {{ item.details.bathrooms }} حمام
                      </span>
                    </div>
                    <div class="text-muted-400 mt-auto flex items-center gap-6">
                      <div
                        v-if="item.amenities.parking"
                        class="flex items-center gap-1"
                      >
                        <Icon name="ph:car-duotone" class="size-4" />
                        <span class="font-sans text-xs">پارکینگ</span>
                      </div>
                      <div
                        v-if="item.amenities.wifi"
                        class="flex items-center gap-1"
                      >
                        <Icon name="ph:broadcast-duotone" class="size-4" />
                        <span class="font-sans text-xs">وای‌فای</span>
                      </div>
                      <div
                        v-if="item.amenities.heater"
                        class="flex items-center gap-1"
                      >
                        <Icon name="ph:thermometer-duotone" class="size-4" />
                        <span class="font-sans text-xs">بخاری</span>
                      </div>
                      <div
                        v-if="item.amenities.cleaning"
                        class="flex items-center gap-1"
                      >
                        <Icon name="ph:waves-duotone" class="size-4" />
                        <span class="font-sans text-xs">نظافت</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="ptablet:flex-col mt-4 flex items-center justify-end gap-2 sm:ms-auto sm:mt-4"
                >
                  <BaseButton class="w-full sm:w-28">
                    اطلاعات بیشتر
                  </BaseButton>
                  <BaseButton color="primary" class="w-full sm:w-28">
                    <span>هم‌اکنون رزرو کنید</span>
                  </BaseButton>
                </div>
              </BaseCard>
            </TransitionGroup>
            <div class="mt-6">
              <BasePagination
                :total="100"
                :item-per-page="10"
                :total-items="100"
                :current="1"
                :limit="10"
                :classes="{button:'rtl:rotate-180'}"
                rounded="full"
              />
            </div>
          </div>
        </div>
      </template>
      <template #tab-2>
        <BasePlaceholderPage
          title="هیچ ویژگی غیر فعال وجود ندارد."
          subtitle="به نظر می‌رسد که ویژگی‌های غیر فعال برای نمایش وجود ندارد. لطفاً تنظیمات ویژگی‌های خود را بررسی کنید."
        >
          <template #image>
            <img
              class="block dark:hidden"
              src="/img/illustrations/placeholders/flat/placeholder-having-coffee.svg"
              alt="تصویر مکان نگهدار"
            >
            <img
              class="hidden dark:block"
              src="/img/illustrations/placeholders/flat/placeholder-having-coffee-dark.svg"
              alt="تصویر مکان نگهدار"
            >
          </template>
        </BasePlaceholderPage>
      </template>
    </TairoContentWrapperTabbed>
  </div>
</template>
