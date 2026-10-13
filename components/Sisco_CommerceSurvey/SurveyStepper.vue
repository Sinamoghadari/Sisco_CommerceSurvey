<script setup lang="ts">
/**
 * استپر بالای ویزارد – کاملاً داینامیک از دسته‌های API ساخته می‌شود
 * (عنوان هر استپ: category.strategy_node_title – شناسه: strategy_node_id).
 * دایره‌ها شماره‌ی بخش را نشان می‌دهند و وضعیت انجام‌شدن/خطا دارند.
 */
defineProps<{
  steps: Array<{ id: string; title: string }>
  currentIndex: number
  progress: number
  status: (index: number) => 'done' | 'active' | 'pending' | 'error'
}>()

const emit = defineEmits<{ (e: 'select', index: number): void }>()
</script>

<template>
  <div class="w-full">
    <!-- دسکتاپ -->
    <ol class="hidden md:flex items-start justify-between relative">
      <li
        v-for="(step, i) in steps"
        :key="step.id"
        class="relative flex-1 flex flex-col items-center text-center group"
      >
        <!-- خط اتصال -->
        <div
          v-if="i < steps.length - 1"
          class="absolute top-5 left-0 w-1/2 h-0.5 transition-colors duration-500"
          :class="i < currentIndex ? 'bg-primary-500' : 'bg-muted-200 dark:bg-muted-700'"
        />
        <div
          v-if="i > 0"
          class="absolute top-5 right-0 w-1/2 h-0.5 transition-colors duration-500"
          :class="i <= currentIndex ? 'bg-primary-500' : 'bg-muted-200 dark:bg-muted-700'"
        />

        <button
          type="button"
          class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
          :class="{
            'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110': status(i) === 'active',
            'bg-green-500 border-green-500 text-white': status(i) === 'done',
            'bg-red-500 border-red-500 text-white': status(i) === 'error',
            'bg-white dark:bg-slate-900 border-muted-300 dark:border-muted-600 text-muted-400': status(i) === 'pending',
            'cursor-pointer hover:scale-105': i <= currentIndex,
            'cursor-default': i > currentIndex
          }"
          :aria-current="status(i) === 'active' ? 'step' : undefined"
          :aria-label="step.title"
          @click="emit('select', i)"
        >
          <Icon v-if="status(i) === 'done'" icon="lucide:check" class="w-5 h-5" />
          <Icon v-else-if="status(i) === 'error'" icon="lucide:alert-triangle" class="w-4 h-4" />
          <span v-else>{{ i + 1 }}</span>
        </button>

        <span
          class="mt-2.5 text-[11px] lg:text-xs font-bold transition-colors leading-5 px-1"
          :class="status(i) === 'active' ? 'text-primary-600 dark:text-primary-400' : status(i) === 'pending' ? 'text-muted-400' : 'text-gray-900 dark:text-muted-200'"
        >
          {{ step.title }}
        </span>
        <span class="text-[10px] text-muted-400">بخش {{ i + 1 }}</span>
      </li>
    </ol>

    <!-- موبایل -->
    <div class="md:hidden">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
            {{ currentIndex + 1 }}
          </span>
          <div>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ steps[currentIndex]?.title }}</p>
            <p class="text-[11px] text-muted-400">بخش {{ currentIndex + 1 }} از {{ steps.length }}</p>
          </div>
        </div>
        <span class="text-xs font-bold text-primary-600 dark:text-primary-400">{{ progress }}٪</span>
      </div>
      <div class="h-2 rounded-full bg-muted-200 dark:bg-muted-700 overflow-hidden">
        <div
          class="h-full rounded-full bg-gradient-to-l from-primary-500 to-primary-400 transition-all duration-500 ease-out"
          :style="{ width: progress + '%' }"
        />
      </div>
    </div>
  </div>
</template>
