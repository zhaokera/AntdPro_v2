import {
    SelectAddress
} from '@/services/api'

export default {
    namespace: 'area',

    state: {

    },

    effects: {
        *SelectAddress({ payload, callBack }, { call }) { // 选择门店地址
            const response = yield call(SelectAddress, payload);
            console.log('查询所有选择地址1', response)
            if (callBack) callBack(response);
        },
    },

    reducers: {

    },
};