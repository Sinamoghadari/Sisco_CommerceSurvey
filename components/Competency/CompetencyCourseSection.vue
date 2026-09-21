<script setup lang="ts">
import { ref } from 'vue'

// ==================== وضعیت پوشش دوره ====================
const isCoverageModalOpen = ref(false)
const coverageForm = ref({ title: '', isActive: true })
const coverageList = ref<any[]>([])

const openCoverageModal = () => {
  coverageForm.value = { title: '', isActive: true }
  isCoverageModalOpen.value = true
}

const saveCoverage = () => {
  // متد بعداً پیاده‌سازی می‌شود
  isCoverageModalOpen.value = false
}

// ==================== دوره جدید ====================
const isCourseModalOpen = ref(false)
const courseForm = ref({ title: '', type: '', description: '', isActive: true })
const courseTypes = ref<any[]>([]) // بعداً از بک‌اند لود می‌شود

const openCourseModal = () => {
  courseForm.value = { title: '', type: '', description: '', isActive: true }
  isCourseModalOpen.value = true
}

const saveCourse = () => {
  // متد بعداً پیاده‌سازی می‌شود
  isCourseModalOpen.value = false
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">دوره ها</h2>
        <p class="text-sm text-gray-500 mt-1">مدیریت دوره‌های آموزشی</p>
      </div>
      <div class="flex flex-wrap gap-2 mt-3 md:mt-0">
        <button @click="openCoverageModal" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded shadow text-sm transition-all">تعریف وضعیت پوشش دوره</button>
        <button @click="openCourseModal" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all">تعریف دوره</button>
      </div>
    </div>

    <!-- مودال وضعیت پوشش دوره -->
    <div v-if="isCoverageModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden border dark:border-gray-800">
        <div class="px-6 py-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-950 dark:text-white">تعریف وضعیت پوشش دوره</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">وضعیت پوشش <span class="text-red-500">*</span></label>
            <BaseInput v-model="coverageForm.title" placeholder="عنوان وضعیت پوشش را وارد کنید" />
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت فعال بودن</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">{{ coverageForm.isActive ? 'این وضعیت فعال است' : 'این وضعیت فعال نیست' }}</span>
              <button @click="coverageForm.isActive = !coverageForm.isActive" class="w-11 h-6 rounded-full transition-colors relative" :class="coverageForm.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'">
                <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform" :class="coverageForm.isActive ? 'translate-x-0' : '-translate-x-5'"></span>
              </button>
            </div>
          </div>
          <div class="overflow-x-auto mt-4">
            <TairoTable rounded="sm" class="w-full border">
              <template #header>
                <TairoTableHeading>نوع وضعیت دوره</TairoTableHeading>
                <TairoTableHeading>وضعیت دوره</TairoTableHeading>
                <TairoTableHeading>مدیریت</TairoTableHeading>
              </template>
              <TairoTableRow v-for="item in coverageList" :key="item._id">
                <TairoTableCell>{{ item.title }}</TairoTableCell>
                <TairoTableCell>
                  <span class="px-2.5 py-1 text-xs font-semibold rounded-full" :class="item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">{{ item.isActive ? 'فعال' : 'غیر فعال' }}</span>
                </TairoTableCell>
                <TairoTableCell>
                  <button class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </TairoTableCell>
              </TairoTableRow>
              <TairoTableRow v-if="coverageList.length === 0">
                <TairoTableCell colspan="3" class="py-6 text-gray-400 text-center">موردی ثبت نشده است.</TairoTableCell>
              </TairoTableRow>
            </TairoTable>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
          <button @click="isCoverageModalOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
          <button @click="saveCoverage" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
        </div>
      </div>
    </div>

    <!-- مودال تعریف دوره جدید -->
    <div v-if="isCourseModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg overflow-hidden border dark:border-gray-800">
        <div class="px-6 py-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-950 dark:text-white">تعریف دوره جدید</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">عنوان دوره <span class="text-red-500">*</span></label>
            <BaseInput v-model="courseForm.title" placeholder="عنوان دوره را وارد کنید" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">نوع دوره <span class="text-red-500">*</span></label>
            <select v-model="courseForm.type" class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="" disabled>انتخاب نوع دوره</option>
              <option v-for="t in courseTypes" :key="t._id" :value="t._id">{{ t.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">توضیحات</label>
            <textarea v-model="courseForm.description" class="w-full min-h-[80px] p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="توضیحات اختیاری را وارد کنید..."></textarea>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت فعال بودن دوره</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">{{ courseForm.isActive ? 'این دوره فعال است' : 'این دوره فعال نیست' }}</span>
              <button @click="courseForm.isActive = !courseForm.isActive" class="w-11 h-6 rounded-full transition-colors relative" :class="courseForm.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'">
                <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform" :class="courseForm.isActive ? 'translate-x-0' : '-translate-x-5'"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
          <button @click="isCourseModalOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
          <button @click="saveCourse" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
        </div>
      </div>
    </div>
  </div>
</template>