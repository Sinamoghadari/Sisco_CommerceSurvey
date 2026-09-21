<script setup lang="ts">
definePageMeta({
  title: 'جدول لیست',
  preview: {
    title: 'لیست جدولی 2',
    description: 'برای نمای لیست‌ها و مجموعه‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-table-list-2.png',
    srcDark: '/img/screens/layouts-table-list-2-dark.png',
    order: 45,
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

const { data, pending, error, refresh } = await useFetch('/api/products', {
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
          placeholder="فیلتر محصولات..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseSelect
          v-model="perPage"
          label=""
          :classes="{
            wrapper: 'w-full sm:w-40',
          }"
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
          <div class="w-full">
            <TairoTable rounded="sm">
              <template #header>
                <TairoTableHeading uppercase spaced>
                  محصول
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  نام
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  کد کالا
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  قیمت
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  سهام
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  دسته‌بندی
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  اقدام
                </TairoTableHeading>
              </template>

              <TairoTableRow v-for="item in data?.data" :key="item.id">
                <TairoTableCell spaced>
                  <div class="flex items-center">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="max-w-[80px]"
                    >
                  </div>
                </TairoTableCell>
                <TairoTableCell spaced>
                  {{ item.name }}
                </TairoTableCell>
                <TairoTableCell light spaced>
                  {{ item.sku }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  <span class="font-semibold">قیمت {{ item.price }} تومان</span>
                </TairoTableCell>
                <TairoTableCell light spaced>
                  {{ item.stock }}
                </TairoTableCell>
                <TairoTableCell light spaced>
                  <span class="text-primary-500 text-sm font-medium">
                    {{ item.category }}
                  </span>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <BaseButtonAction muted>
                    مدیریت
                  </BaseButtonAction>
                </TairoTableCell>
              </TairoTableRow>
            </TairoTable>
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
