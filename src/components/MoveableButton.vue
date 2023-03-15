<template>
    <view
        class="moveable-button"
        :style="{ top, left }"
        @touchmove="handleTouch"
    >
        <slot></slot>
    </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

let top = ref('80vh'), left = ref('80vw')
const props = defineProps({
    halfWidth: String
})

function handleTouch(ev) {
    const touch = ev.changedTouches[0]
    left.value = `${touch.pageX - props.halfWidth}px`
    top.value = `${touch.pageY - props.halfWidth}px`
}
</script>

<style lang="scss">
.moveable-button {
    position: absolute;
}
</style>

