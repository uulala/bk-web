import http from './http'

// 获取流水列表
export function getflows(params: Object) {
    return http({
        url: '/flow/list',
        method: 'get',
        params
    })
}

export function createFlow(data: Object) {
    return http({
        url: '/flow/create',
        method: 'post',
        data
    })
}

// 获取汇总数据
export function getflowTotal(params: Object) {
    return http({
        url: '/flow/total',
        method: 'get',
        params
    })
}

export function delFlow(data: Object) {
    return http({
        url: '/flow/del',
        method: 'post',
        data
    })
}

export function getflowTrand(params: Object) {
    return http({
        url: '/flow/trand',
        method: 'get',
        params
    })
}

