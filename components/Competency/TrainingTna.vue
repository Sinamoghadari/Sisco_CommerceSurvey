<script setup lang="ts">
import { computed, ref } from 'vue'

type MainTab = 'plans' | 'gap'

interface TnaPlanItem {
  _id: string
  year: string
  title: string
  totalBudget: number | null
  totalHours: number
  totalParticipants: number
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
  description?: string
  items?: TnaPlanCourseItem[]
}

interface TnaPlanCourseItem {
  _id: string
  courseCode: string
  courseTitle: string
  targetCount: number
  priority: 'low' | 'medium' | 'high'
  estimatedHours: number | null
  estimatedCost: number | null
  status: 'draft' | 'in_review' | 'approved' | 'rejected'
}

interface GapRow {
  nationalId: string
  employeeName: string
  position: string
  unit: string
  competencyTitle: string
  currentLevel: number
  requiredLevel: number
  status: string
}

/** -----------------------------
 *  Mock Data (UI only)
 *  ----------------------------- */
const mainTab = ref<MainTab>('plans')

const plans = ref<TnaPlanItem[]>([
  {
    _id: 'tn1',
    year: '۱۴۰۴',
    title: 'برنامه آموزش سالانه ۱۴۰۴',
    totalBudget: 250000000,
    totalHours: 120,
    totalParticipants: 80,
    status: 'in_progress',
    description: 'تمرکز بر توسعه مهارت‌های مدیریتی و فنی.',
    items: [
      {
        _id: 'it1',
        courseCode: 'TR-101',
        courseTitle: 'مهارت‌های ارتباطی',
        targetCount: 20,
        priority: 'high',
        estimatedHours: 8,
        estimatedCost: 25000000,
        status: 'approved'
      },
      {
        _id: 'it2',
        courseCode: 'TR-203',
        courseTitle: 'ایمنی صنعتی',
        targetCount: 30,
        priority: 'medium',
        estimatedHours: 6,
        estimatedCost: 18000000,
        status: 'in_review'
      }
    ]
  }
])

const gapRows = ref<GapRow[]>([
  {
    nationalId: '0012345678',
    employeeName: 'علی رضایی',
    position: 'کارشناس آموزش',
    unit: 'منابع انسانی',
    competencyTitle: 'مدیریت زمان',
    currentLevel: 2,
    requiredLevel: 4,
    status: 'نیاز به آموزش'
  },
  {
    nationalId: '0099887766',
    employeeName: 'مینا احمدی',
    position: 'سرپرست تولید',
    unit: 'تولید',
    competencyTitle: 'رهبری تیم',
    currentLevel: 3,
    requiredLevel: 4,
    status: 'نیاز به توانمندسازی'
  }
])

/** -----------------------------
 *  Meta (UI labels/options)
 *  ----------------------------- */
const planStatuses = [
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'approved', label: 'تأیید شده' },
  { value: 'in_progress', label: 'در حال اجرا' },
  { value: 'completed', label: 'تکمیل شده' },
  { value: 'cancelled', label: 'لغو شده' }
] as const

const priorities = [
  { value: 'low', label: 'کم' },
  { value: 'medium', label: 'متوسط' },
  { value: 'high', label: 'زیاد' }
] as const

const itemStatuses = [
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'in_review', label: 'در بررسی' },
  { value: 'approved', label: 'تأیید' },
  { value: 'rejected', label: 'رد' }
] as const

const courseOptions = [
  { value: 'c1', label: 'TR-101 — مهارت‌های ارتباطی', code: 'TR-101', title: 'مهارت‌های ارتباطی' },
  { value: 'c2', label: 'TR-203 — ایمنی صنعتی', code: 'TR-203', title: 'ایمنی صنعتی' },
  { value: 'c3', label: 'TR-330 — تحلیل داده', code: 'TR-330', title: 'تحلیل داده' }
] as const

/** -----------------------------
 *  Helpers (UI only)
 *  ----------------------------- */
const formatMoney = (n: number | null | undefined) => (n == null ? '—' : Number(n).toLocaleString('fa-IR'))

