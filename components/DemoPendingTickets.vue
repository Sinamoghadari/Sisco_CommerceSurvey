<script setup lang="ts">
const tickets = [
  {
    id: 45651,
    title: 'نمی‌توان تغییرات در پروفایل کاربری را ذخیره کرد',
    content:
      'نمی‌توانم تغییراتی که در پروفایل کاربری خود ایجاد می‌کنم را ذخیره کنم. وقتی روی دکمه ذخیره کلیک می‌کنم، فقط می‌گوید "ناموفق".',
    updated: '۵ ساعت پیش',
    user: {
      name: 'آنا ورینکوف',
      src: '/img/avatars/22.svg',
    },
  },
  {
    id: 45783,
    title: 'نمی‌توان فرصت جدیدی ایجاد کرد',
    content:
      'وقتی سعی می‌کنم یک فرصت جدید ایجاد کنم، پس از کلیک روی دکمه اقدام، به صفحه 404 هدایت می‌شوم.',
    updated: '۲ ساعت پیش',
    user: {
      name: 'جان کمپبل',
      src: '/img/avatars/3.svg',
    },
  },
  {
    id: 45723,
    title: 'پرداخت‌های پی‌پال با خطا مواجه می‌شوند',
    content:
      'وقتی سعی می‌کنم از PayPal به عنوان روش پرداخت استفاده کنم، صفحه به‌طور مداوم لود می‌شود و در نهایت پیام خطا دریافت می‌کنم.',
    updated: '۳۰ دقیقه پیش',
    user: {
      name: 'هاوارد رایس',
      src: '/img/avatars/16.svg',
    },
  },
  {
    id: 45862,
    title: 'نمی‌توانم دارایی‌ها را در پوشه تم پیدا کنم',
    content:
      'من دستورالعمل‌ها را دنبال کردم اما نمی‌توانم دارایی‌ها را در پوشه اصلی پیدا کنم. می‌توانم کمکی بگیرم؟',
    updated: '۶ ساعت پیش',
    user: {
      name: 'چارلز هاینز',
      src: '/img/avatars/8.svg',
    },
  },
]
</script>

<template>
  <div class="divide-muted-200 dark:divide-muted-700 space-y-6 divide-y">
    <div
      v-for="(ticket, index) in tickets"
      :key="ticket.id"
      class="flex flex-col gap-4 sm:flex-row"
      :class="index > 0 ? 'pt-6' : ''"
    >
      <BaseAvatar
        size="lg"
        :src="ticket.user.src"
        :text="ticket.user.name"
        :data-nui-tooltip="ticket.user.name"
      />
      <div class="max-w-md">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          <span>[#{{ ticket.id }}] {{ ticket.title }}</span>
        </BaseHeading>
        <BaseParagraph
          size="sm"
          class="text-muted-500 dark:text-muted-400 mb-1"
        >
          <span>{{ ticket.content }}</span>
        </BaseParagraph>
        <BaseParagraph size="xs" class="text-muted-400">
          <span>به‌روزرسانی شده {{ ticket.updated }}</span>
        </BaseParagraph>
      </div>
      <div class="w-full sm:ms-auto sm:w-auto">
        <BaseButton color="default" class="w-full sm:w-auto">
          <span>مدیریت</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
