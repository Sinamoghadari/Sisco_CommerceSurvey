<script setup lang="ts">
definePageMeta({
  title: 'ویدئو',
  preview: {
    title: 'داشبورد ویدیو',
    description: 'برای سازندگان محتوای ویدیویی',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-video.png',
    srcDark: '/img/screens/dashboards-video-dark.png',
    order: 19,
  },
})

const featuredVideos = [
  {
    id: 1,
    title: 'صفحه فرود واکنش‌گرا را با استفاده از تیلویند سی‌اس‌اس کدنویسی کنید',
    slug: '',
    cover: '/img/illustrations/dashboards/video/1.png',
    uploaded: '۲ ساعت پیش',
    category: 'فرانت‌اند',
    author: {
      name: 'هرمان مایر',
      avatar: '/img/avatars/16.svg',
    },
  },
  {
    id: 2,
    title: 'طراحی یک چارچوب UI منسجم برای اپلیکیشن شما',
    slug: '',
    cover: '/img/illustrations/dashboards/video/2.jpg',
    uploaded: '۶ ساعت پیش',
    category: 'UI/UX',
    author: {
      name: 'کندرا ویلسون',
      avatar: '/img/avatars/10.svg',
    },
  },
  {
    id: 3,
    title: 'طراحی مجموعه‌ای از ویجت‌های نمودار برای داشبورد بعدی من',
    slug: '',
    cover: '/img/illustrations/dashboards/video/3.png',
    uploaded: 'دیروز',
    category: 'فرانت‌اند',
    author: {
      name: 'آنا لوپز',
      avatar: '/img/avatars/12.svg',
    },
  },
  {
    id: 4,
    title: 'ادغام مینیمالیسم و فضای منفی در طراحی‌های شما',
    slug: '',
    cover: '/img/illustrations/dashboards/video/4.png',
    uploaded: '۲ روز پیش',
    category: 'طراحی',
    author: {
      name: 'جان پولاک',
      avatar: '/img/avatars/17.svg',
    },
  },
  {
    id: 5,
    title: 'ایجاد بخش‌های قابل استفاده مجدد با استفاده از تیلویند سی‌اس‌اس',
    slug: '',
    cover: '/img/illustrations/dashboards/video/5.png',
    uploaded: 'هفته گذشته',
    category: 'UI/UX',
    author: {
      name: 'مایا روسلینی',
      avatar: '/img/avatars/2.svg',
    },
  },
]

