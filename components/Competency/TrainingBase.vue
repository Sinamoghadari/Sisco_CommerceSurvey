<script setup lang="ts">
import { ref, computed } from 'vue'

interface BaseOption {
  _id: string
  category: string
  code: string
  title: string
  description: string
  sortOrder: number
  isActive: boolean
}

interface CourseGroup {
  _id: string
  nature: string
  title: string
  sortOrder: number
  isActive: boolean
}

// دسته‌بندی‌های پایه (نمایشی)
const categories = ref<{ value: string; label: string }[]>([
  { value: 'natures', label: 'طبیعت دوره' },
  { value: 'delivery_modes', label: 'نحوه ارائه' },
  { value: 'course_levels', label: 'سطح دوره' },
  { value: 'statuses', label: 'وضعیت' },
  { value: 'certificate_type', label: 'نوع گواهی' },
  { value: 'grade_scale', label: 'مقیاس نمره' },
  { value: 'retraining_status', label: 'حالت بازآموزی' },
  { value: 'teaching_method', label: 'روش تدریس' },
  { value: 'evaluation_method', label: 'روش ارزیابی' },
  { value: 'prerequisites_type', label: 'نوع پیشنیاز  ' },
  { value: 'appendix_type', label: 'نوع پیوست'}
])

const tab = ref<'options' | 'groups'>('options')

// داده‌های نمایشی؛ اتصال به بک‌اند در فاز بعدی انجام می‌شود
const options = ref<BaseOption[]>([])
const groups = ref<CourseGroup[]>([])
const optFilter = ref('')

const natures = computed(() => options.value.filter((o) => o.category === 'natures' && o.isActive))

const filteredOptions = computed(() =>
  optFilter.value ? options.value.filter((o) => o.category === optFilter.value) : options.value,
)

const catLabel = (value: string) => categories.value.find((c) => c.value === value)?.label || value

// ==================== مودال گزینه ====================
const isOptModalOpen = ref(false)
const isOptEditMode = ref(false)
const optForm = ref<BaseOption>({ _id: '', category: 'natures', code: '', title: '', description: '', sortOrder: 0, isActive: true })

const openOptCreate = () => {
  isOptEditMode.value = false
  optForm.value = { _id: '', category: optFilter.value || 'natures', code: '', title: '', description: '', sortOrder: 0, isActive: true }
  isOptModalOpen.value = true
}

const openOptEdit = (item: BaseOption) => {
  isOptEditMode.value = true
  optForm.value = { ...item }
  isOptModalOpen.value = true
}

const saveOpt = () => {
  // متد ذخیره بعداً به بک‌اند متصل می‌شود
  isOptModalOpen.value = false
}

// ==================== مودال گروه دوره ====================
const isGroupModalOpen = ref(false)
const isGroupEditMode = ref(false)
const groupForm = ref<CourseGroup>({ _id: '', nature: '', title: '', sortOrder: 0, isActive: true })

const openGroupCreate = () => {
  isGroupEditMode.value = false
  groupForm.value = { _id: '', nature: natures.value[0]?.code || '', title: '', sortOrder: 0, isActive: true }
  isGroupModalOpen.value = true
}

const openGroupEdit = (item: CourseGroup) => {
  isGroupEditMode.value = true
  groupForm.value = { ...item }
  isGroupModalOpen.value = true
}

