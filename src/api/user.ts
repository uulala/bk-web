import http from './http'

export function signUp(data: Object) {
    return http({
        url: '/signup',
        method: 'post',
        data
    })
}

export function signIn(data: Object) {
    return http({
        url: '/signin',
        method: 'post',
        data
    })
}

export function signOut() {
    return http({
        url: '/signout',
        method: 'get',
    })
}

export function wxLogin(cb) {
    wx.login({
        success(res) {
            if (res.code) {
                //发起网络请求
                http({
                    url: '/signin/wx',
                    method: 'post',
                    data: {
                        code: res.code
                    }
                }).then(res => {
                    cb(res)
                })
            } else {
                console.log('登录失败！' + res.errMsg)
            }
        }
    })
}


export function updateUser(data: Object) {
    return http({
        url: '/signin/update',
        method: 'post',
        data
    })
}

export function delUser(data: Object) {
    return http({
        url: '/signin/del',
        method: 'post',
        data
    })
}
