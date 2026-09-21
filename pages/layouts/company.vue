<script setup lang="ts">
definePageMeta({
  title: 'شرکت',
  preview: {
    title: 'شرکت',
    description: 'برای جزئیات شرکت',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-company.png',
    srcDark: '/img/screens/layouts-company-dark.png',
    order: 32,
    new: true,
  },
})
</script>

<template>
  <div class="w-full">
    <!--Header-->
    <div class="border-muted-200 dark:border-muted-800 border-b py-6">
      <div class="flex items-center gap-3">
        <div
          class="nui-mask nui-mask-blob bg-muted-200 dark:bg-muted-800 flex size-16 shrink-0 items-center justify-center"
        >
          <Icon name="ph:buildings-duotone" class="size-7" />
        </div>
        <div>
          <BaseHeading
            as="h2"
            size="2xl"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            ال تم ال‌ال‌سی
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
            جزئیات شرکت ال تم را مشاهده کنید
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
              برخی اطلاعاتی که باید در مورد شرکت شما بدانیم و برای پردازش مسائل قانونی.
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
            اطلاعات شرکت
          </BaseHeading>
          <div
            class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
          >
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="/layouts/company-edit"
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
                    ال تم ال‌ال‌سی
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
                to="/layouts/company-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
              >
                <div>
                  <BaseHeading
                    as="h3"
                    size="xs"
                    weight="medium"
                    class="text-muted-400"
                  >
                    فعالیت تجاری تحت عنوان (DBA)
                  </BaseHeading>
                  <BaseText size="sm">
                    ال تم ال‌ال‌سی
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
                to="/layouts/company-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
              >
                <div>
                  <BaseHeading
                    as="h3"
                    size="xs"
                    weight="medium"
                    class="text-muted-400"
                  >
                    نام رایج
                  </BaseHeading>
                  <BaseText size="sm">
                    سیستم‌های ال تم
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
              اطلاعات تماس
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
              برخی اطلاعات که برای تماس با شما و ارسال اسناد یا به‌روزرسانی‌ها نیاز داریم.
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
            کانال‌های ارتباطی
          </BaseHeading>
          <div
            class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
          >
            <!--Item-->
            <div class="group">
              <NuxtLink
                to="/layouts/company-edit"
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
                    hello@eltheme.ir
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
                to="/layouts/company-edit"
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
                to="/layouts/company-edit"
                class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 flex items-center gap-4 p-4 text-sm transition-colors duration-300"
              >
                <div>
                  <BaseHeading
                    as="h3"
                    size="xs"
                    weight="medium"
                    class="text-muted-400"
                  >
                    شناسه توییتر
                  </BaseHeading>
                  <BaseText size="sm">
                    @eltheme
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
              <DemoLinkArrow to="/layouts/company-edit" label="ویرایش آدرس" />
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
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
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
              <DemoLinkArrow to="/layouts/company-edit" label="ویرایش آدرس" />
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
              کارت شرکتی
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
              name="مسئولیت محدود ال تم"
              number="•••• •••• •••• 7297"
              brand="visa"
              class="!mx-0"
            />
            <div class="mt-4">
              <DemoLinkArrow to="#" label="مدیریت کارت شرکت" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
