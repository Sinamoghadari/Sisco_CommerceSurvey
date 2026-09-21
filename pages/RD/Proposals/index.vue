<script setup lang="ts">
import { ref } from 'vue'
import { RNDApi } from '~/composables/RND/RNDApi'
import Swal from 'sweetalert2'

const { NewProposal, FileUploader } = RNDApi();
const documentFiles = ref<File[]>([])
const companyResumeFiles = ref<File[]>([])
const isConfirmModalOpen = ref(false)

// تنظیمات متای صفحه
definePageMeta({
  layout: 'rd'
})

// دسته‌های پروژه‌های تحقیقاتی
const project_categories = [
  "ارتقاء تولید",
  "بهینه سازی انرژی",
  "محیط زیست و فولاد سبز",
  "ارتقاء کیفیت محصول",
  "برنامه ریزی و مدیریت نگهداری تعمیرات" 
]

// ساختار پیش‌فرض اعضای تیم تحقیقاتی با قابلیت مدیریت خطاهای مجزا
interface TeamMember {
  name: string
  lastName: string
  position: string
  phone: string
  email: string
  isRepresentative: boolean
  touched: {
    name: boolean
    lastName: boolean
    position: boolean
    phone: boolean
    email: boolean
  }
  errors: {
    name: string
    lastName: string
    position: string
    phone: string
    email: string
  }
}

const createNewMember = (): TeamMember => ({
  name: '',
  lastName: '',
  position: '',
  phone: '',
  email: '',
  isRepresentative: false,
  touched: {
    name: false,
    lastName: false,
    position: false,
    phone: false,
    email: false
  },
  errors: {
    name: '',
    lastName: '',
    position: '',
    phone: '',
    email: ''
  }
})

const formData = ref({
  title: '',
  details: '',
  companyName: '',
  researchTeam: [createNewMember()],
  projectAchievements: '',
  problemSolvingProcess: '',
  estimatedCost: null,
  requiredExecutionTime: null,
  expectedDelayToProduction: null,
  previousProjectTitle: '',
  projectExecutionPlace: '',
  currentProjectStatus: '',
  projectDescriptionSummary: '',
  patentRegistrationCode: null,
  uploadresume: "",
  uploaddocument: ""
})

const representativeIndex = ref(0);

// --- فرمت‌ها و الگوهای اعتبارسنجی ---
const persianRegex = /^[ \u0600-\u06FF\u200C\u200D]+$/; // فقط حروف فارسی و نیم‌فاصله و فاصله
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// تابع کمکی برای استخراج پیام سرور
function getServerMessage(res: any, fallbackMessage: string = 'خطایی رخ داده است') {
  if (!res) return fallbackMessage;
  return res.msg_description || 
         res.data?.msg_description || 
         res.response?.msg_description || 
         res.msg || 
         fallbackMessage;
}

// تابع اعتبارسنجی مجزای فیلدهای اعضا به صورت Real-time
function validateMemberField(index: number, field: 'name' | 'lastName' | 'position' | 'phone' | 'email') {
  const member = formData.value.researchTeam[index];
  if (!member) return;

  member.touched[field] = true;

  // ۱. اعتبارسنجی فیلدهای فارسی (نام، نام خانوادگی، سمت)
  if (field === 'name' || field === 'lastName' || field === 'position') {
    const value = member[field].trim();
    if (!value) {
      member.errors[field] = 'این فیلد الزامی است.';
    } else if (!persianRegex.test(value)) {
      member.errors[field] = 'لطفاً فقط از حروف فارسی استفاده کنید.';
    } else {
      member.errors[field] = '';
    }
  }

  // ۲. اعتبارسنجی شماره تماس (شروع با 09 و دقیقاً ۱۱ رقم)
  if (field === 'phone') {
    const value = member.phone.trim();
    if (!value) {
      member.errors.phone = 'شماره تماس الزامی است.';
    } else if (!value.startsWith('09')) {
      member.errors.phone = 'شماره تماس باید با 09 شروع شود.';
    } else if (value.length !== 11 || !/^\d+$/.test(value)) {
      member.errors.phone = 'شماره تماس باید دقیقاً ۱۱ رقم عددی باشد.';
    } else {
      member.errors.phone = '';
    }
  }

  // ۳. اعتبارسنجی ایمیل
  if (field === 'email') {
    const value = member.email.trim();
    if (!value) {
      member.errors.email = 'ایمیل الزامی است.';
    } else if (!emailRegex.test(value)) {
      member.errors.email = 'فرمت ایمیل وارد شده نامعتبر است.';
    } else {
      member.errors.email = '';
    }
  }
}

