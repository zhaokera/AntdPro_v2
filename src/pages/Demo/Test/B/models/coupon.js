import { couponAdd, getPrizeListByType } from '@/services/api';
import { filterListModel } from '@/utils/utils';

export default {
  namespace: 'coupon',

  state: {
    data: {
      list: [],
      queryParams: {},
    },
    selectPrize: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getPrizeListByType, payload);
      yield put({
        type: 'save',
        payload: response,
        queryParams: payload,
      });
    },
    // 奖品新增
    *couponAdd({ payload, callBack }, { call, put }) {
      const response = yield call(couponAdd, payload);

      yield put({
        type: 'savePrizeAdd',
        payload: response,
      });
      if (callBack) callBack(response);
    },
  },

  reducers: {
    save(state, action) {
      const resData = filterListModel(action.payload);
      resData.queryParams = action.queryParams;
      return {
        ...state,
        data: resData,
      };
    },
    savePrizeAdd(state, action) {
      const list = action.payload;
      return {
        ...state,
        aliPacketList: list,
      };
    },
  },
};
