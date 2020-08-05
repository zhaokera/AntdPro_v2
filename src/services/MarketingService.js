import request from '@/utils/request';

export async function GetReviewerList(params) {
    return request('g2/wx.authority.user.list.get', {
        method: 'POST',
        body: params,
    });
}

export async function GetCreaterList(params) {
    return request('g2/wx.authority.user.list.get', {
        method: 'POST',
        body: params,
    });
}

// 分页获取营销计划列表
export async function GetMarketplanListService(params) {
    return request('g1/crm.marketing.activitylist.get', {
        method: 'POST',
        body: params,
    });
}
// 新增或修改营销计划
export async function AddOrUpdateMarketplanService(params) {
    return request('g1/crm.marketing.activity.update', {
        method: 'POST',
        body: params,
    });
}

// 审核计划获取列表
export async function ObtainReviewerService(params) {
    return request('g2/wx.authority.user.list.get', {
        method: 'POST',
        body: params,
    });
}



// 停止营销计划
// export async function StopMarketPlanService(params) {
//     return request('g1/crm.marketing.activity.update', {
//         method: 'POST',
//         body: params,
//     });
// }

// 停止 重启营销计划
export async function RestartMarketPlanService(params) {
    return request('g1/crm.marketing.activity.updatestate', {
        method: 'POST',
        body: params,
    });
}


export async function GetExamineplanListService(params) {
    return request('g1/crm.marketing.activitylist.get', {
        method: 'POST',
        body: params,
    });
}

// 审核列表通过/不通过
export async function GetExamineplanPassService(params) {
    return request('g1/crm.marketing.activity.review', {
        method: 'POST',
        body: params,
    });
}

// 删除营销计划
export async function DeleteMarketPlanService(params) {
    return request('g1/crm.marketing.activity.updatestate', {
        method: 'POST',
        body: params,
    });
}


// 获取短息营销列表
export async function GetMarketSMSListService(params) {
    return request('g1/crm.marketingcustomer.sms.get', {
        method: 'POST',
        body: params,
    });
}


// 根据Id删除短息营销
export async function DeleteMarketSMSService(params) {
    return request('g1/crm.marketingcustomer.sms.delete', {
        method: 'POST',
        body: params,
    });
}
// 根据Id删除号码营销
export async function DeleteConfirmService(params) {
    return request('g1/crm.marketingnumber.sms.delete', {
        method: 'POST',
        body: params,
    });
}
// 指定号码营销列表
export async function GetNumPointSMSListService(params) {
    return request('g1/crm.marketingnumber.sms.get', {
        method: 'POST',
        body: params,
    });
}

// 活动列表获取
export async function ActivityListGet(params) {
    return request('g1/crm.marketing.activitylist.get', {
        method: 'POST',
        body: params,
    });
}

// 活动详情获取
export async function ActivityDetailGet(params) {
    return request('g1/crm.marketing.activity.get', {
        method: 'POST',
        body: params,
    });
}

// 活动详情更新
export async function ActivityUpdate(params) {
    return request('g1/crm.marketing.activity.update', {
        method: 'POST',
        body: params,
    });
}

// 更新画布节点内容
export async function ActivityContentUpdateService(params) {
    return request('g1/crm.marketing.activity.contentupdate', {
        method: 'POST',
        body: params,
    });
}


// 活动删除
export async function ActivityDelete(params) {
    return request('g1/crm.marketing.activity.updatestate', {
        method: 'POST',
        body: params,
    });
}

// 活动批量审核
export async function ActicityReview(params) {
    return request('g1/crm.marketing.activity.review', {
        method: 'POST',
        body: params,
    });
}

// 活动节点详情获取
export async function NodeGetService(params) {
    return request('g1/crm.marketing.node.get', {
        method: 'POST',
        body: params,
    });
}

// 活动节点创建更新
export async function NodeUpdateService(params) {
    return request('g1/crm.marketing.node.update', {
        method: 'POST',
        body: params,
    });
}

// 营销活动节点检测
export async function NodeCheckService(params) {
    return request('g1/crm.marketing.node.check', {
        method: 'POST',
        body: params,
    });
}

// 营销活动节点信息列表获取
export async function GetNodeListService(params) {
    return request('g1/crm.marketingnode.list.get', {
        method: 'POST',
        body: params,
    });
}

// 模拟执行
export async function AactivitySimulateService(params) {
    return request('g1/crm.marketing.activity.simulate', {
        method: 'POST',
        body: params,
    });
}

// 模拟执行结果
export async function AactivitySimResultService(params) {
    return request('g1/crm.marketing.activity.simresult', {
        method: 'POST',
        body: params,
    });
}


// 活动详情
export async function ActivityDetialService(params) {
    return request('g1/crm.marketing.activity.get', {
        method: 'POST',
        body: params,
    });
}

// 提交執行
export async function AactivityFormalService(params) {
    return request('g1/crm.marketing.activity.formal', {
        method: 'POST',
        body: params,
    });
}



// 短链接生成
export async function GetShortUrlService(params) {
    return request('g1/crm.marketing.shorturl.get', {
        method: 'POST',
        body: params,
    });
}

// 获取测试短信
export async function GetSmsTestListService(params) {
    return request('g1/crm.asset.smstestlist.get', {
        method: 'POST',
        body: params,
    });
}

// 新增测试短信
export async function AddSmsTestService(params) {
    return request('g1/crm.asset.smstest.add', {
        method: 'POST',
        body: params,
    });
}