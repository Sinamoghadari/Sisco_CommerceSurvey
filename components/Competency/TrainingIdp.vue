<script setup lang="ts">
import { ref, computed } from 'vue'

type MainTab = 'plans' | 'gap'

interface IdpPlanItem {
  _id: string
  year: string
  title: string
  description?: string
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
  totalBudget?: number | null
  totalHours: number
  totalParticipants: number
  // فیلدهای اضافه شده از کد دوم
  employeeId?: {
    _id: string
    firstName: string
    lastName: string
    nationalId: string
  } | null
  startDate?: string
  endDate?: string
  supervisorName?: string
  achievedCount?: number
  itemCount?: number
  notes?: string
  items?: IdpActivityItem[]
}

interface IdpActivityItem {
  _id: string
  courseCode?: string
  courseTitle?: string
  targetCount: number
  priority: 'low' | 'medium' | 'high'
  estimatedHours: number | null
  estimatedCost: number | null
  status: 'planned' | 'in_progress' | 'done' | 'cancelled'
  // فیلدهای اضافه شده از کد دوم
  competencyId?: string | null
  currentLevelId?: string | null
  targetLevelId?: string | null
  developmentMethod?: string
  targetDate?: string
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

type PlanStatus = IdpPlanItem['status']
type ItemPriority = IdpActivityItem['priority']
type ItemStatus = IdpActivityItem['status']

const mainTab = ref<MainTab>('plans')
const filterStatus = ref('') // فیلتر وضعیت اضافه شده

const plans = ref<IdpPlanItem[]>([
  {
    _id: 'idp1',
    year: '۱۴۰۳',
    title: 'برنامه توسعه فردی - سال ۱۴۰۳',
    description: 'تمرکز بر توسعه مهارت‌های رهبری و تحلیل داده.',
    status: 'in_progress',
    totalBudget: 28000000,
    totalHours: 40,
    totalParticipants: 1,
    employeeId: {
      _id: 'emp1',
      firstName: 'آزاده',
      lastName: 'مهدوی',
      nationalId: '0012345678'
    },
    startDate: '۱۴۰۳/۰۱/۰۱',
    endDate: '۱۴۰۳/۱۲/۲۹',
    supervisorName: 'حمید علوی',
    achievedCount: 0,
    itemCount: 1,
    notes: 'یادداشت نمونه جهت تست ساختار برنامه توسعه فردی',
    items: [
      {
        _id: 'act1',
        courseCode: 'IDP-101',
        courseTitle: 'دوره رهبری تیم',
        targetCount: 1,
        priority: 'high',
        estimatedHours: 16,
        estimatedCost: 12000000,
        status: 'in_progress',
        competencyId: 'comp1',
        currentLevelId: 'lvl2',
        targetLevelId: 'lvl4',
        developmentMethod: 'course',
        targetDate: '۱۴۰۳/۰۶/۳۱'
      }
    ]
  }
])

const gapRows = ref<GapRow[]>([])

const meta = ref({
  priorities: [
    { value: 'low', label: 'کم' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'زیاد' }
  ],
  planStatuses: [
    { value: 'draft', label: 'پیش‌نویس' },
    { value: 'approved', label: 'تأیید شده' },
    { value: 'in_progress', label: 'در حال اجرا' },
    { value: 'completed', label: 'تکمیل شده' },
    { value: 'cancelled', label: 'لغو شده' }
  ],
  itemStatuses: [
    { value: 'planned', label: 'برنامه‌ریزی شده' },
    { value: 'in_progress', label: 'در حال اجرا' },
    { value: 'done', label: 'انجام شده' },
    { value: 'cancelled', label: 'لغو شده' }
  ],
  courses: [
    { _id: 'c1', code: 'IDP-101', title: 'دوره رهبری تیم' },
    { _id: 'c2', code: 'IDP-202', title: 'منتورینگ با مدیر ارشد' },
    { _id: 'c3', code: 'IDP-330', title: 'دوره تحلیل داده پیشرفته' }
  ],
  // متادیتاهای اضافه شده از کد دوم
  competencies: [
    { _id: 'comp1', code: 'COMP-01', title: 'رهبری تیم' },
    { _id: 'comp2', code: 'COMP-02', title: 'تحلیل داده پیشرفته' }
  ],
  levels: [
    { _id: 'lvl1', title: 'مبتدی (۱)' },
    { _id: 'lvl2', title: 'متوسط (۲)' },
    { _id: 'lvl3', title: 'پیشرفته (۳)' },
    { _id: 'lvl4', title: 'خبره (۴)' }
  ],
  methods: [
    { value: 'course', label: 'دوره آموزشی' },
    { value: 'mentoring', label: 'منتورینگ / کوچینگ' },
    { value: 'self_study', label: 'خودآموزی' }
  ]
})

const showPlanForm = ref(false)
const showManage = ref(false)
const current = ref<IdpPlanItem | null>(null)

// فیلدهای کمکی جستجوی کارمند
const empSearch = ref('')
const employeeResults = ref([
  { _id: 'emp1', firstName: 'آزاده', lastName: 'مهدوی', nationalId: '0012345678' }
])

const planForm = ref({
  _id: null as string | null,
  year: '۱۴۰۳',
  title: '',
  description: '',
  status: 'draft' as PlanStatus,
  // فیلدهای اضافه شده به فرم ایجاد/ویرایش
  employeeId: '',
  supervisorName: '',
  startDate: '',
  endDate: '',
  notes: ''
})

const itemForm = ref({
  courseId: '',
  targetCount: 1,
  priority: 'medium' as ItemPriority,
  estimatedHours: null as number | null,
  estimatedCost: null as number | null,
  // فیلدهای جدید در فرم مدیریت آیتم
  competencyId: '',
  currentLevelId: '',
  targetLevelId: '',
  developmentMethod: 'course',
  targetDate: ''
})

const courseOptions = computed(() =>
  meta.value.courses.map(c => ({
    value: c._id,
    label: `${c.code} — ${c.title}`
  }))
)

// آپشن‌های کامپیوتد برای فیلدهای جدید
const employeeOptions = computed(() =>
  employeeResults.value.map(e => ({
    value: e._id,
    label: `${e.firstName} ${e.lastName} — ${e.nationalId}`
  }))
)

const competencyOptions = computed(() =>
  meta.value.competencies.map(c => ({
    value: c._id,
    label: `${c.code} — ${c.title}`
  }))
)

const levelOptions = computed(() =>
  meta.value.levels.map(l => ({
    value: l._id,
    label: l.title
  }))
)

const formatMoney = (n: number | null | undefined) =>
  n == null ? '—' : Number(n).toLocaleString('fa-IR')

const planStatusLabel = (s: PlanStatus) =>
  meta.value.planStatuses.find(x => x.value === s)?.label || s

const priorityLabel = (s: ItemPriority) =>
  meta.value.priorities.find(x => x.value === s)?.label || s

const itemStatusLabel = (s: ItemStatus) =>
  meta.value.itemStatuses.find(x => x.value === s)?.label || s

const methodLabel = (s: string) =>
  meta.value.methods.find(x => x.value === s)?.label || s

const planBadge = (s: PlanStatus) =>
  ({
    draft: 'badge-warning bg-amber-100 text-amber-700',
    approved: 'badge-success bg-emerald-100 text-emerald-700',
    in_progress: 'badge-info bg-sky-100 text-sky-700',
    completed: 'badge-success bg-green-100 text-green-700',
    cancelled: 'badge-danger bg-rose-100 text-rose-700'
  }[s] || 'badge-info bg-gray-100 text-gray-700')

const loadGap = () => {
  mainTab.value = 'gap'
  gapRows.value = [
    {
      nationalId: '0012345678',
      employeeName: 'آزاده مهدوی',
      position: 'کارشناس ارشد داده',
      unit: 'تحلیل کسب‌وکار',
      competencyTitle: 'رهبری تیم',
      currentLevel: 2,
      requiredLevel: 4,
      status: 'نیاز به توسعه رهبری'
    }
  ]
}

// متد جستجوی کارمند (صرفاً فرانت‌اندی و لوکال)
const searchEmp = () => {
  if (!empSearch.value.trim()) return
  employeeResults.value = [
    { _id: 'emp1', firstName: 'آزاده', lastName: 'مهدوی', nationalId: '0012345678' }
  ].filter(e => 
    e.firstName.includes(empSearch.value) || 
    e.lastName.includes(empSearch.value) || 
    e.nationalId.includes(empSearch.value)
  )
}

const openCreate = () => {
  planForm.value = {
    _id: null,
    year: '۱۴۰۳',
    title: '',
    description: '',
    status: 'draft',
    employeeId: '',
    supervisorName: '',
    startDate: '',
    endDate: '',
    notes: ''
  }
  empSearch.value = ''
  showPlanForm.value = true
}

const editPlan = (p: IdpPlanItem) => {
  planForm.value = {
    _id: p._id,
    year: p.year,
    title: p.title,
    description: p.description || '',
    status: p.status,
    employeeId: p.employeeId?._id || '',
    supervisorName: p.supervisorName || '',
    startDate: p.startDate || '',
    endDate: p.endDate || '',
    notes: p.notes || ''
  }
  showPlanForm.value = true
}

const savePlan = () => {
  const selectedEmp = employeeResults.value.find(e => e._id === planForm.value.employeeId)
  const empData = selectedEmp ? { ...selectedEmp } : null

  if (planForm.value._id) {
    plans.value = plans.value.map(p =>
      p._id === planForm.value._id ? { 
        ...p, 
        ...planForm.value,
        employeeId: empData 
      } : p
    )
  } else {
    plans.value.unshift({
      ...planForm.value,
      _id: `idp_${Date.now()}`,
      totalBudget: 0,
      totalHours: 0,
      totalParticipants: 0,
      achievedCount: 0,
      itemCount: 0,
      employeeId: empData,
      items: []
    } as IdpPlanItem)
  }
  showPlanForm.value = false
}

const deletePlan = (p: IdpPlanItem) => {
  if (!confirm(`حذف برنامه سال ${p.year}؟`)) return
  plans.value = plans.value.filter(x => x._id !== p._id)
}

const openPlan = (p: IdpPlanItem) => {
  current.value = p
  itemForm.value = {
    courseId: '',
    targetCount: 1,
    priority: 'medium',
    estimatedHours: null,
    estimatedCost: null,
    competencyId: '',
    currentLevelId: '',
    targetLevelId: '',
    developmentMethod: 'course',
    targetDate: ''
  }
  showManage.value = true
}

const recalcCurrent = () => {
  if (!current.value) return
  const items = current.value.items || []
  current.value.totalHours = items.reduce((a, x) => a + (x.estimatedHours || 0), 0)
  current.value.totalParticipants = items.reduce((a, x) => a + (x.targetCount || 0), 0)
  current.value.totalBudget = items.reduce((a, x) => a + (x.estimatedCost || 0), 0)
  current.value.itemCount = items.length
  current.value.achievedCount = items.filter(x => x.status === 'done').length
}

const addItem = () => {
  if (!current.value) return
  if (!itemForm.value.targetLevelId) {
    alert('سطح هدف الزامی است')
    return
  }

  const course = meta.value.courses.find(c => c._id === itemForm.value.courseId)

  const it: IdpActivityItem = {
    _id: `act_${Date.now()}`,
    courseCode: course?.code,
    courseTitle: course?.title,
    ...itemForm.value,
    status: 'planned'
  }

  current.value.items = [...(current.value.items || []), it]
  recalcCurrent()
  
  // ریست فرم افزودن آیتم
  itemForm.value = {
    courseId: '',
    targetCount: 1,
    priority: 'medium',
    estimatedHours: null,
    estimatedCost: null,
    competencyId: '',
    currentLevelId: '',
    targetLevelId: '',
    developmentMethod: 'course',
    targetDate: ''
  }
}

const updateItemStatus = (it: IdpActivityItem, status: ItemStatus) => {
  it.status = status
  recalcCurrent()
}

const removeItem = (it: IdpActivityItem) => {
  if (!current.value?.items) return
  current.value.items = current.value.items.filter(x => x._id !== it._id)
  recalcCurrent()
}

const autoGenerate = () => {
  if (!current.value || !confirm('آیتم‌ها از گزارش شکاف تولید شوند؟')) return
  const course = meta.value.courses[0]
  const it: IdpActivityItem = {
    _id: `act_auto_${Date.now()}`,
    courseCode: course.code,
    courseTitle: course.title,
    targetCount: 1,
    priority: 'high',
    estimatedHours: 8,
    estimatedCost: 5000000,
    status: 'planned',
    competencyId: 'comp1',
    currentLevelId: 'lvl2',
    targetLevelId: 'lvl4',
    developmentMethod: 'course',
    targetDate: '۱۴۰۳/۰۸/۳۰'
  }
  current.value.items = [...(current.value.items || []), it]
  recalcCurrent()
}

const submitApproval = () => {
  if (!current.value) return
  current.value.status = 'approved'
}

// متد فیلتر کردن برنامه‌ها بر اساس وضعیت
const filteredPlans = computed(() => {
  if (!filterStatus.value) return plans.value
  return plans.value.filter(p => p.status === filterStatus.value)
})
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <!-- Header -->
    <div class="page-header flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-950 dark:text-white">برنامه توسعه فردی (IDP)</h1>
      <button class="btn btn-primary bg-green-600 text-white px-4 py-2 rounded" @click="openCreate">+ برنامه جدید</button>
    </div>

