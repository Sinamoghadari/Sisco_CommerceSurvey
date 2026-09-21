<script setup lang="ts">
import { ref } from 'vue'

interface ReportItem {
  _id: string
  title: string
  value: string
}

const rows = ref<ReportItem[]>([
  { _id: 'r1', title: 'میانگین رضایت', value: '۸.۶/۱۰' },
  { _id: 'r2', title: 'میزان تکمیل برنامه', value: '۹۲٪' },
])
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">گزارش اثربخشی</h2>
        <p class="text-sm text-gray-500 mt-1">خلاصه نتایج دوره‌های برگزارشده</p>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">عنوان</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">مقدار</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rows" :key="item._id" class="border-t border-gray-200 dark:border-gray-800">
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.title }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
