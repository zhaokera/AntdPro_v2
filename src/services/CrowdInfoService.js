import request from '@/utils/request';

  //获取人群标签
  export async function  ListGetCrowdTagService(params) {
    return request('g1/crm.crowdtag.list.get', {
      method: 'POST',
      body: params,
    });
  }
   //人群预测
   export async function  SearchCrowdService(params) {
    return request('g1/crm.crowd.count.get', {
      method: 'POST',
      body: params,
    });
  }
  //保存人群
  export async function  AddCrowdService(params) {
    return request('g1/crm.crowd.item.add', {
      method: 'POST',
      body: params,
    });
  }

    //获取人群信息
    export async function  GetCrowdService(params) {
      return request('g1/crm.crowd.detail.get', {
        method: 'POST',
        body: params,
      });
    }

      //编辑人群
      export async function  EditCrowdService(params) {
        return request('g1/crm.crowd.item.edit', {
          method: 'POST',
          body: params,
        });
      }

      //获取客户所有分类
export async function  GetCrowdClassService(params) {
  return request('g1/crm.crowdclass.list.get', {
    method: 'POST',
    body: params,
  });
}

//新建人群分类 
export async function AddCrowdClassService(params) {
  return request('g1/crm.crowdclass.item.add', {
    method: 'POST',
    body: params,
  });
}

//修改分类 
export async function  EditCrowdClassService(params) {
  return request('g1/crm.crowdclass.item.update', {
    method: 'POST',
    body: params,
  });
}

//删除分类 
export async function  DeleteCrowdClassService(params) {
  return request('g1/crm.crowdclass.item.delete', {
    method: 'POST',
    body: params,
  });
} 
//分页获取人群信息
export async function  GetPageCrowdListService(params) {
  return request('g1/crm.crowd.listpage.get', {
    method: 'POST',
    body: params,
  });
}

//删除人群
export async function  DeleteCrowdService(params) {
  return request('g1/crm.crowd.item.delete', {
    method: 'POST',
    body: params,
  });
}