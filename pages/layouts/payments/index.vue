<script setup lang="ts">
definePageMeta({
  title: 'پرداخت‌ها',
  preview: {
    title: 'پرداخت‌های ارسالی',
    description: 'برای مدیریت پرداخت‌ها و دریافت‌ها',
    categories: ['چیدمان‌ها', 'لیست‌ها', 'پرداخت‌ها'],
    src: '/img/screens/layouts-payments.png',
    srcDark: '/img/screens/layouts-payments-dark.png',
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
  '/api/payments/outgoing',
  {
    query,
  },
)

const toApprove = computed(() => {
  return data?.value?.data.filter((item: any) => item.status === 'در انتظار')
})

const scheduled = computed(() => {
  return data?.value?.data.filter((item: any) => item.status === 'scheduled')
})
</script>

<template>
  <div class="mt-6 w-full">
    <div class="space-y-10">
      <!--Needs approval-->
      <div class="w-full">
        <h3
          class="font-heading text-muted-800 dark:text-muted-200 mb-5 text-xl"
        >
          نیاز به تأیید دارد
        </h3>

        <!--Placeholder-->
        <DemoPlaceholderMinimal
          v-if="toApprove?.length === 0"
          title="هیچ تأییدیه‌ای در انتظار نیست"
          description="شما تأییدیه‌های پرداختی ندارید. لطفاً بعداً مراجعه کنید."
        />

        <!--Payments approval list-->
        <div
          v-else
          class="divide-muted-200 dark:divide-muted-800 mt-3 divide-y"
        >
          <!--item-->
          <div
            v-for="item in toApprove"
            :key="item.id"
            class="hover:bg-muted-200 dark:hover:bg-muted-800 flex flex-col items-center py-3 transition-colors duration-300 md:flex-row"
          >
            <div class="flex flex-col items-center gap-2 md:flex-row">
              <BaseAvatar
                rounded="full"
                size="md"
                :src="item.recipient.logo"
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
            <div
              class="flex flex-col items-center gap-6 md:ms-auto md:flex-row"
            >
              <div>
                <span
                  class="text-muted-800 dark:text-muted-100 font-sans text-base font-medium leading-none"
                >
                  مبلغ {{ item.amount }} تومان
                </span>
              </div>
              <div>
                <span
                  class="text-muted-500 dark:text-muted-300 font-sans text-sm font-medium leading-none"
                >
                  {{ item.date }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <BaseButton
                  color="default"
                  rounded="md"
                  size="sm"
                >
                  لغو
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Scheduled-->
      <div class="w-full">
        <h3
          class="font-heading text-muted-800 dark:text-muted-200 mb-5 text-xl"
        >
          برنامه‌ریزی‌شده
        </h3>

        <!--Placeholder-->
        <DemoPlaceholderMinimal
          v-if="scheduled?.length === 0"
          title="بدون پرداخت‌های برنامه‌ریزی‌شده"
          description="شما هیچ پرداخت برنامه‌ریزی‌شده‌ای ندارید. لطفا بعدا برگردید."
        />

        <!--Scheduled payments list-->
        <div
          v-else
          class="divide-muted-200 dark:divide-muted-800 mt-3 divide-y"
        >
          <!--item-->
          <div
            v-for="item in scheduled"
            :key="item.id"
            class="hover:bg-muted-200 dark:hover:bg-muted-800 flex flex-col items-center py-3 transition-colors duration-300 md:flex-row md:px-3"
          >
            <div class="flex flex-col items-center gap-2 md:flex-row">
              <BaseAvatar
                rounded="full"
                size="md"
                :src="item.recipient.logo"
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
            <div
              class="flex flex-col items-center gap-6 md:ms-auto md:flex-row"
            >
              <div>
                <span
                  class="text-muted-800 dark:text-muted-100 font-sans text-base font-medium leading-none"
                >
                  مبلغ {{ item.amount }} تومان
                </span>
              </div>
              <div>
                <span
                  class="text-muted-500 dark:text-muted-300 font-sans text-sm font-medium leading-none"
                >
                  {{ item.date }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <BaseButton
                  color="muted"
                  rounded="md"
                  size="sm"
                >
                  لغو
                </BaseButton>
                <BaseButton rounded="md" size="sm">
                  اکنون پرداخت کنید
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
