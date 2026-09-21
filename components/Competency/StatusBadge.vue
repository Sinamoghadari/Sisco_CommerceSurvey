<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <span
    class="px-2.5 py-1 text-xs font-semibold rounded-full"
    :class="
      active
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    "
  >
    {{ active ? 'فعال' : 'غیر فعال' }}
  </span>
</template>
