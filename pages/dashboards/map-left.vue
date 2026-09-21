<script setup lang="ts">
definePageMeta({
  title: 'نقشه',
  layout: 'empty',
  preview: {
    title: 'پنل نقشه در راست',
    description: 'برای اپ‌های بر پایه لوکیشن',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-map-left.png',
    srcDark: '/img/screens/dashboards-map-left-dark.png',
    order: 23,
  },
})
</script>

<template>
  <div>
    <AddonMapboxPanel />
  </div>
</template>
