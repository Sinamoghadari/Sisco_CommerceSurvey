<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RNDApi } from '~/composables/RND/RNDApi'
import { buildWorkflowTree } from '~/composables/RND/useWorkflowTree'
import Swal from 'sweetalert2'

// Vue Flow Imports
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

definePageMeta({
  layout: 'rd'
})

const { GetInboxProposals, ProposalDecision  , SendBackProposal} = RNDApi();

const proposals = ref<any[]>([])
const baseUrl = ref<string>('') 
const pending = ref(true)
const error = ref(false)

const isViewModalOpen = ref(false)
const isRejectModalOpen = ref(false)
const isApproveModalOpen = ref(false)
const isHistoryModalOpen = ref(false)
const isReferModalOpen = ref(false)

const selectedProposal = ref<any>(null)

const rejectionReasonInput = ref('')
const approvalReasonInput = ref('')
const referReasonInput = ref('')

const activeTab = ref('under_review')

// متغیرهای چارت سازمانی (Vue Flow)
const elements = ref<any[]>([])

const filteredProposals = computed(() => {
  return proposals.value.filter(p => p.overallStatus === activeTab.value)
})

// --- تابع کمکی برای استخراج پیام سرور از ساختارهای مختلف ---
function getServerMessage(res: any, fallbackMessage: string = 'خطایی رخ داده است') {
  if (!res) return fallbackMessage;
  return res.msg_description || 
         res.data?.msg_description || 
         res.response?.msg_description || 
         res.msg || 
         fallbackMessage;
}

const GetListProposals = async () => {
  pending.value = true
  error.value = false
  try {
    const response = await GetInboxProposals()
    
    if (response && (response.result === true || response.response?.result === 'OK')) {
      baseUrl.value = response.response?.BaseUrl || '' 
      const data = response.response?.data || response.data || {}
      
      const underReview = (data.under_review || []).map((p: any) => ({ ...p, overallStatus: 'under_review' }))
      const approved = (data.approved || []).map((p: any) => ({ ...p, overallStatus: 'approved' }))
      const rejected = (data.rejected || []).map((p: any) => ({ ...p, overallStatus: 'rejected' }))
      
      proposals.value = [...underReview, ...approved, ...rejected]
    } else {
      error.value = true
      // اگر API ارور بازگرداند، اما خطای شبکه نبود (مثلا result برابر NOK بود)
      const serverMsg = getServerMessage(response, 'دریافت اطلاعات با مشکل مواجه شد');
      Swal.fire({ icon: 'error', title: 'خطا', text: serverMsg, confirmButtonText: 'بستن' })
    }
  } catch (err: any) {
    error.value = true
    const serverMsg = getServerMessage(err?.response?.data, 'خطای ارتباط با سرور هنگام بارگذاری اطلاعات');
    Swal.fire({ icon: 'error', title: 'خطا', text: serverMsg, confirmButtonText: 'بستن' })
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  GetListProposals()
})

// --- توابع مدیریت مودال‌ها ---
function openViewModal(proposal: any) {
  selectedProposal.value = proposal
  isViewModalOpen.value = true
}

function openRejectModal(proposal: any) {
  selectedProposal.value = proposal
  rejectionReasonInput.value = '' 
  isRejectModalOpen.value = true
}

function openApproveModal(proposal: any) {
  selectedProposal.value = proposal
  approvalReasonInput.value = ''
  isApproveModalOpen.value = true
}
function openReferModal(proposal: any) {
  selectedProposal.value = proposal
  referReasonInput.value = ''
  isReferModalOpen.value = true
}

const closeViewModal = () => { isViewModalOpen.value = false; selectedProposal.value = null }
const closeRejectModal = () => { isRejectModalOpen.value = false; selectedProposal.value = null }
const closeApproveModal = () => { isApproveModalOpen.value = false; selectedProposal.value = null }
const closeHistoryModal = () => { isHistoryModalOpen.value = false; elements.value = []; }
const closeReferModal = () => { isReferModalOpen.value = false; selectedProposal.value = null }

