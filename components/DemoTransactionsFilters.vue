<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'

const months = [
  {
    id: 'january',
    label: 'دی',
  },
  {
    id: 'february',
    label: 'بهمن',
  },
  {
    id: 'march',
    label: 'اسفند',
  },
  {
    id: 'april',
    label: 'فروردین',
  },
  {
    id: 'may',
    label: 'اردیبهشت',
  },
  {
    id: 'june',
    label: 'خرداد',
  },
  {
    id: 'july',
    label: 'تیر',
  },
  {
    id: 'august',
    label: 'اَمرداد',
  },
  {
    id: 'september',
    label: 'شهریور',
  },
  {
    id: 'october',
    label: 'مهر',
  },
  {
    id: 'november',
    label: 'آبان',
  },
  {
    id: 'december',
    label: 'آذر',
  },
]

const defaultKeywords = [
  'وال‌مارت',
  'کارت اعتباری',
  'شرکت هری',
  'هزینه‌ها',
  'درآمد',
  'خواربار',
  'اسباب‌بازی‌ها',
  'رستوران',
]

const activeFilterTab = ref('filter-1')
const timeCategory = ref('all')
const timeCategoryFrom = ref('')
const timeCategoryTo = ref('')
const keywords = ref('')
const selectedKeyWords = ref([''])
const status = ref([''])
const accounts = ref([''])
const paymentMethods = ref([''])
</script>

