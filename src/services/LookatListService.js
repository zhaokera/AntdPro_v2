import request from '@/utils/request';

// 获取发送明细
export async function GetDetailListService(params) {
    return request('g1/crm.sms.history.get', {
      method: 'POST',
      body: params,
    });
  }