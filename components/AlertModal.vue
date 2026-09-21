<template>
  <TairoModal
    :open="visible"
    size="sm"
    @click="visible = false"
  >
    <!-- Header -->
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          {{ title }}
        </h3>
        <BaseButtonClose @click="visible = false" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-4 flex size-24 items-center justify-center">
          <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="46px" height="46px" viewBox="0 0 416.979 416.979"
	 xml:space="preserve">
<g>
	<path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
		c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786
		c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576
		c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
		c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/>
</g>
</svg>
        </div>
        <p class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5">
          {{ message }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2 justify-end">
          <BaseButton
            color="primary"
            variant="solid"
            @click="visible = false"
          >
            باشه
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
 
// state
const visible = ref(false)
const title = ref('')
const message = ref('')

// تابع عمومی برای استفاده از بیرون
function show(newTitle = 'خطا', newMessage = '') {
  title.value = newTitle
  message.value = newMessage
  visible.value = true
}

// بیرون‌دادن توابع
defineExpose({ show })
</script>