// افزودن فرد جدید به گروه تحقیق
function addTeamMember() {
  formData.value.researchTeam.push(createNewMember())
}

// حذف فرد از گروه تحقیق با استفاده از ایندکس
function removeTeamMember(index: number) {
  if (formData.value.researchTeam.length > 1) {
    formData.value.researchTeam.splice(index, 1)
    
    // مدیریت ایندکس نماینده بعد از حذف
    if (representativeIndex.value === index) {
      representativeIndex.value = 0;
    } else if (representativeIndex.value > index) {
      representativeIndex.value -= 1;
    }
  }
}

// تابع کمکی برای اعتبارسنجی فایل (PDF بودن و حجم کمتر از 10MB)
const validateFile = (file: File) => {
  if (file.type !== 'application/pdf') {
    Swal.fire({ icon: 'error', text: 'فرمت فایل نامعتبر است. لطفاً فقط فایل PDF انتخاب کنید.' });
    return false;
  }
  
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    Swal.fire({ icon: 'error', text: 'حجم فایل نباید بیشتر از ۱۰ مگابایت باشد.' });
    return false;
  }
  
  return true;
}

// مدیریت فایل‌های بارگذاری به صورت چندتایی
function handleDocumentsUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    for (const file of Array.from(target.files)) {
      if (validateFile(file)) {
        documentFiles.value.push(file);
      }
    }
    formData.value.uploaddocument = '';
  }
  target.value = '';
}

function handleResumeUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    for (const file of Array.from(target.files)) {
      if (validateFile(file)) {
        companyResumeFiles.value.push(file);
      }
    }
    formData.value.uploadresume = '';
  }
  target.value = '';
}

// حذف فایل انتخاب شده مستندات
function removeDocumentFile(index: number) {
  documentFiles.value.splice(index, 1);
  formData.value.uploaddocument = '';
}

// حذف فایل انتخاب شده رزومه
function removeResumeFile(index: number) {
  companyResumeFiles.value.splice(index, 1);
  formData.value.uploadresume = '';
}

const uploadDocumentsToServer = async () => {
  if (documentFiles.value.length === 0) {
    Swal.fire({ icon: 'info', text: 'ابتدا فایل مستندات را انتخاب کنید' });
    return;
  }

  try {
    const uploadedNames: string[] = [];
    for (const file of documentFiles.value) {
      const res = await FileUploader(file);
      if (res && res.result === true && res.response && res.response.result === 'OK') {
        uploadedNames.push(res.response.fileName);
      } else {
        console.error("Upload Error Response:", res);
        const serverMsg = getServerMessage(res, `خطا در آپلود فایل «${file.name}» در سرور`);
        Swal.fire({ icon: 'error', text: serverMsg });
        return;
      }
    }
    formData.value.uploaddocument = uploadedNames.join(',');
    Swal.fire({ icon: 'success', text: 'مستندات با موفقیت بارگذاری شد', timer: 2000, showConfirmButton: false });
  } catch (error: any) {
    console.error("Catch Error:", error);
    const serverMsg = getServerMessage(error?.response?.data, 'خطای ارتباط با سرور هنگام بارگذاری مستندات');
    Swal.fire({ icon: 'error', text: serverMsg });
  }
}

