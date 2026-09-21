<script setup lang="ts">
definePageMeta({
  title: 'گنبد',
  preview: {
    title: 'گنبد',
    description: 'برای امنیت در سطح گنبد آهنین',
    categories: ['چیدمان‌ها', 'لیست‌ها'],
    src: '/img/screens/layouts-vault.png',
    srcDark: '/img/screens/layouts-vault-dark.png',
    order: 37,
    new: true,
  },
})

const gaugePersonal = reactive(useGaugePersonal())

function useGaugePersonal() {
  const { primary } = useTailwindColors()
  const type = 'radialBar'
  const height = 220

  const options = {
    title: {
      text: undefined,
    },
    chart: {
      fontFamily: 'Vazirmatn FD, sans-serif',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2,
          },
        },
        hollow: {
          margin: 0,
          size: '35%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ['نتایج متوسط'],
  }

  const series = shallowRef([76])

  return {
    type,
    height,
    options,
    series,
  }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!--Content-->
    <div class="ltablet:col-span-9 col-span-12 lg:col-span-9">
      <div class="w-full">
        <!--Header-->
        <div class="border-muted-200 dark:border-muted-800 border-b py-6">
          <div
            class="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-start"
          >
            <BaseIconBox
              color="success"
              variant="pastel"
              size="md"
              rounded="none"
              mask="blob"
            >
              <Icon name="ph:shield-check-duotone" class="size-6" />
            </BaseIconBox>
            <div>
              <BaseHeading
                as="h2"
                size="2xl"
                weight="medium"
                class="text-muted-800 dark:text-white"
              >
                گواهی گاوصندوق
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                گنجینه شما به‌درستی کار می‌کند و تأیید شده است.
              </BaseParagraph>
            </div>
            <div
              class="divide-muted-200 dark:divide-muted-800 flex items-center divide-x rtl:divide-x-reverse sm:ms-auto"
            >
              <div class="px-6 text-center sm:text-end">
                <BaseParagraph
                  size="sm"
                  class="text-muted-400"
                >
                  بیمه FDIC
                </BaseParagraph>
                <BaseParagraph
                  size="md"
                  class="text-muted-800 dark:text-muted-100"
                >
                  تا 500 میلیارد تومان
                </BaseParagraph>
              </div>
              <div class="px-6 text-center sm:text-end">
                <BaseParagraph
                  size="sm"
                  class="text-muted-400"
                >
                  حساب‌های کاربری
                </BaseParagraph>
                <BaseParagraph
                  size="md"
                  class="text-muted-800 dark:text-muted-100"
                >
                  ۱۵۶,۷۴۰ تومان
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
        <!--Box-->
        <div class="border-muted-200 dark:border-muted-800 border-b py-6">
          <BaseCard
            rounded="lg"
            class="p-8"
          >
            <div
              class="flex w-full flex-col justify-between sm:flex-row sm:items-center"
            >
              <div class="ptablet:max-w-sm flex max-w-md flex-col gap-3">
                <BaseParagraph
                  size="sm"
                  class="text-muted-400"
                >
                  بیمه FDIC
                </BaseParagraph>
                <BaseHeading
                  as="h4"
                  size="lg"
                  weight="medium"
                  class="text-muted-800 dark:text-white"
                >
                  حساب‌های شما تا ۱۰ میلیون تومان تحت پوشش بیمه FDIC هستند
                </BaseHeading>
                <BaseParagraph
                  size="md"
                  class="text-muted-500"
                >
                  شما با بالاترین سطح بیمه FDIC که در حال حاضر موجود است، محافظت می‌شوید.
                </BaseParagraph>
              </div>
              <div
                class="ptablet:me-5 ltablet:me-20 mt-10 flex flex-col gap-3 sm:mt-0 lg:me-20"
              >
                <BaseParagraph
                  size="sm"
                  class="text-muted-400"
                >
                  موجودی حساب جاری/پس‌انداز
                </BaseParagraph>
                <BaseHeading
                  as="h4"
                  size="2xl"
                  weight="medium"
                  class="text-muted-800 dark:text-white"
                >
                  ۱۵۶,۷۴۰ تومان
                </BaseHeading>
                <BaseTag
                  color="primary"
                  variant="pastel"
                  rounded="lg"
                  class="text-center"
                >
                  تا ۱۰ میلیون تومان توسط FDIC بیمه شده
                </BaseTag>
              </div>
            </div>
          </BaseCard>
        </div>
        <!--About-->
        <div class="border-muted-200 dark:border-muted-800 border-b py-6">
          <div class="flex items-center gap-3">
            <div>
              <BaseHeading
                as="h3"
                size="xl"
                weight="medium"
                class="text-muted-800 mb-2 dark:text-white"
              >
                درباره مخزن
              </BaseHeading>
              <BaseParagraph
                size="md"
                class="text-muted-500 dark:text-muted-400 mb-2"
              >
                گاوصندوق شما به مدیریت ریسک بانکی و حفاظت از وجوهتان هنگام رشد کمک می‌کند. پوشش بیمه FDIC خود را به حداکثر برسانید و پول را به صندوق‌های بازار مالی متشکل از اوراق بهادار کوتاه مدت پشتیبانی شده توسط دولت آمریکا منتقل کنید وقتی که به نفع شما است.
              </BaseParagraph>
              <DemoLinkArrow to="#" label="اطلاعات بیشتر در این مورد" />
            </div>
          </div>
        </div>
        <!--About-->
        <div class="border-muted-200 dark:border-muted-800 border-b py-6">
          <DemoWidgetInvest />
        </div>
        <!--Disclaimer-->
        <div class="py-6">
          <BaseParagraph size="xs" class="text-muted-400">
            خزانه تایرو توسط تایرو Advisory, LLC که به عنوان مشاور سرمایه‌گذاری در SEC ثبت شده است ارائه می‌شود.
            ثبت‌نام در SEC به معنای مهارت یا آموزش خاصی نیست. ثبت SEC به معنای تأیید خدمات مشاور توسط SEC نمی‌باشد.
            این اطلاعیه پیشنهاد فروش یا درخواست خرید هیچ یک از سرمایه‌گذاری‌ها یا حساب‌های توصیف شده در اینجا نیست.
            همه سرمایه‌گذاری‌ها در معرض خطر از دست دادن هستند، از جمله از دست دادن اصل سرمایه.
            هیچ تضمینی وجود ندارد که هر سرمایه‌گذاری به اهداف خود برسد یا سرمایه‌گذار نتایجی مشابه آنچه نشان داده شده است به دست آورد.
            عملکرد گذشته نشان‌دهنده آینده نیست و تضمینی برای نتایج آینده وجود ندارد.
            سرمایه‌گذاری‌هایی که از طریق تایرو Advisory انجام می‌شود تحت پوشش FDIC نیست اما ممکن است تحت پوشش SIPC باشد.
            برخی از داده‌های موجود در این اطلاعیه از منابعی به دست آمده‌اند که به‌دقت باور شده‌اند، اما به‌طور مستقل تأیید نشده‌اند.
            لطفاً افشاهای کامل را در تایرو.com/treasury مشاهده کنید.
          </BaseParagraph>
        </div>
      </div>
    </div>
    <!--Side widgets-->
    <div class="ltablet:col-span-3 col-span-12 lg:col-span-3">
      <!-- Column -->
      <div class="relative flex flex-col gap-6">
        <!-- Widget -->
        <DemoActionText
          title="ارتقاء به پرو"
          text="لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. وید سنسز این لاتینو فوره؟ نام آنته آریستپوس، ات ایله ملیوس."
          label="ارتقاء دهید"
          to="#"
          rounded="md"
        />
        <!-- Widget -->
        <BaseCard rounded="md" class="flex flex-col p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="sm"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>امتیاز شخصی</span>
            </BaseHeading>
          </div>
          <div class="py-16">
            <AddonApexcharts v-bind="gaugePersonal" class="-mt-14" />
          </div>
          <div class="mt-auto text-center">
            <BaseParagraph size="sm">
              <span class="text-muted-400">
                امتیاز شما بر اساس جدیدترین معیارها محاسبه شده است.
              </span>
            </BaseParagraph>
          </div>
        </BaseCard>
        <!-- Widget -->
        <BaseCard class="p-6" rounded="md">
          <DemoNotificationsCompact />
        </BaseCard>
      </div>
    </div>
  </div>
</template>
