<template>
    <view class="layout">
        <van-loading
            type="spinner"
            color="#1989fa"
        >数据初始化中...</van-loading>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ls } from '@/plugin/utils'
import { wxLogin, signIn, signUp, signOut, delUser } from '@/api/user'

wxLogin((result) => {
    if (result.code === 1) {
        ls.set('userinfo', result.data)

        uni.switchTab({
            url: '/pages/index/index',
            success(res) {
                let pages = getCurrentPages()
                pages[0].$vm.reloadData()
            }
        })
    }
})


</script>

<style lang="scss" scoped>
.layout {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
</style>
