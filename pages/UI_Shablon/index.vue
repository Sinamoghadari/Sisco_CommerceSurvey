<script setup lang="ts">
import Swal from 'sweetalert2'
import { DatePicker } from 'v-calendars'
import { ref, onMounted } from 'vue'
import { PersonelDependentApi } from '~/composables/PersonelDependent/PersonelDependentApi'
import DocumentUploadField from '~/components/PersonelDependent/DocumentUploadField.vue'

const needsResubmissionStatus = {
  value: 'needs_resubmission',
  label: 'نیاز بررسی و ارسال مجدد',
} as const

type MemberStatus = 'pending' | 'approved' | 'rejected' | typeof needsResubmissionStatus.value | ''

definePageMeta({
  auth: true,
  title: 'اطلاعات خانواده پرسنل',
})

type SpouseItem = {
  firstName: string
  lastName: string
  nationalId: string
  birthDate: string | Date | null
  birthPlace: string
  issuePlace: string
  mobile: string
  is_mobile_authorized: boolean
  education: string
  job: string
  documents: {
    nationalCard: string | null
    birthCertPage1: string | null
    birthCertPage2: string | null
  }
  member_id: string
  status: MemberStatus
  manager_comment: string
  reviewed_at: string | null
  reviewed_by_national_id: string
}

type ChildItem = {
  firstName: string
  lastName: string
  nationalId: string
  birthDate: string | Date | null
  birthPlace: string
  issuePlace: string
  gender: string
  school: string
  documents: {
    parentBirthCertPage2: string | null
    childBirthCertPage1: string | null
  }
  member_id: string
  status: MemberStatus
  manager_comment: string
  reviewed_at: string | null
  reviewed_by_national_id: string
}

const masks = ref({ input: 'YYYY-MM-DD' })
const showInfoModal = ref(false)
const tabs = ['همسر', 'فرزندان']
const activeTab = ref('همسر')
const loading = ref(false)
const gender = ref(1)
const accessDenied = ref(false)
const accessMessage = ref('این بخش از خارج از سازمان در دسترس نیست.')

const showSpouseModal = ref(false)
const showChildModal = ref(false)
const editingSpouseIndex = ref<number | null>(null)
const editingChildIndex = ref<number | null>(null)
const activeUploads = ref<Record<string, boolean>>({})
const spouseUploading = computed(() => Object.entries(activeUploads.value).some(([key, active]) => key.startsWith('spouse:') && active))
const childUploading = computed(() => Object.entries(activeUploads.value).some(([key, active]) => key.startsWith('child:') && active))

function setUploadState(key: string, active: boolean) {
  activeUploads.value[key] = active
}

function closeSpouseModal() {
  if (!loading.value && !spouseUploading.value)
    showSpouseModal.value = false
}

function closeChildModal() {
  if (!loading.value && !childUploading.value)
    showChildModal.value = false
}

const { UpdatePersonelDependent, GetPersonelDependent } = PersonelDependentApi()

const form = ref<{ spouses: SpouseItem[], children: ChildItem[] }>({
  spouses: [],
  children: [],
})

const educationOptions = [
  { value: 'notselected', label: 'انتخاب نشده' },
  { value: 'illiterate', label: 'بی‌سواد' },
  { value: 'primary', label: 'ابتدایی' },
  { value: 'middle', label: 'سیکل' },
  { value: 'diploma', label: 'دیپلم' },
  { value: 'associate', label: 'کاردانی' },
  { value: 'bachelor', label: 'کارشناسی' },
  { value: 'master', label: 'کارشناسی ارشد' },
  { value: 'phd', label: 'دکتری' },
]

const tempSpouse = ref<SpouseItem>(getEmptySpouse())
const tempChild = ref<ChildItem>(getEmptyChild())

function getEmptySpouse(): SpouseItem {
  return {
    firstName: '',
    lastName: '',
    nationalId: '',
    birthDate: '',
    birthPlace: '',
    issuePlace: '',
    mobile: '',
    is_mobile_authorized: false,
    education: 'notselected',
    job: '',
    documents: {
      nationalCard: null,
      birthCertPage1: null,
      birthCertPage2: null,
    },
    member_id: '',
    status: '',
    manager_comment: '',
    reviewed_at: null,
    reviewed_by_national_id: '',
  }
}

function getEmptyChild(): ChildItem {
  return {
    firstName: '',
    lastName: '',
    nationalId: '',
    birthDate: '',
    birthPlace: '',
    issuePlace: '',
    gender: '',
    school: '',
    documents: {
      parentBirthCertPage2: null,
      childBirthCertPage1: null,
    },
    member_id: '',
    status: '',
    manager_comment: '',
    reviewed_at: null,
    reviewed_by_national_id: '',
  }
}

function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function normalizeSpouse(spouse: Partial<SpouseItem>): SpouseItem {
  return {
    ...getEmptySpouse(),
    ...spouse,
    documents: {
      ...getEmptySpouse().documents,
      ...(spouse?.documents || {}),
    },
  }
}

function normalizeChild(child: Partial<ChildItem>): ChildItem {
  return {
    ...getEmptyChild(),
    ...child,
    documents: {
      ...getEmptyChild().documents,
      ...(child?.documents || {}),
    },
  }
}

