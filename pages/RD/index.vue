<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RNDApi } from '~/composables/RND/RNDApi'
import Swal from 'sweetalert2'

// تنظیمات متای صفحه
definePageMeta({
  layout: 'rd',
  title: 'نمایش سریع',
  preview: {
    title: 'نمایش سریع',
    description: 'برای استفاده و ردیابی شخصی',
    categories: ['داشبوردها'],
    order: 5,
    new: true,
  },
})

// فراخوانی APIها از Composable
const { GetCurrentProjects } = RNDApi()

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(45)
const { open } = usePanels()

const showAllGoals = ref(false)
const isModalOpen = ref(false)
const selectedProject = ref<any>(null)

function openModal(card: any) {
  selectedProject.value = { ...card }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProject.value = null
  }, 200)
}

function goToProposals() {
  router.push('/RD/Proposals/')
}

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
})

// --- تابع استخراج پیام سرور ---
function getServerMessage(res: any, fallbackMessage: string = 'خطایی رخ داده است') {
  if (!res) return fallbackMessage;
  return res.msg_description || 
         res.data?.msg_description || 
         res.response?.msg_description || 
         res.msg || 
         fallbackMessage;
}

// --- مدیریت داده‌ها و جایگزینی useFetch ---
const data = ref<any>(null)
const pending = ref(true)
const error = ref<any>(null)

const fetchProjects = async () => {
  pending.value = true;
  try {
    const res = await GetCurrentProjects();
    
    if (res && res.result === true) {
      data.value = res.response; // ذخیره اطلاعات در استیت
      
      // در صورت وجود پیام موفقیت برای فراخوانی، نمایش داده شود
      const successMsg = res.response?.msg_description || res.msg;
      if (successMsg && successMsg.includes('موفق')) {
        Swal.fire({ icon: 'success', text: successMsg, timer: 1500, showConfirmButton: false });
      }
    } else {
      const errorMsg = getServerMessage(res, 'خطا در دریافت لیست پروژه‌ها');
      error.value = errorMsg;
      Swal.fire({ icon: 'error', text: errorMsg });
    }
  } catch (err: any) {
    const errorMsg = getServerMessage(err?.response?.data, 'خطا در ارتباط با سرور');
    error.value = errorMsg;
    Swal.fire({ icon: 'error', text: errorMsg });
  } finally {
    pending.value = false;
  }
}

// اجرای دریافت داده‌ها
await fetchProjects();

// مرتب‌سازی پروژه‌ها به طوری که پروژه‌های "خاتمه یافته" در ابتدا قرار گیرند
const sortedProjects = computed(() => {
  let projectsList = []
  if (Array.isArray(data.value)) {
    projectsList = data.value
  } else if (data.value && Array.isArray(data.value.projects)) {
    projectsList = data.value.projects
  } else {
    return []
  }

  return [...projectsList].sort((a, b) => {
    if (a.status === 'خاتمه یافته' && b.status !== 'خاتمه یافته') return -1
    if (b.status === 'خاتمه یافته' && a.status !== 'خاتمه یافته') return 1
    return 0
  })
})

const currentCard = ref()

function openCardPanel(id: number, cards: any) {
  currentCard.value = cards.find((card: any) => card.id === id)
  open('card', { card: currentCard })
}
</script>


