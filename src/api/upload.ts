import http from './http'
import { ls } from '@/plugin/utils'

export function uploadFile(data, cb) {
    wx.chooseImage({
        success(res) {
            const tempFilePaths = res.tempFilePaths
            wx.uploadFile({
                url: `${http.defaults.baseURL}/upload`, //仅为示例，非真实的接口地址
                filePath: tempFilePaths[0],
                name: 'file',
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
                        cb(data.url)
                    }
                    //do something
                }
            })
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