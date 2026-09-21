<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Field, useForm } from 'vee-validate'
import { z } from 'zod'
import ErrorModal from '@/components/AlertModal.vue'
import ForgetPasswordModal from '~/components/Auth/ForgetPasswordModal.vue'
 
const alertModalRef = ref()
const base = useRuntimeConfig().app.baseURL || '/'
const colorMode = useColorMode()
   colorMode.preference =  'light'
const showErrorModal = ref(false)
const AuthForgetPasswordModalRef = ref(null)

const errorMessage = ref('')

definePageMeta({
  auth: false,
  layout: 'empty',
  title: 'ورود',
  preview: {
    title: 'ورود به پرتال داخلی شرکت فولاد سیرجان ایرانیان',
    description: '',
    categories: [],
    src: '/img/screens/auth-login-1.png',
    srcDark: '/img/screens/auth-login-1-dark.png',
    order: 151,
  },
})

const VALIDATION_TEXT = {
  Username_REQUIRED: 'لطفا نام کاربری را وارد نمایید',
  PASSWORD_REQUIRED: 'لطفا کلمه عبور را وارد نمایید',
}

// This is the Zod schema for the form input
// It's used to define the shape that the form data will have
const zodSchema = z.object({
  username: z.string().min(1,VALIDATION_TEXT.Username_REQUIRED),
  password: z.string().min(1, VALIDATION_TEXT.PASSWORD_REQUIRED),
})

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type
type FormInput = z.infer<typeof zodSchema>

const validationSchema = toTypedSchema(zodSchema)
const initialValues = {
   username: '',
  password: '',
 
} satisfies FormInput

const {
  handleSubmit,
  isSubmitting,
  setFieldError,
  meta,
  values,
  errors,
  resetForm,
  setFieldValue,
  setErrors,
} = useForm({
  validationSchema,
  initialValues,
})
 
const router = useRouter()

const { login } = useAuth()
const onSubmit = handleSubmit(async (values) => {
  try {
   const { result, msg } = await login(values.username,values.password)
   console.log(result, msg)
  if (result) {
    router.push('/home')  
    //window.location.replace('https://portal.sirjansteel.com/panel/home')
  } else {
    alertModalRef.value.show('',msg)
  }
   
  } catch (e) {
    errorMessage.value = 'خطا در ارتباط با سرور'
    showErrorModal.value = true
  }
})





const { data: UserInfo,refresh:refresh_UserInfo  } =await  useAsyncData('UserInfo', () => {
  return User_Info()
})
  
async function User_Info(){
   const {get_user_info} =useAuth();
  const { result, response } =await get_user_info();
  if(result==true){
      router.push('/home')
  }
  //user.setUser(response) 
}




function ResetPassword(){
  AuthForgetPasswordModalRef.value.show()
}


const images = [
  `${base}img/sisco/factory/1.jpg`,
  `${base}img/sisco/factory/2.jpg`,
  `${base}img/sisco/factory/3.jpg`,
  `${base}img/sisco/factory/4.jpg`,
  `${base}img/sisco/factory/5.jpg`,
  `${base}img/sisco/factory/6.jpg`,
  `${base}img/sisco/factory/7.jpg`,
  `${base}img/sisco/factory/8.jpg`,
]

