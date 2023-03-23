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
                <view class="change-icon-wrapper">
                    <text
                        @click="handleChangeBg(1)"
                        class="icon-btn"
                    >{{ charLt }} </text>
                    <text>切换壁纸</text>
                    <text
                        @click="handleChangeBg(-1)"
                        class="icon-btn"
                    >&gt;</text>
                </view>
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

const props = defineProps({
    pageName: String,
    allBg: Array<Object>
})
let bgUrl = ref(ls.get('bgUrl')),
    bgIndex = ref(0),
    topPadding = ref('20px'),
    realBgs = reactive({ data: {} }),
    charLt = ref('<')


watchEffect(() => {
    const tempbgs = props.allBg.map(item => item.url)
    realBgs.data = [...tempbgs]
    if (!bgUrl.value) {
        bgUrl.value = realBgs.data[0]
        ls.set('bgUrl', bgUrl.value)
    }
    // to del
    // bgUrl.value = ''
})

function handleChangeBg(flag) {
    if (flag === 1) {
        bgIndex.value--
    } else {
        bgIndex.value++
    }

    if (bgIndex.value > realBgs.data.length) {
        bgIndex.value = 0
    } else if (bgIndex.value < 0) {
        bgIndex.value = realBgs.data.length
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

.change-icon-wrapper {
    text-align: center;
    position: absolute;
    right: 0;
    top: 20vw;
    z-index: 1000;
}

.icon-btn {
    padding: 2px 8px;
    font-size: 16px;
    font-weight: 600;
    border: 1px dashed #999;
    border-radius: 5px;
    margin: 0 2px;
}

.title {
    font-size: 18px;
    padding: 5px 10px;
    font-weight: 600;
}</style>