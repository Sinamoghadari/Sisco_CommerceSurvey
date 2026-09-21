<script setup lang="ts">
export type TrainingTab =
  | 'base'
  | 'courseTypes'
  | 'questionGroups'
  | 'questionnaires'
  | 'courses'
  | 'calendar'
  | 'trainers'
  | 'evaluations'
  | 'evaluationReport'
  | 'tna'
  | 'idp'

const activeTab = defineModel<TrainingTab>({ required: true })

const tabs: { id: TrainingTab; label: string }[] = [
  { id: 'base', label: 'اطلاعات پایه' },
  { id: 'courseTypes', label: 'انواع دوره' },
  { id: 'questionGroups', label: 'گروه سوالات' },
  { id: 'questionnaires', label: 'پرسشنامه‌ها' },
  { id: 'courses', label: 'بانک دوره‌ها' },
  { id: 'calendar', label: 'تقویم برگزاری' },
  { id: 'trainers', label: 'مربیان' },
  { id: 'tna', label: 'برنامه سالانه (TNA)' },
  { id: 'idp', label:  'IDP'},
  { id: 'evaluations', label: 'ارزیابی ها' },
  { id: 'evaluationReport', label: 'گزارش ارزیابی' },
]
</script>

<template>
  <div class="flex bg-gray-50 dark:bg-gray-800 border-x border-b px-4 py-2 gap-2 flex-wrap">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="activeTab = tab.id"
      class="py-2 px-4 rounded text-xs font-semibold transition-all"
      :class="activeTab === tab.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
    >{{ tab.label }}</button>
  </div>
</template>
