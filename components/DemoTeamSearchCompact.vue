<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  }>(),
  {
    rounded: 'sm',
  },
)

const members = shallowRef([
  {
    id: 0,
    firstName: 'هرمان',
    lastName: 'مایر',
    image: '/img/avatars/16.svg',
    text: 'HM',
    role: 'مدیر پروژه',
  },
  {
    id: 1,
    firstName: 'سارا',
    lastName: 'کونور',
    image: undefined,
    text: 'SC',
    role: 'توسعه‌دهنده فرانت‌اند',
  },
  {
    id: 2,
    firstName: 'کندرا',
    lastName: 'ویلسون',
    image: '/img/avatars/10.svg',
    text: 'KW',
    role: 'مدیر فروش',
  },
  {
    id: 3,
    firstName: 'جان',
    lastName: 'بکستر',
    image: '/img/avatars/11.svg',
    text: 'JB',
    role: 'سوپروایزر تیم',
  },
  {
    id: 10,
    firstName: 'آملیا',
    lastName: 'اسمیث',
    image: '/img/avatars/12.svg',
    text: 'AS',
    role: 'مدیر نیروی انسانی',
  },
])

const filter = ref('')

const filteredMembers = computed(() => {
  if (!filter.value) {
    return members.value
  }
  const filterRe = new RegExp(filter.value, 'i')
  return members.value.filter((item) => {
    return [item.firstName, item.lastName, item.role].some(item =>
      item.match(filterRe),
    )
  })
})
</script>

<template>
  <div class="mb-2 space-y-1">
    <div class="relative mb-4">
      <BaseInput
        v-model="filter"
        icon="lucide:search"
        placeholder="جستجوی اعضای تیم..."
        :rounded="props.rounded"
      />
    </div>
    <div v-if="filteredMembers.length === 0">
      <div class="flex flex-col items-center py-10 text-center">
        <Icon name="pepicons-print:person" class="text-primary-500 size-10" />
        <BaseHeading
          as="h4"
          size="md"
          weight="medium"
          lead="tight"
        >
          <span>نتیجه‌ی منطبقی یافت نشد</span>
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-400 mx-auto max-w-[240px]">
          <span>
            به نظر می‌رسد که نتوانستیم نتایج مطابقتی پیدا کنیم. از کلمات جستجوی مختلف استفاده کنید.
          </span>
        </BaseParagraph>
      </div>
    </div>
    <div v-else>
      <div
        v-for="member in filteredMembers"
        :key="member.id"
        class="hover:bg-muted-100 focus-within:bg-muted-100 dark:hover:bg-muted-700/70 dark:focus-within:bg-muted-700/70 group flex items-center gap-3 p-2"
        :class="[
          props.rounded === 'sm' ? 'rounded-md' : '',
          props.rounded === 'md' ? 'rounded-lg' : '',
          props.rounded === 'lg' ? 'rounded-xl' : '',
          props.rounded === 'full' ? 'rounded-full' : '',
        ]"
      >
        <BaseAvatar
          :src="member.image"
          :text="member.text"
          size="xs"
          class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 ms-1 shrink-0"
        />
        <div>
          <BaseHeading
            as="h4"
            size="xs"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>
              {{ member.firstName }} {{ member.lastName.slice(0, 1) }}.
            </span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <span class="text-muted-400">
              {{ member.role }}
            </span>
          </BaseParagraph>
        </div>
        <div
          class="ms-auto flex -translate-x-1 items-center opacity-0 transition-all duration-300 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
        >
          <BaseButtonIcon
            to="#"
            :rounded="props.rounded"
            muted
            class="scale-75"
          >
            <Icon name="lucide:arrow-right" class="rtl:rotate-180 size-4" />
          </BaseButtonIcon>
        </div>
      </div>
    </div>
  </div>
</template>
