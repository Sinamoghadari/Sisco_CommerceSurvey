<script setup lang="ts">
const comments = [
  {
    id: 0,
    firstName: 'گری',
    lastName: 'اسپلیت‌من',
    image: '/img/avatars/18.svg',
    text: 'GS',
    content:
      'لورم ایپسوم متن ساختگی است. اما برای شما به شکل دیگری مناسب است. این دو چیز یک چیز را تشکیل می‌دهند.',
  },
  {
    id: 1,
    firstName: 'مارک',
    lastName: 'واینستین',
    image: '/img/avatars/14.svg',
    text: 'MW',
    content:
      'لورم ایپسوم متن ساختگی است. اما برای شما به شکل دیگری مناسب است.',
  },
  {
    id: 2,
    firstName: 'کلاریسا',
    lastName: 'م',
    image: '/img/avatars/5.svg',
    text: 'CM',
    content:
      'لورم ایپسوم متن ساختگی است. اما برای شما به شکل دیگری مناسب است. این دو چیز یک چیز را تشکیل می‌دهند.',
  },
  {
    id: 3,
    firstName: 'ادی',
    lastName: 'فلایر',
    image: '/img/avatars/8.svg',
    text: 'EF',
    content:
      'لورم ایپسوم متن ساختگی است. اما برای شما به شکل دیگری مناسب است. این دو چیز یک چیز را تشکیل می‌دهند.',
  },
]
</script>

<template>
  <div class="mb-2 space-y-5">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="flex gap-3"
    >
      <BaseAvatar
        :src="comment.image"
        :text="comment.text"
        size="xs"
        rounded="none"
        mask="blob"
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
          <span>
            {{ comment.firstName }} {{ comment.lastName.slice(0, 1) }}.
          </span>
        </BaseHeading>
        <BaseParagraph size="xs">
          <span class="text-muted-400">
            {{ comment.content }}
          </span>
        </BaseParagraph>
      </div>
    </div>
  </div>
</template>
