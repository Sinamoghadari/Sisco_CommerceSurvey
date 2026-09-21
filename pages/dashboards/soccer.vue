<script setup lang="ts">
definePageMeta({
  title: 'فوتبال',
  preview: {
    title: 'داشبورد فوتبال',
    description: 'برای طرفداران فوتبال',
    categories: ['داشبوردها'],
    src: '/img/screens/dashboards-soccer.png',
    srcDark: '/img/screens/dashboards-soccer-dark.png',
    order: 20,
  },
})

const matches = [
  {
    id: 1,
    status: 'live',
    time: '11:30',
    stadium: 'کمپ نو',
    match: {
      home: {
        name: 'بارسلونا',
        logo: '/img/icons/soccer/teams/barcelona.svg',
        score: 4,
      },
      away: {
        name: 'PSG',
        logo: '/img/icons/soccer/teams/psg.svg',
        score: 0,
      },
    },
  },
  {
    id: 2,
    status: 'scheduled',
    time: '14:30',
    stadium: 'برنابئو',
    match: {
      home: {
        name: 'رئال مادرید',
        logo: '/img/icons/soccer/teams/madrid.svg',
        score: 1,
      },
      away: {
        name: 'لیورپول',
        logo: '/img/icons/soccer/teams/liverpool.svg',
        score: 0,
      },
    },
  },
  {
    id: 3,
    status: 'scheduled',
    time: '16:30',
    stadium: 'آرسنال',
    match: {
      home: {
        name: 'آرسنال',
        logo: '/img/icons/soccer/teams/arsenal.svg',
        score: undefined,
      },
      away: {
        name: 'چلسی',
        logo: '/img/icons/soccer/teams/chelsea.svg',
        score: undefined,
      },
    },
  },
  {
    id: 4,
    status: 'scheduled',
    time: '18:30',
    stadium: 'گودیسون پارک',
    match: {
      home: {
        name: 'اورتون',
        logo: '/img/icons/soccer/teams/everton.svg',
        score: undefined,
      },
      away: {
        name: 'لیورپول',
        logo: '/img/icons/soccer/teams/liverpool.svg',
        score: undefined,
      },
    },
  },
  {
    id: 5,
    status: 'scheduled',
    time: '20:30',
    stadium: 'خوزه زوریا',
    match: {
      home: {
        name: 'وایادولید',
        logo: '/img/icons/soccer/teams/valladolid.svg',
        score: undefined,
      },
      away: {
        name: 'زاگرب',
        logo: '/img/icons/soccer/teams/zagreb.svg',
        score: undefined,
      },
    },
  },
  {
    id: 6,
    status: 'scheduled',
    time: '22:30',
    stadium: 'پارک د پرنس',
    match: {
      home: {
        name: 'PSG',
        logo: '/img/icons/soccer/teams/psg.svg',
        score: undefined,
      },
      away: {
        name: 'چلسی',
        logo: '/img/icons/soccer/teams/chelsea.svg',
        score: undefined,
      },
    },
  },
]
</script>

