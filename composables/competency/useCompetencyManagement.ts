import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

export const useCompetencyManagement = () => {
  const competencyTypes = ref<any[]>([])
  const competencyLvls = ref<any[]>([])
  const competencies = ref<any[]>([])
  const competencySearchQuery = ref('')

  const isCompTypeModalOpen = ref(false)
  const isCompTypeEditMode = ref(false)
  const compTypeForm = ref({ _id: '', title: '', status: true })

  const isCompLvlModalOpen = ref(false)
  const isCompLvlEditMode = ref(false)
  const compLvlForm = ref({ _id: '', title: '', code: null as number | null, status: true })

  const isCompModalOpen = ref(false)
  const isCompEditMode = ref(false)
  const compForm = ref({ _id: '', title: '', typeId: '', lvlId: '', description: '', isActive: true })

  const filteredCompetencies = computed(() => {
    let list = competencies.value
    if (competencySearchQuery.value.trim()) {
      list = list.filter(c =>
        c.title?.toLowerCase().includes(competencySearchQuery.value.toLowerCase())
      )
    }
    return list
  })

  // ==========================================
  // نوع شایستگی
  // ==========================================
  const openNewCompTypeModal = async (getTypesApi: any) => {
    isCompTypeEditMode.value = false
    compTypeForm.value = { _id: '', title: '', status: true }
    isCompTypeModalOpen.value = true
    const response = await getTypesApi()
    if (response.result) {
      competencyTypes.value = response.response.CompetencyTypes || []
    }
  }

  const selectCompTypeForEdit = (type: any) => {
    isCompTypeEditMode.value = true
    compTypeForm.value = { _id: type._id, title: type.title, status: type.status }
  }

  const saveCompType = async (createApi: any, updateApi: any, getTypesApi: any) => {
    if (!compTypeForm.value.title.trim()) {
      Swal.fire({ icon: 'error', title: 'خطا', text: 'نوع شایستگی الزامی است.' })
      return
    }
    const response = isCompTypeEditMode.value
      ? await updateApi(compTypeForm.value._id, compTypeForm.value.title, compTypeForm.value.status)
      : await createApi(compTypeForm.value.title, compTypeForm.value.status)
    if (!response.result) {
      Swal.fire({ icon: 'error', title: 'خطا', text: response.msg || 'خطا در ذخیره‌سازی' })
      return
    }
    Swal.fire({ icon: 'success', title: 'موفقیت‌آمیز', text: 'نوع شایستگی با موفقیت ثبت شد.', timer: 1500, showConfirmButton: false })
    compTypeForm.value = { _id: '', title: '', status: true }
    isCompTypeEditMode.value = false
    const refreshResponse = await getTypesApi()
    if (refreshResponse.result) {
      competencyTypes.value = refreshResponse.response.CompetencyTypes || []
    }
  }

  const deleteCompType = async (type: any, loadData: () => Promise<void>) => {
    Swal.fire({
      title: 'آیا مطمئن هستید؟', text: `آیا از حذف "${type.title}" مطمئن هستید؟`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#10B981', cancelButtonColor: '#EF4444',
      confirmButtonText: 'بله', cancelButtonText: 'خیر'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await $fetch('/api/competencyTypes', { method: 'POST', body: { action: 'delete', competencyType: type } })
        Swal.fire('حذف شد!', 'نوع شایستگی با موفقیت حذف گردید.', 'success')
        await loadData()
      }
    })
  }

  // ==========================================
  // سطح شایستگی
  // ==========================================
  const openNewCompLvlModal = async (getLevelsApi: any) => {
    isCompLvlEditMode.value = false
    compLvlForm.value = { _id: '', title: '', code: null, status: true }
    isCompLvlModalOpen.value = true
    const response = await getLevelsApi()
    if (response.result) {
      competencyLvls.value = response.response.competencyLevel || []
    }
  }

  const selectCompLvlForEdit = (lvl: any) => {
    isCompLvlEditMode.value = true
    compLvlForm.value = { _id: lvl._id, title: lvl.title, code: lvl.code, status: lvl.status }
  }

  const saveCompLvl = async (createApi: any, updateApi: any, getLevelsApi: any) => {
    if (!compLvlForm.value.title.trim() || compLvlForm.value.code === null || compLvlForm.value.code === undefined) {
      Swal.fire({ icon: 'error', title: 'خطا', text: 'کد سطح و تعریف سطح الزامی است.' })
      return
    }
    const response = isCompLvlEditMode.value
      ? await updateApi(compLvlForm.value._id, compLvlForm.value.code, compLvlForm.value.title, compLvlForm.value.status)
      : await createApi(compLvlForm.value.code, compLvlForm.value.title, compLvlForm.value.status)
    if (!response.result) {
      Swal.fire({ icon: 'error', title: 'خطا', text: response.msg || 'خطا در ذخیره‌سازی' })
      return
    }
    Swal.fire({ icon: 'success', title: 'موفقیت‌آمیز', text: 'سطح شایستگی با موفقیت ثبت شد.', timer: 1500, showConfirmButton: false })
    compLvlForm.value = { _id: '', title: '', code: null, status: true }
    isCompLvlEditMode.value = false
    const refreshResponse = await getLevelsApi()
    if (refreshResponse.result) {
      competencyLvls.value = refreshResponse.response.competencyLevel || []
    }
  }

  const deleteCompLvl = async (lvl: any, loadData: () => Promise<void>) => {
    Swal.fire({
      title: 'آیا مطمئن هستید؟', text: `آیا از حذف "${lvl.title}" مطمئن هستید؟`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#10B981', cancelButtonColor: '#EF4444',
      confirmButtonText: 'بله', cancelButtonText: 'خیر'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await $fetch('/api/competencyLvls', { method: 'POST', body: { action: 'delete', competencyLvl: lvl } })
        Swal.fire('حذف شد!', 'سطح شایستگی با موفقیت حذف گردید.', 'success')
        await loadData()
      }
    })
  }

  // ==========================================
  // شایستگی
  // ==========================================

  // نگاشت پاسخ خام API به ساختار مورد استفاده در جدول
  const mapCompetency = (c: any) => ({
    _id: c._id,
    title: c.title,
    type: c.type,
    typeId: c.type?._id || c.type || '',
    typeTitle: c.type?.title || '',
    level: c.level,
    lvlId: c.level?._id || c.level || '',
    levelTitle: c.level?.title || '',
    description: c.description || '',
    status: c.status,
    isActive: c.status === true,
    code: c.code
  })

  const loadCompetencies = async (getCompApi: any) => {
    const response = await getCompApi()
    if (response.result) {
      const list = response.response.competencies || []
      competencies.value = (Array.isArray(list) ? list : []).map(mapCompetency)
    }
  }

  const openNewCompModal = async (getCompTypesApi: any, getCompLvlsApi: any, getCompApi: any) => {
    isCompEditMode.value = false
    compForm.value = { _id: '', title: '', typeId: '', lvlId: '', description: '', isActive: true }
    isCompModalOpen.value = true
    const [typesResponse, lvlsResponse] = await Promise.all([
      getCompTypesApi(),
      getCompLvlsApi()
    ])
    if (typesResponse.result) competencyTypes.value = typesResponse.response.CompetencyTypes || []
    if (lvlsResponse.result) competencyLvls.value = lvlsResponse.response.competencyLevel || []
  }

  const openEditCompModal = async (comp: any, getCompTypesApi: any, getCompLvlsApi: any) => {
    isCompEditMode.value = true
    compForm.value = {
      _id: comp._id,
      title: comp.title,
      typeId: comp.typeId || comp.type?._id || comp.type || '',
      lvlId: comp.lvlId || comp.level?._id || comp.level || '',
      description: comp.description || '',
      isActive: comp.status ?? true
    }
    isCompModalOpen.value = true
    const [typesResponse, lvlsResponse] = await Promise.all([
      getCompTypesApi(),
      getCompLvlsApi()
    ])
    if (typesResponse.result) competencyTypes.value = typesResponse.response.CompetencyTypes || []
    if (lvlsResponse.result) competencyLvls.value = lvlsResponse.response.competencyLevel || []
  }

  const saveCompetency = async (createApi: any, updateApi: any, getCompApi: any) => {
    if (!compForm.value.title.trim() || !compForm.value.typeId || !compForm.value.lvlId) {
      Swal.fire({ icon: 'error', title: 'خطا', text: 'عنوان، نوع و سطح شایستگی الزامی هستند.' })
      return
    }
    const response = isCompEditMode.value
      ? await updateApi(
          compForm.value._id,
          compForm.value.title,
          compForm.value.typeId,
          compForm.value.lvlId,
          compForm.value.description,
          compForm.value.isActive
        )
      : await createApi(
          compForm.value.title,
          compForm.value.typeId,
          compForm.value.lvlId,
          compForm.value.description,
          compForm.value.isActive
        )
    if (!response.result) {
      Swal.fire({ icon: 'error', title: 'خطا', text: response.msg || 'خطا در ذخیره‌سازی' })
      return
    }
    Swal.fire({ icon: 'success', title: 'موفقیت‌آمیز', text: 'شایستگی با موفقیت ذخیره شد.', timer: 1500, showConfirmButton: false })
    compForm.value = { _id: '', title: '', typeId: '', lvlId: '', description: '', isActive: true }
    isCompEditMode.value = false
    isCompModalOpen.value = false
    await loadCompetencies(getCompApi)
  }

  const deleteCompetency = async (comp: any, loadData: () => Promise<void>) => {
    Swal.fire({
      title: 'آیا مطمئن هستید؟', text: `حذف شایستگی "${comp.title}"`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#10B981', cancelButtonColor: '#EF4444',
      confirmButtonText: 'بله', cancelButtonText: 'خیر'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await $fetch('/api/competencies', { method: 'POST', body: { action: 'delete', competency: comp } })
        Swal.fire('حذف شد!', 'شایستگی با موفقیت حذف گردید.', 'success')
        await loadData()
      }
    })
  }

  return {
    competencyTypes, competencyLvls, competencies, competencySearchQuery,
    isCompTypeModalOpen, isCompTypeEditMode, compTypeForm,
    isCompLvlModalOpen, isCompLvlEditMode, compLvlForm,
    isCompModalOpen, isCompEditMode, compForm,
    filteredCompetencies,
    openNewCompTypeModal, selectCompTypeForEdit, saveCompType, deleteCompType,
    openNewCompLvlModal, selectCompLvlForEdit, saveCompLvl, deleteCompLvl,
    openNewCompModal, openEditCompModal, saveCompetency, deleteCompetency, loadCompetencies
  }
}