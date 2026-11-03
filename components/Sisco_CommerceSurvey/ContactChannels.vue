<script setup lang="ts">
/**
 * کارت «راه‌های ارتباطی با ما» – صفحه‌ی ورود نظرسنجی.
 * معماری آکاردئونی یکسان برای «همه‌ی» کانال‌ها (سایت، ایمیل، لینکدین،
 * اینستاگرام، دبیرخانه، صدای مشتری): هر کانال یک جمع‌شونده‌ی compact
 * است و با کلیک، نشانی/لینک خود را باز می‌کند (و با کلیک دوباره بسته
 * می‌شود) تا صفحه‌ی ورود بدون اسکرول عمودی در دید اول جا شود.
 * بخش «دپارتمان فروش» نیز جمع‌شونده است؛ اعضا زیر جمع‌شونده‌ی «سایر
 * اعضای دپارتمان فروش» گروه شده‌اند و با کلیک روی هر عضو، مشخصات او
 * باز می‌شود.
 * آیکون‌ها به‌صورت SVG درون‌خطی (stroke = currentColor) رندر می‌شوند تا
 * هیچ وابستگی به مسیر فایل خارجی وجود نداشته باشد.
 * شماره‌های همراه شخصی به‌کلی حذف شده‌اند؛ فقط شماره‌های داخلی/دفتری.
 */
import { ref } from 'vue'

interface ContactChannel {
  id: string
  label: string
  /** مقدار واقعی که با بازشدن آکاردئون نمایش داده می‌شود */
  value: string
  href: string
  /** کلید آیکون درون‌خطی */
  icon: 'globe' | 'email' | 'linkedin' | 'instagram' | 'phone' | 'headset'
  note?: string
  /** نمایش مقدار با جهت LTR (ایمیل/دامنه/شبکه‌ها) */
  ltr?: boolean
}

