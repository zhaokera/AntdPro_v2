import {
  
    UpdateMembersGradeService,
    ADDMembersBlackService,
    listlabelgetService,
    AddLabelMemberService,
    SendPointBatchService,
} from '@/services/CustomerService'

export default {
    namespace: 'memberlist',

    state: {
        tagid:[1,2,3,4]
    },

    effects: {
       
        // 修改会员等级
        *UpdateMembersGrade({ payload, callback }, { call, put }) {
            const response = yield call(UpdateMembersGradeService, payload);
            if (callback) callback(response);
        },
        // 添加会员黑名单
        *ADDMembersBlack({ payload, callback }, { call, put }) {
            const response = yield call(ADDMembersBlackService, payload);
            if (callback) callback(response);
        },
        // 获取会员标签
        *listlabelget({ payload, callback }, { call, put }) {
            const response = yield call(listlabelgetService, payload);
            if (callback) callback(response);
        },
        // 新增会员标签
        *AddLabelMember({ payload, callback }, { call, put }) {
            const response = yield call(AddLabelMemberService, payload);
            if (callback) callback(response);
        },
        // 修改会员积分
        *SendPointBatch({ payload, callback }, { call, put }) {
            const response = yield call(SendPointBatchService, payload);
            if (callback) callback(response);
        },
    },

    reducers: {
        
    },
};