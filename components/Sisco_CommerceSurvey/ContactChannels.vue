<script setup lang="ts">
/**
 * کارت «راه‌های ارتباطی با ما» – صفحه‌ی ورود نظرسنجی.
 * آیکون‌ها به‌صورت SVG درون‌خطی (stroke = currentColor) رندر می‌شوند تا
 * هیچ وابستگی به مسیر فایل خارجی وجود نداشته باشد و رنگ‌آمیزی مستقیم با
 * کلاس‌های متن انجام شود (بدون فیلترهای شکننده‌ی invert/sepia که در hover
 * ناپدید می‌شدند).
 */

interface ContactChannel {
  id: string
  label: string
  value: string
  href?: string
  /** کلید آیکون درون‌خطی */
  icon: 'globe' | 'email' | 'linkedin' | 'instagram' | 'phone' | 'headset'
  note?: string
  /** نمایش مقدار با جهت LTR (ایمیل/دامنه/شبکه‌ها) */
  ltr?: boolean
}

interface SalesMember {
  name: string
  mobile: string
  mobileTel: string
  internal: string
  internalTel: string
}

const channels: ContactChannel[] = [
  {
    id: 'site',
    label: 'سایت شرکت',
    value: 'sisco.midhco.com',
    href: 'http://sisco.midhco.com',
    icon: 'globe',
    ltr: true
  },
  {
    id: 'email',
    label: 'ایمیل فروش',
    value: 'sales@sisco.midhco.com',
    href: 'mailto:sales@sisco.midhco.com',
    icon: 'email',
    ltr: true
  },
  {
    id: 'linkedin',
    label: 'لینکدین شرکت',
    value: 'Sisco (Sirjan Iranian Steel Co.)',
    href: 'https://www.linkedin.com/company/sirjan-iranian-steel-co-sisco/',
    icon: 'linkedin',
    ltr: true
  },
  {
    id: 'instagram',
    label: 'اینستاگرام شرکت',
    value: 'sisco.ir',
    href: 'https://sisco.ir',
    icon: 'instagram',
    ltr: true
  },
  {
    id: 'secretariat',
    label: 'تلفن دبیرخانه',
    value: '۰۳۴۳۱۲۴۵۶۱۳',
    href: 'tel:03431245613',
    icon: 'phone'
  },
  {
    id: 'voc',
    label: 'صدای مشتری',
    value: '۰۳۴۳۱۲۴۵۵۰۰',
    href: 'tel:03431245500',
    icon: 'headset',
    note: 'دپارتمان بازرگانی ۲ - فروش ۳ - صدای مشتری ۲'
  }
]

const salesChief = {
  name: 'رضا سرداری',
  role: 'رئیس فروش',
  phone: '۰۳۴۳۱۲۴۵۷۱۶',
  phoneTel: '03431245716'
}

const salesMembers: SalesMember[] = [
  { name: 'حامد فطرس', mobile: '۰۹۱۳۲۹۸۵۱۱۴', mobileTel: '09132985114', internal: '۰۳۴۳۱۲۴۵۷۱۵', internalTel: '03431245715' },
  { name: 'علی فتحی زاده', mobile: '۰۹۱۳۳۸۷۵۳۹۷', mobileTel: '09133875397', internal: '۰۳۴۳۱۲۴۵۷۱۸', internalTel: '03431245718' },
  { name: 'سیامک فرح بخش', mobile: '۰۹۱۳۷۶۷۶۰۴۶', mobileTel: '09137676046', internal: '۰۳۴۳۱۲۴۵۷۸۷', internalTel: '03431245787' },
  { name: 'مجید جلالی', mobile: '۰۹۱۳۵۴۰۶۰۴۶', mobileTel: '09135406046', internal: '۰۳۴۳۱۲۴۵۷۹۵', internalTel: '03431245795' },
  { name: 'فرخ کاردان', mobile: '۰۹۱۳۸۸۶۸۳۱۸', mobileTel: '09138868318', internal: '۰۳۴۳۱۲۴۵۷۹۲', internalTel: '03431245792' }
]
</script>

