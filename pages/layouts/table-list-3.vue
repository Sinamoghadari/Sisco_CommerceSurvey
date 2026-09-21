<script setup lang="ts">
definePageMeta({
  title: 'جدول لیست',
  preview: {
    title: 'لیست جدولی 3',
    description: 'برای نمای لیست‌ها و مجموعه‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-table-list-3.png',
    srcDark: '/img/screens/layouts-table-list-3-dark.png',
    order: 46,
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
  '/api/company/documents/',
  {
    query,
  },
)

const selected = ref<number[]>([])

const isAllVisibleSelected = computed(() => {
  return selected.value.length === data.value?.data.length
})

function toggleAllVisibleSelection() {
  if (isAllVisibleSelected.value) {
    selected.value = []
  }
  else {
    selected.value = data.value?.data.map(item => item.id) ?? []
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
          placeholder="فیلتر فایل‌ها..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseSelect
          v-model="perPage"
          placeholder="آیتم‌ها در هر صفحه"
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
                <TairoTableHeading
                  uppercase
                  spaced
                  class="p-4"
                >
                  <div class="flex items-center">
                    <BaseCheckbox
                      :model-value="isAllVisibleSelected"
                      :indeterminate="
                        selected.length > 0 && !isAllVisibleSelected
                      "
                      name="table-1-main"
                      rounded="full"
                      color="primary"
                      @click="toggleAllVisibleSelection"
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

              <TairoTableRow v-if="selected.length > 0" :hoverable="false">
                <TairoTableCell
                  colspan="6"
                  class="bg-success-100 text-success-700 dark:bg-success-700 dark:text-success-100 p-4"
                >
                  شما {{ selected.length }} آیتم از مجموع {{ data?.total }} آیتم را انتخاب کرده‌اید.
                  <a
                    href="#"
                    class="outline-none hover:underline focus:underline"
                  >اینجا کلیک کنید برای همه چیز</a>
                </TairoTableCell>
              </TairoTableRow>

              <TairoTableRow v-for="item in data?.data" :key="item.id">
                <TairoTableCell spaced>
                  <div class="flex items-center">
                    <BaseCheckbox
                      v-model="selected"
                      :value="item.id"
                      :name="`item-checkbox-${item.id}`"
                      rounded="full"
                      color="primary"
                    />
                  </div>
                </TairoTableCell>
                <TairoTableCell light spaced>
                  <img
                    :src="item.icon"
                    :alt="item.name"
                    class="max-w-[46px]"
                  >
                </TairoTableCell>
                <TairoTableCell spaced>
                  <span class="font-medium">{{ item.name }}</span>
                </TairoTableCell>
                <TairoTableCell light spaced>
                  {{ item.size }}
                </TairoTableCell>
                <TairoTableCell light spaced>
                  {{ item.version }}
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex items-center">
                    <BaseAvatar
                      :src="item.author.picture"
                      size="xs"
                      class="bg-muted-500/20 text-muted-500"
                    />
                    <div class="ms-3 leading-none">
                      <h4 class="font-sans text-sm font-medium">
                        {{ item.author.name }}
                      </h4>
                      <p class="text-muted-400 font-sans text-xs">
                        {{ item.uploaded }}
                      </p>
                    </div>
                  </div>
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
