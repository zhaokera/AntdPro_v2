import request from '@/utils/request';

//  会员短信群发任务新增
export async function AddMarketingcustomerSmsService(params) {
  return request('g1/crm.marketingcustomer.sms.add', {
    method: 'POST',
    body: params,
  });
}

//   获取会员短信发送任务列表
export async function GetMarketingcustomerSmsService(params) {
    return request('g1/crm.marketingcustomer.sms.get', {
      method: 'POST',
      body: params,
    });
  }

  //  会员短信发送任务更新
export async function UpdateMarketingcustomerSmsService(params) {
    return request('g1/crm.marketingcustomer.sms.update', {
      method: 'POST',
      body: params,
    });
  }

  //计算人群数量
export async function   GetCrowdCrowdsinfoService(params) {
  return request('g1/crm.crowd.crowdsinfo.get', {
    method: 'POST',
    body: params,
  });
}