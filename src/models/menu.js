import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import Authorized, { reloadAuthorized } from '@/utils/Authorized';
import { setMenuByCode, getEndRoutePath, cookie } from '@/utils/utils';
import request from '@/utils/request';
import { setSsoId, setSessionKey, setAuthority, removeInfoLoginOut } from '@/utils/authority';
import { getSsoValue, getDecodeSsoid, getAuthorityUserInfo } from '@/services/user';
import menuConfig from '../../config/menuList';
const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      const result = {
        ...item,
        name: item.name,
        locale: item.name,
        topMenuPath: item.topMenuPath,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }

  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const jumpLoginByValue = val => {
  if (!val) {
    removeInfoLoginOut();
    return;
  }
  return val;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    viceMenuData: [], // 二级菜单
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    // 全部流程
    *getMenuData({ payload, callBack }, { put }) {
      // const { routes, authority } = payload;
      // const menuData = filterMenuData(memoizeOneFormatter(routes, authority));
      // const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      // yield put({
      //   type: 'save',
      //   payload: { menuData, breadcrumbNameMap },
      // });
      // return;
      const { path, pathname } = payload;
      const res = {
        id: 1123,
        userName: '1123',
        masterCode: '100002',
        phoneNumber: '15251909837',
        shortName: '全渠道小全子',
        createTime: '2019-08-08 20:40:50',
        modifyTime: '2020-03-10 22:07:43',
        expireTime: '2020-12-31 00:00:00',
        email: '152@qq.com',
        birthday: '2019-08-08 00:00:00',
        userType: 'system',
        status: 1,
        createAccount: '1123',
        sessionkey:
          '65794a6859324e7664573530626d46745a534936496a45784d6a4d694c434a3163325679615751694f6a45784d6a4d73496e567a5a584a70615751694f6a45784d6a4d73496e567a5a584a755957316c496a6f694d5445794d794a39',
        logUrl:
          'http://wevip.image.alimmdn.com/wxqqd/coupon/1574648940461_89988.JPG?t=1574648940461_89988.JPG',
        customerDb: 'Customer',
        tradeDb: 'Customer',
        businessCode: '10001',
        qqNum: '544252356',
        sex: 0,
        wxOpenid: '1111111',
        roleId: [],
        brandName: '苹果',
        brandLogo:
          'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/1123/64bcbe8d-bcc6-481f-97fa-2bb6482d362e.png',
        pwdJieMi: true,
        jemi: false,
      };
      if (res && res.id) {
        setAuthority([`${res.id}`]);
        reloadAuthorized();
        let route = {};
        // 菜单处理的相关方法和逻辑
        const menuBySetting = setMenuByCode(menuConfig);
        if (!menuBySetting || !menuBySetting.length) return;
        if (pathname === '/' && callBack && menuBySetting.length) {
          let menuArray = JSON.parse(JSON.stringify(menuBySetting));
          menuArray = menuArray.filter(v => v.authority.length);
          if (!menuArray || !menuArray.length) {
            removeInfoLoginOut();
            return;
          }
          route = getEndRoutePath(menuArray[0]);
          if (route.target === '_self') {
            window.open(route.path, '_self');
            return;
          }
        }
        const originalMenuData = memoizeOneFormatter(menuBySetting, [`${res.id}`], path);
        const menuData = filterMenuData(originalMenuData);
        const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
        yield put({
          type: 'user/saveCurrentUser',
          payload: res,
        });
        yield put({
          type: 'save',
          payload: { menuData, breadcrumbNameMap, routerData: menuBySetting },
        });
        if (callBack) callBack(route);
      }
    },
    *getViceMenuData({ payload }, { put }) {
      const { viceMenuData } = payload;
      yield put({
        type: 'save',
        payload: { viceMenuData },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