const channels: ContactChannel[] = [
  {
    id: 'site',
    label: 'سایت شرکت',
    value: 'sisco.midhco.ir',
    href: 'https://sisco.midhco.ir',
    icon: 'globe',
    ltr: true
  },
  {
    id: 'email',
    label: 'ایمیل فروش',
    value: 'sales@sisco.midhco.ir',
    href: 'mailto:sales@sisco.midhco.ir',
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

interface SalesMember {
  name: string
  internal: string
  internalTel: string
}

const salesChief = {
  name: 'رضا سرداری',
  role: 'رئیس فروش',
  phone: '۰۳۴۳۱۲۴۵۷۱۶',
  phoneTel: '03431245716'
}

/** فقط شماره‌ی داخلی – بدون شماره‌ی همراه شخصی */
const salesMembers: SalesMember[] = [
  { name: 'حامد فطرس', internal: '۰۳۴۳۱۲۴۵۷۱۵', internalTel: '03431245715' },
  { name: 'علی فتحی زاده', internal: '۰۳۴۳۱۲۴۵۷۱۸', internalTel: '03431245718' },
  { name: 'سیامک فرح بخش', internal: '۰۳۴۳۱۲۴۵۷۸۷', internalTel: '03431245787' },
  { name: 'مجید جلالی', internal: '۰۳۴۳۱۲۴۵۷۹۵', internalTel: '03431245795' },
  { name: 'فرخ کاردان', internal: '۰۳۴۳۱۲۴۵۷۹۲', internalTel: '03431245792' }
]

/* ------------------------- وضعیت آکاردئون‌ها ------------------------- */

/** بخش «راه‌های ارتباطی با ما» – پیش‌فرض بسته */
const isChannelsOpen = ref(false)
/** کانال بازِ فعلی (همه‌ی کانال‌ها الگوی یکسان جمع‌شونده دارند) */
const expandedChannel = ref<string | null>(null)

function toggleChannel(id: string) {
  expandedChannel.value = expandedChannel.value === id ? null : id
}

/** بخش «دپارتمان فروش» – پیش‌فرض بسته */
const isSalesOpen = ref(false)
/** جمع‌شونده‌ی «سایر اعضای دپارتمان فروش» */
const isMembersOpen = ref(false)
/** عضوی که مشخصاتش باز است (یکی در هر لحظه) */
const expandedMember = ref<string | null>(null)

function toggleMember(name: string) {
  expandedMember.value = expandedMember.value === name ? null : name
}
</script>

<template>
  <BaseCard class="overflow-hidden">
    <!-- ================= آکاردئون ۱: راه‌های ارتباطی با ما ================= -->
    <button
      type="button"
      class="flex w-full items-center gap-4 bg-slate-50/80 px-5 py-4 text-right transition-colors hover:bg-slate-100/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/40 sm:px-8"
      :aria-expanded="isChannelsOpen"
      @click="isChannelsOpen = !isChannelsOpen"
    >
      <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-700 text-white">
        <!-- آیکون هدست (درون‌خطی) -->
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-base font-bold text-gray-900 dark:text-white">راه‌های ارتباطی با ما</span>
        <span class="mt-0.5 block truncate text-xs leading-5 text-slate-500 dark:text-slate-400">
          جهت هرگونه ارتباط (انتقادات، پیشنهادات، شکایات و …)
        </span>
      </span>
      <svg viewBox="0 0 24 24" class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform" :class="isChannelsOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div v-if="isChannelsOpen" class="border-t border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-8">
      <!-- همه‌ی کانال‌ها: آیتم جمع‌شونده با الگوی یکسان (مثل «سایت شرکت») -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="channel in channels"
          :key="channel.id"
          class="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <!-- سرآیند جمع‌شونده‌ی کانال -->
          <button
            type="button"
            class="group flex w-full items-center gap-3.5 p-4 text-right"
            :aria-expanded="expandedChannel === channel.id"
            @click="toggleChannel(channel.id)"
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
                class="block truncate text-sm font-bold transition-colors"
                :class="expandedChannel === channel.id
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-gray-900 group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400'"
              >
                {{ expandedChannel === channel.id ? 'بستن' : 'برای مشاهده کلیک کنید' }}
              </span>
            </span>
            <svg viewBox="0 0 24 24" class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform" :class="expandedChannel === channel.id ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <!-- بدنه‌ی بازشده: نشانی/لینک کانال -->
          <div v-if="expandedChannel === channel.id" class="border-t border-slate-200 dark:border-slate-800">
            <a
              :href="channel.href"
              :target="channel.href.startsWith('http') ? '_blank' : undefined"
              :rel="channel.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              class="flex items-center gap-2 px-4 py-3 text-sm font-bold text-green-700 transition-colors hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300"
              :dir="channel.ltr ? 'ltr' : undefined"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              <span class="break-all">{{ channel.value }}</span>
            </a>
            <p v-if="channel.note" class="border-t border-slate-100 px-4 py-2 text-[11px] leading-5 text-slate-400 dark:border-slate-800">
              {{ channel.note }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= آکاردئون ۲: دپارتمان فروش ================= -->
    <button
      type="button"
      class="flex w-full items-center gap-4 border-t border-slate-200 px-5 py-4 text-right transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40 sm:px-8"
      :aria-expanded="isSalesOpen"
      @click="isSalesOpen = !isSalesOpen"
    >
      <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <!-- آیکون کیف کار (درون‌خطی) -->
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-base font-bold text-gray-900 dark:text-white">دپارتمان فروش</span>
        <span class="mt-0.5 block truncate text-xs leading-5 text-slate-500 dark:text-slate-400">رئیس و اعضای دپارتمان فروش</span>
      </span>
      <svg viewBox="0 0 24 24" class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform" :class="isSalesOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div v-if="isSalesOpen" class="border-t border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-8">
      <!-- رئیس فروش (شماره‌ی دفتری) -->
      <div class="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-900/10">
        <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-green-700 text-white">
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

      <!-- سایر اعضا: جمع‌شونده‌ی گروه -->
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-right transition-colors hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/60"
        :aria-expanded="isMembersOpen"
        @click="isMembersOpen = !isMembersOpen"
      >
        <svg viewBox="0 0 24 24" class="h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span class="flex-1 text-sm font-bold text-gray-900 dark:text-white">سایر اعضای دپارتمان فروش</span>
        <span class="text-[11px] font-bold text-slate-400">{{ salesMembers.length }} نفر</span>
        <svg viewBox="0 0 24 24" class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform" :class="isMembersOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <!-- فهرست اعضا: کلیک روی هر عضو ← بازشدن مشخصات -->
      <div v-if="isMembersOpen" class="mt-3 space-y-2">
        <div
          v-for="member in salesMembers"
          :key="member.name"
          class="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2 px-4 py-3 text-right transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
            :aria-expanded="expandedMember === member.name"
            @click="toggleMember(member.name)"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span class="flex-1 text-sm font-bold text-gray-900 dark:text-white">{{ member.name }}</span>
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 flex-shrink-0 text-slate-400 transition-transform" :class="expandedMember === member.name ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div v-if="expandedMember === member.name" class="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
            <p class="flex items-center justify-between gap-2 text-xs">
              <span class="text-slate-500 dark:text-slate-400">داخلی:</span>
              <a
                :href="`tel:${member.internalTel}`"
                dir="ltr"
                class="font-bold text-gray-900 transition-colors hover:text-green-700 dark:text-white dark:hover:text-green-400"
              >
                {{ member.internal }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
