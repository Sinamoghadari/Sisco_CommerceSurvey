<script setup lang="ts">
definePageMeta({
  title: 'تراکنش‌ها',
  preview: {
    title: 'تراکنش‌ها',
    description: 'برای سابقه تراکنش‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-transactions.png',
    srcDark: '/img/screens/layouts-transactions-dark.png',
    order: 69,
    new: true,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(20)

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

const { data, pending, error, refresh } = await useFetch('/api/transactions', {
  query,
})

function statusColor(itemStatus: string) {
  switch (itemStatus) {
    case 'تکمیل شده':
      return 'success'
    case 'در حال تکمیل':
      return 'primary'
    case 'در حال پردازش':
      return 'info'
    case 'رد شده':
      return 'warning'
    default:
      break
  }
}
</script>

<template>
  <div class="w-full pb-24">
    <!--Header-->
    <div class="flex items-center justify-between py-6">
      <div>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          rounded="lg"
          placeholder="جستجوی تراکنش‌ها..."
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-muted-400 font-sans text-sm">
          ۰-{{ perPage }} از {{ data?.total }}
        </span>
      </div>
    </div>

    <div class="w-full">
      <!--Filters-->
      <div class="flex w-full items-center gap-5">
        <!--Dropdown-->
        <div>
          <DemoTransactionsFilters />
        </div>

        <span
          class="text-muted-600 dark:text-muted-500 hidden font-sans text-sm font-medium md:block"
        >
          هیچ فیلتری اعمال نشده است
        </span>

        <div class="ms-auto">
          <BaseButton
            rounded="full"
            size="sm"
          >
            <Icon name="lucide:download" class="me-2 size-4" />
            <span>خروجی همه</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <DemoTransactionsListPlaceload v-if="!pending && data?.data.length === 0" />
    <div v-else class="mt-7 overflow-x-auto px-2">
      <table class="w-full whitespace-nowrap">
        <thead>
          <th
            class="text-muted-400 dark:text-muted-300 w-1/5 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>تاریخ</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 w-2/5 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>به / از</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>مقدار</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>حساب کاربری</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>وضعیت</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>روش پرداخت</span>
          </th>
        </thead>
        <tbody>
          <!--Row-->
          <tr
            v-for="(item, index) in data?.data"
            :key="item.id"
            tabindex="0"
            class="hover:bg-muted-200 dark:hover:bg-muted-800 transition-colors duration-300 ease-in-out"
          >
            <td class="p-4">
              <BaseText
                size="sm"
                weight="medium"
                lead="none"
                class="text-muted-400"
              >
                {{ item.date }}
              </BaseText>
            </td>
            <td class="p-4">
              <BaseText
                size="sm"
                weight="medium"
                lead="none"
                class="text-muted-600 dark:text-muted-300"
              >
                {{ item.issuer }}
              </BaseText>
            </td>
            <td class="p-4">
              <BaseText
                size="sm"
                weight="semibold"
                lead="none"
                class="text-muted-800 dark:text-muted-100"
              >
                {{ item.type === 'in' ? '+' : '-' }} {{
                  item.amount.toFixed(2)
                }} تومان
              </BaseText>
            </td>
            <td class="p-4">
              <BaseText
                size="sm"
                weight="medium"
                lead="none"
                class="text-muted-400"
              >
                {{ item.account }}
              </BaseText>
            </td>
            <td class="p-4">
              <BaseTag
                :variant="index > 6 ? 'solid' : 'pastel'"
                rounded="full"
                :color="index > 6 ? 'default' : statusColor(item.status)"
                size="sm"
              >
                {{ item.status }}
              </BaseTag>
            </td>
            <td class="p-4">
              <div class="text-muted-400 flex items-center gap-2">
                <Icon
                  v-if="item.method === 'کارت اعتباری'"
                  name="ph:credit-card-duotone"
                  class="size-5"
                />
                <Icon
                  v-else-if="item.method === 'چک'"
                  name="ph:pen-nib-duotone"
                  class="size-5"
                />
                <Icon
                  v-else-if="item.method === 'انتقال'"
                  name="ph:arrows-left-right-duotone"
                  class="size-5"
                />
                <Icon
                  v-else-if="item.method === 'bank'"
                  name="ph:bank-duotone"
                  class="size-5"
                />
                <BaseText
                  size="sm"
                  weight="medium"
                  lead="none"
                  class="text-muted-400"
                >
                  {{ item.method }}
                </BaseText>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-6">
        <BasePagination
          :total-items="data?.total ?? 0"
          :item-per-page="perPage"
          :current-page="page"
          :classes="{button:'rtl:rotate-180'}"
          rounded="md"
        />
      </div>
    </div>
  </div>
</template>
