<template>
    <view class="list-wrapper">
        <view
            class="item-wrapper"
            v-for="(item, index) in listData"
            :key="item.id"
        >
            <view
                class="flow-item"
                @touchstart="e => handleStart(e, index)"
                @touchend="e => handleEnd(e, index)"
                :style="`left: ${showBtn && index === currentIndex ? -btnWidth : 0}px`"
            >
                <view class="item-content">
                    <slot :itemData="item"></slot>
                </view>
                <view
                    class="del-btn box-center"
                    @click="handleDel"
                >删除</view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { delFlow } from '@/api/flow'

const props = withDefaults(defineProps<{
    listData: Array<object>
}>(), {})

const emits = defineEmits(['update'])
const btnWidth = 80

let start = ref(0), end = ref(0), showBtn = ref(false), currentIndex = ref(undefined)

function handleDel() {
    console.log(props.flowData)
    delFlow({ uuid: props.flowData.uuid }).then(res => {
        showBtn.value = false
        emits('update')
    })
}

function handleStart(e, i) {
    start.value = e.changedTouches[0].pageX
}

function handleEnd(e, i) {
    end.value = e.changedTouches[0].pageX
    if(showBtn.value && currentIndex.value !== i){
        showBtn.value = false
        return 
    }
    
    currentIndex.value = i
    if (start.value - end.value > btnWidth / 2) {
        showBtn.value = true
    } else if (end.value - start.value > btnWidth / 2) {
        showBtn.value = false
    }
}
</script>

<style lang="scss" scoped>
.box,
.box-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.box-center {
    justify-content: center;
}

.item-wrapper {
    width: 100vw;
    overflow: hidden;
}

.flow-item {
    position: relative;
    display: flex;
    margin-bottom: 5px;
    border-bottom: 1px dashed #fff;
    // overflow: hidden;
}

.item-content {
    flex-shrink: 0;
    width: 100vw;
    padding: 5px;
    box-sizing: border-box;
}

.del-btn {
    flex-shrink: 0;
    background: rgb(255, 37, 37);
    width: 80px;
    color: #fff;
}
</style>
