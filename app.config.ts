/**
 * This file is used to configure the app
 *
 * If you have the "Cannot find name 'defineAppConfig'.ts(2304)" error
 * update the root tsconfig.json file to include the following:
 *
 *  "extends": "./.demo/.nuxt/tsconfig.json"
 *
 */

export default defineAppConfig({
  dir: 'rtl',
  nuxtIcon: {},
  tairo: {
    title: 'تایرو',
    sidebar: {
      toolbar: {
        showNavBurger: true,
        tools: [
          {
            component: 'DemoThemeToggle',
            props: {
              disableTransitions: true,
            },
          },
          {
            component: 'DemoToolbarLanguage',
          },
          {
            component: 'DemoToolbarNotifications',
          },
          {
            component: 'DemoToolbarActivity',
          },
          {
            component: 'DemoToolbarAccountMenu',
          },
        ],
      },
      circularMenu: {
        enabled: true,
        tools: [
          {
            component: 'DemoThemeToggle',
            props: {
              class: 'ms-auto',
              disableTransitions: true,
              inverted: true,
            },
          },
          {
            component: 'DemoCircularMenuLanguage',
          },
          {
            component: 'DemoCircularMenuNotifications',
          },
          {
            component: 'DemoCircularMenuActivity',
          },
        ],
      },
      navigation: {
        logo: {
          component: 'TairoLogo',
          props: { class: 'text-primary-600 h-10' },
        },
        items: [
          {
            title: 'داشبوردها',
            icon: { name: 'ph:sidebar-duotone', class: 'w-5 h-5' },
            subsidebar: { component: 'DemoSubsidebarDashboards' },
            activePath: '/dashboards',
          },
          {
            title: 'چیدمان‌ها',
            icon: { name: 'ph:app-window-duotone', class: 'w-5 h-5' },
            subsidebar: { component: 'DemoSubsidebarLayouts' },
            activePath: '/layouts',
          },
          {
            title: 'چت',
            icon: { name: 'ph:chat-circle-duotone', class: 'w-5 h-5' },
            to: '/dashboards/messaging',
          },
          {
            title: 'سفارشی‌سازی',
            icon: { name: 'ph:drop-half-bottom-duotone', class: 'w-5 h-5' },
            click: () => {
              const isOpen = useState('switcher-open', () => false)
              isOpen.value = true
            },
            position: 'end',
          },
          {
            title: 'جستجو',
            icon: { name: 'ph:magnifying-glass-duotone', class: 'w-5 h-5' },
            click: () => {
              const isOpen = useState('search-open', () => false)
              isOpen.value = true
            },
            position: 'end',
          },
          {
            title: 'تنظیمات',
            icon: { name: 'ph:gear-six-duotone', class: 'w-5 h-5' },
            to: '/layouts/settings',
            position: 'end',
          },
          {
            title: 'حساب کاربری من',
            component: 'DemoAccountMenu',
            position: 'end',
          },
        ],
      },
    },
    collapse: {
      toolbar: {
        enabled: true,
        showTitle: true,
        showNavBurger: true,
        tools: [
          {
            component: 'DemoThemeToggle',
          },
          {
            component: 'DemoToolbarLanguage',
          },
          {
            component: 'DemoToolbarNotifications',
          },
          {
            component: 'DemoToolbarActivity',
          },
          {
            component: 'DemoToolbarAccountMenu',
          },
        ],
      },
      circularMenu: {
        enabled: true,
        tools: [
          {
            component: 'DemoThemeToggle',
            props: {
              class: 'ms-auto',
              disableTransitions: true,
              inverted: true,
            },
          },
          {
            component: 'DemoCircularMenuLanguage',
          },
          {
            component: 'DemoCircularMenuNotifications',
          },
          {
            component: 'DemoCircularMenuActivity',
          },
        ],
      },
      navigation: {
        enabled: true,
        header: {
          component: 'DemoCollapseNavigationHeader',
        },
        footer: {
          component: 'DemoCollapseNavigationFooter',
        },
        items: [
          {
            name: 'داشبوردها',
            icon: { name: 'ph:sidebar-duotone', class: 'w-5 h-5' },
            activePath: '/dashboards',
            children: [
              {
                name: 'شخصی v1',
                to: '/dashboards',
                icon: { name: 'ph:coffee-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'شخصی v2',
                to: '/dashboards/personal-2',
                icon: { name: 'ph:chart-pie-slice-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'شخصی v3',
                to: '/dashboards/personal-3',
                icon: { name: 'ph:cactus-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'تحلیلی',
                to: '/dashboards/analytics',
                icon: { name: 'ph:gauge-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'سهام',
                to: '/dashboards/stocks',
                icon: { name: 'ph:coin-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'فروش',
                to: '/dashboards/sales',
                icon: { name: 'ph:shopping-cart-duotone', class: 'w-4 h-4' },
              },
            ],
          },
          {
            name: 'چیدمان‌ها',
            icon: { name: 'ph:app-window-duotone', class: 'w-5 h-5' },
            activePath: '/layouts',
            children: [
              {
                name: 'نمایش لیستی v1',
                to: '/layouts',
                icon: { name: 'ph:list-bullets-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'لیست فلکسی v1',
                to: '/layouts/flex-list-1',
                icon: { name: 'ph:list-checks-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'لیست جدولی v1',
                to: '/layouts/table-list-1',
                icon: { name: 'ph:table-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'شبکه کارت v1',
                to: '/layouts/card-grid-1',
                icon: { name: 'ph:circles-four-duotone', class: 'w-4 h-4' },
              },
            ],
          },
          {
            name: 'پروژه‌ها',
            icon: { name: 'ph:suitcase-duotone', class: 'w-5 h-5' },
            activePath: '/layouts/projects/',
            children: [
              {
                name: 'پروژه‌ها',
                to: '/layouts/projects/project-list-3',
                icon: { name: 'ph:leaf-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'جزئیات پروژه',
                to: '/layouts/projects/details',
                icon: {
                  name: 'ph:note-duotone',
                  class: 'w-4 h-4',
                },
              },
              {
                name: 'بورد کان بان',
                to: '/layouts/projects/board',
                icon: { name: 'ph:circles-four-duotone', class: 'w-4 h-4' },
              },
            ],
          },
          {
            name: 'احراز هویت',
            icon: { name: 'ph:lock-duotone', class: 'w-5 h-5' },
            activePath: '/layouts/projects/',
            children: [
              {
                name: 'ورود',
                to: '/auth',
                icon: { name: 'ph:fingerprint-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'ثبت نام',
                to: '/auth/signup-1',
                icon: {
                  name: 'ph:plus-circle-duotone',
                  class: 'w-4 h-4',
                },
              },
              {
                name: 'بازیابی',
                to: '/auth',
                icon: { name: 'ph:lightning-duotone', class: 'w-4 h-4' },
              },
            ],
          },
          {
            name: 'ویجت‌ها',
            icon: { name: 'ph:nut-duotone', class: 'w-5 h-5' },
            activePath: '/dashboards/widgets',
            children: [
              {
                name: 'ویجت‌های رابط کاربری',
                to: '/dashboards/widgets',
                icon: { name: 'ph:square-half-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'ابزارک‌های خلاقانه',
                to: '/dashboards/widgets/creative',
                icon: {
                  name: 'ph:square-half-bottom-duotone',
                  class: 'w-4 h-4',
                },
              },
              {
                name: 'ابزارک‌های لیست',
                to: '/dashboards/widgets/list',
                icon: { name: 'ph:square-half-duotone', class: 'w-4 h-4' },
              },
            ],
          },
          {
            name: 'جدا کننده',
            divider: true,
          },
          {
            name: 'نمودارها',
            icon: { name: 'ph:chart-pie-slice-duotone', class: 'w-5 h-5' },
            to: '/dashboards/charts',
          },
          {
            name: 'ویزارد',
            icon: { name: 'ph:magic-wand-duotone', class: 'w-5 h-5' },
            to: '/wizard',
          },
          {
            name: 'پیام‌رسانی',
            icon: { name: 'ph:chats-circle-duotone', class: 'w-5 h-5' },
            to: '/dashboards/messaging',
          },
          {
            name: 'سفارشی‌سازی',
            icon: { name: 'ph:drop-half-bottom-duotone', class: 'w-5 h-5' },
            click: () => {
              const isSwitcherOpen = useState('switcher-open', () => false)
              isSwitcherOpen.value = true
            },
            position: 'end',
          },
        ],
      },
    },
    topnav: {
      navigation: {
        enabled: true,
        logo: {
          component: 'TairoLogo',
          props: { class: 'text-primary-600 h-10 w-10' },
        },
        header: {
          component: 'DemoTopnavWorkspaceDropdown',
          props: {},
        },
        items: [
          {
            name: 'داشبورد',
            icon: { name: 'ph:gauge-duotone', class: 'w-6 h-6' },
            activePath: '/dashboards/sales',
            to: '/dashboards/sales',
          },
          {
            name: 'پروژه‌ها',
            icon: { name: 'ph:suitcase-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/projects/project-list-3',
            to: '/layouts/projects/project-list-3',
          },
          {
            name: 'فریلنسرها',
            icon: { name: 'ph:users-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/flex-list-1',
            to: '/layouts/flex-list-1',
          },
          {
            name: 'فایل‌ها',
            icon: { name: 'ph:note-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/table-list-3',
            to: '/layouts/table-list-3',
          },
          {
            name: 'مشتریان',
            icon: { name: 'ph:users-three-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/user-grid-3',
            to: '/layouts/user-grid-3',
          },
          {
            name: 'صورتحساب',
            icon: { name: 'ph:credit-card-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/utility-billing',
            to: '/layouts/utility-billing',
          },
          {
            name: 'تنظیمات',
            icon: { name: 'ph:gear-six-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/profile-settings',
            to: '/layouts/profile-settings',
          },
          {
            name: 'وضعیت',
            icon: { name: 'ph:notification-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/utility-status',
            to: '/layouts/utility-status',
          },
        ],
      },
      circularMenu: {
        enabled: true,
        tools: [
          {
            component: 'DemoThemeToggle',
            props: {
              class: 'ms-auto',
              disableTransitions: true,
              inverted: true,
            },
          },
          {
            component: 'DemoCircularMenuLanguage',
          },
          {
            component: 'DemoCircularMenuNotifications',
          },
          {
            component: 'DemoCircularMenuActivity',
          },
        ],
      },
      toolbar: {
        enabled: true,
        showTitle: false,
        tools: [
          {
            component: 'DemoThemeToggle',
            props: {
              disableTransitions: true,
            },
          },
          {
            component: 'DemoToolbarSearch',
          },
          {
            component: 'DemoToolbarCustomize',
          },
          {
            component: 'DemoToolbarNotifications',
          },
          {
            component: 'DemoAccountMenu',
            props: {
              horizontal: true,
            },
          },
        ],
      },
      footer: {
        enabled: true,
        logoSeparator: {
          component: 'TairoLogo',
          props: { class: 'text-primary-500 h-7 w-7' },
        },
        logo: {
          component: 'TairoLogoText',
          props: {
            class:
              'text-muted-300 ltablet:mx-0 mx-auto h-4 transition-all duration-200 lg:mx-0',
          },
        },
        copyright: {
          name: 'ال تم',
          to: 'https://cssninja.io',
          since: '2018',
        },
        links: [
          {
            name: 'صفحات دمو',
            to: '/demos',
          },
          {
            name: 'مستندات',
            to: 'https://tairo.cssninja.io/documentation',
          },
          {
            name: 'رابط کاربری شوریکن',
            to: 'https://github.com/shuriken-ui',
            rel: 'noopener',
            target: '_blank',
          },
          {
            name: 'پشتیبانی',
            to: 'https://cssninja.io/faq/support',
            rel: 'noopener',
            target: '_blank',
          },
        ],
      },
    },
    iconnav: {
      navigation: {
        enabled: true,
        logo: {
          component: 'TairoLogo',
          props: { class: 'text-primary-600 h-10 w-10' },
        },
        items: [
          {
            name: 'داشبوردها',
            icon: { name: 'ph:gauge-duotone', class: 'w-6 h-6' },
            activePath: '/dashboards',
            children: [
              {
                name: 'صفحه اصلی',
                to: '/dashboards',
                icon: { name: 'ph:house-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'موجودی',
                to: '/dashboards/balance',
                icon: { name: 'ph:chart-pie-slice-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'نمای کلی',
                to: '/dashboards/overview',
                icon: { name: 'ph:circles-three-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'نمایش سریع',
                to: '/dashboards/quickview',
                icon: { name: 'ph:bank-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'ترید',
                to: '/dashboards/trading',
                icon: { name: 'ph:subtract-duotone', class: 'w-4 h-4' },
              },
            ],
          },
          {
            name: 'بانکداری',
            icon: { name: 'ph:bank-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/',
            children: [
              {
                name: 'موجودی',
                to: '/layouts/accounts',
                icon: { name: 'ph:bank-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'تراکنش‌ها',
                to: '/layouts/transactions',
                icon: {
                  name: 'ph:arrows-left-right-duotone',
                  class: 'w-4 h-4',
                },
              },
              {
                name: 'پرداخت‌ها',
                to: '/layouts/payments',
                icon: {
                  name: 'ph:coins-duotone',
                  class: 'w-4 h-4',
                },
              },
              {
                name: 'کارت‌ها',
                to: '/layouts/cards',
                icon: {
                  name: 'ph:credit-card-duotone',
                  class: 'w-4 h-4',
                },
              },
              {
                name: 'اعتبار',
                to: '/layouts/credit',
                icon: { name: 'ph:rocket-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'سرمایه‌گذاری',
                to: '/layouts/invest',
                icon: { name: 'ph:globe-hemisphere-west-duotone', class: 'w-4 h-4' },
              },
            ],
          },
          {
            name: 'پروژه‌ها',
            icon: { name: 'ph:suitcase-duotone', class: 'w-6 h-6' },
            activePath: '/layouts/projects',
            children: [
              {
                name: 'پروژه‌ها',
                to: '/layouts/projects',
                icon: { name: 'ph:suitcase-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'بوردها',
                to: '/layouts/projects/board',
                icon: {
                  name: 'ph:squares-four-duotone',
                  class: 'w-4 h-4',
                },
              },
              {
                name: 'جزئیات',
                to: '/layouts/projects/details',
                icon: {
                  name: 'ph:square-half-duotone',
                  class: 'w-4 h-4',
                },
              },
            ],
          },
          {
            name: 'تنظیمات',
            icon: { name: 'ph:gear-six-duotone', class: 'w-6 h-6' },
            to: '/layouts/settings',
          },
          {
            name: 'سفارشی‌سازی',
            icon: { name: 'ph:drop-half-bottom-duotone', class: 'w-6 h-6' },
            click: () => {
              const isSwitcherOpen = useState('switcher-open', () => false)
              isSwitcherOpen.value = true
            },
          },
        ],
      },
      circularMenu: {
        enabled: true,
        tools: [
          {
            component: 'DemoThemeToggle',
            props: {
              class: 'ms-auto',
              disableTransitions: true,
              inverted: true,
            },
          },
          {
            component: 'DemoCircularMenuLanguage',
          },
          {
            component: 'DemoCircularMenuNotifications',
          },
          {
            component: 'DemoCircularMenuActivity',
          },
        ],
      },
      toolbar: {
        enabled: true,
        showTitle: true,
        tools: [
          {
            component: 'DemoThemeToggle',
          },
          // {
          //   component: 'DemoToolbarDropdown',
          // },
          {
            component: 'DemoToolbarNotifications',
          },
          {
            component: 'DemoAccountMenu',
            props: {
              horizontal: true,
              orientation: 'start',
            },
          },
        ],
      },
      footer: {
        enabled: true,
        logoSeparator: {
          component: 'TairoLogo',
          props: { class: 'text-primary-500 h-7 w-7' },
        },
        logo: {
          component: 'TairoLogoText',
          props: {
            class:
              'text-muted-300 ltablet:mx-0 mx-auto h-4 transition-all duration-200 lg:mx-0',
          },
        },
        copyright: {
          name: 'ال تم',
          to: 'https://cssninja.io',
          since: '2018',
        },
        links: [
          {
            name: 'صفحات دمو',
            to: '/demos',
          },
          {
            name: 'مستندات',
            to: 'https://tairo.cssninja.io/documentation',
          },
          {
            name: 'رابط کاربری شوریکن',
            to: 'https://github.com/shuriken-ui',
            rel: 'noopener',
            target: '_blank',
          },
          {
            name: 'پشتیبانی',
            to: 'https://cssninja.io/faq/support',
            rel: 'noopener',
            target: '_blank',
          },
        ],
      },
    },
    panels: [
      {
        name: 'language',
        position: 'right',
        component: 'DemoPanelLanguage',
      },
      {
        name: 'activity',
        position: 'right',
        component: 'DemoPanelActivity',
      },
      {
        name: 'search',
        position: 'left',
        component: 'DemoPanelSearch',
      },
      {
        name: 'task',
        position: 'right',
        component: 'DemoPanelTask',
      },
      {
        name: 'account',
        position: 'right',
        component: 'DemoPanelAccount',
        size: 'md',
      },
      {
        name: 'card',
        position: 'right',
        component: 'DemoPanelCard',
      },
      {
        name: 'invest',
        position: 'right',
        component: 'DemoPanelInvest',
        size: 'md',
      },
    ],
    error: {
      logo: {
        component: 'img',
        props: {
          src: '/img/illustrations/system/404-1.svg',
          class: 'relative z-20 w-full max-w-lg mx-auto',
        },
      },
    },
  },
})
