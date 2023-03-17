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

let top = ref(''), left = ref('')

const props = withDefaults(defineProps<{
    halfWidth: number
    defaultTop: string
    defaultLeft: string
}>(), {
    halfWidth: 20,
    defaultTop: '80vh',
    defaultLeft: '80vw'
})

top.value = props.defaultTop
left.value = props.defaultLeft

function handleTouch(ev) {
    const touch = ev.changedTouches[0]
    left.value = `${touch.pageX - props.halfWidth}px`
    top.value = `${touch.pageY - props.halfWidth}px`
}
</script>

<style lang="scss">
.moveable-button {
    position: absolute;
    z-index: 100;
}
</style>