const planStatusLabel = (s: TnaPlanItem['status']) =>
  planStatuses.find(x => x.value === s)?.label || s

const priorityLabel = (s: TnaPlanCourseItem['priority']) =>
  priorities.find(x => x.value === s)?.label || s

const itemStatusLabel = (s: TnaPlanCourseItem['status']) =>
  itemStatuses.find(x => x.value === s)?.label || s

const planBadgeClasses = (s: TnaPlanItem['status']) => {
  const map: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  }
  return map[s] || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
}

/** -----------------------------
 *  Modals state
 *  ----------------------------- */
const showPlanForm = ref(false)
const showManage = ref(false)
const current = ref<TnaPlanItem | null>(null)

/** Plan form */
const planForm = ref({
  _id: null as string | null,
  year: '۱۴۰۴',
  title: '',
  status: 'draft' as TnaPlanItem['status'],
  description: ''
})

/** Manage items form */
const itemForm = ref({
  courseId: '' as string,
  targetCount: 1,
  priority: 'medium' as TnaPlanCourseItem['priority'],
  estimatedHours: null as number | null,
  estimatedCost: null as number | null
})

const planFormTitle = computed(() => (planForm.value._id ? 'ویرایش برنامه' : 'برنامه جدید'))

/** -----------------------------
 *  UI actions (mock only)
 *  ----------------------------- */
const openCreate = () => {
  planForm.value = { _id: null, year: '۱۴۰۴', title: '', status: 'draft', description: '' }
  showPlanForm.value = true
}

const editPlan = (p: TnaPlanItem) => {
  planForm.value = {
    _id: p._id,
    year: p.year,
    title: p.title,
    status: p.status,
    description: p.description || ''
  }
  showPlanForm.value = true
}

const savePlan = () => {
  if (planForm.value._id) {
    plans.value = plans.value.map(p =>
      p._id === planForm.value._id
        ? { ...p, ...planForm.value }
        : p
    )
  } else {
    plans.value.unshift({
      _id: `tn_${Date.now()}`,
      year: planForm.value.year,
      title: planForm.value.title || 'بدون عنوان',
      totalBudget: 0,
      totalHours: 0,
      totalParticipants: 0,
      status: planForm.value.status,
      description: planForm.value.description,
      items: []
    })
  }
  showPlanForm.value = false
}

const deletePlan = (p: TnaPlanItem) => {
  plans.value = plans.value.filter(x => x._id !== p._id)
  if (current.value?._id === p._id) current.value = null
}

const openPlan = (p: TnaPlanItem) => {
  current.value = p
  itemForm.value = { courseId: '', targetCount: 1, priority: 'medium', estimatedHours: null, estimatedCost: null }
  showManage.value = true
}

const addItem = () => {
  if (!current.value) return
  const selected = courseOptions.find(c => c.value === itemForm.value.courseId)
  if (!selected) return

  const it: TnaPlanCourseItem = {
    _id: `it_${Date.now()}`,
    courseCode: selected.code,
    courseTitle: selected.title,
    targetCount: itemForm.value.targetCount,
    priority: itemForm.value.priority,
    estimatedHours: itemForm.value.estimatedHours,
    estimatedCost: itemForm.value.estimatedCost,
    status: 'draft'
  }

  current.value.items = [it, ...(current.value.items || [])]

  // (UI only) recalc totals
  current.value.totalParticipants = (current.value.items || []).reduce((a, x) => a + (x.targetCount || 0), 0)
  current.value.totalHours = (current.value.items || []).reduce((a, x) => a + (x.estimatedHours || 0), 0)
  current.value.totalBudget = (current.value.items || []).reduce((a, x) => a + (x.estimatedCost || 0), 0)

  itemForm.value = { courseId: '', targetCount: 1, priority: 'medium', estimatedHours: null, estimatedCost: null }
}

const updateItemStatus = (it: TnaPlanCourseItem, status: TnaPlanCourseItem['status']) => {
  it.status = status
}

