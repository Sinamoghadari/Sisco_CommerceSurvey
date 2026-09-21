<script setup lang="ts">
import { computed, ref } from 'vue'

interface SelectOption {
  value: string
  label: string
}

interface OfferingItem {
  _id: string
  code: string
  courseId: string
  courseTitle: string
  courseCode: string
  nature: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  instructorNames: string[]
  participantCount: number
  capacity: number | null
  totalCost: number
  status: string
}

interface OfferingForm {
  _id: string | null
  code: string
  courseId: string
  startDate: string
  endDate: string
  registrationDeadline: string
  startTime: string
  endTime: string
  location: string
  capacity: number | null
  status: string
  trainerIds: string[]
  costTuition: number
  costAccommodation: number
  costTicket: number
  otherCost: number
  notes: string
  enableLevel1: boolean
  enableLevel3: boolean
  enableLevel4: boolean
  enableInstructorFeedback: boolean
  evalQuestionnaireLevel1: string
  evalQuestionnaireLevel3: string
  evalQuestionnaireLevel4: string
  evalQuestionnaireInstructorFeedback: string
}

interface EmployeeItem {
  _id: string
  firstName: string
  lastName: string
  nationalId: string
}

interface ParticipantItem {
  _id: string
  employeeName: string
  nationalId: string
  status: string
  score: number | null
  attendanceHours: number | null
  certificateNumber: string
}

interface SessionItem {
  _id: string
  title: string
  sessionDate: string
  startTime: string
  endTime: string
}

interface ManageItem {
  _id: string
  code: string
  courseTitle: string
  participants: ParticipantItem[]
  sessions: SessionItem[]
}

interface SessionForm {
  title: string
  sessionDate: string
  startTime: string
  endTime: string
}

interface AttendanceRow {
  participantId: string
  name: string
  status: string
}

const rows = ref<OfferingItem[]>([
  {
    _id: 'o1',
    code: 'CL-001',
    courseId: 'c1',
    courseTitle: 'آشنایی با فرایندهای عملیاتی',
    courseCode: 'TR-001',
    nature: 'فنی',
    startDate: '1404-03-10',
    endDate: '1404-03-12',
    startTime: '08:00',
    endTime: '12:00',
    instructorNames: ['محمد رضایی', 'الهام کریمی'],
    participantCount: 12,
    capacity: 20,
    totalCost: 12000000,
    status: 'planned'
  },
  {
    _id: 'o2',
    code: 'CL-002',
    courseId: 'c2',
    courseTitle: 'مدیریت زمان و اولویت',
    courseCode: 'TR-002',
    nature: 'سازمانی',
    startDate: '1404-03-25',
    endDate: '1404-03-26',
    startTime: '09:00',
    endTime: '13:00',
    instructorNames: ['سارا احمدی'],
    participantCount: 8,
    capacity: 15,
    totalCost: 6500000,
    status: 'registration'
  }
])

const filters = ref({
  status: '',
  courseId: ''
})

const showForm = ref(false)
const showManage = ref(false)
const showAttendance = ref(false)
const saving = ref(false)
const manageTab = ref<'participants' | 'sessions'>('participants')

const empSearch = ref('')
const selectedEmps = ref<string[]>([])
const uploadDisabled = ref(false)

const statusOptions: SelectOption[] = [
  { value: 'planned', label: 'برنامه‌ریزی' },
  { value: 'registration', label: 'در حال ثبت‌نام' },
  { value: 'confirmed', label: 'تأیید شده' },
  { value: 'in_progress', label: 'در حال برگزاری' },
  { value: 'completed', label: 'پایان‌یافته' },
  { value: 'cancelled', label: 'لغو شده' }
]

const participantStatusOptions: SelectOption[] = [
  { value: 'registered', label: 'ثبت‌نام شده' },
  { value: 'attended', label: 'شرکت کرده' },
  { value: 'passed', label: 'قبول' },
  { value: 'failed', label: 'مردود' },
  { value: 'cancelled', label: 'لغو شده' }
]

const attendanceStatusOptions: SelectOption[] = [
  { value: 'present', label: 'حاضر' },
  { value: 'absent', label: 'غایب' },
  { value: 'excused', label: 'موجه' }
]

