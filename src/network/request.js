import axios from "axios";

// 最终
export function request(config){
    // 1.创建axios的实例
    const instance = axios.create({
      baseURL: 'http://152.136.185.210:7878/api/hy66',
      timeout: 5000
    })
    // 2 axios的拦截器
    instance.interceptors.request.use(config => {
      return config;  //拦截完需返回
    },error => {
      // console.log(error)
    } )

    // 2.2 响应拦截
    instance.interceptors.response.use(res => {
      // console.log(res)
      return res.data
    }, err => {
      console.log(err)
    })

    // 3.发送真正的网络请求 instance()本身返回就是promise
    return instance(config)
}