    <!-- Filters Section (اضافه شده از کد دوم) -->
    <div v-if="mainTab === 'plans'" class="filters flex gap-4 items-end mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div class="form-group flex flex-col gap-1 w-64">
        <label class="text-xs font-bold text-gray-500">وضعیت برنامه</label>
        <select v-model="filterStatus" class="form-control border p-2 rounded text-sm dark:bg-gray-700 dark:text-white">
          <option value="">همه وضعیت‌ها</option>
          <option v-for="s in meta.planStatuses" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs flex gap-2 border-b mb-4">
      <button 
        :class="['tab px-4 py-2 text-sm border-b-2 transition-colors', mainTab === 'plans' ? 'border-blue-600 text-blue-600 active' : 'border-transparent text-gray-500']" 
        @click="mainTab = 'plans'"
      >
        برنامه‌ها
      </button>
      <button 
        :class="['tab px-4 py-2 text-sm border-b-2 transition-colors', mainTab === 'gap' ? 'border-blue-600 text-blue-600 active' : 'border-transparent text-gray-500']" 
        @click="loadGap"
      >
        گزارش شکاف
      </button>
    </div>

    <!-- Plans Table (توسعه یافته با ستون‌های جدید) -->
    <div v-if="mainTab === 'plans'" class="card border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
      <p v-if="!filteredPlans.length" class="empty-state text-center text-gray-500 py-8">برنامه‌ای ثبت نشده است</p>
      <table v-else class="min-w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 text-center text-sm font-semibold">کارمند</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">عنوان</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">بازه</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">پیشرفت</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">سرپرست</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">بودجه / ساعت</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">وضعیت</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredPlans" :key="p._id" class="border-t border-gray-200 dark:border-gray-700">
            <td class="px-4 py-3 text-center text-sm">
              <div v-if="p.employeeId">
                <strong class="text-gray-900 dark:text-gray-100">{{ p.employeeId.firstName }} {{ p.employeeId.lastName }}</strong>
                <div class="text-xs text-gray-400 font-mono mt-0.5">{{ p.employeeId.nationalId }}</div>
              </div>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="px-4 py-3 text-center text-sm">{{ p.title }}</td>
            <td class="px-4 py-3 text-center text-sm text-xs font-mono">
              <span v-if="p.startDate && p.endDate">{{ p.startDate }} ← {{ p.endDate }}</span>
              <span v-else class="text-gray-400">سال {{ p.year }}</span>
            </td>
            <td class="px-4 py-3 text-center text-sm font-bold text-blue-600 dark:text-blue-400">
              {{ p.achievedCount || 0 }} / {{ p.itemCount || 0 }}
            </td>
            <td class="px-4 py-3 text-center text-sm">{{ p.supervisorName || '—' }}</td>
            <td class="px-4 py-3 text-center text-xs">
              <div>{{ formatMoney(p.totalBudget) }} ریال</div>
              <div class="text-gray-400 mt-0.5">{{ p.totalHours }} ساعت ({{ p.totalParticipants }} نفر)</div>
            </td>
            <td class="px-4 py-3 text-center text-sm">
              <span :class="['badge rounded-full px-2 py-0.5 text-xs', planBadge(p.status)]">
                {{ planStatusLabel(p.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-center text-sm whitespace-nowrap">
              <button class="btn btn-outline btn-sm text-blue-600 mx-1 border border-blue-600/30 px-2 py-1 rounded" @click="openPlan(p)">مدیریت</button>
              <button class="btn btn-outline btn-sm text-gray-600 mx-1 border border-gray-400/30 px-2 py-1 rounded" @click="editPlan(p)">ویرایش</button>
              <button class="btn btn-danger btn-sm text-rose-600 mx-1 border border-rose-600/30 px-2 py-1 rounded" @click="deletePlan(p)">حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Gap Table -->
    <div v-else class="card border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
      <p v-if="!gapRows.length" class="empty-state text-center text-gray-500 py-8">شکاف شایستگی یافت نشد</p>
      <table v-else class="min-w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 text-center text-sm font-semibold">کد ملی</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">نام</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">سمت</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">واحد</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">شایستگی</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">سطح فعلی</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">سطح مورد نیاز</th>
            <th class="px-4 py-2 text-center text-sm font-semibold">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in gapRows" :key="i" class="border-t border-gray-200 dark:border-gray-700">
            <td class="px-4 py-3 text-center text-sm">{{ r.nationalId }}</td>
            <td class="px-4 py-3 text-center text-sm">{{ r.employeeName }}</td>
            <td class="px-4 py-3 text-center text-sm">{{ r.position }}</td>
            <td class="px-4 py-3 text-center text-sm">{{ r.unit }}</td>
            <td class="px-4 py-3 text-center text-sm">{{ r.competencyTitle || '—' }}</td>
            <td class="px-4 py-3 text-center text-sm">{{ r.currentLevel }}</td>
            <td class="px-4 py-3 text-center text-sm">{{ r.requiredLevel }}</td>
            <td class="px-4 py-3 text-center text-sm">
              <span class="badge badge-warning bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">
                {{ r.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Plan Form Modal (توسعه یافته با بخش‌های اضافه شده) -->
    <div v-if="showPlanForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" @click.self="showPlanForm = false">
      <div class="modal w-full max-w-3xl bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div class="modal-header border-b px-6 py-4">
          <h3 class="font-bold text-gray-900 dark:text-white">{{ planForm._id ? 'ویرایش برنامه' : 'برنامه جدید' }}</h3>
        </div>
        <form @submit.prevent="savePlan" class="p-6">
          <!-- جستجوی کارمند (اضافه شده از کد دوم) -->
          <div class="form-group flex flex-col gap-1 mb-4">
            <label class="text-xs font-bold text-gray-500">جستجوی کارمند *</label>
            <div class="flex gap-2">
              <input v-model="empSearch" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white flex-1" placeholder="نام یا کد ملی..." @keyup.enter="searchEmp" />
              <button type="button" class="btn btn-outline border px-4 py-2 rounded text-sm text-gray-700 dark:text-gray-300" @click="searchEmp">جستجو</button>
            </div>
            <select v-model="planForm.employeeId" class="form-control border p-2 mt-1 rounded text-sm dark:bg-gray-800 dark:text-white" required>
              <option value="">— انتخاب کارمند —</option>
              <option v-for="emp in employeeOptions" :key="emp.value" :value="emp.value">{{ emp.label }}</option>
            </select>
          </div>

          <div class="form-row grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">سال شمسی *</label>
              <select v-model="planForm.year" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white" required>
                <option value="۱۴۰۳">۱۴۰۳</option>
                <option value="۱۴۰۴">۱۴۰۴</option>
              </select>
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">عنوان برنامه *</label>
              <input v-model="planForm.title" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white" required />
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">سرپرست</label>
              <input v-model="planForm.supervisorName" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white" />
            </div>
          </div>

          <!-- فیلدهای تاریخ و وضعیت جدید -->
          <div class="form-row grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">تاریخ شروع (شمسی)</label>
              <input v-model="planForm.startDate" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white" placeholder="مثال: ۱۴۰۳/۰۱/۰۱" />
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">تاریخ پایان (شمسی)</label>
              <input v-model="planForm.endDate" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white" placeholder="مثال: ۱۴۰۳/۱۲/۲۹" />
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">وضعیت</label>
              <select v-model="planForm.status" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white">
                <option v-for="s in meta.planStatuses" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>

          <div class="form-group flex flex-col gap-1 mb-4">
            <label class="text-xs font-bold text-gray-500">توضیحات</label>
            <textarea v-model="planForm.description" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white" rows="2" />
          </div>

          <div class="form-group flex flex-col gap-1 mb-6">
            <label class="text-xs font-bold text-gray-500">یادداشت‌ها</label>
            <textarea v-model="planForm.notes" class="form-control border p-2 rounded text-sm dark:bg-gray-800 dark:text-white" rows="2" />
          </div>

          <div class="modal-footer flex justify-end gap-2 border-t pt-4">
            <button type="button" class="btn btn-outline border px-4 py-2 rounded text-sm text-gray-700 dark:text-gray-300" @click="showPlanForm = false">انصراف</button>
            <button type="submit" class="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded text-sm">ذخیره</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manage Items Modal (توسعه یافته با فیلدهای جدید در ساختار فرم و جدول) -->
    <div v-if="showManage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" @click.self="showManage = false">
      <div class="modal w-full max-w-7xl bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div class="modal-header border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white">{{ current?.title }} ({{ current?.year }})</h3>
            <small class="text-xs text-gray-500" v-if="current?.employeeId">
              کارمند: {{ current.employeeId.firstName }} {{ current.employeeId.lastName }}
            </small>
          </div>
        </div>
        <div class="modal-body overflow-auto p-6">
          <div class="flex gap-2 mb-4 flex-wrap">
            <button class="btn btn-outline btn-sm border px-3 py-1 rounded text-xs text-gray-700 dark:text-gray-300" @click="autoGenerate">تولید خودکار از شکاف</button>
            <button class="btn btn-primary btn-sm bg-blue-600 text-white px-3 py-1 rounded text-xs" @click="submitApproval">ارسال برای تأیید</button>
          </div>
          
          <!-- فرم افزودن آیتم با فیلدهای توسعه یافته -->
          <div class="form-row grid grid-cols-1 md:grid-cols-8 gap-3 items-end mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">شایستگی</label>
              <select v-model="itemForm.competencyId" class="form-control border p-2 rounded text-sm dark:bg-gray-700 dark:text-white">
                <option value="">انتخاب کنید...</option>
                <option v-for="c in competencyOptions" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">سطح فعلی</label>
              <select v-model="itemForm.currentLevelId" class="form-control border p-2 rounded text-sm dark:bg-gray-700 dark:text-white">
                <option value="">انتخاب کنید...</option>
                <option v-for="l in levelOptions" :key="l.value" :value="l.value">{{ l.label }}</option>
              </select>
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">سطح هدف *</label>
              <select v-model="itemForm.targetLevelId" class="form-control border p-2 rounded text-sm dark:bg-gray-700 dark:text-white" required>
                <option value="">انتخاب کنید...</option>
                <option v-for="l in levelOptions" :key="l.value" :value="l.value">{{ l.label }}</option>
              </select>
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">روش توسعه</label>
              <select v-model="itemForm.developmentMethod" class="form-control border p-2 rounded text-sm dark:bg-gray-700 dark:text-white">
                <option v-for="m in meta.methods" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">دوره مرتبط</label>
              <select v-model="itemForm.courseId" class="form-control border p-2 rounded text-sm dark:bg-gray-700 dark:text-white">
                <option value="">انتخاب کنید...</option>
                <option v-for="c in courseOptions" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">تاریخ هدف</label>
              <input v-model="itemForm.targetDate" class="form-control border p-2 rounded text-sm dark:bg-gray-700 dark:text-white" placeholder="۱۴۰۳/۰۹/۳۰" />
            </div>
            <div class="form-group flex flex-col gap-1">
              <label class="text-xs font-bold text-gray-500">ساعت/هزینه برآوردی</label>
              <div class="flex gap-1">
                <input v-model.number="itemForm.estimatedHours" type="number" placeholder="ساعت" class="form-control border w-1/2 p-2 rounded text-xs dark:bg-gray-700 dark:text-white" />
                <input v-model.number="itemForm.estimatedCost" type="number" placeholder="هزینه" class="form-control border w-1/2 p-2 rounded text-xs dark:bg-gray-700 dark:text-white" />
              </div>
            </div>
            <button type="button" class="btn btn-primary bg-green-600 text-white px-4 py-2 rounded text-sm" @click="addItem">+ آیتم جدید</button>
          </div>

          <!-- جدول آیتم‌های توسعه یافته -->
          <table v-if="current?.items?.length" class="min-w-full border rounded-lg">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">شایستگی</th>
                <th class="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">سطح هدف</th>
                <th class="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">روش</th>
                <th class="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">دوره آموزشی</th>
                <th class="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">زمان/هزینه</th>
                <th class="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">وضعیت</th>
                <th class="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="it in current.items" :key="it._id" class="border-t border-gray-200 dark:border-gray-700">
                <td class="px-4 py-3 text-center text-sm">
                  {{ meta.competencies.find(c => c._id === it.competencyId)?.title || '—' }}
                </td>
                <td class="px-4 py-3 text-center text-sm text-xs">
                  <span>{{ meta.levels.find(l => l._id === it.currentLevelId)?.title || '—' }}</span>
                  <span class="mx-1">←</span>
                  <span class="font-bold text-blue-600 dark:text-blue-400">
                    {{ meta.levels.find(l => l._id === it.targetLevelId)?.title || '—' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center text-sm">
                  {{ it.developmentMethod ? methodLabel(it.developmentMethod) : '—' }}
                </td>
                <td class="px-4 py-3 text-center text-sm">
                  <span v-if="it.courseCode">{{ it.courseCode }} — {{ it.courseTitle }}</span>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-4 py-3 text-center text-xs">
                  <div>تاریخ: {{ it.targetDate || '—' }}</div>
                  <div class="text-gray-400 mt-0.5">
                    {{ it.estimatedHours ?? 0 }} ساعت | {{ formatMoney(it.estimatedCost) }} ریال
                  </div>
                </td>
                <td class="px-4 py-3 text-center text-sm">
                  <select :value="it.status" @change="updateItemStatus(it, ($event.target as HTMLSelectElement).value as ItemStatus)" class="border rounded text-xs p-1 dark:bg-gray-800 dark:text-white">
                    <option v-for="s in meta.itemStatuses" :key="s.value" :value="s.value">{{ s.label }}</option>
                  </select>
                </td>
                <td class="px-4 py-3 text-center text-sm">
                  <button class="btn btn-danger btn-sm text-rose-600 border border-rose-600/30 px-2 py-1 rounded" @click="removeItem(it)">حذف</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="empty-state text-center text-gray-500 py-8">آیتمی جهت نمایش ثبت نشده است.</p>
        </div>
        <div class="modal-footer border-t p-6 flex justify-end">
          <button type="button" class="btn btn-outline border px-4 py-2 rounded text-sm text-gray-700 dark:text-gray-300" @click="showManage = false">بستن</button>
        </div>
      </div>
    </div>
  </div>
</template>
