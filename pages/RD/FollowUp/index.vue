<script setup lang="ts">
import { ref, computed } from 'vue'
import { RNDApi } from '~/composables/RND/RNDApi'
import { buildWorkflowTree } from '~/composables/RND/useWorkflowTree'
import Swal from 'sweetalert2'

// Vue Flow Imports
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

definePageMeta({
  layout: 'rd'
})

const { TrackingRequest, VerifyTrackingCode , FileUploader , ReplyAndResubmitProposal} = RNDApi();

const followUpData = ref({
    code : '' ,
    phone : ''
})

// متغیرهای مدیریت مودال و تب‌ها
const isResultModalOpen = ref(false)
const activeTab = ref('details') // 'details' | 'tracking' | 'referrals'
const proposalJson = ref<any>({})
const workflowHistory = ref<any[]>([])
const elements = ref<any[]>([])
const submissionDate = ref('')
const baseUrl = ref('')

// متغیرهای فرم ارجاعات (تب ارجاعات)
const referralDescription = ref('')
const referralDocumentFiles = ref<File[]>([])
const referralDocumentsUploaded = ref(false)
const referralAttachments = ref<string[]>([])
const isReferralUploading = ref(false)
const isReferralSubmitting = ref(false)

// تابع کمکی برای استخراج پیام سرور
function getServerMessage(res: any, fallbackMessage: string = 'خطایی رخ داده است') {
  if (!res) return fallbackMessage;
  return res.msg_description ||
         res.data?.msg_description ||
         res.response?.msg_description ||
         res.msg ||
         fallbackMessage;
}

// استخراج توضیحات کارشناس در صورتی که پیشنهاد در انتظار پاسخ ارسال‌کننده باشد
const sentBackComment = computed(() => {
  const history = proposalJson.value.workflowHistory || []
  const sentBackStep = history.find((h: any) => h.level === 'کارشناس' && h.decision === 'sent_back')
  return sentBackStep?.comment || ''
})

function handleReferralDocumentsUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFiles = target.files ? Array.from(target.files) : []

  if (selectedFiles.length === 0) {
    return
  }

  // اعتبارسنجی اولیه در لحظه انتخاب فایل
  const invalidFileMessage = selectedFiles
    .map(validateReferralDocument)
    .find((message): message is string => Boolean(message))

  if (invalidFileMessage) {
    Swal.fire({
      icon: 'error',
      title: 'فایل نامعتبر است',
      text: invalidFileMessage,
      confirmButtonText: 'متوجه شدم',
    })

    // پاک‌کردن input برای اینکه انتخاب مجدد همان فایل هم event ایجاد کند
    target.value = ''
    return
  }

const newFiles = selectedFiles.filter((selectedFile) => {
    return !referralDocumentFiles.value.some((existingFile) => (
      existingFile.name === selectedFile.name &&
      existingFile.size === selectedFile.size &&
      existingFile.lastModified === selectedFile.lastModified
    ))
  })

  if (newFiles.length === 0) {
    Swal.fire({
      icon: 'info',
      text: 'فایل انتخاب‌شده قبلاً به فهرست مستندات افزوده شده است.',
      confirmButtonText: 'متوجه شدم',
    })

    target.value = ''
    return
  }

  referralDocumentFiles.value.push(...newFiles)

  // با هر تغییر در فایل‌ها، آپلود قبلی دیگر معتبر نیست
  referralDocumentsUploaded.value = false
  referralAttachments.value = []

  target.value = ''
}

function removeReferralDocumentFile(index: number) {
  referralDocumentFiles.value.splice(index, 1)
  referralDocumentsUploaded.value = false
  referralAttachments.value = []
}

