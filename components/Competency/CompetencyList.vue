<script setup lang="ts">
defineProps<{
  filteredCompetencies: any[]
}>()

const competencySearchQuery = defineModel<string>('searchQuery', { required: true })

const emit = defineEmits<{
  openNewCompTypeModal: []
  openNewCompLvlModal: []
  openNewCompModal: []
  openEditCompModal: [competency: any]
  deleteCompetency: [competency: any]
}>()
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-900 border-x border-b">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-950 dark:text-white">تعریف شایستگی</h2>
        <p class="text-sm text-gray-500 mt-1">لیست شایستگی های تعریف شده</p>
      </div>
      <div class="flex flex-wrap gap-2 mt-3 md:mt-0">
        <button @click="emit('openNewCompTypeModal')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded shadow text-sm transition-all">تعریف نوع شایستگی</button>
        <button @click="emit('openNewCompLvlModal')" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded shadow text-sm transition-all">تعریف سطح شایستگی</button>
        <button @click="emit('openNewCompModal')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow text-sm transition-all">تعریف شایستگی جدید</button>
      </div>
    </div>

    <div class="mb-4 max-w-xs">
      <BaseInput v-model="competencySearchQuery" placeholder="جستجوی شرح شایستگی..." />
    </div>
    <div class="overflow-x-auto">
      <TairoTable rounded="sm" class="w-full border table-fixed">
        <template #header>
          <!-- سرستون‌ها وسط‌چین شدند -->
          <TairoTableHeading class="w-32 !text-center">عنوان شایستگی</TairoTableHeading>
          <TairoTableHeading class="w-28 !text-center">نوع شایستگی</TairoTableHeading>
          <TairoTableHeading class="w-28 !text-center">سطح شایستگی</TairoTableHeading>
          <TairoTableHeading class="w-72 !text-center">توضیحات</TairoTableHeading>
          <TairoTableHeading class="w-20 !text-center">وضعیت</TairoTableHeading>
          <TairoTableHeading class="w-20 !text-center">عملیات</TairoTableHeading>
        </template>
        <TairoTableRow v-for="comp in filteredCompetencies" :key="comp._id">
          <TairoTableCell class="font-medium align-top whitespace-normal break-words py-4 px-2">{{ comp.title }}</TairoTableCell>
          <TairoTableCell class="align-top whitespace-normal break-words py-4 px-2">{{ comp.typeTitle || comp.type?.title || '---' }}</TairoTableCell>
          <TairoTableCell class="align-top whitespace-normal break-words py-4 px-2">{{ comp.levelTitle || comp.level?.title || '---' }}</TairoTableCell>

          <!-- متن توضیحات حداکثر در ۳ خط نمایش داده می‌شود و در صورت طولانی بودن با ... قطع می‌شود -->
          <TairoTableCell class="text-gray-500 text-sm align-top py-4 px-2 whitespace-normal break-words">
            <span class="line-clamp-3 whitespace-normal break-words" :title="comp.description">{{ comp.description || '---' }}</span>
          </TairoTableCell>

          <TairoTableCell class="align-top py-4 px-2">
            <div class="flex justify-center">
              <CompetencyStatusBadge :active="comp.status" />
            </div>
          </TairoTableCell>
          <TairoTableCell class="align-top py-4 px-2">
            <div class="flex justify-center gap-3">
              <button @click="emit('openEditCompModal', comp)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-yellow-500 hover:text-yellow-600" title="ویرایش">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <!-- <button @click="emit('deleteCompetency', comp)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 hover:text-red-700" title="حذف"> -->
                <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button> -->
            </div>
          </TairoTableCell>
        </TairoTableRow>
        <TairoTableRow v-if="filteredCompetencies.length === 0">
          <TairoTableCell colspan="6" class="py-8 text-center text-gray-400">شایستگی ثبت شده ای یافت نشد.</TairoTableCell>
        </TairoTableRow>
      </TairoTable>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>