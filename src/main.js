import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";
import toast from "@/components/common/toast";
import fastclick from 'fastclick'
import lazyload from 'vue-lazyload'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue();

//安装插件
Vue.use(toast)
Vue.use(lazyload)

fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
