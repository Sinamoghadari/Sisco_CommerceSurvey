<script setup lang="ts">
definePageMeta({
  title: 'کارت شبکه',
  preview: {
    title: 'شبکه کارت‌ها 3',
    description: 'برای شبکه‌بندی اقلام و مجموعه‌ها',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-card-grid-3.png',
    srcDark: '/img/screens/layouts-card-grid-3-dark.png',
    order: 59,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(12)

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

const { data, pending, error, refresh } = await useFetch(
  '/api/company/projects/',
  {
    query,
  },
)
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          rounded="lg"
          placeholder="فیلتر پروژه‌ها..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseButton rounded="lg" class="w-full sm:w-32">
          تنظیمات
        </BaseButton>
        <BaseButton
          rounded="lg"
          color="primary"
          class="w-full sm:w-32"
        >
          <Icon name="lucide:plus" class="me-2 size-4" />
          <span>ایجاد کردن</span>
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
                src="/img/illustrations/placeholders/flat/placeholder-search-7.svg"
                alt="تصویر مکان نگهدار"
              >
              <img
                class="hidden dark:block"
                src="/img/illustrations/placeholders/flat/placeholder-search-7-dark.svg"
                alt="تصویر مکان نگهدار"
              >
            </template>
          </BasePlaceholderPage>
        </div>
        <div v-else>
          <div
            class="ltablet:grid-cols-3 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                v-for="item in data?.data"
                :key="item.id"
                rounded="lg"
                class="p-6"
              >
                <div class="mb-3 flex items-center justify-center">
                  <BaseAvatar
                    :src="item.owner.avatar"
                    :badge-src="item.image"
                    rounded="lg"
                    size="lg"
                    :data-nui-tooltip="item.owner.name"
                    class="bg-muted-500/20 text-muted-500"
                  />
                </div>
                <div class="my-4 flex flex-col items-center justify-between">
                  <div class="text-center" :data-nui-tooltip="item.name">
                    <h4
                      class="text-muted-800 dark:text-muted-100 line-clamp-1 font-sans text-base font-medium"
                    >
                      {{ item.name }}
                    </h4>
                    <div
                      class="text-muted-400 flex items-center justify-center gap-1"
                    >
                      <Icon name="ph:calendar-blank-duotone" class="size-4" />
                      <p class="font-sans text-sm">
                        {{ item.dueDate }}
                      </p>
                    </div>
                  </div>
                  <div class="my-4">
                    <BaseAvatarGroup
                      size="xs"
                      :limit="2"
                      :avatars="item.team"
                    />
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <BaseButton rounded="lg" class="w-full">
                    وظایف
                  </BaseButton>
                  <BaseButton rounded="lg" class="w-full">
                    فعالیت
                  </BaseButton>
                </div>
              </BaseCard>
            </TransitionGroup>
          </div>
          <div class="mt-6">
            <BasePagination
              :total-items="data?.total ?? 0"
              :item-per-page="perPage"
              :current-page="page"
              :classes="{button:'rtl:rotate-180'}"
              rounded="lg"
            />
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
