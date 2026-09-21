<template>
  <div class="flex h-full flex-col">
    <div class="relative mx-auto mb-4 size-20">
      <BaseAvatar size="xl" src="/img/icons/logos/slicer.svg" />
      <div class="absolute bottom-0 end-0">
        <BaseButtonIcon rounded="full" small>
          <Icon name="ph:camera-duotone" />
        </BaseButtonIcon>
      </div>
    </div>
    <div class="text-center">
      <BaseHeading
        size="md"
        weight="medium"
        class="text-muted-800 dark:text-muted-100"
      >
        <span>یادگیری اسلایسر</span>
      </BaseHeading>
      <BaseParagraph size="xs" class="text-muted-400 mb-2">
        <span>دوره‌های آنلاین</span>
      </BaseParagraph>
      <BaseParagraph
        size="sm"
        class="text-muted-500 dark:text-muted-400 mx-auto max-w-[320px]"
      >
        <span>
          لورم ایپسوم دولور سیت آمیت، کنسکتتور آدیپیسینگ الیت. سد فاک استا
          اسه نون اینپورتونا.
        </span>
      </BaseParagraph>
    </div>
    <div
      class="border-muted-200 dark:border-muted-700 mt-auto border-t pt-6 text-center"
    >
      <div
        class="divide-muted-200 dark:divide-muted-700 flex w-full items-center divide-x rtl:divide-x-reverse"
      >
        <!-- Item -->
        <div class="flex-1">
          <div class="flex flex-col px-4 text-center">
            <h4
              class="text-muted-800 dark:text-muted-100 font-sans text-xl font-semibold"
            >
              864
            </h4>
            <p
              class="font-sansfont-semibold text-muted-400 text-[0.65rem] uppercase"
            >
              پست‌ها
            </p>
          </div>
        </div>
        <!-- Item -->
        <div class="flex-1">
          <div class="flex flex-col px-4 text-center">
            <h4
              class="text-muted-800 dark:text-muted-100 font-sans text-xl font-semibold"
            >
              247
            </h4>
            <p
              class="text-muted-400 font-sans text-[0.65rem] font-semibold uppercase"
            >
              پروژه‌ها
            </p>
          </div>
        </div>
        <!-- Item -->
        <div class="flex-1">
          <div class="flex flex-col px-4 text-center">
            <h4
              class="text-muted-800 dark:text-muted-100 font-sans text-xl font-semibold"
            >
              19k
            </h4>
            <p
              class="font-sansfont-semibold text-muted-400 text-[0.65rem] uppercase"
            >
              دنبال‌کنندگان
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