<template>
  <BaseCard class="overflow-hidden">
    <!-- سربرگ کارت -->
    <div class="relative border-b border-slate-200 bg-slate-50/80 px-8 py-7 dark:border-slate-800 dark:bg-slate-900/40">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-700 text-white">
          <!-- آیکون هدست (درون‌خطی) -->
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">راه‌های ارتباطی با ما</h2>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            جهت هرگونه ارتباط (انتقادات، پیشنهادات، شکایات و …) از راه‌های زیر استفاده کنید:
          </p>
        </div>
      </div>
    </div>

    <!-- کانال‌های ارتباطی -->
    <div class="border-b border-slate-200 px-8 py-6 dark:border-slate-800">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <component
          :is="channel.href ? 'a' : 'div'"
          v-for="channel in channels"
          :key="channel.id"
          :href="channel.href"
          :target="channel.href?.startsWith('http') ? '_blank' : undefined"
          :rel="channel.href?.startsWith('http') ? 'noopener noreferrer' : undefined"
          class="group flex items-center gap-3.5 rounded-lg border border-slate-200 bg-white p-4 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/25 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800/60"
        >
          <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-green-700 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-green-400">
            <!-- آیکون‌های درون‌خطی -->
            <svg v-if="channel.icon === 'globe'" viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <svg v-else-if="channel.icon === 'email'" viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <svg v-else-if="channel.icon === 'linkedin'" viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <svg v-else-if="channel.icon === 'instagram'" viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <path d="M17.5 6.5h.01" />
            </svg>
            <svg v-else-if="channel.icon === 'phone'" viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
            </svg>
          </span>
          <span class="min-w-0 flex-1">
            <span class="mb-0.5 block text-base font-semibold text-slate-600 dark:text-slate-300">{{ channel.label }}</span>
            <span
              class="block truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400"
              :dir="channel.ltr ? 'ltr' : undefined"
              :class="channel.ltr ? 'text-left' : ''"
            >
              {{ channel.value }}
            </span>
            <span v-if="channel.note" class="mt-0.5 block text-[10px] leading-4 text-slate-400">
              {{ channel.note }}
            </span>
          </span>
        </component>
      </div>
    </div>

    <!-- دپارتمان فروش -->
    <div class="px-8 py-6">
      <div class="mb-4 flex items-center gap-3">
        <span class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <!-- آیکون کیف کار (درون‌خطی) -->
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
          </svg>
        </span>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">دپارتمان فروش</h3>
        <div class="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <!-- رئیس فروش -->
      <div class="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-900/10">
        <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-green-700 text-white">
          <!-- آیکون کاربران (درون‌خطی) -->
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </span>
        <div class="min-w-0 flex-1">
          <p class="flex flex-wrap items-center gap-2">
            <span class="text-base font-bold text-gray-900 dark:text-white">{{ salesChief.name }}</span>
            <span class="rounded bg-green-700 px-2 py-0.5 text-[10px] font-bold text-white">{{ salesChief.role }}</span>
          </p>
        </div>
        <a
          :href="`tel:${salesChief.phoneTel}`"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 underline-offset-4 hover:underline dark:text-green-400"
          dir="ltr"
        >
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {{ salesChief.phone }}
        </a>
      </div>

      <!-- سایر اعضا -->
      <p class="mb-3 text-lg font-bold text-gray-900 dark:text-white">سایر اعضای دپارتمان فروش:</p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="member in salesMembers"
          :key="member.name"
          class="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <p class="mb-2.5 flex items-center gap-2">
            <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span class="text-base font-bold text-gray-900 dark:text-white">{{ member.name }}</span>
          </p>
          <div class="space-y-1.5 text-xs">
            <p class="flex items-center justify-between gap-2">
              <span class="text-slate-500 dark:text-slate-400">همراه:</span>
              <a :href="`tel:${member.mobileTel}`" dir="ltr" class="font-bold text-gray-900 transition-colors hover:text-green-700 dark:text-white dark:hover:text-green-400">
                {{ member.mobile }}
              </a>
            </p>
            <p class="flex items-center justify-between gap-2">
              <span class="text-slate-500 dark:text-slate-400">داخلی:</span>
              <a :href="`tel:${member.internalTel}`" dir="ltr" class="font-bold text-gray-900 transition-colors hover:text-green-700 dark:text-white dark:hover:text-green-400">
                {{ member.internal }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
