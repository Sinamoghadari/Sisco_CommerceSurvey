<script setup lang="ts">
definePageMeta({
  title: 'کارت‌های اعتباری',
  preview: {
    title: 'کارت‌های اعتباری',
    description: 'برای مدیریت کارت',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-cards.png',
    srcDark: '/img/screens/layouts-cards-dark.png',
    order: 13,
    new: true,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(45)
const { open } = usePanels()

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

const { data, pending, error, refresh } = await useFetch('/api/cards', {
  query,
})

const currentCard = ref()

function openCardPanel(id: number, cards: any) {
  currentCard.value = cards.find((card: any) => card.id === id)
  open('card', { card: currentCard })
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
          placeholder="کارت‌ها را جستجو کنید..."
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-muted-400 font-sans text-sm">
          ۰-{{ data?.data.length }} از {{ data?.total }}
        </span>
      </div>
    </div>

    <div class="w-full">
      <!--Filters-->
      <div class="flex w-full items-center gap-5">
        <!--Dropdown-->
        <div>
          <DemoCardFilters />
        </div>

        <BaseText
          size="sm"
          weight="medium"
          class="text-muted-600 dark:text-muted-500 hidden md:block"
        >
          هیچ فیلتری اعمال نشده است
        </BaseText>

        <div class="ms-auto">
          <BaseButton
            to="/layouts/card/new"
            rounded="md"
            color="default"
            size="sm"
          >
            <Icon name="lucide:plus" class="me-2 size-4" />
            <span>کارت جدید</span>
          </BaseButton>
        </div>
      </div>
    </div>
    <!-- از اینجا -->
    <div class="mt-7 overflow-x-auto">
      <table class="w-full whitespace-nowrap">
        <thead>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold md:w-1/5"
          >
            <span>دارنده کارت</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold md:w-2/5"
          >
            <span>کارت</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>هزینه شده این ماه</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>نوع</span>
          </th>
          <th
            class="text-muted-400 dark:text-muted-300 px-4 pb-3 text-start font-sans text-xs font-semibold"
          >
            <span>حساب کاربری</span>
          </th>
        </thead>
        <tbody>
          <tr
            v-for="card in data?.data"
            :key="card.id"
            tabindex="0"
            class="hover:bg-muted-200 dark:hover:bg-muted-800 cursor-pointer transition-colors duration-200 ease-in-out"
            @click="openCardPanel(card.id, data?.data)"
          >
            <td class="p-4">
              <span
                class="text-muted-500 dark:text-muted-300 font-sans text-sm font-medium leading-none"
              >
                {{
                  card.cardInfo.name === 'کندرا ویلسون'
                    ? `${card.cardInfo.name} (شما)`
                    : card.cardInfo.name
                }}
              </span>
            </td>
            <td class="p-4">
              <div
                class="text-muted-500 dark:text-muted-300 me-5 flex items-center gap-2 md:me-0"
              >
                <Icon name="lucide:credit-card" class="size-5" />
                <BaseText
                  size="sm"
                  weight="medium"
                  lead="none"
                >
                  {{ card.cardInfo.number }}
                </BaseText>
                <span
                  class="bg-muted-100 dark:bg-muted-600/10 text-muted-500 m-1 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-sans text-xs"
                >
                  <span
                    class="size-2 rounded-full"
                    :class="[
                      card.cardInfo.status === 'فعال' && 'bg-success-500',
                      card.cardInfo.status === 'غیرفعال' &&
                        'bg-muted-300 dark:bg-muted-700',
                      card.cardInfo.status === 'expired' && 'bg-warning-500',
                      card.cardInfo.status === 'قفل شده' && 'bg-danger-500',
                    ]"
                  />
                  <span>{{ card.cardInfo.status }}</span>
                </span>
              </div>
            </td>
            <td class="p-4">
              <BaseText
                weight="medium"
                lead="none"
                class="text-muted-800 dark:text-muted-100"
              >
                مبلغ خرج شده در ماه: {{ card.monthSpent.toFixed(2) }} تومان
              </BaseText>
            </td>
            <td class="p-4">
              <BaseText
                weight="medium"
                lead="none"
                size="sm"
                class="text-muted-400"
              >
                {{ card.cardInfo.type }}
              </BaseText>
            </td>
            <td class="p-4">
              <BaseText
                weight="medium"
                lead="none"
                size="sm"
                class="text-muted-400"
              >
                {{ card.account }}
              </BaseText>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
