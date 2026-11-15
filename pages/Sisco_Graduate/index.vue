<script setup lang="ts">
import { nextTick, ref } from 'vue'
import EducationFormModal from '~/components/Sisco_Graduate/EducationFormModal.vue'
import EducationRecordTable from '~/components/Sisco_Graduate/EducationRecordTable.vue'
import type { EducationRecord } from '~/composables/Sisco_Graduate/useEducationRecords'

// تنظیمات متای صفحه
definePageMeta({
  layout: false,
  title: 'اطلاعات تحصیلی پرسنل',
})

/**
 * این صفحه فقط سمت کلاینت است:
 * رکوردها در state همین کامپوننت نگهداری می‌شوند و به هیچ سروری ارسال نمی‌شوند.
 */
const records = ref<EducationRecord[]>([])
const isModalOpen = ref(false)
const addButtonRef = ref<{ $el?: unknown } | null>(null)

function openModal() {
  isModalOpen.value = true
}

async function closeModal() {
  isModalOpen.value = false
  await nextTick()

  const element = addButtonRef.value?.$el ?? addButtonRef.value
  if (element instanceof HTMLElement) {
    element.focus()
  }
}

/** افزودن رکورد به فهرست حافظه‌ای صفحه */
function addRecord(record: EducationRecord) {
  records.value = [record, ...records.value]
  closeModal()
}

function removeRecord(id: string) {
  records.value = records.value.filter(item => item.id !== id)
}
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
    <!-- سرتیتر صفحه -->
    <div class="mb-6 flex items-center gap-3">
      <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/25">
        <span class="page-icon" aria-hidden="true" />
      </span>
      <h1 class="text-xl font-bold text-muted-800 dark:text-white sm:text-2xl">
        اطلاعات تحصیلی پرسنل
      </h1>
    </div>

    <BaseCard class="overflow-hidden">
      <!-- سربرگ بخش فهرست: عنوان در سمت راست و دکمه در سمت چپ -->
      <div class="flex flex-col gap-3 border-b border-muted-200 px-5 py-4 dark:border-muted-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-bold text-muted-800 dark:text-white sm:text-lg">
            لیست اطلاعات تحصیلی
          </h2>
          <span
            v-if="records.length"
            class="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
          >
            {{ records.length.toLocaleString('fa-IR') }}
          </span>
        </div>

        <BaseButton
          ref="addButtonRef"
          type="button"
          color="primary"
          size="md"
          class="!rounded-lg !bg-violet-600 !px-5 !text-white shadow-sm shadow-violet-600/25 transition-colors hover:!bg-violet-700 sm:self-auto"
          @click="openModal"
        >
          <span class="flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            افزودن اطلاعات تحصیلی
          </span>
        </BaseButton>
      </div>

      <!-- فهرست -->
      <EducationRecordTable :records="records" @remove="removeRecord" />

      <!-- یادآوری محدوده‌ی فرانت‌اند -->
      <div class="border-t border-muted-200 bg-muted-50/70 px-5 py-3 text-xs leading-5 text-muted-500 dark:border-muted-800 dark:bg-muted-950/40 dark:text-muted-400 sm:px-6">
        این فهرست فقط در حافظه‌ی همین صفحه نگهداری می‌شود و با بازخوانی صفحه پاک خواهد شد؛ اطلاعات و
        فایل پیوست به سرور ارسال نمی‌شوند.
      </div>
    </BaseCard>

    <!-- مودال افزودن اطلاعات تحصیلی -->
    <EducationFormModal
      v-if="isModalOpen"
      @close="closeModal"
      @submit="addRecord"
    />
  </div>
</template>

<style scoped>
/* آیکون محلی پروژه؛ رنگ آن از عنصر والد پیروی می‌کند */
.page-icon {
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background-color: currentColor;
  -webkit-mask: url('/img/Sisco_Graduate/graduation-cap.svg') center / contain no-repeat;
  mask: url('/img/Sisco_Graduate/graduation-cap.svg') center / contain no-repeat;
}
</style>
