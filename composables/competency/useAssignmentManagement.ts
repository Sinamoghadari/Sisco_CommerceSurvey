// composables/competency/useAssignmentManagement.ts
// صفحه مدیریت تکالیف
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

export const useAssignmentManagement = () => {
  const assignments = ref<any[]>([])
  const assignmentSearchQuery = ref('')
  const selectedTaskForManagement = ref<any>(null) // این شامل کد وظیفه‌ی پدر است (duty_code)

  const isAssignmentModalOpen = ref(false)
  const isAssignmentEditMode = ref(false)
  // فرم تکلیف مطابق پارامترهای API: شامل _id, duty_code, title, description, isActive
  const assignmentForm = ref({ _id: '', duty_code: '', title: '', description: '', isActive: true })

  const filteredAssignments = computed(() => {
  if (!selectedTaskForManagement.value) return []
  
  // کل لیست رو مستقیم می‌گیریم، چون قبلاً برای همین آیتم از بک‌اند دریافت شده
  let list = assignments.value 

  // فقط فیلتر جستجوی متنی (تکست‌باکس) را اعمال می‌کنیم
  if (assignmentSearchQuery.value?.trim()) {
    list = list.filter(a =>
      a.title?.toLowerCase().includes(assignmentSearchQuery.value.toLowerCase())
    )
  }
  
  return list
})


  // متد باز کردن فرم "تعریف تکلیف جدید"
  const openNewAssignmentModal = () => {
    isAssignmentEditMode.value = false
    assignmentForm.value = {
      _id: '',
      duty_code: selectedTaskForManagement.value.code, // کد وظیفه مربوطه پر می‌شود
      title: '',
      description: '',
      isActive: true
    }
    isAssignmentModalOpen.value = true
  }

  // متد باز کردن فرم "ویرایش تکلیف"
  const openEditAssignmentModal = (assign: any) => {
    isAssignmentEditMode.value = true
    assignmentForm.value = {
      _id: assign._id,
      duty_code: assign.duty_code,
      title: assign.title,
      description: assign.description || '',
      isActive: assign.isActive
    }
    isAssignmentModalOpen.value = true
  }

  // متد جامع ذخیره‌سازی که توابع API را از index.vue به عنوان ورودی می‌گیرد
  const saveAssignment = async (
    OrganizationNewTask: Function,
    OrganizationUpdateTask: Function,
    loadTasksForDuty: () => Promise<void>
  ) => {
    if (!assignmentForm.value.title.trim()) {
      Swal.fire({ icon: 'error', title: 'خطا', text: 'شرح تکلیف الزامی است.' })
      return
    }
    if (!assignmentForm.value.duty_code) {
      Swal.fire({ icon: 'error', title: 'خطا', text: 'کد وظیفه برای ثبت تکلیف یافت نشد.' })
      return
    }
    
    try {
      let res
      if (isAssignmentEditMode.value) {
        if (!assignmentForm.value._id) {
          Swal.fire({ icon: 'error', title: 'خطا', text: 'شناسه تکلیف برای ویرایش یافت نشد.' })
          return
        }
        // ارسال ۵ پارامتر دقیقاً به ترتیبی که در CompetencyApi.ts تعریف کرده‌اید
        res = await OrganizationUpdateTask(
          assignmentForm.value._id,
          assignmentForm.value.duty_code,
          assignmentForm.value.title,
          assignmentForm.value.isActive,
          assignmentForm.value.description
        )
      } else {
        // ارسال ۴ پارامتر دقیقاً به ترتیبی که در CompetencyApi.ts تعریف کرده‌اید
        res = await OrganizationNewTask(
          assignmentForm.value.duty_code,
          assignmentForm.value.title,
          assignmentForm.value.isActive,
          assignmentForm.value.description
        )
      }

      if (res.result) {
        Swal.fire({
          icon: 'success',
          title: 'موفقیت‌آمیز',
          text: 'تکلیف با موفقیت ذخیره شد.',
          timer: 1500,
          showConfirmButton: false
        })
        isAssignmentModalOpen.value = false
        await loadTasksForDuty() 
      } else {
        Swal.fire({ icon: 'error', title: 'خطا', text: res.msg || 'خطایی در ذخیره‌سازی رخ داد.' })
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'خطا', text: err.message })
    }
  }

  const deleteAssignment = async (assign: any, loadData: () => Promise<void>) => {
    // از آنجایی که متد حذف برای تکلیف فعلاً در داکیومنت شما نیست
    Swal.fire({ icon: 'info', title: 'در حال توسعه', text: 'متد حذف تکلیف هنوز از سمت سرور ارائه نشده است.' })
  }

  return {
    assignments,
    assignmentSearchQuery,
    selectedTaskForManagement,
    isAssignmentModalOpen,
    isAssignmentEditMode,
    assignmentForm,
    filteredAssignments,
    openNewAssignmentModal,
    openEditAssignmentModal,
    saveAssignment,
    deleteAssignment
  }
}
