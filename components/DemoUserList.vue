<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  }>(),
  {
    rounded: 'sm',
  },
)

const users = [
  {
    id: 0,
    picture: '/img/avatars/16.svg',
    name: 'هرمان مایر',
    position: 'تحلیل‌گر کسب‌وکار',
    progress: 18,
  },
  {
    id: 1,
    picture: '/img/avatars/10.svg',
    name: 'کندرا ویلسون',
    position: 'مدیر پروژه',
    progress: 22,
  },
  {
    id: 2,
    picture: '/img/avatars/6.svg',
    name: 'جان باکستر',
    position: 'مدیر محصول',
    progress: -12,
  },
  {
    id: 3,
    picture: '/img/avatars/12.svg',
    name: 'آملیا شفرد',
    position: 'مدیر محصول',
    progress: 32,
  },
  {
    id: 4,
    picture: '/img/avatars/11.svg',
    name: 'داریل زانوک',
    position: 'توسعه‌دهنده موبایل',
    progress: -4,
  },
  {
    id: 5,
    picture: '/img/avatars/5.svg',
    name: 'کلاریسا میلر',
    position: 'طراح UI/UX',
    progress: 32,
  },
]
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="user in users"
      :key="user.id"
      class="flex items-center gap-2"
    >
      <BaseAvatar
        :src="user.picture"
        size="sm"
        :rounded="props.rounded"
      />
      <div>
        <BaseHeading
          as="h3"
          size="sm"
          weight="medium"
          lead="tight"
          class="text-muted-800 dark:text-muted-100"
        >
          <span>{{ user.name }}</span>
        </BaseHeading>
        <BaseText size="xs" class="text-muted-400">
          <span>{{ user.position }}</span>
        </BaseText>
      </div>
      <div class="ms-auto flex items-center justify-end gap-4">
        <BaseParagraph
          size="sm"
          weight="semibold"
          :class="user.progress > 0 ? 'text-success-500' : 'text-danger-500'"
        >
          <span>{{ user.progress }}%</span>
        </BaseParagraph>
        <BaseButtonIcon
          to="#"
          muted
          small
          :rounded="props.rounded"
        >
          <Icon name="lucide:chevron-right" class="rtl:rotate-180 size-4" />
        </BaseButtonIcon>
      </div>
    </div>
  </div>
</template>
