import request from '@/utils/request';

  //邮件测试信息获取
  export async function  ListGetEmailTestService(params) {
    return request('g1/crm.asset.emailtestlist.get', {
      method: 'POST',
      body: params,
    });
  }
   //邮件测试新增
   export async function  AddEmailTestService(params) {
    return request('g1/crm.asset.emailtest.add', {
      method: 'POST',
      body: params,
    });
  }