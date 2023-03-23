<template>
    <view class="layout">
        <view ></view>
        <view
            v-for="item in allBg.data"
            :key="item.uuid"
            class="list-item-wrapper"
        >
            <image
                mode="aspectFit"
                class="avatar"
                :src="item.url"
            ></image>

            <view
                class="del-btn"
                @click="() => handleDel(item)"
            >删除</view>
        </view>
    </view>
</template>
  
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ls } from '@/plugin/utils'
import { getAvatarByType, delImg } from '@/api/upload'

let allBg = reactive({ data: [] })

function getBgs() {
    getAvatarByType('bg').then(res => {
        allBg.data = res.data
        // bgUrl.value = allBg.data[0].url
    })
}

onMounted(() => {
    getBgs()
})

function handleDel(item) {
    delImg({ uuid: item.uuid }).then(res => {
        if (res.code === 1) {
            wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
            })
            getBgs()
        } else {
            wx.showToast({
                title: '删除失败',
                icon: 'error',
                duration: 1000
            })
        }

    }).catch(err => {
    })
}





</script>
  
<style lang="scss" scoped>
.list-item-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
}

.avatar {
    max-width: 80vw;
    max-height: 20vw;
}

.del-btn {
    padding: 5px;
}
</style>
  