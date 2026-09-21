<template>
  <div class="flex flex-col items-center">
    <!-- جعبه گره -->
    <div class="mb-8">
      <div class="relative bg-gradient-to-br from-blue-50 dark:from-blue-900 to-blue-100 dark:to-blue-800 border-2 border-blue-500 dark:border-blue-400 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow w-72">
        <!-- فلش بالا برای اتصال به والد -->
        <div v-if="level > 0" class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-blue-400 dark:bg-blue-500"></div>

        <!-- نام -->
        <h3 class="text-lg font-bold text-blue-900 dark:text-blue-100 text-center mb-2">
          {{ node.fullName }}
        </h3>

        <!-- سمت -->
        <p class="text-sm font-semibold text-blue-800 dark:text-blue-200 text-center mb-3">
          {{ node.position }}
        </p>

        <!-- تلفن -->
        <div class="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 text-sm mb-2">
          <Icon icon="lucide:phone" class="w-4 h-4" />
          <span class="font-mono text-xs">{{ node.phone }}</span>
        </div>
      </div>
    </div>

    <!-- فرزندان -->
    <div v-if="node.children && node.children.length > 0" class="flex flex-col items-center">
      <!-- خط اتصال افقی -->
      <div v-if="node.children.length > 1" class="w-full flex justify-center mb-6">
        <div class="h-1 bg-blue-400 dark:bg-blue-500" :style="{ width: `${(node.children.length - 1) * 180 + 72}px` }"></div>
      </div>

      <!-- شبکه فرزندان -->
      <div class="flex flex-wrap justify-center gap-12">
        <div v-for="(child, index) in node.children" :key="child.id" class="flex flex-col items-center">
          <!-- خط عمودی اتصال -->
          <div v-if="node.children.length > 1" class="w-1 h-6 bg-blue-400 dark:bg-blue-500 mx-auto"></div>

          <!-- رندر بازگشتی فرزند -->
          <OrgNode :node="child" :level="level + 1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  node: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
/* انیمیشن برای هاور */
div:hover {
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
