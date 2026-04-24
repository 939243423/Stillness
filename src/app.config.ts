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
        'pages/guide/index',
        'pages/about/index',
        'pages/config/index',
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
        text: '首页',
        iconPath: './assets/images/tab-home.png',
        selectedIconPath: './assets/images/tab-home-active.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: './assets/images/tab-mine.png',
        selectedIconPath: './assets/images/tab-mine-active.png',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro App',
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: 'requiredComponents',
})
