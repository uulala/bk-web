const ls = {
    projectKey: 'bk',
    isInWx: true,
    set(key: string, value: string) {
        const keyName = `${this.projectKey}-${key}`
        this.isInWx ? (wx.setStorageSync(keyName, value)) : (localStorage.setItem(keyName, value))
    },
    get(key: string) {
        const keyName = `${this.projectKey}-${key}`
        if (this.isInWx) {
            return wx.getStorageSync(keyName)
        } else {
            return localStorage.getItem(keyName)
        }
    },
    getTime(d: any) {
        const tempDate = d ? new Date(d) : new Date()
        return tempDate.getTime()
    },
    getSubTime(d: any, type: string, amount: number) {
        let tempTime = d ? new Date(d).getTime() : new Date().getTime()
        let coefficient = 1

        if (type === 'day') {
            coefficient = 24 * 60 * 60 * 1000
        }
        tempTime -= amount * coefficient
        return tempTime
    },
    getAddTime(d: any, type: string, amount: number) {
        let tempTime = d ? new Date(d).getTime() : new Date().getTime()
        let coefficient = 1

        if (type === 'day') {
            coefficient = 24 * 60 * 60 * 1000
        }
        tempTime += amount * coefficient
        return tempTime
    },
    getStartTime(type) {
        const { Y, M, D } = this.getTimePart()
        let tempTime = 0
        switch (type) {
            case 'Y':
                break;
            case 'M':
                tempTime = new Date(`${Y}-${M}-1 00:00:00`).getTime()
                break;
            case 'D':
                tempTime = new Date(`${Y}-${M}-${D} 00:00:00`).getTime()
                break;
        }

        return tempTime
    },
    getTimePart(d) {
        const temp = d ? new Date(d) : new Date()
        console.log(temp)
        const h = temp.getHours(), m = temp.getMinutes(), s = temp.getSeconds()
        return {
            Y: temp.getFullYear(),
            M: temp.getMonth() + 1,
            D: temp.getDate(),
            HH: h > 9 ? h : `0${h}`,
            mm: m > 9 ? m : `0${m}`,
            ss: s > 9 ? s : `0${s}`,
            h,
            m,
            s
        }
    },
    formatTime(d, formatter) {
        const { Y, M, D, HH, mm, } = this.getTimePart(d)
        console.log(Y, M, D, HH, mm, )
        let temp = null
        switch (formatter) {
            case 'YYYY-mm-dd HH:mm':
                temp = `${Y}-${M}-${D} ${HH}:${mm}`
                break
        }
        return temp
    }

    // setCookie(name, value, iDay) {
    //     if (this.isInWx) {
    //         wx.setStorageSync('cookie', value)
    //     } else {
    //         // document.cookie = `${name}=${value};expires=${iDay}`
    //     }
    // },
    //     setCookie((name, value, iDay) {  //传值为名，值，过期时间
    //         if(iDay){ //如果有过期时间的话则执行这个条件
    //             var oDate = new Date(); //获取当且的事件戳
    //             oDate.setDate(oDate.getDate() + iDay); //设置过期事件
    //             document.cookie = name + "=" + value + "; path=/; expires=" + oDate;//设置cookie
    //         }else {//如果有过期时间的话则执行这个条件 设置cookie
    //     document.cookie = name + "=" + value + "; path=/"; //名，值以及根目录
    // }
    //     },
    // getCookie(name) {
    //     if (isInWx) {
    //         return wx.getStorageSync('cookie')
    //     } else {
    //         let val = ''
    //         document.cookie.split(';').find(item => {
    //             const temp = item.split('=')
    //             if (temp[0] === name) val = temp[1]
    //         })
    //         console.log(val)
    //         return val
    //     }
    // },
    // removeCookie(name) {
    //     this.setCookie(name, '', -1)
    // }
}

export {
    ls
}