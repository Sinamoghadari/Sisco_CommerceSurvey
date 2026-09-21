<script setup lang="ts">
const activeMainTab = defineModel<'register' | 'organization'>({ required: true })
</script>

<template>
  <div class="flex border-b border-gray-200 dark:border-gray-700">
    <button
      @click="activeMainTab = 'register'"
      class="py-3 px-6 font-medium text-sm transition-all border-b-2"
      :class="[
        activeMainTab === 'register'
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
      ]"
    >
      ثبت اطلاعات
    </button>
    <button
      @click="activeMainTab = 'organization'"
      class="py-3 px-6 font-medium text-sm transition-all border-b-2"
      :class="[
        activeMainTab === 'organization'
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
      ]"
    >
      ساختار سازمانی
    </button>
  </div>
</template>
