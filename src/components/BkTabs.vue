<template>
    <view>
        <view class="box tab-wrapper">
            <view
                v-for="item in realData"
                :key="item.value"
                :class="active === item.value ? 'tab-item active' : 'tab-item'"
                @click="() => handleChange(item)"
            >{{ item.label }}</view>
        </view>

        <view
            v-for="item in realData"
            :key="item.value"
        >
            <slot
                :name="item.value"
                v-if="active === item.value"
            ></slot>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const props = defineProps({
    tabData: Array<{}>,
})
const emits = defineEmits(['change'])

let active = ref(props.tabData[0].value),
    realData = reactive(props.tabData)

function handleChange(item) {
    emits('change', item)
    active.value = item.value


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

.tab-wrapper {
    border-bottom: 1px solid #eee;
}

.tab-item {
    padding: 5px 10px;
}

.active {
    color: #3cc51f;
}
</style>
