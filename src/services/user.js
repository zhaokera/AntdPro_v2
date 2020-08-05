import request from '@/utils/request';
import requestJsonp from '@/utils/requestJsonp';
import { type } from '../../package.json';

export async function query() {
  return request('/api/users');
}

// 获取ssoid
export async function getSsoValue() {
  // return requestJsonp('g2/sso/getValue');
  return requestJsonp(type === 'dm' ? 'g2/sso/getValue' : 'test/sso/getValue');
}

export async function getDecodeSsoid(ssoId) {
  return request(`/g2/router/decodeSsoid?ssoid=${ssoId}`, {
    method: 'POST',
  });
}

// 获取用户信息
export async function getAuthorityUserInfo() {
  return request('g2/wx.authority.user.get', {
    method: 'POST',
    body: {},
  });
}

// 退出登录
export async function loginout() {
  return requestJsonp(type === 'dm' ? 'g2/sso/loginout' : 'test/sso/loginout');
}
