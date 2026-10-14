<script setup lang="ts">
/**
 * صفحه‌ی پایان نظرسنجی – نمایش تشکر و خلاصه‌ی اجرا
 * (خروجی فقط در حافظه‌ی کلاینت نگهداری می‌شود؛ endpoint ثبت در این فاز تعریف نشده است)
 */
defineProps<{
  answeredCount: number
  totalQuestions: number
}>()

const emit = defineEmits<{ (e: 'restart'): void }>()
</script>

<template>
  <div class="mx-auto w-full max-w-2xl">
    <BaseCard class="overflow-hidden text-center">
      <div class="relative px-8 pt-12 pb-8 bg-gradient-to-b from-green-50 to-transparent dark:from-green-900/20">
        <div class="mx-auto w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center shadow-xl shadow-green-600/30 success-badge">
          <Icon icon="lucide:check" class="w-10 h-10" />
        </div>
        <h2 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">از همراهی شما سپاسگزاریم</h2>
        <p class="mt-2 text-sm text-muted-500 dark:text-muted-400 leading-7">
          نظرات ارزشمند شما به بهبود مستمر محصولات و خدمات فولاد سیرجان ایرانیان کمک می‌کند.
        </p>
      </div>

      <div class="px-8 pb-8">
        <div class="mb-8 rounded-xl border border-muted-200 dark:border-muted-800 py-4">
          <p class="text-[11px] text-muted-400 mb-1">پاسخ‌های ثبت‌شده</p>
          <p class="font-bold text-primary-600 dark:text-primary-400 text-lg" dir="ltr">{{ answeredCount }} / {{ totalQuestions }}</p>
        </div>

        <BaseButton color="primary" variant="outline" @click="emit('restart')">
          <span class="flex items-center gap-2">
            <Icon icon="lucide:rotate-ccw" class="w-4 h-4" />
            شروع نظرسنجی جدید
          </span>
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.success-badge {
  animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes pop-in {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
