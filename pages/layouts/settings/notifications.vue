<script setup lang="ts">
definePageMeta({
  title: 'اطلاعیه‌ها',
  preview: {
    title: 'اطلاعیه‌ها',
    description: 'برای مدیریت تنظیمات',
    categories: ['چیدمان‌ها', 'تنظیمات'],
    src: '/img/screens/layouts-settings-notifications.png',
    srcDark: '/img/screens/layouts-settings-notifications-dark.png',
    order: 37,
    new: true,
  },
})

const incoming = ref(true)
const outgoing = ref(false)
const failed = ref(false)
const uncashed = ref(false)
const payments = ref(true)
const low = ref(true)
const features = ref(true)
const offers = ref(true)
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
          فعالیت حساب
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          سفارشی‌سازی اینکه چه اعلان‌های ایمیلی می‌خواهید در مورد تراکنش‌های حساب خود دریافت کنید.
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
          فعالیت
        </BaseHeading>
        <div
          class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
        >
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="incoming" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  ورودی
                </BaseHeading>
                <BaseText size="sm">
                  تراکنش‌های ورودی
                </BaseText>
              </div>
            </div>
          </div>
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="outgoing" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  خروجی
                </BaseHeading>
                <BaseText size="sm">
                  تراکنش‌های خروجی
                </BaseText>
              </div>
            </div>
          </div>
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="failed" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  ناموفق
                </BaseHeading>
                <BaseText size="sm">
                  تراکنش‌های ناموفق
                </BaseText>
              </div>
            </div>
          </div>
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="uncashed" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  نقد نشده
                </BaseHeading>
                <BaseText size="sm">
                  چک‌های وصول‌نشده
                </BaseText>
              </div>
            </div>
          </div>
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="payments" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  پرداخت‌ها
                </BaseHeading>
                <BaseText size="sm">
                  درخواست‌های پرداخت
                </BaseText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Balance-->
    <div class="grid gap-8 md:grid-cols-12">
      <!--Column-->
      <div class="md:col-span-4">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          موجودی کم
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          ما وقتی موجودی یکی از حساب‌های شما به زیر مقداری که تعیین کرده‌اید برسد، به شما ایمیل می‌زنیم.
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
          موجودی کم
        </BaseHeading>
        <div
          class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
        >
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="low" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  هشدار کم
                </BaseHeading>
                <BaseText size="sm">
                  موجودی به کمتر از ۲۰۰ تومان کاهش یافت
                </BaseText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Updates-->
    <div class="grid gap-8 md:grid-cols-12">
      <!--Column-->
      <div class="md:col-span-4">
        <BaseHeading
          as="h3"
          size="md"
          weight="medium"
          class="text-muted-800 dark:text-muted-100 mb-1"
        >
          به‌روزرسانی‌های تایرو
        </BaseHeading>
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          با ویژگی‌های جدید محصولات یا رویدادهای جالب مورد علاقه‌تان به‌روز باشید.
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
          به‌روزرسانی‌ها
        </BaseHeading>
        <div
          class="divide-muted-200 dark:divide-muted-800 flex flex-col divide-y"
        >
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="features" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  ویژگی‌ها
                </BaseHeading>
                <BaseText size="sm">
                  ویژگی جدید
                </BaseText>
              </div>
            </div>
          </div>
          <!--Item-->
          <div class="group">
            <div
              class="font-heading text-muted-600 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-800 flex items-center gap-2 p-4 text-sm transition-colors duration-300"
            >
              <BaseSwitchThin v-model="offers" />
              <div>
                <BaseHeading
                  as="h3"
                  size="xs"
                  weight="medium"
                  class="text-muted-400"
                >
                  پیشنهادات
                </BaseHeading>
                <BaseText size="sm">
                  پیشنهادات ویژه
                </BaseText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
