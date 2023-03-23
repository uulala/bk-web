import http from './http'
import { ls } from '@/plugin/utils'

export function csUploadFile(data, cb){
    const { name, filePath } = data
    wx.uploadFile({
        url: `${http.defaults.baseURL}/upload`, //仅为示例，非真实的接口地址
        filePath,
        name,
        formData: {
            ...data
        },
        header: {
            "Content-Type": "multipart/form-data",
            'cookie': ls.get("cookie")
        },
        success(res) {
            const data = JSON.parse(res.data)
            if (data.code === 1) {
                cb(data.data.url)
            }
            //do something
        }
    })
}

export function getAvatarByType(category: string) {
    return http({
        url: '/upload/byType',
        method: 'get',
        params: { category }
    })
}

export function delImg(data: Object) {
    return http({
        url: '/upload/del',
        method: 'post',
        data
    })
}

export function delAll(data: Object) {
    return http({
        url: '/over/delAll',
        method: 'post',
        data
    })
}