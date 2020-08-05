import { stringify } from 'qs';
import request from '@/utils/request';
// TTTTTTT
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// 新增优惠券模板
export async function couponAdd(params) {
  return request('g2/wx.rights.award.coupon.add', {
    method: 'POST',
    body: params,
  });
}

// 修改优惠券模板
export async function couponEdit(params) {
  return request('g2/wx.rights.award.coupon.edit', {
    method: 'POST',
    body: params,
  });
}

// 获取优惠券
export async function getPrizeListByType(params) {
  // return request('duomai.awardtemplate.get', {
  return request('g2/wx.rights.awards.type.get', {
    method: 'POST',
    body: params,
  });
}



// 选择门店地址
export async function SelectAddress(params) {
  return request('g1/crm.area.info.get', {
    method: 'POST',
    body: params,
  });
}
