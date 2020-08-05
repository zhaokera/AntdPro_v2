import {
    ProductBehindCategoryTreeListService,
    ProductMasterListService,
    DeleteProductService,
    UpdateProductCategoryService
} from '@/services/GoodsService'

export default {
    namespace: 'goodslistModel',

    state: {
    },

    effects: {
        
        //  获取商品分类
        *ProductBehindCategoryTreeListModel({ payload, callback }, { call, put }) {
            const response = yield call(ProductBehindCategoryTreeListService, payload);
            if (callback) callback(response);
        },
        //  获取spu
        *ProductMasterListModel({ payload, callback }, { call, put }) {
            const response = yield call(ProductMasterListService, payload);
            if (callback) callback(response);
        },
        //  批量删除
        *DeleteProductService({ payload, callback }, { call, put }) {
            const response = yield call(DeleteProductService, payload);
            if (callback) callback(response);
        },
        //  调整类
        *UpdateCategoryService({ payload, callback }, { call, put }) {
            const response = yield call(UpdateProductCategoryService, payload);
            if (callback) callback(response);
        },
    },

    reducers: {

    },
};