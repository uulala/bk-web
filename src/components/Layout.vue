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
                <slot ></slot>
            </view>
            
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ls } from '@/plugin/utils'

const props = defineProps({
    pageName: String,
})
let bgUrl = ref(ls.get('bgUrl') || '/static/img/bg/1.jpg'),
    bgIndex = ref(1),
    topPadding = ref('20px')

// bgUrl.value = ''

// switch (props.pageName) {
//     case 'index':
//         bgUrl.value = '/static/img/bg/2.jpg'
// }

function handleChangeBg() {
    bgIndex.value += 1
    if (bgIndex.value === 11) {
        bgIndex.value = 1
    }

    bgUrl.value = `/static/img/bg/${bgIndex.value}.jpg`
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