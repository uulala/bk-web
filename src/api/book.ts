import http from './http'

export function getBookById(params: Object) {
    return http({
        url: '/book',
        method: 'get',
        params
    })
}

// 获取 booklist
export function getBookList(params: Object) {
    return http({
        url: '/book/list',
        method: 'get',
        params
    })
}

// 选择公共 book, 创建私人 book(返回 book 及其  category)
export function createBook(data: Object) {
    return http({
        url: '/book/create',
        method: 'post',
        data
    })
}

// 获取 categorylist
export function getCategoryList(ids) {
    return http({
        url: '/category/list',
        method: 'get',
        data: { ids }
    })
}