const randomImage = ref(images[Math.floor(Math.random() * images.length)])

 
</script> 
<template>
   <AlertModal ref="alertModalRef" />
 <!-- Modal component -->
 <TairoModal
    :open="showErrorModal"
    size="sm"
   @click="showErrorModal = false"
  >
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
         
        </h3>

        <BaseButtonClose @click="showErrorModal = false" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-4 flex size-24">
          <Icon name="alert-triangle" class="text-red-500 w-6 h-6" />
        </div>
 
        <p class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5">
                  {{ errorMessage }}

        </p>
      </div>
    </div>

    <template #footer>
      <!-- Footer -->
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
 

          <BaseButton
            color="primary"
            variant="solid"
           @click="showErrorModal = false"
          >
            باشه
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>


  <div class="dark:bg-muted-800 flex min-h-screen bg-white">
    <div
      class="relative flex flex-1 flex-col justify-center px-6 py-12 lg:w-2/5 lg:flex-none"
    >
      <div class="dark:bg-muted-800 relative mx-auto w-full max-w-sm bg-white">
          
          
    <div class="flex flex-col items-center mb-6">
      <img :src="`${base}/img/sisco/lg.png`" alt="لوگو" class="h-16 w-auto mb-3" />
      <p class="text-center text-gray-700 dark:text-gray-300 text-sm">
       ورود به پرتال داخلی شرکت فولاد سیرجان ایرانیان
      </p>
    </div>


        <!--Form section-->
        <form
          method="POST"
          action=""
          class="mt-6"
          novalidate
          @submit.prevent="onSubmit"
        >
          <div class="mt-5">
            <div>
              <div class="space-y-4">
                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="username"
                >
                  <BaseInput
                    :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                    type="username"
                    dir="ltr"
                    label="نام کاربری (کدملی) "
                    placeholder=" نام کاربری (کدملی) "
                    autocomplete="username"
                    :classes="{
                      input: 'h-12',
                    }"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field>

                <Field
                  v-slot="{ field, errorMessage, handleChange, handleBlur }"
                  name="password"
                >
                 
                  <AddonInputPassword
                  :model-value="field.value"
                    :error="errorMessage"
                    :disabled="isSubmitting"
                  
                    label="کلمه عبور"
                    dir="ltr"
                    placeholder="کلمه عبور"
                    autocomplete="current-password"
               
                    @update:model-value="handleChange"
                    @blur="handleBlur"
              />
 

                </Field>
              </div>

              <div class="mt-6 flex items-center justify-between">
                <!-- <Field
                  v-slot="{ field, handleChange, handleBlur }"
                  name="trustDevice"
                >
                  <BaseCheckbox
                    :model-value="field.value"
                    :disabled="isSubmitting"
                    rounded="sm"
                    label="اعتماد برای ۶۰ روز"
                    color="primary"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                  />
                </Field> -->

                <div class="text-xs leading-5">
                  <NuxtLink
                    @click="ResetPassword()"
                    class="text-primary-600 hover:text-primary-500 font-sans font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline cursor-pointer"
                  >
                    رمز عبور خود را فراموش کرده‌اید؟
                  </NuxtLink>
                </div>
              </div>

              <!--Submit-->
              <div class="mt-6">
                <div class="block w-full rounded-md shadow-sm">
                  <BaseButton
                    :disabled="isSubmitting"
                    :loading="isSubmitting"
                    type="submit"
                    color="primary"
                    class="!h-11 w-full"
                  >
                    ورود
                  </BaseButton>
                </div>
              </div>
 
     
            </div>
 
          </div>
        </form>
      </div>
    </div>
    <div
  class="bg-muted-100 dark:bg-muted-900 relative hidden w-0 flex-1 items-center justify-center lg:flex lg:w-3/5"
>
  <div class="mx-auto w-full max-w-3xl px-6 relative">
    
 
    <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-muted-800 shadow-2xl p-6 relative">
      
 
      <div class="absolute -top-12 left-1/2 -translate-x-1/2">
        <div class="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white dark:bg-muted-900 flex items-center justify-center">
          <img src="/img/sisco/lg.svg" alt="لوگو" class="w-20 h-20 object-contain">
        </div>
      </div>

    
      <img
        class="w-full h-[500px] object-cover rounded-2xl"
                 :src="randomImage"
        alt="factory"
      >
      
    </div>
    <div class="mt-4 text-center">
  <p class="text-xs text-gray-500 dark:text-gray-400">
      واحد نرم افزار شرکت فولاد سیرجان ایرانیان
  </p>
  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
    نسخه 1.0.0
  </p>

  <a
                    href="https://portal.sirjansteel.com/app/login"
                    target="_blank"
                    style="font-size: 11px;"
                    class="text-primary-400 hover:text-primary-800 font-sans font-medium underline-offset-4 transition duration-150 ease-in-out hover:underline cursor-pointer"
                  >
                  ورود به پنل قدیم
</a>
</div>
  </div>
</div>

  </div>
  <AuthForgetPasswordModal ref="AuthForgetPasswordModalRef" />
</template>
