<script setup lang="ts">
const isModalOpen = ref(false)

function closeModal() {
  isModalOpen.value = false
}
function openModal() {
  isModalOpen.value = true
}

const isModalMdOpen = ref(false)
</script>

<template>
  <!-- Element to trigger the modal -->
  <div class="flex gap-x-2">
    <div class="flex items-end gap-4">
      <BaseButton @click="openModal">
        گفتگوی کوچک
      </BaseButton>
    </div>

    <div class="flex items-end gap-4">
      <BaseButton @click="isModalMdOpen = true">
        گفتگوی متوسط
      </BaseButton>
    </div>
  </div>

  <!-- Modal component -->
  <TairoModal
    :open="isModalOpen"
    size="sm"
    @close="closeModal"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          گفتگوی کوچک
        </h3>
        <BaseButtonClose @click="closeModal" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-4 flex size-24">
          <img
            src="https://media.cssninja.io/shuriken/avatars/3.svg"
            class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
            alt=""
          >
        </div>
        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          دعوت جدید
        </h3>
        <p
          class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5"
        >
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.
        </p>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="closeModal">
            رد
          </BaseButton>
          <BaseButton
            color="primary"
            variant="solid"
            @click="closeModal"
          >
            پذیرفتن
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- Modal component -->
  <TairoModal
    :open="isModalMdOpen"
    size="md"
    @close="isModalMdOpen = false"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3
          class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
        >
          گفتگوی متوسط
        </h3>
        <BaseButtonClose @click="isModalMdOpen = false" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-4 flex size-24">
          <img
            src="https://media.cssninja.io/shuriken/avatars/7.svg"
            class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
            alt=""
          >
        </div>
        <h3
          class="font-heading text-muted-800 text-lg font-medium leading-6 dark:text-white"
        >
          دعوت جدید
        </h3>
        <p
          class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5"
        >
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.
        </p>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="isModalMdOpen = false">
            رد
          </BaseButton>
          <BaseButton
            color="primary"
            variant="solid"
            @click="isModalMdOpen = false"
          >
            پذیرفتن
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>
