<script setup lang="ts">
definePageMeta({
  title: 'کاربران',
  preview: {
    title: 'شبکه کاربر 2',
    description: 'برای شبکه‌بندی اقلام و مجموعه‌ها',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-user-grid-2.png',
    srcDark: '/img/screens/layouts-user-grid-2-dark.png',
    order: 65,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(18)

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
  '/api/company/candidates',
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
          placeholder="فیلتر کردن کاربران..."
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
          class="w-full sm:w-32"
          rounded="lg"
        >
          <Icon name="lucide:plus" class="size-4" />
          <span>افزودن کاربر</span>
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
        <div
          v-else
          class="ltablet:grid-cols-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
              elevated-hover
              class="p-6"
            >
              <div class="mb-3 flex w-full items-center justify-center">
                <BaseAvatar
                  size="xl"
                  rounded="lg"
                  :src="item.src"
                  :badge-src="item.badge"
                  :text="item.initials"
                  :class="getRandomColor()"
                />
              </div>
              <div class="text-center">
                <BaseHeading
                  tag="h3"
                  size="md"
                  weight="medium"
                  lead="none"
                >
                  {{ item.username }}
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-400">
                  {{ item.position }}
                </BaseParagraph>
              </div>
              <div class="mb-6 mt-4 flex items-center justify-center gap-3">
                <BaseAvatar
                  v-for="relation in item.relations.slice(0, 3)"
                  :key="relation.id"
                  size="xs"
                  rounded="lg"
                  :src="relation.src"
                  :text="relation.text"
                  :class="getRandomColor()"
                />
              </div>
              <div class="flex items-center gap-2">
                <BaseButton rounded="lg" class="w-full">
                  <Icon name="ph:user-duotone" class="size-4 me-2" />
                  <span>پروفایل</span>
                </BaseButton>
                <BaseButton rounded="lg" class="w-full">
                  <Icon name="ph:chat-circle-duotone" class="me-2 size-4" />
                  <span>صحبت</span>
                </BaseButton>
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
