import { stringify } from 'qs';
import request from '@/utils/request';

// 分页获取系统消息
export async function SystemNewsGetService(params) {
    return request('g1/crm.systemset.sysmessage.get', {
      method: 'POST',
      body: params,
    });
}
