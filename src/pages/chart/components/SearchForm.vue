<template>
    <view class="content">
        <view class="box param-box">
            <view @click="showTimeBox = true">时间范围：<text class="active">{{ showDate }}</text></view>
            <view class="box">
                <view
                    v-for="item in categoryTypeList"
                    :key="item.value"
                    @click="() => changeCategoryType(item.value)"
                    :class="item.value === activeCategoryType ? `tab-item box active` : 'tab-item box'"
                >{{ item.lable }}</view>
            </view>
        </view>
        <view v-if="showTimeBox">
            <!-- 日期-大类 -->
            <view class="box-around">
                <view
                    v-for="it in timeType"
                    :key="it.value"
                    :class="activeTimeType === it.value ? 'active tab-item time-title' : 'tab-item time-title'"
                    @click="() => activeTimeType = it.value"
                >{{ it.lable }}</view>
            </view>
            <!-- 日期-小类 -->
            <view
                v-if="activeTimeType === 'year'"
                class="box-start"
            >
                <view
                    v-for="item in yearList.data"
                    :key="item"
                    :class="curActive === `${item}` ? 'active date-item' : 'date-item'"
                    @click="() => handleChangeTime(item, 'year')"
                >{{ item }}</view>
            </view>
            <view
                v-if="activeTimeType === 'mouth'"
                class="box-start"
            >
                <view
                    v-for="item in 12"
                    :key="item"
                    :class="curActive === `${item}` ? 'active date-item' : 'date-item'"
                    @click="() => handleChangeTime(`${item}`, 'mouth')"
                >{{ item }}</view>
            </view>
            <view
                v-if="activeTimeType === 'more'"
                class="box-start"
            >
                <view
                    v-for="item in dateType"
                    :key="item.value"
                    :class="curActive === `${item.value}` ? 'active date-item' : 'date-item'"
                    @click="() => handleChangeTime(`${item.value}`, 'more')"
                >{{ item.lable }}</view>
                <view
                    :class="curActive === 'other' ? 'active date-item' : 'date-item'"
                    @click="() => handleChangeTime('other', 'more')"
                >其他</view>


            </view>
        </view>

        <view class="model">
            <!-- 数据初始化中... -->
            <van-loading
                type="spinner"
                color="#1989fa"
                class="loading-btn"
                v-if="isLoading"
            >数据更新中...</van-loading>

            <view class="count-box">
                <view class="count-item  in-item"> 收入：{{ countObj.inNumber }}</view>
                <view class="count-item  out-item"> 支出：{{ countObj.outNumber }}</view>
                <view class="count-item "> 结余：{{ countObj.inNumber - countObj.outNumber }}</view>
            </view>
        </view>
        <!-- <van-popup
            :show="curActive === 'other'"
            position="bottom"
            custom-style="height: 60%;"
        >
            <van-datetime-picker
                type="date"
                v-model="currentDate"
                @input="handleChangeDate"
                @confirm="curActive = ''"
                @cancel="curActive = ''"
            />
        </van-popup> -->

    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ls } from '@/plugin/utils'
import { getflows, getflowTotal } from '@/api/flow'
import chartItem from '@/components/chartItem.vue';
const emits = defineEmits(['query'])

const nowTime = ls.getTimePart()
let categoryTypeList = reactive([
    { value: 2, lable: '收入' },
    { value: 3, lable: '支出' },
    // { value: 1, lable: '转账' },
    // { value: 0, lable: '借贷' }
]),
    dateType = reactive([
        { value: 'last7', lable: '最近七天' },
        { value: 'week', lable: '本周' },
    ]),
    countObj = reactive({ inNumber: 0, outNumber: 0 })
const oneTime = new Date().getTime()
let activeType = ref('W'), show = ref(false), isLoading = ref(false),
    yearList = reactive({ data: [] }),
    timeType = reactive([
        { value: 'year', lable: '年' },
        { value: 'mouth', lable: '月' },
        { value: 'more', lable: '更多' }
    ]),
    activeTimeType = ref('mouth'),
    curActive = ref(`${nowTime.M}`),
    csTimeRange = reactive({ data: [oneTime, oneTime] }),
    currentDate = ref(new Date().getTime())

