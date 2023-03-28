<template>
    <view class="content">
        <SearchForm @query="handleQueryChange"></SearchForm>
        <ByCategory :params="params"></ByCategory>
        <ByTrand :params="params"></ByTrand>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import SearchForm from './components/SearchForm.vue';
import ByCategory from './components/ByCategory.vue';
import ByTrand from './components/ByTrand.vue';

let params = reactive({ range: [], categoryType: 3 })

function handleQueryChange(p) {
    console.log('query', p)
    const { range, categoryType } = p
    if (categoryType) {
        params.categoryType = p.categoryType
    } else {
        params.range = p.range
    }
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

.tab-box {
    margin-bottom: 5px;

}
</style>