const courseOptions: SelectOption[] = [
  { value: 'c1', label: 'TR-001 — آشنایی با فرایندهای عملیاتی' },
  { value: 'c2', label: 'TR-002 — مدیریت زمان و اولویت' },
  { value: 'c3', label: 'TR-003 — ایمنی محیط کار' }
]

const trainerOptions: SelectOption[] = [
  { value: 't1', label: 'محمد رضایی — فرایند' },
  { value: 't2', label: 'الهام کریمی — آموزش' },
  { value: 't3', label: 'سارا احمدی — توسعه فردی' }
]

const level1Questionnaires: SelectOption[] = [
  { value: 'q1', label: 'پرسشنامه رضایت عمومی' },
  { value: 'q2', label: 'ارزیابی رضایت کلاس' }
]

const level3Questionnaires: SelectOption[] = [
  { value: 'q3', label: 'ارزیابی رفتار شغلی' }
]

const level4Questionnaires: SelectOption[] = [
  { value: 'q4', label: 'ارزیابی نتایج عملکرد' }
]

const instructorFeedbackQuestionnaires: SelectOption[] = [
  { value: 'q5', label: 'بازخورد مدرس' }
]

const blankForm = (): OfferingForm => ({
  _id: null,
  code: '',
  courseId: '',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  startTime: '',
  endTime: '',
  location: '',
  capacity: 20,
  status: 'planned',
  trainerIds: [],
  costTuition: 0,
  costAccommodation: 0,
  costTicket: 0,
  otherCost: 0,
  notes: '',
  enableLevel1: true,
  enableLevel3: false,
  enableLevel4: false,
  enableInstructorFeedback: false,
  evalQuestionnaireLevel1: '',
  evalQuestionnaireLevel3: '',
  evalQuestionnaireLevel4: '',
  evalQuestionnaireInstructorFeedback: ''
})

const form = ref<OfferingForm>(blankForm())

const empResults = ref<EmployeeItem[]>([
  { _id: 'e1', firstName: 'علی', lastName: 'مرادی', nationalId: '0012345678' },
  { _id: 'e2', firstName: 'مریم', lastName: 'حسینی', nationalId: '0012345679' },
  { _id: 'e3', firstName: 'حسن', lastName: 'اکبری', nationalId: '0012345680' }
])

const manage = ref<ManageItem | null>(null)

const sessionForm = ref<SessionForm>({
  title: '',
  sessionDate: '',
  startTime: '',
  endTime: ''
})

const attendanceSession = ref<SessionItem | null>(null)

const attendanceRows = ref<AttendanceRow[]>([])

const filteredRows = computed(() => {
  return rows.value.filter((row) => {
    const statusMatch = !filters.value.status || row.status === filters.value.status
    const courseMatch = !filters.value.courseId || row.courseId === filters.value.courseId
    return statusMatch && courseMatch
  })
})

const formatMoney = (value: number) => {
  return Number(value || 0).toLocaleString('fa-IR')
}

const fmtDate = (value: string) => value || '—'

const statusLabel = (status: string) => {
  return statusOptions.find((item) => item.value === status)?.label || status
}

const statusBadgeClass = (status: string) => {
  if (status === 'planned') return 'bg-sky-100 text-sky-700'
  if (status === 'confirmed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'in_progress') return 'bg-amber-100 text-amber-700'
  if (status === 'completed') return 'bg-green-100 text-green-700'
  if (status === 'cancelled') return 'bg-rose-100 text-rose-700'
  return 'bg-gray-100 text-gray-700'
}

const questionnaireOptions = (level: 'level1' | 'level3' | 'level4' | 'instructor_feedback') => {
  if (level === 'level1') return level1Questionnaires
  if (level === 'level3') return level3Questionnaires
  if (level === 'level4') return level4Questionnaires
  return instructorFeedbackQuestionnaires
}

const openCreate = () => {
  form.value = blankForm()
  showForm.value = true
}

const openEdit = (item: OfferingItem) => {
  form.value = {
    ...blankForm(),
    _id: item._id,
    code: item.code,
    courseId: item.courseId,
    startDate: item.startDate,
    endDate: item.endDate,
    startTime: item.startTime,
    endTime: item.endTime,
    status: item.status,
    capacity: item.capacity
  }
  showForm.value = true
}

const remove = () => {
  // UI only
}

const saveOffering = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    showForm.value = false
  }, 400)
}

