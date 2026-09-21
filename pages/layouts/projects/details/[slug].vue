<script setup lang="ts">
definePageMeta({
  title: 'جزئیات پروژه',
  preview: [
    {
      title: 'جزئیات پروژه',
      description: 'برای نمایش جزئیات پروژه فیتنس',
      categories: ['چیدمان‌ها', 'پروژه‌ها'],
      src: '/img/screens/layouts-projects-details.png',
      srcDark: '/img/screens/layouts-projects-details-dark.png',
      order: 72,
      params: {
        slug: 'health-and-fitness-dashboard',
      },
    },
    {
      title: 'جزئیات پروژه',
      description: 'برای نمایش جزئیات پروژه بانکی',
      categories: ['چیدمان‌ها', 'پروژه‌ها'],
      src: '/img/screens/layouts-projects-details.png',
      srcDark: '/img/screens/layouts-projects-details-dark.png',
      order: 72,
      params: {
        slug: 'banking-and-finance-dashboard',
      },
    },
  ],
})

const { open } = usePanels()

const route = useRoute()
const slug = computed(() => route.params.slug)

const query = computed(() => {
  return {
    slug: slug.value,
  }
})

const { data, pending, error, refresh } = await useFetch(
  '/api/company/projects',
  {
    query,
  },
)

if (!data.value?.project) {
  await navigateTo('/layouts/projects')
}

const currentTask = ref()

function openTaskPanel(id: number, tasks: any) {
  currentTask.value = tasks.find((task: any) => task.id === id)
  open('task', { task: currentTask })
}
</script>

