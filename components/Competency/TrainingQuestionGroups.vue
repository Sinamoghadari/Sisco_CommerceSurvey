<script setup lang="ts">
import { ref } from 'vue'

interface QuestionGroup {
  _id: string
  title: string
  description: string
  sortOrder: number
  isActive: boolean
}

// داده‌های نمایشی؛ اتصال به بک‌اند در فاز بعدی انجام می‌شود
const rows = ref<QuestionGroup[]>([])

const isModalOpen = ref(false)
const isEditMode = ref(false)
const editingId = ref<string | null>(null)
const form = ref<QuestionGroup>({ _id: '', title: '', description: '', sortOrder: 0, isActive: true })

const openCreate = () => {
  isEditMode.value = false
  editingId.value = null
  form.value = { _id: '', title: '', description: '', sortOrder: rows.value.length + 1, isActive: true }
  isModalOpen.value = true
}

const openEdit = (item: QuestionGroup) => {
  isEditMode.value = true
  editingId.value = item._id
  form.value = { ...item }
  isModalOpen.value = true
}

const save = () => {
  // متد ذخیره بعداً به بک‌اند متصل می‌شود
  isModalOpen.value = false
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">گروه‌بندی سوالات پرسشنامه</h2>
        <p class="text-sm text-gray-500 mt-1">مدیریت گروه‌های سوالات ارزیابی</p>
      </div>
      <div class="flex flex-wrap gap-2 mt-3 md:mt-0">
        <button @click="openCreate" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all">گروه جدید</button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <TairoTable rounded="sm" class="w-full border">
        <template #header>
          <TairoTableHeading class="!text-center">عنوان</TairoTableHeading>
          <TairoTableHeading class="!text-center">توضیحات</TairoTableHeading>
          <TairoTableHeading class="!text-center">ترتیب</TairoTableHeading>
          <TairoTableHeading class="!text-center">وضعیت</TairoTableHeading>
          <TairoTableHeading class="!text-center">عملیات</TairoTableHeading>
        </template>
        <TairoTableRow v-for="item in rows" :key="item._id">
          <TairoTableCell class="font-medium">{{ item.title }}</TairoTableCell>
          <TairoTableCell class="text-gray-500 text-sm">{{ item.description || '—' }}</TairoTableCell>
          <TairoTableCell>{{ item.sortOrder }}</TairoTableCell>
          <TairoTableCell>
            <div class="flex justify-center">
              <CompetencyStatusBadge :active="item.isActive" />
            </div>
          </TairoTableCell>
          <TairoTableCell>
            <div class="flex justify-center gap-3">
              <button @click="openEdit(item)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
            </div>
          </TairoTableCell>
        </TairoTableRow>
        <TairoTableRow v-if="rows.length === 0">
          <TairoTableCell colspan="5" class="py-8 text-center text-gray-400">گروهی ثبت نشده است.</TairoTableCell>
        </TairoTableRow>
      </TairoTable>
    </div>

    <!-- مودال تعریف / ویرایش گروه سوالات -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg overflow-hidden border dark:border-gray-800">
        <div class="px-6 py-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-950 dark:text-white">{{ isEditMode ? 'ویرایش گروه' : 'گروه جدید' }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">عنوان <span class="text-red-500">*</span></label>
            <BaseInput v-model="form.title" placeholder="عنوان گروه" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">توضیحات</label>
            <textarea v-model="form.description" class="w-full min-h-[80px] p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="توضیحات اختیاری..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">ترتیب</label>
            <BaseInput v-model.number="form.sortOrder" type="number" />
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت فعال بودن</span>
            <button @click="form.isActive = !form.isActive" class="w-11 h-6 rounded-full transition-colors relative" :class="form.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'">
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform" :class="form.isActive ? 'translate-x-0' : '-translate-x-5'"></span>
            </button>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
          <button @click="isModalOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
          <button @click="save" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
        </div>
      </div>
    </div>
  </div>
</template>
