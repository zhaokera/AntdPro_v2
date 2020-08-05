import request from '@/utils/request';

// 上传文件
export async function UploadFileService(params) {
    return request('/FileUpload/UploadFile', {
      method: 'POST',
      body: params,
    });
  }

  // 短信任务提交 
export async function NumberSendAddService(params) {
  return request('g1/crm.marketingnumber.sms.add', {
    method: 'POST',
    body: params,
  });
}

// 获取人群信息 
export async function NumberSendGetService(params) {
  return request('g1/crm.marketingnumber.sms.get', {
    method: 'POST',
    body: params,
  });
}

// 修改任务 
export async function NumberSendUpdateService(params) {
  return request('g1/crm.marketingnumber.sms.update', {
    method: 'POST',
    body: params,
  });
}