const openManage = (item: OfferingItem) => {
  manage.value = {
    _id: item._id,
    code: item.code,
    courseTitle: item.courseTitle,
    participants: [
      {
        _id: 'p1',
        employeeName: 'علی مرادی',
        nationalId: '0012345678',
        status: 'registered',
        score: 18,
        attendanceHours: 10,
        certificateNumber: 'CERT-001'
      },
      {
        _id: 'p2',
        employeeName: 'مریم حسینی',
        nationalId: '0012345679',
        status: 'attended',
        score: 16,
        attendanceHours: 8,
        certificateNumber: 'CERT-002'
      }
    ],
    sessions: [
      {
        _id: 's1',
        title: 'جلسه اول',
        sessionDate: '1404-03-10',
        startTime: '08:00',
        endTime: '12:00'
      },
      {
        _id: 's2',
        title: 'جلسه دوم',
        sessionDate: '1404-03-11',
        startTime: '08:00',
        endTime: '12:00'
      }
    ]
  }

  manageTab.value = 'participants'
  selectedEmps.value = []
  empSearch.value = ''
  sessionForm.value = { title: '', sessionDate: '', startTime: '', endTime: '' }
  showManage.value = true
}

const registerSelected = () => {
  selectedEmps.value = []
}

const updateParticipant = (participant: ParticipantItem, field: keyof ParticipantItem, value: string | number) => {
  ;(participant as any)[field] = value
}

const unregister = (participant: ParticipantItem) => {
  participant.status = 'cancelled'
}

const saveSession = () => {
  if (!manage.value) return
  if (!sessionForm.value.sessionDate) return

  manage.value.sessions.push({
    _id: Math.random().toString(36).slice(2),
    title: sessionForm.value.title || 'جلسه',
    sessionDate: sessionForm.value.sessionDate,
    startTime: sessionForm.value.startTime,
    endTime: sessionForm.value.endTime
  })

  sessionForm.value = {
    title: '',
    sessionDate: '',
    startTime: '',
    endTime: ''
  }
}

const deleteSession = (session: SessionItem) => {
  if (!manage.value) return
  manage.value.sessions = manage.value.sessions.filter((item) => item._id !== session._id)
}

const openAttendance = (session: SessionItem) => {
  attendanceSession.value = session
  attendanceRows.value =
    manage.value?.participants
      .filter((item) => item.status !== 'cancelled')
      .map((item) => ({
        participantId: item._id,
        name: item.employeeName,
        status: 'present'
      })) || []
  showAttendance.value = true
}

const saveAttendance = () => {
  showAttendance.value = false
}
</script>

