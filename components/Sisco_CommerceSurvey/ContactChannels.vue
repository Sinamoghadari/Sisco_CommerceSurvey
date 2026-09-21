<script setup lang="ts">
/**
 * کارت «راه‌های ارتباطی با ما» – صفحه‌ی ورود نظرسنجی.
 * تمام آیکون‌ها به‌صورت لوکال از img/Sisco_CommerceSurvey/ بارگذاری می‌شوند
 * (بدون هیچ ارجاعی به CDN خارجی).
 */

interface ContactChannel {
  id: string
  label: string
  value: string
  href?: string
  icon: string
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
    icon: '/img/Sisco_CommerceSurvey/globe.svg',
    ltr: true
  },
  {
    id: 'email',
    label: 'ایمیل فروش',
    value: 'sales@sisco.midhco.com',
    href: 'mailto:sales@sisco.midhco.com',
    icon: '/img/Sisco_CommerceSurvey/email.svg',
    ltr: true
  },
  {
    id: 'linkedin',
    label: 'لینکدین شرکت',
    value: 'Sisco (Sirjan Iranian Steel Co.)',
    href: 'https://www.linkedin.com/company/sirjan-iranian-steel-co-sisco/',
    icon: '/img/Sisco_CommerceSurvey/linkedin.svg',
    ltr: true
  },
  {
    id: 'instagram',
    label: 'اینستاگرام شرکت',
    value: 'sisco.ir',
    href: 'https://sisco.ir',
    icon: '/img/Sisco_CommerceSurvey/instagram.svg',
    ltr: true
  },
  {
    id: 'secretariat',
    label: 'تلفن دبیرخانه',
    value: '۰۳۴۳۱۲۴۵۶۱۳',
    href: 'tel:03431245613',
    icon: '/img/Sisco_CommerceSurvey/phone.svg'
  },
  {
    id: 'voc',
    label: 'صدای مشتری',
    value: '۰۳۴۳۱۲۴۵۵۰۰',
    href: 'tel:03431245500',
    icon: '/img/Sisco_CommerceSurvey/headset.svg',
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
    <div class="relative px-8 py-7 border-b border-muted-200 dark:border-muted-800 bg-gradient-to-l from-primary-50/70 to-transparent dark:from-primary-900/20">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
          <img src="/img/Sisco_CommerceSurvey/headset.svg" alt="راه‌های ارتباطی" class="w-6 h-6 channel-icon channel-icon--white" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">راه‌های ارتباطی با ما</h2>
          <p class="text-sm text-muted-500 dark:text-muted-400 mt-1 leading-6">
            جهت هرگونه ارتباط (انتقادات، پیشنهادات، شکایات و …) از راه‌های زیر استفاده کنید:
          </p>
        </div>
      </div>
    </div>

    <!-- کانال‌های ارتباطی -->
    <div class="px-8 py-6 border-b border-muted-200 dark:border-muted-800">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <component
          :is="channel.href ? 'a' : 'div'"
          v-for="channel in channels"
          :key="channel.id"
          :href="channel.href"
          :target="channel.href?.startsWith('http') ? '_blank' : undefined"
          :rel="channel.href?.startsWith('http') ? 'noopener noreferrer' : undefined"
          class="group flex items-center gap-3.5 p-4 rounded-xl border border-muted-200 dark:border-muted-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
        >
          <span class="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 flex items-center justify-center flex-shrink-0 transition-colors">
            <img :src="channel.icon" :alt="channel.label" class="w-6 h-6 channel-icon" />
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-[11px] text-muted-500 dark:text-muted-400 mb-0.5">{{ channel.label }}</span>
            <span
              class="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate"
              :dir="channel.ltr ? 'ltr' : undefined"
              :class="channel.ltr ? 'text-left' : ''"
            >
              {{ channel.value }}
            </span>
            <span v-if="channel.note" class="block text-[10px] text-muted-400 mt-0.5 leading-4">
              {{ channel.note }}
            </span>
          </span>
        </component>
      </div>
    </div>

    <!-- دپارتمان فروش -->
    <div class="px-8 py-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-9 h-9 rounded-lg bg-muted-100 dark:bg-slate-800 text-muted-600 dark:text-muted-300 flex items-center justify-center flex-shrink-0">
          <img src="/img/Sisco_CommerceSurvey/briefcase.svg" alt="دپارتمان فروش" class="w-5 h-5 channel-icon channel-icon--muted" />
        </span>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">دپارتمان فروش</h3>
        <div class="flex-1 h-px bg-gradient-to-l from-muted-200 dark:from-muted-700 to-transparent" />
      </div>

      <!-- رئیس فروش -->
      <div class="mb-4 p-4 rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50/60 dark:bg-primary-900/20 flex flex-wrap items-center gap-3">
        <span class="w-11 h-11 rounded-lg bg-primary-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-500/25">
          <img src="/img/Sisco_CommerceSurvey/users.svg" alt="رئیس فروش" class="w-6 h-6 channel-icon channel-icon--white" />
        </span>
        <div class="flex-1 min-w-0">
          <p class="flex items-center flex-wrap gap-2">
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ salesChief.name }}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-500 text-white">{{ salesChief.role }}</span>
          </p>
        </div>
        <a
          :href="`tel:${salesChief.phoneTel}`"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-300 hover:underline underline-offset-4"
          dir="ltr"
        >
          <img src="/img/Sisco_CommerceSurvey/phone.svg" alt="" class="w-3.5 h-3.5 channel-icon" />
          {{ salesChief.phone }}
        </a>
      </div>

      <!-- سایر اعضا -->
      <p class="text-xs text-muted-500 dark:text-muted-400 mb-3">سایر اعضای دپارتمان فروش:</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="member in salesMembers"
          :key="member.name"
          class="p-4 rounded-xl border border-muted-200 dark:border-muted-800 bg-muted-50/60 dark:bg-slate-900/60"
        >
          <p class="flex items-center gap-2 mb-2.5">
            <img src="/img/Sisco_CommerceSurvey/users.svg" alt="" class="w-4 h-4 channel-icon channel-icon--muted" />
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ member.name }}</span>
          </p>
          <div class="space-y-1.5 text-xs">
            <p class="flex items-center justify-between gap-2">
              <span class="text-muted-500 dark:text-muted-400">همراه:</span>
              <a :href="`tel:${member.mobileTel}`" dir="ltr" class="font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {{ member.mobile }}
              </a>
            </p>
            <p class="flex items-center justify-between gap-2">
              <span class="text-muted-500 dark:text-muted-400">داخلی:</span>
              <a :href="`tel:${member.internalTel}`" dir="ltr" class="font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {{ member.internal }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
/* رنگ‌آمیزی آیکون‌های SVG خطی لوکال (بدون CDN) */
.channel-icon {
  stroke: currentColor;
  filter: invert(36%) sepia(80%) saturate(1600%) hue-rotate(200deg) brightness(95%) contrast(95%);
}
.dark .channel-icon {
  filter: invert(70%) sepia(40%) saturate(900%) hue-rotate(190deg) brightness(105%);
}
.channel-icon--white {
  filter: invert(100%);
}
.channel-icon--muted {
  filter: invert(55%) sepia(6%) saturate(500%) hue-rotate(180deg) brightness(90%);
}
.dark .channel-icon--muted {
  filter: invert(70%) sepia(10%) saturate(300%) hue-rotate(180deg) brightness(95%);
}
</style>
