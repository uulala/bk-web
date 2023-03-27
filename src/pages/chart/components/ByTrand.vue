<template>
    <view class="box">
        <view class="box wait">尽请期待...</view>
    </view>
</template>
  
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ls } from '@/plugin/utils'

</script>
  
<style lang="scss" scoped>
.box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.wait {
    height: 30vh;
}
</style>
  