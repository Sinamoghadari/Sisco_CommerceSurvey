import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

export const useActivityManagement = () => {
  const activities = ref<any[]>([])
  const activitySearchQuery = ref('')
  const selectedAssignmentForManagement = ref<any>(null)

  const isActivityModalOpen = ref(false)
  const isActivityEditMode = ref(false)
  const activityForm = ref({ _id: '', task_code: '', title: '', description: '', isActive: true })

  const filteredActivities = computed(() => {
    if (!selectedAssignmentForManagement.value) return []
    let list = activities.value
    if (activitySearchQuery.value.trim()) {
      list = list.filter(a =>
        a.title?.toLowerCase().includes(activitySearchQuery.value.toLowerCase())
      )
    }
    return list
  })

  const openNewActivityModal = () => {
    isActivityEditMode.value = false
    activityForm.value = {
      _id: '',
      task_code: selectedAssignmentForManagement.value?.code || '',
      title: '',
      description: '',
      isActive: true
    }
    isActivityModalOpen.value = true
  }

  const openEditActivityModal = (activity: any) => {
    isActivityEditMode.value = true
    activityForm.value = {
      _id: activity._id,
      task_code: activity.task_code || selectedAssignmentForManagement.value?.code || '',
      title: activity.title,
      description: activity.description || '',
      isActive: activity.status
    }
    isActivityModalOpen.value = true
  }

 const saveActivity = async (
  OrganizationNewActivity: Function,
  OrganizationUpdateActivity: Function,
  loadActivities: () => Promise<void>
) => {
  if (!activityForm.value.title.trim()) {
    Swal.fire({ icon: 'error', title: 'خطا', text: 'شرح فعالیت الزامی است.' })
    return
  }

  try {
    let res
    if (isActivityEditMode.value) {
      res = await OrganizationUpdateActivity(
        activityForm.value._id,
        activityForm.value.task_code,
        activityForm.value.title,
        activityForm.value.isActive,
        activityForm.value.description
      )
    } else {
      res = await OrganizationNewActivity(
        activityForm.value.task_code,
        activityForm.value.title,
        activityForm.value.isActive,
        activityForm.value.description
      )
    }

    // ========== شروع تغییرات کلیدی ==========

    // شرط جدید: موفقیت یعنی `result` برابر `true` باشد
    // یا پیامی حاوی کلمه "موفقیت" از سرور دریافت کنیم.
    const isSuccess = res.result || (res.msg && res.msg.includes('موفقیت'))

    if (isSuccess) {
      Swal.fire({
        icon: 'success',
        title: 'موفقیت‌آمیز',
        // از پیام خود بک‌اند استفاده می‌کنیم تا همیشه متن دقیق باشد
        text: res.msg || 'فعالیت با موفقیت ذخیره شد.',
        timer: 1500,
        showConfirmButton: false
      })
      isActivityModalOpen.value = false
      await loadActivities()
    } else {
      Swal.fire({ 
        icon: 'error', 
        title: 'خطا', 
        text: res.msg || 'خطایی در ذخیره‌سازی رخ داد.' 
      })
    }
    // ========== پایان تغییرات کلیدی ==========

  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'خطا', text: err.message || 'خطای غیرمنتظره در ارتباط با سرور' })
  }
}
  // متد حذف - درصورت تمایل اضافه شود
  // const deleteActivity = async (activity: any) => {
  //   Swal.fire({ icon: 'info', title: 'در حال توسعه', text: 'متد حذف فعالیت هنوز از سمت سرور ارائه نشده است.' })
  // }

  return {
    activities,
    activitySearchQuery,
    selectedAssignmentForManagement,
    isActivityModalOpen,
    isActivityEditMode,
    activityForm,
    filteredActivities,
    openNewActivityModal,
    openEditActivityModal,
    saveActivity,
    // deleteActivity
  }
}