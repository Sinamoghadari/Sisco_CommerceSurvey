<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
    color?:
      | 'success'
      | 'info'
      | 'warning'
      | 'danger'
      | 'primary'
      | 'lime'
      | 'sky'
  }>(),
  {
    rounded: 'sm',
    color: 'success',
  },
)

const todos = [
  {
    id: 0,
    title: 'تماس با آقای مارکستروم',
    description: 'بررسی وایرفریم‌های اولیه پروژه',
    completed: true,
  },
  {
    id: 1,
    title: 'پایان وایرفریم‌ها',
    description: 'اعمال تمام تغییرات درخواست‌شده و انتشار',
    completed: false,
  },
  {
    id: 2,
    title: 'به‌روزرسانی برگه‌های زمانی',
    description: 'به‌روزرسانی برگه‌های زمانی تمام تیم',
    completed: false,
  },
  {
    id: 3,
    title: 'درخواست پرداخت',
    description: 'ارسال فاکتور پروژه به مشتری',
    completed: false,
  },
  {
    id: 4,
    title: 'تایید مؤلفه‌ها',
    description: 'بررسی سیستم طراحی کامل',
    completed: true,
  },
]

const tasks = ref<string[]>(['Option 0', 'Option 1', 'Option 2'])
</script>

<template>
  <div>
    <DemoTabbedContent
      title="وظایف"
      :labels="['همه', 'مال من']"
      :rounded="props.rounded"
    >
      <template #tab-1>
        <div class="mb-2 space-y-6">
          <label
            v-for="task in todos"
            :key="task.id"
            class="text-muted-300 flex cursor-pointer items-center gap-3"
          >
            <BaseCheckboxAnimated
              v-model="tasks"
              :value="`Option ${task.id}`"
              color="success"
            />
            <div>
              <BaseHeading
                as="h4"
                size="sm"
                weight="light"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>{{ task.title }}</span>
              </BaseHeading>
              <BaseParagraph size="xs">
                <span class="text-muted-400">
                  {{ task.description }}
                </span>
              </BaseParagraph>
            </div>
          </label>
        </div>
      </template>
      <template #tab-2>
        <div class="mb-2 space-y-6">
          <label
            v-for="task in todos"
            :key="task.id"
            class="text-muted-300 flex cursor-pointer items-center gap-3"
          >
            <BaseCheckboxAnimated
              v-model="tasks"
              :value="`Option ${task.id}`"
              :classes="{
                label: [
                  props.color === 'success' && 'text-success-500',
                  props.color === 'info' && 'text-info-500',
                  props.color === 'warning' && 'text-warning-500',
                  props.color === 'danger' && 'text-danger-500',
                  props.color === 'primary' && 'text-primary-500',
                  props.color === 'lime' && 'text-lime-500',
                  props.color === 'sky' && 'text-sky-500',
                ].join(''),
              }"
            />
            <div>
              <BaseHeading
                as="h4"
                size="sm"
                weight="light"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>{{ task.title }}</span>
              </BaseHeading>
              <BaseParagraph size="xs">
                <span class="text-muted-400">
                  {{ task.description }}
                </span>
              </BaseParagraph>
            </div>
          </label>
        </div>
      </template>
    </DemoTabbedContent>
  </div>
</template>
