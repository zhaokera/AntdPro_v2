import {AddProductService,
        ProductBehindCategoryTreeListService,
        AddAttributeKeyService,
        AddSpecValService
       } from '@/services/GoodsService'

export default {
    namespace: 'createGoodsModel',

    state: {
    },

    effects: {
        
        //  新建商品
        *createProductModel({ payload, callback }, { call, put }) {
            const response = yield call(AddProductService, payload);
            if (callback) callback(response);
        },
        //  获取商品分类
        *ProductCategoryTreeListModel({ payload, callback }, { call, put }) {
            const response = yield call(ProductBehindCategoryTreeListService, payload);
            if (callback) callback(response);
        },
        //  新增属性
        *AddAttributeKeyModel({ payload, callback }, { call, put }) {
            const response = yield call(AddAttributeKeyService, payload);
            if (callback) callback(response);
        },
        //  新增规格
        *AddSpecValModel({ payload, callback }, { call, put }) {
            const response = yield call(AddSpecValService, payload);
            if (callback) callback(response);
        },
    },

    reducers: {

    },
};