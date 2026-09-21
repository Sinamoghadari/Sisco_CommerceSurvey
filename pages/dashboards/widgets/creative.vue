<script setup lang="ts">
definePageMeta({
  title: 'ویجت‌های خلاقانه',
  preview: {
    title: 'ویجت‌های خلاقانه',
    description: 'برای ترکیب صفحات',
    categories: ['داشبوردها', 'ویجت‌ها'],
    src: '/img/screens/dashboards-widgets-creative.png',
    srcDark: '/img/screens/dashboards-widgets-creative-dark.png',
    order: 28,
  },
})
</script>

<template>
  <div class="ptablet:grid-cols-2 grid gap-4 sm:grid-cols-4">
    <!-- Column -->
    <div class="relative flex flex-col gap-4">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoInfoBadges
          image="/img/illustrations/widgets/1.svg"
          badge-small="/img/illustrations/widgets/3.svg"
          badge-medium="/img/illustrations/widgets/2.svg"
          title="دو دستاورد جدید را باز کرده‌اید"
          text="تبریک! تلاش‌های شما پاداش داده شده است. ادامه دهید به همین شکل!"
        />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoVcardRight />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoInfoImage
          rounded="lg"
          image="/img/illustrations/widgets/7.svg"
          title="دو دستاورد جدید را باز کرده‌اید"
          text="تبریک! تلاش‌های شما پاداش داده شده است. ادامه دهید به همین شکل!"
        />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-5">
        <!-- Title -->
        <div class="mb-8 flex items-center justify-between">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>تیم من</span>
          </BaseHeading>
          <BaseButton
            color="primary"
            size="sm"
            variant="pastel"
            rounded="md"
          >
            مشاهده همه
          </BaseButton>
        </div>
        <DemoTeamListCompact />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative flex flex-col gap-4">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoInfoImage
          rounded="lg"
          image="/img/illustrations/widgets/4.svg"
          title="دو دستاورد جدید را باز کرده‌اید"
          text="تبریک! تلاش‌های شما پاداش داده شده است. ادامه دهید به همین شکل!"
        />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoSocialLinks rounded="lg" />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoTeamSearchCompact rounded="lg" />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoShoppingCartCompact rounded="lg" />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative flex flex-col gap-4">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoIconText
          title="@eltheme"
          icon="lucide:twitter"
          text="تایرو به زودی منتشر می‌شود، احتمالاً در تعطیلات کریسمس یا پایان سال."
          indicator
        >
          <div
            class="text-primary-500 mt-3 flex w-full gap-2 font-sans text-xs font-medium"
          >
            <NuxtLink to="#">
              #uikit
            </NuxtLink>
            <NuxtLink to="#">
              #داشبوردها
            </NuxtLink>
            <NuxtLink to="#">
              #تیلوایند
            </NuxtLink>
          </div>
        </DemoIconText>
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoInfoImage
          rounded="lg"
          image="/img/illustrations/widgets/5.svg"
          title="دو دستاورد جدید را باز کرده‌اید"
          text="تبریک! تلاش‌های شما پاداش داده شده است. ادامه دهید به همین شکل!"
        />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoVcardRight centered />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoImageLinks rounded="lg" />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoProgressCircle
          image="/img/avatars/6.svg"
          :title="`${78}% تکمیل‌شده!`"
          text="تبریک! تلاش‌های شما پاداش داده شده است. ادامه دهید به همین شکل!"
          :value="78"
        />
      </BaseCard>
    </div>
    <!-- Column -->
    <div class="relative flex flex-col gap-4">
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoProductCompact
          image="/img/illustrations/widgets/watch-3.svg"
          title="ساعت متصل"
          text="اپل - ساعت متصل نسل ۵، ۶۴ گیگابایت، انتشار ۲۰۲۳"
          icon="fa6-brands:apple"
          rounded="lg"
        />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-6">
        <DemoIconsSquare rounded="lg" />
      </BaseCard>
      <!-- Widget -->
      <BaseCard rounded="lg" class="p-4">
        <DemoInfoImage
          rounded="lg"
          image="/img/illustrations/widgets/8.svg"
          title="دو دستاورد جدید را باز کرده‌اید"
          text="تبریک! تلاش‌های شما پاداش داده شده است. ادامه دهید به همین شکل!"
        />
      </BaseCard>
    </div>
  </div>
</template>
