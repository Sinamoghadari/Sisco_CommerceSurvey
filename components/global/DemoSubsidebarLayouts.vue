<script setup lang="ts">
const navigation = [
  {
    name: 'لیست‌ها',
    children: [
      {
        name: 'نمای لیست V1',
        icon: 'ph:list-bullets',
        to: '/layouts',
        exact: true,
      },
      {
        name: 'نمای لیست V2',
        icon: 'ph:list-bullets',
        to: '/layouts/list-view-2',
      },
      {
        name: 'نمای لیست V3',
        icon: 'ph:list-bullets',
        to: '/layouts/list-view-3',
      },
      {
        name: 'نمای لیست V4',
        icon: 'ph:list-bullets',
        to: '/layouts/list-view-4',
      },
    ],
  },
  {
    name: 'لیست‌های فلکسی',
    children: [
      {
        name: 'لیست فلکسی V1',
        icon: 'ph:list-checks',
        to: '/layouts/flex-list-1',
      },
      {
        name: 'لیست فلکسی V2',
        icon: 'ph:list-checks',
        to: '/layouts/flex-list-2',
      },
      {
        name: 'لیست فلکسی V3',
        icon: 'ph:list-checks',
        to: '/layouts/flex-list-3',
      },
    ],
  },
  {
    name: 'لیست‌های جدول',
    children: [
      {
        name: 'لیست جدولی V1',
        icon: 'ph:table-duotone',
        to: '/layouts/table-list-1',
      },
      {
        name: 'لیست جدولی V2',
        icon: 'ph:table-duotone',
        to: '/layouts/table-list-2',
      },
      {
        name: 'لیست جدولی V3',
        icon: 'ph:table-duotone',
        to: '/layouts/table-list-3',
      },
    ],
  },
  {
    name: 'چیدمان‌های فرم',
    children: [
      {
        name: 'شرکت',
        icon: 'ph:article-duotone',
        to: '/layouts/form-1',
      },
      {
        name: 'دکتر',
        icon: 'ph:article-duotone',
        to: '/layouts/form-2',
      },
      {
        name: 'تسویه حساب',
        icon: 'ph:article-duotone',
        to: '/layouts/form-3',
      },
      {
        name: 'رویداد',
        icon: 'ph:article-duotone',
        to: '/layouts/form-4',
      },
      {
        name: 'تولیدکننده رمز عبور',
        icon: 'ph:article-duotone',
        to: '/layouts/form-5',
      },
      {
        name: 'جلسه',
        icon: 'ph:article-duotone',
        to: '/layouts/form-6',
      },
      {
        name: 'تماس',
        icon: 'ph:article-duotone',
        to: '/layouts/contacts/create',
      },
      {
        name: 'ویرایش کاربر',
        icon: 'ph:article-duotone',
        to: '/layouts/user-edit',
      },
      {
        name: 'ویرایش شرکت',
        icon: 'ph:article-duotone',
        to: '/layouts/company-edit',
      },
    ],
  },
  {
    name: 'بارگذاری‌های مکانی',
    children: [
      {
        name: 'بارگذاری مکانی V1',
        icon: 'ph:timer-duotone',
        to: '/layouts/placeload-1',
      },
      {
        name: 'بارگذاری مکانی V2',
        icon: 'ph:timer-duotone',
        to: '/layouts/placeload-2',
      },
      {
        name: 'بارگذاری مکانی V3',
        icon: 'ph:timer-duotone',
        to: '/layouts/placeload-3',
      },
      {
        name: 'بارگذاری مکانی V4',
        icon: 'ph:timer-duotone',
        to: '/layouts/placeload-4',
      },
    ],
  },
  {
    name: 'شبکه کارت‌ها',
    children: [
      {
        name: 'شبکه کارت‌ها V1',
        icon: 'ph:circles-four-duotone',
        to: '/layouts/card-grid-1',
      },
      {
        name: 'شبکه کارت‌ها V2',
        icon: 'ph:circles-four-duotone',
        to: '/layouts/card-grid-2',
      },
      {
        name: 'شبکه کارت‌ها V3',
        icon: 'ph:circles-four-duotone',
        to: '/layouts/card-grid-3',
      },
      {
        name: 'شبکه کارت‌ها V4',
        icon: 'ph:circles-four-duotone',
        to: '/layouts/card-grid-4',
      },
    ],
  },
  {
    name: 'شبکه کاشی‌ها',
    children: [
      {
        name: 'شبکه کاشی V1',
        icon: 'ph:selection-foreground-duotone',
        to: '/layouts/tile-grid-1',
      },
      {
        name: 'شبکه کاشی V2',
        icon: 'ph:selection-foreground-duotone',
        to: '/layouts/tile-grid-2',
      },
      {
        name: 'شبکه کاشی V3',
        icon: 'ph:selection-foreground-duotone',
        to: '/layouts/tile-grid-3',
      },
    ],
  },
  {
    name: 'شبکه کاربران',
    children: [
      {
        name: 'شبکه کاربر V1',
        icon: 'ph:users-three-duotone',
        to: '/layouts/user-grid-1',
      },
      {
        name: 'شبکه کاربر V2',
        icon: 'ph:users-three-duotone',
        to: '/layouts/user-grid-2',
      },
      {
        name: 'شبکه کاربر V3',
        icon: 'ph:users-three-duotone',
        to: '/layouts/user-grid-3',
      },
      {
        name: 'شبکه کاربر V4',
        icon: 'ph:users-three-duotone',
        to: '/layouts/user-grid-4',
      },
    ],
  },
  {
    divider: true,
  },
  {
    name: 'حساب‌های کاربری',
    children: [
      {
        name: 'لیست حساب‌ها',
        icon: 'ph:gradient-duotone',
        to: '/layouts/accounts',
        exact: true,
      },
      {
        name: 'حساب‌های لینک‌شده',
        icon: 'ph:link-simple-horizontal-duotone',
        to: '/layouts/accounts/linked',
        exact: true,
      },
      {
        name: 'قوانین حساب',
        icon: 'ph:gavel-duotone',
        to: '/layouts/accounts/rules',
        exact: true,
      },
      {
        name: 'تراکنش‌ها',
        icon: 'ph:diamonds-four-duotone',
        to: '/layouts/transactions',
        exact: true,
      },
      {
        name: 'کارت‌های اعتباری',
        icon: 'ph:credit-card-duotone',
        to: '/layouts/cards',
        exact: true,
      },
      {
        name: 'ایجاد کارت',
        icon: 'ph:credit-card-duotone',
        to: '/layouts/card/new',
        exact: true,
      },
      {
        name: 'اعضا',
        icon: 'ph:users-duotone',
        to: '/layouts/members',
        exact: false,
      },
      {
        name: 'سرمایه‌گذاری‌ها',
        icon: 'ph:recycle-duotone',
        to: '/layouts/invest',
        exact: true,
      },
      {
        name: 'درخواست اعتبار',
        icon: 'ph:folder-simple-dashed-duotone',
        to: '/layouts/credit',
        exact: true,
      },
      {
        name: 'امنیت مخزن',
        icon: 'ph:shield-check-duotone',
        to: '/layouts/vault',
        exact: true,
      },
    ],
  },
  {
    name: 'پرداخت‌ها',
    children: [
      {
        name: 'خروجی',
        icon: 'ph:arrow-right',
        to: '/layouts/payments',
        exact: true,
      },
      {
        name: 'ورودی',
        icon: 'ph:arrow-left',
        to: '/layouts/payments/incoming',
        exact: true,
      },
      {
        name: 'گیرندگان',
        icon: 'ph:users-duotone',
        to: '/layouts/payments/recipients',
        exact: true,
      },
      {
        name: 'ارسال پرداخت',
        icon: 'ph:paper-plane-right-duotone',
        to: '/layouts/send',
        exact: true,
      },
      {
        name: 'دریافت پرداخت',
        icon: 'ph:receipt-duotone',
        to: '/layouts/receive',
        exact: true,
      },
    ],
  },
  {
    name: 'پروژه‌ها',
    children: [
      {
        name: 'پروژه‌ها نسخه ۱',
        icon: 'ph:leaf-duotone',
        to: '/layouts/projects',
        exact: true,
      },
      {
        name: 'پروژه‌ها نسخه ۲',
        icon: 'ph:leaf-duotone',
        to: '/layouts/projects/project-list-2',
      },
      {
        name: 'پروژه‌ها نسخه ۳',
        icon: 'ph:leaf-duotone',
        to: '/layouts/projects/project-list-3',
      },
      {
        name: 'جزئیات پروژه',
        icon: 'ph:note-duotone',
        to: '/layouts/projects/details',
      },
      {
        name: 'تخته کانبان',
        icon: 'ph:squares-four-duotone',
        to: '/layouts/projects/board',
      },
      {
        name: 'دعوت',
        icon: 'ph:user-plus-duotone',
        to: '/layouts/invite',
      },
    ],
  },
  {
    name: 'احراز هویت',
    children: [
      {
        name: 'ورود',
        icon: 'ph:lock-duotone',
        to: '/auth',
        exact: true,
      },
      {
        name: 'ورود نسخه ۱',
        icon: 'ph:lock-duotone',
        to: '/auth/login-1',
      },
      {
        name: 'ورود نسخه ۲',
        icon: 'ph:lock-duotone',
        to: '/auth/login-2',
      },
      {
        name: 'ورود نسخه ۳',
        icon: 'ph:lock-duotone',
        to: '/auth/login-3',
      },
      {
        name: 'ثبت‌نام V1',
        icon: 'ph:magic-wand-duotone',
        to: '/auth/signup-1',
      },
      {
        name: 'ثبت‌نام V2',
        icon: 'ph:magic-wand-duotone',
        to: '/auth/signup-2',
      },
      {
        name: 'ثبت‌نام V3',
        icon: 'ph:magic-wand-duotone',
        to: '/auth/signup-3',
      },
      {
        name: 'رمز عبور خود را فراموش کرده‌اید؟',
        icon: 'ph:fingerprint-duotone',
        to: '/auth/recover',
      },
    ],
  },
  {
    name: 'زیرصفحات',
    children: [
      {
        name: 'پروفایل',
        icon: 'ph:lock-duotone',
        to: '/layouts/profile',
        exact: true,
      },
      {
        name: 'منوهای پروفایل',
        icon: 'ph:subtract-square-duotone',
        to: '/layouts/profile-settings',
      },
      {
        name: 'ویرایش پروفایل',
        icon: 'ph:pencil-duotone',
        to: '/layouts/profile-edit',
      },
      {
        name: 'کاربر',
        icon: 'ph:user-duotone',
        to: '/layouts/user',
      },
      {
        name: 'شرکت',
        icon: 'ph:buildings-duotone',
        to: '/layouts/company',
      },
      {
        name: 'اطلاعیه‌ها',
        icon: 'ph:notification-duotone',
        to: '/layouts/profile-notifications',
      },
      {
        name: 'نتایج جستجو',
        icon: 'ph:magnifying-glass-duotone',
        to: '/layouts/search-results',
      },
      {
        name: 'جستجوی خالی',
        icon: 'ph:magnifying-glass-duotone',
        to: '/layouts/search-empty',
      },
      {
        name: 'صورت‌حساب SaaS',
        icon: 'ph:credit-card-duotone',
        to: '/layouts/utility-billing',
      },
      {
        name: 'صفحه اقدام نسخه ۱',
        icon: 'ph:lightning-duotone',
        to: '/layouts/utility-action-1',
      },
      {
        name: 'صفحه اقدام نسخه ۲',
        icon: 'ph:lightning-duotone',
        to: '/layouts/utility-action-2',
      },
      {
        name: 'تنظیمات',
        icon: 'ph:gear-six-duotone',
        to: '/layouts/settings',
      },
    ],
  },
  {
    name: 'کاربردی',
    children: [
      {
        name: 'مدارک',
        icon: 'ph:sticker-duotone',
        to: '/layouts/documents',
      },
      {
        name: 'دانلودها',
        icon: 'ph:download-duotone',
        to: '/layouts/downloads',
      },
      {
        name: 'یکپارچگی‌ها',
        icon: 'ph:rocket-duotone',
        to: '/layouts/integrations',
      },
      {
        name: 'پیشنهادات',
        icon: 'ph:gift-duotone',
        to: '/layouts/offers',
      },
      {
        name: 'تایید حساب',
        icon: 'ph:square-logo-duotone',
        to: '/layouts/utility-confirm',
      },
      {
        name: 'ارتقاء',
        icon: 'ph:circle-wavy-check-duotone',
        to: '/layouts/utility-promotion',
      },
      {
        name: 'فاکتور v1',
        icon: 'ph:note-duotone',
        to: '/layouts/utility-invoice',
        exact: true,
      },
      {
        name: 'فاکتور v2',
        icon: 'ph:note-duotone',
        to: '/layouts/utility-invoice-2',
        exact: true,
      },
      {
        name: 'وضعیت سرویس',
        icon: 'ph:notification-duotone',
        to: '/layouts/utility-status',
      },
      {
        name: 'خطای سیستم',
        icon: 'ph:skull-duotone',
        to: '/layouts/utility-error',
      },
    ],
  },
  {
    name: 'مقدمات ورود',
    children: [
      {
        name: 'دو عاملی',
        icon: 'ph:fingerprint-duotone',
        to: '/layouts/onboarding-1',
      },
      {
        name: 'بردینگ برنامه',
        icon: 'ph:coins-duotone',
        to: '/layouts/onboarding-2',
      },
      {
        name: 'انتخاب نقش',
        icon: 'ph:suitcase-duotone',
        to: '/layouts/onboarding-3',
      },
    ],
  },
]
</script>

<template>
  <TairoSubsidebar>
    <template #header>
      <TairoSubsidebarHeader />
    </template>

    <TairoSubsidebarMenu :navigation="navigation" />
  </TairoSubsidebar>
</template>