const uploadResumeToServer = async () => {
  if (companyResumeFiles.value.length === 0) {
    Swal.fire({ icon: 'info', text: 'ابتدا فایل رزومه را انتخاب کنید' });
    return;
  }

  try {
    const uploadedNames: string[] = [];
    for (const file of companyResumeFiles.value) {
      const res = await FileUploader(file);
      if (res && res.result === true && res.response && res.response.result === 'OK') {
        uploadedNames.push(res.response.fileName);
      } else {
        console.error("Upload Error Response:", res);
        const serverMsg = getServerMessage(res, `خطا در آپلود فایل «${file.name}» در سرور`);
        Swal.fire({ icon: 'error', text: serverMsg });
        return;
      }
    }
    formData.value.uploadresume = uploadedNames.join(',');
    Swal.fire({ icon: 'success', text: 'رزومه با موفقیت بارگذاری شد', timer: 2000, showConfirmButton: false });
  } catch (error: any) {
    console.error("Catch Error:", error);
    const serverMsg = getServerMessage(error?.response?.data, 'خطای ارتباط با سرور هنگام بارگذاری رزومه');
    Swal.fire({ icon: 'error', text: serverMsg });
  }
}

// تابع اعتبارسنجی نهایی فرم جهت جلوگیری از ثبت داده‌های نامعتبر
const validateForm = () => {
  if (!formData.value.title.trim()) {
    return 'لطفاً عنوان طرح را وارد کنید.';
  }

  if (!formData.value.uploaddocument) {
    return 'لطفا مستندات پروپوزال را آپلود کنید';
  }

  if (documentFiles.value.length > 0 && !formData.value.uploaddocument) {
    return 'شما فایل مستندات را انتخاب کرده‌اید، اما آپلود نکرده‌اید. لطفاً دکمه "بارگذاری مستندات" را بزنید.';
  }
  if (companyResumeFiles.value.length > 0 && !formData.value.uploadresume) {
    return 'شما فایل رزومه را انتخاب کرده‌اید، اما آپلود نکرده‌اید. لطفاً دکمه "بارگذاری رزومه" را بزنید.';
  }

  // اجرای ولیدیشن برای تمام اعضا و بررسی خطاها
  for (let i = 0; i < formData.value.researchTeam.length; i++) {
    const member = formData.value.researchTeam[i];
    
    // اجرای دستی تریگرها برای بروزرسانی خطاها در صورت ارسال مستقیم فرم بدون لمس اینپوت‌ها
    validateMemberField(i, 'name');
    validateMemberField(i, 'lastName');
    validateMemberField(i, 'position');
    validateMemberField(i, 'phone');
    validateMemberField(i, 'email');

    if (member.errors.name) return `خطا در نام عضو ${i + 1}: ${member.errors.name}`;
    if (member.errors.lastName) return `خطا در نام خانوادگی عضو ${i + 1}: ${member.errors.lastName}`;
    if (member.errors.position) return `خطا در سمت عضو ${i + 1}: ${member.errors.position}`;
    if (member.errors.phone) return `خطا در شماره تماس عضو ${i + 1}: ${member.errors.phone}`;
    if (member.errors.email) return `خطا در ایمیل عضو ${i + 1}: ${member.errors.email}`;
  }

  // تنظیم فیلد نماینده بر اساس ایندکس انتخاب‌شده
  formData.value.researchTeam.forEach((member, index) => {
    member.isRepresentative = (index === representativeIndex.value);
  });

  return null;
}

const submitForm = () => {
  const validationError = validateForm();

  if (validationError) {
    Swal.fire({
      icon: 'warning',
      text: validationError,
      confirmButtonText: 'متوجه شدم'
    });
    return;
  }

  isConfirmModalOpen.value = true;
}

const cancelSubmit = () => {
  isConfirmModalOpen.value = false;
}

const confirmSubmit = async () => {
  isConfirmModalOpen.value = false;
  await doSubmit();
}

