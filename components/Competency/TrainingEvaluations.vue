<script setup lang="ts">
import { ref } from 'vue'

interface EvaluationItem {
  _id: string
  participant: string
  course: string
  score: string
  status: string
}

const rows = ref<EvaluationItem[]>([
  { _id: 'e1', participant: 'فاطمه حسینی', course: 'مدیریت زمان', score: '۸.۷', status: 'تأیید شده' },
  { _id: 'e2', participant: 'علی گلی', course: 'فرآیندهای عملیاتی', score: '۷.۹', status: 'در انتظار' },
])
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">ثبت نتایج و اثربخشی</h2>
        <p class="text-sm text-gray-500 mt-1">جمع‌آوری داده‌های ارزیابی دوره و مربی</p>
      </div>
      <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all">ثبت ارزیابی</button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">شرکت‌کننده</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">دوره</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">امتیاز</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rows" :key="item._id" class="border-t border-gray-200 dark:border-gray-800">
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.participant }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.course }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.score }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
