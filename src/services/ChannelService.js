import request from '@/utils/request';

//授权、取消授权
export async function ChangeChannelService(params) {
    return request('g1/crm.channel.shop.outh', {
        method: 'POST',
        body: params,
    });
}
//获取渠道列表
export async function GetChannelListService(params) {
    return request('g1/crm.channel.shop.get', {
        method: 'POST',
        body: params,
    });
}
//删除店铺
export async function DeleteChannelService(params) {
    return request('g1/crm.channel.shop.delete', {
        method: 'POST',
        body: params,
    });
}
//获取店铺链接
export async function GetURLService(params) {
    return request('g1/crm.channel.url.get', {
        method: 'POST',
        body: params,
    });
}

//添加店铺
export async function AddStoreService(params) {
    return request('g1/crm.channel.shop.add', {
        method: 'POST',
        body: params,
    });
}
//添加店铺
export async function UpdateStoreService(params) {
    return request('g1/crm.channel.shop.update', {
        method: 'POST',
        body: params,
    });
}

//分页获取分店列表
export async function GetPgetShopListService(params) {
    return request('g2/wx.authority.shop.list', {
        method: 'POST',
        body: params,
    });
}

//分页获取分店列表
export async function DeletePgetShopListService(params) {
    return request('g2/wx.authority.shop.delete', {
        method: 'POST',
        body: params,
    });
}

//获取请求IP
export async function GetIpAddressService(params) {
    return request('/sohu/IP', {
        method: 'GET',
        body: params,
    });
}