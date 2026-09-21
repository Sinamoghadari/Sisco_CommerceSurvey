<script setup lang="ts">
import { computed, ref } from 'vue'

interface QuestionnaireItem {
  _id: string
  title: string
  level: string
  isDefault: boolean
  isActive: boolean
}

interface QuestionItem {
  questionText: string
  questionType: string
  groupId: string
  options: string[]
  isRequired: boolean
  sortOrder: number
}

interface QuestionnaireForm {
  title: string
  level: string
  description: string
  isDefault: boolean
  isActive: boolean
  questions: QuestionItem[]
}

const levelFilter = ref('')
const isModalOpen = ref(false)
const isEditMode = ref(false)

const blankQuestion = (): QuestionItem => ({
  questionText: '',
  questionType: 'rating_1_5',
  groupId: '',
  options: [],
  isRequired: true,
  sortOrder: 0,
})

const form = ref<QuestionnaireForm>({
  title: '',
  level: 'level1',
  description: '',
  isDefault: false,
  isActive: true,
  questions: [],
})

const rows = ref<QuestionnaireItem[]>([
  { _id: 'q1', title: 'ارزیابی L1 رضایت', level: 'level1', isDefault: true, isActive: true },
  { _id: 'q2', title: 'ارزیابی L3 رفتار', level: 'level3', isDefault: false, isActive: true },
  { _id: 'q3', title: 'بازخورد مدرس', level: 'instructor_feedback', isDefault: false, isActive: true },
])

const levelOptions = [
  { value: '', label: 'همه' },
  { value: 'level1', label: 'L1' },
  { value: 'level3', label: 'L3' },
  { value: 'level4', label: 'L4' },
  { value: 'instructor_feedback', label: 'بازخورد مدرس' },
]

const questionTypes = [
  { value: 'rating_1_5', label: 'امتیازدهی ۱ تا ۵' },
  { value: 'text', label: 'متنی' },
  { value: 'yes_no', label: 'بله / خیر' },
  { value: 'multiple_choice', label: 'چند گزینه‌ای' },
]

const questionGroups = [
  { value: '', label: 'بدون گروه' },
  { value: 'content', label: 'محتوا' },
  { value: 'instructor', label: 'مدرس' },
  { value: 'facility', label: 'امکانات' },
]

const filteredRows = computed(() => {
  if (!levelFilter.value) return rows.value
  return rows.value.filter((item) => item.level === levelFilter.value)
})

const openCreate = () => {
  isEditMode.value = false
  form.value = {
    title: '',
    level: 'level1',
    description: '',
    isDefault: false,
    isActive: true,
    questions: [blankQuestion()],
  }
  isModalOpen.value = true
}

const openEdit = (item: QuestionnaireItem) => {
  isEditMode.value = true
  form.value = {
    title: item.title,
    level: item.level,
    description: '',
    isDefault: item.isDefault,
    isActive: item.isActive,
    questions: [blankQuestion()],
  }
  isModalOpen.value = true
}

const addQuestion = () => {
  form.value.questions.push(blankQuestion())
}

const removeQuestion = (index: number) => {
  form.value.questions.splice(index, 1)
}

const save = () => {
  const payload = {
    ...form.value,
    questions: form.value.questions.filter((question) => question.questionText.trim()),
  }

  console.log(payload)

  isModalOpen.value = false
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">پرسشنامه‌های ارزیابی</h2>
        <p class="text-sm text-gray-500 mt-1">تنظیم پرسشنامه‌های L1/L3/L4 و بازخورد مدرس</p>
      </div>

      <div class="flex flex-wrap gap-2 mt-3 md:mt-0">
        <button
          @click="openCreate"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all"
        >
          پرسشنامه جدید
        </button>
      </div>
    </div>

    <div class="flex items-end gap-3 mb-4">
      <div class="min-w-[180px]">
        <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">سطح</label>
        <select
          v-model="levelFilter"
          class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option v-for="option in levelOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">عنوان</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">سطح</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">پیش‌فرض</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">عملیات</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in filteredRows"
            :key="item._id"
            class="border-t border-gray-200 dark:border-gray-800"
          >
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ item.title }}
            </td>

            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ item.level }}
            </td>

            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ item.isDefault ? 'بله' : 'خیر' }}
            </td>

            <td class="px-4 py-3 text-center">
              <span
                class="px-2.5 py-1 text-xs font-semibold rounded-full"
                :class="item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ item.isActive ? 'فعال' : 'غیرفعال' }}
              </span>
            </td>

            <td class="px-4 py-3 text-center">
              <button
                @click="openEdit(item)"
                class="px-3 py-1.5 text-sm rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              >
                ویرایش
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border dark:border-gray-800"
      >
        <div class="px-6 py-4 border-b dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-950 dark:text-white">
            {{ isEditMode ? 'ویرایش پرسشنامه' : 'پرسشنامه جدید' }}
          </h3>
        </div>

        <div class="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">عنوان</label>
              <input
                v-model="form.title"
                class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">سطح</label>
              <select
                v-model="form.level"
                class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
              >
                <option value="level1">L1</option>
                <option value="level3">L3</option>
                <option value="level4">L4</option>
                <option value="instructor_feedback">بازخورد مدرس</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">توضیحات</label>
            <textarea
              v-model="form.description"
              class="w-full min-h-[80px] p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">پیش‌فرض برای این سطح</span>
              <input
                v-model="form.isDefault"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">فعال</span>
              <input
                v-model="form.isActive"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </div>

          <div class="pt-4 border-t dark:border-gray-800">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-base font-bold text-gray-950 dark:text-white">سوالات</h4>

              <button
                type="button"
                @click="addQuestion"
                class="px-3 py-1.5 text-sm rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                + سوال
              </button>
            </div>

            <div
              v-if="!form.questions.length"
              class="p-4 text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              هنوز سوالی اضافه نشده است.
            </div>

            <div
              v-for="(question, index) in form.questions"
              :key="index"
              class="p-4 mb-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/60"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-bold text-gray-800 dark:text-gray-200">
                  سوال {{ index + 1 }}
                </span>

                <button
                  type="button"
                  @click="removeQuestion(index)"
                  class="px-3 py-1.5 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100"
                >
                  حذف
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-3">
                  <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">
                    متن سوال
                  </label>
                  <input
                    v-model="question.questionText"
                    class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
                    placeholder="متن سوال را وارد کنید"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">
                    نوع
                  </label>
                  <select
                    v-model="question.questionType"
                    class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
                  >
                    <option
                      v-for="type in questionTypes"
                      :key="type.value"
                      :value="type.value"
                    >
                      {{ type.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-200">
                    گروه
                  </label>
                  <select
                    v-model="question.groupId"
                    class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
                  >
                    <option
                      v-for="group in questionGroups"
                      :key="group.value"
                      :value="group.value"
                    >
                      {{ group.label }}
                    </option>
                  </select>
                </div>

                
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t dark:border-gray-800">
          <button
            @click="isModalOpen = false"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            انصراف
          </button>

          <button
            @click="save"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
