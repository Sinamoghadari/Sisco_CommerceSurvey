<script setup lang="ts">

definePageMeta({
  title: 'گیرندگان',
  preview: {
    title: 'گیرندگان',
    description: 'برای مدیریت مخاطبین',
    categories: ['چیدمان‌ها', 'لیست‌ها', 'پرداخت‌ها'],
    src: '/img/screens/layouts-payments-recipients.png',
    srcDark: '/img/screens/layouts-payments-recipients-dark.png',
    order: 80,
    new: true,
  },
})

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(100)

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
  '/api/payments/recipients',
  {
    query,
  },
)

const people = computed(() => {
  return data?.value?.data.filter((item: any) => item.type === 'person')
})

const companies = computed(() => {
  return data?.value?.data.filter((item: any) => item.type === 'company')
})
</script>

<template>
  <div class="w-full">
    <div class="space-y-10">
      <!--Recipients-->
      <div class="w-full">
        <div class="mb-5 flex items-center gap-4">
          <BaseButtonIcon
            to="/layouts/contacts/create"
            rounded="full"
            size="sm"
            data-nui-tooltip="Add recipient"
          >
            <Icon name="lucide:plus" class="size-4" />
          </BaseButtonIcon>
          <h3 class="font-heading text-muted-800 dark:text-muted-200 text-xl">
            مخاطبین
          </h3>
          <div class="ms-auto">
            <BaseInput
              v-model="filter"
              icon="lucide:search"
              rounded="lg"
              placeholder="جستجوی مخاطبان..."
            />
          </div>
        </div>

        <div class="py-6">
          <BaseParagraph
            size="sm"
            weight="medium"
            class="text-muted-400 mb-4 uppercase"
          >
            افراد
          </BaseParagraph>

          <!--Placeholder-->
          <DemoPlaceholderMinimal
            v-if="people?.length === 0"
            title="تماسی یافت نشد"
            description="نتیجه‌ای پیدا نشد. عبارت‌های جستجوی دیگری را امتحان کنید."
            transparent
          />

          <!--People-->
          <div v-else class="grid gap-5 md:grid-cols-3">
            <!--Grid item-->
            <NuxtLink
              v-for="item in people"
              :key="item.id"
              :to="`/layouts/recipient/${item.slug}`"
              class="group/contact"
            >
              <BaseCard
                rounded="md"
                shadow="hover"
                class="group-hover/contact:border-primary-500 p-4"
              >
                <div class="flex items-center gap-2">
                  <BaseAvatar
                    rounded="full"
                    size="sm"
                    :src="item.picture"
                    class="bg-muted-100 dark:bg-muted-700/60"
                  />
                  <div>
                    <h5
                      class="text-muted-500 dark:text-muted-300 font-sans text-sm font-medium leading-none"
                    >
                      {{ item.name }}
                    </h5>
                    <p class="text-muted-400 font-sans text-xs">
                      {{ item.category }}
                    </p>
                  </div>
                  <div class="ms-auto">
                    <div
                      class="bg-muted-100 dark:bg-muted-900 text-muted-300 dark:text-muted-200 flex size-8 items-center justify-center rounded-full opacity-0 transition-opacity duration-200 group-hover/contact:opacity-100"
                    >
                      <Icon name="lucide:more-horizontal" class="size-5" />
                    </div>
                  </div>
                </div>
              </BaseCard>
            </NuxtLink>
          </div>
        </div>

        <div class="py-6">
          <BaseParagraph
            size="sm"
            weight="medium"
            class="text-muted-400 mb-4 uppercase"
          >
            شرکت‌ها
          </BaseParagraph>

          <!--Placeholder-->
          <DemoPlaceholderMinimal
            v-if="companies?.length === 0"
            title="هیچ مخاطبی برای نمایش وجود ندارد"
            description="نتیجه‌ای پیدا نشد. عبارت‌های جستجوی دیگری را امتحان کنید."
            transparent
          />

          <!--Companies-->
          <div v-else class="grid gap-5 md:grid-cols-3">
            <!--Grid item-->
            <NuxtLink
              v-for="item in companies"
              :key="item.id"
              :to="`/layouts/recipient/${item.slug}`"
              class="group/contact"
            >
              <BaseCard
                rounded="md"
                shadow="hover"
                class="group-hover/contact:border-primary-500 p-4"
              >
                <div class="flex items-center gap-2">
                  <BaseAvatar
                    rounded="full"
                    size="sm"
                    :src="item.picture"
                    class="bg-muted-100 dark:bg-muted-700/60"
                  />
                  <div>
                    <h5
                      class="text-muted-500 dark:text-muted-300 font-sans text-sm font-medium leading-none"
                    >
                      {{ item.name }}
                    </h5>
                    <p class="text-muted-400 font-sans text-xs">
                      {{ item.category }}
                    </p>
                  </div>
                  <div class="ms-auto">
                    <div
                      class="bg-muted-100 dark:bg-muted-900 text-muted-300 dark:text-muted-200 flex size-8 items-center justify-center rounded-full opacity-0 transition-opacity duration-200 group-hover/contact:opacity-100"
                    >
                      <Icon name="lucide:more-horizontal" class="size-5" />
                    </div>
                  </div>
                </div>
              </BaseCard>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
