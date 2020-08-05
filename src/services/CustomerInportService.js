import request from '@/utils/request';


// 上传文件
export async function UploadFileService(params) {
  return request('/FileUpload/UploadFile', {
    method: 'POST',
    body: params,
  });
}

// 删除会员导入任务
export async function DeleteTaskService(params) {
  return request('g1/crm.inport.task.update', {
    method: 'POST',
    body: params,
  });
}


// 删除黑名单会员导入任务 
export async function DeleteBlackTaskService(params) {
  return request('g1/crm.black.import.delete', {
    method: 'POST',
    body: params,
  });
}

// 导出文件
export async function DownFileService(params) {
  return request('g1/crm.inport.fileexport.add', {
    method: 'POST',
    body: params,
  });
}

 // 分页获取导入任务
 export async function  ListPageGetInportTaskService(params) {
  return request('g1/crm.inport.task.get', {
    method: 'POST',
    body: params,
  });
}

 // 新增导入任务
 export async function  InportTaskAddService(params) {
  return request('g1/crm.inport.task.add', {
    method: 'POST',
    body: params,
  });
}

 // 黑名单分页获取导入任务
 export async function  BlackListImportListService(params) {
  return request('g1/crm.black.list.import.list', {
    method: 'POST',
    body: params,
  });
}

 // 黑名单新增导入任务
 export async function  BlackListImportAddService(params) {
  return request('g1/crm.black.list.import.add', {
    method: 'POST',
    body: params,
  });
}