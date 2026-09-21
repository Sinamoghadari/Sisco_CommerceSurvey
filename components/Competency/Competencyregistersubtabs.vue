<script setup lang="ts">
const activeSubTab = defineModel<'tasks' | 'competencies' | 'courses' | 'disciplinary'>({ required: true })
</script>

<template>
  <div class="flex bg-gray-50 dark:bg-gray-800 border-x border-b px-4 py-2 gap-2 flex-wrap">
    <button
      @click="activeSubTab = 'tasks'"
      class="py-2 px-4 rounded text-xs font-semibold transition-all"
      :class="activeSubTab === 'tasks' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
    >تعریف وظایف</button>

    <button
      @click="activeSubTab = 'competencies'"
      class="py-2 px-4 rounded text-xs font-semibold transition-all"
      :class="activeSubTab === 'competencies' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
    >تعریف شایستگی</button>

    <button
      @click="activeSubTab = 'courses'"
      class="py-2 px-4 rounded text-xs font-semibold transition-all"
      :class="activeSubTab === 'courses' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
    >دوره ها</button>

    <button
      @click="activeSubTab = 'disciplinary'"
      class="py-2 px-4 rounded text-xs font-semibold transition-all"
      :class="activeSubTab === 'disciplinary' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
    >موارد انضباطی-تشویقی</button>
  </div>
</template>