import request from '@/utils/request';

// 获取树形类目
export async function ProductBehindCategoryTreeListService(params) {
    return request('g1/crm.product.behindcategorytree.list', {
        method: 'POST',
        body: params,
    });
}

// 获取商品列表
export async function ProductMasterListService(params) {
    return request('g1/crm.product.master.list', {
        method: 'POST',
        body: params,
    });
}

// 商品列表批量删除
export async function DeleteProductService(params) {
    return request('g1/crm.product.master.delete', {
        method: 'POST',
       body: params,
    });  
}
// 调整商品分类
export async function UpdateProductCategoryService(params) {
    return request('g1/crm.product.productcategory.update', {
        method: 'POST',
       body: params,
    }); 
}
// 新增商品
export async function AddProductService(params) {
    return request('g1/crm.product.master.add', {
        method: 'POST',
       body: params,
    }); 
}
// 新增属性
export async function AddAttributeKeyService(params) {
    return request('g1/crm.product.attributekey.add', {
        method: 'POST',
       body: params,
    }); 
}
// 新增规格
export async function AddSpecValService(params) {
    return request('g1/crm.product.specval.add', {
        method: 'POST',
       body: params,
    }); 
}