function toJalali(date: string | Date | null) {
  if (!date)
    return '-'

  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date))
  }
  catch {
    return String(date)
  }
}

function validateNationalCode(code: string) {
  const normalized = String(code).trim()
  if (!/^\d{10}$/.test(normalized))
    return false
  if (/^(\d)\1{9}$/.test(normalized))
    return false

  const check = Number.parseInt(normalized[9])
  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(normalized[i]) * (10 - i)
  }

  const remainder = sum % 11
  return remainder < 2 ? check === remainder : check === 11 - remainder
}

function validateMobile(mobile: string) {
  return /^09\d{9}$/.test(String(mobile || '').trim())
}

function validateBirthDate(value: unknown) {
  if (!(value instanceof Date) && typeof value !== 'string')
    return false

  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(value.trim())
    if (!match)
      return false
    const [, year, month, day] = match.map(Number)
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth)
      return false
  }

  const date = new Date(value)
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)
  return !Number.isNaN(date.getTime()) && date.getFullYear() > 0 && date <= endOfToday
}

function normalizeDigits(value: string) {
  return String(value || '').replace(/\D/g, '').trim()
}

function findDuplicateNationalId(
  nationalId: string,
  options: {
    spouseIndex?: number | null
    childIndex?: number | null
  } = {},
) {
  const targetNationalId = normalizeDigits(nationalId)
  if (!targetNationalId) {
    return null
  }

  const duplicateSpouse = form.value.spouses.find((item, index) =>
    index !== options.spouseIndex
    && normalizeDigits(item.nationalId) === targetNationalId,
  )

  if (duplicateSpouse) {
    return 'کد ملی واردشده قبلا در بخش همسر ثبت شده است.'
  }

  const duplicateChild = form.value.children.find((item, index) =>
    index !== options.childIndex
    && normalizeDigits(item.nationalId) === targetNationalId,
  )

  if (duplicateChild) {
    return 'کد ملی واردشده قبلا در بخش فرزندان ثبت شده است.'
  }

  return null
}

function findDuplicateMobile(
  mobile: string,
  options: {
    spouseIndex?: number | null
    childIndex?: number | null
  } = {},
) {
  const targetMobile = normalizeDigits(mobile)
  if (!targetMobile) {
    return null
  }

  const duplicateSpouse = form.value.spouses.find((item, index) =>
    index !== options.spouseIndex
    && normalizeDigits(item.mobile) === targetMobile,
  )

  if (duplicateSpouse) {
    return 'شماره موبایل واردشده قبلا در بخش همسر ثبت شده است.'
  }

  const duplicateChild = form.value.children.find((item: any, index: number) =>
    index !== options.childIndex
    && normalizeDigits(item.mobile) === targetMobile,
  )

  if (duplicateChild) {
    return 'شماره موبایل واردشده قبلا در بخش فرزندان ثبت شده است.'
  }

  return null
}

function getMemberStatus(member: { status?: MemberStatus }) {
  return String(member?.status || 'pending').trim() || 'pending'
}

function getMemberStatusLabel(status: string) {
  switch (status) {
    case needsResubmissionStatus.value:
      return needsResubmissionStatus.label
    case 'approved':
      return 'تایید شده'
    case 'rejected':
      return 'رد شده'
    default:
      return 'در انتظار بررسی'
  }
}

function getMemberStatusClass(status: string) {
  switch (status) {
    case needsResubmissionStatus.value:
      return 'bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:ring-sky-900/40'
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/40'
    case 'rejected':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900/40'
    default:
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900/40'
  }
}

function canEditMember(member: { status?: MemberStatus }) {
  return ['rejected', needsResubmissionStatus.value].includes(getMemberStatus(member))
}

function canDeleteMember(member: { status?: MemberStatus }) {
  return getMemberStatus(member) === 'rejected'
}

function getEducationLabel(value: string) {
  const found = educationOptions.find(option => option.value === value)
  return found?.label || 'نامشخص'
}

function getChildGenderLabel(value: string) {
  if (value === 'مرد')
    return 'پسر'
  if (value === 'زن')
    return 'دختر'
  return value || 'نامشخص'
}

async function showLockedMemberMessage() {
  await Swal.fire(
    'امکان ویرایش یا حذف وجود ندارد',
    'این مورد تایید شده یا در حال بررسی است. در صورت نیاز باید با واحد سرمایه انسانی تماس بگیرید.',
    'info',
  )
}

async function loadPersonelDependent() {
  loading.value = true
  const { response } = await GetPersonelDependent()

  if (response?.result === 'NOK') {
    accessDenied.value = true
    accessMessage.value = response?.msg_description || 'این بخش از خارج از سازمان در دسترس نیست.'
    form.value.spouses = []
    form.value.children = []
    loading.value = false
    return
  }

  accessDenied.value = false

  if (response?.result === 'OK' && response.data) {
    form.value.spouses = Array.isArray(response.data.spouses) ? response.data.spouses.map((item: Partial<SpouseItem>) => normalizeSpouse(item)) : []
    form.value.children = Array.isArray(response.data.children) ? response.data.children.map((item: Partial<ChildItem>) => normalizeChild(item)) : []
    gender.value = response.gender
  }
  else {
    form.value.spouses = []
    form.value.children = []
  }

  loading.value = false
}

