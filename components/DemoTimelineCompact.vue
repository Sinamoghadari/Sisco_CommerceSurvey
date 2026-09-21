<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    shape?: 'rounded' | 'curved' | 'full'
  }>(),
  {
    shape: 'rounded',
  },
)

const items = [
  {
    icon: 'ph:phone-duotone',
    image: undefined,
    title: 'به دنی در کلبی زنگ بزن',
    description: 'امروز - ۱۱:۳۰ ق.ظ',
  },
  {
    icon: undefined,
    image: '/img/avatars/3.svg',
    title: 'جلسه با مایک',
    description: 'امروز - ۱۳:۰۰',
  },
  {
    icon: 'ph:chat-circle-duotone',
    image: undefined,
    title: 'پاسخ به پیام‌های آنی',
    description: 'امروز - ۱۳:۴۵',
  },
  {
    icon: undefined,
    image: '/img/avatars/16.svg',
    title: 'جلسه با هرمان',
    description: 'امروز - ۳:۰۰ ب.ظ',
  },
  {
    icon: 'ph:envelope-duotone',
    image: undefined,
    title: 'ارسال کمپین بازاریابی',
    description: 'امروز - ۱۵:۳۰',
  },
  {
    icon: 'ph:selection-all-duotone',
    image: undefined,
    title: 'بررسی پروژه',
    description: 'امروز - ساعت ۱۶:۳۰',
  },
  {
    icon: 'ph:note-duotone',
    image: undefined,
    title: 'نوشتن پیشنهاد برای اندی',
    description: 'امروز - ۱۸:۳۰',
  },
]
</script>

<template>
  <div>
    <!-- Item -->
    <div
      v-for="item in items"
      :key="item.title"
      class="after:border-muted-300 dark:after:border-muted-600 relative flex pb-8 after:absolute after:start-4 after:top-10 after:h-[calc(100%_-_36px)] after:w-px after:border-s after:content-['']"
    >
      <div
        class="border-muted-200 text-muted-400 after:border-muted-300 dark:border-muted-600 dark:bg-muted-700 dark:after:border-muted-600 relative flex size-9 items-center justify-center border bg-white shadow-lg after:absolute after:-end-8 after:top-4 after:h-px after:w-5 after:border-t after:content-['']"
        :class="[
          props.shape === 'rounded' ? 'rounded-md' : '',
          props.shape === 'curved' ? 'rounded-xl' : '',
          props.shape === 'full' ? 'rounded-full' : '',
        ]"
      >
        <Icon
          v-if="item.icon"
          :name="item.icon"
          class=""
        />
        <img
          v-if="item.image"
          :src="item.image"
          class="max-w-full object-cover shadow-sm dark:border-transparent"
          :class="[
            props.shape === 'rounded' ? 'rounded-md' : '',
            props.shape === 'curved' ? 'rounded-xl' : '',
            props.shape === 'full' ? 'rounded-full' : '',
          ]"
          :alt="item.title"
        >
      </div>
      <div class="ms-10">
        <h6
          class="font-heading text-muted-800 text-sm font-medium dark:text-white"
        >
          {{ item.title }}
        </h6>
        <p class="text-muted-400 font-sans text-xs">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>