const uploadReferralDocuments = async () => {
  if (referralDocumentFiles.value.length === 0) {
    Swal.fire({
      icon: 'info',
      text: 'ابتدا فایل مستندات را انتخاب کنید',
      confirmButtonText: 'متوجه شدم',
    })
    return
  }

  // اعتبارسنجی قطعی درست قبل از آپلود
  // حتی اگر فایل از مسیر دیگری وارد state شده باشد، آپلود نمی‌شود.
  const validationError = validateAllReferralDocuments()

  if (validationError) {
    referralDocumentsUploaded.value = false
    referralAttachments.value = []

    Swal.fire({
      icon: 'error',
      title: 'امکان بارگذاری فایل وجود ندارد',
      text: validationError,
      confirmButtonText: 'متوجه شدم',
    })

    return
  }

  isReferralUploading.value = true

  try {
    const uploadedNames: string[] = []

    for (const file of referralDocumentFiles.value) {
      const res = await FileUploader(file)

      if (res && res.result === true && res.response && res.response.result === 'OK') {
        uploadedNames.push(res.response.fileName)
      } else {
        console.error('Upload Error Response:', res)

        const serverMsg = getServerMessage(
          res,
          `خطا در آپلود فایل «${file.name}» در سرور`,
        )

        Swal.fire({
          icon: 'error',
          text: serverMsg,
          confirmButtonText: 'تایید',
        })

        return
      }
    }

    referralAttachments.value = uploadedNames
    referralDocumentsUploaded.value = true

    Swal.fire({
      icon: 'success',
      text: 'مستندات با موفقیت بارگذاری شد',
      timer: 2000,
      showConfirmButton: false,
    })
  } catch (error: any) {
    console.error('Catch Error:', error)

    const serverMsg = getServerMessage(
      error?.response?.data,
      'خطای ارتباط با سرور هنگام بارگذاری مستندات',
    )

    Swal.fire({
      icon: 'error',
      text: serverMsg,
      confirmButtonText: 'تایید',
    })
  } finally {
    isReferralUploading.value = false
  }
}

const submitReferralResponse = async () => {
  if (!referralDescription.value.trim()) {
    Swal.fire({ icon: 'warning', text: 'وارد کردن توضیحات الزامی است', confirmButtonText: 'متوجه شدم' });
    return;
  }

  const proposalId = proposalJson.value?._id
  if (!proposalId) {
    Swal.fire({ icon: 'error', text: 'شناسه پیشنهاد یافت نشد. لطفاً مجدداً استعلام بگیرید.', confirmButtonText: 'تایید' });
    return;
  }

  // کاربر فایل انتخاب کرده اما آپلود نکرده است
  if (referralDocumentFiles.value.length > 0 && !referralDocumentsUploaded.value) {
    Swal.fire({ icon: 'warning', text: 'شما فایل مستندات را انتخاب کرده‌اید، اما آپلود نکرده‌اید. لطفاً دکمه "بارگذاری مستندات" را بزنید.', confirmButtonText: 'متوجه شدم' });
    return;
  }

  isReferralSubmitting.value = true
  try {
    const res = await ReplyAndResubmitProposal(proposalId, referralDescription.value.trim(), referralAttachments.value);

    if (res && res.result === true) {
      Swal.fire({ icon: 'success', text: getServerMessage(res.response, 'پاسخ شما با موفقیت ثبت شد.'), timer: 2500, showConfirmButton: false });
      // ریست فرم ارجاع و بستن مودال
      referralDescription.value = '';
      referralDocumentFiles.value = [];
      referralAttachments.value = [];
      referralDocumentsUploaded.value = false;
      isResultModalOpen.value = false;
    } else {
      const serverMsg = getServerMessage(res, 'خطا در ارسال پاسخ ارجاع');
      Swal.fire({ icon: 'error', text: serverMsg, confirmButtonText: 'تایید' });
    }
  } catch (error: any) {
    const serverMsg = getServerMessage(error?.response?.data, 'خطای ارتباط با سرور هنگام ارسال پاسخ');
    Swal.fire({ icon: 'error', text: serverMsg, confirmButtonText: 'تایید' });
  } finally {
    isReferralSubmitting.value = false
  }
}

const formatJalaliDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

const getPersianDecision = (decision: string) => {
  if (decision === 'approved') return 'تایید شده'
  if (decision === 'rejected') return 'رد شده'
  if (decision === 'sent_back') return 'ارجاع به پیشنهاد دهنده'
  if (decision === 'approved_by_coworker') return 'تایید همکار'
  if (decision === 'resubmitted_by_sender') return 'ارسال مجدد پیشنهاد دهنده'
  return 'در حال بررسی'
}