const saveGroup = () => {
  // متد ذخیره بعداً به بک‌اند متصل می‌شود
  isGroupModalOpen.value = false
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">اطلاعات پایه آموزش</h2>
        <p class="text-sm text-gray-500 mt-1">مدیریت گزینه‌های پایه و گروه‌های دوره</p>
      </div>
    </div>

    <!-- تب‌های داخلی -->
    <div class="flex gap-2 border-b dark:border-gray-800 mb-4">
      <button
        @click="tab = 'options'"
        class="py-2 px-4 text-sm font-semibold border-b-2 transition-all"
        :class="tab === 'options' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >گزینه‌های پایه</button>
      <button
        @click="tab = 'groups'"
        class="py-2 px-4 text-sm font-semibold border-b-2 transition-all"
        :class="tab === 'groups' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >گروه دوره</button>
    </div>

    <!-- گزینه‌های پایه -->
    <div v-if="tab === 'options'">
      <div class="flex flex-wrap items-end gap-3 mb-4">
        <div class="min-w-[200px]">
          <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">دسته</label>
          <select v-model="optFilter" class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="">همه</option>
            <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
        <button @click="openOptCreate" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all">گزینه جدید</button>
      </div>

      <div class="overflow-x-auto">
        <TairoTable rounded="sm" class="w-full border">
          <template #header>
            <TairoTableHeading class="!text-center">دسته</TairoTableHeading>
            <TairoTableHeading class="!text-center">کد</TairoTableHeading>
            <TairoTableHeading class="!text-center">عنوان</TairoTableHeading>
            <TairoTableHeading class="!text-center">ترتیب</TairoTableHeading>
            <TairoTableHeading class="!text-center">وضعیت</TairoTableHeading>
            <TairoTableHeading class="!text-center">عملیات</TairoTableHeading>
          </template>
          <TairoTableRow v-for="o in filteredOptions" :key="o._id">
            <TairoTableCell>{{ catLabel(o.category) }}</TairoTableCell>
            <TairoTableCell><code class="ltr-code">{{ o.code }}</code></TairoTableCell>
            <TairoTableCell class="font-medium">{{ o.title }}</TairoTableCell>
            <TairoTableCell>{{ o.sortOrder }}</TairoTableCell>
            <TairoTableCell>
              <div class="flex justify-center"><CompetencyStatusBadge :active="o.isActive" /></div>
            </TairoTableCell>
            <TairoTableCell>
              <div class="flex justify-center gap-3">
                <button @click="openOptEdit(o)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
            </TairoTableCell>
          </TairoTableRow>
          <TairoTableRow v-if="filteredOptions.length === 0">
            <TairoTableCell colspan="6" class="py-8 text-center text-gray-400">گزینه‌ای ثبت نشده است.</TairoTableCell>
          </TairoTableRow>
        </TairoTable>
      </div>
    </div>

    <!-- گروه‌های دوره -->
    <div v-if="tab === 'groups'">
      <div class="flex justify-end mb-4">
        <button @click="openGroupCreate" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all">گروه جدید</button>
      </div>
      <div class="overflow-x-auto">
        <TairoTable rounded="sm" class="w-full border">
          <template #header>
            <TairoTableHeading class="!text-center">طبیعت</TairoTableHeading>
            <TairoTableHeading class="!text-center">عنوان</TairoTableHeading>
            <TairoTableHeading class="!text-center">ترتیب</TairoTableHeading>
            <TairoTableHeading class="!text-center">وضعیت</TairoTableHeading>
            <TairoTableHeading class="!text-center">عملیات</TairoTableHeading>
          </template>
          <TairoTableRow v-for="g in groups" :key="g._id">
            <TairoTableCell>{{ g.nature }}</TairoTableCell>
            <TairoTableCell class="font-medium">{{ g.title }}</TairoTableCell>
            <TairoTableCell>{{ g.sortOrder }}</TairoTableCell>
            <TairoTableCell>
              <div class="flex justify-center"><CompetencyStatusBadge :active="g.isActive" /></div>
            </TairoTableCell>
            <TairoTableCell>
              <div class="flex justify-center gap-3">
                <button @click="openGroupEdit(g)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
            </TairoTableCell>
          </TairoTableRow>
          <TairoTableRow v-if="groups.length === 0">
            <TairoTableCell colspan="5" class="py-8 text-center text-gray-400">گروهی ثبت نشده است.</TairoTableCell>
          </TairoTableRow>
        </TairoTable>
      </div>
    </div>

    <!-- مودال گزینه پایه -->
    <div v-if="isOptModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden border dark:border-gray-800">
        <div class="px-6 py-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-950 dark:text-white">{{ isOptEditMode ? 'ویرایش گزینه' : 'گزینه جدید' }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">دسته <span class="text-red-500">*</span></label>
            <select v-model="optForm.category" :disabled="isOptEditMode" class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">کد <span class="text-red-500">*</span></label>
              <BaseInput v-model="optForm.code" :disabled="isOptEditMode" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">عنوان <span class="text-red-500">*</span></label>
              <BaseInput v-model="optForm.title" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">ترتیب</label>
              <BaseInput v-model.number="optForm.sortOrder" type="number" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">توضیحات</label>
            <textarea v-model="optForm.description" class="w-full min-h-[70px] p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">فعال</span>
            <button @click="optForm.isActive = !optForm.isActive" class="w-11 h-6 rounded-full transition-colors relative" :class="optForm.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'">
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform" :class="optForm.isActive ? 'translate-x-0' : '-translate-x-5'"></span>
            </button>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
          <button @click="isOptModalOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
          <button @click="saveOpt" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
        </div>
      </div>
    </div>

    <!-- مودال گروه دوره -->
    <div v-if="isGroupModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg overflow-hidden border dark:border-gray-800">
        <div class="px-6 py-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-950 dark:text-white">{{ isGroupEditMode ? 'ویرایش گروه' : 'گروه جدید' }}</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">طبعیت <span class="text-red-500">*</span></label>
            <select v-model="groupForm.nature" class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="" disabled>جستجو/انتخاب</option>
              <option v-for="n in natures" :key="n._id" :value="n.code">{{ n.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">عنوان <span class="text-red-500">*</span></label>
            <BaseInput v-model="groupForm.title" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">ترتیب</label>
            <BaseInput v-model.number="groupForm.sortOrder" type="number" />
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">فعال</span>
            <button @click="groupForm.isActive = !groupForm.isActive" class="w-11 h-6 rounded-full transition-colors relative" :class="groupForm.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'">
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform" :class="groupForm.isActive ? 'translate-x-0' : '-translate-x-5'"></span>
            </button>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
          <button @click="isGroupModalOpen = false" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">انصراف</button>
          <button @click="saveGroup" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">ذخیره</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ltr-code {
  direction: ltr;
  display: inline-block;
  background: rgba(0, 0, 0, 0.05);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
