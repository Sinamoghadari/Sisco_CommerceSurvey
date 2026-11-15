<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// علامت‌گذاری تب فعال بر اساس route.path
const activeTab = computed(() => {
  if (route.path.startsWith('/Sisco_Certificates')) return 'certificates'
  if (route.path.startsWith('/Sisco_Graduate')) return 'graduate'
  if (route.path.startsWith('/Sisco_CommerceSurvey')) return 'survey'
  return ''
})

// تب‌های ناوبری سامانه‌های پرسنلی و امور بازرگانی
const navigationTabs = [
  {
    id: 'certificates',
    label: 'دوره‌های آموزشی پرسنل',
    icon: 'certificate',
    path: '/Sisco_Certificates',
  },
  {
    id: 'graduate',
    label: 'اطلاعات تحصیلی پرسنل',
    icon: 'graduate',
    path: '/Sisco_Graduate',
  },
  {
    id: 'survey',
    label: 'نظرسنجی مشتریان امور بازرگانی',
    icon: 'survey',
    path: '/Sisco_CommerceSurvey',
  },
]

// تابع ناوبری
function navigateTo(tab: { path: string }) {
  router.push(tab.path)
}
</script>

<template>
  <!-- کانتینر اصلی: تمام ارتفاع صفحه و بدون اسکرول کلی -->
  <div dir="rtl" class="w-full min-h-screen bg-muted-50 dark:bg-slate-950 flex flex-col">
    <!-- هدر -->
    <div class="sticky top-0 z-50 bg-gradient-to-r from-blue-400 to-blue-300 dark:from-blue-500 dark:to-blue-400 shadow-md flex-shrink-0">
      <div class="relative px-4 py-2 flex items-center justify-between gap-1">
        <!-- لوگو سیسکو -->
        <div class="flex-shrink-0">
          <img
            src="/img/RND/sisco-logo.png"
            alt="SISCO Logo"
            class="h-12 md:h-16 max-w-xs md:max-w-none object-contain"
          >
        </div>

        <!-- شماره‌های پاسخگو: سمت چپ هدر -->
        <div class="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-2 text-white">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-5 h-5 flex-shrink-0"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>

          <div class="flex flex-col text-left">
            <span class="mb-1 text-xs font-medium text-white/90">
              شماره‌های پاسخگو
            </span>

            <div class="flex flex-col text-sm leading-6">
              <a
                href="tel:03431257117"
                dir="ltr"
                class="font-semibold tracking-wide hover:text-blue-950 transition-colors"
              >
                0343125-7117
              </a>

              <a
                href="tel:03431257113"
                dir="ltr"
                class="font-semibold tracking-wide hover:text-blue-950 transition-colors"
              >
                0343125-7113
              </a>
            </div>
          </div>
        </div>

        <!-- تب‌های ناوبری -->
        <div class="flex flex-wrap justify-center items-center gap-2 md:gap-4 flex-1">
          <button
            v-for="tab in navigationTabs"
            :key="tab.id"
            type="button"
            :class="[
              'flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all text-sm md:text-base',
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-100 text-blue-600 dark:text-blue-700 shadow-md'
                : 'text-white hover:bg-white/20 dark:hover:bg-white/10',
            ]"
            :aria-current="activeTab === tab.id ? 'page' : undefined"
            @click="navigateTo(tab)"
          >
            <!-- دوره‌های آموزشی -->
            <svg
              v-if="tab.icon === 'certificate'"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <path d="M12 5v16" />
              <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" />
            </svg>

            <!-- اطلاعات تحصیلی -->
            <svg
              v-else-if="tab.icon === 'graduate'"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
              <path d="M22 10v6" />
              <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
            </svg>

            <!-- نظرسنجی -->
            <svg
              v-else
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M12 11h4" />
              <path d="M12 16h4" />
              <path d="M8 11h.01" />
              <path d="M8 16h.01" />
            </svg>

            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- بخش اسکرول‌شونده: محتوای صفحه و فوتر -->
    <div class="flex-grow overflow-y-auto flex flex-col">
      <div class="flex-grow w-full px-4 py-6 md:py-8">
        <slot />
      </div>

      <!-- فوتر -->
      <div class="bg-gradient-to-r from-blue-400 to-blue-300 dark:from-blue-500 dark:to-blue-400 shadow-md mt-auto flex-shrink-0">
        <div class="px-4 py-12">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <!-- اطلاعات تماس -->
              <div class="flex flex-col items-end">
                <div class="flex items-center gap-3 mb-4">
                  <h3 class="text-white font-bold text-lg">
                    اطلاعات تماس
                  </h3>
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-6 h-6 text-white"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>

                <div class="text-white/90 text-sm leading-relaxed space-y-3 text-right">
                  <div>
                    <p class="font-semibold mb-1">
                      دفتر تهران:
                    </p>
                    <p>خیابان ولیعصربالاتر از پارک ساعی - خیابان ساعی دوم پلاک 6 برج الماس ساعی</p>
                  </div>
                  <div>
                    <p class="font-semibold mb-1">
                      دفتر کرمان:
                    </p>
                    <p>بلوار جمهوری اسلامی، خیابان هزار ویک شب ، انتهای کوچه شماره 17</p>
                  </div>
                  <div>
                    <p class="font-semibold mb-1">
                      مجتمع بردسیر:
                    </p>
                    <p>کرمان، جاده بردسیر ، کیلومتر 7 جاده نگار</p>
                  </div>
                  <div>
                    <p class="font-semibold mb-1">
                      مجتمع سیرجان:
                    </p>
                    <p>کرمان، سیرجان، جاده شیراز، جاده شماره 2 گل گهر</p>
                  </div>
                </div>
              </div>

              <!-- ایمیل -->
              <div class="flex flex-col items-end">
                <div class="flex items-center gap-3 mb-4">
                  <h3 class="text-white font-bold text-lg">
                    ایمیل شرکت
                  </h3>
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-6 h-6 text-white"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div class="text-white/90 text-sm">
                  <a
                    href="mailto:office_kerman_sisco@sisco.midhco.com"
                    class="hover:text-white transition-colors font-medium break-all"
                  >
                    office_kerman_sisco@sisco.midhco.com
                  </a>
                </div>
              </div>

              <!-- شبکه‌های اجتماعی -->
              <div class="flex flex-col items-end">
                <div class="flex items-center gap-3 mb-4">
                  <h3 class="text-white font-bold text-lg">
                    شبکه های اجتماعی
                  </h3>
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6 text-white"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <div class="text-white/90 text-sm">
                  <a
                    href="https://www.linkedin.com/company/sirjan-iranian-steel-co-sisco/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            <div class="border-t border-white/20" />

            <div class="pt-6 text-center text-white/80 text-xs">
              <p>تهیه و توسعه در امور فناوری،اطلاعات و ارتباطات شرکت فولاد سیرجان ایرانیان - تمامی حقوق محفوظ است ©</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* استایل اسکرول‌بار */
::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