const buildFlowchart = (proposal: any, history: any[]) => {
  elements.value = buildWorkflowTree({
    proposal,
    history,
    formatDate: formatJalaliDate,
    baseUrl: baseUrl.value
  })
}

const validateForm = () => {
  if (followUpData.value.phone.length !== 11) {
    return 'شماره تلفن باید 11 رقم باشد';
  } 
  else if (followUpData.value.code.length !== 6) {
    return 'کد پیگیری می بایست 6 رقمی باشد';
  }
  return null;
}

const followUp = async () => {
  const validationError = validateForm()
  if (validationError) {
    Swal.fire({ icon: 'warning', text: validationError, confirmButtonText: 'متوجه شدم' });
    return;
  }

  try {
    const result = await TrackingRequest(followUpData.value);
    
    // ۱. بررسی خطای بازگشتی از استعلام اولیه
    if (result.result === 'NOK' || !result.result) {
  // جستجو در لایه‌های مختلف برای پیدا کردن پیام ارسالی سرور
    const errorMessage = 
      result.msg_description || 
      result.data?.msg_description || 
      result.response?.msg_description || 
      result.msg || 
      'خطایی رخ داده است. لطفاً مجدداً تلاش کنید.';

    Swal.fire({
      icon: 'error',
      title: 'خطا', // بهتر است عنوان ثابت باشد
      text: errorMessage, // پیام سرور در قسمت متن قرار می‌گیرد
      confirmButtonText: 'تایید'
    });
    
    return; // توقف ادامه روند
  }
    
    const { value: verificationCode } = await Swal.fire({
      title: 'تایید هویت',
      text: 'لطفا کد پیگیری ارسال شده به نماینده را وارد کنید',
      input: 'text',
      inputPlaceholder: 'کد تایید را وارد کنید...',
      showCancelButton: true,
      confirmButtonText: 'تایید و ادامه',
      cancelButtonText: 'انصراف',
      inputValidator: (value) => {
        if (!value) return 'وارد کردن کد الزامی است!';
      }
    });

    if (verificationCode) {
      try {
        const verifyResult = await VerifyTrackingCode({ 
          code: followUpData.value.code, 
          phone: followUpData.value.phone,
          otp: verificationCode 
        });
        
        if (verifyResult.result) {
          const pData = verifyResult.response?.proposalData || {};
          baseUrl.value = verifyResult.response?.BaseUrl || pData.BaseUrl || '';
          workflowHistory.value = pData.workflowHistory || pData.proposal?.workflowHistory || [];
          proposalJson.value = {
            ...(pData.proposal || {}),
            workflowHistory: workflowHistory.value,
            senderReplies: pData.senderReplies || pData.proposal?.senderReplies || [],
            activeAssignments: pData.activeAssignments || pData.proposal?.activeAssignments || [],
            overallStatus: pData.proposal?.overallStatus || pData.overallStatus,
          };
          
          if (workflowHistory.value.length > 0 && workflowHistory.value[0].assignedAt) {
            submissionDate.value = formatJalaliDate(workflowHistory.value[0].assignedAt);
          } else {
            submissionDate.value = formatJalaliDate(proposalJson.value.createdAt);
          }

          buildFlowchart(proposalJson.value, workflowHistory.value);
          
          isResultModalOpen.value = true;
          activeTab.value = 'details'; 
          
          Swal.fire({
            icon: 'success',
            title: 'تایید هویت موفق',
            timer: 1500,
            showConfirmButton: false
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'خطا',
            text: result.msg_description || result.data?.msg_description || result.response?.msg_description || result.msg || 'خطایی رخ داده است. لطفاً مجدداً تلاش کنید.' ,
            confirmButtonText: 'تایید'
          });
        }
      } catch (verifyErr: any) {
        Swal.fire({ icon: 'error', text: verifyErr?.message || 'کد وارد شده نامعتبر است', confirmButtonText: 'تایید' });
      }
    }

  } catch (err: any) {
    Swal.fire({ icon: 'error', text: err?.message || 'خطا در برقراری ارتباط', confirmButtonText: 'تایید' })
  }
}