// --- توابع تصمیم‌گیری ---
async function confirmApproval() {
  if (!selectedProposal.value) return
  Swal.fire({ title: 'در حال ثبت...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
  
  try {
    const response = await ProposalDecision(selectedProposal.value._id, 'approved', approvalReasonInput.value)
    const serverMsg = getServerMessage(response, 'عملیات تایید ثبت شد');
    
    // بررسی موفقیت با استفاده از فلگ سرور یا بررسی کلمه موفقیت در پیام
    if (response.result === true || response.result === 'OK' || serverMsg.includes('موفق')) {
      Swal.fire({ icon: 'success', title: 'موفقیت‌آمیز', text: serverMsg, confirmButtonText: 'تایید' })
      closeApproveModal()
      await GetListProposals()
    } else {
      Swal.fire({ icon: 'error', title: 'خطا', text: serverMsg, confirmButtonText: 'بستن' })
    }
  } catch (err: any) {
    const serverMsg = getServerMessage(err?.response?.data, 'خطا در برقراری ارتباط با سرور');
    Swal.fire({ icon: 'error', title: 'خطا', text: serverMsg, confirmButtonText: 'بستن' })
  }
}

async function confirmRejection() {
  if (!selectedProposal.value) return
  Swal.fire({ title: 'در حال ثبت...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
  
  try {
    const response = await ProposalDecision(selectedProposal.value._id, 'rejected', rejectionReasonInput.value)
    const serverMsg = getServerMessage(response, 'عملیات رد ثبت شد');
    
    if (response.result === true || response.result === 'OK' || serverMsg.includes('موفق')) {
      Swal.fire({ icon: 'success', title: 'موفقیت‌آمیز', text: serverMsg, confirmButtonText: 'تایید' })
      closeRejectModal()
      await GetListProposals()
    } else {
      Swal.fire({ icon: 'error', title: 'خطا', text: serverMsg, confirmButtonText: 'بستن' })
    }
  } catch (err: any) {
    const serverMsg = getServerMessage(err?.response?.data, 'خطا در برقراری ارتباط با سرور');
    Swal.fire({ icon: 'error', title: 'خطا', text: serverMsg, confirmButtonText: 'بستن' })
  }
}
async function confirmReferral() {
  if (!selectedProposal.value) return
  if (!referReasonInput.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'توجه', text: 'وارد کردن توضیحات ارجاع الزامی است.', confirmButtonText: 'متوجه شدم' })
    return
  }

  Swal.fire({ title: 'در حال ثبت...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })

  try {
    const response = await SendBackProposal(selectedProposal.value._id, referReasonInput.value)
    const serverMsg = getServerMessage(response, 'عملیات ارجاع ثبت شد');

    if (response.result === true || response.result === 'OK' || serverMsg.includes('موفق')) {
      Swal.fire({ icon: 'success', title: 'موفقیت‌آمیز', text: serverMsg, confirmButtonText: 'تایید' })
      closeReferModal()
      await GetListProposals()
    } else {
      Swal.fire({ icon: 'error', title: 'خطا', text: serverMsg, confirmButtonText: 'بستن' })
    }
  } catch (err: any) {
    const serverMsg = getServerMessage(err?.response?.data, 'خطا در برقراری ارتباط با سرور');
    Swal.fire({ icon: 'error', title: 'خطا', text: serverMsg, confirmButtonText: 'بستن' })
  }
}

// --- توابع فرمت‌دهی ---
function getStatusInfo(status: string) {
  switch (status) {
    case 'approved': return { text: 'تایید شده', class: 'bg-green-100 text-green-700' }
    case 'rejected': return { text: 'رد شده', class: 'bg-red-100 text-red-700' }
    case 'under_review': return { text: 'در انتظار بررسی', class: 'bg-yellow-100 text-yellow-700' }
    default: return { text: 'نامشخص', class: 'bg-gray-100 text-gray-700' }
  }
}

function formatDate(dateString: string) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

function getPersianDecision(decision: string) {
  if (decision === 'approved') return 'تایید شده'
  if (decision === 'rejected') return 'رد شده'
  if (decision === 'sent_back') return 'ارجاع به پیشنهاد دهنده'
  if (decision === 'approved_by_coworker') return 'تایید توسط همکار'
  return 'در حال بررسی'
}

// --- منطق تولید فلوچارت (سوابق) ---
function openHistoryModal(proposal: any) {
  selectedProposal.value = proposal
  isHistoryModalOpen.value = true
  elements.value = buildWorkflowTree({
    proposal,
    history: proposal.workflowHistory || [],
    formatDate,
    baseUrl: baseUrl.value
  })
}

// سطح سازمانی کاربر جاری برای یک پیشنهاد:
// پیشنهاد در اینباکس کاربر است، پس گام فعال (در انتظار تصمیم) متعلق به کاربر جاری است.
function getCurrentUserLevel(proposal: any): string {
  const history = proposal?.workflowHistory || []
  const activeStep = history.find((h: any) => h.state === 'active' || h.decision === 'pending')
  return activeStep?.level || ''
}

// کارشناس فقط می‌تواند تایید کند؛ سایر سطوح (مثل رئیس) هم تایید هم رد دارند.
function canReject(proposal: any): boolean {
  return getCurrentUserLevel(proposal) !== 'کارشناس'
}


</script>


<template>
  
  <div class="w-full max-w-7xl mx-auto p-4 relative">
    
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">مدیریت پیشنهادهای بهبود عملکرد</h1>
      <p class="text-lg text-gray-500 mt-2">در این بخش می‌توانید پیشنهادهای ثبت شده را بررسی، تایید یا رد کنید.</p>
    </div>

    <!-- بخش تب‌ها -->
    <div class="flex justify-center mb-6">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button @click="activeTab = 'under_review'" :class="['px-6 py-2 text-sm font-medium border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white', activeTab === 'under_review' ? 'bg-gray-100 text-blue-700 dark:bg-gray-600' : 'bg-white dark:bg-gray-700']">در انتظار بررسی‌ها</button>
        <button @click="activeTab = 'approved'" :class="['px-6 py-2 text-sm font-medium border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white', activeTab === 'approved' ? 'bg-gray-100 text-blue-700 dark:bg-gray-600' : 'bg-white dark:bg-gray-700']">تایید شده‌ها</button>
        <button @click="activeTab = 'rejected'" :class="['px-6 py-2 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white', activeTab === 'rejected' ? 'bg-gray-100 text-blue-700 dark:bg-gray-600' : 'bg-white dark:bg-gray-700']">رد شده‌ها</button>
      </div>
    </div>

    <!-- جدول داده ها -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 relative">
      <div v-if="pending" class="p-8 text-center">درحال بارگذاری اطلاعات...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500">خطا در دریافت اطلاعات.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">عنوان پروژه</th>
              <th scope="col" class="px-6 py-3">تاریخ ارسال</th>
              <th scope="col" class="px-6 py-3">وضعیت</th>
              <th scope="col" class="px-6 py-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProposals.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">موردی برای نمایش در این دسته یافت نشد.</td>
            </tr>
            <tr v-for="proposal in filteredProposals" :key="proposal._id" class="border-b dark:border-gray-700">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ proposal.title }}</td>
              <td class="px-6 py-4">{{ formatDate(proposal.createdAt) }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded-md text-xs font-semibold', getStatusInfo(proposal.overallStatus).class]">
                  {{ getStatusInfo(proposal.overallStatus).text }}
                </span>
              </td>
              <td class="px-6 py-4 flex items-center justify-center gap-2">
                <button class="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600" @click="openViewModal(proposal)">مشاهده</button>
                
                <button class="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600" @click="openHistoryModal(proposal)">سوابق</button>
                
                <button v-if="proposal.overallStatus === 'under_review' && proposal.isInMyInbox" class="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600" @click="openApproveModal(proposal)">تایید</button>

                <button v-if="proposal.overallStatus === 'under_review' && proposal.isInMyInbox && canReject(proposal)" class="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600" @click="openRejectModal(proposal)">رد</button>

                <button v-if="proposal.overallStatus === 'under_review' && proposal.isInMyInbox" class="bg-amber-500 text-white px-3 py-1 rounded text-xs hover:bg-amber-600" @click="openReferModal(proposal)">ارجاع</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- مودال مشاهده جزئیات -->
    <div v-if="isViewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 md:p-4">
      <div class="bg-white dark:bg-slate-950 rounded-lg shadow-lg w-full max-w-[95vw] lg:max-w-5xl max-h-[90vh] flex flex-col">
        <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-xl font-bold dark:text-white">جزئیات طرح پیشنهادی</h3>
          <button @click="closeViewModal" class="text-gray-500 hover:text-red-500 text-2xl leading-none">&times;</button>
        </div>
        <div v-if="selectedProposal" class="p-4 md:p-6 space-y-6 text-right overflow-y-auto flex-1">
          
          <!-- اطلاعات کلی پروژه -->
          <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white mb-4">
            <h4 class="font-bold text-lg mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">اطلاعات کلی پروژه</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span class="font-semibold ml-1">عنوان طرح:</span> {{ selectedProposal.title || '-' }}</div>
              <div><span class="font-semibold ml-1">نام شرکت/مرکز/دانشگاه:</span> {{ selectedProposal.companyName || '-' }}</div>
              <div class="md:col-span-2"><span class="font-semibold ml-1">نوع پروژه (جزئیات):</span> {{ selectedProposal.details || '-' }}</div>
            </div>
          </div>

          <!-- مشخصات گروه تحقیق -->
          <div class="p-4 border border-orange-200 dark:border-orange-900 rounded-lg bg-orange-50 dark:bg-gray-900 text-black dark:text-white mb-4">
            <h4 class="font-bold text-lg mb-4 border-b border-orange-200 dark:border-orange-800 pb-2 text-orange-600 dark:text-orange-400">مشخصات گروه تحقیق</h4>
            <div v-if="selectedProposal.researchTeam && selectedProposal.researchTeam.length > 0" class="space-y-4">
              <div v-for="(member, index) in selectedProposal.researchTeam" :key="index" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm p-3 bg-white dark:bg-gray-800 rounded border border-orange-100 dark:border-orange-800">
                <div><span class="font-semibold ml-1">نام:</span> {{ member.name || '-' }}</div>
                <div><span class="font-semibold ml-1">نام خانوادگی:</span> {{ member.lastName || '-' }}</div>
                <div><span class="font-semibold ml-1">سمت:</span> {{ member.position || '-' }}</div>
                <div><span class="font-semibold ml-1">شماره تماس:</span> <span dir="ltr">{{ member.phone || '-' }}</span></div>
                <div><span class="font-semibold ml-1">ایمیل:</span> {{ member.email || '-' }}</div>
              </div>
            </div>
            <div v-else class="text-sm">اطلاعات گروه تحقیق ثبت نشده است.</div>
            <div class="mt-4 text-sm">
              <span class="font-semibold ml-1">کد اختراع:</span> {{ selectedProposal.patentRegistrationCode || 'ندارد' }}
            </div>
          </div>

          <!-- دستاوردها، برآوردها و روند حل مساله -->
          <div class="p-4 border border-purple-200 dark:border-purple-900 rounded-lg bg-purple-50 dark:bg-gray-900 text-black dark:text-white mb-4">
            <h4 class="font-bold text-lg mb-4 border-b border-purple-200 dark:border-purple-800 pb-2 text-purple-600 dark:text-purple-400">دستاوردها، برآوردها و روند حل مساله</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="md:col-span-2"><span class="font-semibold ml-1">دستاوردهای پروژه:</span> {{ selectedProposal.projectAchievements || '-' }}</div>
              <div class="md:col-span-2"><span class="font-semibold ml-1">روند حل مساله، ابزارها و روش‌ها:</span> {{ selectedProposal.problemSolvingProcess || '-' }}</div>
              <div><span class="font-semibold ml-1">برآورد اجرای پروژه (ریال):</span> {{ selectedProposal.estimatedCost ? selectedProposal.estimatedCost.toLocaleString() : '-' }}</div>
              <div><span class="font-semibold ml-1">مدت زمان مورد نیاز اجرا (ماه):</span> {{ selectedProposal.requiredExecutionTime || '-' }}</div>
              <div class="md:col-span-2"><span class="font-semibold ml-1">مدت زمان احتمالی توقف تولید (ماه):</span> {{ selectedProposal.expectedDelayToProduction || '-' }}</div>
            </div>
          </div>

          <!-- سابقه اجرای طرح پیشنهادی -->
          <div class="p-4 border border-green-200 dark:border-green-900 rounded-lg bg-green-50 dark:bg-gray-900 text-black dark:text-white mb-4">
            <h4 class="font-bold text-lg mb-4 border-b border-green-200 dark:border-green-800 pb-2 text-green-700 dark:text-green-400">سابقه اجرای طرح پیشنهادی</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span class="font-semibold ml-1">عنوان پروژه قبلی:</span> {{ selectedProposal.previousProjectTitle || '-' }}</div>
              <div><span class="font-semibold ml-1">محل اجرا:</span> {{ selectedProposal.projectExecutionPlace || '-' }}</div>
              <div><span class="font-semibold ml-1">وضعیت حال حاضر پروژه:</span> {{ selectedProposal.currentProjectStatus || '-' }}</div>
              <div class="md:col-span-2"><span class="font-semibold ml-1">خلاصه‌ای از توضیحات پروژه قبلی:</span> {{ selectedProposal.projectDescriptionSummary || '-' }}</div>
            </div>
          </div>

          <!-- مدارک آپلود شده (عنوان آبی، متن مشکی) -->
          <div class="p-4 border border-blue-200 dark:border-blue-900 rounded-lg bg-blue-50 dark:bg-gray-900 text-black dark:text-white">
            <h4 class="font-bold text-lg mb-4 border-b border-blue-200 dark:border-blue-800 pb-2 text-blue-600 dark:text-blue-400">مدارک آپلود شده</h4>
            
            <div v-if="selectedProposal.documentFile || selectedProposal.resumeFile" class="flex flex-wrap gap-4 text-sm">
              <a v-if="selectedProposal.documentFile" :href="baseUrl + selectedProposal.documentFile" target="_blank" 
                 class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                دانلود مدارک آپلود شده
              </a>
              
              <a v-if="selectedProposal.resumeFile" :href="baseUrl + selectedProposal.resumeFile" target="_blank" 
                 class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                دانلود رزومه آپلود شده
              </a>
            </div>
            
            <div v-else class="text-sm text-gray-600 dark:text-gray-400">
              مدرک یا رزومه‌ای برای این طرح آپلود نشده است.
            </div>
          </div>

        </div>
        <div class="p-4 border-t dark:border-gray-700 flex justify-end">
          <button @click="closeViewModal" class="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded">بستن</button>
        </div>
      </div>
    </div>


    <!-- مودال سوابق و فلوچارت (Vue Flow) -->
    <!-- ... سایر کدها مشابه قبل ... -->
    <div v-if="isHistoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 md:p-4">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-[95vw] h-[90vh] flex flex-col">
        <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <h3 class="text-xl font-bold dark:text-white">سوابق گردش پیشنهاد</h3>
          <button @click="closeHistoryModal" class="text-gray-500 hover:text-red-500 text-2xl leading-none">&times;</button>
        </div>
        <div class="flex-1 w-full bg-gray-50 dark:bg-gray-900" style="direction: ltr;">
                    <VueFlow :nodes="elements.filter(e => !e.source)" :edges="elements.filter(e => e.source)" :fit-view-on-init="true" :nodes-draggable="false">
            <Background pattern-color="#ccc" :gap="20" />
            <Controls />

            <!-- ─── نود شروع / ارسال‌کننده ─── -->
            <template #node-startNode="props">
              <div
                :class="[
                  props.data.isFinalNode && props.data.overallStatus === 'rejected'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : props.data.isFinalNode && props.data.overallStatus === 'approved'
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : props.data.isSenderReply
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                ]"
                class="border-2 rounded-lg p-3 shadow-md w-64 text-center transition-colors duration-150"
                style="direction: rtl;"
              >
                <div
                  :class="[
                    props.data.overallStatus === 'rejected'
                      ? 'text-red-700 dark:text-red-400'
                      : props.data.overallStatus === 'approved'
                        ? 'text-green-700 dark:text-green-400'
                        : props.data.isSenderReply 
                          ? 'text-amber-700 dark:text-amber-400' 
                          : 'text-indigo-700 dark:text-indigo-400'
                  ]"
                  class="font-bold text-lg mb-2"
                >
                  {{ props.data.label }}
                </div>

                <div class="text-sm text-gray-600 dark:text-gray-300">
                  تاریخ ثبت: <span class="font-semibold">{{ props.data.assignedAt }}</span>
                </div>

                <div v-if="props.data.decidedAt && props.data.decidedAt !== '-'" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  تاریخ تصمیم: <span class="font-semibold">{{ props.data.decidedAt }}</span>
                </div>

                <div v-if="props.data.comment" class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 italic text-xs text-gray-500 dark:text-gray-400">
                  <span class="font-semibold text-red-600 dark:text-red-400">توضیحات: </span>
                  <span>"{{ props.data.comment }}"</span>
                </div>

                <div v-if="props.data.attachments?.length" class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 space-y-1">
                  <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">مستندات:</div>
                  <a
                    v-for="(attachment, index) in props.data.attachments"
                    :key="index"
                    :href="attachment.url"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {{ attachment.title }}
                  </a>
                </div>
              </div>
            </template>

            <!-- ─── نود پرسنل ─── -->
            <template #node-personNode="props">
              <div
                :class="[
                  props.data.isFinalNode && props.data.overallStatus === 'rejected'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : props.data.isFinalNode && props.data.overallStatus === 'approved'
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : props.data.isActive
                        ? 'border-yellow-400 bg-white dark:bg-gray-800'
                        : props.data.isSenderReply 
                          ? 'border-amber-300 bg-white dark:bg-gray-800' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                ]"
                class="border rounded-lg shadow-md w-64 text-right p-0 overflow-hidden transition-colors duration-150"
                style="direction: rtl;"
              >
                <div
                  :class="[
                    props.data.overallStatus === 'rejected'
                      ? 'bg-red-100 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-200'
                      : props.data.overallStatus === 'approved'
                        ? 'bg-green-100 dark:bg-green-950/30 border-green-200 dark:border-green-900/40 text-green-900 dark:text-green-200'
                        : props.data.isActive
                          ? 'bg-yellow-50 dark:bg-yellow-900/30'
                          : props.data.isSenderReply
                            ? 'bg-amber-50 dark:bg-amber-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                  ]"
                  class="p-2 border-b border-gray-200 dark:border-gray-600"
                >
                  <div class="text-xs font-bold mt-1" :class="props.data.overallStatus === 'rejected' ? 'text-red-700 dark:text-red-400' : props.data.overallStatus === 'approved' ? 'text-green-700 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'">
                    {{ props.data.posTitle }}
                  </div>
                </div>
                <div class="p-3 text-xs space-y-2 text-gray-600 dark:text-gray-300">
                  <div><span class="font-semibold">تاریخ ارجاع:</span> {{ props.data.assignedAt }}</div>
                  <div v-if="props.data.decidedAt && props.data.decidedAt !== '-'">
                    <span class="font-semibold">تاریخ تصمیم:</span> {{ props.data.decidedAt }}
                  </div>

                  <div v-if="props.data.comment" class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 italic">
                    <span class="font-semibold text-red-600 dark:text-red-400">توضیحات: </span>
                    <span class="italic">"{{ props.data.comment }}"</span>
                  </div>
                  <div v-if="props.data.attachments?.length" class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
                    <a
                      v-for="(attachment, index) in props.data.attachments"
                      :key="index"
                      :href="attachment.url"
                      target="_blank"
                      class="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {{ attachment.title }}
                    </a>
                  </div>
                </div>
              </div>
            </template>

            <!-- ─── نود پایان ─── -->
            <template #node-endNode="props">
              <div
                :class="props.data.overallStatus === 'approved' ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'"
                class="border-2 rounded-full px-6 py-3 shadow-md text-center flex items-center justify-center gap-2"
                style="direction: rtl;"
              >
                <svg v-if="props.data.overallStatus === 'approved'" class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span :class="props.data.overallStatus === 'approved' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'" class="font-bold text-lg">
                  {{ props.data.label }}
                </span>
              </div>
            </template>
          </VueFlow>



        </div>
      </div>
    </div>

    <!-- مودال تایید پیشنهاد -->
    <div v-if="isApproveModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">تایید پیشنهاد</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">آیا از تایید این طرح اطمینان دارید؟ در صورت نیاز می‌توانید توضیحات خود را وارد کنید.</p>
        <textarea v-model="approvalReasonInput" rows="3" class="w-full border rounded-lg p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500" placeholder="توضیحات تایید (اختیاری)"></textarea>
        <div class="flex justify-end gap-2 mt-6">
          <button @click="closeApproveModal" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">انصراف</button>
          <button @click="confirmApproval" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">تایید نهایی</button>
        </div>
      </div>
    </div>

    <!-- مودال رد پیشنهاد -->
    <div v-if="isRejectModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">رد پیشنهاد</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">برای رد کردن این طرح، لطفا دلیل و توضیحات خود را وارد نمایید.</p>
        <textarea v-model="rejectionReasonInput" rows="3" class="w-full border rounded-lg p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500" placeholder="دلیل رد طرح (الزامی)"></textarea>
        <div class="flex justify-end gap-2 mt-6">
          <button @click="closeRejectModal" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">انصراف</button>
          <button @click="confirmRejection" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">رد کردن طرح</button>
        </div>
      </div>
    </div>


    <!-- مودال ارجاع پیشنهاد -->
    <div v-if="isReferModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">ارجاع پیشنهاد</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">برای بازگرداندن این طرح به سطح قبلی، لطفا توضیحات ارجاع را وارد نمایید.</p>
        <textarea v-model="referReasonInput" rows="3" required class="w-full border rounded-lg p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-amber-500 focus:border-amber-500" placeholder="توضیحات ارجاع (الزامی)"></textarea>
        <div class="flex justify-end gap-2 mt-6">
          <button @click="closeReferModal" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">انصراف</button>
          <button @click="confirmReferral" class="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">ثبت ارجاع</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
