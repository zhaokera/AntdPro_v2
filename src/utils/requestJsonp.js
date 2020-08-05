import fetchJsonp from 'fetch-jsonp';
import { message } from 'antd';
import { getUrlByCode } from './utils';

export default function requestJsonp(url) {
  return fetchJsonp(`${getUrlByCode('oauth')}/${url}`, {
    jsonpCallbackFunction: 'jsoncallback',
  })
    .then(response => {
      return response.json();
      // response.json();
    })
    .then(res => {
      // console.log('requestJsonp', JSON.stringify(res));
      if (res.result) {
        return res.result;
      }
      const error = new Error(res.error.message);
      error.url = '登录验证';
      error.name = 'javaError';
      error.response = res.error;
      throw error;
    })
    .catch(e => {
      const status = e.name;
      if (status === 'javaError') {
        // notification.error({
        //   message: `${e.url}请求错误`,
        //   description: `状态码：${e.response.code}，错误信息：${e.message}`,
        // });
        message.error(`错误信息：${e.message}`);
      }
    });
}
