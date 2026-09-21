<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rounded?: 'none' | 'sm' | 'md' | 'lg'
  }>(),
  {
    rounded: 'sm',
  },
)

const tags = [
  {
    id: 1,
    name: 'سیاست',
    highlight: false,
  },
  {
    id: 2,
    name: 'اقتصاد',
    highlight: true,
  },
  {
    id: 3,
    name: 'مالی',
    highlight: false,
  },
  {
    id: 4,
    name: 'محیط‌زیست',
    highlight: false,
  },
  {
    id: 5,
    name: 'غذا',
    highlight: false,
  },
  {
    id: 6,
    name: 'تکنولوژی',
    highlight: true,
  },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <BaseTag
      v-for="tag in tags"
      :key="tag.id"
      :rounded="props.rounded"
      :variant="tag.highlight ? 'solid' : 'outline'"
      color="primary"
      size="sm"
    >
      <span>{{ tag.name }}</span>
    </BaseTag>
  </div>
</template>
