<script setup lang="ts">
defineProps<{
  /** شناسه‌ی یکتای پیام خطا برای اتصال aria-describedby */
  errorId: string
  /** پیام خطا؛ در صورت خالی بودن چیزی نمایش داده نمی‌شود */
  message?: string
}>()
</script>

<template>
  <p
    v-if="message"
    :id="errorId"
    class="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-red-500 dark:text-red-400"
    role="alert"
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <span>{{ message }}</span>
  </p>
</template>
