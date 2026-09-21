<script setup lang="ts">
definePageMeta({
  title: 'امنیت',
  preview: {
    title: 'امنیت',
    description: 'برای مدیریت تنظیمات',
    categories: ['چیدمان‌ها', 'تنظیمات'],
    src: '/img/screens/layouts-settings-security.png',
    srcDark: '/img/screens/layouts-settings-security-dark.png',
    order: 37,
    new: true,
  },
})

const session = ref(true)
const password = ref(true)
</script>

<template>
  <div class="divide-muted-200 dark:divide-muted-800 space-y-20 py-6">
    <!--Statements-->
    <div class="grid gap-8 md:grid-cols-12">
      <!--Column-->
      <div class="md:col-span-4">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          حساب کاربری
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          یک رمز عبور منحصر به فرد تعیین کنید تا حساب خود را محافظت کنید. فراموش نکنید که از زمان به زمان آن را تغییر دهید.
        </BaseParagraph>
      </div>
      <!--Column-->
      <div class="md:col-span-8">
        <BaseHeading
          as="h3"
          size="xs"
          weight="medium"
          class="border-muted-200 dark:border-muted-800 text-muted-800 dark:text-muted-100 border-b px-4 pb-4"
        >
          اطلاعات حساب
        </BaseHeading>
        <div
          class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
        >
          <!--Item-->
          <div class="group">
            <a
              href="#"
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
            >
              <div>
                <h3 class="font-heading text-muted-400 text-xs">رمز عبور</h3>
                <span>تغییر رمز عبور</span>
              </div>
              <Icon name="lucide:edit-3" class="ms-auto size-4" />
              <BaseText
                size="xs"
                weight="semibold"
                class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                ویرایش
              </BaseText>
            </a>
          </div>
          <!--Item-->
          <div class="group">
            <a
              href="#"
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
            >
              <div>
                <h3 class="font-heading text-muted-400 text-xs">
                  کدهای پشتیبان
                </h3>
                <span>ایجاد کدها</span>
              </div>
              <Icon name="lucide:edit-3" class="ms-auto size-4" />
              <BaseText
                size="xs"
                weight="semibold"
                class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                ویرایش
              </BaseText>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!--2 Factor-->
    <div class="grid gap-8 md:grid-cols-12">
      <!--Column-->
      <div class="md:col-span-4">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          دو عاملی
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          روش احراز هویت (مانند آوثی یا احراز هویت گوگل) را برای این حساب تنظیم یا ویرایش کنید.
        </BaseParagraph>
      </div>
      <!--Column-->
      <div class="md:col-span-8">
        <BaseHeading
          as="h3"
          size="xs"
          weight="medium"
          class="border-muted-200 dark:border-muted-800 text-muted-800 dark:text-muted-100 border-b px-4 pb-4"
        >
          دو عاملی
        </BaseHeading>
        <div
          class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
        >
          <!--Item-->
          <div class="group">
            <NuxtLink
              to="#"
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
            >
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  راه‌اندازی
                </BaseHeading>
                <BaseText size="sm">
                  راه‌اندازی احراز هویت دو مرحله‌ای
                </BaseText>
              </div>
              <Icon name="lucide:edit-3" class="ms-auto size-4" />
              <BaseText
                size="xs"
                weight="semibold"
                class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                ویرایش
              </BaseText>
            </NuxtLink>
          </div>
          <!--Item-->
          <div class="group">
            <NuxtLink
              to="#"
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
            >
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  Key
                </BaseHeading>
                <BaseText size="sm">
                  تنظیم کلید
                </BaseText>
              </div>
              <Icon name="lucide:edit-3" class="ms-auto size-4" />
              <BaseText
                size="xs"
                weight="semibold"
                class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                ویرایش
              </BaseText>
            </NuxtLink>
          </div>
          <!--Item-->
          <div class="group">
            <NuxtLink
              to="#"
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
            >
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  تلفن
                </BaseHeading>
                <BaseText size="sm">
                  شماره تلفن
                </BaseText>
              </div>
              <Icon name="lucide:edit-3" class="ms-auto size-4" />
              <BaseText
                size="xs"
                weight="semibold"
                class="text-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                ویرایش
              </BaseText>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!--Notifications-->
    <div class="grid gap-8 md:grid-cols-12">
      <!--Column-->
      <div class="md:col-span-4">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          اعلان‌های امنیتی
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          برخی از اعلان‌ها هنگام بررسی امنیت حساب شما ضروری هستند. مراقب باشید!
        </BaseParagraph>
      </div>
      <!--Column-->
      <div class="md:col-span-8">
        <BaseHeading
          as="h3"
          size="xs"
          weight="medium"
          class="border-muted-200 dark:border-muted-800 text-muted-800 dark:text-muted-100 border-b px-4 pb-4"
        >
          اطلاعیه‌ها
        </BaseHeading>
        <div
          class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
        >
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="session" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  جلسه
                </BaseHeading>
                <BaseText size="sm">
                  جلسه جدید شروع شد
                </BaseText>
              </div>
            </div>
          </div>
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="password" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  رمز عبور
                </BaseHeading>
                <BaseText size="sm">
                  تغییر رمز عبور
                </BaseText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
