export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user', '1123'],
    routes: [
      { path: '/', redirect: '/indexpage' },
      //首页
      {
        name: '首页',
        icon: 'highlight',
        path: '/indexpage',
        routes: [
          {
            path: '/indexpage',
            name: '首页',
            component: './IndexPage',
          },
        ],
      },
      // 商品
      {
        name: '商品',
        icon: 'shopping',
        path: '/goods',
        routes: [
          {
            path: '/goods/manage',
            name: '商品管理',
            routes: [
              {
                path: '/goods/manage/goodslist',
                name: '商品管理',
                component: './Goods/Manage/GoodsList',
              },
              {
                path: '/goods/manage/waitlead',
                name: '待导入商品',
                component: './Goods/Manage/WaitLead',
                hideInMenu: 'true',
              },
              {
                path: '/goods/manage/released',
                name: '商品发布',
                component: './Goods/Manage/Released',
              },
              {
                path: '/goods/manage/classify',
                name: '商品分类',
                component: './Goods/Manage/Classify',
              },
              {
                path: '/goods/manage/create',
                name: '创建商品',
                component: './Goods/Manage/CreateGoods',
                hideInMenu: true,
              },
              {
                path: '/goods/manage/selectgoods',
                name: '选择商品',
                component: './Goods/Manage/SelectGoods',
                // hideInMenu: true
              },
              {
                path: '/goods/manage/channeldetail',
                name: '更新商品',
                component: './Goods/Manage/ChannelDetail',
                hideInMenu: true,
              },
              {
                path: '/goods/manage/excelleadin',
                name: 'Excel导入',
                component: './Goods/Manage/ExcelLeadin',
                hideInMenu: true,
              },
              {
                path: '/goods/manage/exceldetail',
                name: 'Excel导入明细',
                component: './Goods/Manage/ExcelDetail',
                hideInMenu: true,
              },
              {
                path: '/goods/manage/goodsleadin',
                name: '线上渠道商品导入',
                component: './Goods/Manage/GoodsLeadin',
                hideInMenu: true,
              },
              {
                path: '/goods/manage/goods360',
                name: '商品360',
                component: './Goods/Manage/Goods360',
                topMenuPath: '/goods/manage/goodslist',
              },
            ],
          },
        ],
      },
      {
        name: '订单',
        icon: 'unordered-list',
        path: '/order',
        routes: [
          {
            path: '/order/manage',
            name: '订单管理',
            routes: [
              {
                path: '/order/manage/list',
                name: '订单管理',
                component: './Order/Manage',
              },
            ],
          },
          {
            path: '/order/manage/ordredetail',
            name: '订单管理',
            component: './Order/Manage/OrdreDetail',
            topMenuPath: '/order/manage',
          },
        ],
      },

      //  editor
      {
        name: 'Demo',
        icon: 'highlight',
        path: '/demo',
        routes: [
          {
            path: '/demo/flow',
            name: '流程编辑器',
            component: './Demo/GGEditor/Flow',
          },
          {
            path: '/demo/ggeditor',
            name: '二级菜单',
            routes: [
              {
                path: '/demo/ggeditor/mind',
                name: '脑图编辑器',
                component: './Demo/GGEditor/Mind',
              },
              {
                path: '/demo/ggeditor/koni',
                name: '拓扑编辑器',
                component: './Demo/GGEditor/Koni',
              },
            ],
          },
          {
            name: '组件',
            icon: 'highlight',
            path: '/demo/test',
            routes: [
              {
                path: '/demo/test/a',
                name: '公共组件',
                component: './Demo/Test/A',
              },
              {
                path: '/demo/test/b',
                name: 'Dva版',
                component: './Demo/Test/B',
              },
              {
                path: '/demo/test/c',
                name: '简化版',
                component: './Demo/Test/C',
              },
              {
                path: '/demo/test/d',
                name: '查询地址',
                component: './Demo/Test/D',
              },
            ],
          },
        ],
      },
      {
        name: '异常页',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: '403',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: '404',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: '500',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: '触发错误',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
