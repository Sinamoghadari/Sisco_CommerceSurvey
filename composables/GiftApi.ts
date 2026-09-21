export const GiftApi = () => {
  const token = useCookie('sis_token') // با استفاده از کوکی (SSR-friendly)
  const api = useApi()
const GetUserGifts = async () => {
  try {
    const response = await api('/GetUserGiftsV2', {
      method: 'GET',
    })

 
    if (response.result === 'OK') {
      return { result: true, response }
    } else {
      return { result: false, msg: response.msg_description }
    }
  } catch (e) {
    return { result: false, msg: 'خطا در ارتباط با سرور' }
  }
}
 

  return {GetUserGifts }
}