async function persistDependent(nextState: { spouses: SpouseItem[], children: ChildItem[] }) {
  loading.value = true

  Swal.fire({
    title: 'لطفاً صبر کنید',
    text: 'در حال ثبت اطلاعات',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  const { response } = await UpdatePersonelDependent(cloneDeep(nextState))

  Swal.close()

  if (response?.result !== 'OK') {
    loading.value = false
    await Swal.fire('خطا', response?.msg_description || 'ثبت اطلاعات با خطا مواجه شد', 'error')
    return false
  }

  await loadPersonelDependent()
  loading.value = false
  return true
}

function openAddSpouseModal() {
  if (gender.value === 0 && form.value.spouses.length >= 1) {
    return Swal.fire('خطا', 'برای خانم‌ها فقط یک همسر قابل ثبت است', 'warning')
  }

  editingSpouseIndex.value = null
  tempSpouse.value = getEmptySpouse()
  showSpouseModal.value = true
}

function openEditSpouseModal(index: number) {
  if (!canEditMember(form.value.spouses[index])) {
    return showLockedMemberMessage()
  }

  editingSpouseIndex.value = index
  tempSpouse.value = normalizeSpouse(cloneDeep(form.value.spouses[index] || getEmptySpouse()))
  showSpouseModal.value = true
}

async function saveSpouse() {
  if (loading.value)
    return
  if (spouseUploading.value)
    return Swal.fire('آپلود در حال انجام است', 'تا پایان بارگذاری تمام مدارک همسر صبر کنید.', 'info')
  if (editingSpouseIndex.value !== null && !canEditMember(form.value.spouses[editingSpouseIndex.value])) {
    return showLockedMemberMessage()
  }

  const spouse = normalizeSpouse(tempSpouse.value)
  const isResubmission = editingSpouseIndex.value !== null
    && getMemberStatus(form.value.spouses[editingSpouseIndex.value]) === needsResubmissionStatus.value
  const isRejectedEdit = editingSpouseIndex.value !== null
    && getMemberStatus(form.value.spouses[editingSpouseIndex.value]) === 'rejected'

  if (!spouse.firstName)
    return Swal.fire('خطا', 'نام همسر را وارد کنید', 'warning')
  if (!spouse.lastName)
    return Swal.fire('خطا', 'نام خانوادگی همسر را وارد کنید', 'warning')
  if (!spouse.nationalId)
    return Swal.fire('خطا', 'کد ملی همسر را وارد کنید', 'warning')
  if (!validateNationalCode(spouse.nationalId))
    return Swal.fire('خطا', 'کد ملی معتبر نیست', 'warning')
  const duplicateSpouseNationalId = findDuplicateNationalId(spouse.nationalId, {
    spouseIndex: editingSpouseIndex.value,
  })
  if (duplicateSpouseNationalId)
    return Swal.fire('خطا', duplicateSpouseNationalId, 'warning')
  if (!spouse.birthDate || (typeof spouse.birthDate === 'string' && !spouse.birthDate.trim()))
    return Swal.fire('خطا', 'تاریخ تولد همسر را وارد کنید', 'warning')
  if (!validateBirthDate(spouse.birthDate))
    return Swal.fire('خطا', 'تاریخ تولد همسر باید معتبر باشد و در آینده نباشد', 'warning')
  if (!spouse.birthPlace)
    return Swal.fire('خطا', 'محل تولد همسر را وارد کنید', 'warning')
  if (!spouse.issuePlace)
    return Swal.fire('خطا', 'محل صدور شناسنامه همسر را وارد کنید', 'warning')
  spouse.mobile = String(spouse.mobile || '').trim()
  if (spouse.mobile && !validateMobile(spouse.mobile))
    return Swal.fire('خطا', 'شماره موبایل معتبر نیست', 'warning')
  const duplicateSpouseMobile = findDuplicateMobile(spouse.mobile, {
    spouseIndex: editingSpouseIndex.value,
  })
  if (duplicateSpouseMobile)
    return Swal.fire('خطا', duplicateSpouseMobile, 'warning')
  if (!spouse.education || spouse.education === 'notselected')
    return Swal.fire('خطا', 'مدرک تحصیلی همسر را انتخاب کنید', 'warning')
  if (!educationOptions.some(option => option.value === spouse.education && option.value !== 'notselected'))
    return Swal.fire('خطا', 'مقطع تحصیلی معتبر نیست', 'warning')
  if (!spouse.documents.nationalCard || !spouse.documents.birthCertPage1 || !spouse.documents.birthCertPage2) {
    return Swal.fire('خطا', 'تمام پیوست‌های همسر را بارگذاری کنید', 'warning')
  }

  if (isResubmission || isRejectedEdit)
    spouse.status = 'pending'

  const nextSpouses = cloneDeep(form.value.spouses)
  if (editingSpouseIndex.value === null)
    nextSpouses.push(spouse)
  else
    nextSpouses[editingSpouseIndex.value] = spouse

  const saved = await persistDependent({
    spouses: nextSpouses,
    children: cloneDeep(form.value.children),
  })

  if (!saved)
    return

  showSpouseModal.value = false
  tempSpouse.value = getEmptySpouse()
  editingSpouseIndex.value = null
  await Swal.fire('موفق', isResubmission ? 'اطلاعات همسر برای بررسی مجدد ارسال شد' : 'اطلاعات همسر با موفقیت ثبت شد', 'success')
}

function removeSpouse(index: number) {
  if (!canDeleteMember(form.value.spouses[index])) {
    return showLockedMemberMessage()
  }

  Swal.fire({
    title: 'حذف شود؟',
    text: 'این همسر از لیست حذف خواهد شد.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله',
    cancelButtonText: 'انصراف',
  }).then(async (result) => {
    if (!result.isConfirmed)
      return

    const nextSpouses = cloneDeep(form.value.spouses)
    nextSpouses.splice(index, 1)

    const saved = await persistDependent({
      spouses: nextSpouses,
      children: cloneDeep(form.value.children),
    })

    if (saved) {
      await Swal.fire('موفق', 'اطلاعات همسر حذف شد', 'success')
    }
  })
}

function openAddChildModal() {
  editingChildIndex.value = null
  tempChild.value = getEmptyChild()
  showChildModal.value = true
}

function openEditChildModal(index: number) {
  if (!canEditMember(form.value.children[index])) {
    return showLockedMemberMessage()
  }

  editingChildIndex.value = index
  tempChild.value = normalizeChild(cloneDeep(form.value.children[index] || getEmptyChild()))
  showChildModal.value = true
}

async function saveChild() {
  if (loading.value)
    return
  if (childUploading.value)
    return Swal.fire('آپلود در حال انجام است', 'تا پایان بارگذاری تمام مدارک فرزند صبر کنید.', 'info')
  if (editingChildIndex.value !== null && !canEditMember(form.value.children[editingChildIndex.value])) {
    return showLockedMemberMessage()
  }

  const child = normalizeChild(tempChild.value)
  const isResubmission = editingChildIndex.value !== null
    && getMemberStatus(form.value.children[editingChildIndex.value]) === needsResubmissionStatus.value
  const isRejectedEdit = editingChildIndex.value !== null
    && getMemberStatus(form.value.children[editingChildIndex.value]) === 'rejected'

  if (!child.firstName)
    return Swal.fire('خطا', 'نام فرزند را وارد کنید', 'warning')
  if (!child.lastName)
    return Swal.fire('خطا', 'نام خانوادگی فرزند را وارد کنید', 'warning')
  if (!child.nationalId)
    return Swal.fire('خطا', 'کد ملی فرزند را وارد کنید', 'warning')
  if (!validateNationalCode(child.nationalId))
    return Swal.fire('خطا', 'کد ملی فرزند معتبر نیست', 'warning')
  const duplicateChildNationalId = findDuplicateNationalId(child.nationalId, {
    childIndex: editingChildIndex.value,
  })
  if (duplicateChildNationalId)
    return Swal.fire('خطا', duplicateChildNationalId, 'warning')
  if (!child.birthDate || (typeof child.birthDate === 'string' && !child.birthDate.trim()))
    return Swal.fire('خطا', 'تاریخ تولد فرزند را وارد کنید', 'warning')
  if (!validateBirthDate(child.birthDate))
    return Swal.fire('خطا', 'تاریخ تولد فرزند باید معتبر باشد و در آینده نباشد', 'warning')
  if (!child.birthPlace)
    return Swal.fire('خطا', 'محل تولد فرزند را وارد کنید', 'warning')
  if (!child.issuePlace)
    return Swal.fire('خطا', 'محل صدور شناسنامه فرزند را وارد کنید', 'warning')
  if (!child.gender)
    return Swal.fire('خطا', 'جنسیت فرزند را انتخاب کنید', 'warning')
  if (!child.documents.parentBirthCertPage2 || !child.documents.childBirthCertPage1) {
    return Swal.fire('خطا', 'تمام پیوست‌های فرزند را بارگذاری کنید', 'warning')
  }

  if (isResubmission || isRejectedEdit)
    child.status = 'pending'

  const nextChildren = cloneDeep(form.value.children)
  if (editingChildIndex.value === null)
    nextChildren.push(child)
  else
    nextChildren[editingChildIndex.value] = child

  const saved = await persistDependent({
    spouses: cloneDeep(form.value.spouses),
    children: nextChildren,
  })

  if (!saved)
    return

  showChildModal.value = false
  tempChild.value = getEmptyChild()
  editingChildIndex.value = null
  await Swal.fire('موفق', isResubmission ? 'اطلاعات فرزند برای بررسی مجدد ارسال شد' : 'اطلاعات فرزند با موفقیت ثبت شد', 'success')
}

function removeChild(index: number) {
  if (!canDeleteMember(form.value.children[index])) {
    return showLockedMemberMessage()
  }

  Swal.fire({
    title: 'حذف شود؟',
    text: 'این فرزند از لیست حذف خواهد شد.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله',
    cancelButtonText: 'انصراف',
  }).then(async (result) => {
    if (!result.isConfirmed)
      return

    const nextChildren = cloneDeep(form.value.children)
    nextChildren.splice(index, 1)

    const saved = await persistDependent({
      spouses: cloneDeep(form.value.spouses),
      children: nextChildren,
    })

    if (saved) {
      await Swal.fire('موفق', 'اطلاعات فرزند حذف شد', 'success')
    }
  })
}

onMounted(() => {
  loadPersonelDependent()
  showInfoModal.value = true
})
</script>

<template>
  <div v-if="accessDenied" class="flex min-h-[420px] items-center justify-center pb-20 pt-6">
    <BaseCard class="dark:bg-muted-900 w-full max-w-xl rounded-[1.75rem] border border-amber-200 bg-white p-8 text-center shadow-sm dark:border-amber-900/40">
      <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300">
        <Icon name="ph:warning-circle-duotone" class="size-8" />
      </div>
      <h2 class="mt-5 text-xl font-black text-slate-900 dark:text-white">
        عدم دسترسی
      </h2>
      <p class="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300">
        {{ accessMessage }}
      </p>
    </BaseCard>
  </div>

  <div v-else class="space-y-6 pb-20 pt-6">
    <div class="border-primary-100 from-primary-50 dark:border-muted-800 dark:from-muted-900 dark:via-muted-950 dark:to-muted-900 overflow-hidden rounded-3xl border bg-gradient-to-br via-white to-sky-50 shadow-sm">
      <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-start gap-4">
          <div class="bg-primary-500 shadow-primary-500/20 flex size-14 items-center justify-center rounded-2xl text-white shadow-lg">
            <span class="text-lg font-black">خ</span>
          </div>
          <div class="space-y-3">
            <div>
              <h1 class="text-muted-900 text-2xl font-black dark:text-white">
                اطلاعات خانواده پرسنل
              </h1>
            </div>
            <div class="flex flex-wrap gap-3">
              <div class="dark:border-muted-700 dark:bg-muted-900/80 min-w-[140px] rounded-2xl border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
                <p class="text-muted-400 text-[11px] font-bold">
                  تعداد همسر
                </p>
                <p class="text-primary-600 mt-1 text-xl font-black">
                  {{ form.spouses.length }}
                </p>
              </div>
              <div class="dark:border-muted-700 dark:bg-muted-900/80 min-w-[140px] rounded-2xl border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
                <p class="text-muted-400 text-[11px] font-bold">
                  تعداد فرزندان
                </p>
                <p class="mt-1 text-xl font-black text-sky-600">
                  {{ form.children.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-3xl border border-amber-200 bg-amber-50/90 px-5 py-4 text-sm leading-7 text-amber-900 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
      موردهای تایید شده یا در انتظار بررسی از این صفحه قابل ویرایش یا حذف نیستند. در صورت نیاز باید با واحد سرمایه انسانی تماس بگیرید.
    </div>

    <div class="border-muted-200 dark:border-muted-800 dark:bg-muted-900 rounded-3xl border bg-white p-4 shadow-sm">
      <div class="mb-6 flex justify-center">
        <div class="bg-muted-100 dark:bg-muted-800 inline-flex rounded-2xl p-1">
          <button
            v-for="tab in tabs"
            :key="tab"
            type="button"
            class="min-w-[120px] rounded-2xl px-5 py-2.5 text-sm font-bold transition"
            :class="activeTab === tab
              ? 'bg-white text-primary-600 shadow-sm dark:bg-muted-950'
              : 'text-muted-500 dark:text-muted-300'"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'همسر'" class="space-y-4">
        <div class="border-muted-200 bg-muted-50/70 dark:border-muted-800 dark:bg-muted-950/40 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-muted-900 text-lg font-black dark:text-white">
              لیست همسران
            </h2>
            <p class="text-muted-500 dark:text-muted-400 mt-1 text-sm">
              موارد «نیاز بررسی و ارسال مجدد» قابل اصلاح و ارسال مجدد هستند. موارد رد شده نیز قابل ویرایش یا حذف هستند.
            </p>
          </div>
          <BaseButton
            color="primary"
            rounded="lg"
            class="sm:min-w-[150px]"
            @click="openAddSpouseModal"
          >
            افزودن همسر
          </BaseButton>
        </div>

        <div class="border-muted-200 dark:border-muted-800 overflow-x-auto rounded-2xl border">
          <table class="divide-muted-200 dark:divide-muted-800 w-full min-w-[900px] divide-y">
            <thead class="bg-muted-100/80 dark:bg-muted-950/70">
              <tr>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  نام
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  نام خانوادگی
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  کد ملی
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  تاریخ تولد
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  محل تولد
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  محل صدور
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  موبایل
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  تحصیلات
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  وضعیت
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody class="divide-muted-200 dark:divide-muted-800 dark:bg-muted-900 divide-y bg-white">
              <tr v-if="form.spouses.length === 0">
                <td colspan="10" class="text-muted-400 dark:text-muted-500 px-4 py-8 text-center text-sm">
                  هنوز موردی ثبت نشده است.
                </td>
              </tr>
              <tr
                v-for="(spouse, index) in form.spouses"
                :key="spouse.member_id || `${spouse.nationalId}-${index}`"
                class="hover:bg-muted-50/80 dark:hover:bg-muted-950/40"
              >
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ spouse.firstName }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ spouse.lastName }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm" dir="ltr">
                  {{ spouse.nationalId }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ toJalali(spouse.birthDate) }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ spouse.birthPlace || '-' }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ spouse.issuePlace || '-' }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm" dir="ltr">
                  {{ spouse.mobile || '-' }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ getEducationLabel(spouse.education) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex rounded-full px-3 py-1 text-xs font-bold" :class="getMemberStatusClass(getMemberStatus(spouse))">
                    {{ getMemberStatusLabel(getMemberStatus(spouse)) }}
                  </span>
                  <p v-if="spouse.manager_comment" class="text-muted-600 dark:text-muted-300 mt-2 whitespace-pre-line text-xs leading-6">
                    توضیح مدیر: {{ spouse.manager_comment }}
                  </p>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-center gap-2">
                    <BaseButton
                      size="sm"
                      color="warning"
                      rounded="lg"
                      :disabled="!canEditMember(spouse)"
                      @click="openEditSpouseModal(index)"
                    >
                      {{ getMemberStatus(spouse) === needsResubmissionStatus.value ? 'اصلاح و ارسال مجدد' : 'ویرایش' }}
                    </BaseButton>
                    <BaseButton
                      size="sm"
                      color="danger"
                      rounded="lg"
                      :disabled="!canDeleteMember(spouse)"
                      @click="removeSpouse(index)"
                    >
                      حذف
                    </BaseButton>
                  </div>
                  <p v-if="!canEditMember(spouse)" class="text-muted-500 dark:text-muted-400 mt-2 text-center text-[11px] leading-5">
                    در صورت نیاز باید با واحد سرمایه انسانی تماس بگیرید.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="border-muted-200 bg-muted-50/70 dark:border-muted-800 dark:bg-muted-950/40 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-muted-900 text-lg font-black dark:text-white">
              لیست فرزندان
            </h2>
            <p class="text-muted-500 dark:text-muted-400 mt-1 text-sm">
              موارد «نیاز بررسی و ارسال مجدد» قابل اصلاح و ارسال مجدد هستند. موارد رد شده نیز قابل ویرایش یا حذف هستند.
            </p>
          </div>
          <BaseButton
            color="primary"
            rounded="lg"
            class="sm:min-w-[150px]"
            @click="openAddChildModal"
          >
            افزودن فرزند
          </BaseButton>
        </div>

        <div class="border-muted-200 dark:border-muted-800 overflow-x-auto rounded-2xl border">
          <table class="divide-muted-200 dark:divide-muted-800 w-full min-w-[860px] divide-y">
            <thead class="bg-muted-100/80 dark:bg-muted-950/70">
              <tr>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  نام
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  نام خانوادگی
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  کد ملی
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  تاریخ تولد
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  محل تولد
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  محل صدور
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  جنسیت
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  وضعیت
                </th>
                <th class="text-muted-600 dark:text-muted-300 px-4 py-3 text-center text-xs font-black">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody class="divide-muted-200 dark:divide-muted-800 dark:bg-muted-900 divide-y bg-white">
              <tr v-if="form.children.length === 0">
                <td colspan="9" class="text-muted-400 dark:text-muted-500 px-4 py-8 text-center text-sm">
                  هنوز موردی ثبت نشده است.
                </td>
              </tr>
              <tr
                v-for="(child, index) in form.children"
                :key="child.member_id || `${child.nationalId}-${index}`"
                class="hover:bg-muted-50/80 dark:hover:bg-muted-950/40"
              >
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ child.firstName }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ child.lastName }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm" dir="ltr">
                  {{ child.nationalId }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ toJalali(child.birthDate) }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ child.birthPlace || '-' }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ child.issuePlace || '-' }}
                </td>
                <td class="text-muted-800 dark:text-muted-100 px-4 py-3 text-center text-sm">
                  {{ getChildGenderLabel(child.gender) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex rounded-full px-3 py-1 text-xs font-bold" :class="getMemberStatusClass(getMemberStatus(child))">
                    {{ getMemberStatusLabel(getMemberStatus(child)) }}
                  </span>
                  <p v-if="child.manager_comment" class="text-muted-600 dark:text-muted-300 mt-2 whitespace-pre-line text-xs leading-6">
                    توضیح مدیر: {{ child.manager_comment }}
                  </p>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-center gap-2">
                    <BaseButton
                      size="sm"
                      color="warning"
                      rounded="lg"
                      :disabled="!canEditMember(child)"
                      @click="openEditChildModal(index)"
                    >
                      {{ getMemberStatus(child) === needsResubmissionStatus.value ? 'اصلاح و ارسال مجدد' : 'ویرایش' }}
                    </BaseButton>
                    <BaseButton
                      size="sm"
                      color="danger"
                      rounded="lg"
                      :disabled="!canDeleteMember(child)"
                      @click="removeChild(index)"
                    >
                      حذف
                    </BaseButton>
                  </div>
                  <p v-if="!canEditMember(child)" class="text-muted-500 dark:text-muted-400 mt-2 text-center text-[11px] leading-5">
                    در صورت نیاز باید با واحد سرمایه انسانی تماس بگیرید.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <TairoModal
      :open="showInfoModal"
      size="md"
      @close="showInfoModal = false"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 md:p-6">
          <h3 class="text-muted-900 text-lg font-black dark:text-white">
            راهنمای تکمیل اطلاعات
          </h3>
          <BaseButtonClose @click="showInfoModal = false" />
        </div>
      </template>

      <div class="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
        <div class="text-muted-600 dark:text-muted-300 space-y-2 text-sm leading-7">
          <p>کد ملی باید معتبر باشد.</p>
          <p>تاریخ تولد همسر و فرزند الزامی است و نباید در آینده باشد.</p>
          <p>شماره موبایل همسر اختیاری است؛ در صورت ثبت باید ۱۱ رقمی، با 09 شروع شود و تکراری نباشد.</p>
          <p>انتخاب مدرک تحصیلی همسر الزامی است.</p>
          <p>برای همسر، کارت ملی و صفحات اول و صفحه مربوط به همسر شناسنامه الزامی است.</p>
          <p>برای فرزند، صفحه مربوط به فرزندان شناسنامه پرسنل و صفحه اول شناسنامه فرزند الزامی است.</p>
        </div>
        <div class="flex justify-center pt-2">
          <BaseButton
            color="primary"
            rounded="lg"
            @click="showInfoModal = false"
          >
            متوجه شدم
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <TairoModal
      :open="showSpouseModal"
      size="lg"
      @close="closeSpouseModal"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 md:p-6">
          <h3 class="text-muted-900 text-lg font-black dark:text-white">
            {{ editingSpouseIndex === null ? 'افزودن همسر' : 'ویرایش همسر' }}
          </h3>
          <BaseButtonClose :disabled="loading || spouseUploading" @click="closeSpouseModal" />
        </div>
      </template>

      <div class="max-h-[75vh] space-y-5 overflow-y-auto p-4 pt-0 md:p-6 md:pt-0">
        <div v-if="tempSpouse.manager_comment" class="whitespace-pre-line rounded-xl bg-sky-50 p-4 text-sm leading-7 text-sky-800 dark:bg-sky-950/30 dark:text-sky-200">
          توضیح مدیر: {{ tempSpouse.manager_comment }}
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BaseInput v-model="tempSpouse.firstName" label="نام" />
          <BaseInput v-model="tempSpouse.lastName" label="نام خانوادگی" />
          <BaseInput
            v-model="tempSpouse.nationalId"
            label="کد ملی"
            dir="ltr"
            :disabled="loading || spouseUploading"
          />

          <DatePicker
            v-model="tempSpouse.birthDate"
            :teleport-to-body="true"
            :masks="masks"
            :max-date="new Date()"
            locale="fa"
          >
            <template #default="{ inputValue, inputEvents }">
              <BaseInput
                dir="ltr"
                :value="inputValue"
                label="تاریخ تولد (الزامی)"
                v-on="inputEvents"
              />
            </template>
          </DatePicker>

          <BaseInput v-model="tempSpouse.birthPlace" label="محل تولد" />
          <BaseInput v-model="tempSpouse.issuePlace" label="محل صدور شناسنامه" />
          <BaseInput
            v-model="tempSpouse.mobile"
            label="شماره موبایل (اختیاری)"
            dir="ltr"
          />

          <div class="nui-input-wrapper">
            <label class="nui-input-label text-muted-700 dark:text-muted-200">مدرک تحصیلی (الزامی)</label>
            <select v-model="tempSpouse.education" class="input-select">
              <option
                v-for="option in educationOptions"
                :key="option.value"
                :value="option.value"
                :disabled="option.value === 'notselected'"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <DocumentUploadField
            v-model="tempSpouse.documents.nationalCard"
            :disabled="loading"
            title="کارت ملی همسر"
            description="فایل کارت ملی همسر را بارگذاری کنید."
            accepted-text="فرمت مجاز: JPG, JPEG, PNG"
            :upload-meta="{ memberType: 'spouse', memberNationalId: tempSpouse.nationalId, documentKey: 'nationalCard' }"
            @uploading="setUploadState('spouse:nationalCard', $event)"
          />
          <DocumentUploadField
            v-model="tempSpouse.documents.birthCertPage1"
            :disabled="loading"
            title="صفحه اول شناسنامه همسر"
            description="تصویر یا فایل صفحه اول شناسنامه همسر."
            accepted-text="فرمت مجاز: JPG, JPEG, PNG"
            :upload-meta="{ memberType: 'spouse', memberNationalId: tempSpouse.nationalId, documentKey: 'birthCertPage1' }"
            @uploading="setUploadState('spouse:birthCertPage1', $event)"
          />
          <DocumentUploadField
            v-model="tempSpouse.documents.birthCertPage2"
            :disabled="loading"
            title="صفحه مربوط به اطلاعات همسر در شناسنامه همسر"
            description="تصویر یا فایل صفحه مربوط به همسر در شناسنامه همسر."
            accepted-text="فرمت مجاز: JPG, JPEG, PNG"
            :upload-meta="{ memberType: 'spouse', memberNationalId: tempSpouse.nationalId, documentKey: 'birthCertPage2' }"
            @uploading="setUploadState('spouse:birthCertPage2', $event)"
          />
        </div>

        <div class="flex justify-center gap-3">
          <BaseButton
            color="primary"
            rounded="lg"
            :disabled="loading || spouseUploading"
            @click="saveSpouse"
          >
            {{ getMemberStatus(tempSpouse) === needsResubmissionStatus.value ? 'ارسال مجدد برای بررسی' : 'ذخیره' }}
          </BaseButton>
          <BaseButton
            color="muted"
            rounded="lg"
            :disabled="loading || spouseUploading"
            @click="closeSpouseModal"
          >
            انصراف
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <TairoModal
      :open="showChildModal"
      size="lg"
      @close="closeChildModal"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 md:p-6">
          <h3 class="text-muted-900 text-lg font-black dark:text-white">
            {{ editingChildIndex === null ? 'افزودن فرزند' : 'ویرایش فرزند' }}
          </h3>
          <BaseButtonClose :disabled="loading || childUploading" @click="closeChildModal" />
        </div>
      </template>

      <div class="max-h-[75vh] space-y-5 overflow-y-auto p-4 pt-0 md:p-6 md:pt-0">
        <div v-if="tempChild.manager_comment" class="whitespace-pre-line rounded-xl bg-sky-50 p-4 text-sm leading-7 text-sky-800 dark:bg-sky-950/30 dark:text-sky-200">
          توضیح مدیر: {{ tempChild.manager_comment }}
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BaseInput v-model="tempChild.firstName" label="نام" />
          <BaseInput v-model="tempChild.lastName" label="نام خانوادگی" />
          <BaseInput
            v-model="tempChild.nationalId"
            label="کد ملی"
            dir="ltr"
            :disabled="loading || childUploading"
          />

          <DatePicker
            v-model="tempChild.birthDate"
            :teleport-to-body="true"
            :masks="masks"
            :max-date="new Date()"
            locale="fa"
          >
            <template #default="{ inputValue, inputEvents }">
              <BaseInput
                dir="ltr"
                :value="inputValue"
                label="تاریخ تولد (الزامی)"
                v-on="inputEvents"
              />
            </template>
          </DatePicker>

          <BaseInput v-model="tempChild.birthPlace" label="محل تولد" />
          <BaseInput v-model="tempChild.issuePlace" label="محل صدور شناسنامه" />

          <div class="nui-input-wrapper md:col-span-2">
            <label class="nui-input-label text-muted-700 dark:text-muted-200">جنسیت</label>
            <select v-model="tempChild.gender" class="input-select">
              <option value="">
                انتخاب کنید
              </option>
              <option value="مرد">
                مرد
              </option>
              <option value="زن">
                زن
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <DocumentUploadField
            v-model="tempChild.documents.parentBirthCertPage2"
            :disabled="loading"
            title="صفحه مربوط به اطلاعات فرزند شناسنامه پرسنل"
            description="تصویر صفحه مربوط به اطلاعات فرزند شناسنامه پرسنل."
            accepted-text="فرمت مجاز: JPG, JPEG, PNG"
            :upload-meta="{ memberType: 'child', memberNationalId: tempChild.nationalId, documentKey: 'parentBirthCertPage2' }"
            @uploading="setUploadState('child:parentBirthCertPage2', $event)"
          />
          <DocumentUploadField
            v-model="tempChild.documents.childBirthCertPage1"
            :disabled="loading"
            title="صفحه اول شناسنامه فرزند"
            description="تصویر صفحه اول شناسنامه فرزند."
            accepted-text="فرمت مجاز: JPG, JPEG, PNG"
            :upload-meta="{ memberType: 'child', memberNationalId: tempChild.nationalId, documentKey: 'childBirthCertPage1' }"
            @uploading="setUploadState('child:childBirthCertPage1', $event)"
          />
        </div>

        <div class="flex justify-center gap-3">
          <BaseButton
            color="primary"
            rounded="lg"
            :disabled="loading || childUploading"
            @click="saveChild"
          >
            {{ getMemberStatus(tempChild) === needsResubmissionStatus.value ? 'ارسال مجدد برای بررسی' : 'ذخیره' }}
          </BaseButton>
          <BaseButton
            color="muted"
            rounded="lg"
            :disabled="loading || childUploading"
            @click="closeChildModal"
          >
            انصراف
          </BaseButton>
        </div>
      </div>
    </TairoModal>
  </div>
</template>

<style scoped>
.input-select {
  width: 100%;
  min-height: 42px;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.9rem;
  background: rgb(255 255 255);
  padding: 0.65rem 0.9rem;
  font-size: 0.95rem;
  color: rgb(15 23 42);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-select:focus {
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.12);
}

.dark .input-select {
  border-color: rgb(51 65 85);
  background: rgb(15 23 42 / 0.6);
  color: rgb(241 245 249);
}
</style>