const videos = [
  {
    id: 6,
    title: 'چگونه طراحی صفحه فرود برنامه موبایل را در نظر بگیریم',
    slug: '',
    cover: '/img/illustrations/dashboards/video/6.png',
    uploaded: '۷ ساعت پیش',
    category: 'فرانت‌اند',
    author: {
      name: 'آلان اسکلی',
      avatar: '/img/avatars/11.svg',
    },
  },
  {
    id: 6,
    title: '۸ نکته برای رساندن پیام درست در صحبت با پرسوناها',
    slug: '',
    cover: '/img/illustrations/dashboards/video/7.jpg',
    uploaded: 'دیروز',
    category: 'UI/UX',
    author: {
      name: 'کندرا ویلسون',
      avatar: '/img/avatars/10.svg',
    },
  },
  {
    id: 7,
    title: '۵ تفاوت بین تبلیغ خدمات شما و یک محصول',
    slug: '',
    cover: '/img/illustrations/dashboards/video/8.jpg',
    uploaded: 'دیروز',
    category: 'Branding',
    author: {
      name: 'کلاریسا میلر',
      avatar: '/img/avatars/5.svg',
    },
  },
  {
    id: 8,
    title: 'سرعت توسعه موبایل خود را با استفاده از فلاتر افزایش دهید',
    slug: '',
    cover: '/img/illustrations/dashboards/video/9.png',
    uploaded: '۲ روز پیش',
    category: 'Mobile',
    author: {
      name: 'هرمان مایر',
      avatar: '/img/avatars/16.svg',
    },
  },
  {
    id: 9,
    title: 'چگونه یک سیستم طراحی کامل برای پروژه آخرم ساختم',
    slug: '',
    cover: '/img/illustrations/dashboards/video/10.png',
    uploaded: 'دیروز',
    category: 'UI/UX',
    author: {
      name: 'آنا لوپز',
      avatar: '/img/avatars/12.svg',
    },
  },
  {
    id: 9,
    title: 'بحث بی‌پایان بین توسعه و پروژه‌های کد پایین',
    slug: '',
    cover: '/img/illustrations/dashboards/video/11.png',
    uploaded: '۵ روز پیش',
    category: 'مهندسی',
    author: {
      name: 'رون ایمسث',
      avatar: '/img/avatars/14.svg',
    },
  },
  {
    id: 10,
    title:
      'استفاده از کامپوننت جاوااسکریپت برای تضمین قابلیت استفاده مجدد از کد در پروژه شما',
    slug: '',
    cover: '/img/illustrations/dashboards/video/12.png',
    uploaded: '۲ هفته پیش',
    category: 'مهندسی',
    author: {
      name: 'پیتر ویلند',
      avatar: '/img/avatars/15.svg',
    },
  },
  {
    id: 11,
    title:
      'چگونه از مینیمالیسم برای تأکید بر پیام صحیح در طراحی‌های خود استفاده کنیم',
    slug: '',
    cover: '/img/illustrations/dashboards/video/13.png',
    uploaded: '۱ماه پیش',
    category: 'UI/UX',
    author: {
      name: 'کلارک همیلتون',
      avatar: '/img/avatars/3.svg',
    },
  },
  {
    id: 12,
    title: '۱۰ چالشی که طراحان UX باید بتوانند در طول حرفه‌شان با آنها مواجه شوند',
    slug: '',
    cover: '/img/illustrations/dashboards/video/14.png',
    uploaded: '۱ماه پیش',
    category: 'UI/UX',
    author: {
      name: 'مایا روسلینی',
      avatar: '/img/avatars/2.svg',
    },
  },
]
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex flex-col justify-between md:flex-row md:items-center">
      <div
        class="ltablet:max-w-full flex max-w-[425px] flex-col items-center gap-4 text-center md:flex-row md:text-start lg:max-w-full"
      >
        <div>
          <BaseHeading
            as="h2"
            size="xl"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>ویدیوهای اخیر</span>
          </BaseHeading>
          <BaseParagraph>
            <span class="text-muted-500">
              ویدیوهای اخیر که امروز زودتر ارسال شده‌اند
            </span>
          </BaseParagraph>
        </div>
      </div>
      <div class="xs:text-center xs:mt-2 space-y-2">
        <span class="text-muted-400 font-sans text-xs font-medium uppercase">
          تیم من
        </span>
        <div class="flex items-center justify-center gap-2 md:justify-start">
          <BaseButtonIcon small>
            <Icon name="lucide:plus" class="size-4" />
          </BaseButtonIcon>
          <BaseAvatar
            size="xs"
            rounded="none"
            mask="blob"
            src="/img/avatars/10.svg"
          />
          <BaseAvatar
            size="xs"
            rounded="none"
            mask="blob"
            src="/img/avatars/8.svg"
          />
          <BaseAvatar
            size="xs"
            rounded="none"
            mask="blob"
            src="/img/avatars/5.svg"
          />
          <BaseAvatar
            size="xs"
            rounded="none"
            mask="blob"
            src="/img/avatars/16.svg"
          />
        </div>
      </div>
    </div>

    <!-- Featured videos -->
    <div class="relative">
      <!-- Grid -->
      <div class="grid min-h-[440px] grid-cols-12 gap-6">
        <!-- Column -->
        <div
          v-for="video in featuredVideos.slice(0, 1)"
          :key="video.id"
          class="ltablet:col-span-6 col-span-12 lg:col-span-6"
        >
          <div class="flex h-full flex-col">
            <div
              class="bg-muted-200 dark:bg-muted-800 group relative size-full overflow-hidden rounded-2xl"
            >
              <img
                :src="video.cover"
                :alt="video.title"
                class="w-full object-cover object-center"
              >
              <div
                class="absolute inset-x-0 bottom-0 z-10 h-3/5 w-full bg-gradient-to-t from-black transition-all duration-500 ease-in-out group-hover:h-full"
              />
              <div
                class="absolute inset-0 z-20 flex size-full flex-col justify-between"
              >
                <div class="ptablet:p-10 p-6">
                  <NuxtLink
                    to="#"
                    class="group-hover:border-primary-500 text-muted-300 group-hover:text-primary-500 shadow-muted-300/30 dark:shadow-muted-900/20 flex size-14 items-center justify-center rounded-full border-2 border-transparent bg-white shadow-2xl transition-colors duration-300"
                  >
                    <Icon name="ic:round-play-arrow" class="size-7" />
                  </NuxtLink>
                </div>
                <div class="ptablet:p-10 p-6">
                  <NuxtLink to="#">
                    <BaseHeading
                      as="h3"
                      size="3xl"
                      weight="bold"
                      lead="tight"
                      class="xs:text-xl hover:text-primary-300 mb-4 line-clamp-2 text-white transition-colors duration-300"
                    >
                      <span>{{ video.title }}</span>
                    </BaseHeading>
                  </NuxtLink>
                  <div class="flex gap-3">
                    <BaseAvatar
                      :src="video.author.avatar"
                      :text="video.author.name.slice(0, 1)"
                      size="xs"
                      class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
                    />
                    <div>
                      <NuxtLink to="#">
                        <BaseHeading
                          as="h4"
                          size="xs"
                          weight="light"
                          lead="tight"
                          class="hover:text-primary-500 text-white transition-colors duration-300"
                        >
                          <span>{{ video.author.name }}</span>
                        </BaseHeading>
                      </NuxtLink>

                      <BaseParagraph size="xs">
                        <span class="text-muted-400">{{ video.uploaded }}</span>
                      </BaseParagraph>
                    </div>
                    <div class="ms-auto">
                      <BaseTag
                        color="primary"
                        rounded="full"
                        size="sm"
                      >
                        <span>{{ video.category }}</span>
                      </BaseTag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Column -->
        <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
          <div class="flex h-full flex-col">
            <div class="grid h-full grid-cols-12 gap-6">
              <!-- Subcolumn -->
              <div
                v-for="video in featuredVideos.slice(1)"
                :key="video.id"
                class="col-span-12 sm:col-span-6"
              >
                <div class="group flex h-full flex-col">
                  <div
                    class="bg-muted-200 dark:bg-muted-800 relative size-full overflow-hidden rounded-2xl"
                  >
                    <img
                      :src="video.cover"
                      :alt="video.title"
                      class="w-full object-cover object-center"
                    >
                    <div
                      class="absolute inset-x-0 bottom-0 z-10 h-3/5 w-full bg-gradient-to-t from-black transition-all duration-500 ease-in-out group-hover:h-full"
                    />
                    <div
                      class="absolute inset-0 z-20 flex size-full flex-col justify-between"
                    >
                      <div class="p-4">
                        <NuxtLink
                          to="#"
                          class="group-hover:border-primary-500 text-muted-300 group-hover:text-primary-500 shadow-muted-300/30 dark:shadow-muted-900/20 flex size-10 items-center justify-center rounded-full border-2 border-transparent bg-white shadow-2xl transition-colors duration-300"
                        >
                          <Icon name="ic:round-play-arrow" class="size-5" />
                        </NuxtLink>
                      </div>
                      <div class="p-4">
                        <NuxtLink to="#">
                          <BaseHeading
                            as="h3"
                            size="md"
                            weight="medium"
                            lead="tight"
                            class="xs:text-xl ptablet:text-xl ptablet:font-bold xs:font-bold hover:text-primary-300 mb-4 line-clamp-2 text-white transition-colors duration-300"
                          >
                            <span>{{ video.title }}</span>
                          </BaseHeading>
                        </NuxtLink>
                        <div class="flex gap-3">
                          <BaseAvatar
                            :src="video.author.avatar"
                            :text="video.author.name.slice(0, 1)"
                            size="xs"
                            class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
                          />
                          <div>
                            <NuxtLink to="#">
                              <BaseHeading
                                as="h4"
                                size="xs"
                                weight="light"
                                lead="tight"
                                class="hover:text-primary-500 text-white transition-colors duration-300"
                              >
                                <span>{{ video.author.name }}</span>
                              </BaseHeading>
                            </NuxtLink>

                            <BaseParagraph size="xs">
                              <span class="text-muted-400">
                                {{ video.uploaded }}
                              </span>
                            </BaseParagraph>
                          </div>
                          <div class="ms-auto">
                            <BaseTag
                              color="primary"
                              rounded="full"
                              size="sm"
                            >
                              <span>{{ video.category }}</span>
                            </BaseTag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div
      class="mb-8 mt-12 flex flex-col justify-between md:flex-row md:items-center"
    >
      <div
        class="ltablet:max-w-full flex max-w-[425px] flex-col items-center gap-4 text-center md:flex-row md:text-start lg:max-w-full"
      >
        <div>
          <BaseHeading
            as="h2"
            size="lg"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>ویدیوهای محبوب</span>
          </BaseHeading>
          <BaseParagraph size="sm">
            <span class="text-muted-500">
              ویدیوهایی که اخیراً توسط بسیاری از افراد مشاهده شده‌اند
            </span>
          </BaseParagraph>
        </div>
      </div>
      <div>
        <div
          class="xs:mt-2 flex items-center justify-center gap-2 md:justify-start"
        >
          <BaseButton small rounded="full">
            <Icon name="lucide:video" class="me-2 size-4" />
            <span>بارگذاری</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Column -->
      <div
        v-for="video in videos"
        :key="video.id"
        class="ptablet:col-span-6 col-span-12 sm:col-span-4"
      >
        <div class="group flex flex-col">
          <div
            class="bg-muted-200 dark:bg-muted-800 relative w-full overflow-hidden rounded-2xl"
          >
            <img
              :src="video.cover"
              :alt="video.title"
              class="w-full object-cover object-center"
            >
            <div
              class="absolute inset-x-0 bottom-0 z-10 h-3/5 w-full bg-gradient-to-t from-black transition-all duration-500 ease-in-out group-hover:h-full"
            />
            <div
              class="absolute inset-0 z-20 flex w-full flex-col justify-between"
            >
              <div class="p-4">
                <NuxtLink
                  to="#"
                  class="group-hover:border-primary-500 text-muted-300 group-hover:text-primary-500 shadow-muted-300/30 dark:shadow-muted-900/20 flex size-10 items-center justify-center rounded-full border-2 border-transparent bg-white shadow-2xl transition-colors duration-300"
                >
                  <Icon name="ic:round-play-arrow" class="size-5" />
                </NuxtLink>
              </div>
              <div class="p-4">
                <NuxtLink to="#">
                  <BaseHeading
                    as="h3"
                    size="xl"
                    weight="medium"
                    lead="tight"
                    class="xs:text-xl xs:font-bold hover:text-primary-300 mb-4 line-clamp-2 text-white transition-colors duration-300"
                  >
                    <span>{{ video.title }}</span>
                  </BaseHeading>
                </NuxtLink>

                <div class="flex gap-3">
                  <BaseAvatar
                    :src="video.author.avatar"
                    :text="video.author.name.slice(0, 1)"
                    size="xs"
                    class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
                  />
                  <div>
                    <NuxtLink to="#">
                      <BaseHeading
                        as="h4"
                        size="xs"
                        weight="light"
                        lead="tight"
                        class="hover:text-primary-500 text-white transition-colors duration-300"
                      >
                        <span>{{ video.author.name }}</span>
                      </BaseHeading>
                    </NuxtLink>

                    <BaseParagraph size="xs">
                      <span class="text-muted-400">{{ video.uploaded }}</span>
                    </BaseParagraph>
                  </div>
                  <div class="ms-auto">
                    <BaseTag
                      color="primary"
                      rounded="full"
                      size="sm"
                    >
                      <span>{{ video.category }}</span>
                    </BaseTag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Load more -->
    <div class="my-16 flex items-center justify-center">
      <BaseButton rounded="full" color="default">
        <Icon name="ph:dots-nine-bold" class="size-4 me-2" />
        <span>بارگذاری بیشتر</span>
      </BaseButton>
    </div>
  </div>
</template>
