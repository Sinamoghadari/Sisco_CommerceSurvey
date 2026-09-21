<script setup lang="ts">
definePageMeta({
  title: 'لیست پروژه',
  preview: {
    title: 'لیست پروژه 1',
    description: 'برای نمایش لیست پروژه‌ها',
    categories: ['چیدمان‌ها', 'پروژه‌ها'],
    src: '/img/screens/layouts-projects-1.png',
    srcDark: '/img/screens/layouts-projects-1-dark.png',
    order: 68,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(25)

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
  '/api/company/projects',
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
          rounded="sm"
          placeholder="فیلتر پروژه‌ها..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseButton
          color="primary"
          class="w-full sm:w-32"
          rounded="sm"
        >
          <Icon name="lucide:plus" class="me-2 size-4" />
          <span>جدید</span>
        </BaseButton>
      </template>
      <div class="space-y-10">
        <div>
          <div v-if="!pending && data?.recent.length === 0">
            <div class="bg-muted-200 dark:bg-muted-800/60 rounded-lg p-6">
              <BaseHeading
                tag="h4"
                size="lg"
                weight="medium"
              >
                تاریخچه خالی
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                به نظر می‌رسد هنوز هیچ پروژه‌ای را مشاهده نکرده‌اید.
              </BaseParagraph>
            </div>
          </div>
          <div v-else>
            <div>
              <h4
                class="text-muted-400 mb-4 font-sans text-xs font-semibold uppercase"
              >
                به تازگی مشاهده شده
              </h4>
            </div>
            <div
              class="ltablet:grid-cols-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <TransitionGroup
                enter-active-class="transform-gpu"
                enter-from-class="opacity-0 -translate-x-full"
                enter-to-class="opacity-100 translate-x-0"
                leave-active-class="absolute transform-gpu"
                leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 -translate-x-full"
              >
                <NuxtLink
                  v-for="(item, r) in data?.recent.slice(0, 4)"
                  :key="r"
                  class="group block"
                  :to="`/layouts/projects/details/${item.slug}`"
                >
                  <BaseCard
                    rounded="sm"
                    elevated-hover
                    class="group-hover:!border-primary-500 p-5"
                  >
                    <div class="mb-6 flex gap-2">
                      <BaseAvatar
                        :src="item.customer.logo"
                        size="sm"
                        :data-nui-tooltip="item.name"
                        class="bg-muted-100 dark:bg-muted-700"
                      />
                      <div>
                        <BaseHeading
                          tag="h5"
                          size="sm"
                          weight="medium"
                          class="line-clamp-1"
                        >
                          {{ item.name }}
                        </BaseHeading>
                        <BaseParagraph size="xs" class="text-muted-400">
                          {{ item.customer.name }} | {{ item.customer.text }}
                        </BaseParagraph>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <BaseAvatar
                          v-for="stack in item.stacks"
                          :key="stack.name"
                          :src="stack.icon"
                          size="xxs"
                          :data-nui-tooltip="stack.name"
                          class="bg-muted-100 dark:bg-muted-700"
                        />
                      </div>
                      <div class="text-muted-400 flex items-center gap-4">
                        <div class="flex items-center gap-1 text-sm">
                          <Icon name="ph:paperclip-duotone" class="size-4" />
                          <span class="font-sans">
                            {{ item.files.length }}
                          </span>
                        </div>
                        <div class="flex items-center gap-1 text-sm">
                          <Icon name="ph:users-duotone" class="size-4" />
                          <span class="font-sans">{{ item.team.length }}</span>
                        </div>
                      </div>
                    </div>
                  </BaseCard>
                </NuxtLink>
              </TransitionGroup>
            </div>
          </div>
        </div>
        <div>
          <div v-if="!pending && data?.data.length === 0">
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
          <div v-else>
            <div>
              <h4
                class="text-muted-400 mb-4 font-sans text-xs font-semibold uppercase"
              >
                تمام پروژه‌ها
              </h4>
            </div>
            <div
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
                  rounded="sm"
                  elevated-hover
                  class="hover:!border-primary-500"
                >
                  <NuxtLink
                    class="group"
                    :to="`/layouts/projects/details/${item.slug}`"
                  >
                    <div class="p-5">
                      <div class="relative mb-4">
                        <img
                          :src="item.image"
                          :alt="item.name"
                          class="rounded-md"
                        >
                      </div>
                      <div class="mb-6 flex gap-2">
                        <BaseAvatar
                          :src="item.customer.logo"
                          size="sm"
                          :data-nui-tooltip="item.name"
                          class="bg-muted-100 dark:bg-muted-700"
                        />
                        <div>
                          <BaseHeading
                            tag="h5"
                            size="sm"
                            weight="medium"
                            class="line-clamp-1"
                          >
                            {{ item.name }}
                          </BaseHeading>
                          <BaseParagraph size="xs" class="text-muted-400">
                            {{ item.customer.name }} |
                            {{ item.customer.text }}
                          </BaseParagraph>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <BaseAvatar
                            v-for="stack in item.stacks"
                            :key="stack.name"
                            :src="stack.icon"
                            size="xxs"
                            :data-nui-tooltip="stack.name"
                            class="bg-muted-100 dark:bg-muted-700"
                          />
                        </div>
                        <div class="text-muted-400 flex items-center gap-4">
                          <div class="flex items-center gap-1 text-sm">
                            <Icon name="ph:paperclip-duotone" class="size-4" />
                            <span class="font-sans">
                              {{ item.files.length }}
                            </span>
                          </div>
                          <div class="flex items-center gap-1 text-sm">
                            <Icon name="ph:users-duotone" class="size-4" />
                            <span class="font-sans">
                              {{ item.team.length }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="border-muted-200 dark:border-muted-700 bg-muted-50 dark:bg-muted-700/50 flex items-center justify-between rounded-b-lg border-t px-5 py-3"
                    >
                      <div>
                        <p class="text-muted-400 font-sans text-sm">
                          {{ item.tasks.length }} وظیفه باقی‌مانده
                        </p>
                      </div>
                      <div>
                        <BaseAvatarGroup
                          :avatars="item.team"
                          size="xs"
                          :limit="3"
                        />
                      </div>
                    </div>
                  </NuxtLink>
                </BaseCard>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
