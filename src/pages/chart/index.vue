<template>
    <view class="content">
        <BkTabs :tabData="tabData">
            <template #a>
                <ByCategory></ByCategory>
            </template>
            <template #b>
                <ByTrand></ByTrand>
            </template>
        </BkTabs>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import BkTabs from '@/components/BkTabs.vue';
import ByCategory from './components/ByCategory.vue';
import ByTrand from './components/ByTrand.vue';

let tabData = reactive([
    {
        value: 'a', label: '类别'
    },
    {
        value: 'b', label: '趋势'
    },
])

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

.tab-box {
    margin-bottom: 5px;

}
</style>
