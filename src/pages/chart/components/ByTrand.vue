<template>
    <view class="box">
        <chartItem
            chartId="chart2"
            :opt="lineOpt"
        ></chartItem>
    </view>
</template>
  
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ls } from '@/plugin/utils'
import { getflowTrand } from '@/api/flow'
import chartItem from '@/components/chartItem.vue'

const props = defineProps({
    params: Object
})

let currentRange = reactive({ data: [] })

let lineOpt: { categories: Array<String>, series: Array<{ name: String, data: Array<number> }> } = reactive({
    type: "line",
    categories: [],
    series: [],
    enableScroll: false,
    legend: {},
    xAxis: {
        disableGrid: true
    },
    yAxis: {
        gridType: "dash",
        dashLength: 2
    },
    extra: {
        line: {
            type: "straight",
            width: 2,
            activeType: "hollow"
        }
    }
}),
    outCome = reactive({ data: [] }),
    inCome = reactive({ data: [] })


watch(() => props.params.range, (newValue, oldValue) => {
    console.log('trand watch:', newValue)
    currentRange.data = newValue
    getTrandData()
}, { deep: true })

watch(() => props.params.categoryType, (newValue, oldValue) => {
    console.log('categoryy watch2:', newValue)
    changeSource(newValue)
}, { deep: true })


function getTrandData() {
    getflowTrand({
        bookId: ls.get('bookId'),
        startTime: currentRange.data[0],
        endTime: currentRange.data[1]
    }).then(res => {
        const { income, outcome, cc } = res.data
        const jy: Array<number> = []
        income.map((item, index) => {
            jy[index] = item - outcome[index]
            console.log(item, outcome[index] ,jy[index])
        })
        outCome.data = outcome
        inCome.data = income
        console.log(jy)

        lineOpt.categories = cc
        lineOpt.series = [{
            name: "收入",
            data: inCome.data
        },
        {
            name: "支出",
            data: outCome.data
        },
        {
            name: "结余",
            data: jy
        }]
    })
}

</script>
  
<style lang="scss" scoped>
.box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.wait {
    height: 30vh;
}
</style>
  