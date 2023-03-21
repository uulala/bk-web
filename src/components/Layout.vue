<template>
    <view
        class="layout-wrapper"
        :style="{
            'background': `url(${bgUrl})`, 'background-size': '100% 100%', 'background-attachment': 'fiexd',
        }"
    >
        <view :style="{ background: 'rgba(255,255,255,0.2)', 'padding-top': topPadding }">
            <view style="height: 25vw;">
                <view class="title">梦想记账本</view>
                <view
                    @click="handleChangeBg"
                    class="change-icon"
                >切换壁纸</view>
                <slot name="header"></slot>
            </view>
            <view :style="{ height: `calc(100vh - 25vw - ${topPadding})`, overflow: 'auto' }">
                <slot></slot>
            </view>

        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue'
import { ls } from '@/plugin/utils'
import http from '@/api/http'


const props = defineProps({
    pageName: String,
    allBg: Array<Object>
})
let bgUrl = ref(ls.get('bgUrl')),
    bgIndex = ref(0),
    topPadding = ref('20px'),
    realBgs = reactive({ data: {} })

const staticBgs = []
for (let i = 1; i < 11; i++) {
    staticBgs.push(`/static/img/bg/${i}.jpg`)
}

watchEffect(() => {
    const tempbgs = props.allBg.map(item => `${http.defaults.baseURL}/${item.url}`)
    realBgs.data = [...tempbgs, ...staticBgs]
    if (!bgUrl.value) {
        bgUrl.value = realBgs.data[0]
        ls.set('bgUrl', bgUrl.value)
    }
})

function handleChangeBg() {
    bgIndex.value++
    if (bgIndex.value > realBgs.data.length) {
        bgIndex.value = 0
    }

    bgUrl.value = realBgs.data[bgIndex.value]
    ls.set('bgUrl', bgUrl.value)
}

wx.getSystemInfo({
    success(res) {
        console.log(res.safeArea)
        topPadding.value = `${res.safeArea.top}px`
    }
})



</script>

<style lang="scss" scoped>
.layout-wrapper {
    position: relative;
    // height: 100vh;
    // overflow: hidden;
}

.change-icon {
    // color: #fff;
    border-radius: 50%;
    font-size: 15px;
    text-align: center;
    position: absolute;
    left: 80vw;
    top: 20vw;
    z-index: 1000;
}

.title {
    font-size: 18px;
    padding: 5px 10px;
    font-weight: 600;
}
</style>