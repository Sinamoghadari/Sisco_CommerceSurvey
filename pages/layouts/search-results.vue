<script setup lang="ts">
definePageMeta({
  title: 'جستجو نتایج',
  preview: {
    title: 'نتایج جستجو',
    description: 'برای نمایش نتایج جستجو',
    categories: ['چیدمان‌ها'],
    src: '/img/screens/layouts-subpages-search-results.png',
    srcDark: '/img/screens/layouts-subpages-search-results-dark.png',
    order: 82,
  },
})

const { data, pending, error, refresh } = await useFetch('/api/search')

const searchTerms = ref('پروژه‌های داخلی')
const results = ref()
const filters = reactive({
  publication: {
    new: false,
    updated: false,
    upvoted: false,
  },
  topics: {
    engineering: false,
    software: false,
    business: false,
    management: false,
    hr: false,
  },
  type: {
    members: false,
    projects: false,
    files: false,
  },
})

if (data.value) {
  results.value = data.value
}

const activeFilter = ref('all')
const filteredResults = computed(() => {
  if (activeFilter.value === 'all') {
    return results.value
  }
  return results.value.filter(
    (result: any) => result.type === activeFilter.value,
  )
})
</script>

<template>
  <div class="mx-auto w-full max-w-5xl">
    <div class="mx-auto mt-6 flex w-full max-w-sm items-center justify-center">
      <BaseInput
        v-model="searchTerms"
        icon="lucide:search"
        placeholder="جستجو..."
        rounded="full"
        :classes="{
          wrapper: 'w-full',
          input: 'h-12 !ps-12',
          icon: 'h-12 w-12 [& > svg]:!w-7 [& > svg]:!h-7',
        }"
      />
    </div>
    <div class="mb-12 mt-2 text-center">
      <BaseText
        size="sm"
        class="text-muted-400"
      >
        ۷۸ نتیجه برای "پروژه‌های داخلی"
      </BaseText>
    </div>
    <div v-if="results === null">
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
    <div v-else class="grid grid-cols-12 gap-6">
      <div class="col-span-12 sm:col-span-4">
        <div class="flex flex-col gap-6">
          <BaseCard class="p-6">
            <BaseHeading
              as="h3"
              weight="medium"
              size="md"
              class="mb-4"
            >
              انتشار
            </BaseHeading>
            <ul class="space-y-4">
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.publication.new"
                  color="primary"
                  rounded="full"
                  label="به‌تازگی اضافه شده"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  24
                </BaseTag>
              </li>
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.publication.updated"
                  color="primary"
                  rounded="full"
                  label="به‌تازگی به‌روزرسانی شده"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  39
                </BaseTag>
              </li>
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.publication.upvoted"
                  color="primary"
                  rounded="full"
                  label="رأی مثبت"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  17
                </BaseTag>
              </li>
            </ul>
          </BaseCard>
          <BaseCard class="p-6">
            <BaseHeading
              as="h3"
              weight="medium"
              size="md"
              class="mb-4"
            >
              موضوعات
            </BaseHeading>
            <ul class="space-y-4">
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.topics.engineering"
                  color="primary"
                  rounded="full"
                  label="مهندسی"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  62
                </BaseTag>
              </li>
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.topics.software"
                  color="primary"
                  rounded="full"
                  label="نرم‌افزار"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  148
                </BaseTag>
              </li>
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.topics.business"
                  color="primary"
                  rounded="full"
                  label="کسب‌وکار"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  23
                </BaseTag>
              </li>
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.topics.management"
                  color="primary"
                  rounded="full"
                  label="مدیریت"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  8
                </BaseTag>
              </li>
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.topics.hr"
                  color="primary"
                  rounded="full"
                  label="منابع انسانی"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  43
                </BaseTag>
              </li>
            </ul>
          </BaseCard>
          <BaseCard class="p-6">
            <BaseHeading
              as="h3"
              weight="medium"
              size="md"
              class="mb-4"
            >
              نوع نتیجه
            </BaseHeading>
            <ul class="space-y-4">
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.type.members"
                  color="primary"
                  rounded="full"
                  label="اعضا"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  12
                </BaseTag>
              </li>
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.type.projects"
                  color="primary"
                  rounded="full"
                  label="پروژه‌ها"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  54
                </BaseTag>
              </li>
              <li class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="filters.type.files"
                  color="primary"
                  rounded="full"
                  label="فایل‌ها"
                  :classes="{
                    label: 'text-xs',
                  }"
                />
                <BaseTag rounded="full" size="sm">
                  31
                </BaseTag>
              </li>
            </ul>
          </BaseCard>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-8">
        <div
          class="border-muted-200 dark:border-muted-800 flex items-center gap-4 border-b font-sans"
        >
          <button
            type="button"
            class="border-b-2 px-3 py-4 text-sm"
            :class="
              activeFilter === 'all'
                ? 'text-muted-700 dark:text-muted-100 border-primary-500'
                : 'border-transparent text-muted-400'
            "
            @click="activeFilter = 'all'"
          >
            همه
          </button>
          <button
            type="button"
            class="border-b-2 px-3 py-4 text-sm"
            :class="
              activeFilter === 'people'
                ? 'text-muted-700 dark:text-muted-100 border-primary-500'
                : 'border-transparent text-muted-400'
            "
            @click="activeFilter = 'people'"
          >
            افراد
          </button>
          <button
            type="button"
            class="border-b-2 px-3 py-4 text-sm"
            :class="
              activeFilter === 'project'
                ? 'text-muted-700 dark:text-muted-100 border-primary-500'
                : 'border-transparent text-muted-400'
            "
            @click="activeFilter = 'project'"
          >
            پروژه‌ها
          </button>
          <button
            type="button"
            class="border-b-2 px-3 py-4 text-sm"
            :class="
              activeFilter === 'file'
                ? 'text-muted-700 dark:text-muted-100 border-primary-500'
                : 'border-transparent text-muted-400'
            "
            @click="activeFilter = 'file'"
          >
            فایل‌ها
          </button>
        </div>
        <div>
          <div v-if="results.length === 0" />
          <div v-else class="space-y-4 py-4">
            <BaseCard
              v-for="result in filteredResults"
              :key="result.name"
              class="p-5"
            >
              <div class="flex w-full items-center gap-4">
                <BaseAvatar v-if="result.type === 'people'" :src="result.src" />
                <img
                  v-else-if="result.type === 'project'"
                  class="size-10 shrink-0 rounded-full object-cover object-center"
                  :src="result.src"
                  :alt="result.name"
                >
                <img
                  v-else-if="result.type === 'file'"
                  class="size-10 shrink-0"
                  :src="result.src"
                  :alt="result.name"
                >
                <div>
                  <BaseHeading
                    as="h3"
                    weight="medium"
                    size="sm"
                  >
                    {{ result.name }}
                  </BaseHeading>
                  <BaseText size="xs" class="text-muted-400">
                    {{ result.subtext }}
                  </BaseText>
                </div>
                <div class="ms-auto">
                  <BaseButtonIcon
                    v-if="result.type === 'people'"
                    :to="result.url"
                    rounded="full"
                    size="sm"
                    data-nui-tooltip="مشاهده پروفایل"
                  >
                    <Icon name="lucide:arrow-right" class="rtl:rotate-180" />
                  </BaseButtonIcon>
                  <BaseButtonIcon
                    v-else-if="result.type === 'project'"
                    :to="result.url"
                    rounded="full"
                    size="sm"
                    data-nui-tooltip="مشاهده پروژه"
                  >
                    <Icon name="lucide:arrow-right" class="rtl:rotate-180" />
                  </BaseButtonIcon>
                  <BaseButtonIcon
                    v-else-if="result.type === 'file'"
                    :to="result.url"
                    rounded="full"
                    size="sm"
                    data-nui-tooltip="دانلود فایل"
                  >
                    <Icon name="lucide:arrow-down" />
                  </BaseButtonIcon>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
