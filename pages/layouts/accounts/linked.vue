<script setup lang="ts">
definePageMeta({
  title: 'حساب‌های متصل',
  preview: {
    title: 'حساب‌های متصل',
    description: 'برای مدیریت حساب',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-accounts-linked.png',
    srcDark: '/img/screens/layouts-accounts-linked-dark.png',
    order: 76,
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

const { data, pending, error, refresh } = await useFetch(
  '/api/accounts/linked',
  {
    query,
  },
)
</script>

<template>
  <div>
    <!--Placeholder-->
    <DemoPlaceholderMinimal
      v-if="data?.data?.length === 0"
      title="در حال حاضر هیچ حساب متصل ندارید"
      description="حساب‌های بانکی خارجی را برای انتقال وجه متصل کنید. پس از افزودن حساب، می‌توانید از اینجا آنها را مدیریت کنید."
    >
      <div class="mt-3 flex justify-center">
        <BaseButton
          rounded="md"
          color="primary"
          class="w-40"
        >
          اتصال یک حساب
        </BaseButton>
      </div>
    </DemoPlaceholderMinimal>

    <div v-else>
      <!-- Load data here -->
    </div>
  </div>
</template>
