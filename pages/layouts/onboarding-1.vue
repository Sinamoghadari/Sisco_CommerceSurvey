<script setup lang="ts">
definePageMeta({
  title: 'مقدمات ورود',
  layout: 'empty',
  preview: {
    title: 'مقدمات ورود 1',
    description: 'برای ورود کاربران جدید',
    categories: ['چیدمان‌ها', 'مقدمات ورود'],
    src: '/img/screens/layouts-onboarding-1.png',
    srcDark: '/img/screens/layouts-onboarding-1-dark.png',
    order: 93,
  },
})

const loading = ref(false)
const twoFaMode = ref('آدرس ایمیل')
const currentStep = ref(1)
const codeLength = ref(4)
const input = ref<Array<number | undefined>>([])
const inputElements = ref<HTMLInputElement[]>([])
const correctPin = ref('1234')
const onlyCheckOnLastFieldInput = ref(true)

const email = ref('')
const tel = ref('')
const code = ref('')

function goToStep(n: number) {
  loading.value = true
  const timer = setTimeout(() => {
    loading.value = false
    if (n < 1) {
      currentStep.value = 1
    }
    else if (n > 3) {
      currentStep.value = 3
    }
    else {
      currentStep.value = n
    }
    clearTimeout(timer)
  }, 1000)
}

function paste(event: ClipboardEvent) {
  const pasted = event.clipboardData
    ?.getData('text')
    ?.replace(/\D/g, '') // only get numbers
    ?.substring(0, codeLength.value) // don't get more than the PIN codeLength

  // if after all that sanitazation the string is not empty
  if (pasted) {
    // split the pasted string into an array and load it
    input.value = pasted.split('').map(Number)
    // check if the PIN is correct
    return validatePin.value
  }
}
function type(event: KeyboardEvent, index: number) {
  if (event.code === 'ArrowRight') {
    event.stopPropagation()
    event.preventDefault()
    nextTick(() => {
      focusField(Math.min(codeLength.value, index + 1))
    })
    return
  }

  if (event.code === 'ArrowLeft') {
    event.stopPropagation()
    event.preventDefault()
    nextTick(() => {
      focusField(Math.max(0, index - 1))
    })
    return
  }

  if (event.code === 'Backspace') {
    event.stopPropagation()
    event.preventDefault()
    input.value[index - 1] = undefined
    nextTick(() => {
      focusField(Math.max(0, index - 1))
    })
    return
  }

  if (event.code == 'a' && event.ctrlKey) {
    event.stopPropagation()
    event.preventDefault()
    return
  }

  // only allow numbers
  const key = event.key.replace(/\D/g, '')
  if (key !== '') {
    input.value[index - 1] = Number(key)
  }
  // check if the PIN is correct
  if (
    (onlyCheckOnLastFieldInput.value && index == codeLength.value)
    || !onlyCheckOnLastFieldInput.value
  ) {
    event.stopPropagation()
    event.preventDefault()
    return
  }
  // go to the next field
  // must happen on nextTick cause the field can be disabled.
  nextTick(() => {
    focusField(Math.min(codeLength.value, index + 1))
  })
}

function focusField(n: any) {
  if (!n || n > codeLength.value) {
    n = 1
  }
  inputElements.value[n].focus()
}

