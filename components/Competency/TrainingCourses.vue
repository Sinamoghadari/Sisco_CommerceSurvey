<script setup lang="ts">
import { computed, ref } from 'vue'

interface SelectOption {
  value: string
  label: string
}

interface CourseItem {
  _id: string
  code: string
  title: string
  nature: string
  durationHours: number
  deliveryMode: string
  courseLevel: string
  groupTitle: string
  competencyCount: number
  status: string
}

interface CompetencyRow {
  competencyId: string
  targetLevelId: string
  weight: number
  isPrimary: boolean
}

interface PrerequisiteRow {
  prereqType: string
  itemId: string
  itemLabel: string
  logicGroup: number
  isMandatory: boolean
}

interface AttachmentRow {
  _id: string
  attachmentType: string
  fileName: string
  version: number
}

interface CourseForm {
  code: string
  title: string
  description: string
  curriculumPlan: string
  durationHours: number | null
  deliveryMode: string
  nature: string
  groupId: string
  courseLevel: string
  status: string
  suggestedInstructor: string
  teachingMethod: string
  assessmentMethod: string
  passingScore: number | null
  certificateType: string
  gradingScale: string
  maxCapacity: number | null
  maxAbsencePercent: number | null
  preAssessment: boolean
  needsRetraining: boolean
  certificateValidityMonths: number | null
  retrainingIntervalMonths: number | null
  expiryWarningDays: number | null
  retrainingMode: string
  competencies: CompetencyRow[]
  prerequisites: PrerequisiteRow[]
}

const listTab = ref<'courses' | 'orphans'>('courses')
const formTab = ref(1)
const isModalOpen = ref(false)
const editingId = ref<string | null>(null)
const uploadType = ref('plan')
const uploadFileName = ref('')

const formTabs = [
  { id: 1, label: '۱. اطلاعات پایه' },
  { id: 2, label: '۲. شایستگی‌ها' },
  { id: 3, label: '۳. پیش‌نیازها' },
  { id: 4, label: '۴. ارزیابی' },
  { id: 5, label: '۵. بازآموزی' },
  { id: 6, label: '۶. پیوست‌ها' }
]

const filters = ref({
  search: '',
  status: '',
  nature: ''
})

const statuses: SelectOption[] = [
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'pending', label: 'در انتظار تایید' },
  { value: 'approved', label: 'تایید شده' },
  { value: 'inactive', label: 'غیرفعال' }
]

const natures: SelectOption[] = [
  { value: 'technical', label: 'فنی' },
  { value: 'behavioral', label: 'رفتاری' },
  { value: 'organizational', label: 'سازمانی' }
]

const deliveryModes: SelectOption[] = [
  { value: 'in_person', label: 'حضوری' },
  { value: 'online', label: 'آنلاین' },
  { value: 'hybrid', label: 'ترکیبی' }
]

const courseLevels: SelectOption[] = [
  { value: 'basic', label: 'مقدماتی' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'پیشرفته' }
]

const groups: SelectOption[] = [
  { value: 'grp-1', label: 'گروه بهره‌برداری' },
  { value: 'grp-2', label: 'گروه منابع انسانی' },
  { value: 'grp-3', label: 'گروه ایمنی' }
]

const competencies: SelectOption[] = [
  { value: 'cmp-1', label: 'C-101 - تحلیل فرایند' },
  { value: 'cmp-2', label: 'C-102 - کار تیمی' },
  { value: 'cmp-3', label: 'C-103 - مدیریت زمان' }
]

const competencyLevels: SelectOption[] = [
  { value: 'lvl-1', label: 'سطح ۱' },
  { value: 'lvl-2', label: 'سطح ۲' },
  { value: 'lvl-3', label: 'سطح ۳' }
]

const prerequisiteTypes: SelectOption[] = [
  { value: 'course', label: 'دوره' },
  { value: 'competency', label: 'شایستگی' },
  { value: 'document', label: 'مدرک' }
]

const teachingMethods: SelectOption[] = [
  { value: 'lecture', label: 'سخنرانی' },
  { value: 'workshop', label: 'کارگاهی' },
  { value: 'practice', label: 'عملی' }
]

const assessmentMethods: SelectOption[] = [
  { value: 'exam', label: 'آزمون' },
  { value: 'observation', label: 'مشاهده عملکرد' },
  { value: 'project', label: 'پروژه' }
]