const MAX_REFERRAL_DOCUMENT_SIZE = 10 * 1024 * 1024 // 10MB بر اساس Byte
const ALLOWED_REFERRAL_DOCUMENT_EXTENSIONS = [
  '.pdf',
  '.xlsx',
  '.png',
  '.jpg',
]
function validateReferralDocument(file: File): string | null {
  const fileName = file.name?.trim() || ''
  const extension = fileName.includes('.')
    ? `.${fileName.split('.').pop()?.toLowerCase()}`
    : ''

  // بررسی فرمت فایل بر مبنای پسوند
  if (!ALLOWED_REFERRAL_DOCUMENT_EXTENSIONS.includes(extension)) {
    return `فایل «${fileName}» دارای فرمت غیرمجاز است. فقط فایل‌های PDF، XLSX، PNG و JPG قابل بارگذاری هستند.`
  }

  // بررسی حجم فایل
  if (file.size > MAX_REFERRAL_DOCUMENT_SIZE) {
    return `حجم فایل «${fileName}» بیشتر از 10 مگابایت است.`
  }

  // فایل صفر بایتی نیز معتبر نیست
  if (file.size === 0) {
    return `فایل «${fileName}» خالی است و قابل بارگذاری نیست.`
  }

  return null
}

function validateAllReferralDocuments(): string | null {
  for (const file of referralDocumentFiles.value) {
    const validationError = validateReferralDocument(file)

    if (validationError) {
      return validationError
    }
  }

  return null
}



</script>

