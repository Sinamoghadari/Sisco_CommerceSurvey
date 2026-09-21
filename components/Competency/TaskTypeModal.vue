<script setup lang="ts">
defineProps<{
  taskTypes: any[]
}>()

const isOpen = defineModel<boolean>('open', { required: true })
const isEditMode = defineModel<boolean>('editMode', { required: true })
const taskTypeForm = defineModel<any>('form', { required: true })

const emit = defineEmits<{
  editTaskType: [type: any]
  save: []
}>()
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden border dark:border-gray-800">
      <div class="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-950 dark:text-white">
          {{ isEditMode ? 'ویرایش نوع وظیفه' : 'تعریف نوع وظیفه جدید' }}
        </h3>
        <button @click="isOpen = false" class="text-gray-400 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">نوع وظیفه <span class="text-red-500">*</span></label>
          <BaseInput v-model="taskTypeForm.title" placeholder="عنوان نوع وظیفه را وارد کنید" />
        </div>

        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت</span>
          <div class="flex items-center gap-3">
            <span class="text-xs font-medium" :class="taskTypeForm.status ? 'text-green-600 dark:text-green-400' : 'text-gray-500'">
              {{ taskTypeForm.status ? 'این نوع وظیفه فعال است' : 'این نوع وظیفه غیرفعال است' }}
            </span>
            <button @click="taskTypeForm.status = !taskTypeForm.status" class="w-11 h-6 rounded-full transition-colors relative shadow-inner" :class="taskTypeForm.status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'">
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform shadow" :class="taskTypeForm.status ? 'translate-x-0' : '-translate-x-5'" />
            </button>
          </div>
        </div>

        <div v-if="isEditMode" class="flex justify-end">
          <button @click="() => { isEditMode = false; taskTypeForm = { id: '', title: '', status: true } }" class="text-xs text-blue-600 hover:underline">بازگشت به حالت ثبت جدید</button>
        </div>

        <div class="mt-6 overflow-x-auto">
          <TairoTable rounded="sm" class="w-full border">
            <template #header>
              <TairoTableHeading>نوع وظیفه</TairoTableHeading>
              <TairoTableHeading>وضعیت</TairoTableHeading>
              <TairoTableHeading class="text-center">مدیریت</TairoTableHeading>
            </template>
            <TairoTableRow v-for="type in taskTypes" :key="type.id">
              <TairoTableCell class="font-medium">{{ type.title || type.name }}</TairoTableCell>
              <TairoTableCell>
                <span class="px-2 py-1 text-[11px] font-semibold rounded-full" :class="type.status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'">
                  {{ type.status ? 'فعال' : 'غیرفعال' }}
                </span>
              </TairoTableCell>
              <TairoTableCell>
                <button @click="emit('editTaskType', type)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </TairoTableCell>
            </TairoTableRow>
            <TairoTableRow v-if="taskTypes.length === 0">
              <TairoTableCell colspan="3" class="py-8 text-center text-gray-400">نوع وظیفه‌ای یافت نشد.</TairoTableCell>
            </TairoTableRow>
          </TairoTable>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
        <button @click="isOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
        <button @click="emit('save')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
      </div>
    </div>
  </div>
</template>
