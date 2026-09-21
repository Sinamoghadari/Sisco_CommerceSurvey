<script setup lang="ts">
import { generatePassphrase as _generatePassphrase } from '~/utils/bundles/diceware'
import Slider from '@vueform/slider'
import '~/assets/css/slider.css'

definePageMeta({
  title: 'رمز عبور',
  preview: {
    title: 'چیدمان فرم ۵',
    description: 'برای فرم‌ها و فیلدهای ورودی',
    categories: ['چیدمان‌ها', 'فرم‌ها'],
    src: '/img/screens/layouts-form-5.png',
    srcDark: '/img/screens/layouts-form-5-dark.png',
    order: 51,
  },
})

const app = useAppConfig()

const toaster = useToaster()

const password = ref('')

// passphrase

const phraseStrength = ref(4)

function generatePassphrase() {
  const words = _generatePassphrase(phraseStrength.value)
  password.value = words.join(' ')
}

watch(phraseStrength, () => {
  generatePassphrase()
})

// password

const chars = ref({
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numeric: '0123456789',
  symbols: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
})

const charsLength = ref(24)

const charsLower = ref(true)
const charsUpper = ref(true)
const charsNumeric = ref(true)
const charsSymbols = ref(false)
const hasChars = computed(() => {
  return (
    charsLower.value
    || charsUpper.value
    || charsNumeric.value
    || charsSymbols.value
  )
})

watch([charsLength, charsLower, charsUpper, charsNumeric, charsSymbols], () => {
  if (!hasChars.value) return

  generatePassword()
})

