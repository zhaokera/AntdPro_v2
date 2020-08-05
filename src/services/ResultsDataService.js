import request from '@/utils/request';

//获取客户明细列表
export async function CustomerDetailListService(params) {
    return request('g1/crm.statistics.memberlist.get', {
        method: 'POST',
       body: params,
    }); 
}
//获取渠道名称
export async function GetChannelNameService(params) {
    return request('g1/crm.channelname.list.get', {
        method: 'POST',
       body: params,
    });   
}
//获取等级设置信息
export async function GetGradeSetService(params) {
    return request('g1/crm.grade.set.get', {
        method: 'POST',
       body: params,
    }); 
}

////获取订单明细列表
export async function GetOrderDetailsService(params) {
    return request('g1/crm.statistics.tradelist.get', {
        method: 'POST',
       body: params,
    }); 
}

////获取商品明细列表
export async function GetGoodsDetailsService(params) {
    return request('g1/crm.statistics.orderlist.get', {
        method: 'POST',
       body: params,
    }); 
}


