import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { isOnLine, code, type } from '../../package.json';

// 获取最底层path
export function getEndRoutePath(route) {
  if (route.routes && route.routes.length) {
    const menuArray = route.routes.filter(v => v.authority.length);
    if (menuArray && menuArray.length) {
      route = getEndRoutePath(menuArray[0]);
    }
  }
  return route;
}

// 获取最底层path
export function getEndChildrenPath(route) {
  if (route.children && route.children.length) {
    const menuArray = route.children.filter(v => v.authority.length);
    if (menuArray && menuArray.length) {
      route = getEndChildrenPath(menuArray[0]);
    }
  }
  return route;
}

export function getUrlRelativePath(url) {
  const arrUrl = url.split('//');
  if (!arrUrl[1]) {
    return url;
  }
  const start = arrUrl[1].indexOf('/');
  let relUrl = arrUrl[1].substring(start); // stop省略，截取从start开始到结尾的所有字符

  if (relUrl.indexOf('?') !== -1) {
    relUrl = relUrl.split('?')[0];
  }
  return relUrl;
}

/* 
  获取项目当前地址
  10000101   wx
  10000102   crm
  10000103   组织
*/
export function getUrlByCode(val) {
  let addressArray = [
    { code: 'domain', url: 'duomaiyun.com' },
    { code: 'oauth', url: 'https://oauth.duomaiyun.com' },
    { code: 'login', url: 'https://login.duomaiyun.com' },
    { code: 'editor', url: 'https://editor.duomaiyun.com' },
    { code: '10000101', url: 'https://wx.duomaiyun.com' },
    { code: '10000102', url: 'https://crm.duomaiyun.com' },
    { code: '10000103', url: 'https://organize.duomaiyun.com' },
  ];
  if (type === 'local') {
    addressArray = [
      { code: 'domain', url: 'taocrm.com' },
      { code: 'oauth', url: 'https://oauth.duomaiyun.com' },
      { code: 'login', url: 'http://logintest.taocrm.com' },
      { code: '10000101', url: 'http://localhost:8001' },
      { code: '10000102', url: 'http://localhost:8000' },
      { code: '10000103', url: 'http://localhost:8002' },
    ];
  }
  if (type === 'test') {
    addressArray = [
      { code: 'domain', url: 'taocrm.com' },
      { code: 'oauth', url: 'https://oauth.duomaiyun.com' },
      { code: 'login', url: 'http://logintest.taocrm.com' },
      { code: 'editor', url: 'http://editortest.taocrm.com' },
      { code: '10000101', url: 'http://wxtest.taocrm.com' },
      { code: '10000102', url: 'http://crmtest.taocrm.com' },
      { code: '10000103', url: 'http://organizetest.taocrm.com' },
    ];
  }
  if (type === 'jh') {
    addressArray = [
      { code: 'domain', url: 'crm-cfpd.com' },
      { code: 'oauth', url: 'http://oauth.duomaiyun.com' },
      { code: 'login', url: 'http://login.crm-cfpd.com' },
      { code: 'editor', url: 'http://editor.crm-cfpd.com' },
      { code: '10000101', url: 'http://wx.crm-cfpd.com' },
      { code: '10000102', url: 'http://crm.crm-cfpd.com' },
      { code: '10000103', url: 'http://organize.crm-cfpd.com' },
    ];
  }
  if (type === 'jhTest') {
    addressArray = [
      { code: 'domain', url: '119.23.104.27' },
      { code: 'oauth', url: 'http://119.23.104.27:8009' },
      { code: 'login', url: 'http://119.23.104.27:9000' },
      { code: 'editor', url: 'http://119.23.104.27:9004' },
      { code: '10000101', url: 'http://119.23.104.27:9002' },
      { code: '10000102', url: 'http://119.23.104.27:9001' },
      { code: '10000103', url: 'http://119.23.104.27:9003' },
    ];
  }
  const index = addressArray.findIndex(v => v.code === val);
  return index !== -1 ? addressArray[index].url : '';
}

