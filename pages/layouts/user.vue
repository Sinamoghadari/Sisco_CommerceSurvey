<script setup lang="ts">
definePageMeta({
  title: 'کاربر',
  preview: {
    title: 'کاربر',
    description: 'برای نمایش اطلاعات کاربر',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-user.png',
    srcDark: '/img/screens/layouts-user-dark.png',
    order: 30,
    new: true,
  },
})
</script>

<template>
  <div class="w-full">
    <!--Header-->
    <div class="border-muted-200 dark:border-muted-800 border-b py-6">
      <div class="flex items-center gap-3">
        <BaseAvatar
          size="lg"
          src="/img/avatars/10.svg"
          rounded="none"
          mask="blob"
        />
        <div>
          <BaseHeading
            as="h2"
            size="2xl"
            weight="medium"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            کندرا ویلسون
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
            kendraw@eltheme.ir
          </BaseParagraph>
        </div>
      </div>
    </div>
    <!--Content-->
    <div class="space-y-10">
      <!--Section-->
      <div class="grid gap-8 pt-6 md:grid-cols-12">
        <!--Column-->
        <div class="md:col-span-5">
          <div class="w-full max-w-xs">
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-muted-100 mb-1"
            >
              اطلاعات عمومی
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
              برخی اطلاعاتی که باید در مورد شما بدانیم و برای پردازش مسائل حقوقی.
            </BaseParagraph>
          </div>
        </div>
        <!--Column-->
        <div class="md:col-span-7">
          <BaseHeading
            as="h3"
            size="xs"
            weight="medium"
            class="border-muted-200 dark:border-muted-800 text-muted-800 dark:text-muted-100 border-b px-4 pb-4"
          >
            درباره شما
          </BaseHeading>
          <div
            class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
          >
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="/layouts/profile-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
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
                  <BaseText size="sm">
                    کندرا ویلسون
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
                to="/layouts/profile-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
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
                  <BaseText size="sm">
                    کندرا ویلسون
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
                to="/layouts/profile-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
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
                  <BaseText size="sm">
                    kendraw@eltheme.ir
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
      <!--Section-->
      <div class="grid gap-8 pt-6 md:grid-cols-12">
        <!--Column-->
        <div class="md:col-span-5">
          <div class="w-full max-w-xs">
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-muted-100 mb-1"
            >
              اطلاعات شخصی
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
              برخی اطلاعاتی که باید در مورد شما بدانیم و برای پردازش مسائل حقوقی.
            </BaseParagraph>
          </div>
        </div>
        <!--Column-->
        <div class="md:col-span-7">
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
              <NuxtLink
                to="/layouts/profile-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
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
                  <BaseText size="sm">
                    1366/12/06
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
                to="/layouts/profile-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
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
                  <BaseText size="sm">
                    +1 (612) 429-3263
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
                href="/layouts/profile-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
              >
                <div>
                  <BaseHeading
                    as="h3"
                    size="xs"
                    weight="medium"
                    class="text-muted-400"
                  >
                    جنسیت
                  </BaseHeading>
                  <BaseText size="sm">
                    زن
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
                to="/layouts/profile-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
              >
                <div>
                  <BaseHeading
                    as="h3"
                    size="xs"
                    weight="medium"
                    class="text-muted-400"
                  >
                    وضعیت خانوادگی
                  </BaseHeading>
                  <BaseText size="sm">
                    متاهل
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
      <!--Section-->
      <div class="grid gap-8 pt-6 md:grid-cols-12">
        <!--Column-->
        <div class="md:col-span-5">
          <div class="w-full max-w-xs">
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-muted-100 mb-1"
            >
              آدرس پستی
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
              ما کارت‌های فیزیکی و همچنین هدایا و پیشنهادات ویژه را به
              این آدرس ارسال خواهیم کرد.
            </BaseParagraph>
          </div>
        </div>
        <!--Column-->
        <div class="md:col-span-7">
          <div
            class="border-muted-200 dark:border-muted-800 border-b px-4 pb-4"
          >
            <BaseHeading
              as="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              مسئولیت محدود ال تم
            </BaseHeading>
            <div class="space-y-1">
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                بزرگراه راه‌آهن ۲۸
              </BaseParagraph>
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                خیابان پارکستون، بلوک ۲، سوئیت G23
              </BaseParagraph>
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                لس آنجلس، کالیفرنیا ۹۲۸۴۱
              </BaseParagraph>
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                ایالات متحده
              </BaseParagraph>
            </div>
            <div class="mt-2">
              <DemoLinkArrow to="/layouts/profile-edit" label="ویرایش آدرس" />
            </div>
          </div>
        </div>
      </div>
      <!--Section-->
      <div class="grid gap-8 pt-6 md:grid-cols-12">
        <!--Column-->
        <div class="md:col-span-5">
          <div class="w-full max-w-xs">
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-muted-100 mb-1"
            >
              آدرس قانونی
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
              این آدرس صورت‌حساب کارت‌های شماست و در اسناد شما ظاهر خواهد شد
            </BaseParagraph>
          </div>
        </div>
        <!--Column-->
        <div class="md:col-span-7">
          <div
            class="border-muted-200 dark:border-muted-800 border-b px-4 pb-4"
          >
            <BaseHeading
              as="h3"
              size="sm"
              weight="medium"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              مسئولیت محدود ال تم
            </BaseHeading>
            <div class="space-y-1">
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                بزرگراه راه‌آهن ۲۸
              </BaseParagraph>
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                خیابان پارکستون، بلوک ۲، سوئیت G23
              </BaseParagraph>
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                لس آنجلس، کالیفرنیا ۹۲۸۴۱
              </BaseParagraph>
              <BaseParagraph
                size="sm"
                class="text-muted-500 dark:text-muted-400"
              >
                ایالات متحده
              </BaseParagraph>
            </div>
            <div class="mt-2">
              <DemoLinkArrow to="/layouts/profile-edit" label="ویرایش آدرس" />
            </div>
          </div>
        </div>
      </div>
      <!--Section-->
      <div class="grid gap-8 pt-6 md:grid-cols-12">
        <!--Column-->
        <div class="md:col-span-5">
          <div class="w-full max-w-xs">
            <BaseHeading
              as="h3"
              size="md"
              weight="medium"
              class="text-muted-800 dark:text-muted-100 mb-1"
            >
              کارت اصلی
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
              این کارت اعتباری اصلی شرکت شماست. می‌توانید از آن برای پرداخت هر نوع هزینه‌ای استفاده کنید.
            </BaseParagraph>
          </div>
        </div>
        <!--Column-->
        <div class="md:col-span-7">
          <div
            class="border-muted-200 dark:border-muted-800 border-b px-4 pb-4"
          >
            <DemoCreditCardReal
              status="active"
              name="کندرا ویلسون"
              number="•••• •••• •••• 4728"
              brand="mastercard"
              class="!mx-0"
            />
            <div class="mt-4">
              <DemoLinkArrow to="/layouts/cards" label="مدیریت کارت‌های خود" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
