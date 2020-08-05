import request from '@/utils/request';
//新建标签分组
export async function  AddLabelGroupService(params) {
    return request('g1/crm.label.group.add', {
      method: 'POST',
      body: params,
    });
  }


//修改标签分组
export async function  UpdateLabelGroupService(params) {
  return request('g1/crm.label.group.update', {
    method: 'POST',
    body: params,
  });
}

//删除标签分组
export async function DeleteLabelGroupService(params) {
  return request('g1/crm.label.group.delete', {
    method: 'POST',
    body: params,
  });
}

//获取标签分组和标签列表
export async function GetLabelGroupService(params) {
  return request('g1/crm.label.group.get', {
    method: 'POST',
    body: params,
  });
}

//添加标签
export async function AddLabelService(params) {
  return request('g1/crm.label.item.add', {
    method: 'POST',
    body: params,
  });
}

//修改标签
export async function UpdateLabelService(params) {
  return request('g1/crm.label.item.update', {
    method: 'POST',
    body: params,
  });
}

//删除标签
export async function DeleteLabelService(params) {
  return request('g1/crm.label.item.delete', {
    method: 'POST',
    body: params,
  });
}

//获取可设置项
export async function GetLabelDataSetService(params) {
  return request('g1/crm.crowdtag.list.get', {
    method: 'POST',
    body: params,
  });
}

//分页获取标签信息
export async function ListPageGetLabelService(params) {
  return request('g1/crm.label.listpage.get', {
    method: 'POST',
    body: params,
  });
}


