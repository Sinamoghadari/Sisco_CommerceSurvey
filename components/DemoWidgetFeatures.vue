<template>
  <div
    class="bg-muted-200 dark:bg-muted-950/50 rounded-xl p-4 sm:p-6"
  >
    <div class="mb-6 flex items-center justify-between">
      <div>
        <BaseHeading
          as="h3"
          weight="medium"
          size="xl"
          class="text-muted-800 dark:text-muted-100"
        >
          ویژگی‌های تازه
        </BaseHeading>
        <BaseParagraph class="text-muted-500 dark:text-muted-400">
          فیچرهای جذابی که اخیرا ارائه داده‌ایم
        </BaseParagraph>
      </div>
      <div>
        <slot name="actions" />
      </div>
    </div>
    <div class="ltablet:grid-cols-2 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="relative">
        <BaseCard
          rounded="md"
          class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
        >
          <div
            class="bg-muted-100 dark:bg-muted-900 flex w-full shrink-0 items-center justify-center rounded-xl sm:size-32"
          >
            <img
              src="/img/illustrations/ui/recurring.svg"
              class="w-full"
              alt=""
            >
          </div>
          <div class="flex flex-col">
            <BaseHeading
              as="h3"
              weight="medium"
              size="md"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              پرداخت‌های دوره‌ای
            </BaseHeading>
            <BaseParagraph
              size="xs"
              class="text-muted-500 dark:text-muted-400 mb-4"
            >
              لورم ایپسوم دلور سیت امت، کنسکتتور آدیپیسینگ الیت. بورک ایدم ادهوک؛ ایگیتور نکوه استولتوروم کسی بئاتوس نیست.
            </BaseParagraph>
            <div class="mb-1 mt-auto">
              <DemoLinkArrow to="#" label="اطلاعات بیشتر در این مورد" />
            </div>
          </div>
        </BaseCard>
      </div>
      <div class="relative">
        <BaseCard
          rounded="md"
          class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
        >
          <div
            class="bg-muted-200 dark:bg-muted-900 flex w-full shrink-0 items-center justify-center rounded-xl sm:size-32"
          >
            <img
              src="/img/illustrations/ui/cashback.svg"
              class="w-full"
              alt=""
            >
          </div>
          <div class="flex flex-col">
            <BaseHeading
              as="h3"
              weight="medium"
              size="md"
              class="text-muted-800 dark:text-muted-100 mb-2"
            >
              موجودی اعتبار
            </BaseHeading>
            <BaseParagraph
              size="xs"
              class="text-muted-500 dark:text-muted-400 mb-4"
            >
              لورم ایپسوم دلور سیت امت، کنسکتتور آدیپیسینگ الیت. بورک ایدم ادهوک؛ ایگیتور نکوه استولتوروم کسی بئاتوس نیست.
            </BaseParagraph>
            <div class="mb-1 mt-auto">
              <DemoLinkArrow to="#" label="اطلاعات بیشتر در این مورد" />
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
