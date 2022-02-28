import Vue from "vue";
import Vuex from "vuex";
import mutations from "@/store/mutations";
import actions from "@/store/actions";
import getters from "@/store/getters";
// 1.安装创建
Vue.use(Vuex)

// 2.创建store对象
const state = {
  cartList: []
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

// 3.挂载到Vue实例上
export default store
