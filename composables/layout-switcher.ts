/**
 * This composable is used in conjunction with the LayoutSwitcher component.
 * It provides a simple way to switch between different layouts, for demo purposes.
 * Layout components are imported below to be made available to the composable.
 */

import {
  TairoCollapseLayout,
  TairoSidebarLayout,
  TairoTopnavLayout,
  TairoIconnavLayout,
} from '#components'

export function useLayoutSwitcher() {
  const layouts = [
    {
      name: 'sidebar',
      label: 'سایدبار',
      component: TairoSidebarLayout,
    },
    {
      name: 'collapse',
      label: 'جمع‌شونده',
      component: TairoCollapseLayout,
    },
    {
      name: 'topnav',
      label: 'نوار ابزار بالا',
      component: TairoTopnavLayout,
    },
    {
      name: 'iconnav',
      label: 'ناوبری آیکون',
      component: TairoIconnavLayout,
    },
  ] as const

  const activeLayoutName = useState('layout-switcher-active', () => 'iconnav')
  const activeLayout = computed(() => {
    return layouts.find(layout => layout.name === activeLayoutName.value)
  })
  const activeLayoutComponent = computed(() => {
    return activeLayout.value?.component || TairoSidebarLayout
  })

  return {
    layouts,
    activeLayout,
    activeLayoutName,
    activeLayoutComponent,
  }
}
