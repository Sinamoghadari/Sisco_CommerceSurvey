<script setup lang="ts">
definePageMeta({
  title: 'شبکه کاشی‌وار',
  preview: {
    title: 'شبکه کاشی 3',
    description: 'برای شبکه‌بندی اقلام و مجموعه‌ها',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-tile-grid-3.png',
    srcDark: '/img/screens/layouts-tile-grid-3-dark.png',
    order: 63,
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

const { data, pending, error, refresh } = await useFetch('/api/recipes', {
  query,
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          rounded="lg"
          placeholder="فیلتر دستورالعمل‌ها..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseButton class="w-full sm:w-32" rounded="lg">
          مدیریت
        </BaseButton>
        <BaseButton
          color="primary"
          class="w-full text-nowrap sm:w-32"
          rounded="lg"
        >
          <Icon name="lucide:plus" class="me-2 size-4" />
          <span>بارگذاری</span>
        </BaseButton>
      </template>
      <div>
        <div v-if="!pending && data?.data.length === 0">
          <BasePlaceholderPage
            title="نتیجه‌ی منطبقی یافت نشد"
            subtitle="به نظر می‌رسد که نتوانستیم نتایج مطابقی برای عبارت‌های جستجوی شما پیدا کنیم. عبارت‌های جستجوی دیگری را امتحان کنید."
          >
            <template #image>
              <img
                class="block dark:hidden"
                src="/img/illustrations/placeholders/flat/placeholder-search-3.svg"
                alt="تصویر مکان نگهدار"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-search-3-dark.svg"
                alt="تصویر مکان نگهدار"
              >
            </template>
          </BasePlaceholderPage>
        </div>
        <div
          v-else
          class="ltablet:grid-cols-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <TransitionGroup
            enter-active-class="transform-gpu"
            enter-from-class="opacity-0 -translate-x-full"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="absolute transform-gpu"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-full"
          >
            <BaseCard
              v-for="(item, index) in data?.data"
              :key="index"
              rounded="lg"
              class="p-3"
            >
              <div class="flex w-full items-center gap-2">
                <BaseAvatar
                  :src="item.icon"
                  :badge-src="item.author.avatar"
                  :data-nui-tooltip="`by ${item.author.name}`"
                  size="md"
                  class="bg-muted-100 dark:bg-muted-700/70"
                />
                <div>
                  <BaseHeading
                    tag="h3"
                    size="sm"
                    weight="medium"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ item.name }}
                  </BaseHeading>
                  <div
                    class="flex items-center justify-center gap-6 sm:justify-start sm:gap-0"
                  >
                    <div
                      class="text-muted-400 mt-3 flex items-center gap-1 text-start text-xs sm:mt-0"
                    >
                      <Icon name="lucide:archive" class="size-3" />
                      <span>{{ item.category }}</span>
                    </div>
                    <div class="hidden px-2 sm:block">
                      <span>&middot;</span>
                    </div>
                    <div
                      class="text-muted-400 mt-3 flex items-center gap-1 text-start text-xs sm:mt-0"
                    >
                      <Icon name="lucide:clock" class="size-3" />
                      <span>{{ item.duration }}</span>
                    </div>
                    <div class="hidden px-2 sm:block">
                      <span>&middot;</span>
                    </div>
                    <div
                      class="text-muted-400 mt-3 flex items-center gap-1 text-start text-xs sm:mt-0"
                    >
                      <Icon name="lucide:paperclip" class="size-3" />
                      <span>{{ item.attachments }}</span>
                    </div>
                  </div>
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
                      title="دانلود"
                      text="دانلود دستور پخت"
                    >
                      <template #start>
                        <Icon
                          name="ph:download-duotone"
                          class="me-2 block size-5"
                        />
                      </template>
                    </BaseDropdownItem>
                    <BaseDropdownDivider />
                    <BaseDropdownItem
                      to="#"
                      title="اشتراک‌گذاری"
                      text="اشتراک‌گذاری دستور پخت"
                    >
                      <template #start>
                        <Icon
                          name="ph:share-duotone"
                          class="me-2 block size-5"
                        />
                      </template>
                    </BaseDropdownItem>
                    <BaseDropdownDivider />
                    <BaseDropdownItem
                      to="#"
                      title="ذخیره"
                      text="ذخیره دستور پخت"
                    >
                      <template #start>
                        <Icon
                          name="ph:bookmark-simple-duotone"
                          class="me-2 block size-5"
                        />
                      </template>
                    </BaseDropdownItem>
                  </BaseDropdown>
                </div>
              </div>
            </BaseCard>
          </TransitionGroup>
        </div>
        <div v-if="!pending && data?.data.length !== 0" class="mt-4">
          <BasePagination
            :total-items="data?.total ?? 0"
            :item-per-page="perPage"
            :current-page="page"
            :classes="{button:'rtl:rotate-180'}"
            rounded="lg"
          />
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
