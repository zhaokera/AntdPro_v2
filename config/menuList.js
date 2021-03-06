export default [
  {
    name: '首页',
    icon: 'highlight',
    path: '/indexpage',
    authority: ['1123'],
    routes: [
      {
        name: '首页',
        path: '/indexpage',
        component: './IndexPage',
        authority: ['1123'],
        routes: [],
        menuGrade: 2,
        menuCode: '8001',
        subCode: '10000102',
        picurl: 'http://wevip.image.alimmdn.com/qqd/com-icon1.png',
      },
    ],
    menuGrade: 1,
    menuCode: '80',
    subCode: '10000102',
    picurl: 'http://wevip.image.alimmdn.com/qqd/com-icon1.png',
  },
  {
    name: '商品',
    icon: 'icon-shopping',
    path: '/goods',
    authority: ['1123'],
    routes: [
      {
        name: '商品管理',
        path: '/goods/manage',
        authority: ['1123'],
        routes: [
          {
            name: '商品管理',
            path: '/goods/manage/goodslist',
            component: './Goods/Manage/GoodsList',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200101',
            subCode: '10000102',
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/72edff06-bdf5-420a-824a-b4d83c5c6ae6.png',
          },
          {
            name: '待导入商品',
            path: '/goods/manage/waitlead',
            component: './Goods/Manage/WaitLead',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200102',
            subCode: '10000102',
            hideInMenu: true,
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/27e0b9b6-74ca-4e3d-8808-38b9dc42180a.png',
          },
          {
            name: '商品发布',
            path: '/goods/manage/released',
            component: './Goods/Manage/Released',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200103',
            subCode: '10000102',
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/753f8efb-25df-473a-9a52-d312e2474346.png',
          },
          {
            name: '商品分类',
            path: '/goods/manage/classify',
            component: './Goods/Manage/Classify',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200104',
            subCode: '10000102',
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/d683f571-7315-4c4c-b944-07bfe8c32fe2.png',
          },
          {
            name: '创建商品',
            path: '/goods/manage/create',
            component: './Goods/Manage/CreateGoods',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200105',
            subCode: '10000102',
            hideInMenu: true,
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/6d04029b-ca59-4a74-9338-a9df3b7de592.png',
          },
          {
            name: '选择商品',
            path: '/goods/manage/selectgoods',
            component: './Goods/Manage/SelectGoods',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200106',
            subCode: '10000102',
            hideInMenu: true,
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/92b9a100-17fd-4992-a470-8f8ac350cf96.png',
          },
          {
            name: '更新商品',
            path: '/goods/manage/channeldetail',
            component: './Goods/Manage/ChannelDetail',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200107',
            subCode: '10000102',
            hideInMenu: true,
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/9917d02c-14bf-47a1-b5e8-f9682cd63fbc.png',
          },
          {
            name: 'Excel导入',
            path: '/goods/manage/excelleadin',
            component: './Goods/Manage/ExcelLeadin',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200108',
            subCode: '10000102',
            hideInMenu: true,
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/0e83a541-17dd-4a58-b26f-7adac05d957f.png',
          },
          {
            name: 'Excel导入明细',
            path: '/goods/manage/exceldetail',
            component: './Goods/Manage/ExcelDetail',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200109',
            subCode: '10000102',
            hideInMenu: true,
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/328adeb7-2200-4edb-805e-69827fdc9fbd.png',
          },
          {
            name: '线上渠道商品导入',
            path: '/goods/manage/goodsleadin',
            component: './Goods/Manage/GoodsLeadin',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200110',
            subCode: '10000102',
            hideInMenu: true,
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/ca9da11d-d006-4df7-8b90-c8f28cf31411.png',
          },
          {
            name: '商品360',
            path: '/goods/manage/goods360',
            component: './Goods/Manage/Goods360',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200111',
            subCode: '10000102',
            topMenuPath: '/goods/manage/goodslist',
            picurl: 'http://wevip.image.alimmdn.com/qqd/com-icon1.png',
          },
          {
            name: '商品分组',
            path: '/goods/manage/grouping',
            component: './Goods/Manage/Grouping',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '200112',
            subCode: '10000102',
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/bf8eb15c-3b49-41df-a86d-d80e82283824.png',
          },
        ],
        menuGrade: 2,
        menuCode: '2001',
        subCode: '10000102',
        picurl:
          'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/72edff06-bdf5-420a-824a-b4d83c5c6ae6.png',
      },
    ],
    menuGrade: 1,
    menuCode: '20',
    subCode: '10000102',
    picurl: 'http://wevip.image.alimmdn.com/qqd/com-icon1.png',
  },
  {
    name: '订单',
    icon: 'icon-dingdan',
    path: '/order',
    authority: ['1123'],
    routes: [
      {
        name: '订单管理',
        path: '/order/manage',
        component: './Order/manage',
        authority: ['1123'],
        routes: [
          {
            name: '订单管理',
            path: '/order/manage/list',
            component: './Order/Manage',
            authority: ['1123'],
            menuGrade: 3,
            menuCode: '300101',
            subCode: '10000102',
            picurl:
              'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/aeb88f0a-d872-4e03-91ed-b27cc8028cec.png',
          },
        ],
        menuGrade: 2,
        menuCode: '3001',
        subCode: '10000102',
        picurl:
          'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/100101/aeb88f0a-d872-4e03-91ed-b27cc8028cec.png',
      },
      {
        name: '订单详情',
        path: '/order/manage/ordredetail',
        component: './Order/Manage/OrdreDetail',
        authority: ['1123'],
        routes: [],
        menuGrade: 2,
        menuCode: '3002',
        subCode: '10000102',
        topMenuPath: './order/manage',
        picurl: 'http://wevip.image.alimmdn.com/qqd/com-icon1.png',
      },
    ],
    menuGrade: 1,
    menuCode: '30',
    subCode: '10000102',
    picurl: 'http://wevip.image.alimmdn.com/qqd/com-icon1.png',
  },
];
