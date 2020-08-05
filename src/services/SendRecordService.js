import request from '@/utils/request';

// 分页获取场景营销发送记录
export async function OnGetSendHistoryService(params) {
    return request('g1/crm.marketingevent.detail.get', {
        method: 'POST',
        body: params,
    }); 
}