const doSubmit = async () => {
  try {
    // پاک‌سازی فیلدهای اعتبارسنجی داخلی قبل از ارسال به API به جهت سازگاری مدل داده‌ای
    const payload = {
      ...formData.value,
      researchTeam: formData.value.researchTeam.map(member => ({
        name: member.name,
        lastName: member.lastName,
        position: member.position,
        phone: member.phone,
        email: member.email,
        isRepresentative: member.isRepresentative
      }))
    };

    const result = await NewProposal(payload);
    
    if (result && (result.result === 'NOK' || result.result === false || result.response?.result === 'NOK')) {
      const errorMsg = getServerMessage(result, 'خطا در ثبت اطلاعات');
      Swal.fire({
        icon: 'error',
        text: errorMsg,
        confirmButtonText: 'تایید'
      });
      return;
    }

    const trackingCode = result?.code || result?.response?.code || result?.data?.code || 'نامشخص';
    const successMsg = getServerMessage(result, 'پیشنهاد شما با موفقیت ثبت شد.');
    
    Swal.fire({
      icon: 'success',
      html: `${successMsg}<br><br>شماره پیگیری شما: <b style="font-size: 18px; color: #16a34a;">${trackingCode}</b>`,
      confirmButtonText: 'تایید'
    });

    resetForm();

  } catch (err: any) {
    const errorMsg = getServerMessage(err?.response?.data, 'خطا در برقراری ارتباط با سرور');
    Swal.fire({
      icon: 'error',
      text: errorMsg,
      confirmButtonText: 'تایید'
    })
  }
}

