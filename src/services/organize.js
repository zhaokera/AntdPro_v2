import request from '@/utils/request';

// 卖家账号列表查询
export async function getUserList(params) {
  return request('g2/wx.authority.user.list.search', {
    method: 'POST',
    body: params,
  });
}

// 卖家子账号新增
export async function userCreate(params) {
  return request('g2/wx.authority.user.create', {
    method: 'POST',
    body: params,
  });
}

// 卖家子账号更新
export async function userUpdate(params) {
  return request('g2/wx.authority.user.update', {
    method: 'POST',
    body: params,
  });
}

// 停用用户
export async function userStop(params) {
  return request('g2/wx.authority.user.stop', {
    method: 'POST',
    body: params,
  });
}

// 删除用户
export async function userDelete(params) {
  return request('g2/wx.authority.user.delete', {
    method: 'POST',
    body: params,
  });
}

// 查询角色
export async function getRoleList(params) {
  return request('g2/wx.authority.role.list.search', {
    method: 'POST',
    body: params,
  });
}

// 创建角色
export async function roleCreate(params) {
  return request('g2/wx.authority.role.create', {
    method: 'POST',
    body: params,
  });
}

// 修改角色
export async function roleUpdate(params) {
  return request('g2/wx.authority.role.update', {
    method: 'POST',
    body: params,
  });
}

// 删除角色
export async function roleDelete(params) {
  return request('g2/wx.authority.role.delete', {
    method: 'POST',
    body: params,
  });
}

// 根据角色/用户ID获取菜单
export async function getMenuById(params) {
  return request('g2/wx.authority.menu.get', {
    method: 'POST',
    body: params,
  });
}

// 根据角色ID修改菜单
export async function updateRoleMenuById(params) {
  return request('g2/wx.authority.role.power.update', {
    method: 'POST',
    body: params,
  });
}

// 根据角色/用户ID修改菜单
export async function updateMenuById(params) {
  return request('g2/wx.authority.user.power.update', {
    method: 'POST',
    body: params,
  });
}

// 门店管理列表
export async function getShopList(params) {
  return request('g2/wx.authority.shop.list', {
    method: 'POST',
    body: params,
  });
}

// 新增门店
export async function saveStore(params) {
  return request('g2/wx.authority.shop.save', {
    method: 'POST',
    body: params,
  });
}

// 编辑页-获取门店信息
export async function getStore(params) {
  return request('g2/wx.authority.shop.get', {
    method: 'POST',
    body: params,
  });
}

// 编辑页保存-更新门店
export async function updateStore(params) {
  return request('g2/wx.authority.shop.update', {
    method: 'POST',
    body: params,
  });
}

// 删除门店
export async function deleteStore(params) {
  return request('g2/wx.authority.shop.delete', {
    method: 'POST',
    body: params,
  });
}

// 编辑门店-获取门店分组
export async function getShopGroupList(params) {
  return request('g2/wx.authority.group.shop.list', {
    method: 'POST',
    body: params,
  });
}
// 保存门店分组
export async function SaveShopGroup(params) {
  return request('g2/wx.authority.group.shop.save', {
    method: 'POST',
    body: params,
  });
}

// 删除门店分组
export async function DeleteShopGroup(params) {
  return request('g2/wx.authority.group.shop.delete', {
    method: 'POST',
    body: params,
  });
}

// 编辑门店分组
export async function EditShopGroup(params) {
  return request('g2/wx.authority.group.shop.update', {
    method: 'POST',
    body: params,
  });
}

// 选择门店地址
export async function SelectAddress(params) {
  return request('g1/crm.area.info.get', {
    method: 'POST',
    body: params,
  });
}

export async function getroleName(params) {
  // 获取店长
  return request('g2/wx.authority.user.list.by.role', {
    method: 'POST',
    body: params,
  });
}
