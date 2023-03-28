<template>
    <view class="content">
        <chartItem
            chartId="chart1"
            :opt="lineOpt"
        ></chartItem>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ls } from '@/plugin/utils'
import { getflowTotal } from '@/api/flow'
import chartItem from '@/components/chartItem.vue';

const props = defineProps({
    params: Object
})

let countObj = reactive({ inNumber: 0, outNumber: 0 }),
    currentRange = reactive({ data: [] }),
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
    isLoading = ref(false)

watch(() => props.params.range, (newValue, oldValue) => {
    console.log('categoryy watch:', newValue)
    currentRange.data = newValue
    getFlowData()
}, { deep: true })
watch(() => props.params.categoryType, (newValue, oldValue) => {
    console.log('categoryy watch2:', newValue)
    changeSource(newValue)
}, { deep: true })

function getFlowData() {
    console.log('getFlow', currentRange.data)
    isLoading.value = true
    getflowTotal({
        bookId: ls.get('bookId'),
        startTime: currentRange.data[0],
        endTime: currentRange.data[1]
    }).then(res => {
        console.log(res.data)
        const { all, categorys } = res.data
        isLoading.value = false

        if (all.length === 0) {
            countObj.outNumber = 0
            countObj.inNumber = 0
            lineOpt.series = []
            return
        }

        all.map(item => {
            if (item._id === 3) {
                countObj.outNumber = item.totalAmount
            } else if (item._id === 2) {
                countObj.inNumber = item.totalAmount
            }
        })

        dealData(categorys)
    }).catch(err => {
        isLoading.value = false
    })
}

function dealData(res) {
    const categorys = ls.get('categorys')
    let tempIncome = [], tempOutCome = []

    res.map(item => {
        item.value = item.totalAmount
        const one = categorys.find(it => it.uuid === item._id)
        item.name = one.name
        item.categoryType = one.categoryType

        if (one.categoryType === 3) {
            tempOutCome.push(item)
        } else {
            tempIncome.push(item)
        }
    })

    inCome.data = tempIncome
    outCome.data = tempOutCome
    changeSource(props.params.categoryType)

}

function changeSource(categoryType) {
    if (categoryType === 3) {
        lineOpt.series = [
            {
                data: outCome.data
            }
        ]
        lineOpt.title.name = '总支出'
    } else {
        lineOpt.series = [
            {
                data: inCome.data
            }
        ]
        lineOpt.title.name = '总收入'
    }
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