const resetForm = () => {
  formData.value = {
    title: '',
    details: '',
    companyName: '',
    researchTeam: [createNewMember()],
    projectAchievements: '',
    problemSolvingProcess: '',
    estimatedCost: null,
    requiredExecutionTime: null,
    expectedDelayToProduction: null,
    previousProjectTitle: '',
    projectExecutionPlace: '',
    currentProjectStatus: '',
    projectDescriptionSummary: '',
    patentRegistrationCode: null,
    uploadresume: "",
    uploaddocument: ""
  };
  
  documentFiles.value = [];
  companyResumeFiles.value = [];
  representativeIndex.value = 0;

  const docInput = document.getElementById('doc-upload') as HTMLInputElement;
  if (docInput) docInput.value = '';
  
  const resumeInput = document.getElementById('resume-upload') as HTMLInputElement;
  if (resumeInput) resumeInput.value = '';
}
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <BaseHeading as="h1" size="3xl" weight="bold" class="text-black dark:text-white">
        پیشنهادهای پژوهشی و طرح های بهبود
      </BaseHeading>
    </div>

    <form class="mx-auto w-full max-w-4xl" @submit.prevent="submitForm">
      <BaseCard class="mb-6">
        
        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <div class="grid grid-cols-12 gap-4 mb-6">
            <div class="col-span-12">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                عنوان طرح <span class="text-red-500 font-bold">*</span>
              </label>
              <BaseInput 
                v-model="formData.title" 
                type="text" 
                required 
                oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
                oninput="this.setCustomValidity('')"
              />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                نام شرکت/مرکز تحقیقاتی/دانشگاه پیشنهاد دهنده <span class="text-red-500 font-bold">*</span>
              </label>
              <BaseInput
               v-model="formData.companyName"
               required 
               oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
               oninput="this.setCustomValidity('')"
               type="text" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                نوع پروژه (جزئیات) <span class="text-red-500 font-bold">*</span>
              </label>
              <BaseListbox 
                v-model="formData.details"
                :items="project_categories" 
              />
            </div>
          </div>
        </div>

        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <h3 class="text-lg font-bold text-dark-600 dark:text-white mb-6">
            مشخصات گروه تحقیق
          </h3>
          
          <div class="space-y-4 mb-4">
            <div v-for="(member, index) in formData.researchTeam" :key="index" class="p-4 border border-muted-200 dark:border-muted-800 rounded-md">

              <div class="flex justify-between items-center mb-4 pb-2 border-b border-muted-100 dark:border-muted-800">
                  <span class="text-sm font-semibold text-muted-500 dark:text-muted-400">عضو {{ index + 1 }}</span>
                  
                  <div class="cursor-help" title="توجه، تمامی هماهنگی ها با نماینده انجام خواهد شد.">
                    <button 
                      v-if="representativeIndex !== index" 
                      type="button"
                      @click="representativeIndex = index"
                      class="text-xs px-3 py-1 rounded-md border border-muted-300 dark:border-muted-600 text-muted-500 dark:text-muted-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      انتخاب به عنوان نماینده
                    </button>
                    
                    <span 
                      v-else 
                      class="text-xs px-3 py-1 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800 font-bold flex items-center gap-1"
                    >
                      نماینده گروه
                    </span>
                  </div>
                </div>

              <div class="grid grid-cols-12 gap-3"> 
                <div class="col-span-12 sm:col-span-6 md:col-span-2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">نام <span class="text-red-500 font-bold">*</span></label>
                  <BaseInput
                   v-model="member.name"
                   required
                   @input="validateMemberField(index, 'name')"
                   @blur="validateMemberField(index, 'name')"
                   oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
                   oninput="this.setCustomValidity('')"
                   type="text" size="sm" 
                  />
                  <span v-if="member.touched.name && member.errors.name" class="text-xs text-red-500 mt-1 block">
                    {{ member.errors.name }}
                  </span>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">نام خانوادگی <span class="text-red-500 font-bold">*</span></label>
                  <BaseInput 
                    v-model="member.lastName" 
                    required
                    @input="validateMemberField(index, 'lastName')"
                    @blur="validateMemberField(index, 'lastName')"
                    oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
                    oninput="this.setCustomValidity('')"
                    type="text" size="sm" 
                  />
                  <span v-if="member.touched.lastName && member.errors.lastName" class="text-xs text-red-500 mt-1 block">
                    {{ member.errors.lastName }}
                  </span>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">سمت <span class="text-red-500 font-bold">*</span></label>
                  <BaseInput 
                    v-model="member.position" 
                    required
                    @input="validateMemberField(index, 'position')"
                    @blur="validateMemberField(index, 'position')"
                    oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
                    oninput="this.setCustomValidity('')"
                    type="text" size="sm" 
                  />
                  <span v-if="member.touched.position && member.errors.position" class="text-xs text-red-500 mt-1 block">
                    {{ member.errors.position }}
                  </span>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-3">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                    شماره تماس <span class="text-red-500 font-bold">*</span>
                  </label>
                  <BaseInput 
                    v-model="member.phone" 
                    type="tel" 
                    size="sm" 
                    required
                    @input="validateMemberField(index, 'phone')"
                    @blur="validateMemberField(index, 'phone')"
                    oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
                    oninput="this.setCustomValidity('')" 
                  />
                  <span v-if="member.touched.phone && member.errors.phone" class="text-xs text-red-500 mt-1 block">
                    {{ member.errors.phone }}
                  </span>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-3">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">ایمیل <span class="text-red-500 font-bold">*</span></label>
                  <BaseInput
                   required
                   v-model="member.email"
                   @input="validateMemberField(index, 'email')"
                   @blur="validateMemberField(index, 'email')"
                   oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
                   oninput="this.setCustomValidity('')" 
                   type="email" size="sm" 
                  />
                  <span v-if="member.touched.email && member.errors.email" class="text-xs text-red-500 mt-1 block">
                    {{ member.errors.email }}
                  </span>
                </div>
                
                <div class="col-span-12 flex justify-end mt-2">
                  <BaseButton v-if="formData.researchTeam.length > 1" size="sm" color="danger" type="button" @click="removeTeamMember(index)">
                    حذف عضو
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>

          <BaseButton color="primary" variant="outline" class="w-full mb-4" type="button" @click="addTeamMember">
            افزودن عضو جدید
          </BaseButton>
        </div>

        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <div class="mb-6">
            <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
              دستاوردهای پروژه (صرفه جویی انرژی، مالی، افزایش تولید و ...) 
              <span class="text-red-500 font-bold">*</span>
            </label>
            <BaseInput 
            required
            oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
            oninput="this.setCustomValidity('')" 
            v-model="formData.projectAchievements"
            type="textarea" rows="8" />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
             شرح پیشنهاد(روند حل مساله، ابزارها و روش های مورداستفاده در پروژه)
             
              <span class="text-red-500 font-bold">*</span>
            </label>
            <BaseTextarea 
              required
              v-model="formData.problemSolvingProcess"
              :min-rows="3"
              :max-rows="12"
              auto-resize
            />
        </div>

          <div class="mb-6">
            <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
              سرمایه تقریبی مورد نیاز اجرای طرح (ریال)
              <span class="text-red-500 font-bold">*</span>
            </label>
            <BaseInput
            required
            oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
            oninput="this.setCustomValidity('')" 
            v-model="formData.estimatedCost" 
            type="number" />
          </div>

          <div class="grid grid-cols-12 gap-4 mb-6">
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                مدت زمان مورد نیاز اجرای طرح (ماه)
                <span class="text-red-500 font-bold">*</span>
              </label>
              <BaseInput 
              required
              oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
              oninput="this.setCustomValidity('')" 
              v-model="formData.requiredExecutionTime" 
              type="number" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                مدت زمان احتمالی تحمیل توقف به خط تولید (روز)
                <span class="text-red-500 font-bold">*</span>
              </label>
              <BaseInput
              oninvalid="this.setCustomValidity('لطفا این فرم را پر کنید')" 
              oninput="this.setCustomValidity('')" 
              v-model="formData.expectedDelayToProduction" 
              type="number" />
            </div>
          </div>
        </div>

        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <h3 class="text-lg font-bold text-black dark:text-white mb-6">
            سابقه اجرای طرح پیشنهادی (اختیاری)
          </h3>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">عنوان پروژه قبلی</label>
              <BaseInput v-model="formData.previousProjectTitle" type="text" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">محل اجرا</label>
              <BaseInput v-model="formData.projectExecutionPlace" type="text" />
            </div>
            <div class="col-span-12 md:col-span-12">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">وضعیت حال حاضر پروژه</label>
              <BaseTextarea
              v-model="formData.currentProjectStatus" 
              type="BaseTextarea" 
              :min-rows="3"
              :max-rows="12"
              auto-resize
              />
            </div>
            <div class="col-span-12">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">خلاصه‌ای از توضیحات پروژه قبلی</label>
              <BaseTextarea
              v-model="formData.projectDescriptionSummary" 
              type="BaseTextarea" 
              :min-rows="3"
              :max-rows="12"
              auto-resize
               />
            </div>
          </div>
        </div>

        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
            درصورت داشتن کد اختراع، کد را وارد کنید
          </label>
          <BaseInput v-model="formData.patentRegistrationCode" type="number" />
        </div>

        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <p class="text-base text-red-600 dark:text-red-400">
            شرکت فولاد سیرجان ایرانیان متعهد می گردد تمامی اطلاعات ثبت شده،
            بعنوان اسرار محرمانه تلقی شده و از این اطلاعات هیچ نوع استفاده ای صورت نپذیرد.
          </p>
        </div>

        <div class="px-8 py-6">
          <div class="grid grid-cols-12 gap-6 mb-6">
            
            <!-- بخش مستندات -->
            <div class="col-span-12 md:col-span-6 border p-4 rounded-md border-muted-200 dark:border-muted-800">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-1">
                بارگذاری پروپوزال و مستندات درصورت نیاز
                <span class="text-red-500 font-bold">*</span>
              </label>
              <span class="block text-xs text-muted-500 dark:text-muted-400 mb-4">
                فرمت می‌بایست بصورت Pdf و کمتر از 10 مگابایت باشد
              </span>
              
              <div class="flex items-center gap-3">
                <label for="doc-upload" class="cursor-pointer bg-muted-100 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700 text-sm px-4 py-2 rounded border border-muted-300 dark:border-muted-700 transition-colors">
                  انتخاب فایل
                </label>
                <input id="doc-upload" type="file" accept="application/pdf" multiple @change="handleDocumentsUpload" class="hidden" />
                
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ documentFiles.length > 0 ? `${documentFiles.length} فایل انتخاب شد` : 'فایلی انتخاب نشده است' }}
                </span>
              </div>

              <ul v-if="documentFiles.length > 0" class="mt-3 space-y-2">
                <li v-for="(file, index) in documentFiles" :key="index" class="text-xs text-gray-700 dark:text-gray-300 flex items-center justify-between gap-2 bg-muted-50 dark:bg-muted-800/50 rounded px-2 py-1">
                  <span class="truncate">📎 {{ file.name }}</span>
                  <button type="button" @click="removeDocumentFile(index)" class="text-red-500 hover:text-red-700 font-bold shrink-0" title="حذف فایل">
                    حذف ✕
                  </button>
                </li>
              </ul>

              <div class="mt-4 flex justify-between items-center">
                <span v-if="formData.uploaddocument" class="text-xs text-green-600 font-bold">✔️ آپلود شد</span>
                <span v-else></span>
                <BaseButton type="button" color="info" size="sm" @click="uploadDocumentsToServer">
                  بارگذاری مستندات
                  
                </BaseButton>
              </div>
            </div>
            
            <!-- بخش رزومه -->
            <div class="col-span-12 md:col-span-6 border p-4 rounded-md border-muted-200 dark:border-muted-800">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-1">
                بارگذاری رزومه شرکت (اختیاری)
              </label>
              <span class="block text-xs text-muted-500 dark:text-muted-400 mb-4">
                فرمت می‌بایست بصورت Pdf و کمتر از 10 مگابایت باشد
              </span>

              <div class="flex items-center gap-3">
                <label for="resume-upload" class="cursor-pointer bg-muted-100 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700 text-sm px-4 py-2 rounded border border-muted-300 dark:border-muted-700 transition-colors">
                  انتخاب فایل
                </label>
                <input id="resume-upload" type="file" accept="application/pdf" multiple @change="handleResumeUpload" class="hidden" />
                
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ companyResumeFiles.length > 0 ? `${companyResumeFiles.length} فایل انتخاب شد` : 'فایلی انتخاب نشده است' }}
                </span>
              </div>

              <ul v-if="companyResumeFiles.length > 0" class="mt-3 space-y-2">
                <li v-for="(file, index) in companyResumeFiles" :key="index" class="text-xs text-gray-700 dark:text-gray-300 flex items-center justify-between gap-2 bg-muted-50 dark:bg-muted-800/50 rounded px-2 py-1">
                  <span class="truncate">📎 {{ file.name }}</span>
                  <button type="button" @click="removeResumeFile(index)" class="text-red-500 hover:text-red-700 font-bold shrink-0" title="حذف فایل">
                    حذف ✕
                  </button>
                </li>
              </ul>

              <div class="mt-4 flex justify-between items-center">
                <span v-if="formData.uploadresume" class="text-xs text-green-600 font-bold">✔️ آپلود شد</span>
                <span v-else></span>
                <BaseButton type="button" color="info" size="sm" @click="uploadResumeToServer">
                  بارگذاری رزومه
                </BaseButton>
              </div>
            </div>

          </div>

          <div class="flex justify-center mt-8">
            <BaseButton type="submit" color="success" size="lg">
              ارسال فرم نهایی
            </BaseButton>
          </div>
        </div>

      </BaseCard>
    </form>

    <!-- مودال تایید ارسال نهایی -->
    <div v-if="isConfirmModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">تایید ارسال فرم</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">آیا از ارسال فرم اطمینان دارید؟</p>
        <div class="flex justify-end gap-2">
          <button type="button" @click="cancelSubmit" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">خیر</button>
          <button type="button" @click="confirmSubmit" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">بله</button>
        </div>
      </div>
    </div>
  </div>
</template>