const certificateTypes: SelectOption[] = [
  { value: 'none', label: 'بدون گواهی' },
  { value: 'internal', label: 'گواهی داخلی' },
  { value: 'official', label: 'گواهی رسمی' }
]

const gradingScales: SelectOption[] = [
  { value: '0_100', label: '۰ تا ۱۰۰' },
  { value: '0_20', label: '۰ تا ۲۰' },
  { value: 'pass_fail', label: 'قبول / مردود' }
]

const retrainingModes: SelectOption[] = [
  { value: 'same_course', label: 'همین دوره' },
  { value: 'refresher', label: 'دوره بازآموزی' },
  { value: 'reassessment', label: 'فقط ارزیابی مجدد' }
]

const attachmentTypes: SelectOption[] = [
  { value: 'plan', label: 'طرح درس' },
  { value: 'content', label: 'محتوای آموزشی' },
  { value: 'exam', label: 'نمونه آزمون' }
]

const rows = ref<CourseItem[]>([
  {
    _id: 'c1',
    code: 'TR-001',
    title: 'آشنایی با فرایندهای عملیاتی',
    nature: 'technical',
    durationHours: 8,
    deliveryMode: 'in_person',
    courseLevel: 'basic',
    groupTitle: 'گروه بهره‌برداری',
    competencyCount: 2,
    status: 'approved'
  },
  {
    _id: 'c2',
    code: 'TR-002',
    title: 'مدیریت زمان و اولویت',
    nature: 'organizational',
    durationHours: 4,
    deliveryMode: 'online',
    courseLevel: 'intermediate',
    groupTitle: 'گروه منابع انسانی',
    competencyCount: 1,
    status: 'draft'
  }
])

const orphans = ref([
  { _id: 'o1', code: 'CP-201', title: 'تصمیم‌گیری', dutyType: 'رفتاری' },
  { _id: 'o2', code: 'CP-202', title: 'ایمنی محیط کار', dutyType: 'فنی' }
])

const attachments = ref<AttachmentRow[]>([
  { _id: 'a1', attachmentType: 'plan', fileName: 'lesson-plan.pdf', version: 1 }
])

const emptyComp = (): CompetencyRow => ({
  competencyId: '',
  targetLevelId: '',
  weight: 100,
  isPrimary: false
})

const emptyPrereq = (): PrerequisiteRow => ({
  prereqType: 'course',
  itemId: '',
  itemLabel: '',
  logicGroup: 1,
  isMandatory: true
})

const blankForm = (): CourseForm => ({
  code: '',
  title: '',
  description: '',
  curriculumPlan: '',
  durationHours: 0,
  deliveryMode: 'in_person',
  nature: 'technical',
  groupId: '',
  courseLevel: 'basic',
  status: 'draft',
  suggestedInstructor: '',
  teachingMethod: '',
  assessmentMethod: '',
  passingScore: null,
  certificateType: 'none',
  gradingScale: '0_100',
  maxCapacity: null,
  maxAbsencePercent: null,
  preAssessment: false,
  needsRetraining: false,
  certificateValidityMonths: null,
  retrainingIntervalMonths: null,
  expiryWarningDays: 30,
  retrainingMode: 'same_course',
  competencies: [],
  prerequisites: []
})

const form = ref<CourseForm>(blankForm())

const filteredRows = computed(() => {
  return rows.value.filter((item) => {
    const matchSearch =
      !filters.value.search ||
      item.title.includes(filters.value.search) ||
      item.code.includes(filters.value.search)

    const matchStatus =
      !filters.value.status || item.status === filters.value.status

    const matchNature =
      !filters.value.nature || item.nature === filters.value.nature

    return matchSearch && matchStatus && matchNature
  })
})

const labelOf = (options: SelectOption[], value: string) => {
  return options.find((item) => item.value === value)?.label || '—'
}

const statusBadgeClass = (status: string) => {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-700'
  if (status === 'pending') return 'bg-sky-100 text-sky-700'
  if (status === 'inactive') return 'bg-rose-100 text-rose-700'
  return 'bg-amber-100 text-amber-700'
}

const openCreate = () => {
  editingId.value = null
  form.value = blankForm()
  formTab.value = 1
  isModalOpen.value = true
}

