import { stringify } from 'qs';
import request from '@/utils/request';

// 获取个人信息
export async function getInfo(params) {
    return request('wx.rights.awards.type.get', {
      method: 'POST',
      body: params,
    });
}
export async function queryCurrent() {
    return request('/api/currentUser');
}

// 获取短信充值项
export async function SmsAddListGetService(params) {
  return request('g1/crm.marketingaccount.addlist.get', {
      method: 'POST',
      body: params,
  });
} 

// 获取短信充值记录
export async function SmsAddHistoryGetService(params) {
  return request('g1/crm.marketingaccount.detail.get', {
      method: 'POST',
      body: params,
  });
}
// 分页获取操作日志
export async function LogPageListGetService(params) {
  return request('g1/crm.system.logpagelist.get', {
      method: 'POST',
      body: params,
  });
}

// 获取消耗记录
export async function ConsumeListGetService(params) {
  return request('g1/crm.marketingaccount.consumelist.get', {
      method: 'POST',
      body: params,
  });
}

// 获取会员通初始化
export async function InitPageListGetService(params) {
  return request('g1/crm.system.memberpagelist.get', {
      method: 'POST',
      body: params,
  });
}

// 获取会员通初始化详情
export async function InitdetailsPageListGetService(params) {
  return request('g2/wx.fans.account.sync.log', {
      method: 'POST',
      body: params,
  });
}