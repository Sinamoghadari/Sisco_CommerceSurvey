<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({ layout: 'rd' })

const isSubmitting = ref(false)
const isModalOpen = ref(false) // برای کنترل باز و بسته شدن مودال
const submissionStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const getInitialFormData = () => ({
  representativeId : 1 ,
  organizationName: '',
  projectTitle: '',
  researchTeam: [{ id: 1, firstName: '', lastName: '', position: '', phone: '', email: '' }],
  projectType: '',
  achievements: '',
  methodology: '',
  budget: '',
  duration: '',
  stopDuration: '',
  projectDetails: [{ rowNum: 1, title: '', location: '', status: '', description: '' }],
  patentCode: '',
})

const formData = reactive(getInitialFormData())

function addTeamMember() {
  const newId = formData.researchTeam.length > 0 
    ? Math.max(...formData.researchTeam.map(m => m.id)) + 1 
    : 1
    
  formData.researchTeam.push({ 
    id: newId, 
    firstName: '', 
    lastName: '', 
    position: '', 
    phone: '', 
    email: '' 
  })
}

function removeTeamMember(id: number) {
  // حذف عضو
  formData.researchTeam = formData.researchTeam.filter(m => m.id !== id)
  
  // اگر عضوی که حذف شد همان نماینده بود و حداقل یک عضو دیگر باقی مانده است
  if (formData.representativeId === id && formData.researchTeam.length > 0) {
    // تگ نماینده را به اولین فرد باقی‌مانده در لیست بچسبان
    formData.representativeId = formData.researchTeam[0].id
  }
}

function addProjectDetail() {
  const newRowNum = formData.projectDetails.length + 1
  formData.projectDetails.push({ rowNum: newRowNum, title: '', location: '', status: '', description: '' })
}

function removeProjectDetail(index: number) {
  formData.projectDetails.splice(index, 1)
  formData.projectDetails.forEach((project, idx) => { project.rowNum = idx + 1 })
}

// اعتبارسنجی دستی فرم
function validateForm() {
  if (!formData.organizationName || !formData.projectTitle || !formData.projectType || 
      !formData.achievements || !formData.methodology || !formData.budget || !formData.duration) {
    return 'لطفاً تمامی فیلدهای ستاره‌دار و الزامی را پر کنید.'
  }
  
  const isTeamValid = formData.researchTeam.every(m => m.firstName && m.lastName && m.position && m.phone)
  if (!isTeamValid) {
    return 'لطفاً اطلاعات الزامی تمامی اعضای گروه تحقیق را کامل کنید.'
  }
  return null 
}


async function submitProposal() {
  // 1. بررسی پر بودن فیلدها قبل از ارسال
  const validationError = validateForm()
  if (validationError) {
    submissionStatus.value = { type: 'error', message: validationError }
    isModalOpen.value = true
    return
  }

  isSubmitting.value = true
  submissionStatus.value = null

  try {
    
    const response = await $fetch('/api/RD/proposals', {
      method: 'POST',
      body: formData,
    })

    // 2. نمایش مودال موفقیت
    submissionStatus.value = { type: 'success', message: 'طرح شما با موفقیت ارسال شد و در صف بررسی قرار گرفت.' }
    isModalOpen.value = true
    Object.assign(formData, getInitialFormData()) 
    
  } catch (err: any) {
    // گرفتن خطاهای سرور
    submissionStatus.value = { type: 'error', message: err.data?.message || err.message || 'مشکلی پیش آمد.' }
    isModalOpen.value = true
  } finally {
    isSubmitting.value = false
  }
}


const documents = ref<File[]>([])
const companyResume = ref<File[]>([])
function handleDocumentsUpload(event: Event) { /* ... */ }
function handleResumeUpload(event: Event) { /* ... */ }
</script>


