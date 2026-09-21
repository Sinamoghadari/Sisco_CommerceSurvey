<script setup lang="ts">
defineProps<{
  currentView: 'taskList' | 'taskManagement' | 'activityManagement'
  filteredTasks: any[]
  taskTypes: any[]
  selectedTaskForManagement: any
  filteredAssignments: any[]
  selectedAssignmentForManagement: any
  filteredActivities: any[]
}>()

const taskSearchQuery = defineModel<string>('taskSearchQuery', { required: true })
const assignmentSearchQuery = defineModel<string>('assignmentSearchQuery', { required: true })
const activitySearchQuery = defineModel<string>('activitySearchQuery', { required: true })

const emit = defineEmits<{
  openTaskTypeModal: []
  openNewTaskModal: []
  navigateToTaskManagement: [task: any]
  openEditTaskModal: [task: any]
  goBackToTasks: []
  openNewAssignmentModal: []
  navigateToActivityManagement: [assignment: any]
  openEditAssignmentModal: [assignment: any]
  goBackToAssignments: []
  openNewActivityModal: []
  openEditActivityModal: [activity: any]
}>()
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <div v-if="currentView === 'taskList'">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-950 dark:text-white">تعریف وظیفه</h2>
          <p class="text-sm text-gray-500 mt-1">لیست وظایف تعریف شده</p>
        </div>
        <div class="flex flex-wrap gap-2 mt-3 md:mt-0">
          <button @click="emit('openTaskTypeModal')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded shadow text-sm transition-all">تعریف نوع وظیفه</button>
          <button @click="emit('openNewTaskModal')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow text-sm transition-all">تعریف وظیفه جدید +</button>
        </div>
      </div>

      <div class="mb-4 max-w-xs">
        <BaseInput v-model="taskSearchQuery" placeholder="جستجوی شرح وظیفه..." />
      </div>

      <div class="overflow-x-auto">
        <TairoTable rounded="sm" class="w-full border">
          <template #header>
            <TairoTableHeading>شرح وظیفه</TairoTableHeading>
            <TairoTableHeading>توضیحات</TairoTableHeading>
            <TairoTableHeading>نوع وظیفه</TairoTableHeading>
            <TairoTableHeading>وضعیت</TairoTableHeading>
            <TairoTableHeading>عملیات</TairoTableHeading>
          </template>
          <TairoTableRow v-for="task in filteredTasks" :key="task._id">
            <TairoTableCell class="font-medium">{{ task.title }}</TairoTableCell>
            <TairoTableCell class="text-gray-500 text-sm">{{ task.description || '---' }}</TairoTableCell>
            <TairoTableCell>{{ taskTypes.find((type) => type._id === task.type)?.title || '---' }}</TairoTableCell>
            <TairoTableCell><CompetencyStatusBadge :active="task.status" /></TairoTableCell>
            <TairoTableCell>
              <div class="flex justify-center gap-3">
                <button @click="emit('navigateToTaskManagement', task)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 hover:text-blue-800" title="مدیریت تکلیف">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </button>
                <button @click="emit('openEditTaskModal', task)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
            </TairoTableCell>
          </TairoTableRow>
          <TairoTableRow v-if="filteredTasks.length === 0"><TairoTableCell colspan="5" class="py-8 text-gray-400">وظیفه‌ای ثبت نشده یا یافت نشد.</TairoTableCell></TairoTableRow>
        </TairoTable>
      </div>
    </div>

    <div v-if="currentView === 'taskManagement'">
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">مدیریت تکلیف: {{ selectedTaskForManagement?.title }}</h2>
        <div class="flex flex-wrap gap-3">
          <button @click="emit('goBackToTasks')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow text-sm transition-all">بازگشت به بخش وظایف</button>
          <button @click="emit('openNewAssignmentModal')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all">تعریف تکلیف +</button>
        </div>
      </div>

      <div class="mb-4 max-w-xs">
        <BaseInput v-model="assignmentSearchQuery" placeholder="جستجوی شرح تکلیف..." />
      </div>

      <div class="overflow-x-auto">
        <TairoTable rounded="sm" class="w-full border">
          <template #header>
            <TairoTableHeading>شرح تکلیف</TairoTableHeading>
            <TairoTableHeading>توضیحات</TairoTableHeading>
            <TairoTableHeading>وضعیت</TairoTableHeading>
            <TairoTableHeading>عملیات</TairoTableHeading>
          </template>
          <TairoTableRow v-for="assign in filteredAssignments" :key="assign._id">
            <TairoTableCell class="font-medium text-right">{{ assign.title }}</TairoTableCell>
            <TairoTableCell class="text-gray-500 text-sm text-right">{{ assign.description || '---' }}</TairoTableCell>
            <TairoTableCell><CompetencyStatusBadge :active="assign.isActive" /></TairoTableCell>
            <TairoTableCell>
              <div class="flex justify-center gap-3">
                <button @click="emit('navigateToActivityManagement', assign)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 hover:text-blue-800" title="مدیریت فعالیت">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </button>
                <button @click="emit('openEditAssignmentModal', assign)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
            </TairoTableCell>
          </TairoTableRow>
          <TairoTableRow v-if="filteredAssignments.length === 0"><TairoTableCell colspan="4" class="py-8 text-gray-400">تکلیفی ثبت نشده یا یافت نشد.</TairoTableCell></TairoTableRow>
        </TairoTable>
      </div>
    </div>

    <div v-if="currentView === 'activityManagement'">
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">مدیریت فعالیت: {{ selectedAssignmentForManagement?.title }}</h2>
        <div class="flex flex-wrap gap-3">
          <button @click="emit('goBackToAssignments')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow text-sm transition-all">بازگشت به بخش تکالیف</button>
          <button @click="emit('openNewActivityModal')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded shadow text-sm transition-all">تعریف فعالیت +</button>
        </div>
      </div>

      <div class="mb-4 max-w-xs">
        <BaseInput v-model="activitySearchQuery" placeholder="جستجوی شرح فعالیت..." />
      </div>

      <div class="overflow-x-auto">
        <TairoTable rounded="sm" class="w-full border">
          <template #header>
            <TairoTableHeading>شرح فعالیت</TairoTableHeading>
            <TairoTableHeading>توضیحات</TairoTableHeading>
            <TairoTableHeading>وضعیت</TairoTableHeading>
            <TairoTableHeading>عملیات</TairoTableHeading>
          </template>
          <TairoTableRow v-for="activity in filteredActivities" :key="activity._id">
            <TairoTableCell class="font-medium text-right">{{ activity.title }}</TairoTableCell>
            <TairoTableCell class="text-gray-500 text-sm text-right">{{ activity.description || '---' }}</TairoTableCell>
            <TairoTableCell><CompetencyStatusBadge :active="activity.status" /></TairoTableCell>
            <TairoTableCell>
              <button @click="emit('openEditActivityModal', activity)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
            </TairoTableCell>
          </TairoTableRow>
          <TairoTableRow v-if="filteredActivities.length === 0"><TairoTableCell colspan="4" class="py-8 text-gray-400">فعالیتی ثبت نشده یا یافت نشد.</TairoTableCell></TairoTableRow>
        </TairoTable>
      </div>
    </div>
  </div>
</template>
