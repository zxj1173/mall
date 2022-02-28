export default {
  addCart(context,payload){
    return new Promise((resolve, reject) => {
      // 1.查找之前数组中是否有改商品
      let oldProdcut = context.state.cartList.find(item => item.iid === payload.iid)
      // 2。判断oldProduct
      if (oldProdcut){ //数量+1
        context.commit('addCounter',oldProdcut)
        resolve('商品数量加1')
      }else{ //添加新的商品
        payload.count = 1
        context.commit('addToCart',payload)
        resolve('加入购物车成功')
      }
    })
  }
}
