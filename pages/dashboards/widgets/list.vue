<script setup lang="ts">
definePageMeta({
  title: 'لیست ویجت‌ها',
  preview: {
    title: 'لیست ویجت‌ها',
    description: 'برای ترکیب صفحات',
    categories: ['داشبوردها', 'ویجت‌ها'],
    src: '/img/screens/dashboards-widgets-lists.png',
    srcDark: '/img/screens/dashboards-widgets-lists-dark.png',
    order: 29,
  },
})
</script>

<template>
  <div class="ptablet:grid-cols-2 grid gap-6 sm:grid-cols-3">
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>اعضا</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoUserList />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>اعضا</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoUserList rounded="full" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoFileListTabbed rounded="full" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>وظایف من</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTodoListCompact color="lime" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>وظایف من</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTodoListCompact color="sky" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoTodoListTabbed rounded="sm" color="primary" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard class="p-6" rounded="lg">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>آخرین نظرات</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoCommentListCompact />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard class="p-6" rounded="lg">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>موضوعات</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTopicListCompact />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard class="p-6" rounded="lg">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>موضوعات</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTopicListCompact rounded="full" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard class="p-6" rounded="lg">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>جدول زمانی</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTimelineCompact rounded="sm" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard class="p-6" rounded="lg">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>جدول زمانی</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTimelineCompact rounded="lg" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative">
      <!-- Widget -->
      <BaseCard class="p-6" rounded="lg">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>جدول زمانی</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTimelineCompact rounded="full" />
      </BaseCard>
    </div>
  </div>
</template>
