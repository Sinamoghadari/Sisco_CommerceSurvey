<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { required: true })
const isEditMode = defineModel<boolean>('editMode', { required: true })
const assignmentForm = defineModel<any>('form', { required: true })

const emit = defineEmits<{
  save: []
}>()
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full overflow-hidden border dark:border-gray-800">
      <div class="px-6 py-4 border-b dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-950 dark:text-white">{{ isEditMode ? 'ویرایش تکلیف' : 'تعریف تکلیف' }}</h3>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">شرح تکلیف <span class="text-red-500">*</span></label>
          <BaseInput v-model="assignmentForm.title" placeholder="مثال: تهیه گزارش ماهانه" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">توضیحات</label>
          <textarea v-model="assignmentForm.description" class="w-full min-h-[80px] p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="توضیحات مربوط به تکلیف را وارد کنید..." />
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت فعال بودن</span>
          <CompetencyToggleSwitch v-model="assignmentForm.isActive" active-text="فعال" inactive-text="غیر فعال" />
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
        <button @click="isOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
        <button @click="emit('save')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
      </div>
    </div>
  </div>
</template>
