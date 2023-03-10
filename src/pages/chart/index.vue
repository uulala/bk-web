<template>
    <view class="content">
        <view class="box tab-box">
            <view
                v-for="item in dateType"
                :key="item.value"
                :class="activeType === item.value ? 'active date-item box' : 'date-item box'"
                @click="() => handleChangeType(item.value)"
            >{{ item.lable }}</view>
            <view
                :class="activeType === 'other' ? 'active date-item box' : 'date-item box'"
                @click="onDisplay"
            >其他</view>
        </view>
        <!-- 日历 -->
        <van-calendar
            :show="show"
            type="range"
            color="#409eff"
            @close="onClose"
            @confirm="onConfirm"
        />
        <view class="time-row">时间范围：{{ showDate }}</view>
        <view class="box count-box">
            <view class="count-item box in-item"> 收入：{{ countObj.inNumber }}</view>
            <view class="count-item box out-item"> 支出：{{ countObj.outNumber }}</view>
            <view class="count-item box"> 结余：{{ countObj.inNumber - countObj.outNumber }}</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ls } from '@/plugin/utils'
import { getflows, getflowTotal } from '@/api/flow'

let categoryTypeList = reactive([
    { value: 2, lable: '收入' },
    { value: 3, lable: '支出' },
    // { value: 1, lable: '转账' },
    // { value: 0, lable: '借贷' }
]),
    dateType = reactive([
        { value: 'D', lable: '今日' },
        { value: 'W', lable: '本周' },
        { value: 'M', lable: '本月' },
        { value: 'Y', lable: '本年' },
    ]),
    countObj = reactive({ inNumber: 0, outNumber: 0 })

let activeType = ref('W'), show = ref(false)

const timeRange = reactive({
    D: [ls.getStartTime('D'), ls.getEndTime('D')],
    W: [ls.getStartTime('W'), ls.getEndTime('W')],
    M: [ls.getStartTime('M'), ls.getEndTime('M')],
    Y: [ls.getStartTime('Y'), ls.getEndTime('Y')],
})
let currentRange = reactive({ data: [] })

currentRange.data = timeRange[activeType.value]

const showDate = computed(() => {
    return `${ls.formatTime(currentRange.data[0], 'YYYY.mm.dd')} - ${ls.formatTime(currentRange.data[1], 'YYYY.mm.dd')}`
})

function getFlowData() {
    console.log('getFlow', currentRange.data)
    getflowTotal({
        bookId: ls.get('bookId'),
        startTime: currentRange.data[0],
        endTime: currentRange.data[1]
    }).then(res => {
        console.log(res)
        res.data.map(item => {
            if (item._id === 3) {
                countObj.outNumber = item.totalAmount
            } else if (item._id === 2) {
                countObj.inNumber = item.totalAmount
            }
        })
    })
}

getFlowData()


function handleChangeType(value) {
    activeType.value = value
    currentRange.data = timeRange[value]
    getFlowData()
}
function onDisplay() {
    show.value = true
    activeType.value = 'other'
}

function onClose() {
    show.value = false
}

function onConfirm(event) {
    const [start, end] = event.detail;
    currentRange.data = [ls.getTime(start), ls.getTime(end)]
    show.value = false
    getFlowData()
}
</script>

<style lang="scss" scoped>
.box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.tab-box {
    margin-bottom: 5px;

}

.date-item {
    width: 20%;
    height: 10vw;
    background: #eee;

}

.active {
    color: #409eff;
    background: #fff;
}

.time-row {
    border-bottom: 1px solid #eee;
    padding: 5px;
}

.count-box {
    justify-content: space-between;
}

.count-item {
    width: 33.33%;
    height: 50vh;
    font-size: 16px;
    font-weight: 500;
    background: #a6e4ff;
}

.in-item {
    background: #b9fab6;
}

.out-item {
    background: #ffb1ad;
}
</style>
