export default [
  {path: '/index', name: "主页", icon: 'smile', component: './Index'},
  {path: '/interface_info/:id', name: "查看接口", icon: 'smile', component: './InterfaceInfo', hideInMenu: true},
  {path: '/developer_platform', name: "开发者中心", icon: 'smile', component: './DeveloperPlatform'},
  {
    path: '/user', name: "首页", layout: false,
    routes: [
      {path: '/user/login', component: './User/Login'}
    ]
  },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: "管理页",
    routes: [
      {path: '/admin/interface_info', name: "接口管理", icon: "table", component: './Admin/InterfaceInfo'},
      {path: '/admin/interface_analysis', name: "接口分析", icon: "analysis", component: './Admin/InterfaceAnalysis'},
    ],
  },
  {path: '/', redirect: '/index'},
  {path: '*', layout: false, component: './404'},
];
