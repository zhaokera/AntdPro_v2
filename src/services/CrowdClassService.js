import request from '@/utils/request';
//获取客户所有分类
export async function  GetCrowdClassService(params) {
    return request('g1/crm.crowdclass.list.get', {
      method: 'POST',
      body: params,
    });
  }

//获取客户人群分类
export async function  ListPageGetCrowdClassService(params) {
    return request('/api/CrowdClass/ListPageGetCrowdClass', {
      method: 'POST',
      body: params,
    });
  }
  
  //新建人群分类 
  export async function  AddCrowdClassService(params) {
    return request('/api/CrowdClass/AddCrowdClass', {
      method: 'POST',
      body: params,
    });
  }

  //删除分类 EditCrowdClassService
  export async function  DeleteCrowdClassService(params) {
    return request('/api/CrowdClass/DeleteCrowdClass', {
      method: 'POST',
      body: params,
    });
  }

  //修改分类 
  export async function  EditCrowdClassService(params) {
    return request('/api/CrowdClass/EditCrowdClass', {
      method: 'POST',
      body: params,
    });
  }