<template>
  <div class="border-x border-b bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <div class="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">تقویم برگزاری کلاس‌ها</h2>
      </div>
      <button
        @click="openCreate"
        class="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-all hover:bg-green-700"
      >
        + برگزاری جدید
      </button>
    </div>

    <div class="mb-4 flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
      <div class="flex min-w-[180px] flex-col gap-1">
        <label class="text-xs font-bold text-gray-500">وضعیت</label>
        <select
          v-model="filters.status"
          class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">همه</option>
          <option v-for="item in statusOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </div>

      <div class="flex min-w-[260px] flex-col gap-1">
        <label class="text-xs font-bold text-gray-500">دوره</label>
        <select
          v-model="filters.courseId"
          class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">همه</option>
          <option v-for="item in courseOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </div>

      <button class="mt-auto rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100">
        اعمال
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table class="min-w-full">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">کد</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">دوره</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">ماهیت</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">شروع</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">پایان</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">ساعت</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">مدرس(ها)</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">ظرفیت</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">هزینه</th>
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
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.code }}</td>

            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              <div class="font-semibold">{{ item.courseTitle }}</div>
              <div class="text-xs text-gray-500">{{ item.courseCode }}</div>
            </td>

            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ item.nature }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ fmtDate(item.startDate) }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">{{ fmtDate(item.endDate) }}</td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ item.startTime || '—' }}<span v-if="item.endTime">–{{ item.endTime }}</span>
            </td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ item.instructorNames.length ? item.instructorNames.join('، ') : '—' }}
            </td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ item.participantCount }} / {{ item.capacity ?? '∞' }}
            </td>
            <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
              {{ formatMoney(item.totalCost) }}
            </td>
            <td class="px-4 py-3 text-center text-sm">
              <span
                :class="[
                  'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                  statusBadgeClass(item.status)
                ]"
              >
                {{ statusLabel(item.status) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-center text-sm">
              <div class="flex justify-center gap-2">
                <button @click="openEdit(item)" class="text-blue-600 hover:underline">ویرایش</button>
                <button @click="openManage(item)" class="text-indigo-600 hover:underline">مدیریت</button>
                <button @click="remove(item)" class="text-red-600 hover:underline">حذف</button>
              </div>
            </td>
          </tr>

          <tr v-if="!filteredRows.length">
            <td colspan="11" class="px-4 py-8 text-center text-sm text-gray-500">
              برگزاری ثبت نشده است
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- فرم برگزاری -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="showForm = false"
    >
      <div class="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b px-6 py-4 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ form._id ? 'ویرایش برگزاری' : 'برگزاری جدید' }}
            </h3>
            <span
              v-if="form.code"
              class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ form.code }}
            </span>
          </div>
          <button
            @click="showForm = false"
            class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            بستن
          </button>
        </div>

        <form @submit.prevent="saveOffering" class="overflow-auto p-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">دوره *</label>
              <select
                v-model="form.courseId"
                :disabled="!!form._id"
                required
                class="rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              >
                <option value="">— انتخاب دوره تأییدشده —</option>
                <option v-for="item in courseOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">وضعیت</label>
              <select
                v-model="form.status"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option v-for="item in statusOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">شروع *</label>
              <input
                v-model="form.startDate"
                type="date"
                required
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">پایان *</label>
              <input
                v-model="form.endDate"
                type="date"
                required
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">مهلت ثبت‌نام</label>
              <input
                v-model="form.registrationDeadline"
                type="date"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">ساعت شروع</label>
              <input
                v-model="form.startTime"
                type="time"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">ساعت پایان</label>
              <input
                v-model="form.endTime"
                type="time"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">مکان</label>
              <input
                v-model="form.location"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">ظرفیت</label>
              <input
                v-model.number="form.capacity"
                type="number"
                min="0"
                class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">مدرسین</label>
            <select
              v-model="form.trainerIds"
              multiple
              class="min-h-[120px] rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option v-for="item in trainerOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>

          <h4 class="mb-3 mt-6 text-base font-bold text-gray-900 dark:text-white">هزینه‌ها</h4>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">حق‌التدریس</label>
              <input v-model.number="form.costTuition" type="number" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">اسکان</label>
              <input v-model.number="form.costAccommodation" type="number" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">ایاب‌وذهاب</label>
              <input v-model.number="form.costTicket" type="number" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">سایر</label>
              <input v-model.number="form.otherCost" type="number" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            </div>
          </div>

          <h4 class="mb-3 mt-6 text-base font-bold text-gray-900 dark:text-white">پرسشنامه‌های ارزیابی</h4>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <input v-model="form.enableLevel1" type="checkbox" />
                L1 رضایت
              </label>
              <select
                v-model="form.evalQuestionnaireLevel1"
                :disabled="!form.enableLevel1"
                class="w-full rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              >
                <option value="">انتخاب کنید</option>
                <option v-for="item in questionnaireOptions('level1')" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>

            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <input v-model="form.enableLevel3" type="checkbox" />
                L3 رفتار
              </label>
              <select
                v-model="form.evalQuestionnaireLevel3"
                :disabled="!form.enableLevel3"
                class="w-full rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              >
                <option value="">انتخاب کنید</option>
                <option v-for="item in questionnaireOptions('level3')" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>

            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <input v-model="form.enableLevel4" type="checkbox" />
                L4 نتایج
              </label>
              <select
                v-model="form.evalQuestionnaireLevel4"
                :disabled="!form.enableLevel4"
                class="w-full rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              >
                <option value="">انتخاب کنید</option>
                <option v-for="item in questionnaireOptions('level4')" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>

            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <input v-model="form.enableInstructorFeedback" type="checkbox" />
                بازخورد مدرس
              </label>
              <select
                v-model="form.evalQuestionnaireInstructorFeedback"
                :disabled="!form.enableInstructorFeedback"
                class="w-full rounded border border-gray-300 bg-white p-2 text-sm disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:disabled:bg-gray-800"
              >
                <option value="">انتخاب کنید</option>
                <option
                  v-for="item in questionnaireOptions('instructor_feedback')"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">یادداشت</label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div class="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-gray-800">
            <button
              type="button"
              @click="showForm = false"
              class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
            >
              انصراف
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-60"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- مدیریت شرکت‌کننده / جلسه -->
    <div
      v-if="showManage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="showManage = false"
    >
      <div class="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b px-6 py-4 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            مدیریت {{ manage?.code }} — {{ manage?.courseTitle }}
          </h3>
        </div>

        <div class="flex border-b dark:border-gray-800">
          <button
            type="button"
            @click="manageTab = 'participants'"
            class="border-b-2 px-4 py-3 text-sm font-medium"
            :class="manageTab === 'participants' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
          >
            شرکت‌کنندگان
          </button>
          <button
            type="button"
            @click="manageTab = 'sessions'"
            class="border-b-2 px-4 py-3 text-sm font-medium"
            :class="manageTab === 'sessions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
          >
            جلسات
          </button>
        </div>

        <div class="overflow-auto p-6">
          <div v-show="manageTab === 'participants'">
            <div class="mb-4 flex flex-wrap items-end gap-3">
              <div class="min-w-[240px] flex-1">
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  جستجوی کارمند
                </label>
                <input
                  v-model="empSearch"
                  class="w-full rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  placeholder="نام یا کد ملی..."
                />
              </div>

              <button
                type="button"
                class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              >
                جستجو
              </button>

              <button
                type="button"
                :disabled="!selectedEmps.length"
                @click="registerSelected"
                class="rounded bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                ثبت‌نام انتخاب‌شده‌ها
              </button>
            </div>

            <div
              v-if="empResults.length"
              class="mb-4 max-h-40 overflow-auto rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <label
                v-for="employee in empResults"
                :key="employee._id"
                class="flex items-center gap-2 py-1 text-sm text-gray-700 dark:text-gray-300"
              >
                <input v-model="selectedEmps" type="checkbox" :value="employee._id" />
                {{ employee.firstName }} {{ employee.lastName }} — {{ employee.nationalId }}
              </label>
            </div>

            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <table v-if="manage?.participants?.length" class="min-w-full">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-4 py-3 text-center text-sm">نام</th>
                    <th class="px-4 py-3 text-center text-sm">کد ملی</th>
                    <th class="px-4 py-3 text-center text-sm">وضعیت</th>
                    <th class="px-4 py-3 text-center text-sm">نمره</th>
                    <th class="px-4 py-3 text-center text-sm">ساعات حضور</th>
                    <th class="px-4 py-3 text-center text-sm">مدرک</th>
                    <th class="px-4 py-3 text-center text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="participant in manage.participants"
                    :key="participant._id"
                    class="border-t border-gray-200 dark:border-gray-800"
                  >
                    <td class="px-4 py-3 text-center text-sm">{{ participant.employeeName }}</td>
                    <td class="px-4 py-3 text-center text-sm">{{ participant.nationalId }}</td>
                    <td class="px-4 py-3 text-center text-sm">
                      <select
                        :value="participant.status"
                        @change="updateParticipant(participant, 'status', ($event.target as HTMLSelectElement).value)"
                        class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                      >
                        <option v-for="item in participantStatusOptions" :key="item.value" :value="item.value">
                          {{ item.label }}
                        </option>
                      </select>
                    </td>
                    <td class="px-4 py-3 text-center text-sm">
                      <input
                        :value="participant.score ?? ''"
                        type="number"
                        class="w-20 rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                        @change="updateParticipant(participant, 'score', Number(($event.target as HTMLInputElement).value))"
                      />
                    </td>
                    <td class="px-4 py-3 text-center text-sm">
                      <input
                        :value="participant.attendanceHours ?? ''"
                        type="number"
                        class="w-20 rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                        @change="updateParticipant(participant, 'attendanceHours', Number(($event.target as HTMLInputElement).value))"
                      />
                    </td>
                    <td class="px-4 py-3 text-center text-sm">
                      <input
                        :value="participant.certificateNumber"
                        class="w-28 rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                        @change="updateParticipant(participant, 'certificateNumber', ($event.target as HTMLInputElement).value)"
                      />
                    </td>
                    <td class="px-4 py-3 text-center text-sm">
                      <button
                        v-if="participant.status !== 'cancelled'"
                        type="button"
                        @click="unregister(participant)"
                        class="text-red-600 hover:underline"
                      >
                        لغو
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p v-else class="px-4 py-8 text-center text-sm text-gray-500">شرکت‌کننده‌ای نیست</p>
            </div>
          </div>

          <div v-show="manageTab === 'sessions'">
            <div class="mb-4 grid grid-cols-1 items-end gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">عنوان</label>
                <input
                  v-model="sessionForm.title"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">تاریخ *</label>
                <input
                  v-model="sessionForm.sessionDate"
                  type="date"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">از</label>
                <input
                  v-model="sessionForm.startTime"
                  type="time"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">تا</label>
                <input
                  v-model="sessionForm.endTime"
                  type="time"
                  class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div>
                <button
                  type="button"
                  @click="saveSession"
                  class="w-full rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                >
                  + جلسه
                </button>
              </div>
            </div>

            <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <table v-if="manage?.sessions?.length" class="min-w-full">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-4 py-3 text-center text-sm">عنوان</th>
                    <th class="px-4 py-3 text-center text-sm">تاریخ</th>
                    <th class="px-4 py-3 text-center text-sm">ساعت</th>
                    <th class="px-4 py-3 text-center text-sm">حضور</th>
                    <th class="px-4 py-3 text-center text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="session in manage.sessions"
                    :key="session._id"
                    class="border-t border-gray-200 dark:border-gray-800"
                  >
                    <td class="px-4 py-3 text-center text-sm">{{ session.title || 'جلسه' }}</td>
                    <td class="px-4 py-3 text-center text-sm">{{ fmtDate(session.sessionDate) }}</td>
                    <td class="px-4 py-3 text-center text-sm">{{ session.startTime }}–{{ session.endTime }}</td>
                    <td class="px-4 py-3 text-center text-sm">
                      <button
                        type="button"
                        @click="openAttendance(session)"
                        class="text-blue-600 hover:underline"
                      >
                        حضور و غیاب
                      </button>
                    </td>
                    <td class="px-4 py-3 text-center text-sm">
                      <button
                        type="button"
                        @click="deleteSession(session)"
                        class="text-red-600 hover:underline"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p v-else class="px-4 py-8 text-center text-sm text-gray-500">جلسه‌ای ثبت نشده</p>
            </div>
          </div>
        </div>

        <div class="border-t px-6 py-4 dark:border-gray-800">
          <div class="flex justify-end">
            <button
              type="button"
              @click="showManage = false"
              class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- حضور و غیاب -->
    <div
      v-if="showAttendance"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="showAttendance = false"
    >
      <div class="w-full max-w-2xl rounded-lg border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b px-6 py-4 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            حضور و غیاب — {{ attendanceSession?.title || 'جلسه' }}
          </h3>
        </div>

        <div class="max-h-[60vh] overflow-auto px-6 py-4">
          <div
            v-for="row in attendanceRows"
            :key="row.participantId"
            class="flex items-center justify-between border-b border-gray-200 py-3 dark:border-gray-800"
          >
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ row.name }}</span>
            <select
              v-model="row.status"
              class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option v-for="item in attendanceStatusOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t px-6 py-4 dark:border-gray-800">
          <button
            type="button"
            @click="showAttendance = false"
            class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
          >
            انصراف
          </button>
          <button
            type="button"
            @click="saveAttendance"
            class="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
