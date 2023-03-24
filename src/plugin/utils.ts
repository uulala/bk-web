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
    getStartTime(type: string, d?: any) {
        const { Y, M, D, w1 } = ls.getTimePart(d)
        let tempTime = 0
        switch (type) {
            case 'Y':
                tempTime = new Date(`${Y}-${1}-1 00:00:00`).getTime()
                break
            case 'M':
                tempTime = new Date(`${Y}-${M}-1 00:00:00`).getTime()
                break
            case 'D':
                tempTime = new Date(`${Y}-${M}-${D} 00:00:00`).getTime()
                break
            case 'W':
                const s = w1 === 0 ? 6 : w1 - 1
                tempTime = new Date(`${Y}-${M}-${D} 00:00:00`).getTime() - s * 24 * 60 * 60 * 1000

                break
        }
        return tempTime
    },
    getEndTime(type: string, d?: any) {
        const { Y, M, D, w1 } = ls.getTimePart(d)
        let tempTime = 0
        switch (type) {
            case 'Y':
                tempTime = new Date(`${Y}-12-31 23:59:59`).getTime()
                break
            case 'M':
                tempTime = new Date(`${Y}-${M + 1}-01 23:59:59`).getTime() - 24 * 60 * 60 * 1000
                break
            case 'D':
                tempTime = new Date(`${Y}-${M}-${D} 23:59:59`).getTime()
                break
            case 'W':
                const s = w1 === 0 ? 0 : (7 - w1)
                tempTime = new Date(`${Y}-${M}-${D} 00:00:00`).getTime() + s * 24 * 60 * 60 * 1000
                break
        }
        return tempTime
    },
    getTimePart(d: any) {
        const temp = d ? new Date(d) : new Date()
        const h = temp.getHours(), m = temp.getMinutes(), s = temp.getSeconds(), w1 = temp.getDay()
        return {
            Y: temp.getFullYear(),
            M: temp.getMonth() + 1,
            D: temp.getDate(),
            HH: h > 9 ? h : `0${h}`,
            mm: m > 9 ? m : `0${m}`,
            ss: s > 9 ? s : `0${s}`,
            h,
            m,
            s,
            w1
        }
    },
    formatTime(d, formatter) {
        const { Y, M, D, HH, mm, } = ls.getTimePart(d)
        let temp = null
        switch (formatter) {
            case 'YYYY-mm-dd HH:mm':
                temp = `${Y}-${M}-${D} ${HH}:${mm}`
                break
            case 'YYYY-mm-dd':
                temp = `${Y}-${M}-${D}`
                break
            case 'YYYY.mm.dd':
                temp = `${Y}.${M}.${D}`
                break

        }
        return temp
    }
}

export {
    ls
}