/* 
  根据项目code配置菜单
  系统编号（subCode）
  10000101   wx
  10000102   crm
  10000103   组织
*/
export function setMenuByCode(menu) {
  if (menu.length) {
    menu = menu.filter(v => v.authority !== undefined || v.authority.length);
    menu.forEach(item => {
      if (
        isOnLine &&
        item.subCode !== code &&
        item.menuGrade === 2 &&
        item.routes &&
        !item.routes.length &&
        !item.topMenuPath
      ) {
        item.path = `${getUrlByCode(item.subCode)}${item.path}`;
        item.target = '_self';
      } else if (
        isOnLine &&
        item.subCode !== code &&
        item.menuGrade !== 1 &&
        item.menuGrade !== 2
      ) {
        item.path = `${getUrlByCode(item.subCode)}${item.path}`;
        item.target = '_self';
      }
      if (item.routes && item.routes.length) {
        item.routes = setMenuByCode(item.routes);
      }
    });
  }
  return menu;
}

// models筛选分页相关属性
export function filterListModel(result, pageSize) {
  pageSize = pageSize === undefined ? 20 : pageSize;
  const listModel = {
    list: [],
    pagination: { current: 1, pageSize: pageSize, total: 0 },
  };
  if (result) {
    return {
      list: result.list === undefined ? [] : result.list,
      pagination: {
        size: 'small',
        current: result.pageNum === undefined ? 1 : result.pageNum,
        pageSize: result.pageSize === undefined ? pageSize : result.pageSize,
        total: result.total === undefined ? 0 : result.total,
        showTotal: () => `共 ${result.total}条记录`,
        pageSizeOptions: ['10', '20', '50', '100'],
        defaultCurrent: 1,
        showQuickJumper: true,
        showSizeChanger: true,
      },
    };
  }
  return listModel;
}

export function toZip(imgList) {
  const zip = new JSZip();
  const imgFolder = zip.folder('images');
  let num = 0;
  function returnPro() {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < imgList.length; i++) {
        const img = imgList[i];
        const src = img.src;
        const imageName = img.name;
        const tempImage = new Image();
        tempImage.src = src;
        tempImage.crossOrigin = '*';
        tempImage.onload = () => {
          num++;
          const canvas = document.createElement('canvas');
          canvas.width = tempImage.width;
          canvas.height = tempImage.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(tempImage, 0, 0, tempImage.width, tempImage.height);
          const ext = tempImage.src.substring(tempImage.src.lastIndexOf('.') + 1).toLowerCase();
          const dataURL = canvas.toDataURL(`image/${ext}`);
          imgFolder.file(`${imageName}.png`, dataURL.substring(22), { base64: true });
          console.log(imageName);
          if (num === imgList.length) {
            resolve(num);
          }
        };
      }
    });
  }
  returnPro().then(reason => {
    console.log(reason);
    setTimeout(() => {
      zip.generateAsync({ type: 'blob' }).then(content => {
        FileSaver.saveAs(content, 'images.zip');
      });
    }, 1000);
  });
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });

// cookie的相关操作
export const cookie = {
  // 根据key值获取对应的cookie
  getCookie(key) {
    // 获取cookie
    const data = document.cookie;

    // 获取key第一次出现的位置
    let startIndex = data.indexOf(`${key}=`);

    // 如果开始索引值大于0表示有cookie
    if (startIndex > -1) {
      // key的起始位置等于出现的位置加key的长度+1
      startIndex = startIndex + key.length + 1;

      // 结束位置等于从key开始的位置之后第一次;号所出现的位置
      let endIndex = data.indexOf(';', startIndex);

      // 如果未找到结尾位置则结尾位置等于cookie长度，之后的内容全部获取
      endIndex = endIndex < 0 ? data.length : endIndex;

      return decodeURIComponent(data.substring(startIndex, endIndex));
    }
    return '';
  },

  setCookie(key, value, time) {
    // 默认保存时间
    const times = time;
    // 获取当前时间
    const cur = new Date(); // 设置指定时间;
    cur.setTime(cur.getTime() + times * 24 * 3600 * 1000);
    // 创建cookie  并且设置生存周期为UTC时间
    document.cookie = `${key}=${encodeURIComponent(value)};expires=${
      times === undefined ? '' : cur.toUTCString()
    };path=/;domain=.${getUrlByCode('domain')}`;
  },

  delCookie(key) {
    // 获取cookie
    const data = this.getCookie(key);

    // 如果获取到cookie则重新设置cookie的生存周期为过去时间
    // if ((data as any) !== false) {
    this.setCookie(key, data, -1);
    // }
  },
};
