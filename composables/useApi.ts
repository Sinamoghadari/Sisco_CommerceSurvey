 

export function useApi() {
  const token = useCookie('sis_token')
  const config = useRuntimeConfig()

  return async function <T = any>(url: string, options: any = {}) {
    options.headers = {
      ...options.headers,
      Authorization: token.value ? `Bearer ${token.value}` : '',
    }

    if (!url.startsWith('http')) {
       url ='https://portal.sirjansteel.com/api'+ url
      //url ='http://172.17.209.116:1000'+ url
    }
    return await $fetch<T>(url, options)
  }
}