const openEdit = (item: CourseItem) => {
  editingId.value = item._id
  form.value = {
    ...blankForm(),
    code: item.code,
    title: item.title,
    nature: item.nature,
    durationHours: item.durationHours,
    deliveryMode: item.deliveryMode,
    courseLevel: item.courseLevel,
    status: item.status,
    groupId: groups.find((group) => group.label === item.groupTitle)?.value || '',
    competencies: [emptyComp()],
    prerequisites: [emptyPrereq()]
  }
  formTab.value = 1
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingId.value = null
}

const addCompetency = () => {
  form.value.competencies.push(emptyComp())
}

const removeCompetency = (index: number) => {
  form.value.competencies.splice(index, 1)
}

const addPrerequisite = () => {
  form.value.prerequisites.push(emptyPrereq())
}

const removePrerequisite = (index: number) => {
  form.value.prerequisites.splice(index, 1)
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  uploadFileName.value = input.files?.[0]?.name || ''
}

const save = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="border-x border-b bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <div class="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">بانک دوره‌های آموزشی</h2>
      </div>
      <button
        @click="openCreate"
        class="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-all hover:bg-green-700"
      >
        + دوره جدید
      </button>
    </div>

    <div class="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
      <button
        @click="listTab = 'courses'"
        :class="[
          'border-b-2 px-4 py-2 text-sm font-semibold transition-colors',
          listTab === 'courses'
            ? 'border-green-600 text-green-700 dark:text-green-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        ]"
      >
        دوره‌ها
      </button>
      <button
        @click="listTab = 'orphans'"
        :class="[
          'border-b-2 px-4 py-2 text-sm font-semibold transition-colors',
          listTab === 'orphans'
            ? 'border-green-600 text-green-700 dark:text-green-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        ]"
      >
        شایستگی‌های بدون دوره
      </button>
    </div>

    <div v-if="listTab === 'courses'">
      <div class="mb-4 flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div class="flex min-w-[220px] flex-col gap-1">
          <label class="text-xs font-bold text-gray-500">جستجو</label>
          <input
            v-model="filters.search"
            class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            placeholder="کد یا عنوان..."
          />
        </div>

        <div class="flex min-w-[180px] flex-col gap-1">
          <label class="text-xs font-bold text-gray-500">وضعیت</label>
          <select
            v-model="filters.status"
            class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">همه</option>
            <option v-for="item in statuses" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </div>

        <div class="flex min-w-[180px] flex-col gap-1">
          <label class="text-xs font-bold text-gray-500">طبیعت</label>
          <select
            v-model="filters.nature"
            class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">همه</option>
            <option v-for="item in natures" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </div>

        <button class="mt-auto rounded bg-gray-200 px-4 py-2 text-sm dark:bg-gray-700">
          اعمال
        </button>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-center text-sm">کد</th>
              <th class="px-4 py-3 text-center text-sm">عنوان</th>
              <th class="px-4 py-3 text-center text-sm">طبیعت</th>
              <th class="px-4 py-3 text-center text-sm">ساعت</th>
              <th class="px-4 py-3 text-center text-sm">ارائه</th>
              <th class="px-4 py-3 text-center text-sm">سطح</th>
              <th class="px-4 py-3 text-center text-sm">گروه</th>
              <th class="px-4 py-3 text-center text-sm">شایستگی‌ها</th>
              <th class="px-4 py-3 text-center text-sm">وضعیت</th>
              <th class="px-4 py-3 text-center text-sm">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredRows"
              :key="item._id"
              class="border-t border-gray-200 dark:border-gray-800"
            >
              <td class="px-4 py-3 text-center text-sm">{{ item.code }}</td>
              <td class="px-4 py-3 text-center text-sm font-semibold">{{ item.title }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ labelOf(natures, item.nature) }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ item.durationHours }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ labelOf(deliveryModes, item.deliveryMode) }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ labelOf(courseLevels, item.courseLevel) }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ item.groupTitle }}</td>
              <td class="px-4 py-3 text-center text-sm">{{ item.competencyCount }}</td>
              <td class="px-4 py-3 text-center text-sm">
                <span
                  :class="[
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                    statusBadgeClass(item.status)
                  ]"
                >
                  {{ labelOf(statuses, item.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-center text-sm">
                <button @click="openEdit(item)" class="text-blue-600 hover:underline">
                  ویرایش
                </button>
              </td>
            </tr>

            <tr v-if="!filteredRows.length">
              <td colspan="10" class="px-4 py-8 text-center text-sm text-gray-500">
                دوره‌ای ثبت نشده است
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <table v-if="orphans.length" class="min-w-full">
        <thead class="border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th class="px-4 py-3 text-center text-sm">کد</th>
            <th class="px-4 py-3 text-center text-sm">عنوان</th>
            <th class="px-4 py-3 text-center text-sm">نوع</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orphans" :key="item._id" class="border-t border-gray-200 dark:border-gray-800">
            <td class="px-4 py-3 text-center text-sm">{{ item.code }}</td>
            <td class="px-4 py-3 text-center text-sm">{{ item.title }}</td>
            <td class="px-4 py-3 text-center text-sm">{{ item.dutyType }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="py-8 text-center text-sm text-gray-500">
        همه شایستگی‌های فعال به دوره متصل‌اند
      </p>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b px-6 py-4 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ editingId ? 'ویرایش دوره' : 'دوره جدید' }}
            </h3>
            <span
              v-if="form.code"
              class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ form.code }}
            </span>
          </div>
          <button @click="closeModal" class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            بستن
          </button>
        </div>

        <div class="flex overflow-x-auto border-b dark:border-gray-800">
          <button
            v-for="tab in formTabs"
            :key="tab.id"
            @click="formTab = tab.id"
            class="shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
            :class="formTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          >
            {{ tab.label }}
          </button>
        </div>

        <form @submit.prevent="save" class="flex-1 overflow-auto p-6">
          <div v-show="formTab === 1" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">کد</label>
                <input
                  :value="form.code || 'خودکار پس از ذخیره'"
                  disabled
                  class="rounded border border-gray-300 bg-gray-100 p-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">عنوان *</label>
                <input
                  v-model="form.title"
                  required
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">طبیعت</label>
                <select
                  v-model="form.nature"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option v-for="item in natures" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">گروه</label>
                <select
                  v-model="form.groupId"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="">انتخاب کنید</option>
                  <option v-for="item in groups" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">ساعت</label>
                <input
                  v-model.number="form.durationHours"
                  type="number"
                  min="0"
                  step="0.5"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">ارائه</label>
                <select
                  v-model="form.deliveryMode"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option v-for="item in deliveryModes" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">سطح</label>
                <select
                  v-model="form.courseLevel"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option v-for="item in courseLevels" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">وضعیت</label>
                <select
                  v-model="form.status"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option v-for="item in statuses" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">توضیحات</label>
              <textarea
                v-model="form.description"
                rows="2"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">طرح درسی</label>
              <textarea
                v-model="form.curriculumPlan"
                rows="3"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>

          <div v-show="formTab === 2" class="space-y-4">
            <div
              v-for="(row, index) in form.competencies"
              :key="index"
              class="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">شایستگی</label>
                  <select
                    v-model="row.competencyId"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <option value="">انتخاب کنید</option>
                    <option v-for="item in competencies" :key="item.value" :value="item.value">{{ item.label }}</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">سطح هدف</label>
                  <select
                    v-model="row.targetLevelId"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <option value="">انتخاب کنید</option>
                    <option v-for="item in competencyLevels" :key="item.value" :value="item.value">{{ item.label }}</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">وزن</label>
                  <input
                    v-model.number="row.weight"
                    type="number"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                <div class="flex items-end gap-3">
                  <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <input v-model="row.isPrimary" type="checkbox" />
                    اصلی
                  </label>
                  <button
                    type="button"
                    @click="removeCompetency(index)"
                    class="rounded bg-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-200"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="addCompetency"
              class="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              + شایستگی
            </button>
          </div>

          <div v-show="formTab === 3" class="space-y-4">
            <div
              v-for="(row, index) in form.prerequisites"
              :key="index"
              class="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">نوع</label>
                  <select
                    v-model="row.prereqType"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <option v-for="item in prerequisiteTypes" :key="item.value" :value="item.value">{{ item.label }}</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">شناسه / برچسب</label>
                  <input
                    v-model="row.itemLabel"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                    placeholder="عنوان پیش‌نیاز"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">item_id</label>
                  <input
                    v-model="row.itemId"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">گروه منطقی</label>
                  <input
                    v-model.number="row.logicGroup"
                    type="number"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                <div class="flex items-end gap-3">
                  <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <input v-model="row.isMandatory" type="checkbox" />
                    اجباری
                  </label>
                  <button
                    type="button"
                    @click="removePrerequisite(index)"
                    class="rounded bg-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-200"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="addPrerequisite"
              class="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              + پیش‌نیاز
            </button>
          </div>

          <div v-show="formTab === 4" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">مدرس پیشنهادی</label>
              <input v-model="form.suggestedInstructor" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">روش تدریس</label>
              <select v-model="form.teachingMethod" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option value="">انتخاب کنید</option>
                <option v-for="item in teachingMethods" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">روش ارزیابی</label>
              <select v-model="form.assessmentMethod" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option value="">انتخاب کنید</option>
                <option v-for="item in assessmentMethods" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">نمره قبولی</label>
              <input v-model.number="form.passingScore" type="number" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">نوع گواهی</label>
              <select v-model="form.certificateType" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option v-for="item in certificateTypes" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">مقیاس نمره</label>
              <select v-model="form.gradingScale" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900">
                <option v-for="item in gradingScales" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">ظرفیت حداکثر</label>
              <input v-model.number="form.maxCapacity" type="number" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">حداکثر غیبت (%)</label>
              <input v-model.number="form.maxAbsencePercent" type="number" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>

            <div class="flex items-end">
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input v-model="form.preAssessment" type="checkbox" />
                پیش‌آزمون
              </label>
            </div>
          </div>

          <div v-show="formTab === 5" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div class="flex items-end">
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input v-model="form.needsRetraining" type="checkbox" />
                نیاز به بازآموزی
              </label>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">اعتبار گواهی (ماه)</label>
              <input
                v-model.number="form.certificateValidityMonths"
                type="number"
                :disabled="!form.needsRetraining"
                class="rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">بازه بازآموزی (ماه)</label>
              <input
                v-model.number="form.retrainingIntervalMonths"
                type="number"
                :disabled="!form.needsRetraining"
                class="rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">هشدار انقضا (روز)</label>
              <input
                v-model.number="form.expiryWarningDays"
                type="number"
                :disabled="!form.needsRetraining"
                class="rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">حالت بازآموزی</label>
              <select
                v-model="form.retrainingMode"
                :disabled="!form.needsRetraining"
                class="rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              >
                <option v-for="item in retrainingModes" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>
          </div>

          <div v-show="formTab === 6" class="space-y-4">
            <p v-if="!editingId" class="rounded bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:bg-gray-800">
              پس از ذخیره اولیه می‌توانید پیوست بارگذاری کنید.
            </p>

            <template v-else>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr_auto]">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">نوع پیوست</label>
                  <select
                    v-model="uploadType"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <option v-for="item in attachmentTypes" :key="item.value" :value="item.value">{{ item.label }}</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-200">فایل</label>
                  <input
                    type="file"
                    class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                    @change="onFileChange"
                  />
                  <span v-if="uploadFileName" class="text-xs text-gray-500">{{ uploadFileName }}</span>
                </div>

                <div class="flex items-end">
                  <button
                    type="button"
                    class="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    بارگذاری
                  </button>
                </div>
              </div>

              <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                <table class="min-w-full">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="px-4 py-3 text-center text-sm">نوع</th>
                      <th class="px-4 py-3 text-center text-sm">نام فایل</th>
                      <th class="px-4 py-3 text-center text-sm">نسخه</th>
                      <th class="px-4 py-3 text-center text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in attachments" :key="item._id" class="border-t border-gray-200 dark:border-gray-800">
                      <td class="px-4 py-3 text-center text-sm">{{ labelOf(attachmentTypes, item.attachmentType) }}</td>
                      <td class="px-4 py-3 text-center text-sm">{{ item.fileName }}</td>
                      <td class="px-4 py-3 text-center text-sm">{{ item.version }}</td>
                      <td class="px-4 py-3 text-center text-sm">
                        <button type="button" class="text-red-600 hover:underline">حذف</button>
                      </td>
                    </tr>

                    <tr v-if="!attachments.length">
                      <td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500">
                        پیوستی نیست
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>

          <div class="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-gray-800">
            <button
              type="button"
              @click="closeModal"
              class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
            >
              انصراف
            </button>
            <button
              type="submit"
              class="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
