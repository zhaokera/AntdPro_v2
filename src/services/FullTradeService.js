import request from '@/utils/request';

// 获取主订单记录
export async function GetFulltradeListService(params) {
    return request('g1/crm.fulltrade.list.get', {
      method: 'POST',
      body: params,
    });
  } 