const validatePin = computed(() => {
  return input.value.join('') == correctPin.value
})
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen">
    <div
      class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4"
    >
      <NuxtLink
        to="/"
        class="text-muted-400 hover:text-primary-500 dark:text-muted-700 dark:hover:text-primary-500 transition-colors duration-300"
      >
        <TairoLogo class="size-10" />
      </NuxtLink>
      <div class="flex items-center gap-4">
        <BaseThemeToggle />
      </div>
    </div>
    <form
      action=""
      method="POST"
      class="mx-auto max-w-7xl px-4"
      @submit.prevent
    >
      <div v-if="currentStep === 1">
        <div class="pt-8 text-center">
          <BaseHeading
            tag="h2"
            size="3xl"
            weight="medium"
            class="mb-2"
          >
            به تایرو خوش آمدید 👋
          </BaseHeading>
          <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-8">
            یک گزینه را برای فعال‌سازی احراز هویت دو مرحله‌ای انتخاب کنید
          </BaseParagraph>
        </div>

        <div>
          <div class="w-full">
            <div class="mx-auto w-full">
              <div class="w-full">
                <div class="mx-auto mb-8 grid max-w-4xl gap-6 sm:grid-cols-3">
                  <BaseRadioHeadless
                    v-model="twoFaMode"
                    name="radio_custom"
                    value="آدرس ایمیل"
                  >
                    <BaseCard
                      rounded="lg"
                      class="peer-checked:!border-primary-500 relative border-2 p-8 opacity-60 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:[&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/2fa-web.svg"
                          alt="تأیید هویت دو مرحله‌ای با ایمیل"
                          class="mx-auto max-w-[160px]"
                        >
                        <BaseHeading
                          size="md"
                          weight="medium"
                        >
                          با ایمیل
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          کدی برای تأیید به آدرس ایمیل شما ارسال خواهیم کرد
                        </BaseParagraph>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-0">
                        <Icon
                          name="ph:check-circle-duotone"
                          class="text-primary-500 size-7"
                        />
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="twoFaMode"
                    name="radio_custom"
                    value="شماره تلفن"
                  >
                    <BaseCard
                      rounded="lg"
                      class="peer-checked:!border-primary-500 relative border-2 p-8 opacity-60 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:[&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/2fa-sms.svg"
                          alt="تأیید هویت دو مرحله‌ای با پیامک"
                          class="mx-auto max-w-[160px]"
                        >
                        <BaseHeading
                          size="md"
                          weight="medium"
                        >
                          با پیامک
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          ما برای شما یک پیامک حاوی کد به تلفن همراهتان ارسال خواهیم کرد.
                        </BaseParagraph>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-0">
                        <Icon
                          name="ph:check-circle-duotone"
                          class="text-primary-500 size-7"
                        />
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="twoFaMode"
                    name="radio_custom"
                    value="اپ آیدی"
                  >
                    <BaseCard
                      rounded="lg"
                      class="peer-checked:!border-primary-500 relative border-2 p-8 opacity-60 grayscale peer-checked:opacity-100 peer-checked:grayscale-0 peer-checked:[&_.child]:!opacity-100"
                    >
                      <div class="flex flex-col text-center">
                        <img
                          src="/img/illustrations/onboarding/2fa-app.svg"
                          alt="تأیید هویت دو مرحله‌ای با اپلیکیشن"
                          class="mx-auto max-w-[160px]"
                        >
                        <BaseHeading
                          size="md"
                          weight="medium"
                        >
                          با یک اپلیکیشن
                        </BaseHeading>
                        <BaseParagraph
                          size="xs"
                          lead="snug"
                          class="text-muted-500 dark:text-muted-400"
                        >
                          کد را به شما ارسال خواهیم کرد به
                          <NuxtLink
                            to="https://authy.com/"
                            class="text-primary-500 underline-offset-4 hover:underline"
                          >
                            آوثی
                          </NuxtLink>
                          برنامه احراز هویت
                        </BaseParagraph>
                      </div>
                      <div class="child absolute end-2 top-3 opacity-0">
                        <Icon
                          name="ph:check-circle-duotone"
                          class="text-primary-500 size-7"
                        />
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
                <div class="mx-auto flex flex-col items-center">
                  <BaseButton
                    type="button"
                    rounded="lg"
                    class="!h-12 w-48"
                    color="primary"
                    :loading="loading"
                    @click="goToStep(2)"
                  >
                    ادامه
                  </BaseButton>
                  <NuxtLink
                    to="/dashboards"
                    class="text-muted-400 hover:text-primary-500 mt-4 text-xs font-medium underline-offset-4 transition-colors duration-300 hover:underline"
                  >
                    خیر، می‌خواهم رد شوم
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentStep === 2" class="w-full">
        <div class="flex size-full flex-col">
          <div
            class="pointer-events-none flex w-full items-center justify-center pt-8"
          >
            <BaseIconBox
              color="primary"
              size="lg"
              rounded="full"
              class="mx-auto"
            >
              <Icon
                v-if="twoFaMode === 'آدرس ایمیل'"
                name="ph:envelope-duotone"
                class="text-primary-500 mx-auto size-8"
              />
              <Icon
                v-else-if="twoFaMode === 'شماره تلفن'"
                name="ph:device-mobile-speaker-duotone"
                class="text-primary-500 mx-auto size-8"
              />
              <Icon
                v-else-if="twoFaMode === 'اپ آیدی'"
                name="ph:fingerprint-duotone"
                class="text-primary-500 mx-auto size-8"
              />
            </BaseIconBox>
          </div>
          <div class="pt-4 text-center">
            <BaseHeading
              tag="h2"
              size="3xl"
              weight="medium"
              class="mb-1"
            >
              {{ twoFaMode.split('_').join(' ') }} خود را وارد کنید
            </BaseHeading>
            <BaseParagraph class="text-muted-500 dark:text-muted-400">
              اطلاعات لازم را وارد کنید تا ادامه دهید
            </BaseParagraph>
          </div>

          <div class="mx-auto w-full max-w-sm py-6">
            <BaseInput
              v-if="twoFaMode === 'آدرس ایمیل'"
              v-model="email"
              icon="ph:envelope-duotone"
              rounded="lg"
              placeholder="مثال: ghasem@eltheme.ir"
              :classes="{
                wrapper: 'w-full',
                input: '!h-12 !ps-12',
                icon: '!h-12 !w-12',
              }"
            />
            <BaseInput
              v-else-if="twoFaMode === 'شماره تلفن'"
              v-model="tel"
              icon="ph:device-mobile-speaker-duotone"
              rounded="lg"
              placeholder="مثال: +۱۵۵۵۴۸۱۵۶۵۹"
              :classes="{
                wrapper: 'w-full',
                input: '!h-12 !ps-12',
                icon: '!h-12 !w-12',
              }"
            />
            <div v-else-if="twoFaMode === 'اپ آیدی'" class="space-y-4">
              <div class="flex items-center gap-2">
                <Icon name="logos:authy" class="size-6" />
                <div>
                  <BaseText
                    size="sm"
                    class="text-muted-500 dark:text-muted-400"
                  >
                    فقط
                    <NuxtLink
                      to="https://authy.com/"
                      class="text-primary-500 underline-offset-4 hover:underline"
                    >
                      آوثی
                    </NuxtLink>
                    تا به این لحظه پشتیبانی می‌شود
                  </BaseText>
                </div>
              </div>
              <BaseInput
                v-model="code"
                icon="ph:fingerprint-duotone"
                rounded="lg"
                placeholder="مثال: efcdwdeg16jei85"
                :classes="{
                  wrapper: 'w-full',
                  input: '!h-12 !ps-12',
                  icon: '!h-12 !w-12',
                }"
              />
            </div>
          </div>
          <div class="mx-auto flex flex-col items-center">
            <BaseButton
              type="button"
              rounded="lg"
              class="!h-12 w-48"
              color="primary"
              :loading="loading"
              @click="goToStep(3)"
            >
              ادامه
            </BaseButton>
            <button
              type="button"
              class="text-muted-400 hover:text-primary-500 mt-4 text-xs font-medium underline-offset-4 transition-colors duration-300 hover:underline"
              @click="goToStep(1)"
            >
              می‌خواهم تغییر دهم، مرا بازگردان
            </button>
          </div>
        </div>
      </div>
      <div v-else-if="currentStep === 3">
        <div class="mx-auto max-w-4xl">
          <div class="flex size-full flex-col">
            <div
              class="pointer-events-none flex w-full items-center justify-center pt-8"
            >
              <div class="flex h-16 items-center justify-center">
                <TairoCheckAnimated v-if="validatePin" size="sm" />
                <BaseIconBox
                  v-else
                  color="primary"
                  size="lg"
                  rounded="full"
                  class="mx-auto"
                >
                  <Icon
                    name="ph:lock-duotone"
                    class="text-primary-500 mx-auto size-8"
                  />
                </BaseIconBox>
              </div>
            </div>
            <div class="pt-4 text-center">
              <BaseHeading
                tag="h2"
                size="3xl"
                weight="medium"
                class="mb-1"
              >
                کد خود را وارد کنید
              </BaseHeading>
              <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-2">
                کد پینی را که برای شما ارسال کرده‌ایم وارد کنید.
              </BaseParagraph>
              <BaseText
                size="xs"
                lead="snug"
                class="text-muted-500 dark:text-muted-400 mb-8"
              >
                <span class="block">
                  <span class="font-bold">1234</span> پین دموی شماست.
                </span>
              </BaseText>
            </div>
            <div
              class="text-muted-800 dark:text-muted-100 mx-auto flex h-60 w-72 flex-col rounded text-center"
            >
              <div
                class="flex w-full justify-center gap-3"
                :class="validatePin && 'pointer-events-none'"
                dir="ltr"
              >
                <input
                  v-for="i in codeLength"
                  :key="'pin' + i"
                  :ref="
                    (el) => {
                      inputElements[i] = el as HTMLInputElement
                    }
                  "
                  v-focus="i === 1"
                  type="text"
                  :name="'pin' + i"
                  maxlength="1"
                  class="dark:bg-muted-800 unselectable nui-focus inline w-16 select-none rounded-lg bg-white py-5 text-center text-4xl font-bold transition-all"
                  :value="input[i - 1] !== undefined ? input[i - 1] : '-'"
                  placeholder="0"
                  :disabled="input.length < i - 1 || validatePin"
                  @paste.prevent="(event) => paste(event)"
                  @keydown="(event) => type(event, i)"
                >
              </div>
              <div class="mt-10">
                <BaseButton
                  to="/dashboards"
                  rounded="lg"
                  class="!h-12"
                  :color="validatePin ? 'primary' : 'default'"
                  :disabled="!validatePin"
                >
                  من را به داشبورد ببر
                </BaseButton>

                <div class="mt-8 flex items-center justify-between">
                  <BaseText
                    size="sm"
                    class="text-muted-400"
                  >
                    کد را دریافت نکردید؟
                  </BaseText>
                  <button
                    type="button"
                    class="text-primary-500 font-sans text-sm underline-offset-4 hover:underline"
                  >
                    دوباره ارسال کنید
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
