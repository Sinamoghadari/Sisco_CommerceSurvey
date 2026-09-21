<script setup lang="ts">
definePageMeta({
  title: 'نقشه',
  layout: 'empty',
  preview: {
    title: 'پنل نقشه در چپ',
    description: 'برای اپ‌های بر پایه لوکیشن',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-map-right.png',
    srcDark: '/img/screens/dashboards-map-right-dark.png',
    order: 24,
  },
})
</script>

<template>
  <div>
    <AddonMapboxPanel reversed />
  </div>
</template>