<template>
  <div class="group relative hidden md:block">
    <Menu
      as="div"
      class=""
    >
      <MenuButton as="template">
        <BaseButton
          rounded="md"
          size="sm"
        >
          <Icon name="lucide:filter" class="me-2 size-4" />
          <span>افزودن فیلتر</span>
        </BaseButton>
      </MenuButton>

      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 shadow-muted-400/20 dark:shadow-muted-800/20 absolute start-0 top-11 grid w-[660px] grid-cols-12 overflow-hidden rounded-lg border bg-white shadow-xl"
        >
          <div class="bg-muted-50 dark:bg-muted-900 col-span-4 space-y-2 p-6">
            <!--Menu item-->
            <button
              type="button"
              data-tab="tab-1"
              class="tw-accessibility click-blur flex w-full cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 font-sans text-sm transition-all duration-300"
              :class="
                activeFilterTab === 'filter-1'
                  ? 'text-primary-500 border-primary-500 bg-primary-500/10'
                  : 'text-muted-500 hover:text-muted-600 dark:hover:text-muted-300 border-muted-50 dark:border-muted-900 hover:bg-muted-200 dark:hover:bg-muted-800'
              "
              @click="activeFilterTab = 'filter-1'"
            >
              <Icon name="lucide:calendar" class="size-4" />
              <span>تاریخ ایجاد</span>
              <Icon name="lucide:chevron-right" class="ms-auto size-4 rtl:rotate-180" />
            </button>
            <!--Menu item-->
            <button
              type="button"
              data-tab="tab-2"
              class="tw-accessibility click-blur flex w-full cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 font-sans text-sm transition-all duration-300"
              :class="
                activeFilterTab === 'filter-2'
                  ? 'text-primary-500 border-primary-500 bg-primary-500/10'
                  : 'text-muted-500 hover:text-muted-600 dark:hover:text-muted-300 border-muted-50 dark:border-muted-900 hover:bg-muted-200 dark:hover:bg-muted-800'
              "
              @click="activeFilterTab = 'filter-2'"
            >
              <Icon name="lucide:search" class="size-4" />
              <span>کلیدواژه‌ها</span>
              <Icon name="lucide:chevron-right" class="ms-auto size-4 rtl:rotate-180" />
            </button>
            <!--Menu item-->
            <button
              type="button"
              data-tab="tab-3"
              class="tw-accessibility click-blur flex w-full cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 font-sans text-sm transition-all duration-300"
              :class="
                activeFilterTab === 'filter-3'
                  ? 'text-primary-500 border-primary-500 bg-primary-500/10'
                  : 'text-muted-500 hover:text-muted-600 dark:hover:text-muted-300 border-muted-50 dark:border-muted-900 hover:bg-muted-200 dark:hover:bg-muted-800'
              "
              @click="activeFilterTab = 'filter-3'"
            >
              <Icon name="lucide:loader" class="size-4" />
              <span>وضعیت</span>
              <Icon name="lucide:chevron-right" class="ms-auto size-4 rtl:rotate-180" />
            </button>
            <!--Menu item-->
            <button
              type="button"
              data-tab="tab-4"
              class="tw-accessibility click-blur flex w-full cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 font-sans text-sm transition-all duration-300"
              :class="
                activeFilterTab === 'filter-4'
                  ? 'text-primary-500 border-primary-500 bg-primary-500/10'
                  : 'text-muted-500 hover:text-muted-600 dark:hover:text-muted-300 border-muted-50 dark:border-muted-900 hover:bg-muted-200 dark:hover:bg-muted-800'
              "
              @click="activeFilterTab = 'filter-4'"
            >
              <Icon name="lucide:piggy-bank" class="size-4" />
              <span>حساب‌های کاربری</span>
              <Icon name="lucide:chevron-right" class="ms-auto size-4 rtl:rotate-180" />
            </button>
            <!--Menu item-->
            <button
              type="button"
              data-tab="tab-5"
              class="tw-accessibility click-blur flex w-full cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 font-sans text-sm transition-all duration-300"
              :class="
                activeFilterTab === 'filter-5'
                  ? 'text-primary-500 border-primary-500 bg-primary-500/10'
                  : 'text-muted-500 hover:text-muted-600 dark:hover:text-muted-300 border-muted-50 dark:border-muted-900 hover:bg-muted-200 dark:hover:bg-muted-800'
              "
              @click="activeFilterTab = 'filter-5'"
            >
              <Icon name="lucide:credit-card" class="size-4" />
              <span>پرداخت</span>
              <Icon name="lucide:chevron-right" class="ms-auto size-4 rtl:rotate-180" />
            </button>
          </div>

          <!--Filters-->
          <div class="col-span-8 min-h-[350px] p-6">
            <!--Filter 1-->
            <div v-if="activeFilterTab === 'filter-1'">
              <div class="flex flex-col">
                <div class="px-3">
                  <div class="relative">
                    <BaseSelect
                      v-model="timeCategory"
                      label="Show transactions made within"
                      class="border-muted-300 text-muted-600 focus:border-muted-300 dark:bg-muted-900 dark:text-muted-200 dark:border-muted-800 dark:focus:border-muted-800 tw-accessibility h-10 w-full appearance-none rounded border bg-white px-3 py-2 font-sans text-sm leading-5 transition-all duration-300 placeholder:text-gray-300 focus:shadow-lg dark:placeholder:text-gray-600"
                    >
                      <option value="all">
                        همه زمان
                      </option>
                      <option value="30_days">
                        ۳۰ روز گذشته
                      </option>
                      <option value="this_month">
                        این ماه
                      </option>
                      <option value="last_month">
                        ماه گذشته
                      </option>
                      <option value="this_year">
                        امسال
                      </option>
                      <option value="last_year">
                        پارسال
                      </option>
                    </BaseSelect>
                  </div>
                  <hr
                    class="border-muted-200 dark:border-muted-700 mb-4 mt-6 border-t"
                  >
                  <BaseText
                    size="xs"
                    class="text-muted-400 mb-4"
                  >
                    یا محدوده تاریخی را انتخاب کنید
                  </BaseText>
                  <div class="grid grid-cols-2 gap-8">
                    <!--Calendar group-->
                    <div>
                      <!--Calendar-->
                      <div class="flex flex-col">
                        <div
                          class="mb-2 flex items-center justify-between px-3"
                        >
                          <button
                            type="button"
                            class="text-muted-400 flex w-6 cursor-pointer items-center justify-center"
                          >
                            <Icon name="lucide:arrow-left" class="size-4" />
                          </button>
                          <span
                            class="font-heading text-muted-700 dark:text-muted-100 text-sm"
                          >
                            2023
                          </span>
                          <button
                            type="button"
                            class="text-muted-400 flex w-6 cursor-pointer items-center justify-center"
                          >
                            <Icon name="lucide:arrow-right" class="size-4 rtl:rotate-180" />
                          </button>
                        </div>
                        <div class="grid grid-cols-3 gap-1">
                          <div
                            v-for="month in months"
                            :key="month.id"
                            class="flex items-center justify-center"
                          >
                            <BaseRadioHeadless
                              v-model="timeCategoryFrom"
                              name="radio_date_from"
                              :value="month.id"
                            >
                              <button
                                type="button"
                                class="text-muted-500 dark:text-muted-400 group-hover/nui-radio-headless:text-muted-600 dark:group-hover/nui-radio-headless:text-muted-200 peer-checked:text-primary-500 peer-checked:bg-primary-500/10 group-hover/nui-radio-headless:bg-muted-100 dark:group-hover/nui-radio-headless:bg-muted-800 flex size-8 items-center justify-center rounded-full font-sans text-xs transition-colors duration-200"
                              >
                                {{ month.label }}
                              </button>
                            </BaseRadioHeadless>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--Calendar group-->
                    <div>
                      <!--Calendar-->
                      <div class="flex flex-col">
                        <div
                          class="mb-2 flex items-center justify-between px-3"
                        >
                          <button
                            type="button"
                            class="text-muted-400 flex w-6 cursor-pointer items-center justify-center"
                          >
                            <Icon name="lucide:arrow-left" class="size-4" />
                          </button>
                          <span
                            class="font-heading text-muted-700 dark:text-muted-100 text-sm"
                          >
                            2023
                          </span>
                          <button
                            type="button"
                            class="text-muted-400 flex w-6 cursor-pointer items-center justify-center"
                          >
                            <Icon name="lucide:arrow-right" class="size-4 rtl:rotate-180" />
                          </button>
                        </div>
                        <div class="grid grid-cols-3 gap-1">
                          <div
                            v-for="month in months"
                            :key="month.id"
                            class="flex items-center justify-center"
                          >
                            <BaseRadioHeadless
                              v-model="timeCategoryTo"
                              name="radio_date_to"
                              :value="month.id"
                            >
                              <button
                                type="button"
                                class="text-muted-500 dark:text-muted-400 group-hover/nui-radio-headless:text-muted-600 dark:group-hover/nui-radio-headless:text-muted-200 peer-checked:text-primary-500 peer-checked:bg-primary-500/10 group-hover/nui-radio-headless:bg-muted-100 dark:group-hover/nui-radio-headless:bg-muted-800 flex size-8 items-center justify-center rounded-full font-sans text-xs transition-colors duration-200"
                              >
                                {{ month.label }}
                              </button>
                            </BaseRadioHeadless>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--Filter 2-->
            <div v-else-if="activeFilterTab === 'filter-2'">
              <div class="flex flex-col">
                <div class="px-3">
                  <div class="relative">
                    <BaseInput
                      v-model="keywords"
                      label="جستجو برای کلمات کلیدی بخصوص"
                      icon="lucide:search"
                      placeholder="کلمات کلیدی شما..."
                    />
                  </div>
                  <hr
                    class="border-muted-200 dark:border-muted-700 mb-4 mt-6 border-t"
                  >

                  <!--Grid-->
                  <div class="flex flex-wrap items-center gap-2">
                    <div
                      v-for="keyword in defaultKeywords"
                      :key="keyword"
                      class="flex items-center justify-center"
                    >
                      <BaseCheckboxHeadless
                        v-model="selectedKeyWords"
                        :value="keyword"
                      >
                        <button
                          type="button"
                          class="text-muted-500 dark:text-muted-200 dark:bg-muted-900 border-muted-200 dark:border-muted-800 peer-checked:bg-primary-500/10 peer-checked:border-primary-500 peer-checked:text-primary-500 inline-flex items-center justify-center rounded-full border-2 bg-white px-4 py-1.5 font-sans text-xs transition-colors duration-300"
                        >
                          {{ keyword }}
                        </button>
                      </BaseCheckboxHeadless>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--Filter 3-->
            <div v-else-if="activeFilterTab === 'filter-3'">
              <div class="flex flex-col">
                <div class="px-3">
                  <div class="relative flex items-center justify-between">
                    <p class="text-muted-400 font-sans text-sm">
                      بمنظور اعمال فیلتر وضعیت را انتخاب نمائید
                    </p>
                    <button
                      type="button"
                      class="text-medium text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                      @click="
                        status = [
                          'در حال پردازش',
                          'در حال تکمیل',
                          'تکمیل شده',
                          'رد شده',
                        ]
                      "
                    >
                      انتخاب همه
                    </button>
                  </div>
                  <hr
                    class="border-muted-200 dark:border-muted-700 mb-4 mt-6 border-t"
                  >

                  <div class="space-y-4">
                    <!--Status-->
                    <div>
                      <BaseCheckbox
                        v-model="status"
                        color="primary"
                        label="در حال پردازش"
                        value="در حال پردازش"
                      />
                    </div>
                    <div>
                      <BaseCheckbox
                        v-model="status"
                        color="primary"
                        label="در حال تکمیل"
                        value="در حال تکمیل"
                      />
                    </div>
                    <div>
                      <BaseCheckbox
                        v-model="status"
                        color="primary"
                        label="تکمیل شده"
                        value="تکمیل شده"
                      />
                    </div>
                    <div>
                      <BaseCheckbox
                        v-model="status"
                        color="primary"
                        label="رد شده"
                        value="رد شده"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--Filter 4-->
            <div v-else-if="activeFilterTab === 'filter-4'">
              <div class="flex flex-col">
                <div class="px-3">
                  <div class="relative flex items-center justify-between">
                    <p class="text-muted-400 font-sans text-sm">
                      برای اعمال فیلتر حساب‌های کاربری را انتخاب کنید
                    </p>
                    <button
                      type="button"
                      class="text-medium text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                      @click="accounts = ['45656494', '83464209']"
                    >
                      انتخاب همه
                    </button>
                  </div>
                  <hr
                    class="border-muted-200 dark:border-muted-700 mb-4 mt-6 border-t"
                  >

                  <div class="space-y-4">
                    <!--Account-->
                    <div>
                      <BaseCheckbox
                        v-model="accounts"
                        color="primary"
                        label="حساب بانکی **** 4565 6494"
                        value="45656494"
                      />
                    </div>
                    <div>
                      <BaseCheckbox
                        v-model="accounts"
                        color="primary"
                        label="حساب بانکی **** 8346 4209"
                        value="83464209"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--Filter 5-->
            <div v-else-if="activeFilterTab === 'filter-5'">
              <div class="flex flex-col">
                <div class="px-3">
                  <div class="relative flex items-center justify-between">
                    <p class="text-muted-400 font-sans text-sm">
                      فیلتر کردن روش‌های پرداخت
                    </p>
                    <button
                      type="button"
                      class="text-medium text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                      @click="
                        paymentMethods = ['credit-card', 'transfer', 'cheque']
                      "
                    >
                      انتخاب همه
                    </button>
                  </div>
                  <hr
                    class="border-muted-200 dark:border-muted-700 mb-4 mt-6 border-t"
                  >

                  <div class="space-y-4">
                    <!--Payment method-->
                    <div>
                      <BaseCheckbox
                        v-model="paymentMethods"
                        color="primary"
                        label="کارت اعتباری"
                        value="credit-card"
                      />
                    </div>
                    <div>
                      <BaseCheckbox
                        v-model="paymentMethods"
                        color="primary"
                        label="انتقال"
                        value="transfer"
                      />
                    </div>
                    <div>
                      <BaseCheckbox
                        v-model="paymentMethods"
                        color="primary"
                        label="چک"
                        value="cheque"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
</template>
