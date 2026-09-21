<script setup lang="ts">
const props = defineProps<{
  actions?: boolean
}>()

const members = [
  {
    id: 0,
    firstName: 'کلارک',
    lastName: 'اسمیت',
    image: '/img/avatars/3.svg',
    text: 'EC',
    role: 'طراح رابط کاربری / تجربه کاربری',
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
    firstName: 'تارا',
    lastName: 'سونسون',
    image: '/img/avatars/4.svg',
    text: 'TS',
    role: 'معمار نرم‌افزار',
  },
  {
    id: 3,
    firstName: 'نائومی',
    lastName: 'لیورسکی',
    image: undefined,
    text: 'NL',
    role: 'طراح رابط کاربری / تجربه کاربری',
  },
]
</script>

<template>
  <div class="mb-2 space-y-5">
    <div
      v-for="member in members"
      :key="member.id"
      class="flex items-center gap-3"
    >
      <BaseAvatar
        :src="member.image"
        :text="member.text"
        class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
      />
      <div>
        <BaseHeading
          as="h4"
          size="sm"
          weight="light"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>{{ member.firstName }} {{ member.lastName.slice(0, 1) }}.</span>
        </BaseHeading>
        <BaseParagraph size="xs">
          <span class="text-muted-400">
            {{ member.role }}
          </span>
        </BaseParagraph>
      </div>
      <div v-if="props.actions" class="ms-auto flex items-center">
        <BaseButtonIcon
          rounded="lg"
          muted
          class="scale-75"
        >
          <Icon name="ph:phone-duotone" class="size-5" />
        </BaseButtonIcon>
        <BaseButtonIcon
          rounded="lg"
          muted
          class="scale-75"
        >
          <Icon name="ph:video-camera-duotone" class="size-5" />
        </BaseButtonIcon>
      </div>
    </div>
  </div>
</template>
