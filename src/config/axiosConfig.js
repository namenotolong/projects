import { Message } from 'element-ui'
import { removeStore } from '../utils/utils'
import router from '../router';
import axios from 'axios';
import Vue from 'vue';
class AxiosConfig {
  constructor() {
    this.axiosService = axios.create({
      baseURL: 'http://localhost:8083'
    })
    this.addInterceptor()
    this.axiosService.getRequest = (url) => this.axiosService.get(url)
  }
  addInterceptor() {
    let loading = null;
    this.axiosService.interceptors.request.use(config => {
      loading = Vue.prototype.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let authorization = localStorage.getItem("token")
      if (authorization) {
        config.headers.authorization = authorization
      }
      return config
    }, err => {
      return Promise.reject(err)
    })
    this.axiosService.interceptors.response.use(response => {
      if (loading != null) {
        loading.close();
      }
      if (!response.data.success && typeof response.data.success != 'undefined') {
        console.log(response)
        Message.error({ message: response.data.message })
        //身份认证异常
        if (response.data.code === 333) {
          removeStore("token")
          router.push({ path: '/' })
        }
        //继续传播
        if (response.data.code === 334) {
          Promise.resolve(response);
        }
        return Promise.reject(response.data.message);
      }
      return response.data.data
    }, err => {
      Message.error({ message: err })
      return Promise.reject(err)
    })
  }
}
export default new AxiosConfig()
