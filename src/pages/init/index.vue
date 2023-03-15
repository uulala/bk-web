<template>
    <view>
        <van-loading
            type="spinner"
            color="#1989fa"
        />
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ls } from '@/plugin/utils'
import { wxLogin, signIn, signUp, signOut, delUser } from '@/api/user'

wxLogin((result) => {
    if (result.code === 1) {
        ls.set('userinfo', result.data)
        // uni.redirectTo({ url: '/pages/index/index' })

        uni.switchTab({
            url: '/pages/index/index'
        })
    }
})


</script>

<style lang="scss" scoped></style>
