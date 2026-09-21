export const useAuth = () => {
  const token = useCookie('sis_token', {
  maxAge: 60 * 60 * 24 * 7 // 7 روز
}) // با استفاده از کوکی (SSR-friendly)
  const username_c = useCookie('username', {
  maxAge: 60 * 60 * 24 * 7 // 7 روز
}) 
  const user_info = useCookie('sisco_user_info', {
  maxAge: 60 * 60 * 24 * 7 // 7 روز
}) 
  const api = useApi()
 

  const login = async (username: string, password: string) => {
    try {
      const response = await api('/login', {
        method: 'POST',
        body: { username, password }
      });

      if (response.result === 'OK') {
        token.value = response.token // ذخیره JWT در کوکی
        username_c.value=username
        return { result: true }
      } else {
        return { result: false, msg: response.msg_description }
      }
    } catch (e) {
      return { result: false, message: 'خطا در ارتباط با سرور' }
    }
  }

  const logout = () => {
    token.value = null
    username_c.value=null
    user_info.value=null
  } 
   const isLoggedIn = computed(() => !!token.value && token.value.trim() !== '')
  const get_user_info = async () => {
    try {
      const response = await api('/User_Info', {
        method: 'GET',
      });

      if (response.result === 'OK') {
        user_info.value=response
        return { result: true,response }
        
      } else {
        return { result: false, msg: response.msg_description }
      }
    } catch (e) {
      return { success: false, message: 'خطا در ارتباط با سرور' }
    }
  }


   

  const ChangePassword = async (PasswordItem:any) => {
 
    try {
      const response = await api('/Change_Password', {
        method: 'POST',
        body:{lastpassword:PasswordItem.lastpassword,newpassword1:PasswordItem.newpassword1,newpassword2:PasswordItem.newpassword2}
      })
      if (response.result === 'OK') {
        return { result: true, response }
      } else {
        return { result: false,response }
      }
    } catch (e) {
      return { result: false, msg: 'خطا در ارتباط با سرور' }
    } 
  } 
  

  const ResetPassword = async (PasswordItem:any) => {
 
    try {
      const response = await api('/Reset_Password', {
        method: 'POST',
        body:{mobile:PasswordItem.mobile,national_id:PasswordItem.national_id}
      })
      if (response.result === 'OK') {
        return { result: true, response }
      } else {
        return { result: false,response }
      }
    } catch (e) {
      return { result: false, msg: 'خطا در ارتباط با سرور' }
    } 
  } 
  
  return { login, logout, isLoggedIn, token,get_user_info ,ChangePassword,ResetPassword}
}

