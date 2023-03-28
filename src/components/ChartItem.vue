
<template>
    <view
        class="charts"
        ref="wrapper"
    >
        <canvas
            :canvas-id="chartId"
            :id="chartId"
            type="2d"
            class="charts"
            @touchend="tap"
        ></canvas>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, getCurrentInstance, watch } from 'vue'
import uCharts from '@/static/js/u-charts.min.js';
const props = defineProps({
    chartId: String,
    opt: Object
})

let cWidth = ref(750),
    cHeight = ref(500),
    pixelRatio = ref(2),
    wrapper = ref(null),
    uChartsInstance = reactive({}),
    instance = reactive({})

onMounted(() => {
    //这里的第一个 750 对应 css .charts 的 width
    cWidth.value = 750 / 750 * wx.getSystemInfoSync().windowWidth;
    //这里的 500 对应 css .charts 的 height
    cHeight.value = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    pixelRatio.value = wx.getSystemInfoSync().pixelRatio;
})


watch(() => props.opt, (newValue, oldValue) => {
    console.log('newValue:', newValue)
    drawCharts(props.chartId, JSON.parse(JSON.stringify(newValue)));
}, { deep: true })

onMounted(()=>{
    instance = getCurrentInstance()
})

function drawCharts(id, opt) {
    const query = uni.createSelectorQuery().in(instance)
    query.select('#' + id).fields({ node: true, size: true }).exec(res => {
        if (res[0]) {
            console.log('draw2', id, res[0])
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            canvas.width = res[0].width * pixelRatio.value;
            canvas.height = res[0].height * pixelRatio.value;
            uChartsInstance[id] = new uCharts({
                context: ctx,
                height: cHeight.value * pixelRatio.value,
                pixelRatio: pixelRatio.value,
                width: cWidth.value * pixelRatio.value,
                animation: true,
                background: "#FFFFFF",
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [15, 10, 0, 15],
                ...opt
            });
        } else {
            console.error("[uCharts]: 未获取到 context");
        }
    });
}

function tap(e) {
    uChartsInstance[e.target.id].touchLegend(e);
    uChartsInstance[e.target.id].showToolTip(e);
}
</script>

<style lang="scss" scoped>
.charts {
    width: 750rpx;
    height: 500rpx;
}
</style>

