export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/mine/index',
  ],
  subPackages: [
    {
      root: 'packageMine',
      pages: [
        'pages/trace/index',
        'pages/trace/detail',
        'pages/config/index',
        'pages/settings/index',
        'pages/guide/index',
        'pages/about/index'
      ]
    }
  ],
  tabBar: {
    custom: true,
    color: '#999',
    selectedColor: '#333',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '共鸣',
        // iconPath: './assets/images/tab-resonance.png',
        // selectedIconPath: './assets/images/tab-resonance-active.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        // iconPath: './assets/images/tab-mine.png',
        // selectedIconPath: './assets/images/tab-mine-active.png',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '灵魂共鸣',
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: 'requiredComponents',
})
