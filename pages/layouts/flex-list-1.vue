<script setup lang="ts">
definePageMeta({
  title: 'لیست فلکس',
  preview: {
    title: 'لیست فلکسی 1',
    description: 'برای نمای لیست‌ها و مجموعه‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-list-flex-1.png',
    srcDark: '/img/screens/layouts-list-flex-1-dark.png',
    order: 41,
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

const { data, pending, error, refresh } = await useFetch(
  '/api/company/candidates',
  {
    query,
  },
)

function statusColor(itemStatus: string) {
  switch (itemStatus) {
    case 'آنلاین':
      return 'success'
    case 'مشغول':
      return 'info'
    case 'تعلیق شده':
      return 'warning'
    default:
      break
  }
}
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          placeholder="فیلتر کردن کاربران..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseButton class="w-full sm:w-32">
          مدیریت
        </BaseButton>
        <BaseButton color="primary" class="w-full sm:w-32">
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
        <div v-else class="space-y-2 pt-6">
          <TransitionGroup
            enter-active-class="transform-gpu"
            enter-from-class="opacity-0 -translate-x-full"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="absolute transform-gpu"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-full"
          >
            <DemoFlexTableRow
              v-for="(item, index) in data?.data"
              :key="index"
              rounded="sm"
              spaced
            >
              <template #start>
                <DemoFlexTableStart
                  label="کاربر"
                  :hide-label="index > 0"
                  :title="item.username"
                  :subtitle="item.position"
                  :avatar="item.src"
                  :badge="item.badge"
                  :initials="item.initials"
                />
              </template>
              <template #end>
                <DemoFlexTableCell
                  label="موقعیت"
                  :hide-label="index > 0"
                  class="w-full sm:w-40"
                >
                  <span
                    class="text-muted-500 dark:text-muted-400 font-sans text-sm"
                  >
                    {{ item.location }}
                  </span>
                </DemoFlexTableCell>
                <DemoFlexTableCell
                  label="صنعت"
                  :hide-label="index > 0"
                  class="w-full sm:w-40"
                >
                  <span
                    class="text-muted-500 dark:text-muted-400 font-sans text-sm"
                  >
                    {{ item.industry }}
                  </span>
                </DemoFlexTableCell>
                <DemoFlexTableCell
                  label="وضعیت"
                  :hide-label="index > 0"
                  class="w-full sm:w-16"
                >
                  <BaseTag
                    :color="statusColor(item.status)"
                    rounded="full"
                    variant="pastel"
                    size="sm"
                    class="text-nowrap capitalize"
                  >
                    {{ item.status }}
                  </BaseTag>
                </DemoFlexTableCell>
                <DemoFlexTableCell
                  label="ارتباطات"
                  :hide-label="index > 0"
                  tablet-hidden
                  class="w-full sm:w-[160px]"
                >
                  <BaseAvatarGroup
                    size="xs"
                    :avatars="item.relations"
                    :limit="2"
                  />
                </DemoFlexTableCell>
                <DemoFlexTableCell label="اقدام" :hide-label="index > 0">
                  <BaseButtonAction color="muted">
                    <span>مشاهده</span>
                  </BaseButtonAction>
                </DemoFlexTableCell>
              </template>
            </DemoFlexTableRow>
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
