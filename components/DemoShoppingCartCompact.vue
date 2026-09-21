<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  }>(),
  {
    rounded: 'sm',
  },
)

const products = [
  {
    id: 0,
    name: 'اپل - ساعت هوشمند نسل ۵، ۲۵۶ گیگابایت',
    image: '/img/illustrations/widgets/watch-1.svg',
    price: 999,
    quantity: 1,
  },
  {
    id: 1,
    name: 'اپل - ساعت هوشمند نسل ۵، ۱۲۸ گیگابایت',
    image: '/img/illustrations/widgets/watch-2.svg',
    price: 899,
    quantity: 1,
  },
  {
    id: 2,
    name: 'اپل - ساعت هوشمند نسل ۵، ۶۴ گیگابایت',
    image: '/img/illustrations/widgets/watch-3.svg',
    price: 799,
    quantity: 1,
  },
]
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <BaseHeading
        as="h3"
        size="md"
        weight="semibold"
        lead="tight"
      >
        سبد خرید
      </BaseHeading>
      <BaseTag
        color="primary"
        size="sm"
        rounded="full"
      >
        ۳ آیتم
      </BaseTag>
    </div>
    <div class="space-y-2">
      <div
        v-for="product in products"
        :key="product.id"
        class="flex gap-2"
      >
        <div
          class="bg-muted-100 dark:bg-muted-700 flex size-16 shrink-0 items-center justify-center"
          :class="[
            props.rounded === 'sm' ? 'rounded' : '',
            props.rounded === 'md' ? 'rounded-lg' : '',
            props.rounded === 'lg' ? 'rounded-xl' : '',
            props.rounded === 'full' ? 'rounded-full' : '',
          ]"
        >
          <img
            class="size-12 object-cover object-center"
            :src="product.image"
            alt="تصویر ویجت"
          >
        </div>
        <div>
          <p class="text-muted-500 dark:text-muted-400 mt-1 font-sans text-xs">
            {{ product.name }}
          </p>
          <p class="font-sans font-semibold">
            {{ product.price }} تومان
          </p>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <BaseButton
        color="primary"
        :rounded="props.rounded"
        class="!h-12 w-full"
      >
        تسویه حساب
      </BaseButton>
    </div>
  </div>
</template>
