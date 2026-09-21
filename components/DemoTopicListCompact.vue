<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  }>(),
  {
    rounded: 'sm',
  },
)

const topics = [
  {
    id: 0,
    title: 'اکولوژی',
    icon: 'ph:leaf-duotone',
    content:
      'لورم ایپسوم متن ساختگی است. اما برای شما به شکل دیگری مناسب است. این دو چیز یک چیز را تشکیل می‌دهند.',
  },
  {
    id: 1,
    title: 'لجستیک',
    icon: 'ph:boat-duotone',
    content:
      'لورم ایپسوم متن ساختگی است. اما برای شما به شکل دیگری مناسب است.',
  },
  {
    id: 2,
    title: 'کسب‌وکار',
    icon: 'ph:suitcase-duotone',
    content:
      'لورم ایپسوم متن ساختگی است. اما برای شما به شکل دیگری مناسب است. این دو چیز یک چیز را تشکیل می‌دهند.',
  },
  {
    id: 3,
    title: 'فیلم‌ها',
    icon: 'ph:popcorn-duotone',
    content:
      'لورم ایپسوم متن ساختگی است. اما برای شما به شکل دیگری مناسب است. این دو چیز یک چیز را تشکیل می‌دهند.',
  },
]
</script>

<template>
  <div class="mb-2 space-y-5">
    <div
      v-for="topic in topics"
      :key="topic.id"
      class="flex gap-3"
    >
      <BaseIconBox
        :rounded="props.rounded"
        size="sm"
        color="none"
        :class="getRandomColor()"
      >
        <Icon :name="topic.icon" class="size-5" />
      </BaseIconBox>
      <div>
        <BaseHeading
          as="h4"
          size="sm"
          weight="light"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>
            {{ topic.title }}
          </span>
        </BaseHeading>
        <BaseParagraph size="xs">
          <span class="text-muted-400">
            {{ topic.content }}
          </span>
        </BaseParagraph>
      </div>
    </div>
  </div>
</template>
