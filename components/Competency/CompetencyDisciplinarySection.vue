<script setup lang="ts">
import { ref } from 'vue'

const isDisciplinaryModalOpen = ref(false)
const disciplinaryForm = ref({ title: '', description: '', isActive: true })

const openDisciplinaryModal = () => {
  disciplinaryForm.value = { title: '', description: '', isActive: true }
  isDisciplinaryModalOpen.value = true
}

const saveDisciplinary = () => {
  // متد بعداً پیاده‌سازی می‌شود
  isDisciplinaryModalOpen.value = false
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <!-- هدر -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">موارد انضباطی-تشویقی</h2>
        <p class="text-sm text-gray-500 mt-1">لیست موارد انضباطی و تشویقی تعریف شده</p>
      </div>
      <div class="mt-3 md:mt-0">
        <button
          @click="openDisciplinaryModal"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all"
        >تعریف مورد انضباطی-تشویقی +</button>
      </div>
    </div>

    <!-- مودال تعریف مورد انضباطی-تشویقی -->
    <div v-if="isDisciplinaryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg overflow-hidden border dark:border-gray-800">
        <div class="px-6 py-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-950 dark:text-white">تعریف مورد انضباطی-تشویقی جدید</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">عنوان مورد <span class="text-red-500">*</span></label>
            <BaseInput v-model="disciplinaryForm.title" placeholder="عنوان مورد انضباطی یا تشویقی را وارد کنید" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">توضیحات</label>
            <textarea
              v-model="disciplinaryForm.description"
              class="w-full min-h-[80px] p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="توضیحات اختیاری را وارد کنید..."
            ></textarea>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت فعال بودن</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">{{ disciplinaryForm.isActive ? 'این مورد فعال است' : 'این مورد فعال نیست' }}</span>
              <button
                @click="disciplinaryForm.isActive = !disciplinaryForm.isActive"
                class="w-11 h-6 rounded-full transition-colors relative"
                :class="disciplinaryForm.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
              >
                <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform" :class="disciplinaryForm.isActive ? 'translate-x-0' : '-translate-x-5'"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
          <button @click="isDisciplinaryModalOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
          <button @click="saveDisciplinary" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
        </div>
      </div>
    </div>
  </div>
</template>