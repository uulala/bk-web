
import axios from 'axios-miniprogram'
// import axios from 'axios'

import { ls } from '@/plugin/utils'
const http = axios

// 请求base路径
http.defaults.baseURL = "http://127.0.0.1/"

http.defaults.headers = {
    'content-Type': 'application/json'
}

// // 添加请求拦截器
http.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        if (ls.isInWx) {
            Object.assign(config.headers, {
                'cookie': wx.getStorageSync("cookie")
            })
        }
        return config;
    },
    function (error) {
        //处理请求错误
        return Promise.reject(error);
    }
);

// // 添加响应拦截器
http.interceptors.response.use(
    function (response) {
        // 请求成功后做些什么
        const { config, headers } = response
        console.log(config.url)
        if (['/signin', '/signup','/signin/wx'].includes(config.url)) {
            if (ls.isInWx) {
                wx.setStorageSync('cookie', headers['Set-Cookie'])
            }

        } else if (config.url === 'signout') {
            if (ls.isInWx) {
                wx.setStorageSync('cookie', null)
            }

        }
        return response.data;
    },
    function (error) {
        // 处理响应错误
        return Promise.reject(error);
    }
);

export default http