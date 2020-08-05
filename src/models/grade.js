import {
    GetMembersGradeService,
    AddGradeSetService,
    UpdateGradeStatusService
} from '@/services/CustomerService'

export default {
    namespace: 'Grade',

    state: {
        grade: [{ id: 1, name: "青铜" }, { id: 2, name: "白银" }]
    },

    effects: {
         
        // 获取等级
        *GetMembersGrade({ payload, callback }, { call, put }) {
            const response = yield call(GetMembersGradeService, payload);
            yield put({
                type: 'SetMembersGrade',
                resdata: response
              });
            if (callback) callback(response);
        },
        
        // 修改等级设置
        *AddGradeSet({ payload, callback }, { call, put }) { 
            const response = yield call(AddGradeSetService, payload);
            if (callback) callback(response);
        },
        // 修改等级设置
        *UpdateGradeStatus({ payload, callback }, { call, put }) { 
            const response = yield call(UpdateGradeStatusService, payload);
            if (callback) callback(response);
        },
        
    },

    reducers: {
        // 获取等级
        SetMembersGrade(state, action) {
             
            return {
                ...state,
                grade: action.resdata
            }
        },
    },
};