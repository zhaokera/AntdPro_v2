import request from '@/utils/request';

//获取客户规则
export async function GetMembersRuleService(params) {
  return request('g1/crm.members.rule.get', {
    method: 'POST',
    body: params,
  });
}

// 获取用户标签
export async function listlabelgetService(params) {
  return request('g1/crm.label.list.get', {
    method: 'POST',
    body: params,
  });
}
// 获取客户画像
export async function GetMembersService(params) {
  return request('g1/crm.customer.portrait.get', {
    method: 'POST',
    body: params,
  });
}

// 获取客户等级变更记录
export async function  PageListGradeUpService(params) {
  return request('g1/crm.gradeup.listpage.get', {
    method: 'POST',
    body: params,
  });
}
// 修改积分
export async function  SendPointBatchService(params) {
  return request('g2/wx.point.batch.send', {
    method: 'POST',
    body: params,
  });
}
// 积分明细 wx.point.buyer.log.get
export async function  GetPointBuyerLogService(params) {
  return request('g2/wx.point.buyer.log.get', {
    method: 'POST',
    body: params,
  });
}
// 获取客户互动信息
export async function  GetActivityFansLogService(params) {
  return request('g2/wx.activity.fans.log.get', {
    method: 'POST',
    body: params,
  });
}

// 新增会员标签
export async function AddLabelMemberService(params) {
  return request('g1/crm.label.member.add', {
    method: 'POST',
    body: params,
  });
}
// 删除会员标签
export async function DeleteLabelMemberService(params) {
  return request('g1/crm.label.member.delete', {
    method: 'POST',
    body: params,
  });
}
//获取用户等级
export async function GetMembersGradeService(params) {
  return request('g1/crm.grade.set.get', {
    method: 'POST',
    body: params,
  });
}

//修改等级规则
export async function AddGradeSetService(params) {
  return request('g1/crm.grade.set.add', {
    method: 'POST',
    body: params,
  });
}

//修改等级启用状态
export async function UpdateGradeStatusService(params) {
  return request('g1/crm.grade.status.update', {
    method: 'POST',
    body: params,
  });
}

//修改会员等级
export async function ADDMembersBlackService(params) {
  return request('g1/crm.black.list.add', {
    method: 'POST',
    body: params,
  });
}
 

//添加会员黑名单
export async function UpdateMembersGradeService(params) {
  return request('g1/crm.members.grade.update', {
    method: 'POST',
    body: params,
  });
}

//获取客户列表
export async function ListPageGetMembersService(params) {
  return request('g1/crm.members.list.get', {
    method: 'POST',
    body: params,
  });
}
//新增自定义属性
export async function PropertiesItemAddService(params) {
    return request('g1/crm.customproperties.item.add', {
        method: 'POST',
        body: params,
    });
}
//获取单个自定义属性信息
export async function PropertiesItemGetService(params) {
    return request('g1/crm.customproperties.item.get', {
        method: 'POST',
        body: params,
    });
}
//修改自定义属性
export async function PropertiesItemUpdateService(params) {
    return request('g1/crm.customproperties.item.update', {
        method: 'POST',
        body: params,
    });
}
//分页获取自定义属性
export async function PropertiesListpageGetService(params) {
    return request('g1/crm.customproperties.listpage.get', {
        method: 'POST',
        body: params,
    });

}
