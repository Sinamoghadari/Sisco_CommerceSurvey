<script setup lang="ts">
import { Calendar } from 'v-calendars'

import 'v-calendars/dist/style.css'
import '~/assets/css/vcalendar.css'

definePageMeta({
  title: 'منابع انسانی',
  preview: {
    title: 'داشبورد منابع انسانی',
    description: 'برای مدیریت منابع انسانی',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-human-resources.png',
    srcDark: '/img/screens/dashboards-human-resources-dark.png',
    order: 12,
  },
})

const activeSetting = ref('candidates')

const items = [
  {
    title: 'پیام‌ها',
    subtitle: 'صندوق پیام‌های دریافتی',
    icon: 'ph:envelope-duotone',
    count: 5,
    status: 'جدید',
  },
  {
    title: 'وظایف',
    subtitle: 'وظایف منتظر',
    icon: 'ph:check-circle-duotone',
    count: 2,
    status: 'در انتظار',
  },
]
</script>

<template>
  <div>
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Column -->
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <!-- Column -->
        <div class="flex flex-col gap-6">
          <!-- Header -->
          <div class="bg-primary-700 rounded-xl px-6 py-12">
            <div class="flex w-full flex-col items-center gap-y-4 sm:flex-row">
              <div class="flex flex-1 flex-col px-4">
                <BaseAvatar
                  src="/img/avatars/2.svg"
                  size="lg"
                  class="border-primary-200/50 ring-primary-200/50 ring-offset-primary-600 mb-3 border ring-2 ring-offset-4"
                />
                <BaseHeading
                  as="h2"
                  size="3xl"
                  weight="bold"
                  lead="none"
                  class="ltablet:!text-2xl text-white"
                >
                  <span>خوش برگشتی، مایا.</span>
                </BaseHeading>
              </div>
              <div class="flex h-full flex-1 flex-col px-4 sm:px-6">
                <BaseHeading
                  as="h2"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="mb-1 text-white"
                >
                  <span>مبتدیان جدید</span>
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  lead="tight"
                  class="mb-3"
                >
                  <span class="text-white">
                    لورم ایپسوم دلور سیت آمیت، کانسکتتور آدیپیسینگ الیت. مرگ‌های باشکوه.
                  </span>
                </BaseParagraph>
                <div class="mt-auto flex gap-2">
                  <BaseAvatar
                    size="sm"
                    rounded="none"
                    src="/img/avatars/3.svg"
                    class="nui-mask nui-mask-blob"
                  />
                  <BaseAvatar
                    size="sm"
                    rounded="none"
                    src="/img/avatars/9.svg"
                    class="nui-mask nui-mask-blob"
                  />
                  <BaseAvatar
                    size="sm"
                    rounded="none"
                    src="/img/avatars/5.svg"
                    class="nui-mask nui-mask-blob"
                  />
                  <BaseButtonIcon>
                    <Icon name="lucide:plus" class="size-4" />
                  </BaseButtonIcon>
                </div>
              </div>
              <div
                class="border-primary-300/60 flex h-full flex-1 flex-col px-4 sm:border-s sm:px-6"
              >
                <BaseHeading
                  as="h2"
                  size="md"
                  weight="semibold"
                  lead="tight"
                  class="mb-1 text-white"
                >
                  <span>فید شغلی</span>
                </BaseHeading>
                <BaseParagraph
                  size="xs"
                  lead="tight"
                  class="mb-3"
                >
                  <span class="text-white">
                    لورم ایپسوم دلور سیت آمیت، کانسکتتور آدیپیسینگ الیت. مرگ‌های باشکوه.
                  </span>
                </BaseParagraph>
                <div class="mt-auto">
                  <BaseButton class="w-full">
                    <span>مدیریت مشاغل</span>
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
          <!-- Feed settings -->
          <div
            class="flex flex-col items-center justify-between gap-6 sm:flex-row"
          >
            <div>
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-muted-100 mb-1"
              >
                <span>تنظیمات فید</span>
              </BaseHeading>
            </div>
            <div class="flex gap-2 sm:justify-end">
              <BaseButtonAction
                rounded="lg"
                :color="activeSetting === 'all' ? 'primary' : 'default'"
                @click="activeSetting = 'all'"
              >
                همه
              </BaseButtonAction>
              <BaseButtonAction
                rounded="lg"
                :color="activeSetting === 'candidates' ? 'primary' : 'default'"
                @click="activeSetting = 'candidates'"
              >
                نامزدها
              </BaseButtonAction>
              <BaseButtonAction
                rounded="lg"
                :color="activeSetting === 'companies' ? 'primary' : 'default'"
                @click="activeSetting = 'companies'"
              >
                شرکت‌ها
              </BaseButtonAction>
            </div>
          </div>
          <!-- Details -->
          <div class="mt-6 grid grid-cols-12 gap-x-6 gap-y-12">
            <!-- Text -->
            <div class="col-span-12 sm:col-span-5">
              <div
                class="flex h-full max-w-[240px] flex-col justify-center gap-2"
              >
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="medium"
                  lead="tight"
                  class="text-muted-800 dark:text-muted-100 mb-1"
                >
                  <span>اطلاعیه‌ها</span>
                </BaseHeading>
                <BaseParagraph size="xs" lead="tight">
                  <span class="text-muted-500 dark:text-muted-400">
                    لورم ایپسوم دلور سیت آمیت، کانسکتتور آدیپیسینگ الیت. ادامه بده؛ گفتار این فیلسوف مرا نمی‌رنجاند؛ دو پادشاه: ساخت اینترنت.
                  </span>
                </BaseParagraph>
                <NuxtLink
                  to="#"
                  class="text-primary-500 font-sans text-xs underline underline-offset-4"
                >
                  <span>بیشتر بیاموزید</span>
                </NuxtLink>
              </div>
            </div>
            <!-- Text -->
            <div class="col-span-12 sm:col-span-7">
              <div class="space-y-2">
                <DemoFlexTableRow
                  v-for="(item, index) in items"
                  :key="index"
                  rounded="sm"
                >
                  <template #start>
                    <DemoFlexTableStart
                      label="نوع"
                      :hide-label="index > 0"
                      :title="item.title"
                      :subtitle="item.subtitle"
                      :icon="item.icon"
                    />
                  </template>
                  <template #end>
                    <DemoFlexTableCell
                      label="تعداد"
                      :hide-label="index > 0"
                      class="w-full sm:w-10"
                    >
                      <span
                        class="text-muted-500 dark:text-muted-400 font-sans text-sm"
                      >
                        {{ item.count }}
                      </span>
                    </DemoFlexTableCell>
                    <DemoFlexTableCell
                      label="وضعیت"
                      :hide-label="index > 0"
                      class="w-full sm:w-16"
                    >
                      <BaseTag
                        :color="item.status === 'جدید' ? 'success' : 'muted'"
                        rounded="full"
                        variant="pastel"
                        size="sm"
                      >
                        {{ item.status }}
                      </BaseTag>
                    </DemoFlexTableCell>
                    <DemoFlexTableCell label="اقدام" :hide-label="index > 0">
                      <span class="text-primary-500 font-sans text-xs sm:pe-2">
                        اقدام
                      </span>
                    </DemoFlexTableCell>
                  </template>
                </DemoFlexTableRow>
              </div>
            </div>
          </div>
          <!-- Rookies -->
          <div class="mt-6 flex items-center justify-between gap-6 sm:mt-0">
            <div>
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-muted-100 mb-1"
              >
                <span>تازه‌کارهای جدید</span>
              </BaseHeading>
            </div>
            <div class="flex gap-2 sm:justify-end">
              <NuxtLink
                to="#"
                class="hover:bg-muted-200 dark:bg-muted-700 dark:hover:bg-muted-900 text-primary-500 rounded-lg bg-white px-4 py-2 font-sans text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline"
              >
                مشاهده همه
              </NuxtLink>
            </div>
          </div>
          <!-- Grid -->
          <div class="grid gap-6 sm:grid-cols-3">
            <!-- Item -->
            <div class="relative">
              <BaseCard class="p-6" rounded="lg">
                <div class="flex flex-col">
                  <BaseAvatar
                    size="xl"
                    src="/img/avatars/5.svg"
                    badge-src="/img/stacks/js.svg"
                    alt="Avatar"
                    class="mx-auto mb-4"
                  />
                  <div class="text-center">
                    <BaseHeading
                      as="h4"
                      size="md"
                      weight="medium"
                      lead="tight"
                      class="text-muted-800 dark:text-muted-100"
                    >
                      <span>کلاریسا میلر</span>
                    </BaseHeading>
                    <BaseParagraph size="xs">
                      <span class="text-muted-400">طراح رابط کاربری / تجربه کاربری</span>
                    </BaseParagraph>
                    <div class="mt-3">
                      <BaseButton
                        href="/"
                        rounded="lg"
                        color="default"
                        class="w-full"
                      >
                        <span>مشاهده پروفایل</span>
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </BaseCard>
            </div>
            <!-- Item -->
            <div class="relative">
              <BaseCard class="p-6" rounded="lg">
                <div class="flex flex-col">
                  <BaseAvatar
                    size="xl"
                    src="/img/avatars/16.svg"
                    badge-src="/img/stacks/vuejs.svg"
                    alt="Avatar"
                    class="mx-auto mb-4"
                  />
                  <div class="text-center">
                    <BaseHeading
                      as="h4"
                      size="md"
                      weight="medium"
                      lead="tight"
                      class="text-muted-800 dark:text-muted-100"
                    >
                      <span>جاشوا استیونس</span>
                    </BaseHeading>
                    <BaseParagraph size="xs">
                      <span class="text-muted-400">توسعه‌دهنده فول‌استک</span>
                    </BaseParagraph>
                    <div class="mt-3">
                      <BaseButton
                        href="/"
                        rounded="lg"
                        color="default"
                        class="w-full"
                      >
                        <span>مشاهده پروفایل</span>
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </BaseCard>
            </div>
            <!-- Item -->
            <div class="relative">
              <BaseCard class="p-6" rounded="lg">
                <div class="flex flex-col">
                  <BaseAvatar
                    size="xl"
                    src="/img/avatars/12.svg"
                    badge-src="/img/stacks/reactjs.svg"
                    alt="Avatar"
                    class="mx-auto mb-4"
                  />
                  <div class="text-center">
                    <BaseHeading
                      as="h4"
                      size="md"
                      weight="medium"
                      lead="tight"
                      class="text-muted-800 dark:text-muted-100"
                    >
                      <span>مارگو رینیه</span>
                    </BaseHeading>
                    <BaseParagraph size="xs">
                      <span class="text-muted-400">توسعه‌دهنده وب</span>
                    </BaseParagraph>
                    <div class="mt-3">
                      <BaseButton
                        href="/"
                        rounded="lg"
                        color="default"
                        class="w-full"
                      >
                        <span>مشاهده پروفایل</span>
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
      </div>
      <!-- Column -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="flex flex-col gap-6">
          <!-- Widget -->
          <BaseCard rounded="lg" class="p-6">
            <div class="flex w-full items-center justify-between">
              <DemoSearchCompact rounded="lg" />
            </div>
          </BaseCard>
          <!-- Widget -->
          <BaseCard rounded="lg" class="p-6">
            <BaseTabSlider
              v-slot="{ activeValue }"
              size="sm"
              model-value="team"
              :tabs="[
                { label: 'تیم', value: 'team' },
                { label: 'وظایف', value: 'tasks' },
              ]"
            >
              <div v-if="activeValue === 'team'">
                <DemoTeamListCompact actions />
              </div>
              <div v-else-if="activeValue === 'tasks'">
                <DemoTodoListCompact />
              </div>
            </BaseTabSlider>
          </BaseCard>
          <!-- Widget -->
          <BaseCard rounded="lg" class="p-4">
            <Calendar
              :attributes="[
                {
                  key: 'today',
                  highlight: true,
                  order: 0,
                  dates: [new Date()],
                },
              ]"
              locale="fa"
              title-position="right"
              expanded
              borderless
              transparent
              trim-weeks
              class="max-w-full rounded-xl"
            />
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
