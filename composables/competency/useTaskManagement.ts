// صفحه مدیریت وظیفه ها

import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

export const useTaskManagement = () => {
  // ==========================================
  // حالت‌های مدیریت نمایش
  // ==========================================
  const tasks = ref<any[]>([])
  const taskSearchQuery = ref('')
  const taskTypes = ref<any[]>([])

  // مودال نوع وظیفه
  const isTaskTypeModalOpen = ref(false)
  const isTaskTypeEditMode = ref(false)
  const taskTypeForm = ref({ _id: '', title: '', status: true })

  // مودال وظیفه
  const isTaskModalOpen = ref(false)
  const isTaskEditMode = ref(false)
  const taskForm = ref({ _id: '', title: '', type: '', description: '', isActive: true })

  // ==========================================
  // فیلتر محاسباتی (Computed)
  // ==========================================
  const filteredTasks = computed(() => {
    if (!taskSearchQuery.value.trim()) return tasks.value
    return tasks.value.filter(t =>
      t.title?.toLowerCase().includes(taskSearchQuery.value.toLowerCase())
    )
  })

  // ==========================================
  // توابع مدیریت نوع وظیفه
  // ==========================================
  const openTaskTypeModal = async (loadTaskTypes: () => Promise<void>) => {
    isTaskTypeEditMode.value = false
    taskTypeForm.value = { _id: '', title: '', status: true }
    isTaskTypeModalOpen.value = true
    await loadTaskTypes()
  }

  const saveTaskType = async (
    OrganizationNewDutyType: Function,
    OrganizationUpdateDutyType: Function,
    loadTaskTypes: () => Promise<void>
  ) => {
    if (!taskTypeForm.value.title.trim()) {
      Swal.fire({ icon: 'error', title: 'خطا', text: 'عنوان نوع وظیفه الزامی است.' })
      return
    }

    let res

    if (isTaskTypeEditMode.value) {
      // بررسی اینکه آیا آی‌دی واقعاً وجود دارد یا خیر
      if (!taskTypeForm.value._id) {
        Swal.fire({ icon: 'error', title: 'خطا', text: 'شناسه برای ویرایش یافت نشد. لطفاً ساختار دیتای دریافتی را بررسی کنید.' })
        return
      }
      
      // فراخوانی دقیقاً مطابق انتظار بک‌اند (ارسال مستقیم status بولی)
      res = await OrganizationUpdateDutyType(
        taskTypeForm.value._id, 
        taskTypeForm.value.title, 
        taskTypeForm.value.status
      )
    } else {
      // ارسال مستقیم status بولی به جای statusNum
      res = await OrganizationNewDutyType(taskTypeForm.value.title, taskTypeForm.value.status)
    }

    if (res.result) {
      Swal.fire({
        icon: 'success',
        title: 'موفقیت‌آمیز',
        text: 'نوع وظیفه با موفقیت ذخیره شد.',
        timer: 1500,
        showConfirmButton: false
      })
      taskTypeForm.value = { _id: '', title: '', status: true } 
      isTaskTypeEditMode.value = false 
      await loadTaskTypes() 
    } else {
      Swal.fire({ icon: 'error', title: 'خطا', text: res.msg || 'خطایی در ذخیره‌سازی رخ داد.' })
    }
  }

  const editTaskType = (row: any) => {
    isTaskTypeEditMode.value = true
    
    taskTypeForm.value = {
      _id: row._id,       // خواندن مستقیم _id از ردیف
      title: row.title,
      status: row.status
    };
  }
  // متد حذف درصورت تمایل اضافه شود
  // const deleteTaskType = (type: any) => {
  //   Swal.fire({ icon: 'info', title: 'در حال توسعه', text: 'متد حذف هنوز از سمت سرور ارائه نشده است.' })
  // }

  // ==========================================
  // توابع مدیریت وظیفه (Task)
  // ==========================================
  const openNewTaskModal = async (loadTaskTypes: () => Promise<void>) => {
    isTaskEditMode.value = false
    taskForm.value = { _id: '', title: '', type: '', description: '', isActive: true }
    isTaskModalOpen.value = true
    await loadTaskTypes()
  }

  const openEditTaskModal = async (task: any, loadTaskTypes: () => Promise<void>) => {
    isTaskEditMode.value = true
    taskForm.value = {
      _id: task._id,
      title: task.title,
      type: task.type,
      description: task.description || '',
      isActive: task.status
    }
    isTaskModalOpen.value = true
    await loadTaskTypes()
  }

  const saveTask = async (OrganizationNewDuty: Function, OrganizationUpdateDuty: Function, loadDuties: () => Promise<void>) => {
    if (!taskForm.value.title.trim() || !taskForm.value.type) {
      Swal.fire({ icon: 'error', title: 'خطا', text: 'شرح و نوع وظیفه الزامی هستند.' })
      return
    }
    try {
      let res
      if (isTaskEditMode.value) {
        res = await OrganizationUpdateDuty(
          taskForm.value._id,
          taskForm.value.title,
          taskForm.value.type,
          taskForm.value.isActive,
          taskForm.value.description
        )
      } else {
        res = await OrganizationNewDuty(
          taskForm.value.title,
          taskForm.value.type,
          taskForm.value.isActive,
          taskForm.value.description
        )
      }
      if (res.result) {
        Swal.fire({
          icon: 'success',
          title: 'موفقیت‌آمیز',
          text: 'وظیفه با موفقیت ذخیره شد.',
          timer: 1500,
          showConfirmButton: false
        })
        isTaskModalOpen.value = false
        await loadDuties()
      } else {
        Swal.fire({ icon: 'error', title: 'خطا', text: res.msg || 'خطایی در ذخیره‌سازی رخ داد.' })
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'خطا', text: err.message })
    }
  }

  const deleteTask = async (task: any, loadData: () => Promise<void>) => {
    Swal.fire({
      title: 'آیا مطمئن هستید؟',
      text: `حذف وظیفه "${task.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await $fetch('/api/tasks', { method: 'POST', body: { action: 'delete', task } })
        Swal.fire('حذف شد!', 'وظیفه با موفقیت حذف گردید.', 'success')
        await loadData()
      }
    })
  }

  return {
    tasks,
    taskSearchQuery,
    taskTypes,
    filteredTasks,
    isTaskTypeModalOpen,
    isTaskTypeEditMode,
    taskTypeForm,
    isTaskModalOpen,
    isTaskEditMode,
    taskForm,
    openTaskTypeModal,
    saveTaskType,
    editTaskType,
    // deleteTaskType,
    openNewTaskModal,
    openEditTaskModal,
    saveTask,
    deleteTask
  }
}