<template>
  <div class="w-full">
    <!-- عنوان اصلی صفحه -->
    <div class="text-center mb-8">
      <BaseHeading as="h1" size="3xl" weight="bold" class="text-black dark:text-white">
        پیشنهادهای بهبود عملکرد
      </BaseHeading>
    </div>

    <!-- فرم ارسال طرح -->
    <form @submit.prevent="submitProposal" class="mx-auto w-full max-w-4xl">

      <!-- تمام بخش‌ها در یک BaseCard -->
      <BaseCard class="mb-6">
        <!-- بخش اول: اطلاعات پروژه -->
        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <div class="grid grid-cols-12 gap-4 mb-6">
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                نام شرکت/مرکز تحقیقاتی/دانشگاه
              </label>
              <BaseInput v-model="formData.organizationName" type="text" required />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                عنوان پروژه
              </label>
              <BaseInput v-model="formData.projectTitle" type="text" required />
            </div>
            

            <BaseSelect
              v-model="formData.projectType"
              label="نوع پروژه"
              size="lg"
              :classes="{
                wrapper: 'w-full sm:w-80',
                label: '!text-green-600 dark:!text-green-400 font-bold mb-2'
              }"
            >
              <option value="بهینه سازی تولید">بهینه سازی تولید</option>
              <option value="بهینه سازی انرژی">بهینه سازی انرژی</option>
              <option value="محیط زیست و فولاد سبز">محیط زیست و فولاد سبز</option>
              <option value="ارتقاء کیفیت محصول">ارتقاء کیفیت محصول</option>
              <option value="برنامه ریزی و مدیریت نگهداری تعمیرات">برنامه ریزی و مدیریت نگهداری تعمیرات</option>
            </BaseSelect>

          </div>
        </div>

        <!-- بخش دوم: مشخصات گروه تحقیق -->
        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <h3 class="text-lg font-bold text-dark-600 dark:text-white mb-6">
            مشخصات گروه تحقیق
          </h3>
          
          <div class="space-y-4 mb-4">
            <!-- حلقه اعضای گروه -->
            <div v-for="(member, index) in formData.researchTeam" :key="member.id" class="p-4 border border-muted-200 dark:border-muted-800 rounded-md mb-4">
              
              <!-- بخش هدر کارت (نماینده) -->
              <div class="flex justify-between items-center mb-4 pb-2 border-b border-muted-100 dark:border-muted-800">
                <span class="text-sm font-semibold text-muted-500 dark:text-muted-400">عضو {{ index + 1 }}</span>
                
                <div class="cursor-help" title="توجه، تمامی هماهنگی ها با نماینده انجام خواهد شد.">
                  <button 
                    v-if="formData.representativeId !== member.id" 
                    type="button"
                    @click="formData.representativeId = member.id"
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

              <!-- فیلدهای ورودی -->
              <div class="grid grid-cols-12 gap-3">
                <div class="col-span-12 sm:col-span-6 md:col-span-3">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">نام</label>
                  <BaseInput v-model="member.firstName" type="text" size="sm" required />
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-3">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">نام خانوادگی</label>
                  <BaseInput v-model="member.lastName" type="text" size="sm" required />
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">سمت</label>
                  <BaseInput v-model="member.position" type="text" size="sm" required />
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">شماره تماس</label>
                  <BaseInput v-model="member.phone" type="tel" size="sm" required />
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">ایمیل</label>
                  <BaseInput v-model="member.email" type="email" size="sm" />
                </div>

                <!-- دکمه حذف عضو -->
                <div class="col-span-12 mt-2 flex justify-end">
                  <BaseButton v-if="formData.researchTeam.length > 1" size="sm" color="danger" type="button" @click="removeTeamMember(member.id)">
                    حذف عضو
                  </BaseButton>
                </div>
              </div>
            </div> <!-- پایان حلقه v-for -->
          </div> <!-- پایان space-y-4 -->
          
          <BaseButton color="primary" variant="outline" class="w-full mb-4" type="button" @click="addTeamMember">
            افزودن عضو جدید
          </BaseButton>
        </div>


        <!-- بخش سوم: جزئیات پروژه -->
        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <div class="mb-6">
            <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
              دستاوردهای پروژه (صرفه جویی انرژی، مالی، افزایش تولید و...)
            </label>
            <BaseTextarea v-model="formData.achievements" rows="4" required />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
              روند حل مساله، ابزارها و روش های مورد استفاده
            </label>
            <BaseTextarea v-model="formData.methodology" rows="4" required />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
              برآورد هزینه اجرای پروژه (ریال)
            </label>
            <BaseInput v-model="formData.budget" type="number" required />
          </div>
          <div class="grid grid-cols-12 gap-4 mb-6">
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                مدت زمان اجرا (ماه)
              </label>
              <BaseInput v-model="formData.duration" type="number" required />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                زمان احتمالی توقف تولید (اختیاری) (ماه)
              </label>
              <BaseInput v-model="formData.stopDuration" type="number" />
            </div>
          </div>
        </div>

        <!-- بخش چهارم: سابقه اجرای طرح پیشنهادی -->
        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <h3 class="text-lg font-bold text-black dark:text-white mb-6">
            سابقه اجرای طرح پیشنهادی (اختیاری)
          </h3>
          <div class="space-y-3 mb-4">
            <div v-for="(project, index) in formData.projectDetails" :key="index" class="p-4 border border-muted-200 dark:border-muted-800 rounded-md">
              <div class="grid grid-cols-12 gap-3 items-start">
                <div class="col-span-12 sm:col-span-1">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">ردیف</label>
                  <BaseInput v-model.number="project.rowNum" type="number" disabled size="sm" />
                </div>
                <div class="col-span-12 sm:col-span-2.2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">عنوان</label>
                  <BaseInput v-model="project.title" type="text" size="sm" />
                </div>
                <div class="col-span-12 sm:col-span-2.2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">محل اجرا</label>
                  <BaseInput v-model="project.location" type="text" size="sm" />
                </div>
                <div class="col-span-12 sm:col-span-2.2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">وضعیت</label>
                  <BaseInput v-model="project.status" type="text" size="sm" />
                </div>
                <div class="col-span-12 sm:col-span-2.2">
                  <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">خلاصه توضیحات</label>
                  <BaseInput v-model="project.description" type="text" size="sm" />
                </div>
                <div class="col-span-12 sm:col-span-2 flex items-end">
                  <BaseButton v-if="formData.projectDetails.length > 1" size="sm" color="danger" class="w-full" type="button" @click="removeProjectDetail(index)">
                    حذف
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
          <BaseButton color="primary" variant="outline" class="w-full mb-4" type="button" @click="addProjectDetail">
            افزودن پروژه جدید
          </BaseButton>
        </div>

        <!-- بخش پنجم: اطلاعات اختراع -->
        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-2">
            در صورت داشتن کد اختراع، کد را وارد کنید
          </label>
          <BaseInput v-model="formData.patentCode" type="text" />
        </div>

        <!-- بخش ششم: توضیح محرمانگی -->
        <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
          <p class="text-base text-red-600 dark:text-red-400">
            شرکت فولاد سیرجان ایرانیان متعهد می گردد تمامی اطلاعات ثبت شده،
            بعنوان اسرار محرمانه تلقی شده و از این اطلاعات هیچ نوع استفاده ای صورت نپذیرد.
          </p>
        </div>

        <!-- بخش هفتم: دکمه‌های آپلود و ارسال -->
        <div class="px-8 py-6">
          <div class="grid grid-cols-12 gap-4 mb-6">
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-3">
                بارگزاری مستندات درصورت نیاز (اختیاری)
              </label>
              <input type="file" multiple @change="handleDocumentsUpload" class="w-full px-4 py-2 border border-muted-200 dark:border-muted-800 rounded-md" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-bold text-green-600 dark:text-green-400 mb-3">
                بارگزاری رزومه شرکت (اختیاری)
              </label>
              <input type="file" multiple @change="handleResumeUpload" class="w-full px-4 py-2 border border-muted-200 dark:border-muted-800 rounded-md" />
            </div>
          </div>

          <div class="flex justify-center">
            <BaseButton type="submit" color="success" size="lg" :loading="isSubmitting">
              ارسال طرح
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </form>
    <!-- مودال نمایش پیام -->
  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl text-center">
      
      <!-- آیکون و پیام موفقیت -->
      <div v-if="submissionStatus?.type === 'success'" class="space-y-4">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span class="text-3xl text-green-500">✓</span>
        </div>
        <h3 class="text-xl font-bold text-green-600 dark:text-green-400">موفقیت‌آمیز</h3>
        <p class="text-green-700 dark:text-green-300 font-medium">{{ submissionStatus.message }}</p>
      </div>

      <!-- آیکون و پیام خطا -->
      <div v-else class="space-y-4">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span class="text-3xl text-red-500">✗</span>
        </div>
        <h3 class="text-xl font-bold text-red-600 dark:text-red-400">خطا</h3>
        <p class="text-red-700 dark:text-red-300 font-medium">{{ submissionStatus?.message }}</p>
      </div>

      <div class="mt-8">
        <button @click="isModalOpen = false" class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          بستن
        </button>
      </div>
    </div>
  </div>

  </div>
</template>
