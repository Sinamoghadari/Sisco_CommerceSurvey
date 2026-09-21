<script setup lang="ts">
defineProps<{
  competencyLvls: any[]
}>()

const isOpen = defineModel<boolean>('open', { required: true })
const compLvlForm = defineModel<any>('form', { required: true })

const emit = defineEmits<{
  selectForEdit: [level: any]
  save: []
}>()
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full overflow-hidden border dark:border-gray-800 flex flex-col max-h-[90vh]">
      <div class="px-6 py-4 border-b dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-950 dark:text-white">تعریف سطح شایستگی جدید</h3>
      </div>
      <div class="p-6 space-y-4 overflow-y-auto flex-1">
        <div>
          <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">کد سطح <span class="text-red-500">*</span></label>
          <BaseInput v-model.number="compLvlForm.code" type="number" placeholder="مثال: 1، 2، 3" />
        </div>
        
        <div>
          <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">تعریف سطح <span class="text-red-500">*</span></label>
          <BaseInput v-model="compLvlForm.title" placeholder="مثال: مقدماتی، متوسط، پیشرفته" />
        </div>
        
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت فعال بودن</span>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">{{ compLvlForm.status ? 'فعال' : 'غیرفعال' }}</span>
            <button
              @click="compLvlForm.status = !compLvlForm.status"
              class="w-11 h-6 rounded-full transition-colors relative"
              :class="compLvlForm.status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
            >
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform" :class="compLvlForm.status ? 'translate-x-0' : '-translate-x-5'"></span>
            </button>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-bold text-gray-950 dark:text-white mb-2">لیست سطوح شایستگی تعریف شده:</h4>
          <div class="border rounded overflow-hidden max-h-52 overflow-y-auto">
            <table class="w-full text-sm text-right text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th class="px-4 py-2 text-center">کد سطح</th>
                  <th class="px-4 py-2 text-center">تعریف سطح</th>
                  <th class="px-4 py-2 text-center">وضعیت</th>
                  <th class="px-4 py-2 text-center">مدیریت</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lvl in competencyLvls" :key="lvl._id" class="border-t dark:border-gray-800">
                  <td class="px-4 py-2 text-center text-gray-900 dark:text-white">{{ lvl.code }}</td>
                  <td class="px-4 py-2 text-center text-gray-900 dark:text-white">{{ lvl.title }}</td>
                  <td class="px-4 py-2 text-center">
                    <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="lvl.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">{{ lvl.status ? 'فعال' : 'غیرفعال' }}</span>
                  </td>
                  <td class="px-4 py-2 text-center">
                    <button @click="emit('selectForEdit', lvl)" class="p-1 rounded text-yellow-500 hover:text-yellow-600" title="ویرایش">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="competencyLvls.length === 0">
                  <td colspan="4" class="px-4 py-3 text-center text-gray-400">هیچ سطح شایستگی ثبت نشده است.</td>
                </tr>
              </tbody>
            </table>
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
