<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// تب‌های اصلی سامانه
const tabs = [
  { id: 'start', label: '🚀 شروع', path: '/Competencyapi/Getting-Started' },
  { id: 'dashboard', label: '📊 داشبورد', path: '/Competencyapi/Dashboard' },
  { id: 'competency', label: '🎓 مدیریت شایستگی', path: '/Competencyapi/CompetetencyManagement' },
  { id: 'duties', label: '💼 مدیریت وظایف/شغل', path: '/Competencyapi/DutiesManagement' },
  { id: 'employee', label: '👥 شایستگی کارمندان', path: '/Competencyapi/EmployeeCompetetencyManagement' },
]

// تاب فعلی را تعیین می‌کند
const activeTab = computed(() => {
  const pathSegment = route.path.split('/').filter(Boolean).pop()
  const tabMap: Record<string, string> = {
    'Getting-Started': 'start',
    'Dashboard': 'dashboard',
    'CompetetencyManagement': 'competency',
    'DutiesManagement': 'duties',
    'EmployeeCompetetencyManagement': 'employee',
  }
  return tabMap[pathSegment] || 'start'
})

// تغییر تب
const switchTab = (tabPath: string) => {
  router.push(tabPath)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- هدر -->
    <div class="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            🏆 سامانه مدیریت شایستگی سرمایه انسانی
          </h1>
          
          <!-- تب‌های جابجایی -->
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="switchTab(tab.path)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- محتوای اصلی -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <slot />
      </div>
    </div>

    <!-- فوتر -->
    <div class="mt-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-slate-600 dark:text-slate-400 text-sm">
          © ۱۴۰۳ سامانه مدیریت شایستگی | تمامی حقوق محفوظ است
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* جریان صاف برای تغییر تب‌ها */
:deep(.page-enter-active),
:deep(.page-leave-active) {
  transition: opacity 0.3s ease;
}

:deep(.page-enter-from),
:deep(.page-leave-to) {
  opacity: 0;
}
</style>
