<template>
    <view
        class="flow-item"
        :style="{ transform: `translateX(${distance})` }"
        @touchmove="handleMove"
    >
        <view class="box item-content">
            <view>
                <!-- <view class="type-name">
                      <bk-flowData :iconName="iconMap[flowData.categoryId].iconName"></bk-flowData>
                      {{ iconMap[flowData.categoryId].typeName }}
                  </view> -->
                <view>{{ flowData.categoryName }} {{ distance }}</view>
                <view class="create-info">
                    <text class="user">{{ flowData.userName }}</text>
                    <text class="time">{{ flowData.showTime }}</text>
                </view>
            </view>

            <view :class="flowData.categoryType === 2 ? 'in-number count-number' : 'out-number  count-number'">
                {{ flowData.amount }}
            </view>
        </view>
        <view
            class="del-btn box-center"
            @click="handleDel"
        >删除</view>

    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { delFlow } from '@/api/flow'

const props = withDefaults(defineProps<{
    flowData: object
}>(), {})

const emits = defineEmits(['update'])

let distance = ref('0')

let lastOne = 0


function handleDel() {
    console.log(props.flowData)
    delFlow({ uuid: props.flowData.uuid }).then(res => {
        emits('update')
    })
}

function handleMove(ev) {
    const touch = ev.changedTouches[0]
    const pagex = touch.pageX

    if (lastOne > pagex && distance.value === '-50px' || (lastOne < pagex && distance.value === '0')) {
        lastOne = pagex
        return
    }
    

    distance.value = lastOne > pagex ? '-50px' : '0'

    console.log('distance:',distance.value)
    lastOne = pagex
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


.flow-item {
    position: relative;
    display: flex;
    margin-bottom: 5px;
    border-bottom: 1px dashed #fff;
    overflow: auto;
    &::-webkit-scrollbar { width: 0 !important }
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
}

.item-content {
    flex-shrink: 0;
    width: 100vw;
    padding: 5px;
    box-sizing: border-box;
}

.in-number {
    color: rgb(16, 119, 40)
}

.out-number {
    color: rgb(255, 37, 37)
}

.del-btn {
    flex-shrink: 0;
    background: rgb(255, 37, 37);
    width: 50px;
    color: #fff;
}
</style>