const currentYear = new Date().getFullYear()
let temp = []
for (let i = 0; i < 10; i++) {
    temp.unshift(`${currentYear - i}`)
}
yearList.data = temp

let currentRange = reactive({ data: [] }),
    lineOpt: { series: Array<{ data: Array<{}> }> } = reactive({
        series: [{ data: [] }],
        type: "ring",
        rotate: false,
        rotateLock: false,
        padding: [5, 5, 5, 5],
        dataLabel: true,
        enableScroll: false,
        legend: {
            show: true,
            position: "right",
            lineHeight: 25
        },
        title: {
            name: "总支出",
            fontSize: 15,
            color: "#666666"
        },
        extra: {
            ring: {
                ringWidth: 40,
                activeOpacity: 0.5,
                activeRadius: 10,
                offsetAngle: 0,
                labelWidth: 15,
                border: true,
                borderWidth: 3,
                borderColor: "#FFFFFF",
                linearType: "custom"
            }
        }
    }),
    outCome = reactive({ data: [] }),
    inCome = reactive({ data: [] }),
    activeCategoryType = ref(3),
    showTimeBox = ref(false)

onMounted(() => {
    handleChangeTime(nowTime.M, 'mouth')
    emits('query', { range: currentRange.data })
})

const showDate = computed(() => {
    return `${ls.formatTime(currentRange.data[0], 'YYYY.mm.dd')} - ${ls.formatTime(currentRange.data[1], 'YYYY.mm.dd')}`
})

function handleChangeTime(tt, flag) {
    let timeRange = [], d = null
    switch (flag) {
        case 'year':
            d = new Date(`${tt}-01-01`)
            timeRange = [ls.getStartTime('Y', d), ls.getEndTime('Y', d)]

            break;
        case 'mouth':
            d = new Date(`${nowTime.Y}-${tt}-01`)
            timeRange = [ls.getStartTime('M', d), ls.getEndTime('M', d)]
            break;
        case 'more':
            if (tt === 'last7') {
                timeRange = [ls.getSubTime(null, 'day', 7), ls.getTime()]
            } else if (tt === 'week') {
                timeRange = [ls.getStartTime('W'), ls.getEndTime('W')]
            } else {
                timeRange = []
                show.value = true
                activeType.value = 'other'
            }
            break;
    }
    curActive.value = `${tt}`
    currentRange.data = timeRange
    showTimeBox.value = false
    emits('query', { range: currentRange.data })
}

function handleChangeDate(e, i) {
    csTimeRange.data[i] = e.detail
}

function changeCategoryType(val) {
    activeCategoryType.value = val
    emits('query', { categoryType: val })
}

</script>

<style lang="scss" scoped>
.box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.box-around {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
}

.box-start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
}

.tab-box {
    margin-bottom: 5px;

}

.date-item {
    width: 20%;
    height: 10vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    // background: #eee;
}

.active {
    color: #3cc51f;
}

.param-box {
    justify-content: space-around;
}

.count-box {
    display: flex;
    justify-content: space-around;
    padding: 5px;
    // border: 1px solid #eee;
    border-radius: 10px;
    margin: 5px 10px;
    background: #93c689;
}

.count-item {
    font-size: 16px;
    font-weight: 500;
    // background: #a6e4ff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 5px;
}

.in-item {
    // background: #b9fab6;
}

.out-item {
    // background: #ffb1ad;
}

.model {
    position: relative;
}

.loading-btn {
    position: absolute;
    left: 30%;
    top: 30%;
}

.tab-item {
    padding: 5px;
    // border-radius: 5px;
    background: #eee;
    margin: 10px 0;
    width: 50%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.time-title {
    width: 33%;
}
</style>
