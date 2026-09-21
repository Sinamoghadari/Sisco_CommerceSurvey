<script setup lang="ts">
import { FocusTrap } from '@headlessui/vue'

const props = withDefaults(
  defineProps<{
    card?: any
  }>(),
  {
    card: undefined,
  },
)

const { close } = usePanels()
onKeyStroke('Escape', close)

const detailsExpanded = ref(false)
const daySpentProgress = computed(() => {
  return (props.card?.daySpent / props.card?.limits.spend) * 100
})
</script>

<template>
  <div
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 border-s bg-white"
  >
    <FocusTrap>
      <div
        class="border-muted-200 dark:border-muted-700 flex h-20 w-full items-center justify-between border-b px-6"
      >
        <BaseHeading
          as="h3"
          size="xs"
          weight="semibold"
          class="text-muted-500 dark:text-muted-100 uppercase"
        >
          جزئیات کارت
        </BaseHeading>

        <!--Close button-->
        <button
          type="button"
          class="nui-mask nui-mask-blob hover:bg-muted-100 focus:bg-muted-100 dark:hover:bg-muted-700 dark:focus:bg-muted-700 text-muted-700 dark:text-muted-400 flex size-10 cursor-pointer items-center justify-center outline-transparent transition-colors duration-300"
          @click="close"
        >
          <Icon name="lucide:arrow-right" class="rtl:rotate-180 size-4" />
        </button>
      </div>

      <div
        class="nui-slimscroll relative h-[calc(100dvh_-_80px)] w-full overflow-y-auto p-6"
      >
        <div class="mb-3">
          <!--Info-->
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading
                as="h4"
                size="sm"
                weight="medium"
                class="text-muted-800 dark:text-muted-100"
              >
                {{ card.name }}
              </BaseHeading>
              <BaseParagraph size="xs" class="text-muted-400">
                {{ card.cardInfo.name }}
              </BaseParagraph>
            </div>
            <div class="text-end">
              <BaseHeading
                as="h4"
                size="sm"
                weight="medium"
                class="text-muted-800 dark:text-muted-100"
              >
                {{ card.daySpent.toFixed(2) }} تومان
              </BaseHeading>
              <BaseParagraph size="xs" class="text-muted-400">
                امروز خرج شده
              </BaseParagraph>
            </div>
          </div>
          <!--Progress-->
          <BaseProgress
            :value="daySpentProgress"
            size="xs"
            class="my-2"
          />

          <!--Card details-->
          <div class="pt-2">
            <button
              type="button"
              class="nui-focus mb-3 flex w-full items-center"
              @click="detailsExpanded = !detailsExpanded"
            >
              <span
                class="text-muted-500 dark:text-muted-400 flex w-full items-center justify-between"
              >
                <span class="flex items-center gap-1">
                  <Icon
                    name="lucide:chevron-down"
                    class="size-3 transition-transform duration-300"
                    :class="detailsExpanded ? 'rotate-180' : ''"
                  />
                  <BaseText v-if="!detailsExpanded" size="xs">
                    نمایش جزئیات
                  </BaseText>
                  <BaseText v-if="detailsExpanded" size="xs">
                    پنهان کردن جزئیات
                  </BaseText>
                </span>

                <BaseText v-if="!detailsExpanded" size="xs">
                  {{ card.funds.available.toFixed(2) }} تومان موجودی · {{
                    card.limits.spend.toFixed(2)
                  }}
                  تومان سقف موجودی
                </BaseText>
              </span>
            </button>
            <!--Collapse-->
            <div
              v-if="detailsExpanded"
              class="bg-muted-100 dark:bg-muted-900 rounded-xl p-6"
            >
              <!--Head-->
              <div
                class="border-muted-200 dark:border-muted-700 mb-3 flex items-center justify-between border-b pb-3"
              >
                <BaseHeading
                  as="h5"
                  size="xs"
                  weight="medium"
                  class="text-muted-600 dark:text-muted-300"
                >
                  محدودیت کل روزانه
                </BaseHeading>
                <BaseText
                  size="sm"
                  weight="medium"
                  class="text-muted-800 dark:text-muted-100"
                >
                  {{ (card.limits.spend + card.limits.withdraw).toFixed(2) }} تومان
                </BaseText>
              </div>
              <!--Content-->
              <div class="space-y-4">
                <!--Item-->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="bg-muted-800 size-2 rounded-full" />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-700 dark:text-muted-400"
                    >
                      ارسال شده
                    </BaseParagraph>
                    <span data-nui-tooltip="Settled transactions">
                      <Icon
                        name="lucide:help-circle"
                        class="text-muted-400 size-3"
                      />
                    </span>
                  </div>
                  <BaseText
                    size="sm"
                    weight="medium"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ card.funds.posted.toFixed(2) }} تومان
                  </BaseText>
                </div>
                <!--Item-->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="bg-muted-500 size-2 rounded-full" />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-700 dark:text-muted-400"
                    >
                      در انتظار
                    </BaseParagraph>
                    <span
                      data-nui-tooltip="Unsettled transactions or temporary holds"
                    >
                      <Icon
                        name="lucide:help-circle"
                        class="text-muted-400 size-3"
                      />
                    </span>
                  </div>
                  <BaseText
                    size="sm"
                    weight="medium"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ card.funds.pending.toFixed(2) }} تومان
                  </BaseText>
                </div>
                <!--Item-->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="bg-muted-300 size-2 rounded-full" />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-700 dark:text-muted-400"
                    >
                      غیر قابل دسترس
                    </BaseParagraph>
                    <span
                      data-nui-tooltip="وجوه غیرقابل دسترس به دلیل هزینه شدن بر روی کارت‌های دیگر. برای کمک تماس بگیرید."
                    >
                      <Icon
                        name="lucide:help-circle"
                        class="text-muted-400 size-3"
                      />
                    </span>
                  </div>
                  <BaseText
                    size="sm"
                    weight="medium"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ card.funds.unavailable.toFixed(2) }} تومان
                  </BaseText>
                </div>
                <!--Item-->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="size-2 rounded-full bg-white" />
                    <BaseParagraph
                      size="sm"
                      class="text-muted-700 dark:text-muted-400"
                    >
                      موجود برای خرج کردن
                    </BaseParagraph>
                  </div>
                  <BaseText
                    size="sm"
                    weight="medium"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ card.funds.available.toFixed(2) }} تومان
                  </BaseText>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full space-y-5">
            <!--Card mockup-->
            <DemoCreditCardReal
              :status="card.cardInfo.status"
              :name="card.cardInfo.name"
              :number="card.cardInfo.number"
              :brand="card.cardInfo.brand"
            />
            <!--Card info / actions-->
            <div class="space-y-4 px-2">
              <BaseParagraph size="xs" class="text-muted-400 text-center">
                این کارت در تاریخ {{ card.creationDate }} صادر شد
              </BaseParagraph>
              <div class="flex items-center justify-between gap-2">
                <BaseButton rounded="md" size="sm">
                  غیرفعال کردن
                </BaseButton>
                <BaseButton
                  variant="pastel"
                  color="muted"
                  rounded="md"
                  size="sm"
                >
                  جایگزین
                </BaseButton>
                <BaseButton
                  variant="pastel"
                  color="muted"
                  rounded="md"
                  size="sm"
                >
                  لغو
                </BaseButton>
              </div>
            </div>
            <!--Billing address-->
            <div class="border-muted-200 dark:border-muted-700 border-t">
              <div class="pt-6">
                <BaseParagraph size="xs" class="text-muted-400 mb-2">
                  آدرس صورت‌حساب
                </BaseParagraph>
                <BaseParagraph
                  v-for="item in card.address"
                  :key="item"
                  size="sm"
                  weight="medium"
                  class="text-muted-600 dark:text-muted-300"
                >
                  {{ item }}
                </BaseParagraph>
              </div>
            </div>
            <!--Summary-->
            <div class="border-muted-200 dark:border-muted-700 border-t">
              <div class="space-y-4 py-6">
                <!--item-->
                <div class="flex items-center justify-between">
                  <BaseParagraph
                    size="sm"
                    weight="medium"
                    class="text-muted-600 dark:text-muted-300"
                  >
                    محدودیت هزینه روزانه
                  </BaseParagraph>
                  <BaseParagraph
                    size="sm"
                    weight="medium"
                    class="text-muted-600 dark:text-muted-300"
                  >
                    محدودیت خرج {{ card.limits.spend.toFixed(2) }} تومان
                  </BaseParagraph>
                </div>
                <!--item-->
                <div class="flex items-center justify-between">
                  <div>
                    <BaseParagraph
                      size="sm"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-300"
                    >
                      حد برداشت روزانه
                    </BaseParagraph>
                    <BaseParagraph size="xs" class="text-muted-400 mb-1">
                      پول نقد امروز برداشت شد
                    </BaseParagraph>
                  </div>
                  <div>
                    <BaseParagraph
                      size="sm"
                      weight="medium"
                      class="text-muted-600 dark:text-muted-300 mb-1"
                    >
                      {{ card.limits.withdraw.toFixed(2) }} تومان
                    </BaseParagraph>
                    <BaseParagraph size="xs" class="text-muted-400 mb-1">
                      {{ card.dayWithdraw.toFixed(2) }} تومان
                    </BaseParagraph>
                  </div>
                </div>
                <!--item-->
                <div class="flex items-center justify-between">
                  <BaseParagraph
                    size="sm"
                    weight="medium"
                    class="text-muted-600 dark:text-muted-300"
                  >
                    حساب کاربری
                  </BaseParagraph>

                  <NuxtLink
                    to="#"
                    class="text-muted-600 nui-focus dark:text-muted-300 font-sans text-sm font-medium underline-offset-4 hover:underline"
                    data-nui-tooltip="مشاهده حساب"
                  >
                    بررسی {{ card.account }}
                  </NuxtLink>
                </div>
                <!--item-->
                <div class="flex items-center justify-between">
                  <BaseParagraph
                    size="sm"
                    weight="medium"
                    class="text-muted-600 dark:text-muted-300"
                  >
                    نوع کارت
                  </BaseParagraph>
                  <BaseParagraph
                    size="sm"
                    weight="medium"
                    class="text-muted-600 dark:text-muted-300 capitalize"
                  >
                    {{ card.cardInfo.type }}
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  </div>
</template>
