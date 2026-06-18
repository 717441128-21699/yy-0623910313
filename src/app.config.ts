export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/cases/index',
    'pages/judgment/index',
    'pages/profile/index',
    'pages/review/index',
    'pages/report/index',
    'pages/createCase/index',
    'pages/assignment/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E40AF',
    navigationBarTitleText: '弹幕风险研判',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#64748B',
    selectedColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/cases/index',
        text: '案例课堂'
      },
      {
        pagePath: 'pages/judgment/index',
        text: '分组研判'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
