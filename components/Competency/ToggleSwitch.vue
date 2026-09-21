<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

defineProps<{
  activeText: string
  inactiveText: string
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-gray-500">{{ model ? activeText : inactiveText }}</span>
    <button
      @click="model = !model"
      class="w-11 h-6 rounded-full transition-colors relative"
      :class="model ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
    >
      <span
        class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform"
        :class="model ? 'translate-x-0' : '-translate-x-5'"
      />
    </button>
  </div>
</template>
