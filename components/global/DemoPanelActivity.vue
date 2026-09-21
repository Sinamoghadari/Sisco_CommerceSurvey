<script setup lang="ts">
import { FocusTrap } from '@headlessui/vue'

const { close } = usePanels()
onKeyStroke('Escape', close)

const activeTab = ref('tab-1')
</script>

<template>
  <div
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 border bg-white"
  >
    <FocusTrap>
      <div class="flex h-16 w-full items-center justify-between px-10">
        <h2
          class="font-heading text-muted-700 text-lg font-semibold dark:text-white"
        >
          فعالیت
        </h2>
        <button
          type="button"
          class="text-muted-400 nui-focus hover:bg-muted-100 focus:bg-muted-100 hover:text-muted-600 focus:text-muted-600 dark:hover:bg-muted-700 dark:focus:bg-muted-700 flex size-10 items-center justify-center rounded-full transition-colors duration-300 dark:hover:text-white dark:focus:text-white"
          @click="close"
        >
          <Icon name="feather:chevron-right" class="size-6 rtl:rotate-180" />
        </button>
      </div>

      <div class="flex h-16 items-center px-10">
        <!-- Tabs -->
        <div
          class="bg-muted-100 dark:bg-muted-700 relative flex h-10 w-full items-center rounded-lg font-sans text-sm"
        >
          <button
            type="button"
            class="nui-focus relative z-20 flex h-full flex-1 items-center justify-center"
            :class="activeTab === 'tab-1' ? 'text-white' : 'text-muted-400'"
            @click="activeTab = 'tab-1'"
          >
            <span>تیم</span>
          </button>
          <button
            type="button"
            class="nui-focus relative z-20 flex h-full flex-1 items-center justify-center"
            :class="activeTab === 'tab-2' ? 'text-white' : 'text-muted-400'"
            @click="activeTab = 'tab-2'"
          >
            <span>پروژه‌ها</span>
          </button>
          <button
            type="button"
            class="nui-focus relative z-20 flex h-full flex-1 items-center justify-center"
            :class="activeTab === 'tab-3' ? 'text-white' : 'text-muted-400'"
            @click="activeTab = 'tab-3'"
          >
            <span>برنامه‌ریزی</span>
          </button>
          <div
            class="bg-primary-600 absolute start-0 top-0 z-10 h-full w-1/3 rounded-lg transition-all duration-300"
            :class="[
              activeTab === 'tab-1' && 'ms-0',
              activeTab === 'tab-2' && 'ms-[33.3%]',
              activeTab === 'tab-3' && 'ms-[66.6%]',
            ]"
          />
        </div>
      </div>

      <div
        class="nui-slimscroll relative h-[calc(100dvh_-_128px)] w-full overflow-y-auto px-10"
      >
        <div class="py-6">
          <!-- Team tab content -->
          <div v-if="activeTab === 'tab-1'" class="space-y-4">
            <!-- Team member -->
            <div
              class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 flex items-center rounded-lg border bg-white p-4"
            >
              <div
                class="relative inline-flex size-9 items-center justify-center rounded-full"
              >
                <img
                  src="/img/avatars/2.svg"
                  class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                  alt=""
                >
              </div>
              <div class="ms-3">
                <h6
                  class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                >
                  شما
                </h6>
                <p class="text-muted-400 font-sans text-xs">
                  مدیر محصول
                </p>
              </div>
              <NuxtLink
                to="#"
                class="border-muted-200 nui-focus text-muted-400 hover:border-primary-500 hover:text-primary-500 dark:border-muted-500 dark:hover:border-primary-500 ms-auto flex size-9 items-center justify-center rounded-full border transition-colors duration-300"
              >
                <Icon name="feather:arrow-right" class="size-4 rtl:rotate-180" />
              </NuxtLink>
            </div>
            <!-- Team member -->
            <div
              class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 flex items-center rounded-lg border bg-white p-4"
            >
              <div
                class="relative inline-flex size-9 items-center justify-center rounded-full"
              >
                <img
                  src="/img/avatars/16.svg"
                  class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                  alt=""
                >
              </div>
              <div class="ms-3">
                <h6
                  class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                >
                  آرون اسپلاتر
                </h6>
                <p class="text-muted-400 font-sans text-xs">
                  توسعه‌دهنده موبایل
                </p>
              </div>
              <NuxtLink
                to="#"
                class="border-muted-200 nui-focus text-muted-400 hover:border-primary-500 hover:text-primary-500 dark:border-muted-500 dark:hover:border-primary-500 ms-auto flex size-9 items-center justify-center rounded-full border transition-colors duration-300"
              >
                <Icon name="feather:arrow-right" class="size-4 rtl:rotate-180" />
              </NuxtLink>
            </div>
            <!-- Team member -->
            <div
              class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 flex items-center rounded-lg border bg-white p-4"
            >
              <div
                class="relative inline-flex size-9 items-center justify-center rounded-full"
              >
                <img
                  src="/img/avatars/3.svg"
                  class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                  alt=""
                >
              </div>
              <div class="ms-3">
                <h6
                  class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                >
                  مایک میلر
                </h6>
                <p class="text-muted-400 font-sans text-xs">
                  توسعه‌دهنده فرانت‌اند
                </p>
              </div>
              <NuxtLink
                to="#"
                class="border-muted-200 nui-focus text-muted-400 hover:border-primary-500 hover:text-primary-500 dark:border-muted-500 dark:hover:border-primary-500 ms-auto flex size-9 items-center justify-center rounded-full border transition-colors duration-300"
              >
                <Icon name="feather:arrow-right" class="size-4 rtl:rotate-180" />
              </NuxtLink>
            </div>
            <!-- Team member -->
            <div
              class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 flex items-center rounded-lg border bg-white p-4"
            >
              <div
                class="relative inline-flex size-9 items-center justify-center rounded-full"
              >
                <img
                  src="/img/avatars/19.svg"
                  class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                  alt=""
                >
              </div>
              <div class="ms-3">
                <h6
                  class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                >
                  کلاریسا پرز
                </h6>
                <p class="text-muted-400 font-sans text-xs">
                  مدیر فروش
                </p>
              </div>
              <NuxtLink
                to="#"
                class="border-muted-200 nui-focus text-muted-400 hover:border-primary-500 hover:text-primary-500 dark:border-muted-500 dark:hover:border-primary-500 ms-auto flex size-9 items-center justify-center rounded-full border transition-colors duration-300"
              >
                <Icon name="feather:arrow-right" class="size-4 rtl:rotate-180" />
              </NuxtLink>
            </div>
          </div>

          <!-- Project tab content -->
          <div v-else-if="activeTab === 'tab-2'" class="space-y-4">
            <!-- Project -->
            <div
              class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 rounded-lg border bg-white p-4"
            >
              <div class="mb-4 flex items-center">
                <div
                  class="relative inline-flex size-9 items-center justify-center rounded-xl"
                >
                  <img
                    src="/img/icons/logos/slicer.svg"
                    class="max-w-full rounded-xl object-cover shadow-sm dark:border-transparent"
                    alt=""
                  >
                </div>
                <div class="ms-3">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    پروژه برش
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    getslicer.io
                  </p>
                </div>
                <NuxtLink
                  to="#"
                  class="border-muted-200 nui-focus text-muted-400 hover:border-primary-500 hover:text-primary-500 dark:border-muted-500 dark:hover:border-primary-500 ms-auto flex size-9 items-center justify-center rounded-full border transition-colors duration-300"
                >
                  <Icon name="feather:arrow-right" class="size-4 rtl:rotate-180" />
                </NuxtLink>
              </div>
              <div
                class="bg-muted-200 dark:bg-muted-800 relative mb-4 h-1 w-full overflow-hidden rounded-lg"
              >
                <div
                  class="bg-primary-500 absolute start-0 top-0 h-full w-[34%] rounded-lg transition duration-300"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-400 font-sans">5/24</span>
                <div class="flex items-end">
                  <div
                    class="dark:border-muted-700 relative -ms-2 inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
                  >
                    <img
                      src="/img/avatars/2.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                  <div
                    class="dark:border-muted-700 relative -ms-2 inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
                  >
                    <img
                      src="/img/avatars/3.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                  <div
                    class="dark:border-muted-700 relative -ms-2 inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
                  >
                    <img
                      src="/img/avatars/4.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                  <div
                    class="bg-muted-200 dark:border-muted-700 dark:bg-muted-800 relative -ms-2 inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
                  >
                    <span
                      class="font-alt text-muted-500 dark:text-muted-300 -ms-1 text-sm font-normal uppercase"
                    >
                      +3
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Project -->
            <div
              class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 rounded-lg border bg-white p-4"
            >
              <div class="mb-4 flex items-center">
                <div
                  class="relative inline-flex size-9 items-center justify-center rounded-xl"
                >
                  <img
                    src="/img/icons/logos/metamovies.svg"
                    class="max-w-full rounded-xl object-cover shadow-sm dark:border-transparent"
                    alt=""
                  >
                </div>
                <div class="ms-3">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    متاموویز بازطراحی شدند
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    metamovies.co
                  </p>
                </div>
                <NuxtLink
                  to="#"
                  class="border-muted-200 nui-focus text-muted-400 hover:border-primary-500 hover:text-primary-500 dark:border-muted-500 dark:hover:border-primary-500 ms-auto flex size-9 items-center justify-center rounded-full border transition-colors duration-300"
                >
                  <Icon name="feather:arrow-right" class="size-4 rtl:rotate-180" />
                </NuxtLink>
              </div>
              <div
                class="bg-muted-200 dark:bg-muted-800 relative mb-4 h-1 w-full overflow-hidden rounded-lg"
              >
                <div
                  class="bg-primary-500 absolute start-0 top-0 h-full w-[88%] rounded-lg transition duration-300"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-400 font-sans">28/31</span>
                <div class="flex items-end">
                  <div
                    class="dark:border-muted-700 relative -ms-2 inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
                  >
                    <img
                      src="/img/avatars/13.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                  <div
                    class="dark:border-muted-700 relative -ms-2 inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
                  >
                    <img
                      src="/img/avatars/24.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- Project -->
            <div
              class="border-muted-200 dark:border-muted-600 dark:bg-muted-700 rounded-lg border bg-white p-4"
            >
              <div class="mb-4 flex items-center">
                <div
                  class="relative inline-flex size-9 items-center justify-center rounded-xl"
                >
                  <img
                    src="/img/icons/logos/fastpizza.svg"
                    class="max-w-full rounded-xl object-cover shadow-sm dark:border-transparent"
                    alt=""
                  >
                </div>
                <div class="ms-3">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    بازطراحی پیتزای سریع
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    fastpizza.com
                  </p>
                </div>
                <NuxtLink
                  to="#"
                  class="border-muted-200 nui-focus text-muted-400 hover:border-primary-500 hover:text-primary-500 dark:border-muted-500 dark:hover:border-primary-500 ms-auto flex size-9 items-center justify-center rounded-full border transition-colors duration-300"
                >
                  <Icon name="feather:arrow-right" class="size-4 rtl:rotate-180" />
                </NuxtLink>
              </div>
              <div
                class="bg-muted-200 dark:bg-muted-800 relative mb-4 h-1 w-full overflow-hidden rounded-lg"
              >
                <div
                  class="bg-primary-500 absolute start-0 top-0 h-full w-[62%] rounded-lg transition duration-300"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-400 font-sans">25/39</span>
                <div class="flex items-end">
                  <div
                    class="dark:border-muted-700 relative -ms-2 inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
                  >
                    <img
                      src="/img/avatars/11.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                  <div
                    class="dark:border-muted-700 relative -ms-2 inline-flex size-8 items-center justify-center rounded-full border-2 border-white"
                  >
                    <img
                      src="/img/avatars/3.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline tab content -->
          <div v-else-if="activeTab === 'tab-3'" class="space-y-4">
            <!-- Timeline -->
            <div>
              <!-- Item -->
              <div
                class="after:border-muted-300 dark:after:border-muted-600 relative flex pb-8 after:absolute after:start-4 after:top-10 after:h-[calc(100dvh_-_36px)] after:w-px after:border-s after:content-['']"
              >
                <div
                  class="border-muted-200 text-muted-400 after:border-muted-300 dark:border-muted-600 dark:bg-muted-700 dark:after:border-muted-600 relative flex size-9 items-center justify-center rounded-full border bg-white shadow-lg after:absolute after:-end-8 after:top-4 after:h-px after:w-5 after:border-t after:content-['']"
                >
                  <Icon name="ph:phone-duotone" class="" />
                </div>
                <div class="ms-10">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    با دنی در کولبی تماس بگیرید
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    امروز - ۱۱:۳۰ ق.ظ
                  </p>
                </div>
              </div>
              <!-- Item -->
              <div
                class="after:border-muted-300 dark:after:border-muted-600 relative flex pb-8 after:absolute after:start-4 after:top-10 after:h-[calc(100dvh_-_36px)] after:w-px after:border-s after:content-['']"
              >
                <div
                  class="border-muted-200 text-muted-400 after:border-muted-300 dark:border-muted-600 dark:bg-muted-700 dark:after:border-muted-600 relative flex size-9 items-center justify-center rounded-full border bg-white shadow-lg after:absolute after:-end-8 after:top-4 after:h-px after:w-5 after:border-t after:content-['']"
                >
                  <div
                    class="relative inline-flex size-7 items-center justify-center rounded-full"
                  >
                    <img
                      src="/img/avatars/3.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                </div>
                <div class="ms-10">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    جلسه با مایک
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    امروز - ۱۳:۰۰
                  </p>
                </div>
              </div>
              <!-- Item -->
              <div
                class="after:border-muted-300 dark:after:border-muted-600 relative flex pb-8 after:absolute after:start-4 after:top-10 after:h-[calc(100dvh_-_36px)] after:w-px after:border-s after:content-['']"
              >
                <div
                  class="border-muted-200 text-muted-400 after:border-muted-300 dark:border-muted-600 dark:bg-muted-700 dark:after:border-muted-600 relative flex size-9 items-center justify-center rounded-full border bg-white shadow-lg after:absolute after:-end-8 after:top-4 after:h-px after:w-5 after:border-t after:content-['']"
                >
                  <Icon name="ph:chat-circle-duotone" class="" />
                </div>
                <div class="ms-10">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    به پیام آنی پاسخ دهید
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    امروز - ۱۳:۴۵
                  </p>
                </div>
              </div>
              <!-- Item -->
              <div
                class="after:border-muted-300 dark:after:border-muted-600 relative flex pb-8 after:absolute after:start-4 after:top-10 after:h-[calc(100dvh_-_36px)] after:w-px after:border-s after:content-['']"
              >
                <div
                  class="border-muted-200 text-muted-400 after:border-muted-300 dark:border-muted-600 dark:bg-muted-700 dark:after:border-muted-600 relative flex size-9 items-center justify-center rounded-full border bg-white shadow-lg after:absolute after:-end-8 after:top-4 after:h-px after:w-5 after:border-t after:content-['']"
                >
                  <div
                    class="relative inline-flex size-7 items-center justify-center rounded-full"
                  >
                    <img
                      src="/img/avatars/18.svg"
                      class="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                      alt=""
                    >
                  </div>
                </div>
                <div class="ms-10">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    جلسه با جان
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    امروز - ۳:۰۰ ب.ظ
                  </p>
                </div>
              </div>
              <!-- Item -->
              <div
                class="after:border-muted-300 dark:after:border-muted-600 relative flex pb-8 after:absolute after:start-4 after:top-10 after:h-[calc(100dvh_-_36px)] after:w-px after:border-s after:content-['']"
              >
                <div
                  class="border-muted-200 text-muted-400 after:border-muted-300 dark:border-muted-600 dark:bg-muted-700 dark:after:border-muted-600 relative flex size-9 items-center justify-center rounded-full border bg-white shadow-lg after:absolute after:-end-8 after:top-4 after:h-px after:w-5 after:border-t after:content-['']"
                >
                  <Icon name="ph:envelope-duotone" class="" />
                </div>
                <div class="ms-10">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    ارسال کمپین بازاریابی
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    امروز - ۱۵:۳۰
                  </p>
                </div>
              </div>
              <!-- Item -->
              <div
                class="after:border-muted-300 dark:after:border-muted-600 relative flex pb-8 after:absolute after:start-4 after:top-10 after:h-[calc(100dvh_-_36px)] after:w-px after:border-s after:content-['']"
              >
                <div
                  class="border-muted-200 text-muted-400 after:border-muted-300 dark:border-muted-600 dark:bg-muted-700 dark:after:border-muted-600 relative flex size-9 items-center justify-center rounded-full border bg-white shadow-lg after:absolute after:-end-8 after:top-4 after:h-px after:w-5 after:border-t after:content-['']"
                >
                  <Icon name="ph:selection-all-duotone" class="" />
                </div>
                <div class="ms-10">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    بررسی پروژه
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    امروز - ساعت ۱۶:۳۰
                  </p>
                </div>
              </div>
              <!-- Item -->
              <div
                class="after:border-muted-300 dark:after:border-muted-600 relative flex pb-8 after:absolute after:start-4 after:top-10 after:h-[calc(100dvh_-_36px)] after:w-px after:border-s after:content-['']"
              >
                <div
                  class="border-muted-200 text-muted-400 after:border-muted-300 dark:border-muted-600 dark:bg-muted-700 dark:after:border-muted-600 relative flex size-9 items-center justify-center rounded-full border bg-white shadow-lg after:absolute after:-end-8 after:top-4 after:h-px after:w-5 after:border-t after:content-['']"
                >
                  <Icon name="ph:note-duotone" class="" />
                </div>
                <div class="ms-10">
                  <h6
                    class="font-heading text-muted-800 text-sm font-semibold dark:text-white"
                  >
                    نوشتن پیشنهاد برای اندی
                  </h6>
                  <p class="text-muted-400 font-sans text-xs">
                    امروز - ۱۸:۳۰
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  </div>
</template>