<template>
  <div class="relative">
    <div class="absolute end-12 top-2.5 z-20 hidden sm:block">
      <BaseButton
        size="sm"
        rounded="lg"
        :to="`/layouts/projects/board/${slug}`"
      >
        <Icon name="ph:kanban-duotone" class="me-2 size-4" />
        <span>برد باز</span>
      </BaseButton>
    </div>
    <div class="absolute end-0 top-2 z-20">
      <BaseDropdown
        variant="context"
        label="منوی کشویی"
        placement="bottom-end"
        size="md"
        class="z-20"
        rounded="lg"
      >
        <BaseDropdownItem
          :to="`/layouts/projects/board/${slug}`"
          title="نمای تخته"
          text="تغییر به نمای برد"
          class="sm:hidden"
        >
          <template #start>
            <Icon name="ph:kanban-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
        <BaseDropdownItem
          to="#"
          title="ویرایش"
          text="این پروژه را ویرایش کنید"
        >
          <template #start>
            <Icon name="ph:pencil-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
        <BaseDropdownDivider />
        <BaseDropdownItem
          to="#"
          title="مجوزها"
          text="مدیریت مجوزها"
        >
          <template #start>
            <Icon name="ph:lock-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
        <BaseDropdownDivider />
        <BaseDropdownItem
          to="#"
          title="فایل‌ها"
          text="مدیریت فایل‌ها"
        >
          <template #start>
            <Icon name="ph:file-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
        <BaseDropdownDivider />
        <BaseDropdownItem
          to="#"
          title="حذف"
          text="حذف این پروژه"
        >
          <template #start>
            <Icon name="ph:trash-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
      </BaseDropdown>
    </div>
    <div v-if="data?.project === undefined">
      <BasePlaceholderPage
        title="پروژه‌ای پیدا نشد"
        subtitle="We couldn't find a project matching this namespace."
      >
        <template #image>
          <img
            class="block dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-projects.svg"
            alt="تصویر مکان نگهدار"
          >
          <img
            class="hidden dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-projects-dark.svg"
            alt="تصویر مکان نگهدار"
          >
        </template>
      </BasePlaceholderPage>
    </div>
    <div v-else class="h-full">
      <BaseTabs
        model-value="overview"
        :tabs="[
          {
            label: 'مرور کلی',
            value: 'overview',
          },
          {
            label: 'تیم',
            value: 'team',
          },
          {
            label: 'وظایف',
            value: 'tasks',
          },
        ]"
      >
        <template #tab="{ activeValue }">
          <!-- Overview -->
          <div v-if="activeValue === 'overview'">
            <div class="grid grid-cols-12 gap-6">
              <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
                <BaseCard class="space-y-12 p-10">
                  <div
                    class="border-muted-200 dark:border-muted-700 flex flex-col items-center justify-between gap-8 border-b pb-12 sm:flex-row"
                  >
                    <div>
                      <BaseHeading
                        tag="h2"
                        size="2xl"
                        weight="medium"
                      >
                        {{ data?.project.name }}
                      </BaseHeading>
                      <BaseParagraph
                        size="lg"
                        class="text-muted-600 dark:text-muted-400"
                      >
                        {{ data?.project.category }}
                      </BaseParagraph>
                      <BaseParagraph size="sm" class="text-muted-400 py-4">
                        {{ data?.project.description }}
                      </BaseParagraph>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <BaseAvatar
                            :src="data?.project.owner.avatar"
                            :data-nui-tooltip="`${data?.project.owner.name} owns this project`"
                          />
                          <div>
                            <BaseHeading
                              tag="h3"
                              size="sm"
                              weight="medium"
                            >
                              {{ data?.project.owner.name }}
                            </BaseHeading>
                            <BaseParagraph size="xs" class="text-muted-400">
                              مالک پروژه
                            </BaseParagraph>
                          </div>
                        </div>
                        <BaseAvatarGroup
                          :avatars="data?.project.team"
                          :limit="3"
                        />
                      </div>
                    </div>
                    <div class="w-full shrink-0 sm:w-72">
                      <img
                        :src="data?.project.image"
                        :alt="data?.project.name"
                        class="rounded-lg"
                      >
                    </div>
                  </div>
                  <div
                    class="border-muted-200 dark:border-muted-700 grid gap-4 border-b pb-12 sm:grid-cols-4"
                  >
                    <div>
                      <Icon
                        name="ph:pen-nib-duotone"
                        class="text-primary-500 mb-2 size-6"
                      />
                      <div>
                        <BaseHeading
                          tag="h3"
                          size="sm"
                          weight="medium"
                        >
                          طراحی UI/UX
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="tight"
                          class="text-muted-400"
                        >
                          طراحی یک تجربه کاربری بی‌نقص در محدوده این پروژه است.
                        </BaseParagraph>
                      </div>
                    </div>
                    <div>
                      <Icon
                        name="ph:timer-duotone"
                        class="text-primary-500 mb-2 size-6"
                      />
                      <div>
                        <BaseHeading
                          tag="h3"
                          size="sm"
                          weight="medium"
                        >
                          اسپرینت‌های ۱ هفته‌ای
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="tight"
                          class="text-muted-400"
                        >
                          تکرارهای توسعه این پروژه از یک الگوی اسپرینت ۱ هفته‌ای پیروی می‌کند.
                        </BaseParagraph>
                      </div>
                    </div>
                    <div>
                      <Icon
                        name="ph:calendar-blank-duotone"
                        class="text-primary-500 mb-2 size-6"
                      />
                      <div>
                        <BaseHeading
                          tag="h3"
                          size="sm"
                          weight="medium"
                        >
                          3 ماه
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="tight"
                          class="text-muted-400"
                        >
                          این پروژه و تمام وظایف مرتبط باید طی ۳ ماه تکمیل شود.
                        </BaseParagraph>
                      </div>
                    </div>
                    <div>
                      <Icon
                        name="ph:sketch-logo-duotone"
                        class="text-primary-500 mb-2 size-6"
                      />
                      <div>
                        <BaseHeading
                          tag="h3"
                          size="sm"
                          weight="medium"
                        >
                          ثابت
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="tight"
                          class="text-muted-400"
                        >
                          برنامه‌ریزی بودجه این پروژه بر اساس یک پیشنهاد ثابت و تغییرناپذیر است.
                        </BaseParagraph>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4
                      class="text-muted-400 mb-6 font-sans text-xs font-semibold uppercase"
                    >
                      فایل‌های اخیر
                    </h4>
                    <div class="grid gap-8 pb-6 sm:grid-cols-2">
                      <div
                        v-for="(file, index) in data?.project.files"
                        :key="index"
                        rounded="lg"
                      >
                        <div class="flex w-full items-center gap-2">
                          <img
                            :src="file.icon"
                            :alt="file.name"
                            class="max-w-[46px]"
                          >
                          <div>
                            <BaseHeading
                              tag="h3"
                              size="sm"
                              weight="medium"
                            >
                              {{ file.name }}
                            </BaseHeading>
                            <BaseParagraph size="xs" class="text-muted-400">
                              <span>{{ file.size }}</span>
                              <span class="px-1 text-base leading-tight">
                                &middot;
                              </span>
                              <span>v{{ file.version }}</span>
                            </BaseParagraph>
                          </div>
                          <div class="ms-auto">
                            <BaseButtonIcon
                              rounded="full"
                              data-nui-tooltip="دانلود فایل"
                              size="sm"
                            >
                              <Icon name="lucide:arrow-down" />
                            </BaseButtonIcon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </BaseCard>
              </div>
              <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
                <div class="space-y-6">
                  <!-- Customer -->
                  <BaseCard class="p-8">
                    <h4
                      class="text-muted-400 mb-6 font-sans text-xs font-semibold uppercase"
                    >
                      مشتری
                    </h4>

                    <div class="mb-4 flex items-center gap-2">
                      <BaseAvatar
                        :src="data?.project.customer.logo"
                        size="md"
                        :data-nui-tooltip="data?.project.customer.name"
                        class="bg-muted-100 dark:bg-muted-700"
                      />
                      <div>
                        <BaseHeading
                          tag="h5"
                          size="lg"
                          weight="medium"
                          lead="none"
                          class="line-clamp-1"
                        >
                          {{ data?.project.customer.name }}
                        </BaseHeading>
                        <BaseParagraph size="sm" class="text-muted-400">
                          {{ data?.project.customer.text }}
                        </BaseParagraph>
                      </div>
                    </div>
                    <div class="w-full space-y-1">
                      <div class="flex items-center justify-between">
                        <h4
                          class="text-muted-700 dark:text-muted-100 font-sans text-sm font-medium"
                        >
                          پیشرفت
                        </h4>
                        <div>
                          <span class="text-muted-400 font-sans text-sm">
                            {{ data?.project.completed }}%
                          </span>
                        </div>
                      </div>
                      <BaseProgress
                        size="xs"
                        color="primary"
                        :value="data?.project.completed"
                      />
                    </div>
                  </BaseCard>
                  <!-- Tools -->
                  <BaseCard class="p-8">
                    <h4
                      class="text-muted-400 mb-6 font-sans text-xs font-semibold uppercase"
                    >
                      ابزارهای پروژه
                    </h4>
                    <div class="space-y-8">
                      <div
                        v-for="tool in data?.project.tools"
                        :key="tool.name"
                        class="flex items-center gap-2"
                      >
                        <BaseAvatar
                          :src="tool.icon"
                          size="xs"
                          :data-nui-tooltip="tool.name"
                          class="bg-muted-100 dark:bg-muted-700"
                        />
                        <div>
                          <BaseHeading
                            tag="h5"
                            size="sm"
                            weight="medium"
                            lead="none"
                            class="line-clamp-1"
                          >
                            {{ tool.name }}
                          </BaseHeading>
                          <BaseParagraph size="xs" class="text-muted-400">
                            {{ tool.description }}
                          </BaseParagraph>
                        </div>
                      </div>
                    </div>
                  </BaseCard>
                  <!-- Stacks -->
                  <BaseCard class="p-8">
                    <h4
                      class="text-muted-400 mb-6 font-sans text-xs font-semibold uppercase"
                    >
                      استک‌های پروژه
                    </h4>
                    <div class="space-y-8">
                      <div
                        v-for="stack in data?.project.stacks"
                        :key="stack.name"
                        class="flex items-center gap-2"
                      >
                        <BaseAvatar
                          :src="stack.icon"
                          size="xs"
                          :data-nui-tooltip="stack.name"
                          class="bg-muted-100 dark:bg-muted-700"
                        />
                        <div>
                          <BaseHeading
                            tag="h5"
                            size="sm"
                            weight="medium"
                            lead="none"
                            class="line-clamp-1"
                          >
                            {{ stack.name }}
                          </BaseHeading>
                          <BaseParagraph size="xs" class="text-muted-400">
                            {{ stack.description }}
                          </BaseParagraph>
                        </div>
                      </div>
                    </div>
                  </BaseCard>
                </div>
              </div>
            </div>
          </div>
          <!-- Team -->
          <div v-else-if="activeValue === 'team'">
            <div class="grid gap-6 sm:grid-cols-3">
              <BaseCard
                elevated-hover
                class="hover:!border-primary-500 relative"
              >
                <NuxtLink to="#">
                  <Icon
                    name="uiw:star-on"
                    class="text-primary-500 absolute end-6 top-6"
                  />
                  <div class="flex flex-col items-center p-5 sm:flex-row">
                    <div class="flex flex-col gap-3 sm:flex-row">
                      <BaseAvatar
                        :src="data?.project.owner.avatar"
                        :badge-src="data?.project.owner.badge"
                        :text="data?.project.owner.name"
                        size="lg"
                        class="bg-muted-500/20 text-muted-500"
                      />
                      <div class="text-center leading-none sm:text-start">
                        <h4
                          class="text-muted-800 dark:text-muted-100 font-sans text-base font-medium"
                        >
                          {{ data?.project.owner.name }}
                        </h4>
                        <p class="text-muted-400 mb-2 font-sans text-xs">
                          مالک پروژه
                        </p>
                        <p
                          class="text-muted-500 dark:text-muted-400 font-sans text-xs"
                        >
                          {{ data?.project.owner.bio }}
                        </p>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </BaseCard>
              <BaseCard
                v-for="item in data?.project.team"
                :key="item.id"
                elevated-hover
                class="hover:!border-primary-500"
              >
                <NuxtLink to="#">
                  <div class="flex flex-col items-center p-5 sm:flex-row">
                    <div class="flex flex-col gap-3 sm:flex-row">
                      <BaseAvatar
                        :src="item.src"
                        :badge-src="item.badge"
                        :text="item.text"
                        size="lg"
                        class="bg-muted-500/20 text-muted-500"
                      />
                      <div class="text-center leading-none sm:text-start">
                        <h4
                          class="text-muted-800 dark:text-muted-100 font-sans text-base font-medium"
                        >
                          {{ item.tooltip }}
                        </h4>
                        <p class="text-muted-400 mb-2 font-sans text-xs">
                          {{ item.role }}
                        </p>
                        <p
                          class="text-muted-500 dark:text-muted-400 font-sans text-xs"
                        >
                          {{ item.bio }}
                        </p>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </BaseCard>
              <!-- Invite -->
              <div>
                <button
                  type="button"
                  class="border-muted-300 dark:border-muted-800 hover:border-primary-500 dark:hover:border-primary-500 group flex size-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors duration-300"
                >
                  <span class="block text-center font-sans">
                    <span
                      class="text-muted-800 dark:text-muted-100 group-hover:text-primary-500 dark:group-hover:text-primary-500 block transition-colors duration-300"
                    >
                      دعوت از یک عضو جدید
                    </span>
                    <span class="text-muted-400 block text-sm">
                      دعوت‌نامه برای پیوستن به تیم پروژه خود ارسال کنید
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <!-- Tasks -->
          <div v-else-if="activeValue === 'tasks'">
            <div class="grid gap-6 sm:grid-cols-3">
              <BaseCard
                v-for="item in data?.project.tasks"
                :key="item.id"
                elevated-hover
                class="hover:!border-primary-500 flex cursor-pointer flex-col"
                @click="openTaskPanel(item.id, data?.project?.tasks)"
              >
                <div class="flex flex-col items-center p-5 sm:flex-row">
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <Icon
                      v-if="item.status === 0"
                      name="ph:plus-circle-duotone"
                      class="text-muted-400 size-6 shrink-0"
                    />
                    <Icon
                      v-else-if="item.status === 5"
                      name="ph:check-circle-duotone"
                      class="text-success-500 size-6 shrink-0"
                    />
                    <Icon
                      v-else-if="item.status === 1"
                      name="ph:timer-duotone"
                      class="text-muted-400 size-6 shrink-0"
                    />
                    <Icon
                      v-else-if="item.status === 2 || item.status === 3"
                      name="ph:warning-duotone"
                      class="text-warning-500 size-6 shrink-0"
                    />
                    <div class="text-center leading-none sm:text-start">
                      <h4
                        class="text-muted-800 dark:text-muted-100 mb-2 font-sans text-base font-medium leading-tight"
                      >
                        {{ item.name }}
                      </h4>
                      <p class="text-muted-400 line-clamp-2 font-sans text-xs">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-muted-50 dark:bg-muted-700/50 mt-auto flex items-center justify-between rounded-b-lg px-5 py-3"
                >
                  <div class="flex max-w-[180px] grow items-center gap-2">
                    <BaseAvatar
                      size="xxs"
                      :src="item.assignee.src"
                      :data-nui-tooltip="item.assignee.tooltip"
                    />
                    <BaseProgress
                      :value="item.completion"
                      size="xs"
                      :color="item.status === 5 ? 'success' : 'primary'"
                    />
                  </div>
                  <div class="text-muted-400 flex items-center gap-4">
                    <div class="flex items-center gap-1 text-sm">
                      <Icon name="ph:paperclip-duotone" class="size-4" />
                      <span class="font-sans">
                        {{ item.files.length }}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                      <Icon name="ph:chat-circle-duotone" class="size-4" />
                      <span class="font-sans">
                        {{ item.comments.length }}
                      </span>
                    </div>
                  </div>
                </div>
              </BaseCard>
              <!-- Invite -->
              <div>
                <button
                  type="button"
                  class="border-muted-300 dark:border-muted-800 hover:border-primary-500 dark:hover:border-primary-500 group flex size-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors duration-300"
                >
                  <span class="block text-center font-sans">
                    <span
                      class="text-muted-800 dark:text-muted-100 group-hover:text-primary-500 dark:group-hover:text-primary-500 block transition-colors duration-300"
                    >
                      ایجاد وظیفه جدید
                    </span>
                    <span class="text-muted-400 block text-sm">
                      افزودن وظیفه جدید به پروژه شما
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </template>
      </BaseTabs>
    </div>
  </div>
</template>
