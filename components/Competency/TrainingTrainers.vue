<script setup lang="ts">
import { ref } from 'vue'

interface TrainerItem {
  _id: string
  firstName: string
  lastName: string
  nationalId: string
  mobile: string
  email: string
  expertiseArea: string
  education: string
  certification: string
  experienceYears: number
  isInternal: boolean
  isActive: boolean
  initialEvalStatus: string
  biography: string
}

interface HistoryItem {
  _id: string
  workLocation: string
  position: string
  startDate: string
  endDate: string
  description: string
}

const trainers = ref<TrainerItem[]>([
  { _id: 't1', firstName: 'محمد', lastName: 'رضایی', nationalId: '0012345678', mobile: '09120000000', email: 'm@test.com', expertiseArea: 'توسعه سازمانی', education: 'ارشد مدیریت', certification: 'ICDL', experienceYears: 10, isInternal: true, isActive: true, initialEvalStatus: 'approved', biography: '' },
])

const showModal = ref(false)
const modalTab = ref<'info' | 'history'>('info')
const filters = ref({ search: '', internal: '', active: '1' })

const form = ref<any>({})
const histForm = ref({ workLocation: '', position: '', startDate: '', endDate: '', description: '' })
const history = ref<HistoryItem[]>([])

const openCreate = () => {
  form.value = { isInternal: true, initialEvalStatus: 'not_evaluated' }
  history.value = []
  modalTab.value = 'info'
  showModal.value = true
}

const openEdit = (t: TrainerItem) => {
  form.value = { ...t }
  history.value = [{ _id: 'h1', workLocation: 'شرکت الف', position: 'مدیر', startDate: '1400', endDate: '1402', description: 'تجربه خوب' }]
  modalTab.value = 'info'
  showModal.value = true
}

const closeModal = () => { showModal.value = false }
const save = () => { showModal.value = false }
</script>

