<script setup lang="ts">
definePageMeta({
  title: 'اعتبار',
  preview: {
    title: 'فرم اعتبار',
    description: 'برای درخواست اعتبار',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-credit.png',
    srcDark: '/img/screens/layouts-credit-dark.png',
    order: 37,
    new: true,
  },
})

const showFaq = ref(false)
const step = ref(1)
const nextStep = () => {
  step.value += 1
}
const prevStep = () => {
  step.value -= 1
}

const fullName = ref('')
const duration = ref('')
const amount = ref('')
</script>

<template>
  <div class="py-12">
    <div class="flex min-h-[450px] items-center">
      <!--Step 1-->
      <div
        v-if="step === 1"
        class="flex w-full flex-col items-center md:flex-row"
      >
        <!--Column-->
        <div v-if="!showFaq" class="w-full md:w-1/2">
          <div class="max-w-md space-y-3 p-4">
            <BaseHeading
              as="h2"
              weight="bold"
              size="3xl"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              در فکر تأمین مالی کسب‌وکار خود هستید؟ درخواست اعتبار باز کنید.
            </BaseHeading>
            <BaseParagraph class="text-muted-500 dark:text-muted-400">
              لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. اوت
              اوپتیمه، سکوندوم ناتورام آفتکتم اسه پاسی.
            </BaseParagraph>
            <div class="flex gap-2">
              <BaseButton
                rounded="md"
                color="primary"
                class="w-32"
                @click="nextStep()"
              >
                ادامه
              </BaseButton>
              <BaseButton
                rounded="md"
                color="muted"
                class="w-32"
                @click="showFaq = !showFaq"
              >
                بیشتر بیاموزید
              </BaseButton>
            </div>
          </div>
        </div>
        <!--Column-->
        <div v-if="!showFaq" class="w-full md:w-1/2">
          <div class="text-primary-500 mx-auto max-w-sm">
            <VectorIllustrationManWondering />
          </div>
        </div>
        <!--Faq-->
        <div v-else class="w-full">
          <BaseHeading
            as="h3"
            weight="semibold"
            size="4xl"
            lead="tight"
            class="text-muted-800 mb-10 dark:text-white"
          >
            پرسش‌های متداول
          </BaseHeading>
          <!--Grid-->
          <div class="grid gap-x-3 gap-y-6 md:grid-cols-3">
            <!--Grid item-->
            <div class="space-y-2">
              <BaseHeading
                as="h4"
                weight="semibold"
                size="lg"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                آیا هزینه‌ای وجود دارد؟
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. تکوم
                اوپتیمه، دئین دئیام کم مدیئوکری آمیگو. میهی، اینکوام، کوی ته اید
                ایپسوم روگاوی.
              </BaseParagraph>
            </div>
            <!--Grid item-->
            <div class="space-y-2">
              <BaseHeading
                as="h4"
                weight="semibold"
                size="lg"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                مدت زمان‌ها چیست؟
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. تکوم
                اوپتیمه، دئین دئیام کم مدیئوکری آمیگو. میهی، اینکوام، کوی ته اید
                ایپسوم روگاوی؟ ان هئک اب ائو نون دیکونتور؟ سی کوا این ایس
                کوریگیر ولوئیت، دتریورا فیسیت. دوئو رگس: کانستروکتیو
                اینتررته.
              </BaseParagraph>
            </div>
            <!--Grid item-->
            <div class="space-y-2">
              <BaseHeading
                as="h4"
                weight="semibold"
                size="lg"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                شرایط چیست؟
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. تکوم
                اوپتیمه، دئین دئیام کم مدیئوکری آمیگو. میهی، اینکوام، کوی ته اید
                ایپسوم روگاوی.
              </BaseParagraph>
            </div>
            <!--Grid item-->
            <div class="space-y-2">
              <BaseHeading
                as="h4"
                weight="semibold"
                size="lg"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                چگونه ثبت‌نام کنم؟
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. تکوم
                اوپتیمه، دئین دئیام کم مدیئوکری آمیگو. میهی، اینکوام، کوی ته اید
                ایپسوم روگاوی.
              </BaseParagraph>
            </div>
            <!--Grid item-->
            <div class="space-y-2">
              <BaseHeading
                as="h4"
                weight="semibold"
                size="lg"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                نرخ اعتبار چیست؟
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. تکوم
                اوپتیمه، دئین دئیام کم مدیئوکری آمیگو. میهی، اینکوام، کوی ته اید
                ایپسوم روگاوی.
              </BaseParagraph>
            </div>
            <!--Grid item-->
            <div class="space-y-2">
              <BaseHeading
                as="h4"
                weight="semibold"
                size="lg"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                آیا می‌توانم هر وقت که بخواهم آن را لغو کنم؟
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400">
                لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. تکوم
                اوپتیمه، دئین دئیام کم مدیئوکری آمیگو. میهی، اینکوام، کوی ته اید
                ایپسوم روگاوی.
              </BaseParagraph>
            </div>
          </div>
          <!--Back button-->
          <div class="mt-10">
            <BaseButton
              rounded="md"
              color="muted"
              class="w-32"
              @click="showFaq = !showFaq"
            >
              بازگشت
            </BaseButton>
          </div>
        </div>
      </div>

      <!--Step 2-->
      <div
        v-else-if="step === 2"
        class="flex w-full flex-col items-center md:flex-row"
      >
        <!--Column-->
        <div class="w-full md:w-1/2">
          <div class="max-w-md space-y-3 p-4">
            <BaseHeading
              as="h2"
              weight="bold"
              size="3xl"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              فرم را پر کنید.
            </BaseHeading>
            <BaseParagraph class="text-muted-500 dark:text-muted-400">
              لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. اوت
              اوپتیمه، سکوندوم ناتورام آفتکتم اسه پاسی.
            </BaseParagraph>
            <!--Form-->
            <form class="space-y-4 pb-6">
              <!--Field-->
              <BaseInput
                v-model="fullName"
                icon="lucide:user"
                label="نام کامل"
                placeholder="نام کامل شما"
                class="w-full"
              />
              <!--Field group-->
              <div class="grid gap-4 md:grid-cols-2">
                <!--Field-->
                <div class="relative">
                  <BaseSelect v-model="amount" label="مبلغ درخواست شده">
                    <option value="">
                      یک محدوده را انتخاب کنید
                    </option>
                    <option value="5k-20k">
                      از 5 هزار تومان تا 20 هزار تومان
                    </option>
                    <option value="20k-50k">
                      از 20 هزار تومان تا 50 هزار تومان
                    </option>
                    <option value="50k-100k">
                      از 50 هزار تومان تا 100 هزار تومان
                    </option>
                    <option value="100k-500k">
                      از 100 هزار تومان تا 500 هزار تومان
                    </option>
                    <option value="500k-1M">
                      از 500 هزار تومان تا 1 میلیون تومان
                    </option>
                    <option value="1M">
                      از 1 میلیون تومان شروع می‌شود
                    </option>
                  </BaseSelect>
                </div>
                <!--Field-->
                <div class="relative">
                  <BaseSelect v-model="amount" label="مدت زمان درخواست‌شده">
                    <option value="">
                      یک مدت زمان را انتخاب کنید
                    </option>
                    <option value="5">
                      ۵ سال
                    </option>
                    <option value="10">
                      ۱۰ سال
                    </option>
                    <option value="15">
                      ۱۵ سال
                    </option>
                    <option value="20">
                      ۲۰ سال
                    </option>
                    <option value="25">
                      ۲۵ سال
                    </option>
                  </BaseSelect>
                </div>
              </div>
            </form>

            <!--Buttons-->
            <div class="flex gap-2">
              <BaseButton
                rounded="md"
                color="muted"
                class="w-32"
                @click="prevStep()"
              >
                قبلی
              </BaseButton>
              <BaseButton
                rounded="md"
                color="primary"
                class="w-32"
                @click="nextStep()"
              >
                ادامه
              </BaseButton>
            </div>
          </div>
        </div>
        <!--Column-->
        <div class="w-full md:w-1/2">
          <div class="text-primary-500 mx-auto max-w-sm">
            <VectorIllustrationTransaction />
          </div>
        </div>
      </div>

      <!--Step 3-->
      <div
        v-else-if="step === 3"
        class="flex w-full flex-col items-center md:flex-row"
      >
        <!--Column-->
        <div class="w-full md:w-1/2">
          <div class="max-w-md space-y-3 p-4">
            <BaseHeading
              as="h2"
              weight="bold"
              size="3xl"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              دانلودهای قانونی.
            </BaseHeading>
            <BaseParagraph class="text-muted-500 dark:text-muted-400">
              لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. اوت
              اوپتیمه، سکوندوم ناتورام آفتکتم اسه پاسی.
            </BaseParagraph>
            <!--Download links-->
            <div class="py-5">
              <ul class="space-y-1">
                <!--Links-->
                <li>
                  <NuxtLink
                    to="#"
                    class="hover:bg-muted-100 dark:hover:bg-muted-800 flex gap-4 rounded-lg px-4 py-3 transition-colors duration-300"
                  >
                    <Icon
                      name="ph:bank-duotone"
                      class="text-primary-500 size-7"
                    />
                    <div>
                      <BaseParagraph
                        weight="medium"
                        size="sm"
                        lead="tight"
                        class="text-muted-600 dark:text-muted-300 mb-1"
                      >
                        شرایط خدمات
                      </BaseParagraph>
                      <BaseParagraph
                        weight="medium"
                        size="xs"
                        class="text-muted-400"
                      >
                        این سند را به دقت بخوانید
                      </BaseParagraph>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="#"
                    class="hover:bg-muted-100 dark:hover:bg-muted-800 flex gap-4 rounded-lg px-4 py-3 transition-colors duration-300"
                  >
                    <Icon
                      name="ph:coins-duotone"
                      class="text-primary-500 size-7"
                    />
                    <div>
                      <BaseParagraph
                        weight="medium"
                        size="sm"
                        lead="tight"
                        class="text-muted-600 dark:text-muted-300 mb-1"
                      >
                        قرارداد اعتبار
                      </BaseParagraph>
                      <BaseParagraph
                        weight="medium"
                        size="xs"
                        class="text-muted-400"
                      >
                        نمونه سند قرارداد اعتبار
                      </BaseParagraph>
                    </div>
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!--Buttons-->
            <div class="flex gap-2">
              <BaseButton
                rounded="md"
                color="muted"
                class="w-32"
                @click="prevStep()"
              >
                قبلی
              </BaseButton>
              <BaseButton
                rounded="md"
                color="primary"
                class="w-32"
                @click="nextStep()"
              >
                پایان
              </BaseButton>
            </div>
          </div>
        </div>
        <!--Column-->
        <div class="w-full md:w-1/2">
          <div class="text-primary-500 mx-auto max-w-sm">
            <VectorIllustrationCreditCard />
          </div>
        </div>
      </div>

      <!--Step 4-->
      <div v-else-if="step === 4" class="flex w-full items-center">
        <div class="mx-auto w-full max-w-md py-6 text-center">
          <div class="text-primary-500 mx-auto mb-4 size-14">
            <TairoCheckAnimated color="primary" size="lg" />
          </div>
          <BaseHeading
            as="h2"
            weight="medium"
            size="2xl"
            lead="tight"
            class="text-muted-800 mb-2 dark:text-white"
          >
            درخواست اعتبار ارسال شد!
          </BaseHeading>
          <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-5">
            عالی! شما درخواست اعتبار خود را به درستی پر کرده‌اید. یکی از مشاوران ما به زودی با شما تماس خواهد گرفت تا وقت ملاقات تنظیم کند.
          </BaseParagraph>
          <div class="flex justify-center">
            <BaseButton
              to="/dashboards"
              color="primary"
              rounded="md"
              class="w-48"
            >
              بازگشت به داشبورد
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