<template>
  <div class="w-full max-w-xl mx-auto">
    <BaseCard rounded="lg" class="p-8">
      <!-- بخش عنوان -->
      <div class="mb-6 pb-4 border-b border-muted-200 dark:border-muted-800 text-center">
        <BaseHeading as="h3" size="md" weight="bold" class="text-black dark:text-white">
          برای مشاهده مرحله پیشنهاد، کد پیگیری خود را وارد کنید
        </BaseHeading>
      </div>

      <!-- بخش فرم پیگیری -->
      <TairoContentWrapper>
        <form @submit.prevent="followUp" class="flex flex-col gap-4 mt-4">
          <BaseInput placeholder="شماره تماس..." v-model="followUpData.phone" required minlength="11" maxlength="11" />
          <BaseInput placeholder="کد پیگیری..." v-model="followUpData.code" required minlength="6" maxlength="6" />
          <BaseButton type="submit" rounded="lg" color="success" size="lg" class="w-full font-bold">ارسال</BaseButton>
        </form>
      </TairoContentWrapper>
    </BaseCard>

    <!-- مودال نتایج پیگیری -->
    <div v-if="isResultModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 p-2 md:p-4">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-[95vw] lg:max-w-6xl max-h-[95vh] flex flex-col">
        
        <!-- هدر مودال -->
        <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div class="flex flex-col gap-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">نتیجه استعلام پروژه</h3>
            <div class="text-sm text-gray-500">
              <span class="ml-4 font-bold text-gray-700 dark:text-gray-300">کد رهگیری: {{ proposalJson.code || '-' }}</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">تاریخ ارسال: <span dir="ltr">{{ submissionDate }}</span></span>
            </div>
          </div>
          <button @click="isResultModalOpen = false" class="text-gray-500 hover:text-red-500 text-3xl leading-none">&times;</button>
        </div>

        <!-- بخش تب‌ها -->
        <div class="flex justify-center border-b dark:border-gray-700 bg-white dark:bg-gray-900 pt-4 pb-2">
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button 
              @click="activeTab = 'details'" 
              :class="['px-8 py-2 text-sm font-bold border border-gray-200 rounded-r-lg focus:z-10 transition-colors', 
                       activeTab === 'details' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-blue-400 hover:bg-gray-50']">
              جزئیات طرح
            </button>
            <button 
              @click="activeTab = 'tracking'" 
              :class="['px-8 py-2 text-sm font-bold border border-gray-200 rounded-l-lg focus:z-10 transition-colors', 
                       activeTab === 'tracking' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-green-400 hover:bg-gray-50']">
              پیگیری
            </button>
          </div>
          <div class="inline-flex rounded-md shadow-sm ml-2" role="group">
            <button 
              @click="activeTab = 'referrals'" 
              :class="['px-8 py-2 text-sm font-bold border border-gray-200 rounded-lg focus:z-10 transition-colors', 
                       activeTab === 'referrals' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-amber-400 hover:bg-gray-50']">
              ارجاعات
            </button>
          </div>
        </div>

        <!-- محتوای مودال -->
        <div class="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 text-right" style="direction: rtl;">
          
          <!-- تب ۱: جزئیات طرح -->
          <div v-if="activeTab === 'details'" class="space-y-4">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 pb-4">
              <div><strong class="text-gray-500 ml-2">عنوان طرح:</strong> <span class="font-bold text-gray-900 dark:text-white">{{ proposalJson.title || 'نامشخص' }}</span></div>
              <div><strong class="text-gray-500 ml-2">نام شرکت/مرکز/دانشگاه:</strong> <span class="dark:text-gray-200">{{ proposalJson.companyName || '-' }}</span></div>
              <div><strong class="text-gray-500 ml-2">نوع پروژه (جزئیات):</strong> <span class="dark:text-gray-200">{{ proposalJson.details || '-' }}</span></div>
              <div><strong class="text-gray-500 ml-2">برآورد هزینه:</strong> <span class="dark:text-gray-200">{{ proposalJson.estimatedCost ? proposalJson.estimatedCost.toLocaleString() + ' ریال' : '-' }}</span></div>
              <div><strong class="text-gray-500 ml-2">زمان مورد نیاز اجرا:</strong> <span class="dark:text-gray-200">{{ proposalJson.requiredExecutionTime ? proposalJson.requiredExecutionTime + ' ماه' : '-' }}</span></div>
              <div><strong class="text-gray-500 ml-2">زمان توقف تولید:</strong> <span class="dark:text-gray-200">{{ proposalJson.expectedDelayToProduction ? proposalJson.expectedDelayToProduction + ' ماه' : '-' }}</span></div>
              <div><strong class="text-gray-500 ml-2">کد ثبت اختراع:</strong> <span class="dark:text-gray-200">{{ proposalJson.patentRegistrationCode || 'ندارد' }}</span></div>
            </div>

            <div class="border-b border-gray-200 pb-4 space-y-4">
              <div>
                <strong class="text-gray-500 mb-2 block">دستاوردهای پروژه:</strong>
                <div class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm">{{ proposalJson.projectAchievements || '-' }}</div>
              </div>
              <div>
                <strong class="text-gray-500 mb-2 block">روند حل مساله، ابزارها و روش‌ها:</strong>
                <div class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm">{{ proposalJson.problemSolvingProcess || '-' }}</div>
              </div>
            </div>

            <div class="border-b border-gray-200 pb-4">
              <strong class="text-gray-900 dark:text-white font-bold block mb-3">سابقه اجرای طرح پیشنهادی:</strong>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div><strong class="text-gray-500 ml-1">عنوان پروژه قبلی:</strong> <span>{{ proposalJson.previousProjectTitle || '-' }}</span></div>
                <div><strong class="text-gray-500 ml-1">محل اجرا:</strong> <span>{{ proposalJson.projectExecutionPlace || '-' }}</span></div>
                <div><strong class="text-gray-500 ml-1">وضعیت حال حاضر:</strong> <span class="text-blue-600 font-bold">{{ proposalJson.currentProjectStatus || '-' }}</span></div>
              </div>
              <div>
                <strong class="text-gray-500 mb-2 block">خلاصه توضیحات پروژه قبلی:</strong>
                <div class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm">{{ proposalJson.projectDescriptionSummary || '-' }}</div>
              </div>
            </div>

            <div>
              <strong class="text-gray-900 dark:text-white font-bold block mb-3">مشخصات گروه تحقیق:</strong>
              <div v-if="proposalJson.researchTeam?.length" class="space-y-2">
                <div v-for="(member, index) in proposalJson.researchTeam" :key="index" class="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded text-sm grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div><strong>عضو {{ index + 1 }} {{ index === 0 ? '(نماینده)' : '' }}:</strong> {{ member.name || '' }} {{ member.lastName || '' }}</div>
                  <div><strong>سمت:</strong> {{ member.position || '-' }}</div>
                  <div><strong>تلفن:</strong> <span dir="ltr">{{ member.phone || '-' }}</span></div>
                  <div><strong>ایمیل:</strong> {{ member.email || '-' }}</div>
                </div>
              </div>
              <div v-else class="text-gray-500">عضوی ثبت نشده است.</div>
            </div>
            
          </div>

          <!-- تب ۲: پیگیری (فلوچارت Vue Flow) -->
          <div v-if="activeTab === 'tracking'" class="w-full h-[60vh] md:h-[70vh] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700" style="direction: ltr;">
            <VueFlow :nodes="elements.filter(e => !e.source)" :edges="elements.filter(e => e.source)" :fit-view-on-init="true" :nodes-draggable="false">
              <Background pattern-color="#ccc" :gap="20" />
              <Controls />
              
              <!-- نود شروع -->
              <template #node-startNode="props">
                <div class="border-2 border-indigo-500 bg-indigo-50 rounded-lg p-3 shadow-md w-56 text-center" style="direction: rtl;">
                  <div class="font-bold text-indigo-700 text-lg mb-2">{{ props.data.label }}</div>
                  <div class="text-sm text-gray-600">تاریخ ثبت: <span class="font-semibold">{{ props.data.date }}</span></div>
                </div>
              </template>
              
              <!-- نود اشخاص/کارشناسان -->
              <template #node-personNode="props">
                <div :class="props.data.isActive ? 'border-yellow-400' : (props.data.isSenderReply ? 'border-amber-300' : 'border-gray-300')" class="border bg-white dark:bg-gray-800 rounded-lg shadow-md w-64 text-right p-0 overflow-hidden" style="direction: rtl;">
                  <div :class="props.data.isActive ? 'bg-yellow-50 dark:bg-yellow-900/30' : (props.data.isSenderReply ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-700')" class="p-2 border-b border-gray-200 dark:border-gray-600">
                    <div class="font-bold text-gray-800 dark:text-white text-sm">{{ props.data.actorName }}</div>
                    <div class="text-xs text-blue-600 dark:text-blue-400 mt-1">{{ props.data.posTitle }}</div>
                  </div>
                  <div class="p-3 text-xs space-y-2 text-gray-600 dark:text-gray-300">
                    <div><span class="font-semibold">تاریخ ارجاع:</span> {{ props.data.assignedAt }}</div>
                    <div v-if="props.data.decidedAt !== '-'"><span class="font-semibold">تاریخ تصمیم:</span> {{ props.data.decidedAt }}</div>
                    <!-- ۲. نمایش دائمی وضعیت (حتی برای pending) -->
                    <div>
                      <span class="font-semibold">وضعیت:</span> 
                      <span :class="{
                        'text-green-500 font-bold': props.data.decision === 'approved',
                        'text-red-500 font-bold': props.data.decision === 'rejected',
                        'text-yellow-600 font-bold dark:text-yellow-400': props.data.decision === 'pending',
                        'text-orange-500 font-bold': props.data.decision === 'sent_back',
                        'text-blue-500 font-bold': props.data.decision === 'approved_by_coworker',
                        'text-amber-600 font-bold': props.data.decision === 'resubmitted_by_sender'
                      }">
                        {{ getPersianDecision(props.data.decision) }}
                      </span>
                    </div>
                    <div v-if="props.data.comment" class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 italic">
                      <span class="font-semibold text-red-600">توضیحات: </span> <span class="italic">"{{ props.data.comment }}"</span>
                    </div>
                    <div v-if="props.data.attachments?.length" class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
                      <a v-for="(attachment, index) in props.data.attachments" :key="index" :href="attachment.url" target="_blank"
                         class="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        {{ attachment.title }}
                      </a>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- نود پایان -->
              <template #node-endNode="props">
                <div :class="props.data.type === 'approved' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'" class="border-2 rounded-full px-6 py-3 shadow-md text-center flex items-center justify-center gap-2" style="direction: rtl;">
                  <svg v-if="props.data.type === 'approved'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  <span :class="props.data.type === 'approved' ? 'text-green-700' : 'text-red-700'" class="font-bold text-lg">{{ props.data.label }}</span>
                </div>
              </template>
              
            </VueFlow>
          </div>
          <!-- تب ۳: ارجاعات -->
          <div v-if="activeTab === 'referrals'" class="w-full h-[60vh] md:h-[70vh] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4" style="direction: rtl;">
            <div v-if="proposalJson.overallStatus === 'waiting_for_sender'" class="space-y-6">

              <div class="p-4 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-gray-800">
                <p class="text-sm text-amber-700 dark:text-amber-300">
                  کارشناس مسئول برای بررسی طرح شما نیاز به اطلاعات بیشتری دارد. توضیحات کارشناس به شرح زیر است:
                </p>
                <p class="mt-2 text-sm font-bold text-gray-800 dark:text-white">
                  {{ sentBackComment || '-' }}
                </p>
              </div>

              <form @submit.prevent="submitReferralResponse" class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">توضیحات</label>
                  <textarea
                    v-model="referralDescription"
                    rows="4"
                    required
                    class="w-full border rounded-lg p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                    placeholder="توضیحات خود را وارد کنید"
                  ></textarea>
                </div>

                <div class="border p-4 rounded-md border-muted-200 dark:border-muted-800">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-1">
                   <p class="text-sm text-amber-700 dark:text-amber-300">
                    مستندات (در صورت نیاز)
                   </p> 
                   <p>
                     حداکثر فایل قابل قبول 10 مگابایت می باشد و 
                   فرمت های قابل قبول برابر با 
                   pdf , xlsx , png , jpg
                   می باشد
                   </p>
                  </label>

                  <div class="flex items-center gap-3">
                    <label for="referral-doc-upload" class="cursor-pointer bg-muted-100 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700 text-sm px-4 py-2 rounded border border-muted-300 dark:border-muted-700 transition-colors">
                      انتخاب فایل
                    </label>
                    <input
                    id="referral-doc-upload"
                    type="file"
                    multiple
                    accept=".pdf,.xlsx,.png,.jpg"
                    @change="handleReferralDocumentsUpload"
                    class="hidden"
                    />


                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ referralDocumentFiles.length > 0 ? `${referralDocumentFiles.length} فایل انتخاب شد` : 'فایلی انتخاب نشده است' }}
                    </span>
                  </div>

                  <ul v-if="referralDocumentFiles.length > 0" class="mt-3 space-y-2">
                    <li v-for="(file, index) in referralDocumentFiles" :key="index" class="text-xs text-gray-700 dark:text-gray-300 flex items-center justify-between gap-2 bg-muted-50 dark:bg-muted-800/50 rounded px-2 py-1">
                      <span class="truncate">📎 {{ file.name }}</span>
                      <button type="button" @click="removeReferralDocumentFile(index)" class="text-red-500 hover:text-red-700 font-bold shrink-0" title="حذف فایل">
                        حذف ✕
                      </button>
                    </li>
                  </ul>

                  <div class="mt-4 flex justify-between items-center">
                    <span v-if="referralDocumentsUploaded" class="text-xs text-green-600 font-bold">✔️ آپلود شد</span>
                    <span v-else></span>
                    <BaseButton type="button" color="info" size="sm" :loading="isReferralUploading" :disabled="isReferralUploading" @click="uploadReferralDocuments">
                      {{ isReferralUploading ? 'در حال بارگذاری...' : 'بارگذاری مستندات' }}
                    </BaseButton>
                  </div>
                </div>

                <div class="flex justify-end">
                  <BaseButton type="submit" color="success" size="md" class="font-bold" :loading="isReferralSubmitting" :disabled="isReferralSubmitting || isReferralUploading">
                    {{ isReferralSubmitting ? 'در حال ارسال...' : 'ارسال' }}
                  </BaseButton>
                </div>
              </form>

            </div>

            <p v-else class="text-gray-500 dark:text-gray-400 text-center">درحال حاضر ارجاعی از سمت کارشناس برای شما وجود ندارد</p>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
