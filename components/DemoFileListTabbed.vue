<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  }>(),
  {
    rounded: 'sm',
  },
)

const recentFiles = [
  {
    id: 0,
    icon: '/img/icons/files/zip-format.svg',
    name: 'theme.zip',
    type: 'پوشه فشرده‌شده',
  },
  {
    id: 1,
    icon: '/img/icons/files/doc-2.svg',
    name: 'project_outline.doc',
    type: 'فایل ورد مایکروسافت',
  },
  {
    id: 2,
    icon: '/img/icons/files/pdf.svg',
    name: 'requirements_v3.pdf',
    type: 'فایل PDF',
  },
  {
    id: 3,
    icon: '/img/icons/files/sheet.svg',
    name: 'project_budget.xsls',
    type: 'فایل اکسل مایکروسافت',
  },
  {
    id: 4,
    icon: '/img/icons/files/ai.svg',
    name: 'wireframes.ai',
    type: 'فایل ایلاستریتور',
  },
  {
    id: 5,
    icon: '/img/icons/files/sheet.svg',
    name: 'invoice_recap.xsls',
    type: 'فایل اکسل مایکروسافت',
  },
]

const savedFiles = [
  {
    id: 6,
    icon: '/img/icons/files/ai.svg',
    name: 'header.ai',
    type: 'فایل ایلاستریتور',
  },
  {
    id: 7,
    icon: '/img/icons/files/ai.svg',
    name: 'section.ai',
    type: 'فایل ایلاستریتور',
  },
  {
    id: 8,
    icon: '/img/icons/files/ai.svg',
    name: 'footer.ai',
    type: 'فایل ایلاستریتور',
  },
  {
    id: 9,
    icon: '/img/icons/files/zip-format.svg',
    name: 'theme_assets.zip',
    type: 'پوشه فشرده‌شده',
  },
  {
    id: 10,
    icon: '/img/icons/files/doc-2.svg',
    name: 'team_structure.doc',
    type: 'فایل ورد مایکروسافت',
  },
  {
    id: 11,
    icon: '/img/icons/files/doc-2.svg',
    name: 'meeting_notes.doc',
    type: 'فایل ورد مایکروسافت',
  },
]
</script>

<template>
  <div>
    <DemoTabbedContent
      title="فایل‌ها"
      :labels="['اخیر', 'ذخیره شده']"
      :rounded="props.rounded"
    >
      <template #tab-1>
        <div class="space-y-6">
          <div
            v-for="file in recentFiles"
            :key="file.id"
            class="flex items-center gap-2"
          >
            <img
              :src="file.icon"
              class="size-10"
              :alt="file.name"
            >
            <div>
              <BaseHeading
                as="h3"
                size="sm"
                weight="medium"
                lead="tight"
                class="text-muted-800 dark:text-muted-100"
              >
                <span>{{ file.name }}</span>
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                <span>{{ file.type }}</span>
              </BaseText>
            </div>
            <div class="ms-auto">
              <BaseDropdown
                variant="context"
                label="منوی کشویی"
                placement="bottom-end"
                size="md"
                class="z-20"
                rounded="lg"
              >
                <BaseDropdownItem
                  to="#"
                  title="دانلود"
                  text="دانلود این فایل"
                >
                  <template #start>
                    <Icon
                      name="ph:cloud-arrow-down-duotone"
                      class="me-2 block size-5"
                    />
                  </template>
                </BaseDropdownItem>
                <BaseDropdownItem
                  to="#"
                  title="بارگذاری"
                  text="آپلود نسخه جدید"
                >
                  <template #start>
                    <Icon
                      name="ph:cloud-arrow-up-duotone"
                      class="me-2 block size-5"
                    />
                  </template>
                </BaseDropdownItem>
                <BaseDropdownDivider />
                <BaseDropdownItem
                  to="#"
                  title="مجوزها"
                  text="مدیریت مجوزها"
                >
                  <template #start>
                    <Icon name="ph:lock-duotone" class="me-2 block size-5" />
                  </template>
                </BaseDropdownItem>
                <BaseDropdownItem
                  to="#"
                  title="اشتراک‌گذاری"
                  text="اشتراک‌گذاری این فایل"
                >
                  <template #start>
                    <Icon name="ph:share-duotone" class="me-2 block size-5" />
                  </template>
                </BaseDropdownItem>
                <BaseDropdownDivider />
                <BaseDropdownItem
                  to="#"
                  title="حذف"
                  text="حذف این فایل"
                >
                  <template #start>
                    <Icon name="ph:trash-duotone" class="me-2 block size-5" />
                  </template>
                </BaseDropdownItem>
              </BaseDropdown>
            </div>
          </div>
        </div>
      </template>
      <template #tab-2>
        <div class="space-y-6">
          <div
            v-for="file in savedFiles"
            :key="file.id"
            class="flex items-center gap-2"
          >
            <img
              :src="file.icon"
              class="size-10"
              :alt="file.name"
            >
            <div>
              <BaseHeading
                as="h3"
                size="sm"
                weight="medium"
                lead="tight"
                class="text-muted-800 dark:text-muted-100"
              >
                <span>{{ file.name }}</span>
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                <span>{{ file.type }}</span>
              </BaseText>
            </div>
            <div class="ms-auto">
              <BaseDropdown
                variant="context"
                label="منوی کشویی"
                placement="bottom-end"
                size="md"
                rounded="lg"
                class="z-20"
              >
                <BaseDropdownItem
                  to="#"
                  title="دانلود"
                  text="دانلود این فایل"
                >
                  <template #start>
                    <Icon
                      name="ph:cloud-arrow-down-duotone"
                      class="me-2 block size-5"
                    />
                  </template>
                </BaseDropdownItem>
                <BaseDropdownItem
                  to="#"
                  title="بارگذاری"
                  text="آپلود نسخه جدید"
                >
                  <template #start>
                    <Icon
                      name="ph:cloud-arrow-up-duotone"
                      class="me-2 block size-5"
                    />
                  </template>
                </BaseDropdownItem>
                <BaseDropdownDivider />
                <BaseDropdownItem
                  to="#"
                  title="مجوزها"
                  text="مدیریت مجوزها"
                >
                  <template #start>
                    <Icon name="ph:lock-duotone" class="me-2 block size-5" />
                  </template>
                </BaseDropdownItem>
                <BaseDropdownItem
                  to="#"
                  title="اشتراک‌گذاری"
                  text="اشتراک‌گذاری این فایل"
                >
                  <template #start>
                    <Icon name="ph:share-duotone" class="me-2 block size-5" />
                  </template>
                </BaseDropdownItem>
                <BaseDropdownDivider />
                <BaseDropdownItem
                  to="#"
                  title="حذف"
                  text="حذف این فایل"
                >
                  <template #start>
                    <Icon name="ph:trash-duotone" class="me-2 block size-5" />
                  </template>
                </BaseDropdownItem>
              </BaseDropdown>
            </div>
          </div>
        </div>
      </template>
    </DemoTabbedContent>
  </div>
</template>
