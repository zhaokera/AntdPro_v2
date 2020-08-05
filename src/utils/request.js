import fetch from 'dva/fetch';
import { notification, message } from 'antd';
// import router from 'umi/router';
import hash from 'hash.js';
import moment from 'moment';
import { isAntdPro } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const getguid = () => {
  let guid = '';
  for (let i = 1; i <= 32; i++) {
    const n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if (i === 8 || i === 12 || i === 16 || i === 20) guid += '-';
  }
  return guid;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  let methodName = '';
  if (url.startsWith('g1')) {
    methodName = url.split('/')[1];
    url = '/g1/router/api';
  } else if (url.startsWith('g2')) {
    methodName = url.split('/')[1];
    url = '/g2/router/api';
  }
  const options = {
    expirys: isAntdPro(),
    ...option,
  };

  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      const ssoId = localStorage.getItem('full.crm.ssoid');
      const sessionKey = localStorage.getItem('full.crm.sessionkey');
      if (url.startsWith('/g2/router/decodeSsoid') || url.startsWith('/g2/sso')) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        };
      } else if (url.indexOf('/g1/') > -1) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          dmwxtoken: ssoId,
          ...newOptions.headers,
        };
        const param = {
          jsonrpc: '2.0',
          method: methodName,
          id: getguid(),
          params: {
            admjson: newOptions.body,
            commomParameter: {
              appkey: '1',
              sessionkey: sessionKey,
              timestamp: moment().valueOf(),
            },
          },
        };

        newOptions.body = JSON.stringify(param);
      }else {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        };
        // newOptions.body = JSON.stringify(newOptions.body);
      }
    } else if (url.startsWith('/FileUpload')) {
      // 文件上传
      const sessionKey = localStorage.getItem('full.crm.sessionkey');
      option.body.append('sessionkey', sessionKey);
    } else {
      // newOptions.body is FormData
      /*  newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      }; */
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      if (!url.startsWith('/g2') && !url.startsWith('/g1') && !url.startsWith('/sso')) {
        return response.json();
      }
      return response.json().then(res => {
        // console.log('返回结果:', JSON.stringify(res));
        if (res.result) {
          return res.result;
        }
        const error = new Error(res.error.message);
        error.url = option.body.methodName;
        error.name = 'javaError';
        error.response = res.error;
        throw error;
      });
    })
    .catch(e => {
      const status = e.name;
      if (status === 'javaError' && e.response && e.response.code === 'login') {
        message.error(`错误信息：${e.message}`);
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 'javaError') {
        message.error(`错误信息：${e.message}`);
      }
      // if (status >= 404 && status < 422) {
      //   router.push('/exception/404');
      // }
    });
}