<template>
  <div class="border-x border-b bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <!-- هدر -->
    <div class="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <h2 class="text-xl font-bold text-gray-950 dark:text-white">مدیریت مربیان</h2>
      <button @click="openCreate" class="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700">+ مربی جدید</button>
    </div>

    <!-- فیلترها -->
    <div class="mb-4 flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-bold text-gray-500">جستجو</label>
        <input v-model="filters.search" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="نام، کد ملی، حوزه..." />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-bold text-gray-500">نوع</label>
        <select v-model="filters.internal" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900">
          <option value="">همه</option>
          <option value="1">داخلی</option>
          <option value="0">خارجی</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-bold text-gray-500">وضعیت</label>
        <select v-model="filters.active" class="rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900">
          <option value="1">فعال</option>
          <option value="0">غیرفعال</option>
        </select>
      </div>
      <button class="mt-auto rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100">اعمال</button>
    </div>

    <!-- جدول -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table class="min-w-full">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr class="text-xs text-gray-600 dark:text-gray-400">
            <th class="px-4 py-3 text-center">نام</th>
            <th class="px-4 py-3 text-center">کد ملی</th>
            <th class="px-4 py-3 text-center">موبایل</th>
            <th class="px-4 py-3 text-center">حوزه</th>
            <th class="px-4 py-3 text-center">تحصیلات</th>
            <th class="px-4 py-3 text-center">سابقه</th>
            <th class="px-4 py-3 text-center">نوع</th>
            <th class="px-4 py-3 text-center">ارزیابی اولیه</th>
            <th class="px-4 py-3 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in trainers" :key="t._id" class="border-t border-gray-200 dark:border-gray-800 text-sm">
            <td class="px-4 py-3 text-center font-bold">{{ t.firstName }} {{ t.lastName }}</td>
            <td class="px-4 py-3 text-center">{{ t.nationalId }}</td>
            <td class="px-4 py-3 text-center">{{ t.mobile }}</td>
            <td class="px-4 py-3 text-center">{{ t.expertiseArea }}</td>
            <td class="px-4 py-3 text-center">{{ t.education }}</td>
            <td class="px-4 py-3 text-center">{{ t.experienceYears }} سال</td>
            <td class="px-4 py-3 text-center">
              <span :class="['rounded-full px-2 py-0.5 text-xs', t.isInternal ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700']">
                {{ t.isInternal ? 'داخلی' : 'خارجی' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">{{ t.initialEvalStatus }}</td>
            <td class="px-4 py-3 text-center">
              <button @click="openEdit(t)" class="text-blue-600 hover:underline">ویرایش</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- مودال -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" @click.self="closeModal">
      <div class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="border-b px-6 py-4 dark:border-gray-800 font-bold">مدیریت مربی</div>
        
        <!-- تب‌ها -->
        <div class="flex border-b dark:border-gray-800">
          <button @click="modalTab = 'info'" :class="['px-4 py-3 text-sm border-b-2', modalTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent']">اطلاعات</button>
          <button @click="modalTab = 'history'" :class="['px-4 py-3 text-sm border-b-2', modalTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent']">سوابق کاری</button>
        </div>

        <div class="overflow-auto p-6">
          <!-- فرم اطلاعات -->
          <form v-show="modalTab === 'info'" @submit.prevent="save" class="grid grid-cols-2 gap-4">
             <div class="flex flex-col gap-1"><label class="text-sm">نام</label><input v-model="form.firstName" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">نام خانوادگی</label><input v-model="form.lastName" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">کد ملی</label><input v-model="form.nationalId" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">موبایل</label><input v-model="form.mobile" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">ایمیل</label><input v-model="form.email" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">حوزه تخصصی</label><input v-model="form.expertiseArea" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">تحصیلات</label><input v-model="form.education" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">گواهینامه‌ها</label><input v-model="form.certification" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">سابقه (سال)</label><input v-model="form.experienceYears" type="number" class="rounded border p-2 text-sm" /></div>
             <div class="flex flex-col gap-1"><label class="text-sm">نوع</label>
                <select v-model="form.isInternal" class="rounded border p-2 text-sm">
                  <option :value="true">داخلی</option>
                  <option :value="false">خارجی</option>
                </select>
             </div>
             <div class="flex flex-col gap-1"><label class="text-sm">ارزیابی اولیه</label>
                <select v-model="form.isInternal" class="rounded border p-2 text-sm">
                  <option :value="true">ارزیابی‌ نشده</option>
                  <option :value="false">قبول</option>
                  <option :value="false">مردود</option>
                </select>
             </div>
             <div class="flex flex-col gap-1 col-span-2"><label class="text-sm">بیوگرافی</label><textarea v-model="form.biography" class="rounded border p-2 text-sm" rows="3" /></div>
             
             <div class="col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" @click="closeModal" class="px-4 py-2 text-sm bg-gray-100 rounded">انصراف</button>
                <button type="submit" class="px-4 py-2 text-sm bg-green-600 text-white rounded">ذخیره</button>
             </div>
          </form>

          <!-- تب سوابق -->
          <div v-show="modalTab === 'history'">
             <div class="grid grid-cols-2 gap-2 mb-4">
                <input v-model="histForm.workLocation" placeholder="محل کار" class="rounded border p-2 text-sm" />
                <input v-model="histForm.position" placeholder="سمت" class="rounded border p-2 text-sm" />
                <input v-model="histForm.startDate" placeholder="شروع" class="rounded border p-2 text-sm" />
                <input v-model="histForm.endDate" placeholder="پایان" class="rounded border p-2 text-sm" />
                <input v-model="histForm.description" placeholder="توضیح" class="col-span-2 rounded border p-2 text-sm" />
                <button class="col-span-2 bg-gray-800 text-white py-2 rounded text-sm">+ افزودن سابقه</button>
             </div>
             <table class="w-full text-sm">
                <thead class="text-gray-500 border-b"><tr><th class="p-2">محل</th><th class="p-2">سمت</th><th class="p-2">توضیح</th><th class="p-2"></th></tr></thead>
                <tbody>
                   <tr v-for="h in history" :key="h._id" class="border-b">
                      <td class="p-2">{{ h.workLocation }}</td>
                      <td class="p-2">{{ h.position }}</td>
                      <td class="p-2">{{ h.description }}</td>
                      <td class="p-2 text-red-500 cursor-pointer">حذف</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