<template>
  <!-- کانتینر اصلی صفحه -->
  <div class="max-w-7xl mx-auto space-y-6 relative">
    
    <!-- بخش بالایی: شامل کارت‌های اصلی و کارت ثبت طرح (گرید ۵ ستونه) -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      
      <!-- ستون سمت راست: شامل بیانیه و اهداف -->
      <div class="lg:col-span-3 space-y-6">
        
        <!-- کارت اول: بیانیه تاسیس و اهداف -->
        <BaseCard rounded="lg" class="p-8 bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-transparent border-l-4 border-l-blue-500">
          <div class="flex items-start gap-3 mb-2">
            <!-- <Icon icon="lucide:target" class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" /> -->
            <BaseHeading as="h3" size="lg" weight="bold" class="text-black dark:text-white">
              رؤیت و اهداف راهبردی
            </BaseHeading>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mr-9">
            شرکت فولاد سیرجان ایرانیان، در افق زمانی 1410، با تلاش و همت عالی سرمایه های انسانی خلاق و توانمند، دارای جایگاه سرآمد توسعه فناوری و نوآوری در بین شرکت های فعال در حوزه معدن و صنایع معدنی و پیشرو در بکارگیری و توسعه و تجاری سازی فناوری در کشور خواهد بود. اهداف توسعه محصول و فناوری به شرح زیر است:
          </p>
        </BaseCard>

        <!-- کارت دوم: اهداف و استراتژی‌ها با آیکون‌ها -->
        <BaseCard rounded="lg" class="p-8">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-muted-200 dark:border-muted-800">
            <!-- <Icon icon="lucide:zap" class="w-6 h-6 text-green-600 dark:text-green-400" /> -->
            <BaseHeading as="h3" size="md" weight="bold" class="text-black dark:text-white">
              اهداف و استراتژی‌های راهبردی
            </BaseHeading>
          </div>

          <div class="space-y-4">
            <!-- 3 مورد اول (همیشه نمایان) -->
            <div class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted-50 dark:hover:bg-muted-900/30 transition-colors">
              <!-- <Icon icon="lucide:trending-up" class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" /> -->
              <p class="text-sm text-gray-700 dark:text-gray-300">
                حداکثرسازی ارزش افزوده در زنجیره ارزش تولید فولاد با توسعه ظرفیت های جدید، استفاده بهینه از منابع و ظرفیت های بخش انرژی
              </p>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted-50 dark:hover:bg-muted-900/30 transition-colors">
              <!-- <Icon icon="lucide:search" class="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" /> -->
              <p class="text-sm text-gray-700 dark:text-gray-300">
                شناسایی و ارزیابی فناوری های جایگزین و نوظهور و جایگزینی فناوری های منسوخ
              </p>
            </div>
            <div class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted-50 dark:hover:bg-muted-900/30 transition-colors">
              <!-- <Icon icon="lucide:shield" class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" /> -->
              <p class="text-sm text-gray-700 dark:text-gray-300">
                افزایش خوداتکایی و بومی سازی در توسعه و کاربرد فناوری های پیشرفته
              </p>
            </div>

            <!-- 4 مورد بعدی (مخفی تا زمان کلیک روی دکمه بیشتر) -->
            <div v-show="showAllGoals" class="space-y-4">
              <div class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted-50 dark:hover:bg-muted-900/30 transition-colors">
                <!-- <Icon icon="lucide:leaf" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" /> -->
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  اجرای اصول اقتصاد چرخشی در تمامی بخش های زنجیره تولید و ارتقا عملکرد زیست محیطی
                </p>
              </div>
              <div class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted-50 dark:hover:bg-muted-900/30 transition-colors">
                <!-- <Icon icon="lucide:cog" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" /> -->
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  توسعه و بهبود نظام مدیریت فناوری
                </p>
              </div>
              <div class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted-50 dark:hover:bg-muted-900/30 transition-colors">
                <!-- <Icon icon="lucide:wrench" class="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" /> -->
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  بهینه سازی و رفع مشکلات فرآیندهای واحدهای تولیدی
                </p>
              </div>
              <div class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted-50 dark:hover:bg-muted-900/30 transition-colors">
                <!-- <Icon icon="lucide:book-open" class="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" /> -->
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  بهبود دانش های موجود و گسترش مرزهای دانش، ایجاد شبکه های همکاری و افزایش اثربخشی تحقیقات کاربردی
                </p>
              </div>
            </div>
            
            <!-- دکمه بیشتر / کمتر -->
            <div class="text-center pt-2">
              <button 
                @click="showAllGoals = !showAllGoals"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1 w-full p-2 bg-muted-100 dark:bg-muted-800 rounded-lg transition-colors"
              >
                {{ showAllGoals ? 'نمایش کمتر' : 'مشاهده موارد بیشتر' }}
                <!-- <Icon :icon="showAllGoals ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-4 h-4" /> -->
              </button>
            </div>
          </div>
        </BaseCard>

      </div>

      <!-- ستون سمت چپ: کارت ثبت طرح پیشنهادی (بالای صفحه سمت چپ) -->
      <div class="lg:col-span-2">
        <BaseCard rounded="lg" class="p-8 sticky top-6">
          <div class="mb-6 pb-4 border-b border-muted-200 dark:border-muted-800">
            <div class="flex items-start gap-3 mb-4">
              <!-- <Icon icon="lucide:lightbulb" class="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" /> -->
              <div>
                <BaseHeading as="h3" size="md" weight="bold" class="text-black dark:text-white mb-2">
                  پروژه‌های موردنیاز شرکت
                </BaseHeading>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  دانشگاه‌ها، مراکز تحقیقاتی و شرکت‌های دانش‌بنیان می‌توانند برای ثبت پیشنهادات پروژه‌های تحقیقاتی خود با ما در تماس باشند.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              موضوعات پژوهشی مورد نیاز و اولویت‌دار صنعت چرخه فولاد به صورت مستمر
               از طریق طرح‌های پژوهشی تدوین می‌شوند. برای ثبت طرح پیشنهادی خود، لطفاً بر روی دکمه زیر کلیک کنید
            </p>

            <BaseButton
              rounded="lg"
              color="success"
              size="lg"
              class="w-full font-bold mt-4"
              @click="goToProposals"
            >
              <!-- <Icon icon="lucide:plus" class="w-5 h-5 ml-2" /> -->
              ثبت طرح پیشنهادی
            </BaseButton>
          </div>
        </BaseCard>
      </div>

    </div> <!-- پایان گرید بالایی -->

    <!-- بخش پایینی تمام عرض: کارت جدول پروژه های R&D -->
    <div class="w-full">
      <BaseCard rounded="lg" class="p-8">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-muted-200 dark:border-muted-800">
          <!-- <Icon icon="lucide:flask" class="w-6 h-6 text-blue-600 dark:text-blue-400" /> -->
          <BaseHeading as="h3" size="md" weight="bold" class="text-black dark:text-white">
            پروژه های انجام شده و درحال انجام
          </BaseHeading>
        </div>

        <div class="overflow-x-auto">
          <!-- در صورت لودینگ می‌توانید نشانگر لودینگ قرار دهید -->
          <div v-if="pending" class="text-center py-4 text-gray-500">در حال دریافت اطلاعات...</div>
          
          <table v-else class="w-full border border-muted-200 dark:border-muted-800 rounded-lg overflow-hidden">
            <thead>
              <tr class="bg-muted-100 dark:bg-muted-900">
                <th class="px-6 py-4 text-start font-bold text-black dark:text-white text-sm">نام پروژه</th>
                <th class="px-6 py-4 text-start font-bold text-black dark:text-white text-sm">وضعیت</th>
                <th class="px-6 py-4 text-start font-bold text-black dark:text-white text-sm">جزئیات</th>
              </tr>
            </thead>
            <tbody>
              <!-- حلقه بر روی پروژه‌های مرتب شده (خاتمه یافته‌ها در ابتدا) -->
              <tr
                v-for="card in sortedProjects"
                :key="card.id"
                @click="openModal(card)"
                class="cursor-pointer border-t border-muted-200 dark:border-muted-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
              >
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {{ card.project_name }}
                </td>
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-xs',
                      card.status === 'درحال اجرا'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700'
                        : card.status === 'خاتمه یافته'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                          : card.status === 'درحال بررسی'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    ]"
                  >
                    <Icon
                      :icon="
                        card.status === 'درحال اجرا'
                          ? 'lucide:clock'
                          : card.status === 'خاتمه یافته'
                            ? 'lucide:check-circle'
                            : card.status === 'درحال بررسی'
                              ? 'lucide:eye'
                              : 'lucide:circle'
                      "
                      class="w-4 h-4"
                    />
                    <span>{{ card.status }}</span>
                  </span>
                </td>
                <!-- ستون جدید برای مشخص کردن قابلیت کلیک (مورد 2) -->
                <td class="px-6 py-4 text-sm whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-100/50 dark:text-blue-400 dark:bg-blue-900/30 rounded-lg text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon icon="lucide:info" class="w-4 h-4" />
                    مشاهده توضیحات
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
    
    <!-- مودال نمایش توضیحات پروژه -->
    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      @click.self="closeModal"
    >
      <BaseCard rounded="lg" class="w-full max-w-3xl p-6 relative max-h-[90vh] flex flex-col">
        <!-- دکمه بستن -->
        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
        >
          <Icon icon="lucide:x" class="w-6 h-6" />
        </button>

        <!-- عنوان پروژه در مودال -->
        <div class="pr-10 mb-6 flex-shrink-0">
          <BaseHeading as="h3" size="lg" weight="bold" class="text-black dark:text-white mb-3 leading-tight">
            {{ selectedProject?.project_name }}
          </BaseHeading>
          <span
            :class="[
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-xs border',
              selectedProject?.status === 'درحال اجرا' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 
              selectedProject?.status === 'خاتمه یافته' ? 'bg-green-100 text-green-700 border-green-300' : 
              selectedProject?.status === 'درحال بررسی' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700'
            ]"
          >
            {{ selectedProject?.status }}
          </span>
        </div>

        <!-- توضیحات پروژه -->
        <div class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line overflow-y-auto pr-2 pb-2">
          {{ selectedProject?.description || 'توضیحاتی برای این پروژه ثبت نشده است.' }}
        </div>
      </BaseCard>
    </div>
    
  </div>
</template>
