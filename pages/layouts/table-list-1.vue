<script setup lang="ts">
definePageMeta({
  title: 'جدول لیست',
  preview: {
    title: 'لیست جدول ۱',
    description: 'برای نمای لیست‌ها و مجموعه‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-table-list-1.png',
    srcDark: '/img/screens/layouts-table-list-1-dark.png',
    order: 44,
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
  '/api/company/members/',
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
          placeholder="فیلتر کردن کاربران..."
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
            <TairoTable rounded="sm" :scrollable="false">
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
                      rounded="sm"
                      color="primary"
                      @click="toggleAllVisibleSelection"
                    />
                  </div>
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  همکار
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  موقعیت
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  وضعیت
                </TairoTableHeading>
                <TairoTableHeading uppercase spaced>
                  تکمیل شده
                </TairoTableHeading>
                <TairoTableHeading
                  uppercase
                  spaced
                  class="text-end"
                >
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
                      rounded="sm"
                      color="primary"
                    />
                  </div>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex items-center">
                    <BaseAvatar
                      :src="item.picture"
                      :text="item.initials"
                      :class="getRandomColor()"
                    />
                    <div class="ms-3 leading-none">
                      <h4 class="font-sans text-sm font-medium">
                        {{ item.username }}
                      </h4>
                      <p class="text-muted-400 font-sans text-xs">
                        {{ item.position }}
                      </p>
                    </div>
                  </div>
                </TairoTableCell>
                <TairoTableCell light spaced>
                  {{ item.location }}
                </TairoTableCell>
                <TairoTableCell spaced class="capitalize">
                  <BaseTag
                    v-if="item.status === 'در دسترس'"
                    color="success"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                    class="font-medium"
                  >
                    {{ item.status }}
                  </BaseTag>
                  <BaseTag
                    v-else-if="item.status === 'جدید'"
                    color="info"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                    class="font-medium"
                  >
                    {{ item.status }}
                  </BaseTag>
                  <BaseTag
                    v-else-if="item.status === 'مشغول'"
                    color="warning"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                    class="font-medium"
                  >
                    {{ item.status }}
                  </BaseTag>
                  <BaseTag
                    v-else-if="item.status === 'offline'"
                    color="muted"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                    class="font-medium"
                  >
                    {{ item.status }}
                  </BaseTag>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex items-center">
                    <div class="relative">
                      <BaseProgressCircle
                        :value="item.completed"
                        :thickness="1"
                        :size="50"
                        class="text-success-500"
                      />
                      <span
                        class="absolute start-1/2 top-1/2 z-10 ms-0.5 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 font-sans text-[0.65rem] font-semibold rtl:me-0.5 rtl:ms-0 rtl:translate-x-1/2"
                      >
                        {{ item.completed }}%
                      </span>
                    </div>
                    <span class="text-muted-400 font-sans text-xs">
                      وظایف انجام شده
                    </span>
                  </div>
                </TairoTableCell>
                <TairoTableCell spaced>
                  <div class="flex justify-end">
                    <BaseDropdown
                      variant="context"
                      label="منوی کشویی"
                      placement="bottom-end"
                      rounded="md"
                    >
                      <BaseDropdownItem
                        to="#"
                        title="User"
                        text="مشاهده جزئیات"
                        rounded="md"
                      />
                    </BaseDropdown>
                  </div>
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
