import Toast from "@/components/common/toast/Toast";

const obj = {}

obj.install = function (Vue){
  // console.log('install方法')

  // 1.创建组件构造器
  const toastConstructor = Vue.extend(Toast)
  // 2.使用new的方法,根据组件构造器,创建一个组件对象
  const toast = new toastConstructor()
  // 3.将组件对象手动挂载到某一个元素上
  toast.$mount(document.createElement('div'))
  // 4. 往body追加一个元素    toast.$el对应的就是div
  document.body.appendChild(toast.$el)
  // 5.往vue的原型添加
  Vue.prototype.$toast = toast
}
export default  obj
