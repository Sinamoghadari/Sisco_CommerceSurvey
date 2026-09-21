<script setup lang="ts">
definePageMeta({
  title: 'پرداخت‌ها',
  preview: {
    title: 'پرداخت‌های دریافتی',
    description: 'برای مدیریت پرداخت‌ها و دریافت‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها', 'پرداخت‌ها'],
    src: '/img/screens/layouts-payments-incoming.png',
    srcDark: '/img/screens/layouts-payments-incoming-dark.png',
    order: 80,
    new: true,
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
  '/api/payments/incoming',
  {
    query,
  },
)

const completed = computed(() => {
  return data?.value?.data.filter((item: any) => item.status === 'تکمیل شده')
})

const active = computed(() => {
  return data?.value?.data.filter((item: any) => item.status !== 'تکمیل شده')
})

function statusColor(itemStatus: string) {
  switch (itemStatus) {
    case 'تکمیل شده':
      return 'default'
    case 'در حال تکمیل':
      return 'success'
    case 'ارسال شد':
      return 'info'
    case 'باز شده':
      return 'primary'
    default:
      break
  }
}
</script>

<template>
  <div class="mt-6 w-full">
    <div class="space-y-10">
      <!-- Payments received -->
      <div class="mb-16 w-full">
        <h3
          class="font-heading text-muted-800 dark:text-muted-200 mb-5 text-xl"
        >
          پرداخت‌های دریافتی
        </h3>

        <!--Placeholder-->
        <DemoPlaceholderMinimal
          v-if="completed?.length === 0"
          title="پرداختی برای نمایش وجود ندارد"
          description="شما هیچ درخواست پرداختی کامل نشده دارید. لطفاً بعداً برگردید."
        />

        <!--Payments list-->
        <div v-else class="mt-7 overflow-x-auto">
          <table class="w-full whitespace-nowrap">
            <thead>
              <th
                class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold md:w-1/5"
              >
                <span>ایجاد شده</span>
              </th>
              <th
                class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold md:w-2/5"
              >
                <span>تماس</span>
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
                <span>اقدامات</span>
              </th>
            </thead>
            <tbody>
              <!--Row-->
              <tr
                v-for="(item, index) in completed"
                :key="item.id"
                tabindex="0"
                class="hover:bg-muted-200 dark:hover:bg-muted-800 transition-colors duration-300"
              >
                <td class="p-4">
                  <span
                    class="text-muted-500 dark:text-muted-300 font-sans text-sm font-medium leading-none"
                  >
                    {{ item.date }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="me-5 flex items-center gap-2 md:me-0">
                    <BaseAvatar
                      rounded="full"
                      size="xs"
                      :src="item.recipient.photo"
                      class="bg-muted-100 dark:bg-muted-700/60"
                    />
                    <BaseText
                      size="sm"
                      lead="none"
                      weight="medium"
                      class="text-muted-500 dark:text-muted-300"
                    >
                      {{ item.recipient.name }}
                    </BaseText>
                  </div>
                </td>
                <td class="p-4">
                  <span
                    class="text-muted-800 dark:text-muted-100 font-sans text-base font-medium leading-none"
                  >
                    {{ item.amount.toFixed(2) }} تومان
                  </span>
                </td>
                <td class="p-4">
                  <span
                    class="text-muted-400 font-sans text-sm font-medium leading-none"
                  >
                    {{ item.account }}
                  </span>
                </td>
                <td class="p-4">
                  <BaseTag
                    :variant="item.status === 'تکمیل شده' ? 'solid' : 'pastel'"
                    rounded="full"
                    :color="index > 6 ? 'muted' : statusColor(item.status)"
                    size="sm"
                  >
                    {{ item.status }}
                  </BaseTag>
                </td>
                <td class="p-4 text-end">
                  <BaseButton rounded="md" size="sm">
                    جزئیات
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Payments requests -->
      <div class="w-full">
        <h3
          class="font-heading text-muted-800 dark:text-muted-200 mb-5 text-xl"
        >
          درخواست‌های پرداخت
        </h3>

        <!--Placeholder-->
        <DemoPlaceholderMinimal
          v-if="active?.length === 0"
          title="بدون درخواست پرداخت"
          description="Yo have no payment requests pending. Please come back later."
        />

        <!--Payments list-->
        <div v-else class="mt-7 overflow-x-auto">
          <table class="w-full whitespace-nowrap">
            <thead>
              <th
                class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold md:w-1/5"
              >
                <span>ایجاد شده</span>
              </th>
              <th
                class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold md:w-2/5"
              >
                <span>تماس</span>
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
                <span>اقدامات</span>
              </th>
            </thead>
            <tbody>
              <!--Row-->
              <tr
                v-for="(item, index) in active"
                :key="item.id"
                tabindex="0"
                class="hover:bg-muted-200 dark:hover:bg-muted-800 transition-colors duration-300"
              >
                <td class="p-4">
                  <span
                    class="text-muted-500 dark:text-muted-300 font-sans text-sm font-medium leading-none"
                  >
                    {{ item.date }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="me-5 flex items-center gap-2 md:me-0">
                    <BaseAvatar
                      rounded="full"
                      size="xs"
                      :src="item.recipient.photo"
                      class="bg-muted-100 dark:bg-muted-700/60"
                    />
                    <BaseText
                      size="sm"
                      lead="none"
                      weight="medium"
                      class="text-muted-500 dark:text-muted-300"
                    >
                      {{ item.recipient.name }}
                    </BaseText>
                  </div>
                </td>
                <td class="p-4">
                  <span
                    class="text-muted-800 dark:text-muted-100 font-sans text-base font-medium leading-none"
                  >
                    {{ item.amount.toFixed(2) }} تومان
                  </span>
                </td>
                <td class="p-4">
                  <span
                    class="text-muted-400 font-sans text-sm font-medium leading-none"
                  >
                    {{ item.account }}
                  </span>
                </td>
                <td class="p-4">
                  <BaseTag
                    :variant="item.status === 'تکمیل شده' ? 'solid' : 'pastel'"
                    rounded="full"
                    :color="index > 6 ? 'muted' : statusColor(item.status)"
                    size="sm"
                  >
                    {{ item.status }}
                  </BaseTag>
                </td>
                <td class="p-4 text-end">
                  <BaseButton
                    color="muted"
                    rounded="md"
                    size="sm"
                  >
                    لغو
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
