<template>
    <view class="content">
        <view
            class="user-box box"
            v-if="!isEdit"
        >
            <image
                class="avatar"
                :src="avatarUrl"
                @click="isEdit = true"
            ></image>
            <text class="nickname">{{ nickName || '微信用户' }}</text>
        </view>
        <view v-else>
            <button
                class="avatar-wrapper"
                open-type="chooseAvatar"
                @chooseavatar="onChooseAvatar"
            >
                <image
                    class="avatar"
                    :src="formData.avatarUrl"
                ></image>
            </button>
            昵称:
            <input
                type="nickname"
                class="weui-input"
                placeholder="请输入昵称"
                v-model="formData.nickName"
            />
            <view @click="handleupdate">保存</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
let avatarUrl = ref('/static/img/avatar.png'),
    isEdit = ref(false),
    nickName = ref('')

let formData = reactive({ avatarUrl, nickName })

function onChooseAvatar(e) {
    formData.avatarUrl = e.detail.avatarUrl
}

function handleupdate() {
    console.log(formData)
}
</script>

<style lang="scss" scoped>
.box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.avatar-wrapper {
    // display: ;
}

.avatar {
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
}

.nickname {
    font-weight: 500;
}
</style>
