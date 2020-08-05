import { stringify } from 'qs';
import request from '@/utils/request';

// 获取人群分析数据
export async function GetAnalysisDataService(params) {
  return request('g1/crm.crowdanalysis.item.get', {
      method: 'POST',
      body: params,
  });
}

// 获取时间内人群总人数
export async function GetAnalysisTotalCountService(params) {
    return request('g1/crm.crowdanalysis.totalcount.get', {
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