function generatePassword() {
  const dict: string[] = []

  if (charsLower.value) dict.push(chars.value.lower)
  if (charsUpper.value) dict.push(chars.value.upper)
  if (charsNumeric.value) dict.push(chars.value.numeric)
  if (charsSymbols.value) dict.push(chars.value.symbols)

  password.value = shuffleArray(dict.join('').split(''))
    .join('')
    .substring(0, charsLength.value)
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

onMounted(() => {
  generatePassphrase()
})

const { text, copy, copied, isSupported } = useClipboard({ source: password })
const handleClipboard = () => {
  copy(password.value)
  if (copied) {
    console.log('متن به کلیپ‌بورد کپی شد!')
    toaster.clearAll()
    toaster.show({
      title: 'موفقیت',
      message: `رمز عبور به کلیپ‌بورد کپی شد!`,
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
  }
}

const rtl = app.dir === 'rtl'
</script>

<template>
  <div class="relative py-3 sm:mx-auto sm:max-w-xl">
    <BaseCard rounded="lg" class="relative px-4 py-10 sm:p-10 md:mx-0">
      <div class="mx-auto max-w-md">
        <div class="flex items-center gap-4">
          <div
            class="bg-primary-500/20 text-primary-500 flex size-14 shrink-0 items-center justify-center rounded-full font-sans text-2xl"
          >
            <Icon name="ph:lock-duotone" class="size-5" />
          </div>
          <div class="text-muted-700 block text-xl font-semibold">
            <BaseHeading
              as="h3"
              size="lg"
              weight="medium"
              class="text-muted-800 dark:text-muted-100"
            >
              رمز عبور جدید
            </BaseHeading>
            <BaseText
              size="sm"
              class="text-muted-400"
            >
              ایجاد رمز عبور تصادفی.
            </BaseText>
          </div>
        </div>
        <div class="divide-muted-200 dark:divide-muted-700 divide-y">
          <div class="grid grid-cols-12 gap-4 py-5">
            <div class="col-span-12">
              <BaseParagraph size="sm" class="text-muted-400">
                مقدار طول را تغییر دهید تا رمز عبور تصادفی جدیدی ایجاد کنید. همچنین می‌توانید نوع کاراکترها را تغییر دهید.
              </BaseParagraph>
            </div>
          </div>
          <div class="text-muted-800 mx-auto w-full pt-5">
            <div class="relative mb-2">
              <label
                class="text-muted-500 dark:text-muted-400 mb-2 block text-xs font-semibold"
              >قدرت رمز عبور</label>

              <AddonInputPassword
                v-model="password"
                placeholder="رمز عبور"
                rounded="lg"
                show
                touched
              />
            </div>
            <hr
              class="border-muted-200 dark:border-muted-700 my-5 h-px border bg-transparent"
            >
            <BaseAccordion
              :open-items="[0]"
              :items="[{
                title: 'رمزهای عبور به یادماندنی نایس‌ور',
                content: 'passphrase',
              },{
                title: 'تولیدکننده رمز عبور',
                content: 'password',
              }]"
              exclusive
            >
              <template #accordion-item-content="{ item }">
                <div v-if="item.content === 'passphrase'">
                  <div class="mb-2">
                    <label
                      class="text-muted-500 dark:text-muted-400 mb-2 block text-xs font-semibold"
                    >قدرت عبارت عبور</label>
                    <BaseInputNumber
                      v-model="phraseStrength"
                      placeholder="بیت‌ها"
                      rounded="lg"
                      :min="1"
                      :max="8"
                      :step="1"
                    />
                    <div class="w-full py-5">
                      <Slider
                        v-model="phraseStrength"
                        class="rounded-tooltip"
                        :min="1"
                        :max="8"
                        :step="1"
                        :tooltips="false"
                        :direction="rtl && 'rtl'"
                      />
                    </div>
                  </div>

                  <div
                    class="mt-6 flex flex-col gap-2 sm:flex-row"
                  >
                    <BaseButton
                      v-if="isSupported"
                      rounded="lg"
                      class="!h-12 w-full"
                      @click="handleClipboard"
                    >
                      <Icon name="ph:cards-duotone" class="size-5 me-2" />
                      <span>کپی در کلیپ‌بورد</span>
                    </BaseButton>
                    <div v-else class="h-12">
                      <BaseText
                        class="text-muted-400"
                        size="sm"
                      >
                        مرورگر شما از API کلیپ بورد پشتیبانی نمی‌کند.
                      </BaseText>
                    </div>
                    <BaseButton
                      color="primary"
                      rounded="lg"
                      class="!h-12 w-full"
                      @click="generatePassphrase()"
                    >
                      <Icon name="ph:arrows-clockwise" class="size-5 me-2" />
                      <span>تولید جدید</span>
                    </BaseButton>
                  </div>
                </div>
                <div v-else-if="item.content === 'password'">
                  <div class="mb-2">
                    <label
                      class="text-muted-500 dark:text-muted-400 mb-2 block text-xs font-semibold"
                    >طول رمز عبور</label>
                    <BaseInputNumber
                      v-model="charsLength"
                      placeholder="طول"
                      rounded="lg"
                      :min="1"
                      :max="42"
                      :step="1"
                    />
                    <div class="w-full py-5">
                      <Slider
                        v-model="charsLength"
                        class="rounded-tooltip"
                        :min="1"
                        :max="42"
                        :step="1"
                        :tooltips="false"
                        :direction="rtl && 'rtl'"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      class="text-muted-500 dark:text-muted-400 mb-4 block text-xs font-semibold"
                    >نوع کاراکترها</label>
                    <div class="grid gap-6 pb-4 sm:grid-cols-2">
                      <div class="flex items-center gap-3">
                        <BaseCheckboxAnimated
                          v-model="charsLower"
                          color="success"
                        />
                        <BaseText
                          class="text-muted-500 dark:text"
                          size="sm"
                        >
                          حروف کوچک
                        </BaseText>
                      </div>
                      <div class="flex items-center gap-3">
                        <BaseCheckboxAnimated
                          v-model="charsUpper"
                          color="success"
                        />
                        <BaseText
                          class="text-muted-500 dark:text"
                          size="sm"
                        >
                          حروف بزرگ
                        </BaseText>
                      </div>
                      <div class="flex items-center gap-3">
                        <BaseCheckboxAnimated
                          v-model="charsNumeric"
                          color="success"
                        />
                        <BaseText
                          class="text-muted-500 dark:text"
                          size="sm"
                        >
                          اعداد
                        </BaseText>
                      </div>
                      <div class="flex items-center gap-3">
                        <BaseCheckboxAnimated
                          v-model="charsSymbols"
                          color="success"
                        />
                        <BaseText
                          class="text-muted-500 dark:text"
                          size="sm"
                        >
                          نمادها
                        </BaseText>
                      </div>
                    </div>
                  </div>
                  <div
                    class="mt-6 flex flex-col gap-2 sm:flex-row"
                  >
                    <BaseButton
                      v-if="isSupported"
                      rounded="lg"
                      class="!h-12 w-full"
                      @click="handleClipboard"
                    >
                      <Icon name="ph:cards-duotone" class="size-5 me-2" />
                      <span>کپی در کلیپ‌بورد</span>
                    </BaseButton>
                    <div v-else class="h-12">
                      <BaseText
                        class="text-muted-400"
                        size="sm"
                      >
                        مرورگر شما از API کلیپ بورد پشتیبانی نمی‌کند.
                      </BaseText>
                    </div>
                    <BaseButton
                      color="primary"
                      rounded="lg"
                      class="!h-12 w-full"
                      :disabled="!hasChars"
                      @click="generatePassword()"
                    >
                      <Icon name="ph:arrows-clockwise" class="size-5 me-2" />
                      <span>تولید جدید</span>
                    </BaseButton>
                  </div>
                </div>
              </template>
            </BaseAccordion>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
