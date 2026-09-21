<script setup lang="ts">
const authors = [
  {
    id: 0,
    firstName: 'هرمان',
    lastName: 'مایر',
    image: '/img/avatars/16.svg',
    text: 'HM',
    role: 'مدیر پروژه',
    articles: 39,
  },
  {
    id: 1,
    firstName: 'سارا',
    lastName: 'کونور',
    image: '/img/avatars/12.svg',
    text: 'SC',
    role: 'توسعه‌دهنده فرانت‌اند',
    articles: 24,
  },
  {
    id: 2,
    firstName: 'کندرا',
    lastName: 'ویلسون',
    image: '/img/avatars/10.svg',
    text: 'KW',
    role: 'مدیر نیروی انسانی',
    articles: 17,
  },
  {
    id: 3,
    firstName: 'جان',
    lastName: 'بکستر',
    image: '/img/avatars/13.svg',
    text: 'NL',
    role: 'تحلیلگر کسب و کار',
    articles: 11,
  },
]
</script>

<template>
  <div class="mb-2 space-y-5">
    <div
      v-for="author in authors"
      :key="author.id"
      class="flex items-center gap-3"
    >
      <BaseAvatar
        :src="author.image"
        :text="author.text"
        rounded="none"
        mask="blob"
        class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
      />
      <div>
        <BaseHeading
          as="h4"
          size="sm"
          weight="light"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>{{ author.firstName }} {{ author.lastName.slice(0, 1) }}.</span>
        </BaseHeading>
        <BaseParagraph size="xs">
          <span class="text-muted-400">
            {{ author.role }}
          </span>
        </BaseParagraph>
      </div>
      <div class="ms-auto flex items-center gap-1">
        <span class="text-muted-400 font-sans text-xs">
          {{ author.articles }} مقاله
        </span>
        <BaseButtonIcon
          rounded="lg"
          muted
          class="scale-75"
        >
          <Icon name="lucide:arrow-right" class="rtl:rotate-180 size-4" />
        </BaseButtonIcon>
      </div>
    </div>
  </div>
</template>
