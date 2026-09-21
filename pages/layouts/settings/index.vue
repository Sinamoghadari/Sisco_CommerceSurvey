<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات',
  preview: {
    title: 'تنظیمات',
    description: 'برای مدیریت تنظیمات',
    categories: ['چیدمان‌ها', 'تنظیمات'],
    src: '/img/screens/layouts-settings.png',
    srcDark: '/img/screens/layouts-settings-dark.png',
    order: 37,
    new: true,
  },
})

const visibility = ref(true)
const privateMessages = ref(true)
</script>

<template>
  <div class="divide-muted-200 dark:divide-muted-800 space-y-20 py-6">
    <!--Grid-->
    <div class="grid gap-8 md:grid-cols-12">
      <!--Column-->
      <div class="md:col-span-4">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          درباره شما
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          برخی اطلاعات اولیه که باید درباره شما بدانیم و برای انجام امور قانونی پردازش کنیم.
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
          اطلاعات شما
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
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  آدرس ایمیل
                </BaseHeading>
                <BaseText size="sm">mayar@eltheme.ir</BaseText>
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
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  نام ترجیحی
                </BaseHeading>
                <BaseText size="sm">مایا روسلینی</BaseText>
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
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  نام قانونی
                </BaseHeading>
                <BaseText size="sm">مایا روسلینی</BaseText>
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

    <!--Additional info-->
    <div class="grid gap-8 md:grid-cols-12">
      <!--Column-->
      <div class="md:col-span-4">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          اطلاعات اضافی
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          برخی اطلاعات مفید که ممکن است برای ارتباط با شما یا انجام چند بررسی به آن نیاز داشته باشیم.
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
          اطلاعات اضافی
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
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  تاریخ تولد
                </BaseHeading>
                <BaseText size="sm">1366/12/06</BaseText>
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
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  شماره تلفن
                </BaseHeading>
                <BaseText size="sm">+1 559 454 15</BaseText>
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
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  آدرس
                </BaseHeading>
                <BaseParagraph size="sm">خیابان ویکتوریایی ۴۷</BaseParagraph>
                <BaseParagraph size="sm">سویت G3، نیویورک، نیویورک</BaseParagraph>
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

    <!--Privacy-->
    <div class="grid gap-8 md:grid-cols-12">
      <!--Column-->
      <div class="md:col-span-4">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          تنظیمات حریم خصوصی
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          به ما بگویید که چگونه مایلید اطلاعات شخصی شما را مدیریت کنیم.
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
          حریم خصوصی
        </BaseHeading>
        <div
          class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
        >
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="visibility" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  پروفایل قابل مشاهده
                </BaseHeading>
                <BaseText size="sm">
                  پروفایل خود را قابل مشاهده کنید
                </BaseText>
              </div>
            </div>
          </div>
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="privateMessages" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  پیام‌های خصوصی
                </BaseHeading>
                <BaseText size="sm">
                  پیام‌های خود را خصوصی کنید
                </BaseText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
