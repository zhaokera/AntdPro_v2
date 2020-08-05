import {
    ListGetEmailTestService,
    AddEmailTestService
} from '@/services/EmailService.js'


export default {
    namespace: 'email',
    state: {
    },
    effects: {
        //邮件测试信息获取 
        *ListGetEmailTest({ payload, callback }, { call, put }) {
            const response = yield call(ListGetEmailTestService, payload);
           
            if (callback) callback(response);
        },
         //邮件测试新增
         *AddEmailTest({ payload, callback }, { call, put }) {
            const response = yield call(AddEmailTestService, payload);
           
            if (callback) callback(response);
        },
    },
    reducers: {
    }
};