<template>
  <div class="relative mt-12">
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Column -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="ptablet:flex-row flex flex-col gap-6">
          <!-- Widget -->
          <BaseCard rounded="lg" class="p-8">
            <!-- Title -->
            <div class="mb-6 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>لیگ قهرمانان یوفا</span>
              </BaseHeading>
            </div>
            <!-- Subtitle -->
            <div class="mb-6 flex items-center justify-between">
              <div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 mb-1 dark:text-white"
                >
                  <span>گروه C</span>
                </BaseHeading>
                <BaseParagraph size="xs">
                  <span class="text-muted-400">تطبیق ۳ از ۶</span>
                </BaseParagraph>
              </div>
              <div>
                <BaseTag
                  rounded="full"
                  color="danger"
                  class="inline-flex items-center justify-center gap-1"
                  size="sm"
                >
                  <Icon name="lucide:video" class="size-3" />
                  <span>در حال پخش</span>
                </BaseTag>
              </div>
            </div>
            <!-- Results -->
            <div class="mb-6 flex items-center justify-between">
              <div class="flex flex-col text-center">
                <img
                  class="mx-auto size-12"
                  src="/img/icons/soccer/teams/barcelona.svg"
                  alt="لوگوی تیم"
                >
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="light"
                  lead="tight"
                  class="text-muted-500 dark:text-muted-400 mt-2"
                >
                  <span>بارسلونا</span>
                </BaseHeading>
              </div>
              <div
                class="text-muted-800 dark:text-muted-100 flex items-center justify-center gap-2 text-center font-sans"
              >
                <span class="text-5xl font-bold">4</span>
                <span class="text-4xl font-bold">:</span>
                <span class="text-5xl font-bold">0</span>
              </div>
              <div class="flex flex-col text-center">
                <img
                  class="mx-auto size-12"
                  src="/img/icons/soccer/teams/psg.svg"
                  alt="لوگوی تیم"
                >
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="light"
                  lead="tight"
                  class="text-muted-500 dark:text-muted-400 mt-2"
                >
                  <span>PSG</span>
                </BaseHeading>
              </div>
            </div>
            <!-- Action -->
            <div>
              <BaseButton
                color="primary"
                rounded="lg"
                class="!h-12 w-full"
              >
                <span>اکنون تماشا کنید</span>
              </BaseButton>
            </div>
          </BaseCard>
          <!-- Widget -->
          <BaseCard rounded="lg" class="p-8">
            <!-- Title -->
            <div class="mb-6 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>لیگ‌های موجود</span>
              </BaseHeading>
            </div>
            <DemoLeagueListCompact />
          </BaseCard>
        </div>
      </div>
      <!-- Column -->
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <div class="flex flex-col gap-6">
          <!-- Header -->
          <div class="col-span-12">
            <div
              class="bg-primary-800 flex flex-col items-center rounded-2xl sm:flex-row"
            >
              <div class="mt-6 grow pe-6 ps-6 sm:mt-0 sm:pe-0 sm:ps-10">
                <div class="pb-4 text-center sm:pb-0 sm:text-start">
                  <BaseHeading tag="h1" class="text-white opacity-90">
                    <span>در مسابقه ما جوایز شگفت‌انگیزی برنده شوید</span>
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-white opacity-70">
                    <span>
                      پیش‌بینی کنید که چه کسی برنده خواهد شد و چگونه یک مسابقه پایان می‌یابد و شانس برنده شدن جوایز نقدی فوق‌العاده را به‌دست آورید.
                    </span>
                  </BaseParagraph>
                  <div class="mt-2">
                    <BaseButton
                      size="sm"
                      color="light"
                      variant="outline"
                      class="w-full sm:w-auto"
                    >
                      <span>بیشتر بیاموزید</span>
                      <Icon name="lucide:arrow-right" class="rtl:rotate-180 size-4" />
                    </BaseButton>
                  </div>
                </div>
              </div>
              <div class="relative h-[280px] w-[320px] shrink-0 sm:h-[225px]">
                <img
                  class="pointer-events-none absolute bottom-0 end-6 sm:-end-10"
                  src="/img/illustrations/dashboards/soccer/soccer-player.svg"
                  alt="بازیکن فوتبال"
                >
              </div>
            </div>
          </div>
          <!-- Table -->
          <BaseCard rounded="lg" class="p-8">
            <div class="mb-6 flex gap-4 font-sans">
              <button
                class="border-primary-500 text-muted-800 dark:text-muted-100 border-b-2 pb-4"
              >
                همه
              </button>
              <button
                class="text-muted-400 dark:text-muted-500 border-b-2 border-transparent pb-4"
              >
                زنده
              </button>
              <button
                class="text-muted-400 dark:text-muted-500 border-b-2 border-transparent pb-4"
              >
                تمام‌شده
              </button>
              <button
                class="text-muted-400 dark:text-muted-500 border-b-2 border-transparent pb-4"
              >
                برنامه‌ریزی‌شده
              </button>
            </div>
            <div class="overflow-x-auto">
              <div class="inline-block min-w-full align-middle">
                <div class="overflow-hidden">
                  <table
                    class="min-w-full table-fixed divide-y divide-slate-200 text-start dark:divide-slate-700"
                  >
                    <thead>
                      <th class="py-3 font-sans text-xs uppercase">
                        زمان
                      </th>
                      <th
                        class="xs:px-8 py-3 text-center font-sans text-xs uppercase"
                      >
                        مسابقه
                      </th>
                      <th class="xs:px-4 py-3 font-sans text-xs uppercase">
                        ورزشگاه
                      </th>
                      <th class="xs:px-4 py-3 font-sans text-xs uppercase">
                        جزئیات
                      </th>
                    </thead>
                    <tbody>
                      <tr v-for="match in matches" :key="match.id">
                        <td class="py-4 align-middle">
                          <div
                            class="text-muted-500 dark:text-muted-400 flex items-center gap-2 font-sans text-sm"
                            :data-nui-tooltip="capitalize(match.status)"
                          >
                            <div
                              class="size-2 rounded-full"
                              :class="
                                match.status === 'live'
                                  ? 'bg-rose-500'
                                  : 'bg-muted-300 dark:bg-muted-600'
                              "
                            />
                            <span>{{ match.time }}</span>
                          </div>
                        </td>
                        <td class="xs:px-8 py-4">
                          <div class="flex items-center justify-center gap-4">
                            <div
                              class="flex w-[120px] items-center justify-end gap-2"
                            >
                              <BaseHeading
                                as="h4"
                                size="sm"
                                weight="light"
                                lead="none"
                                class="text-muted-500 dark:text-muted-400"
                              >
                                <span>{{ match.match.home.name }}</span>
                              </BaseHeading>
                              <img
                                class="size-8"
                                :src="match.match.home.logo"
                                :alt="match.match.home.name"
                              >
                            </div>
                            <div
                              class="text-muted-800 dark:text-muted-100 flex items-center justify-center gap-2 text-center font-sans"
                            >
                              <span class="text-sm font-bold">
                                {{
                                  match.match.home.score !== undefined
                                    ? match.match.home.score
                                    : '-'
                                }}
                              </span>
                              <span class="text-xs font-bold">:</span>
                              <span class="text-sm font-bold">
                                {{
                                  match.match.away.score !== undefined
                                    ? match.match.away.score
                                    : '-'
                                }}
                              </span>
                            </div>
                            <div class="flex w-[120px] items-center gap-2">
                              <img
                                class="size-8"
                                :src="match.match.away.logo"
                                :alt="match.match.away.name"
                              >
                              <BaseHeading
                                as="h4"
                                size="sm"
                                weight="light"
                                lead="none"
                                class="text-muted-500 dark:text-muted-400"
                              >
                                <span>{{ match.match.away.name }}</span>
                              </BaseHeading>
                            </div>
                          </div>
                        </td>
                        <td class="xs:px-4 py-4">
                          <div
                            class="text-muted-500 dark:text-muted-400 font-sans text-sm"
                          >
                            <span class="whitespace-nowrap">
                              {{ match.stadium }}
                            </span>
                          </div>
                        </td>
                        <td class="xs:px-4 py-4">
                          <div>
                            <BaseButtonIcon small muted>
                              <Icon
                                name="lucide:more-horizontal"
                                class="size-4"
                              />
                            </BaseButtonIcon>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