const removeItem = (it: TnaPlanCourseItem) => {
  if (!current.value?.items) return
  current.value.items = current.value.items.filter(x => x._id !== it._id)

  // (UI only) recalc totals
  current.value.totalParticipants = (current.value.items || []).reduce((a, x) => a + (x.targetCount || 0), 0)
  current.value.totalHours = (current.value.items || []).reduce((a, x) => a + (x.estimatedHours || 0), 0)
  current.value.totalBudget = (current.value.items || []).reduce((a, x) => a + (x.estimatedCost || 0), 0)
}

const autoGenerate = () => {
  // UI mock: just add one item if possible
  if (!current.value) return
  const fallback = courseOptions[0]
  const it: TnaPlanCourseItem = {
    _id: `it_${Date.now()}`,
    courseCode: fallback.code,
    courseTitle: fallback.title,
    targetCount: 15,
    priority: 'high',
    estimatedHours: 8,
    estimatedCost: 20000000,
    status: 'in_review'
  }
  current.value.items = [it, ...(current.value.items || [])]
}

const submitApproval = () => {
  // UI mock: mark plan as in_review/approved? We keep plan statuses only; set to approved for demo.
  if (!current.value) return
  current.value.status = 'approved'
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b dark:border-gray-800">
    <!-- Header (base style kept) -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">برنامه سالانه آموزش (TNA)</h2>
        <p class="text-sm text-gray-500 mt-1">برنامه‌های آموزشی سالانه و نیازسنجی</p>
      </div>

      <button
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all"
        @click="openCreate"
      >
        + برنامه جدید
      </button>
    </div>

    <!-- Tabs (added from reference) -->
    <div class="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-800">
      <button
        class="px-4 py-2 text-sm border-b-2 transition-colors"
        :class="mainTab === 'plans'
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
        @click="mainTab = 'plans'"
      >
        برنامه‌ها
      </button>

      <button
        class="px-4 py-2 text-sm border-b-2 transition-colors"
        :class="mainTab === 'gap'
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'"
        @click="mainTab = 'gap'"
      >
        گزارش شکاف
      </button>
    </div>

    <!-- Plans table -->
    <div v-if="mainTab === 'plans'" class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">سال</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">عنوان</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">بودجه</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">ساعت</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">نفر</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">عملیات</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in plans"
            :key="p._id"
            class="border-t border-gray-200 dark:border-gray-800"
          >
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300 font-bold">
              {{ p.year }}
            </td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ p.title }}
            </td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ formatMoney(p.totalBudget) }}
            </td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ p.totalHours }}
            </td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ p.totalParticipants }}
            </td>
            <td class="px-4 py-3 text-center text-sm">
              <span
                class="rounded-full px-2 py-0.5 text-xs"
                :class="planBadgeClasses(p.status)"
              >
                {{ planStatusLabel(p.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-center text-sm whitespace-nowrap">
              <button class="text-blue-600 hover:underline mx-1" @click="openPlan(p)">مدیریت</button>
              <button class="text-gray-700 hover:underline dark:text-gray-200 mx-1" @click="editPlan(p)">ویرایش</button>
              <button class="text-rose-600 hover:underline mx-1" @click="deletePlan(p)">حذف</button>
            </td>
          </tr>

          <tr v-if="!plans.length">
            <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-500">
              برنامه‌ای ثبت نشده است
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Gap report table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">کد ملی</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">نام</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">سمت</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">واحد</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">شایستگی</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">سطح فعلی</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">سطح مورد نیاز</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(r, i) in gapRows"
            :key="i"
            class="border-t border-gray-200 dark:border-gray-800"
          >
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ r.nationalId }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ r.employeeName }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ r.position }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ r.unit }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ r.competencyTitle || '—' }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ r.currentLevel }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ r.requiredLevel }}</td>
            <td class="px-4 py-3 text-center text-sm">
              <span class="rounded-full px-2 py-0.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                {{ r.status }}
              </span>
            </td>
          </tr>

          <tr v-if="!gapRows.length">
            <td colspan="8" class="px-4 py-8 text-center text-sm text-gray-500">
              شکاف شایستگی یافت نشد
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Plan form modal (added from reference) -->
    <div
      v-if="showPlanForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="showPlanForm = false"
    >
      <div class="w-full max-w-2xl overflow-hidden rounded-lg border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b px-6 py-4 dark:border-gray-800 font-bold">
          {{ planFormTitle }}
        </div>

        <form class="p-6" @submit.prevent="savePlan">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">سال شمسی *</label>
              <select
                v-model="planForm.year"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                required
              >
                <option value="۱۴۰۳">۱۴۰۳</option>
                <option value="۱۴۰۴">۱۴۰۴</option>
                <option value="۱۴۰۵">۱۴۰۵</option>
              </select>
            </div>

            <div class="md:col-span-2 flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">عنوان</label>
              <input
                v-model="planForm.title"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                placeholder="مثلاً: برنامه آموزش سالانه ۱۴۰۴"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">وضعیت</label>
              <select
                v-model="planForm.status"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option v-for="s in planStatuses" :key="s.value" :value="s.value">
                  {{ s.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-1">
            <label class="text-xs font-bold text-gray-500">توضیحات</label>
            <textarea
              v-model="planForm.description"
              rows="2"
              class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              placeholder="توضیح کوتاه..."
            />
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              @click="showPlanForm = false"
            >
              انصراف
            </button>
            <button
              type="submit"
              class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manage items modal (added from reference) -->
    <div
      v-if="showManage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="showManage = false"
    >
      <div class="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b px-6 py-4 dark:border-gray-800">
          <div class="font-bold">
            {{ current?.title }} ({{ current?.year }})
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded bg-gray-200 px-3 py-1.5 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              @click="autoGenerate"
            >
              تولید خودکار از شکاف
            </button>
            <button
              type="button"
              class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              @click="submitApproval"
            >
              ارسال برای تأیید
            </button>
          </div>
        </div>

        <div class="overflow-auto p-6">
          <!-- item form row -->
          <div class="grid grid-cols-1 md:grid-cols-6 gap-3 items-end mb-4">
            <div class="md:col-span-2 flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">دوره</label>
              <select
                v-model="itemForm.courseId"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">انتخاب کنید...</option>
                <option v-for="c in courseOptions" :key="c.value" :value="c.value">
                  {{ c.label }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">تعداد هدف</label>
              <input
                v-model.number="itemForm.targetCount"
                type="number"
                min="1"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">اولویت</label>
              <select
                v-model="itemForm.priority"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option v-for="p in priorities" :key="p.value" :value="p.value">
                  {{ p.label }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">ساعت برآوردی</label>
              <input
                v-model.number="itemForm.estimatedHours"
                type="number"
                min="0"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">هزینه برآوردی</label>
              <input
                v-model.number="itemForm.estimatedCost"
                type="number"
                min="0"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <button
              type="button"
              class="rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
              @click="addItem"
            >
              + آیتم
            </button>
          </div>

          <!-- items table -->
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table class="min-w-full">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">دوره</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">تعداد</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">اولویت</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">ساعت</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">هزینه</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">وضعیت</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"></th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="it in (current?.items || [])"
                  :key="it._id"
                  class="border-t border-gray-200 dark:border-gray-800"
                >
                  <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    {{ it.courseCode }} — {{ it.courseTitle }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    {{ it.targetCount }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    {{ priorityLabel(it.priority) }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    {{ it.estimatedHours ?? '—' }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    {{ formatMoney(it.estimatedCost) }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm">
                    <select
                      :value="it.status"
                      class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                      @change="updateItemStatus(it, ($event.target as HTMLSelectElement).value as any)"
                    >
                      <option v-for="s in itemStatuses" :key="s.value" :value="s.value">
                        {{ s.label }}
                      </option>
                    </select>
                    <div class="mt-1 text-[11px] text-gray-400">
                      {{ itemStatusLabel(it.status) }}
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center text-sm">
                    <button class="text-rose-600 hover:underline" @click="removeItem(it)">حذف</button>
                  </td>
                </tr>

                <tr v-if="!(current?.items?.length)">
                  <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-500">
                    آیتمی نیست
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              type="button"
              class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              @click="showManage = false"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
