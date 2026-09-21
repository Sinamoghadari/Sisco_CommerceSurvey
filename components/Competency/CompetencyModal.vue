<script setup lang="ts">
const props = defineProps<{
  competencyTypes: any[]
  competencyLvls: any[]
}>()

const isOpen = defineModel<boolean>('open', { required: true })
const isEditMode = defineModel<boolean>('editMode', { required: true })
const compForm = defineModel<any>('form', { required: true })

const emit = defineEmits<{
  save: []
}>()
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full overflow-hidden border dark:border-gray-800">
      <div class="px-6 py-4 border-b dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-950 dark:text-white">{{ isEditMode ? 'ویرایش شایستگی' : 'تعریف شایستگی جدید' }}</h3>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">عنوان شایستگی <span class="text-red-500">*</span></label>
          <BaseInput v-model="compForm.title" placeholder="مثال: رهبری و تفکر استراتژیک" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">نوع شایستگی <span class="text-red-500">*</span></label>
            <select 
              v-model="compForm.typeId" 
              class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled>انتخاب نوع شایستگی</option>
              <option v-for="type in competencyTypes" :key="type._id" :value="type._id">{{ type.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">سطح شایستگی <span class="text-red-500">*</span></label>
            <select 
              v-model="compForm.lvlId" 
              class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled>انتخاب سطح شایستگی</option>
              <option v-for="lvl in competencyLvls" :key="lvl._id" :value="lvl._id">{{ lvl.title }}</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">تعریف شایستگی</label>
          <textarea v-model="compForm.description" class="w-full min-h-[80px] p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="این شایستگی عبارت است از ..." />
        </div>
        <div v-if="isEditMode" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت شایستگی</span>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">{{ compForm.isActive ? 'فعال' : 'غیرفعال' }}</span>
            <button
              @click="compForm.isActive = !compForm.isActive"
              class="w-11 h-6 rounded-full transition-colors relative"
              :class="compForm.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
            >
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform" :class="compForm.isActive ? 'translate-x-0' : '-translate-x-5'"></span>
            </button>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
        <button @click="isOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
        <button @click="emit('save')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
      </div>
    </div>
  </div>
</template>
