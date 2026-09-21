export default defineNuxtRouteMiddleware((to, from) => {
    if (to.meta.auth === false) return
    const token = useCookie('sis_token')
    if (!token.value && to.path !== '/auth') {
      return navigateTo('/auth')
    }
  })