<script setup lang="ts">
const followers = [
  {
    'data-nui-tooltip': 'کلارک اسمیث',
    'src': '/img/avatars/3.svg',
  },
  {
    'data-nui-tooltip': 'جان راونر',
    'src': '/img/avatars/6.svg',
  },
  {
    'data-nui-tooltip': 'Maggie Pitts',
    'src': '/img/avatars/9.svg',
  },
]
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <BaseHeading
        as="h3"
        size="sm"
        weight="semibold"
        lead="tight"
        class="text-muted-800 dark:text-white"
      >
        <span>دنبال‌کنندگان</span>
      </BaseHeading>
      <BaseAvatarGroup
        :avatars="followers"
        size="xs"
        :limit="3"
      />
    </div>
    <div>
      <BaseParagraph size="xs">
        <span class="text-muted-400">
          خبر خوب!
          <NuxtLink
            to="#"
            class="text-primary-500 underline-offset-2 hover:underline"
          >
            کلارک
          </NuxtLink>
          ,
          <NuxtLink
            to="#"
            class="text-primary-500 underline-offset-2 hover:underline"
          >
            جان
          </NuxtLink>
          و
          <NuxtLink
            to="#"
            class="text-primary-500 underline-offset-2 hover:underline"
          >
            مگی
          </NuxtLink>
          اکنون شما را دنبال می‌کنند. کمی وقت بگذارید و پروفایل آنها را بررسی کنید.
        </span>
      </BaseParagraph>
    </div>
  </div>
</template>
